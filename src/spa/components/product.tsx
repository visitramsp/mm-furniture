import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Eye, Heart, Minus, Plus, Scale, ShoppingBag, Zap } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import type { Product } from "../data/types";
import { discountPct, money } from "../data/catalog";
import { useCart, useLists, useUI } from "../store";
import { Img, Price, Stars, ease } from "./ui";

/* ---------- variant selection logic shared by product page & quick view ---------- */
export function useVariant(p: Product) {
  const defaultSize = p.sizes?.find((s) => s.delta === 0) ?? p.sizes?.[0];
  const [colour, setColour] = useState(p.colours?.[0]?.name);
  const [size, setSize] = useState(defaultSize?.label);
  const [addons, setAddons] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  const sizeObj = p.sizes?.find((s) => s.label === size);
  const unit = useMemo(() => {
    const base = p.price + (sizeObj?.delta ?? 0);
    const extra = (p.addons ?? []).filter((a) => addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
    return Math.round((base + extra) * 100) / 100;
  }, [p, sizeObj, addons]);
  const compare = p.compareAt ? p.compareAt + (sizeObj?.delta ?? 0) : undefined;

  const toggleAddon = (id: string) => setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  return { colour, setColour, size, setSize, sizeObj, addons, toggleAddon, setAddons, qty, setQty, unit, compare };
}

export function useAddToCart() {
  const add = useCart((s) => s.add);
  const setCart = useUI((s) => s.setCart);
  return (p: Product, v: { colour?: string; size?: string; addons: string[]; qty: number; unit: number }, open = true) => {
    add({
      productId: p.id,
      handle: p.handle,
      title: p.title,
      image: p.images[0],
      unitPrice: v.unit,
      qty: v.qty,
      colour: v.colour,
      size: v.size,
      addons: (p.addons ?? []).filter((a) => v.addons.includes(a.id)).map((a) => a.label),
    });
    toast.success(`${p.title} added to cart`, { description: [v.colour, v.size].filter(Boolean).join(" · ") });
    if (open) setTimeout(() => setCart(true), 250);
  };
}

export function VariantPicker({ p, v }: { p: Product; v: ReturnType<typeof useVariant> }) {
  return (
    <div className="space-y-6">
      {p.colours && (
        <div>
          <p className="label">
            Colour: <span className="normal-case tracking-normal text-navy">{v.colour}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {p.colours.map((c) => (
              <motion.button
                key={c.name}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => v.setColour(c.name)}
                title={c.name}
                aria-label={c.name}
                className={clsx("relative grid h-10 w-10 place-items-center rounded-full ring-offset-2 transition", v.colour === c.name ? "ring-2 ring-accent" : "ring-1 ring-grey-200 hover:ring-grey-400")}
              >
                <span className="h-8 w-8 rounded-full shadow-inner" style={{ background: c.hex }} />
                {v.colour === c.name && (
                  <motion.span layoutId={`sw-${p.id}`} className="absolute inset-0 grid place-items-center">
                    <Check size={14} className={["White", "Cream", "Beige"].includes(c.name) ? "text-navy" : "text-white"} strokeWidth={3} />
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {p.sizes && p.sizes.length > 1 && (
        <div>
          <p className="label">
            Size / Option: <span className="normal-case tracking-normal text-navy">{v.size}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {p.sizes.map((s) => (
              <button
                key={s.label}
                onClick={() => v.setSize(s.label)}
                className={clsx("relative rounded-xl border px-4 py-2.5 text-sm font-semibold transition", v.size === s.label ? "border-navy text-white" : "border-grey-200 bg-white text-ink hover:border-navy")}
              >
                {v.size === s.label && <motion.span layoutId={`size-${p.id}`} className="absolute inset-0 rounded-xl bg-navy" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{s.label}</span>
              </button>
            ))}
          </div>
          {v.sizeObj?.dims && <p className="mt-2 text-xs text-grey-600">Dimensions: {v.sizeObj.dims}</p>}
        </div>
      )}

      {p.addons && p.addons.length > 0 && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="label !mb-0">Extras</p>
            {v.addons.length > 0 && (
              <button onClick={() => v.setAddons([])} className="text-xs font-semibold text-grey-600 hover:text-danger">× Clear</button>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {p.addons.map((a) => {
              const on = v.addons.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => v.toggleAddon(a.id)}
                  className={clsx("flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition", on ? "border-accent bg-accent-soft" : "border-grey-200 bg-white hover:border-grey-400")}
                >
                  <span className={clsx("grid h-5 w-5 shrink-0 place-items-center rounded-md border transition", on ? "border-accent bg-accent text-white" : "border-grey-400")}>
                    {on && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="flex-1 font-semibold">{a.label}</span>
                  <span className="font-bold text-accent-text">+{money(a.price)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function QtyStepper({ value, onChange, small }: { value: number; onChange: (n: number) => void; small?: boolean }) {
  return (
    <div className={clsx("inline-flex items-center rounded-full border border-grey-200 bg-white", small ? "h-9" : "h-12")}>
      <button aria-label="Decrease" onClick={() => onChange(Math.max(1, value - 1))} className={clsx("grid place-items-center rounded-full transition hover:bg-grey-100", small ? "h-9 w-9" : "h-12 w-12")}>
        <Minus size={small ? 14 : 16} />
      </button>
      <motion.span key={value} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={clsx("text-center font-bold", small ? "w-6 text-sm" : "w-8")}>
        {value}
      </motion.span>
      <button aria-label="Increase" onClick={() => onChange(Math.min(10, value + 1))} className={clsx("grid place-items-center rounded-full transition hover:bg-grey-100", small ? "h-9 w-9" : "h-12 w-12")}>
        <Plus size={small ? 14 : 16} />
      </button>
    </div>
  );
}

export function WishButton({ p, className }: { p: Product; className?: string }) {
  const on = useLists((s) => s.wishlist.includes(p.id));
  const toggle = useLists((s) => s.toggleWish);
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggle(p.id);
        toast(added ? "Saved to wishlist" : "Removed from wishlist", { icon: added ? "❤️" : "🤍" });
      }}
      aria-label={on ? "Remove from wishlist" : "Add to wishlist"}
      className={clsx("grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-soft backdrop-blur transition hover:scale-110", className)}
    >
      <motion.span key={String(on)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
        <Heart size={18} className={on ? "fill-danger text-danger" : "text-navy"} />
      </motion.span>
    </motion.button>
  );
}

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const off = discountPct(p);
  const openQV = useUI((s) => s.openQuickView);
  const addToCart = useAddToCart();
  const navigate = useNavigate();
  const inCompare = useLists((s) => s.compare.includes(p.id));
  const toggleCompare = useLists((s) => s.toggleCompare);
  const simple = !p.sizes || p.sizes.length <= 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease }}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-grey-100 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative block aspect-[4/4.2] overflow-hidden bg-grey-50">
        <Img src={p.images[0]} alt={p.title} width={600} className="absolute inset-0" imgClassName="transition-transform !duration-[1200ms] group-hover:scale-110" />
        {p.images[1] && <Img src={p.images[1]} alt="" width={600} className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />}
        <Link to={`/products/${p.handle}`} aria-label={`View ${p.title}`} className="absolute inset-0 z-[1]" />
        <div className="pointer-events-none absolute left-2 top-2 z-[2] flex flex-col gap-1.5 sm:left-3 sm:top-3">
          {off > 0 && <span className="rounded-full bg-danger px-2.5 py-1 text-[11px] font-bold text-white shadow">-{off}%</span>}
          {p.badge && !p.badge.startsWith("-") && <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold text-white shadow">{p.badge}</span>}
        </div>
        <div className="absolute right-2 top-2 z-[3] flex flex-col gap-2 sm:right-3 sm:top-3">
          <WishButton p={p} />
          <motion.button
            initial={false}
            onClick={(e) => {
              e.preventDefault();
              const ok = toggleCompare(p.id);
              if (!ok) toast.error("You can compare up to 4 products");
            }}
            aria-label="Compare"
            className={clsx("grid h-9 w-9 place-items-center rounded-full shadow-soft transition-all duration-300 hover:scale-110 sm:h-10 sm:w-10", inCompare ? "bg-accent text-white" : "bg-white/95 text-navy")}
          >
            <Scale size={17} />
          </motion.button>
        </div>
        <div className="absolute inset-x-2 bottom-2 z-[3] flex gap-1.5 transition-all duration-300 sm:inset-x-3 sm:bottom-3 sm:translate-y-[130%] sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              openQV(p);
            }}
            className="glass flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full px-1 py-2 text-[10px] font-bold text-navy shadow-card transition hover:bg-white sm:gap-1.5 sm:py-2.5 sm:text-xs"
          >
            <Eye size={15} /> Quick view
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (simple) addToCart(p, { colour: p.colours?.[0]?.name, size: p.sizes?.[0]?.label, addons: [], qty: 1, unit: p.price });
              else navigate(`/products/${p.handle}`);
            }}
            className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full bg-accent px-1 py-2 text-[10px] font-bold text-white shadow-glow transition hover:bg-accent-hover sm:gap-1.5 sm:py-2.5 sm:text-xs"
          >
            <ShoppingBag size={15} /> {simple ? "Add" : "Options"}
          </button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-semibold">
          <span className={clsx("inline-flex items-center gap-1", p.fastDelivery ? "text-success" : "text-grey-600")}>
            {p.fastDelivery ? <Zap size={12} className="fill-success" /> : null}
            {p.fastDelivery ? "Fast Delivery" : "Delivery: 3-5 days"}
          </span>
          {p.colours && (
            <span className="flex -space-x-1">
              {p.colours.slice(0, 4).map((c) => (
                <span key={c.name} className="h-3.5 w-3.5 rounded-full ring-2 ring-white" style={{ background: c.hex }} title={c.name} />
              ))}
              {p.colours.length > 4 && <span className="pl-2 text-grey-400">+{p.colours.length - 4}</span>}
            </span>
          )}
        </div>
        <Link to={`/products/${p.handle}`} className="line-clamp-2 min-h-[2.7em] font-heading text-[13px] font-bold leading-snug text-navy transition hover:text-accent-text sm:text-[15px]">
          {p.title}
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-grey-600">
          <Stars rating={p.rating} size={12} /> ({p.reviews})
        </div>
        <div className="mt-auto pt-3">
          <Price price={p.price} compareAt={p.compareAt} size="sm" />
        </div>
      </div>
    </motion.article>
  );
}

export function ProductGrid({ items, cols = 4 }: { items: Product[]; cols?: 3 | 4 }) {
  return (
    <div className={clsx("grid grid-cols-2 gap-3 sm:gap-5", cols === 4 ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3")}>
      {items.map((p, i) => (
        <ProductCard key={p.id} p={p} index={i} />
      ))}
    </div>
  );
}
