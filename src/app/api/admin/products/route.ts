import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseTags } from "@/lib/format";
import type { Prisma } from "@prisma/client";

// POST /api/admin/products — create a product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors = validateProduct(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "VALIDATION", details: errors }, { status: 400 });
    }

    const slug = await ensureUniqueSlug(body.slug || slugify(body.name));

    const product = await db.product.create({
      data: {
        slug,
        name: body.name.trim(),
        category: body.category,
        brand: body.brand?.trim() || null,
        price: Number(body.price),
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        condition: body.condition || "NEW",
        description: body.description?.trim() || null,
        material: body.material?.trim() || null,
        sizeChart: body.sizeChart?.trim() || null,
        tags: Array.isArray(body.tags) && body.tags.length ? JSON.stringify(body.tags) : null,
        featured: Boolean(body.featured),
        active: body.active === undefined ? true : Boolean(body.active),
        images: {
          create: (body.images ?? []).map((img: { url: string; alt?: string }, i: number) => ({
            url: img.url,
            alt: img.alt || null,
            sortOrder: i,
          })),
        },
        variants: {
          create: (body.variants ?? []).map((v: { size?: string; color?: string; stock: number }) => ({
            size: v.size || null,
            color: v.color || null,
            stock: Math.max(0, Math.floor(Number(v.stock) || 0)),
          })),
        },
      },
      include: { images: true, variants: true },
    });

    return NextResponse.json(
      { product: { ...product, tags: parseTags(product.tags) } },
      { status: 201 }
    );
  } catch (e) {
    console.error("admin create product:", e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 1;
  // Collision protection for readable slugs
  while (await db.product.findFirst({ where: { slug } })) {
    slug = `${base}-${++i}`;
  }
  return slug;
}

function validateProduct(body: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!body.name || !String(body.name).trim()) errors.name = "REQUIRED";
  if (!body.category) errors.category = "REQUIRED";
  if (body.price === undefined || body.price === null || Number.isNaN(Number(body.price)) || Number(body.price) < 0)
    errors.price = "INVALID PRICE";
  if (body.originalPrice && (Number.isNaN(Number(body.originalPrice)) || Number(body.originalPrice) < 0))
    errors.originalPrice = "INVALID PRICE";
  if (body.images && !Array.isArray(body.images)) errors.images = "INVALID";
  if (body.images && Array.isArray(body.images)) {
    for (const img of body.images) {
      if (!isValidUrl(img.url)) {
        errors.images = `INVALID IMAGE URL: ${String(img.url).slice(0, 60)}`;
        break;
      }
    }
  }
  // Variants: must be an array of objects with non-negative integer stock
  if (body.variants !== undefined && body.variants !== null) {
    if (!Array.isArray(body.variants)) {
      errors.variants = "INVALID";
    } else {
      for (const v of body.variants) {
        if (v === null || typeof v !== "object") {
          errors.variants = "INVALID";
          break;
        }
        const stock = Number((v as Record<string, unknown>).stock);
        if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
          errors.variants = "INVALID STOCK";
          break;
        }
      }
    }
  }
  return errors;
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// GET /api/admin/products — list all products (incl. inactive)
export async function GET() {
  try {
    const products = await db.product.findMany({
      include: { images: true, variants: true },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({
      products: products.map((p) => ({ ...p, tags: parseTags(p.tags) })),
    });
  } catch {
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
