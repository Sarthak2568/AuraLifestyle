// Put your actual image files under: /public/images/
// If any extension differs (.png/.jpeg), just change the path below accordingly.

export const ALL_PRODUCTS = [
  // ---------- MEN ----------
{
  id: "MEN-ROSE-DRESS",
  slug: "rose-slit-dress",
  title: "AURA Basic Tee",
  price: 799,
  mrp: 899,
  gender: "men",

  colors: ["Black", "White"],
  colorSwatches: { Black: "#0a0a0a", White: "#f6f6f6" },
  sizes: ["S", "M", "L"],

  // ✅ add this for listing cards
  image: "/images/M-01.png",

  // ✅ keep paths consistent with your other items
  imagesByColor: {
    Black: ["/images/M-01.png"],
    White: ["/images/M-02.png"]
  },

  // ✅ gallery fallback (optional but safe)
  images: ["/images/M-01.png"]
},
  //{ id: "m-01", title: "Aurora Graphic Oversized Tee", price: 799, mrp: 1199, image: "/images/M-01.png", gender: "men", sizes:["S","M","L","XL"], colors:["Black","White"] },
  //{ id: "m-02", title: "Street Joggers",                  price: 1299, mrp: 1699, image: "/images/M-02.png", gender: "men", sizes:["S","M","L","XL"], colors:["Grey","Black"] },
  { id: "m-04", title: "AURA Race Ready Tee",             price: 899, mrp: 999, image: "/images/M-04.png", gender: "men", sizes:["S","M","L"], colors:["Black"], colorSwatches: { Black: "#0a0a0a"} },
  { id: "m-05", slug: "aura-squid-game-tee", title: "AURA Squid Game Tee",  price: 799, mrp: 899, image: "\images\Squid-game.png", gender: "men", sizes: ["S", "M", "L"], colors:["Black"], colorSwatches: { Black: "#0a0a0a"} },
  { id: "m-05", slug: "aura-squid-game-white-tee", title: "AURA Squid Game Tee",  price: 799, mrp: 899, image: "\images\M-05.jpg", gender: "men", sizes: ["S", "M", "L"], colors:["white"], colorSwatches: { BWhite: "#ffffff"} },
 // { id: "m-06", title: "Training Tee",                    price: 699,  mrp: 999,  image: "/images/M-06.jpg", gender: "men", sizes:["S","M","L","XL"], colors:["White"] },
 // { id: "m-07", title: "Athleisure Shorts",               price: 899,  mrp: 1199, image: "/images/M-07.jpg", gender: "men", sizes:["S","M","L","XL"], colors:["Black"] },
 // { id: "m-08", title: "Layered Shirt",                   price: 1199, mrp: 1599, image: "/images/M-08.png", gender: "men", sizes:["S","M","L","XL"], colors:["Olive"] },
 // { id: "m-09", title: "Puffer Vest",                     price: 1799, mrp: 2499, image: "/images/M-09.png", gender: "men", sizes:["S","M","L","XL"], colors:["Navy"] },
 // { id: "m-11", title: "Puffer Vest",                     price: 1799, mrp: 2499, image: "/images/M-11.png", gender: "men", sizes:["S","M","L","XL"], colors:["Navy"] },
  { id: "m-12", title: "AURA Rimberio Tee",                 price: 799, mrp: 899, image: "/images/M-12.png", gender: "men", sizes:["S","M","L"], colors:["white"],colorSwatches: { White: "#ffffff" } },
 // { id: "m-13", title: "Puffer Vest",                     price: 1799, mrp: 2499, image: "/images/M-13.png", gender: "men", sizes:["S","M","L","XL"], colors:["Navy"] },
  // explicitly requested:
  //{ id: "m-10", title: "Monochrome Tee – Front & Back Print", price: 899, mrp: 1299, image: "/images/M-10.png", gender: "men", sizes:["S","M","L","XL"], colors:["Black"] },

  // ---------- WOMEN ----------
  { id: "w-01", title: "AURA Squid Game Tee",          price: 799,  mrp: 899, image: "/images/W-01.png", gender: "women", sizes:["S","M","L"], colors:["Black"], colorSwatches: { Black: "#0a0a0a"} },
  { id: "w-01", title: "AURA Squid Game Tee",          price: 799,  mrp: 899, image: "/images/W-01.png", gender: "women", sizes:["S","M","L"], colors:["White"], colorSwatches: { White: "#ffffff" } },
 // { id: "w-02", title: "Everyday Flare Pants",            price: 1399, mrp: 1799, image: "/images/W-02.jpg", gender: "women", sizes:["XS","S","M","L","XL"], colors:["Beige","Black"], colorSwatches: { White: "#f6f6f6" } },
 // { id: "w-13", title: "Minimal Crop Hoodie",             price: 1499, mrp: 1999, image: "/images/W-13.png", gender: "women", sizes:["XS","S","M","L","XL"], colors:["Lavender","Grey"] },
 // { id: "w-04", title: "Classic Straight Denim",          price: 1699, mrp: 2299, image: "/images/W-04.png", gender: "women", sizes:["XS","S","M","L","XL"], colors:["Blue"] },
  //{ id: "w-05", title: "Airy Summer Dress",               price: 1599, mrp: 2199, image: "/images/W-05.png", gender: "women", sizes:["XS","S","M","L","XL"], colors:["Floral"] },
  { id: "w-06", title: "AURA Rimberio Tee",                price: 799, mrp: 899, image: "/images/W-06 f.png", gender: "women", sizes:["S","M","L"], colors:["White"], colorSwatches: { White: "#ffffff" } },
  // explicitly requested:
 // {id: "w-09", title: "Everyday Flare Pants",            price: 1399, mrp: 1799, image: "/images/W-09.png", gender: "women", sizes:["XS","S","M","L","XL"], colors:["Beige","Black"] },
 // { id: "w-10", title: "Minimal Crop Hoodie",             price: 1499, mrp: 1999, image: "/images/W-10.png", gender: "women", sizes:["XS","S","M","L","XL"], colors:["Lavender","Grey"] },
 // { id: "w-11", title: "Classic Straight Denim",          price: 1699, mrp: 2299, image: "/images/W-11.png", gender: "women", sizes:["XS","S","M","L","XL"], colors:["Blue"] },
 // { id: "w-12", title: "Airy Summer Dress",               price: 1599, mrp: 2199, image: "/images/W-12.png", gender: "women", sizes:["XS","S","M","L","XL"], colors:["Floral"] },
 // { id: "w-07", title: "Soft Touch Tee – Women's",        price: 849,  mrp: 1299, image: "/images/W-07 f.png", gender: "women", sizes:["XS","S","M","L","XL"], colors:["White","Black"] },
 // { id: "w-08", title: "Back Graphic Tee – Women's",      price: 899,  mrp: 1399, image: "/images/W-08.png", gender: "women", sizes:["XS","S","M","L","XL"], colors:["Black"] },
  
];

// Make both import styles work:
export default ALL_PRODUCTS;
