import type { Product, ProductVariant } from "./types";

export function formatPrice(value: number, currency = "$"): string {
  const formatted = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
  return `${currency}${formatted}`;
}

interface StockCarrier {
  variants: { stock: number }[];
}

export function totalStock(product: StockCarrier): number {
  if (product.variants.length === 0) return 0;
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export function inStock(product: StockCarrier): boolean {
  return totalStock(product) > 0;
}

export function availableSizes(product: Product): { size: string; stock: number; available: boolean }[] {
  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))] as string[];
  return sizes.map((size) => {
    const stock = product.variants
      .filter((v) => v.size === size)
      .reduce((sum, v) => sum + v.stock, 0);
    return { size, stock, available: stock > 0 };
  });
}

export function availableColors(product: Product): { color: string; stock: number; available: boolean }[] {
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))] as string[];
  return colors.map((color) => {
    const stock = product.variants
      .filter((v) => v.color === color)
      .reduce((sum, v) => sum + v.stock, 0);
    return { color, stock, available: stock > 0 };
  });
}

export function variantStockFor(product: Product, size: string | null, color: string | null): number {
  return product.variants
    .filter(
      (v) =>
        (size === null || v.size === size) &&
        (color === null || v.color === color)
    )
    .reduce((sum, v) => sum + v.stock, 0);
}

export function primaryImage(product: Product): string | null {
  if (product.images.length === 0) return null;
  const sorted = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  return sorted[0].url;
}

export function conditionBadgeClass(condition: string): string {
  switch (condition) {
    case "NEW":
      return "bg-pf-yellow text-pf-black";
    case "LIKE NEW":
      return "bg-pf-purple-soft text-pf-purple";
    case "EXCELLENT":
      return "bg-pf-paper text-pf-black";
    case "VINTAGE":
      return "bg-pf-sand text-pf-black";
    case "USED":
      return "bg-pf-sand text-pf-muted";
    default:
      return "bg-pf-paper text-pf-muted";
  }
}

export function stockState(product: Product): "IN STOCK" | `LOW STOCK: ${number}` | "SOLD OUT" {
  const s = totalStock(product);
  if (s === 0) return "SOLD OUT";
  if (s <= 2) return `LOW STOCK: ${s}`;
  return "IN STOCK";
}

export function generateOrderId(): string {
  return `POSTFORM-${Math.floor(1000 + Math.random() * 9000)}`;
}
