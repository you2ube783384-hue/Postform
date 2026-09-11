import { db } from "./db";
import type { Product, ShopFilters, FilterOptions, StoreSettings } from "./types";
import { DEFAULT_SETTINGS } from "./types";
import type { Prisma } from "@prisma/client";

function toProduct(
  p: Prisma.ProductGetPayload<{ include: { images: true; variants: true } }>
): Product {
  return {
    ...p,
    tags: p.tags ? safeParseTags(p.tags) : [],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    images: [...p.images].sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

function safeParseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function getProducts(filters: ShopFilters): Promise<{
  items: Product[];
  total: number;
  page: number;
  pageCount: number;
}> {
  const page = filters.page ?? 1;
  const perPage = 12;

  const where: Prisma.ProductWhereInput = { active: true };

  if (filters.category) {
    where.category = { equals: filters.category };
  }

  if (filters.q) {
    const q = filters.q.trim();
    where.OR = [
      { name: { contains: q } },
      { brand: { contains: q } },
      { category: { contains: q } },
      { tags: { contains: q } },
      { description: { contains: q } },
    ];
  }

  if (filters.brands?.length) {
    where.brand = { in: filters.brands };
  }

  if (filters.conditions?.length) {
    where.condition = { in: filters.conditions };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  // Variant-based filters (sizes / colors) need sub-queries
  if (filters.sizes?.length || filters.colors?.length) {
    const variantSome: Prisma.ProductVariantWhereInput[] = [];
    if (filters.sizes?.length) {
      variantSome.push({ size: { in: filters.sizes } });
    }
    if (filters.colors?.length) {
      variantSome.push({ color: { in: filters.colors } });
    }
    // AND of OR groups: matches any selected size AND any selected color
    where.AND = variantSome.map((s) => ({ variants: { some: s } }));
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price-asc"
      ? { price: "asc" }
      : filters.sort === "price-desc"
        ? { price: "desc" }
        : filters.sort === "az"
          ? { name: "asc" }
          : { createdAt: "desc" };

  const [rows, total] = await db.$transaction([
    db.product.findMany({
      where,
      include: { images: true, variants: true },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.product.count({ where }),
  ]);

  return {
    items: rows.map(toProduct),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await db.product.findFirst({
    where: { slug, active: true },
    include: { images: true, variants: true },
  });
  return row ? toProduct(row) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await db.product.findUnique({
    where: { id },
    include: { images: true, variants: true },
  });
  return row ? toProduct(row) : null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { active: true, featured: true },
    include: { images: true, variants: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return rows.map(toProduct);
}

export async function getNewestProducts(limit = 8): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { active: true },
    include: { images: true, variants: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toProduct);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { active: true, category: product.category, id: { not: product.id } },
    include: { images: true, variants: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  if (rows.length >= limit) return rows.map(toProduct);
  // Top up from other categories
  const extra = await db.product.findMany({
    where: { active: true, id: { not: product.id } },
    include: { images: true, variants: true },
    orderBy: { createdAt: "desc" },
    take: limit - rows.length + 2,
  });
  const seen = new Set(rows.map((r) => r.id));
  const merged = [...rows, ...extra.filter((e) => !seen.has(e.id))].slice(0, limit);
  return merged.map(toProduct);
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const rows = await db.product.groupBy({
    by: ["category"],
    where: { active: true },
    _count: { _all: true },
  });
  const map: Record<string, number> = {};
  for (const row of rows) map[row.category] = row._count._all;
  return map;
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const products = await db.product.findMany({
    where: { active: true },
    include: { variants: true },
  });

  const brands = new Map<string, number>();
  const sizes = new Map<string, number>();
  const colors = new Map<string, number>();
  const conditions = new Map<string, number>();
  let min = Infinity;
  let max = 0;

  for (const p of products) {
    if (p.brand) brands.set(p.brand, (brands.get(p.brand) ?? 0) + 1);
    conditions.set(p.condition, (conditions.get(p.condition) ?? 0) + 1);
    min = Math.min(min, p.price);
    max = Math.max(max, p.price);
    for (const v of p.variants) {
      if (v.size) sizes.set(v.size, (sizes.get(v.size) ?? 0) + 1);
      if (v.color) colors.set(v.color, (colors.get(v.color) ?? 0) + 1);
    }
  }

  return {
    brands: [...brands.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, count })),
    sizes: [...sizes.entries()].map(([value, count]) => ({ value, count })),
    colors: [...colors.entries()].map(([value, count]) => ({ value, count })),
    conditions: [...conditions.entries()].map(([value, count]) => ({ value, count })),
    priceRange: {
      min: products.length ? Math.floor(min) : 0,
      max: products.length ? Math.ceil(max) : 500,
    },
  };
}

export async function getSettings(): Promise<StoreSettings> {
  try {
    const rows = await db.storeSetting.findMany();
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    return {
      shippingMode: (map["shipping_mode"] as StoreSettings["shippingMode"]) ?? DEFAULT_SETTINGS.shippingMode,
      shippingFee: map["shipping_fee"] ? Number(map["shipping_fee"]) : DEFAULT_SETTINGS.shippingFee,
      currency: map["currency"] ?? DEFAULT_SETTINGS.currency,
      storeEmail: map["store_email"] ?? process.env.NEXT_PUBLIC_STORE_EMAIL ?? DEFAULT_SETTINGS.storeEmail,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
