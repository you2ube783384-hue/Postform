#!/usr/bin/env bun
/** Seed POSTFORM catalog into Turso */
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const prisma = new PrismaClient({
  adapter: new PrismaLibSQL({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  }),
});

const S = (n: number) => Array.from({ length: n }, (_, i) => String.fromCharCode(97 + i)).join("");

interface SeedProduct {
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  condition: string;
  description: string;
  material: string;
  sizeChart?: string;
  tags: string[];
  featured: boolean;
  images: { url: string; alt: string }[];
  variants: { size: string; color: string; stock: number }[];
}

const APPAREL_CHART = `SIZE — CHEST — LENGTH — SHOULDER
S — 46cm — 66cm — 42cm
M — 50cm — 69cm — 44cm
L — 54cm — 72cm — 46cm
XL — 58cm — 74cm — 48cm
XXL — 62cm — 76cm — 50cm`;

const PANTS_CHART = `SIZE — WAIST — INSEAM — LEG OPENING
28 — 73cm — 76cm — 19cm
30 — 78cm — 78cm — 20cm
32 — 83cm — 79cm — 21cm
34 — 88cm — 80cm — 22cm
36 — 93cm — 80cm — 23cm`;

const SHOE_CHART = `US — UK — EU — CM
8 — 7.5 — 41 — 26
9 — 8 — 42.5 — 27
10 — 9 — 44 — 28
11 — 10 — 45 — 29`;

