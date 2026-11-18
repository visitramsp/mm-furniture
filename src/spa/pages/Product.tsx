import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CircleCheck, CreditCard, Mail, Maximize2, RotateCcw, Scale, Share2, ShieldCheck, ShoppingBag, Star, Truck, Zap } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { getCollection, getProduct, money, products, STORE, discountPct } from "../data/catalog";
import type { Product } from "../data/types";
import { useCart, useLists, useUI } from "../store";
import { Breadcrumbs, Img, Price, Reveal, SectionHead, Stars, ease } from "../components/ui";
import { ProductCard, QtyStepper, VariantPicker, WishButton, useAddToCart, useVariant } from "../components/product";
import NotFound from "./NotFound";

/* ---------------- Gallery with hover zoom + lightbox ---------------- */
function Gallery({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [light, setLight] = useState(false);
  const n = p.images.length;
  const go = (d: number) => { setDir(d); setI((x) => (x + d + n) % n); };

  useEffect(() => {
    if (!light) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [light]);

  useEffect(() => {
    if (!light) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLight(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="relative min-w-0">
        <div
          className="relative aspect-square cursor-zoom-in overflow-hidden rounded-[1.25rem] bg-white shadow-soft sm:rounded-[2rem]"
          onMouseMove={(e) => {
            if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setZoom(null)}
          onClick={() => setLight(true)}
          role="button"
          tabIndex={0}
          aria-label={`Open fullscreen image of ${p.title}`}
          onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setLight(true); } }}
        >
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.5, ease }}
              drag={n > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
              className="absolute inset-0"
            >
              <div className="h-full w-full transition-transform duration-200" style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}>
                <Img src={p.images[i]} alt={p.title} width={1400} className="h-full" eager />
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
            {discountPct(p) > 0 && <span className="rounded-full bg-danger px-3 py-1 text-xs font-bold text-white">-{discountPct(p)}%</span>}
            {p.badge && !p.badge.startsWith("-") && <span className="rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">{p.badge}</span>}
          </div>
          <span className="glass absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-bold text-navy">{i + 1} / {n}</span>
          <span className="glass pointer-events-none absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full text-navy"><Maximize2 size={16} /></span>
        </div>
        {n > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-card transition hover:bg-navy hover:text-white sm:left-3 sm:h-11 sm:w-11" aria-label="Previous image"><ArrowLeft size={18} /></button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-card transition hover:bg-navy hover:text-white sm:right-3 sm:h-11 sm:w-11" aria-label="Next image"><ArrowRight size={18} /></button>
          </>
        )}
      </div>

      {/* Accessible image selector below the main image: scrollable, with a visible active state. */}
      {n > 1 && <div className="min-w-0 rounded-2xl border border-grey-100 bg-white/90 p-2 shadow-soft sm:p-3">
        <div className="mb-2 flex items-center justify-between px-1"><span className="text-xs font-bold uppercase tracking-widest text-grey-600">Product gallery</span><span className="text-xs font-semibold text-grey-400">{i + 1} of {n}</span></div>
        <div role="group" aria-label="Select product image" className="flex max-w-full snap-x gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:thin] sm:gap-3">
          {p.images.map((im, k) => <button key={`${p.id}-${k}`} type="button" aria-label={`Show image ${k + 1}`} aria-pressed={i === k} onClick={() => { setDir(k > i ? 1 : -1); setI(k); setZoom(null); }} className={clsx("relative shrink-0 snap-start overflow-hidden rounded-xl border-2 bg-grey-50 p-0.5 transition-all focus-visible:outline-offset-2", i === k ? "border-accent shadow-[0_0_0_2px_rgba(242,140,40,.16)]" : "border-transparent opacity-75 hover:border-grey-200 hover:opacity-100")}>
            <Img src={im} alt={`${p.title} view ${k + 1}`} width={180} className="h-16 w-16 rounded-lg sm:h-20 sm:w-20" />
            {i === k && <span className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">✓</span>}
          </button>)}
        </div>
      </div>}

      {typeof document !== "undefined" && createPortal(<AnimatePresence>
        {light && (
          <motion.div role="dialog" aria-modal="true" aria-label={`${p.title} image gallery`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex h-[100dvh] flex-col overflow-hidden bg-[#070d19]/98 backdrop-blur-xl">
            <div className="flex items-center justify-between p-5 text-white">
              <span className="font-semibold">{i + 1} / {n}</span>
              <button onClick={() => setLight(false)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:rotate-90 hover:bg-white/20" aria-label="Close">×</button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 py-4 sm:px-20">
              <AnimatePresence mode="wait">
                <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex h-full min-h-0 w-full max-w-6xl items-center justify-center">
                  <Img src={p.images[i]} alt={p.title} width={1800} eager className="flex h-full min-h-0 w-full items-center justify-center rounded-2xl !bg-transparent" imgClassName="!h-full !w-full !object-contain" />
                </motion.div>
              </AnimatePresence>
              <button onClick={() => go(-1)} className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Previous"><ArrowLeft /></button>
              <button onClick={() => go(1)} className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Next"><ArrowRight /></button>
            </div>
            <div className="flex shrink-0 justify-center gap-2 overflow-x-auto px-4 pb-5">
              {p.images.map((im, k) => (
                <button key={k} onClick={() => setI(k)} className={clsx("overflow-hidden rounded-xl transition", k === i ? "ring-2 ring-accent" : "opacity-50")}>
                  <Img src={im} alt="" width={120} className="h-14 w-14" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  );
}

/* ---------------- Reviews (stored in browser) ---------------- */
type Review = { name: string; rating: number; text: string; date: string };
const SEED_REVIEWS: Review[] = [
  { name: "Hannah L.", rating: 5, text: "Looks great and was easier to put together than I expected. Really solid for the price.", date: "2026-10-02" },
  { name: "Mohammed A.", rating: 5, text: "Delivered on time, driver brought it in. Exactly as pictured.", date: "2026-09-18" },
  { name: "Chris D.", rating: 4, text: "Very happy overall. Instructions could be clearer but it’s sturdy.", date: "2026-08-27" },
];

function Reviews({ p }: { p: Product }) {
  const key = `mn-reviews-${p.id}`;
  const [mine, setMine] = useState<Review[]>(() => {
    try { return JSON.parse(localStorage.getItem(key) ?? "[]"); } catch { return []; }
  });
  const [form, setForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const all = [...mine, ...SEED_REVIEWS];
  const dist = [5, 4, 3, 2, 1].map((r) => ({ r, pct: r === 5 ? 78 : r === 4 ? 16 : r === 3 ? 4 : r === 2 ? 1 : 1 }));

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r: Review = { name: String(fd.get("name") || "Anonymous"), text: String(fd.get("text") || ""), rating, date: new Date().toISOString().slice(0, 10) };
    if (r.text.length < 10) return toast.error("Please write at least 10 characters");
    const next = [r, ...mine];
    setMine(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
    setForm(false);
    toast.success("Thanks! Your review has been posted");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
      <div className="rounded-3xl bg-grey-50 p-6">
        <p className="font-heading text-6xl font-extrabold text-navy">{p.rating}</p>
        <Stars rating={p.rating} size={18} className="mt-2" />
        <p className="mt-1 text-sm text-grey-600">Based on {p.reviews + mine.length} reviews</p>
        <div className="mt-5 space-y-2">
          {dist.map((d) => (
            <div key={d.r} className="flex items-center gap-3 text-xs font-semibold">
              <span className="w-6">{d.r}★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-grey-200">
                <motion.div initial={{ width: 0 }} whileInView={{ width: d.pct + "%" }} viewport={{ once: true }} transition={{ duration: 1, ease }} className="h-full rounded-full bg-accent" />
              </div>
              <span className="w-8 text-right text-grey-600">{d.pct}%</span>
            </div>
          ))}
        </div>
        <button onClick={() => setForm(!form)} className="btn-dark mt-6 w-full">Write a review</button>
      </div>
      <div>
        <AnimatePresence>
          {form && (
            <motion.form onSubmit={submit} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mb-6 space-y-4 rounded-3xl border border-grey-200 p-6">
                <div>
                  <p className="label">Your rating</p>
                  <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <motion.button type="button" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} key={r} onMouseEnter={() => setHover(r)} onClick={() => setRating(r)} aria-label={`${r} stars`}>
                        <Star size={28} className={(hover || rating) >= r ? "fill-accent text-accent" : "text-grey-200"} />
                      </motion.button>
                    ))}
                  </div>
                </div>
                <input name="name" placeholder="Your name" className="input" />
                <textarea name="text" rows={4} placeholder="What did you think?" className="input resize-none" />
                <button className="btn-primary">Post review</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        <div className="divide-y divide-grey-100">
          {all.map((r, i) => (
            <Reveal key={i} delay={i * 0.05} className="py-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft font-bold text-accent-text">{r.name[0]}</div>
                <div className="flex-1">
                  <p className="font-bold">{r.name} <span className="ml-1 inline-flex items-center gap-1 text-xs font-semibold text-success"><CircleCheck size={12} /> Verified</span></p>
                  <p className="text-xs text-grey-600">{new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <Stars rating={r.rating} />
              </div>
              <p className="mt-3 text-grey-600">{r.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Tabs ---------------- */
function InfoTabs({ p }: { p: Product }) {
  const tabs = ["Description", "Additional information", "Delivery", "Reviews"];
  const [t, setT] = useState(0);
  return (
    <section className="section bg-white">
      <div className="container">
        <LayoutGroup>
          <div className="mb-10 flex gap-1 overflow-x-auto border-b border-grey-200 no-scrollbar">
            {tabs.map((label, k) => (
              <button key={label} onClick={() => setT(k)} className={clsx("relative shrink-0 px-5 pb-4 font-heading font-bold transition", t === k ? "text-navy" : "text-grey-400 hover:text-navy")}>
                {label}{label === "Reviews" && ` (${p.reviews})`}
                {t === k && <motion.span layoutId="ptab" className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-accent" />}
              </button>
            ))}
          </div>
        </LayoutGroup>
        <AnimatePresence mode="wait">
          <motion.div key={t} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }}>
            {t === 0 && (
              <div className="grid gap-10 lg:grid-cols-2">
                <div className="prose-mn">
                  {p.description.map((d, k) => <p key={k}>{d}</p>)}
                  <h3>Care</h3>
                  <p>Wipe with a soft, slightly damp cloth. Avoid harsh chemicals and direct heat. See our <Link to="/pages/care-and-maintenance" className="font-semibold text-accent-text underline">care guide</Link>.</p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {p.features.map((f, k) => (
                    <motion.li key={f} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.06 }} className="flex items-start gap-3 rounded-2xl bg-grey-50 p-4 text-sm font-semibold">
                      <CircleCheck size={18} className="mt-0.5 shrink-0 text-accent" /> {f}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
            {t === 1 && (
              <div className="grid gap-8 lg:grid-cols-2">
                <table className="w-full overflow-hidden rounded-2xl text-sm">
                  <tbody>
                    {Object.entries({ ...p.specs, Material: p.material ?? "-", Colours: p.colours?.map((c) => c.name).join(", ") ?? "-" }).map(([k, v], idx) => (
                      <tr key={k} className={idx % 2 ? "bg-white" : "bg-grey-50"}>
                        <th className="w-1/3 px-5 py-3.5 text-left font-semibold text-grey-600">{k}</th>
                        <td className="px-5 py-3.5 font-semibold text-navy">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {p.sizes && p.sizes.some((s) => s.dims) && (
                  <table className="w-full text-sm">
                    <thead><tr className="bg-navy text-white"><th className="rounded-l-xl px-5 py-3 text-left">Size</th><th className="px-5 py-3 text-left">Dimensions</th><th className="rounded-r-xl px-5 py-3 text-right">Price</th></tr></thead>
                    <tbody>
                      {p.sizes.map((s) => (
                        <tr key={s.label} className="border-b border-grey-100">
                          <td className="px-5 py-3 font-bold">{s.label}</td>
                          <td className="px-5 py-3 text-grey-600">{s.dims ?? "-"}</td>
                          <td className="px-5 py-3 text-right font-bold">{money(p.price + s.delta)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {t === 2 && (
              <div className="prose-mn grid gap-x-12 lg:grid-cols-2">
                <div>
                  <h3>Coverage</h3>
                  <p>Free delivery to UK mainland. Surcharges apply to the Scottish Highlands & Islands, Northern Ireland, Isle of Wight, Isle of Man and the Channel Islands.</p>
                  <h3>Delivery window</h3>
                  <p>Most items arrive in 3–5 working days. You’ll get a 2-hour time slot by SMS the evening before.</p>
                </div>
                <div>
                  <h3>Bulky items</h3>
                  <p>Large items are delivered by a two-person team to the ground floor. Please check access and measure doorways first.</p>
                  <h3>Rescheduling & damage</h3>
                  <p>Rebook free up to 48 hours before. Late changes may carry a charge. Report any damage within 48 hours with photos and we’ll sort it.</p>
                </div>
              </div>
            )}
            {t === 3 && <Reviews p={p} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */
export default function ProductPage() {
  const { handle = "" } = useParams();
  const p = getProduct(handle);
  if (!p) return <NotFound />;
  return <ProductView key={p.id} p={p} />;
}

function ProductView({ p }: { p: Product }) {
  const v = useVariant(p);
  const addToCart = useAddToCart();
  const navigate = useNavigate();
  const pushRecent = useLists((s) => s.pushRecent);
  const toggleCompare = useLists((s) => s.toggleCompare);
  const inCompare = useLists((s) => s.compare.includes(p.id));
  const add = useCart((s) => s.add);
  const setCart = useUI((s) => s.setCart);
  const buyRef = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    pushRecent(p.id);
    document.title = `${p.title} | MN Furniture`;
  }, [p, pushRecent]);
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const eta = useMemo(() => {
    const f = (d: number) => { const x = new Date(); x.setDate(x.getDate() + d); return x.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };
    return p.fastDelivery ? `${f(1)} – ${f(2)}` : `${f(3)} – ${f(5)}`;
  }, [p]);

  const related = products.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 4);
  const col = getCollection(p.collections[0]);

  const buyNow = () => {
    add({ productId: p.id, handle: p.handle, title: p.title, image: p.images[0], unitPrice: v.unit, qty: v.qty, colour: v.colour, size: v.size, addons: (p.addons ?? []).filter((a) => v.addons.includes(a.id)).map((a) => a.label) });
    setCart(false);
    navigate("/checkout");
  };
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: p.title, url });
      else { await navigator.clipboard.writeText(url); toast.success("Link copied to clipboard"); }
    } catch { /* cancelled */ }
  };

  return (
    <>
      <section className="container pb-16 pt-6 md:pt-10">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, ...(col ? [{ label: col.title, to: `/collections/${col.handle}` }] : []), { label: p.title }]} />
        <div className="mt-6 grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10 xl:gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease }} className="lg:sticky lg:top-28 lg:self-start">
            <Gallery p={p} />
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}>
            <Item>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <a href="#reviews" className="flex items-center gap-1.5 text-grey-600 hover:text-navy"><Stars rating={p.rating} /> <b className="text-navy">{p.rating}</b> ({p.reviews} reviews)</a>
                {p.fastDelivery && <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success"><Zap size={12} /> Fast Delivery</span>}
              </div>
            </Item>
            <Item><h1 className="mt-3 break-words text-[clamp(1.65rem,5vw,2.5rem)] font-extrabold leading-tight">{p.title}</h1></Item>
            <Item><p className="mt-3 text-grey-600">{p.short}</p></Item>
            <Item>
              <div className="mt-6 rounded-3xl bg-white p-5 shadow-soft">
                <motion.div key={v.unit} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }}><Price price={v.unit} compareAt={v.compare} size="lg" /></motion.div>
                <p className="mt-2 flex items-center gap-2 text-sm text-grey-600">
                  <span className="rounded-md bg-[#ffb3c7] px-1.5 py-0.5 text-[11px] font-extrabold text-black">Klarna.</span>
                  Pay in 3 interest-free instalments of <b className="text-navy">{money(v.unit / 3)}</b>
                </p>
              </div>
            </Item>
            <Item>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span className="flex items-center gap-2 font-semibold text-success"><span className="relative flex h-2.5 w-2.5"><span className="absolute h-full w-full animate-ping rounded-full bg-success/60" /><span className="relative h-2.5 w-2.5 rounded-full bg-success" /></span>In stock</span>
                <span className="flex items-center gap-2 text-grey-600"><Truck size={16} className="text-accent" /> Estimated delivery <b className="text-navy">{eta}</b></span>
              </div>
              {p.stock < 10 && (
                <div className="mt-3">
                  <p className="text-xs font-bold text-danger">Hurry! Only {p.stock} left in stock</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-grey-200"><motion.div initial={{ width: 0 }} animate={{ width: `${p.stock * 10}%` }} transition={{ duration: 1.2, ease }} className="h-full rounded-full bg-gradient-to-r from-danger to-accent" /></div>
                </div>
              )}
            </Item>
            <Item><div className="mt-7"><VariantPicker p={p} v={v} /></div></Item>
            <Item>
              <div ref={buyRef} className="mt-8 grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:flex sm:gap-3">
                <QtyStepper value={v.qty} onChange={v.setQty} />
                <button onClick={() => addToCart(p, v)} className="btn-dark col-span-3 row-start-2 h-12 w-full !text-sm sm:col-auto sm:row-auto sm:flex-1 sm:!text-base"><ShoppingBag size={18} /> Add to cart</button>
                <WishButton p={p} className="!h-12 !w-12 border border-grey-200" />
              </div>
              <button onClick={buyNow} className="btn-primary btn-shine mt-3 h-14 w-full !text-base">Buy now · {money(v.unit * v.qty)}</button>
            </Item>
            <Item>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-grey-600">
                <button onClick={() => { if (!toggleCompare(p.id)) toast.error("You can compare up to 4 products"); }} className={clsx("flex items-center gap-2 transition hover:text-navy", inCompare && "text-accent-text")}><Scale size={16} /> {inCompare ? "Added to compare" : "Compare"}</button>
                <button onClick={share} className="flex items-center gap-2 transition hover:text-navy"><Share2 size={16} /> Share</button>
                <a href={`mailto:${STORE.salesEmail}?subject=${encodeURIComponent("Question about " + p.title)}`} className="flex items-center gap-2 transition hover:text-navy"><Mail size={16} /> Ask about this product</a>
              </div>
            </Item>
            <Item>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { i: Truck, t: "Free UK mainland delivery" },
                  { i: RotateCcw, t: "30-day easy returns" },
                  { i: ShieldCheck, t: "Price match promise" },
                  { i: CreditCard, t: "0% finance available" },
                ].map((b) => (
                  <div key={b.t} className="flex flex-col items-center gap-2 rounded-2xl border border-grey-200 bg-white p-4 text-center text-xs font-semibold">
                    <b.i size={20} className="text-accent" /> {b.t}
                  </div>
                ))}
              </div>
            </Item>
          </motion.div>
        </div>
      </section>

      <div id="reviews"><InfoTabs p={p} /></div>

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead eyebrow="You may also like" title="Related products" />
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {related.map((r, i) => <ProductCard key={r.id} p={r} index={i} />)}
            </div>
          </div>
        </section>
      )}

      <AnimatePresence>
        {sticky && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ duration: 0.4, ease }} className="glass fixed inset-x-0 bottom-0 z-40 border-t border-grey-200 shadow-lift">
            <div className="container flex min-w-0 items-center gap-2 py-2.5 pr-20 sm:gap-4 sm:py-3 sm:pr-24">
              <Img src={p.images[0]} alt="" width={120} className="hidden h-12 w-12 rounded-xl sm:block" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{p.title}</p>
                <p className="text-xs text-grey-600">{[v.colour, v.size].filter(Boolean).join(" · ")}</p>
              </div>
              <span className="hidden font-heading text-lg font-extrabold sm:block">{money(v.unit)}</span>
              <button onClick={() => addToCart(p, v)} className="btn-primary shrink-0 !px-4"><ShoppingBag size={16} /> Add</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}>{children}</motion.div>;
}


