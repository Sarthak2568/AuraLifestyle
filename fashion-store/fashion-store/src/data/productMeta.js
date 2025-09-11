// src/data/productMeta.js
// Structured, high-quality copy & specs per product.
// Keep descriptions tight; add/adjust as you like.

const hex = {
  Black: "#111111",
  White: "#F5F5F5",
  Grey: "#A0A0A0",
  Navy: "#0D1B2A",
  Olive: "#50623A",
  Charcoal: "#2E2E2E",
  Blue: "#2459A6",
  Beige: "#D9CBB7",
  Lavender: "#BFA8E5",
  Floral: "#E46A78",
};

const SIZE_CHARTS = {
  "men-tee-oversized": {
    label: "Men’s Oversized Tee (inches)",
    cols: ["Size", "Chest", "Length"],
    rows: [
      ["S", "40–42", "27"],
      ["M", "42–44", "28"],
      ["L", "44–46", "29"],
      ["XL", "46–48", "30"],
    ],
    note: "Relaxed through the shoulder and chest. Size down for a closer fit."
  },
  "men-hoodie": {
    label: "Men’s Hoodie (inches)",
    cols: ["Size", "Chest", "Length"],
    rows: [
      ["S", "40", "27"],
      ["M", "42", "28"],
      ["L", "44", "29"],
      ["XL", "46", "30"],
    ],
    note: "Brushed-fleece interior. True to size; size up for layering."
  },
  "men-bottom": {
    label: "Men’s Bottoms (inches)",
    cols: ["Size", "Waist", "Inseam"],
    rows: [
      ["S", "28–30", "29"],
      ["M", "31–33", "30"],
      ["L", "34–36", "31"],
      ["XL", "37–39", "32"],
    ],
    note: "Elasticated waistband; drawcord for adjustability."
  },
  "men-overshirt": {
    label: "Men’s Shirt/Jacket (inches)",
    cols: ["Size", "Chest", "Length"],
    rows: [
      ["S", "40", "28"],
      ["M", "42", "29"],
      ["L", "44", "30"],
      ["XL", "46", "31"],
    ],
    note: "Roomy, made to layer over a tee."
  },
  "men-vest": {
    label: "Men’s Puffer Vest (inches)",
    cols: ["Size", "Chest", "Length"],
    rows: [
      ["S", "40", "26.5"],
      ["M", "42", "27.5"],
      ["L", "44", "28.5"],
      ["XL", "46", "29.5"],
    ],
    note: "Designed to fit over a mid-weight hoodie or sweatshirt."
  },

  "women-tee": {
    label: "Women’s Tee (inches)",
    cols: ["Size", "Bust", "Length"],
    rows: [
      ["XS", "30–32", "23.5"],
      ["S", "32–34", "24"],
      ["M", "34–36", "24.5"],
      ["L", "36–38", "25"],
      ["XL", "38–40", "25.5"],
    ],
    note: "Slightly relaxed through body. Choose true to size."
  },
  "women-hoodie": {
    label: "Women’s Hoodie (inches)",
    cols: ["Size", "Bust", "Length"],
    rows: [
      ["XS", "32", "23.5"],
      ["S", "34", "24"],
      ["M", "36", "24.5"],
      ["L", "38", "25"],
      ["XL", "40", "25.5"],
    ],
    note: "Boxy, cropped shape. Size up for extra length."
  },
  "women-bottom": {
    label: "Women’s Bottoms (inches)",
    cols: ["Size", "Waist", "Hip"],
    rows: [
      ["XS", "24–25", "34–35"],
      ["S", "26–27", "36–37"],
      ["M", "28–29", "38–39"],
      ["L", "30–31", "40–41"],
      ["XL", "32–33", "42–43"],
    ],
    note: "High-rise with stretch for comfort."
  },
  "women-dress": {
    label: "Women’s Dress (inches)",
    cols: ["Size", "Bust", "Waist"],
    rows: [
      ["XS", "30–32", "24–25"],
      ["S", "32–34", "26–27"],
      ["M", "34–36", "28–29"],
      ["L", "36–38", "30–31"],
      ["XL", "38–40", "32–33"],
    ],
    note: "If between sizes at bust, choose the larger."
  },
};

const defaultCare = [
  "Machine wash cold with like colours",
  "Do not bleach",
  "Line dry in shade",
  "Cool iron on reverse; do not iron on print",
];

const M = (overrides) => ({
  material: "100% Cotton, 220–240 GSM",
  care: defaultCare,
  fit: "Relaxed / True to size",
  highlights: ["Breathable combed cotton", "Pre-shrunk; holds shape", "Soft hand-feel prints", "Made for everyday wear"],
  colors: overrides.colors || {},
  sizeChartKey: overrides.sizeChartKey || "men-tee-oversized",
  ...overrides,
});