const products: SeedProduct[] = [
  {
    slug: "defaced-backprint-tee",
    name: "Defaced Backprint Tee",
    category: "T-Shirts",
    brand: "Stüssy",
    price: 45,
    originalPrice: 65,
    condition: "EXCELLENT",
    description:
      " archive find. Heavy single-stitch construction with a cracked backprint that only decades of wear can produce. No holes, no stains, collar intact. The kind of piece that makes an outfit look considered without trying.",
    material: "100% cotton, single-stitch",
    sizeChart: APPAREL_CHART,
    tags: ["graphic", "streetwear", "y2k", "archive"],
    featured: true,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5e7dbaf19e95.png", alt: "Stüssy Defaced Backprint Tee front view" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/874a7f62708f.jpg", alt: "Defaced Backprint Tee back print detail" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bf3a3e3ce0a5.jpeg", alt: "Defaced Backprint Tee worn" },
    ],
    variants: [
      { size: "S", color: "White", stock: 0 },
      { size: "M", color: "White", stock: 2 },
      { size: "L", color: "White", stock: 3 },
      { size: "XL", color: "White", stock: 2 },
      { size: "XXL", color: "White", stock: 1 },
    ],
  },
  {
    slug: "heavyweight-boxy-tee-jet-black",
    name: "Heavyweight Boxy Tee",
    category: "T-Shirts",
    brand: "Hanes",
    price: 24,
    condition: "NEW",
    description:
      "Deadstock heavyweight cotton in a boxy cut that sits square on the shoulders. Dense 220gsm knit holds its shape wash after wash. The uniform of every serious wardrobe — buy two.",
    material: "100% cotton, 220gsm",
    sizeChart: APPAREL_CHART,
    tags: ["basics", "cotton", "boxy"],
    featured: false,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ecfec6ea5e52.webp", alt: "Heavyweight Boxy Tee in jet black" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/07b936b5255e.jpg", alt: "Boxy Tee fit detail" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a367b8a8aa41.png", alt: "Boxy Tee worn on model" },
    ],
    variants: [
      { size: "S", color: "Black", stock: 4 },
      { size: "M", color: "Black", stock: 6 },
      { size: "L", color: "Black", stock: 8 },
      { size: "XL", color: "Black", stock: 5 },
      { size: "XXL", color: "Black", stock: 3 },
    ],
  },
  {
    slug: "drop-shoulder-oversized-tee-cream",
    name: "Drop-Shoulder Oversized Tee",
    category: "Oversized T-Shirts",
    brand: "Bella+Canvas",
    price: 32,
    originalPrice: 40,
    condition: "NEW",
    description:
      "The silhouette that defines the current era — extended shoulders, wide body, cropped-ish length. Cut in soft combed cotton with a cream tone that works with everything from denim to cargo.",
    material: "100% combed cotton",
    sizeChart: APPAREL_CHART,
    tags: ["oversized", "essential", "drop-shoulder"],
    featured: true,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/978ff8199089.jpg", alt: "Drop-Shoulder Oversized Tee in cream" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a6462d31289c.jpg", alt: "Oversized Tee drop shoulder detail" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8e8df277ebf9.jpg", alt: "Oversized Tee styled" },
    ],
    variants: [
      { size: "S", color: "Cream", stock: 3 },
      { size: "M", color: "Cream", stock: 5 },
      { size: "L", color: "Cream", stock: 5 },
      { size: "XL", color: "Cream", stock: 4 },
    ],
  },
  {
    slug: "buffalo-check-flannel-brown",
    name: "Buffalo Check Flannel",
    category: "Shirts",
    brand: "Dickies",
    price: 52,
    condition: "USED",
    description:
      "Broken-in buffalo check flannel in brown and black. Softened from real wear, slight fade at the elbows, all buttons present and functional. Wear it open over a tee or buttoned under a hoodie.",
    material: "100% brushed cotton flannel",
    sizeChart: APPAREL_CHART,
    tags: ["flannel", "grunge", "layering", "workwear"],
    featured: false,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b7524f68c1bb.jpg", alt: "Buffalo Check Flannel in brown" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/281aa07ef1c1.jpg", alt: "Flannel check pattern detail" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/86f6ea711e55.jpg", alt: "Flannel worn open over tee" },
    ],
    variants: [
      { size: "S", color: "Brown", stock: 1 },
      { size: "M", color: "Brown", stock: 2 },
      { size: "L", color: "Brown", stock: 2 },
      { size: "XL", color: "Brown", stock: 1 },
    ],
  },
  {
    slug: "relaxed-linen-overshirt-sand",
    name: "Relaxed Linen Overshirt",
    category: "Shirts",
    brand: "Uniqlo",
    price: 38,
    condition: "LIKE NEW",
    description:
      "Breathable linen-blend overshirt in a relaxed camp fit. Barely worn — no marks, no fading. Works as a light jacket in summer and a middle layer the rest of the year.",
    material: "55% linen, 45% rayon",
    sizeChart: APPAREL_CHART,
    tags: ["overshirt", "linen", "summer"],
    featured: false,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6ea946c7202c.jpg", alt: "Relaxed Linen Overshirt in sand" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2ff9d5cf6012.jpg", alt: "Linen Overshirt texture detail" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cd30ce58daf5.jpg", alt: "Linen Overshirt worn" },
    ],
    variants: [
      { size: "S", color: "Sand", stock: 2 },
      { size: "M", color: "Sand", stock: 3 },
      { size: "L", color: "Sand", stock: 3 },
      { size: "XL", color: "Sand", stock: 2 },
    ],
  },
  {
    slug: "heavyweight-pullover-hoodie-black",
    name: "Heavyweight Pullover Hoodie",
    category: "Hoodies",
    brand: "Champion",
    price: 68,
    originalPrice: 90,
    condition: "EXCELLENT",
    description:
      "Reverse weave construction that fights shrinkage and puckering. Dense fleece, double-lined hood, ribbed side gussets. A genuine cold-weather staple that outlives trends.",
    material: "82% cotton, 18% polyester reverse weave fleece",
    sizeChart: APPAREL_CHART,
    tags: ["hoodie", "reverse weave", "winter", "fleece"],
    featured: true,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/da3be1d5fd44.png", alt: "Heavyweight Pullover Hoodie in black" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/57194111f0b4.jpeg", alt: "Hoodie hood and drawcord detail" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6c945fbbbc36.jpg", alt: "Hoodie worn on model" },
    ],
    variants: [
      { size: "S", color: "Black", stock: 1 },
      { size: "M", color: "Black", stock: 2 },
      { size: "L", color: "Black", stock: 3 },
      { size: "XL", color: "Black", stock: 2 },
    ],
  },
  {
    slug: "utility-cargo-pant-olive",
    name: "Utility Cargo Pant",
    category: "Pants",
    brand: "Dickies",
    price: 58,
    condition: "NEW",
    description:
      "Straight-leg utility pant with bellowed cargo pockets and a durable twill that softens with wear. Olive is the one colour that makes every top in your rotation work harder.",
    material: "65% polyester, 35% cotton twill",
    sizeChart: PANTS_CHART,
    tags: ["cargo", "utility", "workwear", "olive"],
    featured: true,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1554a2a7349f.jpg", alt: "Utility Cargo Pant in olive" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1022b184feb5.jpeg", alt: "Cargo pocket detail" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1854044add79.jpeg", alt: "Cargo Pant full length" },
    ],
    variants: [
      { size: "28", color: "Olive", stock: 2 },
      { size: "30", color: "Olive", stock: 3 },
      { size: "32", color: "Olive", stock: 4 },
      { size: "34", color: "Olive", stock: 3 },
      { size: "36", color: "Olive", stock: 1 },
    ],
  },
  {
    slug: "loose-fit-denim-jean-indigo",
    name: "Loose-Fit Denim Jean",
    category: "Jeans",
    brand: "Levi's",
    price: 72,
    originalPrice: 95,
    condition: "LIKE NEW",
    description:
      "Loose straight denim with a mid-blue wash that has already started breaking in at the knees. No rips, no repairs. The leg shape that anchors every good streetwear fit.",
    material: "100% cotton denim, 13oz",
    sizeChart: PANTS_CHART,
    tags: ["denim", "baggy", "90s", "loose"],
    featured: false,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/14746b24ded7.jpg", alt: "Loose-Fit Denim Jean in indigo" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/76102979e912.jpg", alt: "Denim wash detail" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bd7a5d59ebc9.jpg", alt: "Loose-fit denim worn" },
    ],
    variants: [
      { size: "28", color: "Indigo", stock: 1 },
      { size: "30", color: "Indigo", stock: 2 },
      { size: "32", color: "Indigo", stock: 3 },
      { size: "34", color: "Indigo", stock: 2 },
    ],
  },
  {
    slug: "essential-jogger-sweatpant-grey",
    name: "Essential Jogger Sweatpant",
    category: "Pants",
    brand: "Nike",
    price: 48,
    condition: "NEW",
    description:
      "Standard-issue fleece jogger with tapered leg, zip pockets and elastic cuffs. Grey melange pairs with anything black, anything cream and every sneaker you own.",
    material: "80% cotton, 20% polyester fleece",
    sizeChart: APPAREL_CHART,
    tags: ["jogger", "fleece", "grey", "sweatpant"],
    featured: false,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6186fb163c71.jpg", alt: "Essential Jogger Sweatpant in grey" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6eceef5a620d.jpg", alt: "Jogger cuff and pocket detail" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/375a651e6d1d.jpg", alt: "Jogger worn on model" },
    ],
    variants: [
      { size: "S", color: "Grey", stock: 3 },
      { size: "M", color: "Grey", stock: 4 },
      { size: "L", color: "Grey", stock: 4 },
      { size: "XL", color: "Grey", stock: 2 },
    ],
  },
  {
    slug: "retro-court-sneaker-white",
    name: "Retro Court Sneaker",
    category: "Sneakers",
    brand: "Adidas",
    price: 89,
    originalPrice: 110,
    condition: "EXCELLENT",
    description:
      "Clean retro court silhouette in white leather with gum-tinted sole. Lightly worn, no creasing worth mentioning, original laces and insoles. Runs true to size.",
    material: "Full-grain leather upper, gum rubber outsole",
    sizeChart: SHOE_CHART,
    tags: ["retro", "court", "tennis", "white"],
    featured: true,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a8cc34d235bb.jpg", alt: "Retro Court Sneaker in white" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e6c8b9e88f10.jpg", alt: "Court Sneaker side profile" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f047160922cc.jpg", alt: "Court Sneaker outsole detail" },
    ],
    variants: [
      { size: "US 8", color: "White", stock: 1 },
      { size: "US 9", color: "White", stock: 2 },
      { size: "US 10", color: "White", stock: 2 },
      { size: "US 11", color: "White", stock: 1 },
    ],
  },
  {
    slug: "chunky-trail-sneaker-grey",
    name: "Chunky Trail Sneaker",
    category: "Sneakers",
    brand: "New Balance",
    price: 105,
    originalPrice: 140,
    condition: "USED",
    description:
      "Chunky 2000s trail runner in grey and sage. Honest wear on the outsole, mesh and suede uppers still clean. The dad-shoe silhouette that refuses to die.",
    material: "Suede and mesh upper, EVA midsole",
    sizeChart: SHOE_CHART,
    tags: ["chunky", "trail", "2000s", "grey"],
    featured: false,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b8ee91fb4abd.webp", alt: "Chunky Trail Sneaker in grey" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/91c5ead0fc7f.jpeg", alt: "Trail Sneaker side profile" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/43bee77294fc.jpg", alt: "Trail Sneaker worn" },
    ],
    variants: [
      { size: "US 8", color: "Grey", stock: 1 },
      { size: "US 9", color: "Grey", stock: 1 },
      { size: "US 10", color: "Grey", stock: 1 },
    ],
  },
  {
    slug: "structured-6-panel-cap-black",
    name: "Structured 6-Panel Cap",
    category: "Accessories",
    brand: "'47",
    price: 32,
    condition: "NEW",
    description:
      "Structured six-panel in black cotton twill with a curved brim and adjustable strap. Quiet, fix-anything headwear — no branding beyond the stitching.",
    material: "100% cotton twill",
    tags: ["cap", "6-panel", "black"],
    featured: false,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e02302e2562c.jpg", alt: "Structured 6-Panel Cap in black" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/23a21876ddc3.jpg", alt: "Cap crown detail" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bd369dea2f71.jpg", alt: "Cap worn" },
    ],
    variants: [{ size: "OS", color: "Black", stock: 5 }],
  },
  {
    slug: "cuffed-knit-beanie-black",
    name: "Cuffed Knit Beanie",
    category: "Accessories",
    brand: "Carhartt WIP",
    price: 26,
    condition: "NEW",
    description:
      "Ribbed knit watch cap in black with a folded cuff. One size covers most heads, stretch knit keeps its shape. The last thing you grab and the first thing people see.",
    material: "100% acrylic rib knit",
    tags: ["beanie", "winter", "knit"],
    featured: false,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/58a328150952.jpg", alt: "Cuffed Knit Beanie in black" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1d494c909a8a.jpg", alt: "Beanie cuff detail" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e2d75058f95c.jpg", alt: "Beanie worn" },
    ],
    variants: [{ size: "OS", color: "Black", stock: 6 }],
  },
  {
    slug: "heavy-canvas-tote-natural",
    name: "Heavy Canvas Tote",
    category: "Accessories",
    brand: "Postform Standard",
    price: 22,
    condition: "NEW",
    description:
      "16oz natural canvas tote with reinforced webbing handles that go all the way down the body. Carries groceries, vinyl, gym kit or an entire fit. Rugged enough to earn its stains.",
    material: "16oz natural cotton canvas",
    tags: ["tote", "canvas", "carry", "everyday"],
    featured: false,
    images: [
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0d7b602dc005.jpg", alt: "Heavy Canvas Tote in natural" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/41e57ac2871c.png", alt: "Canvas tote handles detail" },
      { url: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3f23bcfe2592.jpg", alt: "Canvas tote carried" },
    ],
    variants: [{ size: "OS", color: "Natural", stock: 4 }],
  },
];

async function main() {
  console.log("Clearing existing data...");
  await prisma.product.deleteMany();
  await prisma.storeSetting.deleteMany();

  console.log("Seeding settings...");
  await prisma.storeSetting.createMany({
    data: [
      { key: "shipping_mode", value: "free" },
      { key: "shipping_fee", value: "0" },
      { key: "currency", value: "$" },
      { key: "store_email", value: "postformproducts@haren.uk" },
    ],
  });

  console.log("Seeding products...");
  for (const p of products) {
    const created = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        category: p.category,
        brand: p.brand,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        condition: p.condition,
        description: p.description,
        material: p.material,
        sizeChart: p.sizeChart ?? null,
        tags: JSON.stringify(p.tags),
        featured: p.featured,
        active: true,
        images: {
          create: p.images.map((img, i) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: i,
          })),
        },
        variants: {
          create: p.variants,
        },
      },
    });
    console.log(`  ✓ ${created.slug} (${p.variants.length} variants)`);
  }

  const total = await prisma.product.count();
  console.log(`\n✓ Seeded ${total} products + store settings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
