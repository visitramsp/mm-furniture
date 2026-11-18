import type { Collection, Product, Swatch, SizeOption } from "./types";

// Product images are served from the live MN Furniture Shopify CDN.
const F = "https://mnfurnitureltd.co.uk/cdn/shop/files/";
const C = "https://mnfurnitureltd.co.uk/cdn/shop/collections/";

/** Resize a Shopify CDN image by changing its width param. */
export const img = (url: string, width = 800) => {
  if (!url.includes("cdn/shop")) return url;
  const clean = url.replace(/([?&])width=\d+&?/, "$1").replace(/[?&]$/, "");
  return clean + (clean.includes("?") ? "&" : "?") + "width=" + width;
};

export const COLLECTION_IMG = {
  wardrobes: C + "Wardrobes_d1ee0f6f-ee09-4d3c-a3a7-ad1fef2f1ad4.jpg?v=1766492887",
  sofas: C + "Sofas.jpg?v=1766492912",
  sofabeds: C + "Sofa-bed.jpg?v=1766492893",
  bedroom: C + "Bedroom-Set_0c491a65-c7f4-43cf-8ed0-1bb89adadcbf.jpg?v=1766492994",
  beds: C + "Beds_3debcba0-34eb-4eba-8e88-6f2dcc9fefa0.jpg?v=1766492884",
  outdoor: C + "Outdoor-Garden_bb81697d-509e-4582-9cf6-7d26596ebb8a.jpg?v=1766493123",
  sale: C + "sale-and-discount-700x700.jpg?v=1766493179",
};

export const BANNERS = {
  slide1: F + "01_600_x_480.jpg?v=1772301229",
  slide2: F + "02_600_x_480.jpg?v=1772301408",
  sale: F + "800_x_480_banner.jpg?v=1772301443",
  bedroomMenu: F + "bedroom_menu_bannar.jpg?v=1766336749",
};

const SW: Record<string, Swatch> = {
  White: { name: "White", hex: "#f4f4f2" },
  Black: { name: "Black", hex: "#1c1c1c" },
  Grey: { name: "Grey", hex: "#8f9399" },
  Oak: { name: "Oak", hex: "#c49a6c" },
  Walnut: { name: "Walnut", hex: "#6b4429" },
  Wenge: { name: "Wenge", hex: "#3d2b22" },
  Beige: { name: "Beige", hex: "#d8c7a8" },
  Brown: { name: "Brown", hex: "#6f4e37" },
  Blue: { name: "Blue", hex: "#2b4a8b" },
  Green: { name: "Green", hex: "#3f6b4f" },
  Cream: { name: "Cream", hex: "#efe6d2" },
};
const sw = (...n: string[]) => n.map((k) => SW[k]);

const wardrobeSizes: SizeOption[] = [
  { label: "90 cm", delta: -120, dims: "W 90 × H 200 × D 62 cm" },
  { label: "100 cm", delta: -100, dims: "W 100 × H 217 × D 62 cm" },
  { label: "120 cm", delta: -60, dims: "W 120 × H 217 × D 62 cm" },
  { label: "150 cm", delta: 0, dims: "W 150 × H 217 × D 62 cm" },
  { label: "180 cm", delta: 50, dims: "W 180 × H 217 × D 62 cm" },
  { label: "203 cm", delta: 90, dims: "W 203 × H 217 × D 62 cm" },
];
const bedSizes: SizeOption[] = [
  { label: "Single", delta: -80, dims: "W 100 × L 205 cm" },
  { label: "Double", delta: 0, dims: "W 145 × L 205 cm" },
  { label: "King", delta: 60, dims: "W 160 × L 215 cm" },
  { label: "Super King", delta: 120, dims: "W 190 × L 215 cm" },
];
const LED = [{ id: "led", label: "With LED Light", price: 10 }];
const MATTRESS = [{ id: "mattress", label: "Add Memory Foam Mattress", price: 149 }];
const ASSEMBLY = { id: "assembly", label: "Professional Assembly", price: 59 };

