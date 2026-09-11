import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/queries";

// GET /api/admin/settings
export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

// PUT /api/admin/settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const entries: { key: string; value: string }[] = [];

    if (body.shippingMode === "free" || body.shippingMode === "flat") {
      entries.push({ key: "shipping_mode", value: body.shippingMode });
    }
    if (body.shippingFee !== undefined) {
      const fee = Number(body.shippingFee);
      if (Number.isNaN(fee) || fee < 0) {
        return NextResponse.json({ error: "INVALID_SHIPPING_FEE" }, { status: 400 });
      }
      entries.push({ key: "shipping_fee", value: String(fee) });
    }
    if (typeof body.currency === "string" && body.currency.trim()) {
      entries.push({ key: "currency", value: body.currency.trim().slice(0, 3) });
    }
    if (typeof body.storeEmail === "string" && body.storeEmail.trim()) {
      entries.push({ key: "store_email", value: body.storeEmail.trim() });
    }

    for (const { key, value } of entries) {
      await db.storeSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    const settings = await getSettings();
    return NextResponse.json({ settings });
  } catch (e) {
    console.error("admin settings:", e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
