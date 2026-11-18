import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "../data/types";

/* ---------------- Cart ---------------- */
type CartState = {
  items: CartItem[];
  coupon?: { code: string; pct: number };
  add: (item: Omit<CartItem, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
};

export const COUPONS: Record<string, number> = { WELCOME20: 20, MN10: 10, SALE15: 15 };

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const key = [item.productId, item.colour, item.size, ...item.addons].join("|");
        const existing = get().items.find((i) => i.key === key);
        if (existing) set({ items: get().items.map((i) => (i.key === key ? { ...i, qty: i.qty + item.qty } : i)) });
        else set({ items: [...get().items, { ...item, key }] });
      },
      setQty: (key, qty) => set({ items: get().items.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)) }),
      remove: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      clear: () => set({ items: [], coupon: undefined }),
      applyCoupon: (code) => {
        const c = code.trim().toUpperCase();
        if (COUPONS[c]) { set({ coupon: { code: c, pct: COUPONS[c] } }); return true; }
        return false;
      },
      removeCoupon: () => set({ coupon: undefined }),
    }),
    { name: "mn-cart" }
  )
);

export const cartTotals = (items: CartItem[], coupon?: { pct: number }) => {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const discount = coupon ? (subtotal * coupon.pct) / 100 : 0;
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { subtotal, discount, total: subtotal - discount, count };
};

/* ---------------- Wishlist / recently viewed / compare ---------------- */
type ListState = {
  wishlist: string[];
  recent: string[];
  compare: string[];
  toggleWish: (id: string) => boolean;
  pushRecent: (id: string) => void;
  toggleCompare: (id: string) => boolean;
  clearCompare: () => void;
};
export const useLists = create<ListState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      recent: [],
      compare: [],
      toggleWish: (id) => {
        const has = get().wishlist.includes(id);
        set({ wishlist: has ? get().wishlist.filter((x) => x !== id) : [...get().wishlist, id] });
        return !has;
      },
      pushRecent: (id) => set({ recent: [id, ...get().recent.filter((x) => x !== id)].slice(0, 10) }),
      toggleCompare: (id) => {
        const has = get().compare.includes(id);
        if (!has && get().compare.length >= 4) return false;
        set({ compare: has ? get().compare.filter((x) => x !== id) : [...get().compare, id] });
        return true;
      },
      clearCompare: () => set({ compare: [] }),
    }),
    { name: "mn-lists" }
  )
);

/* ---------------- Account (demo, stored in the browser) ---------------- */
export type Address = { line1: string; line2?: string; city: string; postcode: string };
export type User = { name: string; email: string; password: string; phone?: string; address?: Address; newsletter?: boolean };
export type Order = {
  id: string;
  date: string;
  email: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: Address & { name: string; phone: string };
  delivery: string;
  payment: string;
  status: "Processing" | "Dispatched" | "Out for delivery" | "Delivered";
};

type AuthState = {
  users: User[];
  current?: string;
  orders: Order[];
  register: (u: User) => string | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  update: (patch: Partial<User>) => void;
  addOrder: (o: Order) => void;
};
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      orders: [],
      register: (u) => {
        const email = u.email.toLowerCase();
        if (get().users.some((x) => x.email === email)) return "An account with this email already exists.";
        set({ users: [...get().users, { ...u, email }], current: email });
        return null;
      },
      login: (email, password) => {
        const u = get().users.find((x) => x.email === email.toLowerCase());
        if (!u || u.password !== password) return "Incorrect email or password.";
        set({ current: u.email });
        return null;
      },
      logout: () => set({ current: undefined }),
      update: (patch) => set({ users: get().users.map((u) => (u.email === get().current ? { ...u, ...patch } : u)) }),
      addOrder: (o) => set({ orders: [o, ...get().orders] }),
    }),
    { name: "mn-auth" }
  )
);
export const useCurrentUser = () => useAuth((s) => s.users.find((u) => u.email === s.current));

/* ---------------- UI (not persisted) ---------------- */
type UIState = {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  chatOpen: boolean;
  quickView?: Product;
  setCart: (v: boolean) => void;
  setSearch: (v: boolean) => void;
  setMenu: (v: boolean) => void;
  setChat: (v: boolean) => void;
  openQuickView: (p?: Product) => void;
};
export const useUI = create<UIState>()((set) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  chatOpen: false,
  setCart: (v) => set({ cartOpen: v }),
  setSearch: (v) => set({ searchOpen: v }),
  setMenu: (v) => set({ menuOpen: v }),
  setChat: (v) => set({ chatOpen: v }),
  openQuickView: (p) => set({ quickView: p }),
}));
