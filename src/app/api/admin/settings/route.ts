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

    // Reject invalid enum values instead of silently ignoring them,
    // so clients get explicit feedback about bad input.
    if (body.shippingMode !== undefined) {
      if (body.shippingMode !== "free" && body.shippingMode !== "flat") {
        return NextResponse.json({ error: "INVALID_SHIPPING_MODE" }, { status: 400 });
      }
      entries.push({ key: "shipping_mode", value: body.shippingMode });
    }
    if (body.shippingFee !== undefined) {
      const fee = Number(body.shippingFee);
      if (Number.isNaN(fee) || fee < 0) {
        return NextResponse.json({ error: "INVALID_SHIPPING_FEE" }, { status: 400 });
      }
      entries.push({ key: "shipping_fee", value: String(fee) });
    }
    if (body.currency !== undefined) {
      if (typeof body.currency !== "string" || !/^[A-Za-z]{3}$/.test(body.currency.trim())) {
        // Reject wrong-length, non-alphabetic, and empty values explicitly
        return NextResponse.json({ error: "INVALID_CURRENCY" }, { status: 400 });
      }
      entries.push({ key: "currency", value: body.currency.trim().toUpperCase() });
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
