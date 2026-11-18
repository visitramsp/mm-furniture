export type Swatch = { name: string; hex: string };
export type SizeOption = { label: string; delta: number; dims?: string };
export type AddOn = { id: string; label: string; price: number };

export type Product = {
  id: string;
  handle: string;
  title: string;
  category: "wardrobes" | "sofas" | "sofabeds" | "bedroom" | "beds" | "outdoor";
  collections: string[];
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  images: string[];
  colours?: Swatch[];
  sizes?: SizeOption[];
  addons?: AddOn[];
  badge?: string;
  stock: number;
  fastDelivery?: boolean;
  short: string;
  description: string[];
  features: string[];
  specs: Record<string, string>;
  material?: string;
};

export type Collection = {
  handle: string;
  title: string;
  image?: string;
  blurb?: string;
  parent?: string;
};

export type CartItem = {
  key: string;
  productId: string;
  handle: string;
  title: string;
  image: string;
  unitPrice: number;
  qty: number;
  colour?: string;
  size?: string;
  addons: string[];
};