const W = (overrides) => ({
  material: "100% Cotton, 200–220 GSM",
  care: defaultCare,
  fit: "Slightly relaxed",
  highlights: ["Soft combed cotton", "No-itch neck tape", "Body-flattering drape", "Everyday comfort"],
  colors: overrides.colors || {},
  sizeChartKey: overrides.sizeChartKey || "women-tee",
  ...overrides,
});

export const PRODUCT_META = {
  // ----- MEN -----
  "m-01": M({
    subtitle: "Oversized T-Shirts",
    description: "Bold Aurora chest mark on a heavyweight tee with an airy, oversized drape. Built to keep its shape and colour through countless washes.",
    colors: { Black: hex.Black, White: hex.White },
  }),
  "m-02": M({
    subtitle: "Athleisure Bottoms",
    description: "Tapered joggers with a clean silhouette—soft on skin, structured enough to hold shape. Zippered pocket keeps essentials secure.",
    highlights: ["Cotton-rich terry", "Elastic waist w/ drawcord", "Secure zip pocket", "Tapered ankle"],
    colors: { Grey: hex.Grey, Black: hex.Black },
    sizeChartKey: "men-bottom",
  }),
  "m-03": M({
    subtitle: "Piqué Polo",
    description: "Your everyday polo in breathable piqué with an elevated collar roll. Clean, minimal branding for maximum versatility.",
    highlights: ["Breathable piqué knit", "Two-button placket", "Reinforced collar", "Weekday to weekend"],
  }),
  "m-04": M({
    subtitle: "Mid-weight Hoodie",
    description: "The throw-on hoodie with brushed fleece inside and a tidy, modern fit. Warm without bulk.",
    highlights: ["Brushed fleece interior", "Kangaroo pocket", "Ribbed cuffs & hem", "Holds colour and shape"],
    sizeChartKey: "men-hoodie",
    colors: { Charcoal: hex.Charcoal },
  }),
  "m-05": M({
    subtitle: "Relaxed Denim",
    description: "Non-stretch denim with an easy straight leg. Washed to a versatile mid-blue that pairs with everything.",
    highlights: ["12oz cotton denim", "Straight-relaxed fit", "YKK hardware", "Durable pocketing"],
    sizeChartKey: "men-bottom",
    colors: { Blue: hex.Blue },
  }),
  "m-06": M({
    subtitle: "Training Tee",
    description: "Lightweight performance knit that wicks fast and breathes hard—your go-to for runs and sessions.",
    highlights: ["Quick-dry knit", "Flatlock seams", "Odour-control finish", "No-cling feel"],
    colors: { White: hex.White },
  }),
  "m-07": M({
    subtitle: "Athleisure Shorts",
    description: "All-day shorts with a gym-ready build. Soft terry body with zip pocketing and a confident 7\" look.",
    highlights: ["Cotton-rich terry", "7\" outseam look", "Zip pocket", "Drawcord waist"],
    sizeChartKey: "men-bottom",
    colors: { Black: hex.Black },
  }),
  "m-08": M({
    subtitle: "Layered Shirt",
    description: "A workwear-leaning overshirt that layers over tees without feeling bulky. Subtle utility details, clean lines.",
    highlights: ["Twill weave", "Button-front", "Chest utility pocket", "Layer-ready fit"],
    sizeChartKey: "men-overshirt",
    colors: { Olive: hex.Olive },
  }),
  "m-09": M({
    subtitle: "Puffer Vest",
    description: "Light, warm, and layer-ready. The everyday vest for chilly mornings and late rides.",
    highlights: ["Lightweight insulation", "Down-alternative fill", "Hand pockets", "Wind-resistant shell"],
    sizeChartKey: "men-vest",
    colors: { Navy: hex.Navy },
  }),
  "m-11": M({
    subtitle: "Puffer Vest",
    description: "Streamlined core-warmer designed for clean layering. Same great fill and shell as m-09.",
    highlights: ["Down-alternative fill", "Hand pockets", "Wind-resistant shell", "Packable warm layer"],
    sizeChartKey: "men-vest",
    colors: { Navy: hex.Navy },
  }),
  "m-12": M({
    subtitle: "Puffer Vest",
    description: "Versatile mid-season vest with a matte finish. Throw it over tees or hoodies.",
    highlights: ["Warm, light insulation", "Matte shell", "Zip closure", "Everyday durability"],
    sizeChartKey: "men-vest",
    colors: { Navy: hex.Navy },
  }),
  "m-10": M({
    subtitle: "Oversized T-Shirts",
    description: "Monochrome front & back graphics on our heavyweight oversized block. Loud print, quiet palette.",
    highlights: ["240GSM cotton", "Soft-hand screen print", "No-twist collar", "Holds shape after wash"],
    colors: { Black: hex.Black },
  }),

  // ----- WOMEN -----
  "w-01": W({
    subtitle: "Oversized T-Shirts",
    description: "The Freedom tee brings airy softness with a confident, boxy drape—made to move and made to last.",
    colors: { Black: hex.Black, White: hex.White },
  }),
  "w-02": W({
    subtitle: "Everyday Flare Pants",
    description: "High-rise flares in a soft, hold-you-in knit. Dresses up or down—stretch that bounces back.",
    highlights: ["Four-way stretch", "High-rise fit", "Smoothing waistband", "Flows without cling"],
    sizeChartKey: "women-bottom",
    colors: { Beige: hex.Beige, Black: hex.Black },
  }),
  "w-13": W({
    subtitle: "Minimal Crop Hoodie",
    description: "A plush cropped hoodie with modern proportions: roomy body, clean hem, zero bulk.",
    highlights: ["Brushed interior", "Boxy-cropped shape", "Rib trims", "Colour-true dye"],
    sizeChartKey: "women-hoodie",
    colors: { Lavender: hex.Lavender, Grey: hex.Grey },
  }),
  "w-04": W({
    subtitle: "Classic Straight Denim",
    description: "Classic straight-leg denim with authentic texture and an ever-useful blue wash.",
    highlights: ["100% cotton denim", "Straight through leg", "Reinforced seams", "No-see-through pocketing"],
    sizeChartKey: "women-bottom",
    colors: { Blue: hex.Blue },
  }),
  "w-05": W({
    subtitle: "Airy Summer Dress",
    description: "Throw-on dress with a floaty drape and an easy, flattering line. Weekend-ready, travel-easy.",
    highlights: ["Breathable weave", "Flowy silhouette", "Pockets", "Wrinkle-friendly"],
    sizeChartKey: "women-dress",
    colors: { Floral: hex.Floral },
  }),
  "w-06": W({
    subtitle: "Comfy Lounge Set",
    description: "A mix-and-match lounge set: cloud-soft knit with a gentle stretch and clean finish.",
    highlights: ["Soft touch knit", "Easy elastic waist", "No-itch seams", "All-day comfort"],
    sizeChartKey: "women-bottom",
    colors: { Cream: "#EDE6D6" },
  }),
  "w-09": W({
    subtitle: "Everyday Flare Pants",
    description: "Same flattering flare with just-right stretch and a smoothing waistband.",
    highlights: ["Four-way stretch", "High-rise", "Holds shape", "Travel friendly"],
    sizeChartKey: "women-bottom",
    colors: { Beige: hex.Beige, Black: hex.Black },
  }),
  "w-10": W({
    subtitle: "Minimal Crop Hoodie",
    description: "Clean crop, plush hand. Layer it over dresses or pair with flares.",
    highlights: ["Brushed fleece", "Boxy fit", "Rib cuffs & hem", "Colourfast dye"],
    sizeChartKey: "women-hoodie",
    colors: { Lavender: hex.Lavender, Grey: hex.Grey },
  }),
  "w-11": W({
    subtitle: "Classic Straight Denim",
    description: "A wear-anywhere straight leg in a timeless blue—built to soften with every wash.",
    highlights: ["Durable denim", "Classic 5-pocket", "Clean straight leg", "Everyday staple"],
    sizeChartKey: "women-bottom",
    colors: { Blue: hex.Blue },
  }),
  "w-12": W({
    subtitle: "Airy Summer Dress",
    description: "Light, swishy movement with an easy waist and pockets—your warm-weather uniform.",
    highlights: ["Breathable fabric", "Figure-skimming", "Pockets", "Packable"],
    sizeChartKey: "women-dress",
    colors: { Floral: hex.Floral },
  }),
  "w-07": W({
    subtitle: "Soft Touch Tee",
    description: "Feather-soft tee with a smooth drape that dresses up effortlessly.",
    highlights: ["Combed cotton", "Tag-free neck", "Shape-keeping rib", "Everyday comfort"],
    colors: { White: hex.White, Black: hex.Black },
  }),
  "w-08": W({
    subtitle: "Back Graphic Tee",
    description: "Statement graphic at the back; clean up front. Balanced weight for year-round wear.",
    highlights: ["Soft handle print", "Mid-weight cotton", "No-twist collar", "Washer friendly"],
    colors: { Black: hex.Black },
  }),
};

export const getProductMeta = (id) => PRODUCT_META[id];

export const filteredChart = (chartKey, available = []) => {
  const chart = SIZE_CHARTS[chartKey] || null;
  if (!chart) return null;
  const rows = available.length
    ? chart.rows.filter((r) => available.includes(r[0]))
    : chart.rows;
  return { ...chart, rows };
};
// --- add at end of productMeta.js ---
const FALLBACK_COLOR_HEX = {
  Black: "#111111",
  White: "#F5F5F5",
  Grey: "#A0A0A0",
  Navy: "#0D1B2A",
  Olive: "#50623A",
  Charcoal: "#2E2E2E",
  Blue: "#2459A6",
  Beige: "#D9CBB7",
  Lavender: "#BFA8E5",
  Floral: "#E46A78",
  Cream: "#EDE6D6",
};

export const colorHex = (id, color) => {
  const meta = PRODUCT_META[id];
  if (meta?.colors?.[color]) return meta.colors[color];
  return FALLBACK_COLOR_HEX[color] || "#E5E5E5";
};
