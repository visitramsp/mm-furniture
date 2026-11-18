import { AnimatePresence, LayoutGroup, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { ArrowLeft, ArrowRight, BadgePercent, ChevronDown, Clock, CreditCard, Headphones, Quote, ShieldCheck, Sparkles, Star, Truck, Zap } from "lucide-react";
import clsx from "clsx";
import { BANNERS, BEST_SELLERS, COLLECTION_IMG, TOP_CATEGORIES, getProduct, img, money, products, collections } from "../data/catalog";
import { blogs, TESTIMONIALS } from "../data/content";
import { useLists } from "../store";
import { Counter, Img, Reveal, SectionHead, Stars, ease, staggerChild, staggerParent } from "../components/ui";
import { ProductCard } from "../components/product";

/* ------------------------------ HERO ------------------------------ */
const SLIDES = [
  { eyebrow: "Winter Sale is live", title: ["Up to ", "50% off", " everything for your home"], text: "Wardrobes, sofas, sofa beds and beds from £199.50. Free UK delivery & 30-day returns.", cta: "/collections/sales-and-discount", image: BANNERS.slide1, product: "chicago-white-wardrobe" },
  { eyebrow: "New season sofas", title: ["Sink into ", "comfort", " that lasts"], text: "Corner sofas, recliners and Chesterfields at prices that make sense.", cta: "/collections/sofas", image: BANNERS.slide2, product: "camden-chesterfield-black-3-2-sofa-set" },
  { eyebrow: "Storage made beautiful", title: ["Wardrobes that ", "fit", " your space"], text: "Sliding, mirrored and LED wardrobes in six finishes and six sizes.", cta: "/collections/sliding-wardrobes", image: BANNERS.sale, product: "lisbon-sliding-door-wardrobe-black" },
];

function Hero() {
  const [idx, setIdx] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 15 });
  const sy = useSpring(my, { stiffness: 60, damping: 15 });
  const tx = useTransform(sx, (v) => v * -20);
  const ty = useTransform(sy, (v) => v * -20);
  const tx2 = useTransform(sx, (v) => v * 30);
  const ty2 = useTransform(sy, (v) => v * 30);
  const s = SLIDES[idx];
  const prod = getProduct(s.product)!;

  return (
    <section
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative overflow-hidden bg-navy text-white grain"
    >
      <div className="absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-accent/25 blur-[120px]" />
      <div className="absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-navy-500/60 blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="container relative grid min-h-[560px] min-w-0 items-center gap-8 py-12 sm:gap-10 sm:py-14 lg:min-h-[620px] lg:grid-cols-2 lg:py-20">
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={idx} initial="hidden" animate="show" exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }} variants={staggerParent}>
              <motion.span variants={staggerChild} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent-dark backdrop-blur">
                <Sparkles size={13} /> {s.eyebrow}
              </motion.span>
              <motion.h1 variants={staggerChild} className="mt-6 break-words text-[clamp(2.4rem,9vw,4rem)] font-extrabold leading-[1.07] !text-white sm:text-6xl xl:text-7xl">
                {s.title[0]}
                <span className="relative inline-block text-accent">
                  {s.title[1]}
                  <svg viewBox="0 0 200 20" className="absolute -bottom-2 left-0 w-full">
                    <path d="M2 15 Q 100 0 198 12" fill="none" stroke="#f7b26b" strokeWidth="4" strokeLinecap="round" className="draw-line" />
                  </svg>
                </span>
                {s.title[2]}
              </motion.h1>
              <motion.p variants={staggerChild} className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">{s.text}</motion.p>
              <motion.div variants={staggerChild} className="mt-8 flex flex-wrap gap-3">
                <Link to={s.cta} className="btn-primary btn-shine !px-6 !py-3.5 text-sm sm:!px-8 sm:!py-4 sm:text-base">Shop now <ArrowRight size={18} /></Link>
                <Link to="/collections/all" className="btn !px-6 !py-3.5 border border-white/20 text-sm text-white hover:bg-white hover:text-navy sm:!px-8 sm:!py-4 sm:text-base">Browse all</Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {products.slice(5, 9).map((p) => <Img key={p.id} src={p.images[0]} alt="" width={80} className="h-11 w-11 rounded-full ring-2 ring-navy" />)}
            </div>
            <div>
              <div className="flex items-center gap-1"><Stars rating={5} size={14} /> <b className="ml-1">4.8/5</b></div>
              <p className="text-sm text-white/60">from 120,000+ happy customers</p>
            </div>
          </motion.div>
        </div>

        <div className="relative h-[300px] min-w-0 sm:h-[520px]">
          <motion.div style={{ x: tx, y: ty }} className="absolute inset-0 lg:left-8">
            <Swiper modules={[Autoplay, EffectFade, Pagination]} effect="fade" speed={900} loop autoplay={{ delay: 5500, disableOnInteraction: false }} pagination={{ clickable: true }} onSlideChange={(sw) => setIdx(sw.realIndex)} className="h-full overflow-hidden rounded-[2rem] shadow-lift">
              {SLIDES.map((sl, i) => (
                <SwiperSlide key={i}>
                  <div className="relative h-full">
                    <Img src={sl.image} alt="" width={1200} className="absolute inset-0 h-full" imgClassName={clsx(idx === i && "animate-[kenburns_7s_ease-out_forwards]")} eager />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          <motion.div style={{ x: tx2, y: ty2 }} className="absolute -left-2 bottom-10 z-10 hidden w-64 animate-float sm:block lg:-left-6">
            <AnimatePresence mode="wait">
              <motion.div key={prod.id} initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, ease }}>
                <Link to={`/products/${prod.handle}`} className="glass flex items-center gap-3 rounded-2xl p-3 text-navy shadow-lift">
                  <Img src={prod.images[0]} alt={prod.title} width={150} className="h-16 w-16 shrink-0 rounded-xl" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{prod.title}</p>
                    <p className="text-sm"><b className="text-accent-text">{money(prod.price)}</b> <s className="text-xs text-grey-400">{money(prod.compareAt!)}</s></p>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div style={{ x: tx2, y: ty }} className="absolute -right-2 top-8 z-10 hidden sm:block">
            <div className="glass flex items-center gap-3 rounded-2xl p-3 pr-5 text-navy shadow-lift" style={{ animation: "float 7s ease-in-out infinite reverse" }}>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-success-soft text-success"><Truck size={20} /></div>
              <div>
                <p className="text-sm font-bold">Free Delivery</p>
                <p className="text-xs text-grey-600">48h on selected items</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Marquee ------------------------------ */
function MarqueeStrip() {
  const items = ["Free UK Delivery", "30-Day Easy Returns", "0% Interest Free Credit", "Price Match Promise", "120k+ Happy Customers", "Fast 48h Delivery", "Money Back Guarantee"];
  return (
    <div className="relative overflow-hidden border-y border-navy/10 bg-accent py-4 text-white">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-heading text-lg font-extrabold uppercase tracking-wide">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-10">{t} <Star size={16} className="fill-white" /></span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Categories ------------------------------ */
function Categories() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow="Top categories" title={<>Shop by <span className="text-gradient">room & style</span></>} sub="From space-saving wardrobes to statement sofas, find the right piece for every room." action={<Link to="/collections" className="btn-outline">All categories <ArrowRight size={16} /></Link>} />
        <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {TOP_CATEGORIES.map((c) => (
            <motion.div key={c.to} variants={staggerChild}>
              <Link to={c.to} className="group block text-center">
                <div className="relative mx-auto aspect-square overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-lift">
                  <Img src={c.image} alt={c.title} width={400} className="h-full" imgClassName="group-hover:scale-110 !duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute bottom-3 left-1/2 grid h-9 w-9 -translate-x-1/2 translate-y-12 place-items-center rounded-full bg-accent text-white transition-transform duration-500 group-hover:translate-y-0"><ArrowRight size={16} /></span>
                </div>
                <p className="mt-3 font-heading font-bold text-navy transition group-hover:text-accent-text">{c.title}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------ Promo bento ------------------------------ */
function PromoBento() {
  const tiles = [
    { title: "Sofa Bed Sale", off: "Up to 45% off", to: "/collections/sofa-bed-sale", img: COLLECTION_IMG.sofabeds, span: "md:col-span-2 md:row-span-2", big: true },
    { title: "Wardrobe Sale", off: "From £239", to: "/collections/wardrobe-sale", img: COLLECTION_IMG.wardrobes },
    { title: "Bed Sale", off: "Up to 67% off", to: "/collections/bed-sale", img: COLLECTION_IMG.beds },
    { title: "Sofa Sale", off: "Up to 50% off", to: "/collections/sofa-sale", img: COLLECTION_IMG.sofas, span: "md:col-span-2" },
  ];
  return (
    <section className="pb-16 md:pb-24">
      <div className="container grid auto-rows-[240px] gap-4 md:grid-cols-4">
        {tiles.map((t, i) => (
          <Reveal key={t.to} delay={i * 0.08} className={clsx("h-full", t.span)}>
            <Link to={t.to} className="group relative block h-full overflow-hidden rounded-[1.75rem]">
              <Img src={t.img} alt={t.title} width={t.big ? 1000 : 700} className="absolute inset-0 h-full" imgClassName="group-hover:scale-110 !duration-[1400ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
              <div className="absolute left-5 top-5 rounded-full bg-danger px-3 py-1 text-xs font-bold text-white"><BadgePercent size={12} className="mr-1 inline" />{t.off}</div>
              <div className="absolute bottom-0 p-6 text-white">
                <p className={clsx("font-heading font-extrabold", t.big ? "text-4xl md:text-5xl" : "text-2xl")}>{t.title}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                  Shop the sale
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-navy transition-all duration-300 group-hover:w-14 group-hover:bg-accent group-hover:text-white"><ArrowRight size={14} /></span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Best sellers (tabbed) ------------------------------ */
const TABS = [
  { k: "all", label: "All" },
  { k: "wardrobes", label: "Wardrobes" },
  { k: "sofas", label: "Sofas" },
  { k: "beds", label: "Beds" },
  { k: "sofabeds", label: "Sofa Beds" },
];
function BestSellers() {
  const [tab, setTab] = useState("all");
  const list = useMemo(() => BEST_SELLERS.map((h) => getProduct(h)!).filter((p) => tab === "all" || p.category === tab).slice(0, 8), [tab]);
  return (
    <section className="section bg-white">
      <div className="container">
        <SectionHead eyebrow="Best selling" title="Our customers’ favourites" sub="The pieces people keep coming back for. Rated and reviewed by thousands." />
        <LayoutGroup>
          <div className="mb-8 flex gap-2 overflow-x-auto no-scrollbar">
            {TABS.map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)} className={clsx("relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition", tab === t.k ? "text-white" : "text-navy hover:bg-grey-100")}>
                {tab === t.k && <motion.span layoutId="bs-tab" className="absolute inset-0 rounded-full bg-navy" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
          <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease }}>
                  <ProductCard p={p} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
        <div className="mt-12 text-center">
          <Link to="/collections/all" className="btn-dark btn-shine !px-8">View all products <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Countdown deal banner ------------------------------ */
function useCountdown() {
  const end = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
    d.setHours(23, 59, 59, 0);
    return d.getTime();
  }, []);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, end - now);
  return { d: Math.floor(diff / 864e5), h: Math.floor((diff / 36e5) % 24), m: Math.floor((diff / 6e4) % 60), s: Math.floor((diff / 1e3) % 60) };
}

function DealBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const t = useCountdown();
  const deal = getProduct("nova-grey-corner-sofa-bed")!;
  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-32">
      <motion.div style={{ y }} className="absolute inset-[-15%_0]">
        <Img src={deal.images[0]} alt="" width={1800} className="h-full" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/30" />
      <div className="container relative grid items-center gap-10 text-white lg:grid-cols-2">
        <Reveal>
          <span className="eyebrow !bg-white/10 !text-accent-dark"><Clock size={13} /> Deal of the week</span>
          <h2 className="mt-5 text-4xl font-extrabold !text-white md:text-6xl">{deal.title}</h2>
          <p className="mt-4 max-w-md text-white/70">{deal.short}</p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-heading text-5xl font-extrabold text-accent">{money(deal.price)}</span>
            <s className="text-xl text-white/50">{money(deal.compareAt!)}</s>
          </div>
          <div className="mt-8 flex gap-3">
            {[["Days", t.d], ["Hours", t.h], ["Mins", t.m], ["Secs", t.s]].map(([l, v]) => (
              <div key={l as string} className="glass !bg-white/10 grid w-20 place-items-center rounded-2xl border border-white/15 py-3">
                <AnimatePresence mode="popLayout">
                  <motion.span key={v as number} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="font-heading text-3xl font-extrabold">
                    {String(v).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{l}</span>
              </div>
            ))}
          </div>
          <Link to={`/products/${deal.handle}`} className="btn-primary btn-shine mt-8 !px-8 !py-4">Grab the deal <ArrowRight size={18} /></Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Stats ------------------------------ */
function Stats() {
  const stats = [
    { n: 120, s: "k+", label: "Happy customers", icon: Star },
    { n: 4.8, s: "/5", d: 1, label: "Average rating", icon: Sparkles },
    { n: 48, s: "h", label: "Fast delivery", icon: Zap },
    { n: 30, s: " days", label: "Easy returns", icon: ShieldCheck },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="group relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-card">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent-soft transition-transform duration-700 group-hover:scale-150" />
                <s.icon className="relative text-accent" />
                <p className="relative mt-5 font-heading text-4xl font-extrabold text-navy md:text-5xl"><Counter to={s.n} suffix={s.s} decimals={s.d ?? 0} /></p>
                <p className="relative mt-1 text-sm font-semibold text-grey-600">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Shop by colour ------------------------------ */
function ShopByColour() {
  const items = [
    { h: "white-wardrobes", hex: "#f4f4f2", label: "White" },
    { h: "grey-wardrobes", hex: "#8f9399", label: "Grey" },
    { h: "black-wardrobes", hex: "#1c1c1c", label: "Black" },
    { h: "oak-wardrobes", hex: "#c49a6c", label: "Oak" },
  ];
  const styles = collections.filter((c) => c.parent === "sliding-wardrobes" && c.image).slice(0, 4);
  return (
    <section className="section bg-white">
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <span className="eyebrow">Wardrobes</span>
            <h2 className="h-section mt-4">Shop by colour</h2>
            <p className="mt-3 text-grey-600">Match your wardrobe to your room. Every finish comes in sizes from 90 to 250cm.</p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {items.map((c, i) => (
              <Reveal key={c.h} delay={i * 0.06}>
                <Link to={`/collections/${c.h}`} className="group flex items-center gap-3 rounded-2xl border border-grey-200 p-3 transition hover:border-navy hover:shadow-card">
                  <span className="h-10 w-10 rounded-xl shadow-inner ring-1 ring-black/10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" style={{ background: c.hex }} />
                  <span className="font-heading font-bold">{c.label}</span>
                  <ArrowRight size={14} className="ml-auto -translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-8">
          {styles.map((c, i) => (
            <Reveal key={c.handle} delay={i * 0.08} className={i % 2 ? "translate-y-8" : ""}>
              <Link to={`/collections/${c.handle}`} className="group relative block aspect-[4/3] overflow-hidden rounded-3xl">
                <Img src={c.image!} alt={c.title} width={700} className="absolute inset-0 h-full" imgClassName="group-hover:scale-110 !duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                <p className="absolute bottom-4 left-5 right-5 font-heading text-lg font-bold text-white">{c.title}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Testimonials ------------------------------ */
function Testimonials() {
  return (
    <section className="section overflow-hidden">
      <div className="container">
        <SectionHead eyebrow="Reviews" title="Loved across the UK" sub="Real words from real homes." action={
          <div className="flex gap-2">
            <button className="t-prev grid h-12 w-12 place-items-center rounded-full border border-grey-200 bg-white transition hover:bg-navy hover:text-white" aria-label="Previous"><ArrowLeft size={18} /></button>
            <button className="t-next grid h-12 w-12 place-items-center rounded-full bg-navy text-white transition hover:bg-accent" aria-label="Next"><ArrowRight size={18} /></button>
          </div>
        } />
        <Swiper modules={[Navigation, Autoplay]} navigation={{ prevEl: ".t-prev", nextEl: ".t-next" }} autoplay={{ delay: 4000 }} loop spaceBetween={20} slidesPerView={1.1} breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} className="!overflow-visible">
          {TESTIMONIALS.map((t) => (
            <SwiperSlide key={t.name} className="!h-auto">
              <div className="flex h-full flex-col rounded-3xl bg-white p-8 shadow-soft transition duration-500 hover:shadow-card">
                <Quote className="text-accent" size={32} />
                <p className="mt-4 flex-1 text-lg leading-relaxed text-ink">“{t.text}”</p>
                <div className="mt-6 flex items-center gap-3 border-t border-grey-100 pt-5">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-navy font-heading font-bold text-white">{t.name[0]}</div>
                  <div className="flex-1">
                    <p className="font-bold">{t.name}</p>
                    <p className="text-xs text-grey-600">{t.city} · Verified buyer</p>
                  </div>
                  <Stars rating={t.rating} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

/* ------------------------------ Blog ------------------------------ */
function Inspiration() {
  return (
    <section className="section bg-white">
      <div className="container">
        <SectionHead eyebrow="Inspiration & ideas" title="Ideas for a better home" action={<Link to="/blogs/style" className="btn-outline">Read the blog <ArrowRight size={16} /></Link>} />
        <div className="grid gap-6 md:grid-cols-3">
          {blogs.map((b, i) => (
            <Reveal key={b.slug} delay={i * 0.1}>
              <Link to={`/blogs/style/${b.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-3xl">
                  <Img src={b.image} alt={b.title} width={800} className="aspect-[4/3]" imgClassName="group-hover:scale-110 !duration-1000" />
                  <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-navy">{b.tag}</span>
                </div>
                <p className="mt-5 text-xs font-semibold text-grey-600">{new Date(b.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {b.read} read</p>
                <h3 className="mt-2 text-xl font-bold leading-snug transition group-hover:text-accent-text">{b.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-accent-text">Read more <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ SEO / why us accordion ------------------------------ */
const WHY = [
  { icon: BadgePercent, t: "Affordable furniture without the compromise", d: "We sell direct, so you get well-built wardrobes, sofas and beds at prices well below the high street, with regular sales on top." },
  { icon: Sparkles, t: "Smart storage for every room", d: "Sliding and mirrored wardrobes, ottoman storage beds and corner sofa beds with storage chaises help small UK homes feel bigger." },
  { icon: Truck, t: "Free & fast UK delivery", d: "Free delivery to most UK mainland postcodes in 3–5 days. Items marked Fast Delivery can arrive in 48 hours." },
  { icon: Headphones, t: "24/7 customer support", d: "Questions before or after you buy? Chat, call or email us. We’re here to help." },
  { icon: CreditCard, t: "Flexible finance options", d: "Spread the cost with 0% interest instalments through Klarna or PayPal Pay in 3." },
];
function WhyUs() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section">
      <div className="container grid gap-12 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Img src={COLLECTION_IMG.bedroom} alt="Bedroom" width={1000} className="absolute inset-0 h-full" />
          </div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.7, ease }} className="glass absolute -bottom-6 right-6 rounded-3xl p-6 shadow-lift md:-right-6">
            <p className="font-heading text-4xl font-extrabold text-navy"><Counter to={120} suffix="k+" /></p>
            <p className="text-sm font-semibold text-grey-600">Satisfied customers</p>
          </motion.div>
        </Reveal>
        <div>
          <Reveal>
            <span className="eyebrow">Why MN Furniture</span>
            <h2 className="h-section mt-4">Furniture for homes & offices across the UK</h2>
          </Reveal>
          <div className="mt-8 space-y-3">
            {WHY.map((w, i) => (
              <Reveal key={w.t} delay={i * 0.05}>
                <div className={clsx("overflow-hidden rounded-2xl border transition", open === i ? "border-accent bg-white shadow-card" : "border-grey-200 bg-white/50")}>
                  <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center gap-4 p-5 text-left">
                    <span className={clsx("grid h-11 w-11 shrink-0 place-items-center rounded-xl transition", open === i ? "bg-accent text-white" : "bg-grey-100 text-navy")}><w.icon size={20} /></span>
                    <span className="flex-1 font-heading font-bold text-navy">{w.t}</span>
                    <ChevronDown className={clsx("transition-transform duration-300", open === i && "rotate-180")} size={18} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }}>
                        <p className="px-5 pb-5 pl-20 text-grey-600">{w.d}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentlyViewed() {
  const ids = useLists((s) => s.recent);
  const list = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean).slice(0, 4);
  if (list.length === 0) return null;
  return (
    <section className="section !pt-0">
      <div className="container">
        <SectionHead title="Recently viewed" />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {list.map((p, i) => <ProductCard key={p!.id} p={p!} index={i} />)}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useEffect(() => { document.title = "MN Furniture LTD | Wardrobes, Sofas, Sofa Beds & Beds UK"; }, []);
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <Categories />
      <PromoBento />
      <BestSellers />
      <DealBanner />
      <Stats />
      <ShopByColour />
      <Testimonials />
      <WhyUs />
      <Inspiration />
      <RecentlyViewed />
    </>
  );
}


