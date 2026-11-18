import { COLLECTION_IMG } from "./catalog";

export type Blog = { slug: string; title: string; date: string; read: string; tag: string; image: string; excerpt: string; body: { h?: string; p?: string; list?: string[] }[] };

export const blogs: Blog[] = [
  {
    slug: "benefits-of-3-door-and-4-door-wardrobes",
    title: "The Benefits of 3-Door and 4-Door Wardrobes: More Storage, Less Clutter",
    date: "2025-12-21", read: "5 min", tag: "Storage", image: COLLECTION_IMG.wardrobes,
    excerpt: "If your clothes keep spilling onto the chair, a wider wardrobe might be the simplest fix. Here's what extra doors really give you.",
    body: [
      { p: "Most bedrooms run out of storage long before they run out of floor space. A 3 or 4-door wardrobe uses the full width of a wall, so you get more hanging space and shelving without adding another piece of furniture." },
      { h: "Room for the whole household" },
      { p: "Wider wardrobes make it easy to split storage between two people, or keep everyday clothes separate from seasonal coats and bedding." },
      { list: ["Separate long and short hanging", "Dedicated shelves for folded knits", "Drawer space for accessories", "Space at the top for suitcases"] },
      { h: "Less clutter, calmer room" },
      { p: "When everything has a home, surfaces stay clear. One large wardrobe also looks tidier than two or three smaller units pushed together." },
      { h: "Measuring tips" },
      { p: "Measure wall width, ceiling height and the swing or slide space in front. Leave a few centimetres at the top for assembly, and check skirting boards and sockets." },
    ],
  },
  {
    slug: "sliding-wardrobes-for-apartments",
    title: "Sliding Wardrobes for Apartments: Space Efficiency Tips",
    date: "2025-12-21", read: "4 min", tag: "Small Spaces", image: "https://mnfurnitureltd.co.uk/cdn/shop/collections/Mirror-Door-Wardrobe_-3.jpg?v=1771251567",
    excerpt: "No door swing, more usable floor. Sliding wardrobes are made for flats. Here's how to get the most from one.",
    body: [
      { p: "Hinged doors need clear floor space to open. Sliding doors don't, which means you can place a bed or desk much closer to your wardrobe." },
      { h: "Pick mirrored doors" },
      { p: "Mirror panels bounce light around the room and double up as a full-length mirror, saving wall space." },
      { h: "Use the full height" },
      { p: "Choose a taller model and use the top shelf for less-used items. Add baskets to keep smaller things organised." },
      { list: ["Go floor-to-ceiling where possible", "Choose light finishes for small rooms", "Add LED lighting to see inside clearly"] },
    ],
  },
  {
    slug: "best-sofa-beds-for-multi-functional-spaces",
    title: "The Best Sofa Beds for Multi-Functional Spaces",
    date: "2025-12-21", read: "6 min", tag: "Living", image: COLLECTION_IMG.sofabeds,
    excerpt: "Home office by day, guest room by night. How to choose a sofa bed that's comfortable both ways.",
    body: [
      { p: "A good sofa bed should be a good sofa first. You'll sit on it far more often than you sleep on it, so seat comfort matters." },
      { h: "Mechanisms explained" },
      { list: ["Click-clack: back folds flat, quick and simple", "Pull-out: a separate bed frame slides out", "Corner sofa beds: extra seating plus storage"] },
      { h: "Size it right" },
      { p: "Measure the room with the bed open, not just closed. Leave walking space around it so guests aren't climbing over furniture." },
      { h: "Our picks" },
      { p: "Corner sofa beds with storage chaises work best in living rooms. Compact 2 seaters suit studies and box rooms." },
    ],
  },
];

export type InfoPage = { slug: string; title: string; intro: string; sections: { h: string; p?: string; list?: string[] }[] };

