import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseTags } from "@/lib/format";

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// GET /api/admin/products/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: { images: true, variants: true },
    });
    if (!product) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    return NextResponse.json({ product: { ...product, tags: parseTags(product.tags) } });
  } catch {
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

// PUT /api/admin/products/[id] — full update (replaces images + variants)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    const errors: Record<string, string> = {};
    if (!body.name || !String(body.name).trim()) errors.name = "REQUIRED";
    if (!body.category) errors.category = "REQUIRED";
    if (body.price === undefined || Number.isNaN(Number(body.price)) || Number(body.price) < 0)
      errors.price = "INVALID PRICE";
    if (Array.isArray(body.images)) {
      for (const img of body.images) {
        if (!isValidUrl(img.url)) {
          errors.images = `INVALID IMAGE URL: ${String(img.url).slice(0, 60)}`;
          break;
        }
      }
    }
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "VALIDATION", details: errors }, { status: 400 });
    }

    // Slug change: reject explicit conflicts instead of silently mutating
    // the requested slug (clients should get feedback, not a surprise slug).
    // (POST /products still auto-uniquifies, which is the CMS-style default
    // for creation; updates are explicit.)
    let slug = existing.slug;
    if (body.slug && body.slug !== existing.slug) {
      slug = body.slug
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      if (!slug) {
        return NextResponse.json(
          { error: "VALIDATION", details: { slug: "INVALID" } },
          { status: 400 }
        );
      }
      const conflict = await db.product.findFirst({ where: { slug, id: { not: id } } });
      if (conflict) {
        return NextResponse.json(
          { error: "VALIDATION", details: { slug: "DUPLICATE" } },
          { status: 400 }
        );
      }
    }

    // Replace images and variants atomically
    await db.$transaction([
      db.productImage.deleteMany({ where: { productId: id } }),
      db.productVariant.deleteMany({ where: { productId: id } }),
      db.product.update({
        where: { id },
        data: {
          slug,
          name: String(body.name).trim(),
          category: body.category,
          brand: body.brand?.trim() || null,
          price: Number(body.price),
          originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
          condition: body.condition || "NEW",
          description: body.description?.trim() || null,
          material: body.material?.trim() || null,
          sizeChart: body.sizeChart?.trim() || null,
          tags:
            Array.isArray(body.tags) && body.tags.length
              ? JSON.stringify(body.tags.map(String))
              : null,
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
      }),
    ]);

    const product = await db.product.findUnique({
      where: { id },
      include: { images: true, variants: true },
    });
    return NextResponse.json({ product: { ...product, tags: parseTags(product.tags) } });
  } catch (e) {
    console.error("admin update product:", e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

// PATCH /api/admin/products/[id] — quick toggles (featured/active)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const data: { featured?: boolean; active?: boolean } = {};
    if (typeof body.featured === "boolean") data.featured = body.featured;
    if (typeof body.active === "boolean") data.active = body.active;
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "NOTHING_TO_UPDATE" }, { status: 400 });
    }
    const product = await db.product.update({
      where: { id },
      data,
      include: { images: true, variants: true },
    });
    return NextResponse.json({ product: { ...product, tags: parseTags(product.tags) } });
  } catch {
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