const copy = {
  wardrobe: {
    description: [
      "A clean, modern wardrobe built to make the most of every centimetre. Smooth-gliding doors open onto a full-height hanging rail and generous shelving, so shirts, dresses and folded knits all have a place.",
      "Made from durable MDF with a matte laminate finish that wipes clean in seconds. Delivered flat-packed with clear step-by-step instructions.",
    ],
    features: ["Soft, quiet sliding door runners", "Full-length hanging rail plus shelves", "Scratch-resistant matte laminate", "Anti-tip wall fixing kit included", "Optional built-in LED lighting"],
    material: "MDF with matte laminate finish",
  },
  sofa: {
    description: [
      "Deep seats, supportive cushions and a shape that settles into any living room. This sofa is made for long film nights and lazy Sunday afternoons.",
      "A solid wood frame and pocket-sprung base keep it comfortable for years, while the upholstery is easy to care for day to day.",
    ],
    features: ["Solid hardwood frame", "High-density foam seat cushions", "Pocket-sprung seat base", "Easy-clean upholstery", "Feet included, simple to fit"],
    material: "Hardwood frame, foam & fibre cushions",
  },
  sofabed: {
    description: [
      "A comfortable sofa by day and a proper bed by night. The simple pull-out mechanism opens in seconds, ready for guests who stay over.",
      "Thick seat padding means it's just as good as a sofa as it is as a bed. A smart pick for flats, studies and spare rooms.",
    ],
    features: ["Quick pull-out bed mechanism", "Hidden storage on selected models", "Thick foam sleeping surface", "Sturdy metal action frame", "Removable back cushions"],
    material: "Metal action, foam, fabric upholstery",
  },
  bed: {
    description: [
      "A statement bed frame with a padded headboard and a solid slatted base that supports your mattress properly.",
      "Choose your size and add a memory foam mattress for a complete sleep set, delivered together.",
    ],
    features: ["Padded upholstered headboard", "Sprung slatted base", "Strong centre support rail", "Matching mattress available", "Tool kit included"],
    material: "Upholstered frame, sprung slats",
  },
  garden: {
    description: [
      "Weather-ready outdoor furniture for patios, balconies and gardens. Lightweight to move about, tough enough to leave out through the summer.",
      "UV-resistant materials keep their colour, and the cushions remove easily for washing and storage.",
    ],
    features: ["Weather and UV resistant", "Rust-proof frame", "Removable washable cushions", "Light and easy to move", "Minimal assembly"],
    material: "Powder-coated steel / PE rattan",
  },
};

type Seed = Omit<Product, "id" | "description" | "features" | "material" | "stock" | "rating"> & {
  kind: keyof typeof copy;
  rating?: number;
  stock?: number;
};