export const infoPages: InfoPage[] = [
  {
    slug: "about-us", title: "About MN Furniture", intro: "Quality home and office furniture at fair prices, delivered across the UK.",
    sections: [
      { h: "Who we are", p: "MN Furniture LTD is a UK furniture retailer focused on well-made wardrobes, sofas, sofa beds, beds and garden furniture. We keep prices fair by selling directly online." },
      { h: "What we promise", list: ["Free UK mainland delivery (exclusions apply)", "30-day easy returns", "Price match on identical items", "Friendly support 7 days a week"] },
    ],
  },
  {
    slug: "return-policy", title: "Return Policy", intro: "Changed your mind? You have 30 days to return most items.",
    sections: [
      { h: "30-day returns", p: "You can return unused items in original packaging within 30 days of delivery. Contact us first to arrange collection." },
      { h: "How refunds work", p: "Once the item is collected and checked, refunds go back to your original payment method within 5–10 working days." },
      { h: "Exceptions", list: ["Mattresses with broken hygiene seal", "Assembled items showing wear", "Made-to-order items"] },
    ],
  },
  {
    slug: "privacy-policy", title: "Privacy Policy", intro: "How we collect, use and protect your personal data.",
    sections: [
      { h: "What we collect", p: "Name, contact details, delivery address and order history, so we can process and deliver your orders." },
      { h: "How we use it", p: "To fulfil orders, provide support and, only with your consent, send offers. We never sell your data." },
      { h: "Your rights", p: "Under UK GDPR you can request access, correction or deletion of your data at any time by emailing us." },
    ],
  },
  {
    slug: "terms-of-use", title: "Terms of Use", intro: "The rules for using this website.",
    sections: [
      { h: "Using our site", p: "By browsing or buying from this site you agree to these terms. Content is for personal, non-commercial use." },
      { h: "Pricing", p: "We work hard to keep prices accurate. If an error is found we'll contact you before processing your order." },
    ],
  },
  {
    slug: "terms-conditions", title: "Terms & Conditions", intro: "Terms that apply to all orders placed with MN Furniture LTD.",
    sections: [
      { h: "Orders", p: "An order is accepted when we send dispatch confirmation. We may cancel orders affected by stock or pricing errors and refund in full." },
      { h: "Delivery", p: "Delivery is to ground floor only unless agreed. Someone over 18 must be present to sign." },
      { h: "Damage", p: "Please check items on delivery and report any damage within 48 hours with photos." },
    ],
  },
  {
    slug: "money-back-guarantee", title: "Money Back Guarantee", intro: "Shop with confidence. If it's not right, we'll make it right.",
    sections: [
      { h: "Our guarantee", p: "If your item arrives damaged, faulty or not as described, we'll replace it or refund you in full." },
      { h: "How to claim", list: ["Email photos within 48 hours", "Keep original packaging", "We arrange collection free of charge"] },
    ],
  },
  {
    slug: "free-delivery", title: "Free Delivery All Over the UK", intro: "Free delivery to most UK mainland addresses.",
    sections: [
      { h: "Delivery times", p: "Most items arrive in 3–5 working days. Items marked Fast Delivery can arrive within 48 hours." },
      { h: "Surcharge areas", list: ["Scottish Highlands & Islands", "Northern Ireland", "Isle of Wight, Isle of Man, Scilly Isles", "Channel Islands"] },
      { h: "On the day", p: "We send a 2-hour delivery window by SMS the evening before. Delivery is to ground floor." },
    ],
  },
  {
    slug: "care-and-maintenance", title: "Care and Maintenance of Furniture", intro: "Simple habits to keep your furniture looking new for years.",
    sections: [
      { h: "Wood & laminate", list: ["Dust with a soft dry cloth", "Wipe spills straight away", "Avoid direct heat and harsh sprays"] },
      { h: "Fabric & velvet", list: ["Vacuum weekly with a soft brush", "Blot, don't rub, spills", "Brush velvet in one direction"] },
      { h: "PU & faux leather", list: ["Wipe with a damp cloth", "Keep out of strong sunlight", "Condition every few months"] },
    ],
  },
  {
    slug: "interest-free-credit", title: "Interest Free Credit Option", intro: "Spread the cost with 0% interest instalments.",
    sections: [
      { h: "Pay in 3 with Klarna or PayPal", p: "Split your order into 3 interest-free payments. Choose the option at checkout, subject to approval." },
      { h: "Representative example", p: "£900 order: 3 monthly payments of £300. 0% APR. Total payable £900." },
      { h: "Eligibility", list: ["UK resident aged 18+", "Valid UK bank account", "Subject to credit check"] },
    ],
  },
  {
    slug: "assembly-instructions", title: "Assembly Instructions", intro: "Step-by-step help to build your furniture.",
    sections: [
      { h: "Before you start", list: ["Unpack in the room where it will stay", "Check all parts against the list", "Have a second person for large items", "Use a cordless screwdriver on low torque"] },
      { h: "Guides", p: "Choose a guide for your product type: Bed, Wardrobe or Sofa/Sofa Bed." },
      { h: "Need help?", p: "Book our professional assembly at checkout, or call our team for advice." },
    ],
  },
  {
    slug: "bed-assembly", title: "Bed Assembly Guide", intro: "Most beds take 30–60 minutes with two people.",
    sections: [{ h: "Steps", list: ["Attach side rails to headboard", "Fit the footboard", "Install centre rail and legs", "Lay out the slats and fix the ends", "Tighten all bolts once fully assembled"] }],
  },
  {
    slug: "wardrobe-assembly", title: "Wardrobe Assembly Guide", intro: "Allow 2–3 hours. Always fix to the wall.",
    sections: [{ h: "Steps", list: ["Build the carcass on its back", "Fix the back panel to square the frame", "Stand upright and attach anti-tip kit", "Fit runners and hang sliding doors", "Adjust doors until they glide evenly"] }],
  },
  {
    slug: "sofa-assembly", title: "Sofa / Sofa Bed Assembly Guide", intro: "Most sofas just need legs and back cushions fitted.",
    sections: [{ h: "Steps", list: ["Unwrap carefully. Don't use sharp blades near fabric", "Screw in the legs by hand", "Join corner sections with the connector brackets", "Fit back cushions", "For sofa beds, test the mechanism once"] }],
  },
  {
    slug: "faq", title: "Frequently Asked Questions", intro: "Quick answers to common questions.",
    sections: [
      { h: "How long does delivery take?", p: "Usually 3–5 working days, or 48 hours for Fast Delivery items." },
      { h: "Do you offer assembly?", p: "Yes, add Professional Assembly on the product page." },
      { h: "Can I pay in instalments?", p: "Yes, with Klarna or PayPal Pay in 3 at 0% interest." },
      { h: "Can I change my delivery date?", p: "Yes, up to 48 hours before. Late changes may carry a charge." },
    ],
  },
];

export const getInfoPage = (slug: string) => infoPages.find((p) => p.slug === slug);

export const TESTIMONIALS = [
  { name: "Sarah K.", city: "Manchester", text: "The wardrobe looks far more expensive than it was. Delivery was on time and the driver was lovely.", rating: 5 },
  { name: "James P.", city: "Birmingham", text: "Corner sofa is huge and really comfy. Took 10 minutes to set up.", rating: 5 },
  { name: "Aisha R.", city: "London", text: "Ordered the ottoman bed. Masses of storage and the gas lift works perfectly.", rating: 5 },
  { name: "Tom W.", city: "Leeds", text: "Price matched another site without any fuss. Good customer service.", rating: 4 },
  { name: "Priya S.", city: "Leicester", text: "The sofa bed is genuinely comfortable to sleep on. Guests loved it.", rating: 5 },
];
