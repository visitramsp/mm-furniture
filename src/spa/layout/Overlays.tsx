import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUp, ChevronDown, Gift, Headphones, MessageCircle, Phone, Scale, Search, Send, ShoppingBag, Sparkles, Trash2, Truck, User, X } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { NAV, STORE, childCollections, money, products, TOP_CATEGORIES } from "../data/catalog";
import { cartTotals, useCart, useLists, useUI } from "../store";
import { Img, Price, Stars, ease } from "../components/ui";
import { scrollTo as smoothTo } from "./SmoothScroll";
import { QtyStepper, VariantPicker, WishButton, useAddToCart, useVariant } from "../components/product";

const backdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

function Drawer({ open, onClose, side = "right", children, width = "max-w-md" }: { open: boolean; onClose: () => void; side?: "left" | "right"; children: React.ReactNode; width?: string }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div {...backdrop} onClick={onClose} className="absolute inset-0 bg-navy/50 backdrop-blur-sm" />
          <motion.aside
            data-lenis-prevent
            initial={{ x: side === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? "100%" : "-100%" }}
            transition={{ duration: 0.5, ease }}
            className={clsx("absolute top-0 flex h-full w-full flex-col bg-white shadow-lift", width, side === "right" ? "right-0" : "left-0")}
          >
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Mobile menu ------------------------------ */
export function MobileMenu() {
  const { menuOpen, setMenu } = useUI();
  const [exp, setExp] = useState<string | null>(null);
  const close = () => setMenu(false);
  return (
    <Drawer open={menuOpen} onClose={close} side="left" width="max-w-sm">
      <div className="flex items-center justify-between border-b border-grey-100 p-5">
        <span className="font-heading text-lg font-extrabold">Menu</span>
        <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full hover:bg-grey-100" aria-label="Close"><X /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {NAV.map((n, i) => {
          const kids = n.handle ? childCollections(n.handle) : [];
          return (
            <motion.div key={n.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.15 }} className="border-b border-grey-100 last:border-0">
              <div className="flex items-center">
                <Link onClick={close} to={n.to} className={clsx("flex-1 px-3 py-4 font-heading font-bold", n.hot && "text-danger")}>{n.label}</Link>
                {kids.length > 0 && (
                  <button onClick={() => setExp(exp === n.label ? null : n.label)} className="grid h-10 w-10 place-items-center" aria-label="Expand">
                    <ChevronDown className={clsx("transition", exp === n.label && "rotate-180")} size={18} />
                  </button>
                )}
              </div>
              <AnimatePresence>
                {exp === n.label && (
                  <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-3 pl-4">
                    {kids.map((k) => (
                      <li key={k.handle}>
                        <Link onClick={close} to={`/collections/${k.handle}`} className="block rounded-lg px-3 py-2 text-sm text-grey-600 hover:bg-grey-50 hover:text-accent-text">{k.title}</Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      <div className="space-y-3 border-t border-grey-100 bg-grey-50 p-5">
        <Link onClick={close} to="/account" className="btn-dark w-full"><User size={16} /> My Account</Link>
        <a href={STORE.phoneHref} className="btn-outline w-full"><Phone size={16} /> {STORE.phone}</a>
      </div>
    </Drawer>
  );
}

/* ------------------------------ Search overlay ------------------------------ */
const POPULAR = ["Sliding wardrobe", "Corner sofa", "Sofa bed", "Ottoman bed", "Chesterfield", "Garden set"];

export function searchProducts(q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  const words = t.split(/\s+/);
  return products
    .map((p) => {
      const hay = [p.title, p.category, p.short, ...(p.colours?.map((c) => c.name) ?? []), ...p.collections].join(" ").toLowerCase();
      const score = words.reduce((s, w) => s + (hay.includes(w) ? 1 : 0) + (p.title.toLowerCase().includes(w) ? 1 : 0), 0);
      return { p, score };
    })
    .filter((x) => x.score >= words.length)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

export function SearchOverlay() {
  const { searchOpen, setSearch } = useUI();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const results = useMemo(() => searchProducts(q).slice(0, 6), [q]);
  const close = () => setSearch(false);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 200);
    else setQ("");
  }, [searchOpen]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch(true); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    close();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[60]">
          <motion.div {...backdrop} onClick={close} className="absolute inset-0 bg-navy/60 backdrop-blur-md" />
          <motion.div
            data-lenis-prevent
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.55, ease }}
            className="relative max-h-[90vh] overflow-y-auto rounded-b-[2rem] bg-white shadow-lift"
          >
            <div className="container py-8">
              <form onSubmit={submit} className="flex items-center gap-3 border-b-2 border-navy pb-4">
                <Search className="text-accent" size={26} />
                <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search wardrobes, sofas, beds…" className="flex-1 bg-transparent font-heading text-2xl font-bold text-navy outline-none placeholder:text-grey-400 md:text-4xl" />
                <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full bg-grey-100 transition hover:rotate-90 hover:bg-grey-200" aria-label="Close search"><X /></button>
              </form>

              {!q && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-8 grid gap-8 md:grid-cols-2">
                  <div>
                    <p className="label">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((s) => (
                        <button key={s} onClick={() => setQ(s)} className="rounded-full border border-grey-200 px-4 py-2 text-sm font-semibold transition hover:border-accent hover:bg-accent-soft hover:text-accent-text">{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="label">Categories</p>
                    <div className="grid grid-cols-4 gap-3">
                      {TOP_CATEGORIES.slice(0, 4).map((c) => (
                        <Link key={c.to} to={c.to} onClick={close} className="group text-center">
                          <Img src={c.image} alt={c.title} width={200} className="aspect-square rounded-2xl" imgClassName="group-hover:scale-110" />
                          <p className="mt-1.5 text-xs font-semibold">{c.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {q && (
                <div className="mt-6">
                  <p className="label">{results.length ? `Products (${searchProducts(q).length})` : "No matches"}</p>
                  {results.length === 0 && <p className="text-grey-600">Nothing found for “{q}”. Try “wardrobe”, “sofa” or “bed”.</p>}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((p, i) => (
                      <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <Link to={`/products/${p.handle}`} onClick={close} className="flex items-center gap-4 rounded-2xl p-2 transition hover:bg-grey-50">
                          <Img src={p.images[0]} alt={p.title} width={160} className="h-20 w-20 shrink-0 rounded-xl" />
                          <div className="min-w-0">
                            <p className="line-clamp-1 font-semibold text-navy">{p.title}</p>
                            <Price price={p.price} compareAt={p.compareAt} size="sm" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  {results.length > 0 && (
                    <button onClick={submit} className="btn-dark mt-6">View all results <ArrowRight size={16} /></button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Cart drawer ------------------------------ */
export function CartDrawer() {
  const { cartOpen, setCart } = useUI();
  const { items, setQty, remove, coupon } = useCart();
  const { subtotal, discount, total, count } = cartTotals(items, coupon);
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const close = () => setCart(false);
  const inCart = new Set(items.map((i) => i.productId));
  const upsell = products.filter((p) => !inCart.has(p.id) && p.category === "outdoor").slice(0, 2);
  const goal = 500;
  const pct = Math.min(100, (subtotal / goal) * 100);

  return (
    <Drawer open={cartOpen} onClose={close}>
      <div className="flex items-center justify-between border-b border-grey-100 p-5">
        <div className="flex items-center gap-2">
          <ShoppingBag size={20} />
          <span className="font-heading text-lg font-extrabold">Your Cart</span>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-bold text-accent-text">{count}</span>
        </div>
        <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full transition hover:rotate-90 hover:bg-grey-100" aria-label="Close cart"><X /></button>
      </div>

      {items.length > 0 && (
        <div className="border-b border-grey-100 bg-grey-50 px-5 py-3">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold">
            <Truck size={14} className="text-accent" />
            {subtotal >= goal ? <span className="text-success">You’ve unlocked free premium delivery 🎉</span> : <>Spend <b>{money(goal - subtotal)}</b> more for free premium delivery</>}
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-grey-200">
            <motion.div initial={{ width: 0 }} animate={{ width: pct + "%" }} transition={{ duration: 0.8, ease }} className="h-full rounded-full bg-gradient-to-r from-accent to-accent-dark" />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <motion.div initial={{ scale: 0.5, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }} className="mb-5 grid h-24 w-24 place-items-center rounded-full bg-accent-soft text-accent">
              <ShoppingBag size={40} />
            </motion.div>
            <p className="font-heading text-xl font-extrabold">Your cart is empty</p>
            <p className="mt-1 text-sm text-grey-600">Let’s find something you’ll love.</p>
            <button onClick={() => { close(); navigate("/collections/all"); }} className="btn-primary mt-6">Start shopping <ArrowRight size={16} /></button>
          </div>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {items.map((it) => (
                <motion.li key={it.key} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }} transition={{ duration: 0.35, ease }} className="flex gap-4">
                  <Link to={`/products/${it.handle}`} onClick={close}>
                    <Img src={it.image} alt={it.title} width={200} className="h-24 w-24 shrink-0 rounded-2xl" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link to={`/products/${it.handle}`} onClick={close} className="line-clamp-2 text-sm font-bold text-navy hover:text-accent-text">{it.title}</Link>
                      <button onClick={() => remove(it.key)} className="text-grey-400 transition hover:text-danger" aria-label="Remove"><Trash2 size={16} /></button>
                    </div>
                    <p className="mt-0.5 text-xs text-grey-600">{[it.colour, it.size, ...it.addons].filter(Boolean).join(" · ")}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QtyStepper small value={it.qty} onChange={(n) => setQty(it.key, n)} />
                      <span className="font-heading font-extrabold">{money(it.unitPrice * it.qty)}</span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        {items.length > 0 && upsell.length > 0 && (
          <div className="mt-8">
            <p className="label flex items-center gap-1.5"><Sparkles size={13} className="text-accent" /> Complete your home</p>
            <div className="space-y-2">
              {upsell.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-grey-100 p-2">
                  <Img src={p.images[0]} alt={p.title} width={120} className="h-14 w-14 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{p.title}</p>
                    <p className="text-xs font-bold text-accent-text">{money(p.price)}</p>
                  </div>
                  <button onClick={() => addToCart(p, { colour: p.colours?.[0]?.name, addons: [], qty: 1, unit: p.price }, false)} className="rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white transition hover:bg-accent">+ Add</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-grey-100 p-5">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-grey-600"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-success"><span>Discount ({coupon?.code})</span><span>-{money(discount)}</span></div>}
            <div className="flex justify-between text-grey-600"><span>Delivery</span><span className="font-semibold text-success">FREE</span></div>
            <div className="flex justify-between pt-2 font-heading text-lg font-extrabold"><span>Total</span><span>{money(total)}</span></div>
            <p className="text-xs text-grey-600">or 3 interest-free payments of <b>{money(total / 3)}</b> with Klarna</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => { close(); navigate("/cart"); }} className="btn-outline">View cart</button>
            <button onClick={() => { close(); navigate("/checkout"); }} className="btn-primary btn-shine">Checkout</button>
          </div>
        </div>
      )}
    </Drawer>
  );
}

/* ------------------------------ Quick view modal ------------------------------ */
export function QuickView() {
  const p = useUI((s) => s.quickView);
  const openQV = useUI((s) => s.openQuickView);
  return (
    <AnimatePresence>
      {p && (
        <div className="fixed inset-0 z-[70] grid place-items-center p-4">
          <motion.div {...backdrop} onClick={() => openQV(undefined)} className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />
          <QuickViewBody key={p.id} />
        </div>
      )}
    </AnimatePresence>
  );
}

function QuickViewBody() {
  const p = useUI((s) => s.quickView)!;
  const openQV = useUI((s) => s.openQuickView);
  const v = useVariant(p);
  const addToCart = useAddToCart();
  const [active, setActive] = useState(0);
  return (
    <motion.div
      data-lenis-prevent
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.45, ease }}
      className="relative grid max-h-[calc(100dvh-2rem)] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-3xl bg-white shadow-lift md:grid-cols-2"
    >
      <button onClick={() => openQV(undefined)} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white shadow-card transition hover:rotate-90" aria-label="Close"><X size={18} /></button>
      <div className="relative bg-grey-50 p-4">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Img src={p.images[active]} alt={p.title} width={900} className="aspect-square rounded-2xl" eager />
          </motion.div>
        </AnimatePresence>
        <div role="group" aria-label="Choose product image" className="mt-3 flex max-w-full snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {p.images.map((im, i) => (
            <button key={i} aria-label={`Show image ${i + 1}`} aria-pressed={active === i} onClick={() => setActive(i)} className={clsx("shrink-0 snap-start overflow-hidden rounded-xl border-2 transition", active === i ? "border-accent" : "border-transparent opacity-70 hover:opacity-100")}>
              <Img src={im} alt={`${p.title} view ${i + 1}`} width={150} className="h-16 w-16" />
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs text-grey-600"><Stars rating={p.rating} size={13} /> {p.rating} ({p.reviews} reviews)</div>
        <h3 className="mt-2 text-2xl font-extrabold">{p.title}</h3>
        <p className="mt-2 text-sm text-grey-600">{p.short}</p>
        <div className="my-5"><Price price={v.unit} compareAt={v.compare} size="lg" /></div>
        <VariantPicker p={p} v={v} />
        <div className="mt-6 grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:flex sm:gap-3">
          <QtyStepper value={v.qty} onChange={v.setQty} />
          <button onClick={() => { addToCart(p, v); openQV(undefined); }} className="btn-primary btn-shine col-span-3 row-start-2 h-12 w-full sm:col-auto sm:row-auto sm:flex-1"><ShoppingBag size={18} /> Add to cart</button>
          <WishButton p={p} className="!h-12 !w-12 border border-grey-200" />
        </div>
        <Link to={`/products/${p.handle}`} onClick={() => openQV(undefined)} className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-accent-text hover:underline">
          View full details <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

/* ------------------------------ Compare bar ------------------------------ */
export function CompareBar() {
  const ids = useLists((s) => s.compare);
  const clear = useLists((s) => s.clearCompare);
  const toggle = useLists((s) => s.toggleCompare);
  const list = products.filter((p) => ids.includes(p.id));
  const { pathname } = useLocation();
  return (
    <AnimatePresence>
      {list.length > 0 && pathname !== "/compare" && (
        <motion.div initial={{ y: 120 }} animate={{ y: 0 }} exit={{ y: 120 }} transition={{ duration: 0.45, ease }} className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl bg-navy p-3 text-white shadow-lift">
            <Scale size={20} className="ml-1 shrink-0 text-accent" />
            <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar">
              {list.map((p) => (
                <div key={p.id} className="relative shrink-0">
                  <Img src={p.images[0]} alt={p.title} width={100} className="h-12 w-12 rounded-lg" />
                  <button onClick={() => toggle(p.id)} className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-white text-navy" aria-label="Remove"><X size={11} /></button>
                </div>
              ))}
            </div>
            <button onClick={clear} className="text-xs text-white/70 hover:text-white">Clear</button>
            <Link to="/compare" className="btn-primary !px-4 !py-2.5">Compare ({list.length})</Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Live chat widget ------------------------------ */
type Msg = { from: "bot" | "me"; text: string };
const BOT_REPLIES: [RegExp, string][] = [
  [/deliver|shipping|when/i, "Most orders arrive in 3–5 working days. Items marked Fast Delivery can arrive within 48 hours. UK mainland delivery is free 🚚"],
  [/return|refund/i, "You have 30 days to return unused items. Just message us and we’ll arrange collection."],
  [/finance|klarna|instal|credit|pay/i, "You can split your order into 3 interest-free payments with Klarna or PayPal at checkout."],
  [/assembl|build/i, "We offer professional assembly as an add-on on most products, and have free assembly guides too."],
  [/track|order/i, "You can track your order on our Track Order page with your order number and email."],
  [/hi|hello|hey|salam/i, "Hi there 👋 How can I help with your furniture today?"],
];

export function ChatWidget() {
  const { chatOpen, setChat } = useUI();
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Hi 👋 I’m the MN Furniture assistant. Ask me about delivery, returns, finance or anything else." }]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (chatOpen && messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [msgs, typing, chatOpen]);
  useEffect(() => () => { if (replyTimer.current) clearTimeout(replyTimer.current); }, []);

  const send = (t: string) => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: t }]);
    setText("");
    setTyping(true);
    const reply = BOT_REPLIES.find(([r]) => r.test(t))?.[1] ?? `I'm a demo assistant and don't have an answer to that yet. For personalised support, please email ${STORE.email} or call ${STORE.phone}.`;
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: reply }]);
    }, 1100);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setChat(!chatOpen)}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-glow"
        aria-label="Live chat"
      >
        <AnimatePresence mode="wait">
          <motion.span key={String(chatOpen)} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
            {chatOpen ? <X /> : <MessageCircle />}
          </motion.span>
        </AnimatePresence>
        {!chatOpen && <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-accent/40" />}
      </motion.button>
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.35, ease }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-24 right-5 z-[65] flex h-[min(540px,calc(100dvh-7rem))] w-[calc(100%-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-grey-100 bg-white shadow-lift"
          >
            <div className="flex items-center gap-3 bg-navy p-4 text-white">
              <div className="relative grid h-10 w-10 place-items-center rounded-full bg-accent"><Headphones size={18} /><span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-navy" /></div>
              <div>
                <p className="font-heading font-bold">MN Support</p>
                <p className="text-xs text-white/70">Instant automated demo assistant</p>
              </div>
            </div>
            <div ref={messagesRef} role="log" aria-live="polite" className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-grey-50 p-4">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={clsx("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm", m.from === "me" ? "ml-auto rounded-br-sm bg-navy text-white" : "rounded-bl-sm bg-white shadow-soft")}>
                  {m.text}
                </motion.div>
              ))}
              {typing && (
                <div className="flex w-16 gap-1 rounded-2xl bg-white px-4 py-3 shadow-soft">
                  {[0, 1, 2].map((i) => <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} className="h-2 w-2 rounded-full bg-grey-400" />)}
                </div>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto border-t border-grey-100 px-3 pt-3 no-scrollbar">
              {["Delivery", "Returns", "Finance", "Track order"].map((s) => (
                <button key={s} onClick={() => send(s)} className="shrink-0 rounded-full border border-grey-200 px-3 py-1 text-xs font-semibold hover:border-accent">{s}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex gap-2 p-3">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" className="input !rounded-full !py-2.5" />
              <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-white" aria-label="Send"><Send size={16} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------ Newsletter popup ------------------------------ */
export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    try {
      if (localStorage.getItem("mn-nl-seen")) return;
    } catch { /* storage unavailable */ }
    const t = setTimeout(() => setOpen(true), 12000);
    return () => clearTimeout(t);
  }, []);
  const close = () => {
    setOpen(false);
    try { localStorage.setItem("mn-nl-seen", "1"); } catch { /* ignore */ }
  };
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] grid place-items-center p-4">
          <motion.div {...backdrop} onClick={close} className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.85, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 220, damping: 20 }} className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-lift md:grid-cols-2">
            <button onClick={close} className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow" aria-label="Close"><X size={16} /></button>
            <div className="relative hidden md:block">
              <Img src={TOP_CATEGORIES[1].image} alt="" width={700} className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
              <p className="absolute bottom-6 left-6 font-heading text-5xl font-extrabold text-white">£20<span className="block text-lg font-semibold text-accent-dark">OFF your first order</span></p>
            </div>
            <div className="p-8 md:p-10">
              <span className="eyebrow"><Gift size={13} /> Members only</span>
              <h3 className="mt-4 text-3xl font-extrabold">Get £20 off your first order</h3>
              <p className="mt-2 text-sm text-grey-600">Join our newsletter for early access to sales, new arrivals and home inspiration.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Please enter a valid email");
                  toast.success("You’re in! Use code WELCOME20 at checkout");
                  close();
                }}
                className="mt-6 space-y-3"
              >
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email address" className="input" />
                <button className="btn-primary btn-shine w-full">Unlock my £20 off</button>
              </form>
              <button onClick={close} className="mt-3 w-full text-xs text-grey-400 hover:text-grey-600">No thanks, I’ll pay full price</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Scroll progress + back to top ------------------------------ */
export function ScrollChrome() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  const [show, setShow] = useState(false);
  useEffect(() => scrollYProgress.on("change", (v) => setShow(v > 0.15)), [scrollYProgress]);
  return (
    <>
      <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-accent via-accent-dark to-accent" />
      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => smoothTo(0)}
            className="fixed bottom-24 right-6 z-40 grid h-11 w-11 place-items-center rounded-full bg-white text-navy shadow-card transition hover:-translate-y-1 hover:bg-navy hover:text-white"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