const seeds: Seed[] = [
  {
    kind: "wardrobe", handle: "chicago-white-wardrobe", title: "Chicago White Wardrobe", category: "wardrobes",
    collections: ["sliding-wardrobes", "modern-sliding-wardrobes", "white-wardrobes", "wardrobe-sale", "chicago-wardrobe"],
    price: 359.99, compareAt: 429.99, reviews: 141, badge: "Best Seller", fastDelivery: true,
    images: [F + "white-chicago-203-1_54dd4982-f92f-4472-b355-864103a90188.jpg?v=1772029833", F + "white-chicago-203-inside-1_5995b957-06db-4a86-b383-7e2ec68fc017.jpg?v=1772029833", C + "white-chicago-203.jpg?v=1771104123"],
    colours: sw("White", "Black", "Grey", "Oak", "Walnut", "Wenge"), sizes: wardrobeSizes, addons: [...LED, ASSEMBLY],
    short: "Two-door sliding wardrobe with full hanging rail, shelves and optional LED lighting.",
    specs: { Depth: "62 cm", Height: "200–217 cm", Doors: "2 sliding", Finish: "Matte laminate", Assembly: "Flat-packed" },
  },
  {
    kind: "wardrobe", handle: "etna-black-wardrobe", title: "Etna Black Wardrobe", category: "wardrobes",
    collections: ["sliding-wardrobes", "mirror-wardrobes", "black-wardrobes", "wardrobe-sale"],
    price: 419.99, compareAt: 479.99, reviews: 213, badge: "Hot", fastDelivery: true,
    images: [F + "Black-Etna-2_e1e7cff6-16e8-4f61-a8cf-903df0b81854.jpg?v=1772023676", F + "Black-Etna-Inside_c8f4903a-e58d-49e0-bc53-f35181e99aad.jpg?v=1772023676", C + "Mirror-Door-Wardrobe_-3.jpg?v=1771251567"],
    colours: sw("Black", "White", "Grey"), sizes: [wardrobeSizes[3], { label: "200 cm", delta: 70, dims: "W 200 × H 217 × D 62 cm" }], addons: [...LED, ASSEMBLY],
    short: "Mirror-front sliding wardrobe with a sleek black finish and LED option.",
    specs: { Depth: "62 cm", Height: "217 cm", Doors: "2 sliding, mirrored", Finish: "Matte laminate", Assembly: "Flat-packed" },
  },
  {
    kind: "wardrobe", handle: "california-black-wardrobe", title: "California Black Wardrobe", category: "wardrobes",
    collections: ["sliding-wardrobes", "high-gloss-wardrobes", "black-wardrobes", "wardrobe-sale"],
    price: 409.99, compareAt: 479.99, reviews: 33,
    images: [F + "Black-California-Wardrobe_a884ebc9-41ff-4042-968c-59d8f114a799.webp?v=1772028785", F + "black-inside-203.webp?v=1772028785", C + "wardorbe-1.jpg?v=1766492926"],
    colours: sw("Black", "White", "Oak"), sizes: [wardrobeSizes[3], wardrobeSizes[5]], addons: [...LED, ASSEMBLY],
    short: "High-gloss sliding wardrobe with spacious interior and soft-close runners.",
    specs: { Depth: "62 cm", Height: "217 cm", Doors: "2 sliding", Finish: "High gloss", Assembly: "Flat-packed" },
  },
  {
    kind: "wardrobe", handle: "lisbon-sliding-door-wardrobe-black", title: "Lisbon Sliding Door Wardrobe Black", category: "wardrobes",
    collections: ["sliding-wardrobes", "modern-sliding-wardrobes", "black-wardrobes", "wardrobe-sale"],
    price: 389.99, compareAt: 459.99, reviews: 231, badge: "Top Rated", fastDelivery: true,
    images: [F + "LISBON-Sliding-Door-Wardrobe-Black-1.webp?v=1772028137", F + "LISBON-Sliding-Door-Wardrobe-Black-203-CM.webp?v=1772028137"],
    colours: sw("Black", "White", "Grey", "Oak"), sizes: wardrobeSizes.slice(2), addons: [...LED, ASSEMBLY],
    short: "Contemporary sliding wardrobe with framed doors and adjustable shelving.",
    specs: { Depth: "62 cm", Height: "217 cm", Doors: "2 sliding", Finish: "Matte laminate", Assembly: "Flat-packed" },
  },
  {
    kind: "wardrobe", handle: "royal-white-wardrobe", title: "Royal White Sliding Wardrobe 250cm", category: "wardrobes",
    collections: ["sliding-wardrobes", "three-four-door-wardrobes", "white-wardrobes", "wardrobe-set"],
    price: 519.99, compareAt: 589.99, reviews: 105,
    images: [F + "ROYAL-WHITE-WARDROBE-250cm_9b038020-390d-4a08-8eb6-959ce56e6207.jpg?v=1766496621", F + "150-1_17c20dab-30b4-428a-8826-7c8c278edd55.jpg?v=1766496623", C + "3-4-Door-Wardrobe_-1.jpg?v=1771259200"],
    colours: sw("White", "Grey", "Oak"), sizes: [{ label: "250 cm", delta: 0, dims: "W 250 × H 217 × D 62 cm" }], addons: [...LED, ASSEMBLY],
    short: "Extra-wide 250cm wardrobe with three sliding doors for big storage needs.",
    specs: { Depth: "62 cm", Width: "250 cm", Height: "217 cm", Doors: "3 sliding", Assembly: "Flat-packed" },
  },
  {
    kind: "sofa", handle: "dino-corner-sofa-beige-brown", title: "Dino Corner Sofa Beige/Brown", category: "sofas",
    collections: ["sofas", "corner-sofas", "sofa-sale"],
    price: 649.99, compareAt: 999.99, reviews: 213, badge: "-35%", fastDelivery: true,
    images: [F + "brown-corner-sofa-1.jpg?v=1766498217", F + "Dino-Corner-Sofa-BeigeBrown-Dimenssion.webp?v=1766498216", C + "Corner_Sofas.jpg?v=1772909063"],
    colours: sw("Beige", "Grey", "Black"), sizes: [{ label: "Left Hand", delta: 0 }, { label: "Right Hand", delta: 0 }], addons: [ASSEMBLY],
    short: "Two-tone corner sofa with chunky cushions and reversible chaise.",
    specs: { Width: "245 cm", Depth: "160 cm", Height: "85 cm", Seats: "5", Upholstery: "Fabric & faux leather" },
  },
  {
    kind: "sofa", handle: "chicago-pu-recliner-black-3-2-sofa-set", title: "Chicago PU Recliner Black 3+2 Sofa Set", category: "sofas",
    collections: ["sofas", "recliner-sofas", "sofa-sets", "black-sofas", "sofa-sale"],
    price: 859.99, compareAt: 1499.99, reviews: 87,
    images: [F + "black-32-recliner-1_36d71c76-7689-4868-9da6-7a337b8b21cc.jpg?v=1766501751", F + "black-32-recliner.jpg?v=1766501751", C + "Recliner_Sofas.jpg?v=1773069811"],
    colours: sw("Black", "Brown", "Grey"), sizes: [{ label: "3+2 Set", delta: 0 }, { label: "3 Seater", delta: -360 }, { label: "2 Seater", delta: -420 }], addons: [ASSEMBLY],
    short: "Manual reclining 3+2 set in hard-wearing PU leather.",
    specs: { "3 Seater": "W 200 × D 92 × H 98 cm", "2 Seater": "W 150 × D 92 × H 98 cm", Mechanism: "Manual recline", Upholstery: "PU leather" },
  },
  {
    kind: "sofa", handle: "camden-chesterfield-black-3-2-sofa-set", title: "Camden Chesterfield Black 3+2 Sofa Set", category: "sofas",
    collections: ["sofas", "chesterfield-sofas", "sofa-sets", "black-sofas", "sofa-sale"],
    price: 949.99, compareAt: 1499.99, reviews: 141, badge: "Luxury",
    images: [F + "camden-black.jpg?v=1766501905", F + "black_94894e0f-ef10-479f-a76d-02a2ae68baa0.jpg?v=1766501905", C + "Chesterfield_Sofas.jpg?v=1766493254"],
    colours: sw("Black", "Grey", "Green"), sizes: [{ label: "3+2 Set", delta: 0 }, { label: "3 Seater", delta: -400 }], addons: [ASSEMBLY],
    short: "Classic deep-buttoned Chesterfield 3+2 set with rolled arms.",
    specs: { "3 Seater": "W 205 × D 90 × H 78 cm", "2 Seater": "W 160 × D 90 × H 78 cm", Style: "Chesterfield", Upholstery: "Crushed velvet" },
  },
  {
    kind: "sofa", handle: "ashwin-blue-plush-velvet-corner-sofa", title: "Ashwin Blue Plush Velvet Corner Sofa", category: "sofas",
    collections: ["sofas", "corner-sofas", "sofa-sale"],
    price: 649.99, compareAt: 1299.99, reviews: 213, badge: "-50%",
    images: [F + "Ashwin-Sofa-blue-01-1.jpg?v=1766493974", F + "ASHWIN-PLUSH-VELVET-BLUE-CORNER-SOFA-scaled-1.jpg?v=1766493974"],
    colours: sw("Blue", "Grey", "Green", "Cream"), sizes: [{ label: "Left Hand", delta: 0 }, { label: "Right Hand", delta: 0 }], addons: [ASSEMBLY],
    short: "Soft plush velvet corner sofa with scatter cushions and gold feet.",
    specs: { Width: "250 cm", Depth: "165 cm", Height: "88 cm", Seats: "5", Upholstery: "Plush velvet" },
  },
  {
    kind: "bed", handle: "elizabeth-sleigh-bed", title: "Elizabeth Sleigh Bed", category: "beds",
    collections: ["beds-for-sale-uk", "bed-sale", "high-gloss-beds"],
    price: 429.99, compareAt: 599.99, reviews: 105,
    images: [F + "ELIZABETH-SLEIGH-BED-02.jpg?v=1766498747", C + "High-Gloss-Beds-2.jpg?v=1766493094"],
    colours: sw("Grey", "Cream", "Black"), sizes: bedSizes, addons: [...MATTRESS, ASSEMBLY],
    short: "Curved sleigh bed with a tall padded headboard and footboard.",
    specs: { Headboard: "120 cm", Base: "Sprung slats", Upholstery: "Plush velvet", Assembly: "Tools included" },
  },
  {
    kind: "bed", handle: "alice-ottoman-storage-bed", title: "Alice Ottoman Storage Bed", category: "beds",
    collections: ["beds-for-sale-uk", "ottoman-storage-bed", "bed-sale"],
    price: 329.99, compareAt: 999.99, reviews: 87, badge: "-67%", fastDelivery: true,
    images: [F + "ALICE-OTTOMAN-BLACK-STORAGE-BED-01.jpg?v=1766498704", F + "ALICE-OTTOMAN-BLACK-STORAGE-BED-02.jpg?v=1766498703", C + "Ottoman-Storage-Bed-2.jpg?v=1766492923"],
    colours: sw("Black", "Grey", "Cream"), sizes: bedSizes, addons: [...MATTRESS, ASSEMBLY],
    short: "Gas-lift ottoman bed with huge under-bed storage.",
    specs: { Lift: "Gas-lift ottoman", Storage: "Full-base", Upholstery: "Faux suede", Assembly: "Tools included" },
  },
  {
    kind: "sofabed", handle: "nova-grey-corner-sofa-bed", title: "Nova Grey Corner Sofa Bed", category: "sofabeds",
    collections: ["sofabeds", "corner-sofa-bed", "l-shape-corner-sofa-bed", "sofa-bed-sale"],
    price: 929.99, compareAt: 1599.99, reviews: 213, badge: "Best Seller", fastDelivery: true,
    images: [F + "Nova-grey-corner-sofabed.jpg?v=1766494450", F + "Nova-corner-sofa-3rd.jpg?v=1766494450", C + "Corner_Sofa_Bed.jpg?v=1766492968"],
    colours: sw("Grey", "Black", "Cream"), sizes: [{ label: "Left Hand", delta: 0 }, { label: "Right Hand", delta: 0 }], addons: [ASSEMBLY],
    short: "L-shaped corner sofa bed with storage chaise and pull-out double bed.",
    specs: { Width: "235 cm", Depth: "160 cm", "Bed size": "190 × 140 cm", Storage: "Chaise storage" },
  },
  {
    kind: "bed", handle: "kandal-sleigh-bed", title: "Kandal Sleigh Bed", category: "beds",
    collections: ["beds-for-sale-uk", "bed-sale"],
    price: 429.99, compareAt: 599.99, reviews: 123,
    images: [F + "KANDAL-SLEIGH-BED-01.jpg?v=1766498776", C + "Beds_3debcba0-34eb-4eba-8e88-6f2dcc9fefa0.jpg?v=1766492884"],
    colours: sw("Grey", "Black", "Blue"), sizes: bedSizes, addons: [...MATTRESS, ASSEMBLY],
    short: "Elegant panelled sleigh bed in soft-touch fabric.",
    specs: { Headboard: "115 cm", Base: "Sprung slats", Upholstery: "Soft fabric", Assembly: "Tools included" },
  },
  {
    kind: "garden", handle: "2-garden-chairs-and-table-set", title: "2 Garden Chairs and Table Set", category: "outdoor",
    collections: ["outdoor-and-garden-furniture", "rattan-garden-furniture", "garden-sofa-sets"],
    price: 399.99, compareAt: 469.99, reviews: 46,
    images: [F + "2-Garden-Chairs-and-Table-Set.jpg?v=1766495056", C + "Outdoor-Garden_bb81697d-509e-4582-9cf6-7d26596ebb8a.jpg?v=1766493123"],
    colours: sw("Grey", "Brown"), addons: [],
    short: "Bistro-style rattan set with two chairs and a glass-top table.",
    specs: { Pieces: "3", Frame: "Steel", Weave: "PE rattan", Table: "Tempered glass top" },
  },
  {
    kind: "garden", handle: "2-garden-chairs-with-coffee-table", title: "2 Garden Chairs With Coffee Table", category: "outdoor",
    collections: ["outdoor-and-garden-furniture", "rattan-garden-furniture"],
    price: 369.0, reviews: 28,
    images: [F + "2-Garden-Chairs-With-Coffee-Table.jpg?v=1766495050"],
    colours: sw("Grey", "Black"), addons: [],
    short: "Low lounge chairs with matching coffee table for patios and balconies.",
    specs: { Pieces: "3", Frame: "Steel", Weave: "PE rattan", Cushions: "Included" },
  },
  {
    kind: "garden", handle: "2-pack-of-sun-lounger-cushion", title: "2-Pack of Sun Lounger Cushion", category: "outdoor",
    collections: ["outdoor-and-garden-furniture", "garden-accessories"],
    price: 179.99, compareAt: 219.99, reviews: 19,
    images: [F + "2-Pack-of-Sun-Lounger-Cushion-1.webp?v=1766495723", F + "2-Pack-of-Sun-Lounger-Cushion.webp?v=1766495723"],
    colours: sw("Cream", "Grey", "Blue"), addons: [],
    short: "Thick, water-repellent lounger cushions with ties. Pack of two.",
    specs: { Pack: "2 cushions", Length: "190 cm", Thickness: "8 cm", Cover: "Water-repellent" },
  },
  {
    kind: "garden", handle: "2-7m-garden-parasol-with-crank-and-base", title: "2.7M Garden Parasol with Crank and Base", category: "outdoor",
    collections: ["outdoor-and-garden-furniture", "garden-accessories"],
    price: 169.99, reviews: 37,
    images: [F + "17023102_l.webp?v=1766495127", F + "17023101_l.webp?v=1766495127"],
    colours: sw("Cream", "Grey", "Green"), addons: [],
    short: "Large 2.7m parasol with easy crank, tilt and weighted base.",
    specs: { Diameter: "2.7 m", Mechanism: "Crank & tilt", Base: "Included", Canopy: "UV 50+" },
  },
  // Sample entries for categories whose product photos were not captured from the live site.
  // Uses the live collection imagery. Replace with real products when the catalogue is imported.
  {
    kind: "bed", handle: "modern-bedroom-set", title: "Milano Modern Bedroom Set", category: "bedroom",
    collections: ["bedroom-set", "modern-bedroom-set"],
    price: 899.99, compareAt: 1199.99, reviews: 64, badge: "Set",
    images: [C + "Modern_Bedroom_Set.jpg?v=1766493048", BANNERS.bedroomMenu, C + "Bedroom-Set_0c491a65-c7f4-43cf-8ed0-1bb89adadcbf.jpg?v=1766492994"],
    colours: sw("White", "Grey", "Oak"), sizes: [{ label: "Wardrobe + Chest + 2 Bedsides", delta: 0 }, { label: "Wardrobe + 2 Bedsides", delta: -150 }], addons: [ASSEMBLY],
    short: "Matching wardrobe, chest of drawers and two bedside tables.",
    specs: { Pieces: "4", Finish: "Matte laminate", Handles: "Brushed metal", Assembly: "Flat-packed" },
  },
  {
    kind: "bed", handle: "luxury-bedroom-set", title: "Venezia Luxury Bedroom Set", category: "bedroom",
    collections: ["bedroom-set", "luxury-bedroom-set"],
    price: 1299.99, compareAt: 1699.99, reviews: 41, badge: "Luxury",
    images: [C + "Luxury_Bedroom_Set.jpg?v=1766493051", C + "Bedroom-Set_0c491a65-c7f4-43cf-8ed0-1bb89adadcbf.jpg?v=1766492994"],
    colours: sw("White", "Black"), sizes: [{ label: "Full Set", delta: 0 }], addons: [ASSEMBLY],
    short: "High-gloss luxury set with LED wardrobe, dresser and bedsides.",
    specs: { Pieces: "5", Finish: "High gloss", Lighting: "LED", Assembly: "Flat-packed" },
  },
  {
    kind: "bed", handle: "orthopaedic-memory-foam-mattress", title: "Orthopaedic Memory Foam Mattress", category: "beds",
    collections: ["beds-for-sale-uk", "mattress"],
    price: 199.99, compareAt: 289.99, reviews: 92,
    images: [C + "Mattress-1.jpg?v=1772909697"],
    sizes: bedSizes.map((s) => ({ ...s, delta: Math.round(s.delta / 2) })), addons: [],
    short: "Medium-firm hybrid mattress with memory foam comfort layer.",
    specs: { Depth: "25 cm", Firmness: "Medium-firm", Core: "Pocket springs", Cover: "Removable" },
  },
  {
    kind: "bed", handle: "metal-bunk-bed", title: "Triple Sleeper Bunk Bed", category: "beds",
    collections: ["beds-for-sale-uk", "bunk-bed"],
    price: 279.99, compareAt: 349.99, reviews: 33,
    images: [C + "Bunk-Bed-1.jpg?v=1772909478"],
    colours: sw("White", "Black", "Grey"), addons: [ASSEMBLY],
    short: "Space-saving triple sleeper with ladder and safety rails.",
    specs: { Sleeps: "3", Frame: "Steel / pine", Ladder: "Integrated", "Max load": "100 kg per bunk" },
  },
  {
    kind: "wardrobe", handle: "chest-of-drawers-cabinet", title: "Oslo 5-Drawer Chest", category: "beds",
    collections: ["beds-for-sale-uk", "cabinet"],
    price: 149.99, compareAt: 189.99, reviews: 58,
    images: [C + "Cabinet-2.jpg?v=1766493001"],
    colours: sw("White", "Black", "Oak"), addons: [ASSEMBLY],
    short: "Five deep drawers on smooth metal runners. Fits bedside to hallway.",
    specs: { Width: "70 cm", Height: "110 cm", Depth: "40 cm", Drawers: "5" },
  },
  {
    kind: "sofabed", handle: "plush-velvet-3-seater-sofa-bed", title: "Siena Plush Velvet 3 Seater Sofa Bed", category: "sofabeds",
    collections: ["sofabeds", "three-seater-sofa-bed", "plush-velvet-corner-sofa-bed", "sofa-bed-sale"],
    price: 549.99, compareAt: 849.99, reviews: 76,
    images: [C + "3_Seater_Sofa_Bed.jpg?v=1766492973", C + "Plush_Velvet_Corner_Sofa_Bed.jpg?v=1766493057"],
    colours: sw("Grey", "Blue", "Green"), addons: [ASSEMBLY],
    short: "Click-clack 3 seater sofa bed in soft plush velvet.",
    specs: { Width: "210 cm", "Bed size": "190 × 120 cm", Mechanism: "Click-clack", Upholstery: "Plush velvet" },
  },
  {
    kind: "sofabed", handle: "compact-2-seater-sofa-bed", title: "Porto Compact 2 Seater Sofa Bed", category: "sofabeds",
    collections: ["sofabeds", "two-seater-sofa-bed", "three-plus-two-sofa-beds"],
    price: 399.99, compareAt: 549.99, reviews: 51,
    images: [C + "2_Seater_Sofa_Bed.jpg?v=1773844007", C + "321-Sofa-Bed-2.jpg?v=1773070675"],
    colours: sw("Grey", "Black", "Cream"), addons: [ASSEMBLY],
    short: "Small-space 2 seater that converts to a comfy guest bed.",
    specs: { Width: "160 cm", "Bed size": "190 × 105 cm", Mechanism: "Click-clack", Upholstery: "Linen-look fabric" },
  },
  {
    kind: "sofa", handle: "grey-fabric-3-seater-sofa", title: "Harlow Grey 3 Seater Sofa", category: "sofas",
    collections: ["sofas", "grey-sofas", "sofa-sets"],
    price: 499.99, compareAt: 699.99, reviews: 67,
    images: [C + "Grey_Sofas.webp?v=1766493172", C + "Sofa_Sets.jpg?v=1766492946"],
    colours: sw("Grey", "Blue", "Cream"), sizes: [{ label: "3 Seater", delta: 0 }, { label: "3+2 Set", delta: 330 }], addons: [ASSEMBLY],
    short: "Everyday grey fabric sofa with high back and plump arms.",
    specs: { Width: "205 cm", Depth: "92 cm", Height: "90 cm", Upholstery: "Woven fabric" },
  },
];

