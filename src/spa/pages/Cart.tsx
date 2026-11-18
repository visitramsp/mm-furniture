import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, ShoppingBag, Tag, Trash2, Truck, X } from "lucide-react";
import { toast } from "sonner";
import { money, products } from "../data/catalog";
import { cartTotals, useCart } from "../store";
import { Empty, Img, PageHero, Reveal, SectionHead, ease } from "../components/ui";
import { ProductCard, QtyStepper } from "../components/product";

export function CouponBox() {
  const { coupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState("");
  if (coupon)
    return (
      <div className="flex items-center justify-between rounded-2xl border border-dashed border-success bg-success-soft px-4 py-3 text-sm">
        <span className="flex items-center gap-2 font-bold text-success"><Tag size={15} /> {coupon.code} applied ({coupon.pct}% off)</span>
        <button onClick={removeCoupon} className="text-success hover:text-danger" aria-label="Remove coupon"><X size={16} /></button>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (applyCoupon(code)) { toast.success("Discount applied"); setCode(""); }
        else toast.error("That code isn’t valid");
      }}
      className="flex gap-2"
    >
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" className="input !py-2.5" />
      <button className="btn-dark !px-5 !py-2.5">Apply</button>
    </form>
  );
}

export default function CartPage() {
  const { items, setQty, remove, coupon, clear } = useCart();
  const { subtotal, discount, total, count } = cartTotals(items, coupon);
  const navigate = useNavigate();
  useEffect(() => { document.title = "Your Cart | MN Furniture"; }, []);
  const suggestions = products.filter((p) => !items.some((i) => i.productId === p.id)).slice(0, 4);

  return (
    <>
      <PageHero title="Your Cart" sub={count ? `${count} item${count > 1 ? "s" : ""} ready to go` : undefined} crumbs={[{ label: "Home", to: "/" }, { label: "Cart" }]} />
      <section className="container py-12">
        {items.length === 0 ? (
          <Empty icon={<ShoppingBag size={40} />} title="Your cart is empty" text="Looks like you haven’t added anything yet." action={<Link to="/collections/all" className="btn-primary">Start shopping <ArrowRight size={16} /></Link>} />
        ) : (
          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:gap-10">
            <div>
              <div className="hidden grid-cols-[1fr_140px_120px_40px] gap-4 border-b border-grey-200 pb-3 text-xs font-bold uppercase tracking-wider text-grey-400 md:grid">
                <span>Product</span><span>Quantity</span><span className="text-right">Total</span><span />
              </div>
              <AnimatePresence initial={false}>
                {items.map((it) => (
                  <motion.div key={it.key} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -80, height: 0 }} transition={{ duration: 0.4, ease }} className="grid min-w-0 grid-cols-[80px_minmax(0,1fr)] gap-3 border-b border-grey-200 py-5 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-4 md:grid-cols-[minmax(0,1fr)_140px_120px_40px] md:items-center md:py-6">
                    <div className="flex items-center gap-4 md:col-span-1">
                      <Link to={`/products/${it.handle}`}><Img src={it.image} alt={it.title} width={240} className="h-20 w-20 rounded-2xl sm:h-24 sm:w-24 md:h-28 md:w-28" /></Link>
                      <div className="hidden md:block">
                        <Link to={`/products/${it.handle}`} className="font-heading font-bold text-navy hover:text-accent-text">{it.title}</Link>
                        <p className="mt-1 text-sm text-grey-600">{[it.colour, it.size].filter(Boolean).join(" · ")}</p>
                        {it.addons.length > 0 && <p className="text-xs text-accent-text">+ {it.addons.join(", ")}</p>}
                        <p className="mt-1 text-sm font-semibold">{money(it.unitPrice)}</p>
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-col items-start gap-3 md:contents">
                      <div className="md:hidden">
                        <p className="break-words font-heading text-sm font-bold">{it.title}</p>
                        <p className="break-words text-xs text-grey-600">{[it.colour, it.size, ...it.addons].filter(Boolean).join(" · ")}</p>
                      </div>
                      <QtyStepper small value={it.qty} onChange={(n) => setQty(it.key, n)} />
                      <span className="font-heading text-lg font-extrabold md:text-right">{money(it.unitPrice * it.qty)}</span>
                      <button onClick={() => { remove(it.key); toast("Item removed"); }} className="grid h-9 w-9 place-items-center rounded-full text-grey-400 transition hover:bg-danger-soft hover:text-danger" aria-label="Remove"><Trash2 size={16} /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                <Link to="/collections/all" className="btn-ghost">← Continue shopping</Link>
                <button onClick={() => { clear(); toast("Cart cleared"); }} className="btn-ghost text-danger">Clear cart</button>
              </div>
            </div>

            <Reveal>
              <div className="sticky top-28 rounded-3xl bg-white p-7 shadow-card">
                <h2 className="text-xl font-extrabold">Order summary</h2>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-grey-600">Subtotal</span><span className="font-semibold">{money(subtotal)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span className="font-semibold">-{money(discount)}</span></div>}
                  <div className="flex justify-between"><span className="text-grey-600">Delivery</span><span className="font-semibold text-success">FREE</span></div>
                </div>
                <div className="my-5"><CouponBox /></div>
                <p className="-mt-2 mb-5 text-xs text-grey-400">Try WELCOME20, MN10 or SALE15</p>
                <div className="flex items-baseline justify-between border-t border-grey-200 pt-5">
                  <span className="font-heading text-lg font-bold">Total</span>
                  <motion.span key={total} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="font-heading text-3xl font-extrabold">{money(total)}</motion.span>
                </div>
                <p className="mt-1 text-right text-xs text-grey-600">Incl. VAT · or 3 × {money(total / 3)} with Klarna</p>
                <button onClick={() => navigate("/checkout")} className="btn-primary btn-shine mt-6 h-14 w-full !text-base"><Lock size={16} /> Secure checkout</button>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-grey-50 p-4 text-xs text-grey-600">
                  <Truck className="shrink-0 text-accent" size={20} /> Free delivery to UK mainland. Most orders arrive in 3–5 working days.
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </section>
      <section className="section !pt-0">
        <div className="container">
          <SectionHead title="You might also like" />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {suggestions.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
          </div>
        </div>
      </section>
    </>
  );
}
