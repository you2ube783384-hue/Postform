// POSTFORM shared types

export const CONDITIONS = [
  "NEW",
  "LIKE NEW",
  "EXCELLENT",
  "USED",
  "VINTAGE",
  "OTHER",
] as const;
export type Condition = (typeof CONDITIONS)[number];

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  size: string | null;
  color: string | null;
  stock: number;
}

export interface Product {
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
  tags: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CategoryDef {
  slug: string;
  name: string;
  short: string;
}

export const CATEGORIES: CategoryDef[] = [
  { slug: "t-shirts", name: "T-Shirts", short: "TEES" },
  { slug: "oversized-t-shirts", name: "Oversized T-Shirts", short: "OVERSIZED" },
  { slug: "shirts", name: "Shirts", short: "SHIRTS" },
  { slug: "hoodies", name: "Hoodies", short: "HOODIES" },
  { slug: "pants", name: "Pants", short: "PANTS" },
  { slug: "jeans", name: "Jeans", short: "JEANS" },
  { slug: "sneakers", name: "Sneakers", short: "SNEAKERS" },
  { slug: "accessories", name: "Accessories", short: "ACCESSORIES" },
];

export function categoryFromSlug(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const SORT_OPTIONS = [
  { value: "newest", label: "NEWEST" },
  { value: "price-asc", label: "PRICE: LOW TO HIGH" },
  { value: "price-desc", label: "PRICE: HIGH TO LOW" },
  { value: "az", label: "A-Z" },
] as const;

export interface ShopFilters {
  category?: string;
  q?: string;
  brands?: string[];
  sizes?: string[];
  colors?: string[];
  conditions?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
}

export interface FilterOptions {
  brands: { value: string; count: number }[];
  sizes: { value: string; count: number }[];
  colors: { value: string; count: number }[];
  conditions: { value: string; count: number }[];
  priceRange: { min: number; max: number };
}

// ---- Local profile ----

export interface SavedAddress {
  id: string;
  label: string; // Home / Work / Other
  country: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  isDefault: boolean;
}

export interface LocalProfile {
  name: string;
  email: string;
  phone: string;
  addresses: SavedAddress[];
}

// ---- Cart ----

export interface CartItem {
  key: string; // productId::size::color
  productId: string;
  slug: string;
  name: string;
  brand: string | null;
  image: string | null;
  price: number;
  size: string | null;
  color: string | null;
  variantId: string | null;
  qty: number;
  maxStock: number;
}

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  brand: string | null;
  image: string | null;
  price: number;
  condition: string;
  addedAt: string;
}

// ---- Settings ----

export interface StoreSettings {
  shippingMode: "free" | "flat";
  shippingFee: number;
  currency: string;
  storeEmail: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  shippingMode: "free",
  shippingFee: 0,
  currency: "$",
  storeEmail: "postformproducts@haren.uk",
};