export const products: Product[] = seeds.map((s, i) => {
  const { kind, ...rest } = s;
  return {
    id: "p" + (i + 1),
    rating: s.rating ?? Number((4.4 + ((i * 7) % 6) / 10).toFixed(1)),
    stock: s.stock ?? 3 + ((i * 5) % 18),
    ...rest,
    description: copy[kind].description,
    features: copy[kind].features,
    material: copy[kind].material,
  };
});

export const collections: Collection[] = [
  { handle: "all", title: "Shop All", image: COLLECTION_IMG.wardrobes, blurb: "Every piece in the MN Furniture range, in one place." },
  { handle: "sliding-wardrobes", title: "Wardrobes", image: COLLECTION_IMG.wardrobes, blurb: "Sliding, mirrored and high-gloss wardrobes that make small rooms feel bigger." },
  { handle: "modern-sliding-wardrobes", parent: "sliding-wardrobes", title: "Modern Sliding Wardrobes", image: C + "white-chicago-203.jpg?v=1771104123" },
  { handle: "mirror-wardrobes", parent: "sliding-wardrobes", title: "Mirror Wardrobes with Lights", image: C + "Mirror-Door-Wardrobe_-3.jpg?v=1771251567" },
  { handle: "high-gloss-wardrobes", parent: "sliding-wardrobes", title: "High Gloss Wardrobes", image: C + "wardorbe-1.jpg?v=1766492926" },
  { handle: "three-four-door-wardrobes", parent: "sliding-wardrobes", title: "3 & 4 Door Wardrobes", image: C + "3-4-Door-Wardrobe_-1.jpg?v=1771259200" },
  { handle: "wardrobe-set", parent: "sliding-wardrobes", title: "Wardrobe Sets", image: C + "WardrobeSet.jpg?v=1773845401" },
  { handle: "chicago-wardrobe", parent: "sliding-wardrobes", title: "Chicago Wardrobe Range" },
  { handle: "white-wardrobes", parent: "sliding-wardrobes", title: "White Wardrobes" },
  { handle: "black-wardrobes", parent: "sliding-wardrobes", title: "Black Wardrobes" },
  { handle: "grey-wardrobes", parent: "sliding-wardrobes", title: "Grey Wardrobes" },
  { handle: "oak-wardrobes", parent: "sliding-wardrobes", title: "Oak Wardrobes" },

  { handle: "sofabeds", title: "Sofa Beds", image: COLLECTION_IMG.sofabeds, blurb: "Sofa by day, bed by night. Smart seating for guests and small spaces." },
  { handle: "two-seater-sofa-bed", parent: "sofabeds", title: "2 Seater Sofa Beds", image: C + "2_Seater_Sofa_Bed.jpg?v=1773844007" },
  { handle: "three-seater-sofa-bed", parent: "sofabeds", title: "3 Seater Sofa Beds", image: C + "3_Seater_Sofa_Bed.jpg?v=1766492973" },
  { handle: "three-plus-two-sofa-beds", parent: "sofabeds", title: "3+2 Sofa Beds", image: C + "321-Sofa-Bed-2.jpg?v=1773070675" },
  { handle: "corner-sofa-bed", parent: "sofabeds", title: "Corner Sofa Beds", image: C + "Corner_Sofa_Bed.jpg?v=1766492968" },
  { handle: "plush-velvet-corner-sofa-bed", parent: "sofabeds", title: "Plush Velvet Sofa Beds", image: C + "Plush_Velvet_Corner_Sofa_Bed.jpg?v=1766493057" },
  { handle: "l-shape-corner-sofa-bed", parent: "sofabeds", title: "L-Shape Corner Sofa Beds", image: C + "L-Shape_Corner_Sofa_Bed.jpg?v=1766493060" },

  { handle: "sofas", title: "Sofas", image: COLLECTION_IMG.sofas, blurb: "Corner sofas, recliners and Chesterfields built for real-life comfort." },
  { handle: "sofa-sets", parent: "sofas", title: "Sofa Sets", image: C + "Sofa_Sets.jpg?v=1766492946" },
  { handle: "corner-sofas", parent: "sofas", title: "Corner Sofas", image: C + "Corner_Sofas.jpg?v=1772909063" },
  { handle: "recliner-sofas", parent: "sofas", title: "Recliner Sofas", image: C + "Recliner_Sofas.jpg?v=1773069811" },
  { handle: "chesterfield-sofas", parent: "sofas", title: "Chesterfield Sofas", image: C + "Chesterfield_Sofas.jpg?v=1766493254" },
  { handle: "grey-sofas", parent: "sofas", title: "Grey Sofas", image: C + "Grey_Sofas.webp?v=1766493172" },
  { handle: "black-sofas", parent: "sofas", title: "Black Sofas", image: C + "Black_Sofas.jpg?v=1772910318" },

  { handle: "bedroom-set", title: "Bedroom Sets", image: COLLECTION_IMG.bedroom, blurb: "Coordinated wardrobes, chests and bedsides for a finished look." },
  { handle: "modern-bedroom-set", parent: "bedroom-set", title: "Modern Bedroom Sets", image: C + "Modern_Bedroom_Set.jpg?v=1766493048" },
  { handle: "luxury-bedroom-set", parent: "bedroom-set", title: "Luxury Bedroom Sets", image: C + "Luxury_Bedroom_Set.jpg?v=1766493051" },

  { handle: "beds-for-sale-uk", title: "Beds & Mattresses", image: COLLECTION_IMG.beds, blurb: "Sleigh beds, ottoman storage beds, bunk beds and mattresses." },
  { handle: "high-gloss-beds", parent: "beds-for-sale-uk", title: "High Gloss Beds", image: C + "High-Gloss-Beds-2.jpg?v=1766493094" },
  { handle: "ottoman-storage-bed", parent: "beds-for-sale-uk", title: "Ottoman Storage Beds", image: C + "Ottoman-Storage-Bed-2.jpg?v=1766492923" },
  { handle: "mattress", parent: "beds-for-sale-uk", title: "Mattresses", image: C + "Mattress-1.jpg?v=1772909697" },
  { handle: "bunk-bed", parent: "beds-for-sale-uk", title: "Bunk Beds", image: C + "Bunk-Bed-1.jpg?v=1772909478" },
  { handle: "cabinet", parent: "beds-for-sale-uk", title: "Bedside & Chest of Drawers", image: C + "Cabinet-2.jpg?v=1766493001" },

  { handle: "outdoor-and-garden-furniture", title: "Outdoor & Garden", image: COLLECTION_IMG.outdoor, blurb: "Rattan sets, loungers and parasols for long summer evenings." },
  { handle: "rattan-garden-furniture", parent: "outdoor-and-garden-furniture", title: "Rattan Garden Furniture" },
  { handle: "garden-sofa-sets", parent: "outdoor-and-garden-furniture", title: "Garden Sofa Sets" },
  { handle: "garden-accessories", parent: "outdoor-and-garden-furniture", title: "Parasols & Accessories" },

  { handle: "sales-and-discount", title: "Sale", image: COLLECTION_IMG.sale, blurb: "Up to 67% off selected wardrobes, sofas, sofa beds and beds." },
  { handle: "wardrobe-sale", parent: "sales-and-discount", title: "Wardrobe Sale", image: COLLECTION_IMG.wardrobes },
  { handle: "sofa-sale", parent: "sales-and-discount", title: "Sofa Sale", image: COLLECTION_IMG.sofas },
  { handle: "sofa-bed-sale", parent: "sales-and-discount", title: "Sofa Bed Sale", image: COLLECTION_IMG.sofabeds },
  { handle: "bed-sale", parent: "sales-and-discount", title: "Bed Sale", image: COLLECTION_IMG.beds },
];

