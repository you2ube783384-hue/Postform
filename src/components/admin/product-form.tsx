"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowUp, ArrowDown, Star, Eye, ImageOff, Save } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { CATEGORIES, CONDITIONS } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PFButton } from "@/components/pf/button";
import { ConditionBadge } from "@/components/pf/badges";

interface ImageEntry {
  url: string;
  alt: string;
}

interface VariantEntry {
  size: string;
  color: string;
  stock: number;
}

const inputClass =
  "h-11 w-full border-2 border-pf-black bg-pf-paper px-3 text-sm text-pf-black outline-none transition-colors placeholder:text-pf-muted/60 focus:bg-white";

const SIZE_PRESETS: { label: string; sizes: string[] }[] = [
  { label: "APPAREL S–XXL", sizes: ["S", "M", "L", "XL", "XXL"] },
  { label: "WAIST 28–36", sizes: ["28", "30", "32", "34", "36"] },
  { label: "US SHOE 8–11", sizes: ["US 8", "US 9", "US 10", "US 11"] },
];

function FormSection({
  id,
  title,
  hint,
  children,
}: {
  id: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby={id}>
      <div className="flex items-center justify-between border-b-2 border-pf-black bg-pf-black px-5 py-3">
        <h2 id={id} className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
          {title}
        </h2>
        {hint && (
          <span className="font-mono-tech text-[9px] uppercase tracking-widest text-pf-cream/50">{hint}</span>
        )}
      </div>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

export function AdminProductForm({
  product,
  currency = "$",
}: {
  product?: Product;
  currency?: string;
}) {
  const router = useRouter();
  const editing = Boolean(product);

  const [name, setName] = React.useState(product?.name ?? "");
  const [category, setCategory] = React.useState(product?.category ?? "");
  const [brand, setBrand] = React.useState(product?.brand ?? "");
  const [condition, setCondition] = React.useState(product?.condition ?? "NEW");
  const [description, setDescription] = React.useState(product?.description ?? "");
  const [material, setMaterial] = React.useState(product?.material ?? "");
  const [sizeChart, setSizeChart] = React.useState(product?.sizeChart ?? "");
  const [price, setPrice] = React.useState(product ? String(product.price) : "");
  const [originalPrice, setOriginalPrice] = React.useState(product?.originalPrice ? String(product.originalPrice) : "");
  const [images, setImages] = React.useState<ImageEntry[]>(
    product?.images.map((i) => ({ url: i.url, alt: i.alt ?? "" })) ?? []
  );
  const [variants, setVariants] = React.useState<VariantEntry[]>(
    product?.variants.map((v) => ({ size: v.size ?? "", color: v.color ?? "", stock: v.stock })) ?? []
  );
  const [tags, setTags] = React.useState(product?.tags.join(", ") ?? "");
  const [featured, setFeatured] = React.useState(product?.featured ?? false);
  const [active, setActive] = React.useState(product?.active ?? true);
  const [saving, setSaving] = React.useState(false);

  // New image input
  const [newImageUrl, setNewImageUrl] = React.useState("");
  const [newImageAlt, setNewImageAlt] = React.useState("");

  const slugPreview = React.useMemo(() => {
    if (editing && product) return product.slug;
    return name
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, [name, editing, product]);

  const totalStockUnits = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  function addImageUrl() {
    const url = newImageUrl.trim();
    if (!url) return;
    try {
      const u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
    } catch {
      toast.error("INVALID IMAGE URL", { description: "Must be a full http(s) URL." });
      return;
    }
    if (images.some((i) => i.url === url)) {
      toast.error("DUPLICATE URL");
      return;
    }
    setImages((imgs) => [...imgs, { url, alt: newImageAlt.trim() }]);
    setNewImageUrl("");
    setNewImageAlt("");
  }

  function moveImage(index: number, dir: -1 | 1) {
    setImages((imgs) => {
      const next = [...imgs];
      const target = index + dir;
      if (target < 0 || target >= next.length) return imgs;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addPresetSizes(sizes: string[]) {
    setVariants((vs) => {
      const existing = new Set(vs.map((v) => v.size));
      const additions = sizes
        .filter((s) => !existing.has(s))
        .map((s) => ({ size: s, color: "", stock: 0 }));
      return [...vs, ...additions];
    });
  }

  function addVariantRow() {
    setVariants((vs) => [...vs, { size: "", color: "", stock: 0 }]);
  }

  function validate(): boolean {
    if (!name.trim()) {
      toast.error("NAME REQUIRED");
      return false;
    }
    if (!category) {
      toast.error("CATEGORY REQUIRED");
      return false;
    }
    if (price === "" || Number.isNaN(Number(price)) || Number(price) < 0) {
      toast.error("VALID PRICE REQUIRED");
      return false;
    }
    if (images.length === 0) {
      const ok = window.confirm("NO IMAGES ADDED.\n\nPublish without imagery? The card will show a NO IMAGE state.");
      if (!ok) return false;
    }
    if (variants.length === 0) {
      const ok = window.confirm("NO VARIANTS / STOCK ROWS.\n\nA product with no stock shows as SOLD OUT. Continue?");
      if (!ok) return false;
    }
    return true;
  }

  async function save() {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      name: name.trim(),
      category,
      brand: brand.trim() || null,
      condition,
      description: description.trim() || null,
      material: material.trim() || null,
      sizeChart: sizeChart.trim() || null,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      images: images.map((i) => ({ url: i.url, alt: i.alt || null })),
      variants: variants.map((v) => ({
        size: v.size.trim() || null,
        color: v.color.trim() || null,
        stock: Math.max(0, Math.floor(Number(v.stock) || 0)),
      })),
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      featured,
      active,
    };

    try {
      const res = await fetch(
        editing ? `/api/admin/products/${product!.id}` : "/api/admin/products",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const details = data.details ? Object.values(data.details).join(" · ") : "";
        toast.error("SAVE FAILED", { description: details || "Check the form and try again." });
        return;
      }
      toast.success(editing ? "PRODUCT UPDATED" : "PRODUCT CREATED", { description: name });
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("NETWORK ERROR");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-pf-black pb-4">
        <div>
          <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-muted">
            {editing ? "EDITING PRODUCT" : "NEW PRODUCT"}
          </p>
          <h1 className="font-display text-3xl uppercase leading-none text-pf-black sm:text-4xl">
            {editing ? name || "Product" : "Add product"}
          </h1>
          {slugPreview && (
            <p className="mt-1 font-mono-tech text-[11px] tracking-wider text-pf-muted">
              /product/{slugPreview}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <PFButton variant="outline" onClick={() => router.push("/admin/products")}>
            CANCEL
          </PFButton>
          <PFButton variant="primary" onClick={save} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? "SAVING…" : editing ? "SAVE CHANGES" : "PUBLISH PRODUCT"}
          </PFButton>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* BASICS */}
          <FormSection id="sec-basics" title="01. PRODUCT BASICS" hint="NAME + CATEGORY REQUIRED">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                  NAME <span className="text-pf-red">*</span>
                </span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="HEAVYWEIGHT BOXY TEE" />
              </label>
              <label className="block">
                <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                  CATEGORY <span className="text-pf-red">*</span>
                </span>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={cn(inputClass, "cursor-pointer")}>
                  <option value="">- SELECT -</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                  BRAND
                </span>
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass} placeholder="OPTIONAL" />
              </label>
              <label className="block">
                <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                  CONDITION
                </span>
                <select value={condition} onChange={(e) => setCondition(e.target.value)} className={cn(inputClass, "cursor-pointer")}>
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                  MATERIAL / FABRIC
                </span>
                <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} className={inputClass} placeholder="100% COTTON" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                  DESCRIPTION
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border-2 border-pf-black bg-pf-paper p-3 text-sm outline-none placeholder:text-pf-muted/60 focus:bg-white"
                  placeholder="Honest, specific, sells the piece…"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                  SIZE CHART / OPTIONAL
                </span>
                <textarea
                  value={sizeChart}
                  onChange={(e) => setSizeChart(e.target.value)}
                  rows={4}
                  className="w-full border-2 border-pf-black bg-pf-paper p-3 font-mono-tech text-xs outline-none placeholder:text-pf-muted/60 focus:bg-white"
                  placeholder={"SIZE / CHEST / LENGTH\nM / 50cm / 69cm"}
                />
              </label>
            </div>
          </FormSection>

          {/* PRICING */}
          <FormSection id="sec-pricing" title="02. PRICING" hint="SELLING PRICE REQUIRED">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                  SELLING PRICE ({currency}) <span className="text-pf-red">*</span>
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={inputClass}
                  placeholder="45"
                />
              </label>
              <label className="block">
                <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                  ORIGINAL / MRP ({currency}) / OPTIONAL
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className={inputClass}
                  placeholder="65"
                />
              </label>
            </div>
          </FormSection>

          {/* VARIANTS */}
          <FormSection id="sec-variants" title="03. VARIANTS & STOCK" hint={`${totalStockUnits} TOTAL UNITS`}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-muted">
                QUICK ADD:
              </span>
              {SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => addPresetSizes(preset.sizes)}
                  className="border-2 border-pf-black bg-pf-cream px-2.5 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-pf-yellow"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-pf-black font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">
                    <th className="py-2 text-left font-bold">SIZE</th>
                    <th className="py-2 text-left font-bold">COLOUR (OPTIONAL)</th>
                    <th className="py-2 text-left font-bold">STOCK</th>
                    <th className="py-2 text-right font-bold">REMOVE</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => (
                    <tr key={i} className="border-b border-pf-black/15">
                      <td className="py-1.5 pr-2">
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) =>
                            setVariants((vs) => vs.map((x, j) => (j === i ? { ...x, size: e.target.value } : x)))
                          }
                          aria-label={`Variant ${i + 1} size`}
                          className="h-9 w-24 border-2 border-pf-black bg-pf-paper px-2 font-mono-tech text-sm outline-none focus:bg-white"
                          placeholder="M"
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) =>
                            setVariants((vs) => vs.map((x, j) => (j === i ? { ...x, color: e.target.value } : x)))
                          }
                          aria-label={`Variant ${i + 1} colour`}
                          className="h-9 w-36 border-2 border-pf-black bg-pf-paper px-2 font-mono-tech text-sm outline-none focus:bg-white"
                          placeholder="BLACK"
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <input
                          type="number"
                          min={0}
                          value={v.stock}
                          onChange={(e) =>
                            setVariants((vs) => vs.map((x, j) => (j === i ? { ...x, stock: Number(e.target.value) } : x)))
                          }
                          aria-label={`Variant ${i + 1} stock`}
                          className="h-9 w-20 border-2 border-pf-black bg-pf-paper px-2 font-mono-tech text-sm outline-none focus:bg-white"
                        />
                      </td>
                      <td className="py-1.5 text-right">
                        <button
                          type="button"
                          onClick={() => setVariants((vs) => vs.filter((_, j) => j !== i))}
                          aria-label={`Remove variant ${i + 1}`}
                          className="inline-flex h-8 w-8 items-center justify-center border-2 border-pf-black bg-pf-paper transition-colors hover:bg-pf-red hover:text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PFButton size="sm" variant="outline" className="mt-3" onClick={addVariantRow}>
              <Plus className="h-4 w-4" /> Add variant row
            </PFButton>

            <p className="mt-3 text-xs leading-relaxed text-pf-muted">
              Stock is variant-aware: a size with 0 stock shows as visibly unavailable on the storefront
              and cannot be selected. Leave colour blank when a product has a single colour (no meaningless
              selectors are shown).
            </p>
          </FormSection>

          {/* MEDIA */}
          <FormSection id="sec-media" title="04. MEDIA" hint={`${images.length} IMAGE${images.length === 1 ? "" : "S"}  / FIRST IS PRIMARY`}>
            <div className="space-y-3">
              {/* Existing images */}
              {images.map((img, i) => (
                <div key={img.url} className="flex flex-wrap items-center gap-3 border-2 border-pf-black bg-pf-cream p-3">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-pf-black bg-pf-sand">
                    <Image src={img.url} alt={img.alt || "Product image"} fill sizes="64px" className="object-cover" unoptimized />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="truncate font-mono-tech text-[10px] text-pf-muted" title={img.url}>
                      {i === 0 && <span className="mr-1 border border-pf-black bg-pf-yellow px-1 font-bold">PRIMARY</span>}
                      {img.url}
                    </p>
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => setImages((imgs) => imgs.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
                      aria-label={`Alt text for image ${i + 1}`}
                      className="h-8 w-full border-2 border-pf-black bg-pf-paper px-2 text-xs outline-none focus:bg-white"
                      placeholder="ALT TEXT: describe the image"
                    />
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label="Move image up" className="h-8 w-8 border-2 border-pf-black bg-pf-paper disabled:opacity-30 hover:bg-pf-sand">
                      <ArrowUp className="mx-auto h-3.5 w-3.5" strokeWidth={2.5} />
                    </button>
                    <button type="button" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} aria-label="Move image down" className="h-8 w-8 border-2 border-pf-black bg-pf-paper disabled:opacity-30 hover:bg-pf-sand">
                      <ArrowDown className="mx-auto h-3.5 w-3.5" strokeWidth={2.5} />
                    </button>
                    <button type="button" onClick={() => setImages((imgs) => imgs.filter((_, j) => j !== i))} aria-label="Remove image" className="h-8 w-8 border-2 border-pf-black bg-pf-paper hover:bg-pf-red hover:text-white">
                      <Trash2 className="mx-auto h-3.5 w-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add image URL */}
              <div className="flex flex-wrap gap-2 border-2 border-dashed border-pf-black/30 p-3">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                  placeholder="https://…  FULL IMAGE URL"
                  aria-label="New image URL"
                  className="h-10 min-w-0 flex-1 border-2 border-pf-black bg-pf-paper px-2 font-mono-tech text-xs outline-none placeholder:text-pf-muted/60 focus:bg-white"
                />
                <input
                  type="text"
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  placeholder="ALT TEXT"
                  aria-label="New image alt text"
                  className="h-10 w-full border-2 border-pf-black bg-pf-paper px-2 font-mono-tech text-xs outline-none placeholder:text-pf-muted/60 focus:bg-white sm:w-44"
                />
                <PFButton size="sm" onClick={addImageUrl}>
                  <Plus className="h-4 w-4" /> Add image
                </PFButton>
              </div>

              <p className="flex items-start gap-2 text-xs leading-relaxed text-pf-muted">
                <ImageOff className="mt-0.5 h-4 w-4 shrink-0" />
                POSTFORM stores image URLs, not uploads. Host images anywhere reachable (your own
                hosting, CDN or Git-backed assets). URLs are validated; the first image becomes the
                product card&apos;s primary.
              </p>
            </div>
          </FormSection>

          {/* MERCHANDISING */}
          <FormSection id="sec-merch" title="05. MERCHANDISING">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                  TAGS / COMMA SEPARATED
                </span>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="streetwear, cotton, archive" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  aria-pressed={featured}
                  className={cn(
                    "flex items-center gap-3 border-2 border-pf-black p-4 text-left transition-colors",
                    featured ? "bg-pf-yellow" : "bg-pf-cream hover:bg-pf-sand"
                  )}
                >
                  <Star className="h-5 w-5 shrink-0" fill={featured ? "currentColor" : "none"} strokeWidth={2.5} />
                  <span>
                    <span className="block font-mono-tech text-xs font-bold uppercase tracking-widest">
                      FEATURED ON HOMEPAGE
                    </span>
                    <span className="mt-0.5 block text-xs text-pf-muted">
                      {featured ? "Appears in “The Curated Rack”" : "Standard catalogue listing"}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActive(!active)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-center gap-3 border-2 border-pf-black p-4 text-left transition-colors",
                    active ? "bg-pf-black text-pf-cream" : "bg-pf-cream hover:bg-pf-sand"
                  )}
                >
                  <Eye className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                  <span>
                    <span className="block font-mono-tech text-xs font-bold uppercase tracking-widest">
                      {active ? "LIVE ON STOREFRONT" : "HIDDEN FROM STORE"}
                    </span>
                    <span className={cn("mt-0.5 block text-xs", active ? "text-pf-cream/60" : "text-pf-muted")}>
                      {active ? "Visible and purchasable" : "Only visible in admin"}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </FormSection>
        </div>

        {/* PREVIEW - sticky */}
        <aside className="xl:sticky xl:top-6 xl:self-start" aria-label="Storefront preview">
          <div className="border-2 border-pf-black bg-pf-paper">
            <div className="border-b-2 border-pf-black bg-pf-black px-4 py-3">
              <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.25em] text-pf-yellow">
                STOREFRONT PREVIEW
              </p>
            </div>
            <div className="p-4">
              <div className="border-2 border-pf-black bg-pf-cream">
                <div className="relative aspect-[4/5] border-b-2 border-pf-black bg-pf-sand">
                  {images[0] ? (
                    <Image src={images[0].url} alt={images[0].alt || "preview"} fill sizes="320px" className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center pf-stripes font-mono-tech text-[10px] uppercase text-pf-muted">
                      NO IMAGE
                    </div>
                  )}
                  <div className="absolute left-2 top-2">
                    <ConditionBadge condition={condition} />
                  </div>
                </div>
                <div className="p-3">
                  {brand && (
                    <p className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-pf-muted">{brand}</p>
                  )}
                  <p className="text-sm font-bold text-pf-black">{name || "PRODUCT NAME"}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono-tech text-base font-bold">
                      {price !== "" && !Number.isNaN(Number(price)) ? formatPrice(Number(price), currency) : formatPrice(0, currency)}
                    </span>
                    {originalPrice && !Number.isNaN(Number(originalPrice)) && (
                      <span className="font-mono-tech text-xs text-pf-muted line-through">
                        {formatPrice(Number(originalPrice), currency)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono-tech text-[10px] uppercase tracking-wider text-pf-muted">
                    {totalStockUnits > 0 ? `${totalStockUnits} UNITS IN STOCK` : "SOLD OUT"} {active ? "" : "· HIDDEN"}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">
                <p className="flex justify-between">
                  <span>SLUG</span>
                  <span className="truncate pl-2 text-right text-pf-black">{slugPreview || "-"}</span>
                </p>
                <p className="flex justify-between">
                  <span>VARIANTS</span>
                  <span className="text-pf-black">{variants.length}</span>
                </p>
                <p className="flex justify-between">
                  <span>IMAGES</span>
                  <span className="text-pf-black">{images.length}</span>
                </p>
                <p className="flex justify-between">
                  <span>TAGS</span>
                  <span className="text-pf-black">{tags.split(",").filter((t) => t.trim()).length}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-2 border-pf-black bg-pf-paper p-4">
            <p className="font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-red">
              PUBLISH CHECK
            </p>
            <ul className="mt-2 space-y-1.5 text-xs">
              {[
                { ok: Boolean(name.trim()), label: "Name set" },
                { ok: Boolean(category), label: "Category chosen" },
                { ok: price !== "" && !Number.isNaN(Number(price)) && Number(price) >= 0, label: "Price valid" },
                { ok: images.length > 0, label: "At least one image" },
                { ok: variants.length > 0, label: "Variant stock rows" },
                { ok: Boolean(description.trim()), label: "Description written" },
              ].map((check) => (
                <li key={check.label} className="flex items-center gap-2">
                  <span className={cn("inline-flex h-4 w-4 items-center justify-center border border-pf-black text-[10px] font-bold", check.ok ? "bg-pf-yellow" : "bg-pf-paper text-pf-muted")}>
                    {check.ok ? "✓" : "·"}
                  </span>
                  <span className={check.ok ? "text-pf-ink" : "text-pf-muted"}>{check.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
