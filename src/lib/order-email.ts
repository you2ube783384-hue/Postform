// POSTFORM order email generation — mailto: handoff (PRD §22, §42)
// Generated on the client only after checkout data is assembled.

import type { CartItem, SavedAddress, StoreSettings } from "./types";
import { formatPrice } from "./format";

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface OrderData {
  orderId: string;
  date: string;
  customer: OrderCustomer;
  address: SavedAddress;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  note: string;
}

export function buildOrderEmailBody(order: OrderData, settings: StoreSettings): string {
  const lines: string[] = [];

  lines.push("POSTFORM");
  lines.push("NEW ORDER");
  lines.push("");
  lines.push(`ORDER NUMBER: ${order.orderId}`);
  lines.push(`DATE/TIME: ${order.date}`);
  lines.push("");

  lines.push("CUSTOMER");
  lines.push(`- Name: ${order.customer.name}`);
  lines.push(`- Email: ${order.customer.email}`);
  lines.push(`- Phone: ${order.customer.phone}`);
  lines.push("");

  lines.push("DELIVERY ADDRESS");
  lines.push(`- Country: ${order.address.country}`);
  lines.push(`- Address Line 1: ${order.address.line1}`);
  if (order.address.line2) lines.push(`- Address Line 2: ${order.address.line2}`);
  lines.push(`- City: ${order.address.city}`);
  if (order.address.state) lines.push(`- State/Region: ${order.address.state}`);
  lines.push(`- Postal/ZIP Code: ${order.address.postalCode}`);
  lines.push("");

  lines.push("ORDER ITEMS");
  order.items.forEach((item, i) => {
    lines.push(`[${i + 1}] ${item.brand ? item.brand + " — " : ""}${item.name}`);
    lines.push(
      `    Variant: ${[item.size ? `Size ${item.size}` : null, item.color ? `Colour ${item.color}` : null]
        .filter(Boolean)
        .join(" / ") || "Standard"}`
    );
    lines.push(`    Quantity: ${item.qty} x ${formatPrice(item.price, settings.currency)} (unit)`);
    lines.push(`    Line total: ${formatPrice(item.price * item.qty, settings.currency)}`);
  });
  lines.push("");

  lines.push("ORDER TOTAL");
  lines.push(`- Subtotal: ${formatPrice(order.subtotal, settings.currency)}`);
  lines.push(
    `- Shipping: ${order.shipping === 0 ? "FREE" : formatPrice(order.shipping, settings.currency)}`
  );
  lines.push(`- TOTAL: ${formatPrice(order.total, settings.currency)}`);
  lines.push(`- Payment method: ${order.paymentMethod}`);
  lines.push("");

  lines.push("CUSTOMER NOTE");
  lines.push(order.note.trim() ? order.note.trim() : "(none)");
  lines.push("");

  return lines.join("\n");
}

export interface GeneratedOrderEmail {
  subject: string;
  body: string;
  mailtoUrl: string;
  tooLong: boolean; // exceeds safe mailto length — offer copy fallback
}

const SAFE_MAILTO_LENGTH = 1900;

export function buildMailtoUrl(body: string, orderId: string, recipient: string): GeneratedOrderEmail {
  const subject = `POSTFORM Order #${orderId.split("-")[1]} — New Order`;
  const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return {
    subject,
    body,
    mailtoUrl,
    tooLong: mailtoUrl.length > SAFE_MAILTO_LENGTH,
  };
}

export function formatOrderDate(): string {
  return new Date().toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}