export const getCollection = (handle: string) => collections.find((c) => c.handle === handle);
export const getProduct = (handle: string) => products.find((p) => p.handle === handle);
export const childCollections = (handle: string) => collections.filter((c) => c.parent === handle);

const colourCollections: Record<string, string> = { "white-wardrobes": "White", "black-wardrobes": "Black", "grey-wardrobes": "Grey", "oak-wardrobes": "Oak" };

export function productsInCollection(handle: string): Product[] {
  if (handle === "all") return products;
  if (handle === "sales-and-discount") return products.filter((p) => p.compareAt && p.compareAt > p.price);
  if (colourCollections[handle]) {
    const c = colourCollections[handle];
    return products.filter((p) => p.category === "wardrobes" && p.colours?.some((s) => s.name === c));
  }
  const kids = childCollections(handle).map((c) => c.handle);
  return products.filter((p) => p.collections.includes(handle) || p.collections.some((h) => kids.includes(h)));
}

export const discountPct = (p: { price: number; compareAt?: number }) =>
  p.compareAt && p.compareAt > p.price ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0;

export const money = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

export const NAV = [
  { label: "Shop", to: "/collections/all" },
  { label: "Wardrobes", to: "/collections/sliding-wardrobes", handle: "sliding-wardrobes", colours: ["white-wardrobes", "grey-wardrobes", "black-wardrobes", "oak-wardrobes"] },
  { label: "Sofa Beds", to: "/collections/sofabeds", handle: "sofabeds" },
  { label: "Sofas", to: "/collections/sofas", handle: "sofas" },
  { label: "Bedroom Set", to: "/collections/bedroom-set", handle: "bedroom-set" },
  { label: "Beds & Mattresses", to: "/collections/beds-for-sale-uk", handle: "beds-for-sale-uk" },
  { label: "Outdoor & Garden", to: "/collections/outdoor-and-garden-furniture", handle: "outdoor-and-garden-furniture" },
  { label: "Sales", to: "/collections/sales-and-discount", handle: "sales-and-discount", hot: true },
  { label: "Inspirations & Ideas", to: "/blogs/style" },
];

