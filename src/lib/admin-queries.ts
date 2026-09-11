import { db } from "./db";
import type { Product } from "./types";

function toProduct(
  p: {
    id: string;
    slug: string;
    name: string;
    category: string;
    brand: string | null;
    price: number;
    originalPrice: number | null;
    condition: string;
    description: string | null;
    material: string | null;
    sizeChart: string | null;
    tags: string | null;
    featured: boolean;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    images: { id: string; url: string; alt: string | null; sortOrder: number }[];
    variants: { id: string; size: string | null; color: string | null; stock: number }[];
  }
): Product {
  return {
    ...p,
    tags: p.tags ? safeParse(p.tags) : [],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    images: [...p.images].sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

function safeParse(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function getProductsAdmin(): Promise<Product[]> {
  const rows = await db.product.findMany({
    include: { images: true, variants: true },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(toProduct);
}

export async function getProductAdmin(id: string): Promise<Product | null> {
  const row = await db.product.findUnique({
    where: { id },
    include: { images: true, variants: true },
  });
  return row ? toProduct(row) : null;
}