export const TOP_CATEGORIES = [
  { title: "Wardrobes", to: "/collections/sliding-wardrobes", image: COLLECTION_IMG.wardrobes },
  { title: "Sofas", to: "/collections/sofas", image: COLLECTION_IMG.sofas },
  { title: "Sofa Beds", to: "/collections/sofabeds", image: COLLECTION_IMG.sofabeds },
  { title: "Bedroom Sets", to: "/collections/bedroom-set", image: COLLECTION_IMG.bedroom },
  { title: "Beds", to: "/collections/beds-for-sale-uk", image: COLLECTION_IMG.beds },
  { title: "Outdoor", to: "/collections/outdoor-and-garden-furniture", image: COLLECTION_IMG.outdoor },
  { title: "Sales", to: "/collections/sales-and-discount", image: COLLECTION_IMG.sale },
];

export const BEST_SELLERS = products.slice(0, 13).map((p) => p.handle);

export const STORE = {
  name: "MN Furniture LTD",
  phone: "020 3633 0786",
  phoneHref: "tel:02036330786",
  email: "info@mnfurnitureltd.co.uk",
  salesEmail: "sales@mnfurnitureltd.co.uk",
  hours: "Mon–Sat 9:00–18:00 · Sun 10:00–16:00",
  socials: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
    youtube: "https://www.youtube.com/",
    pinterest: "https://www.pinterest.com/",
    x: "https://x.com/",
  },
  freeShippingThreshold: 0,
};
