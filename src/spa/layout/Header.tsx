import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, ChevronDown, Heart, Menu, Phone, Search, ShoppingBag, Truck, RotateCcw, Award, User } from "lucide-react";
import clsx from "clsx";
import { NAV, STORE, childCollections, getCollection, productsInCollection, money, BANNERS } from "../data/catalog";
import { cartTotals, useCart, useLists, useUI, useCurrentUser } from "../store";
import { Img, ease } from "../components/ui";

const MESSAGES = [
  { icon: Truck, text: "Free Shipping across UK mainland (exclusions apply)" },
  { icon: RotateCcw, text: "30-Day Easy Returns, no questions asked" },
  { icon: Award, text: "Over 120k Satisfied Customers" },
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % MESSAGES.length), 3500);
    return () => clearInterval(t);
  }, []);
  const M = MESSAGES[i];
  return (
    <div className="relative bg-navy text-white">
      <div className="container flex h-9 items-center justify-between text-xs">
        <a href={STORE.phoneHref} className="hidden items-center gap-1.5 text-white/80 transition hover:text-accent-dark md:flex">
          <Phone size={13} /> {STORE.phone}
        </a>
        <div className="relative flex h-full flex-1 items-center justify-center overflow-hidden md:flex-none">
          <AnimatePresence mode="wait">
            <motion.span key={i} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.4, ease }} className="flex items-center gap-2 font-medium">
              <M.icon size={14} className="text-accent" /> {M.text}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="hidden items-center gap-4 text-white/80 md:flex">
          <Link to="/pages/track-order" className="hover:text-accent-dark">Track Order</Link>
          <Link to="/pages/interest-free-credit" className="hover:text-accent-dark">0% Finance</Link>
          <Link to="/pages/contact-us" className="hover:text-accent-dark">Help</Link>
        </div>
      </div>
    </div>
  );
}

function MegaMenu({ handle, colours, onClose }: { handle: string; colours?: string[]; onClose: () => void }) {
  const parent = getCollection(handle)!;
  const kids = childCollections(handle).filter((c) => !colours?.includes(c.handle) && c.handle !== "chicago-wardrobe");
  const featured = productsInCollection(handle).slice(0, 2);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.99 }}
      transition={{ duration: 0.28, ease }}
      className="absolute left-0 right-0 top-full z-40 pt-3"
    >
      <div className="container">
        <div className="grid grid-cols-12 gap-8 overflow-hidden rounded-3xl border border-grey-100 bg-white p-8 shadow-lift">
          <div className="col-span-3">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-grey-400">Shop by type</p>
            <ul className="space-y-1">
              {kids.map((c, i) => (
                <motion.li key={c.handle} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                  <Link onClick={onClose} to={`/collections/${c.handle}`} className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-ink transition hover:bg-accent-soft hover:text-accent-text">
                    {c.title}
                    <ArrowRight size={14} className="-translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </motion.li>
              ))}
              <li>
                <Link onClick={onClose} to={`/collections/${handle}`} className="mt-2 inline-flex items-center gap-1 px-3 text-sm font-bold text-accent-text hover:underline">
                  View all {parent.title} <ArrowRight size={14} />
                </Link>
              </li>
            </ul>
            {colours && (
              <>
                <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-[0.15em] text-grey-400">Shop by colour</p>
                <div className="flex flex-wrap gap-2">
                  {colours.map((h) => {
                    const c = getCollection(h)!;
                    const col = { "white-wardrobes": "#f4f4f2", "grey-wardrobes": "#8f9399", "black-wardrobes": "#1c1c1c", "oak-wardrobes": "#c49a6c" }[h];
                    return (
                      <Link onClick={onClose} key={h} to={`/collections/${h}`} className="flex items-center gap-2 rounded-full border border-grey-200 px-3 py-1.5 text-xs font-semibold transition hover:border-accent">
                        <span className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ background: col }} />
                        {c.title.replace(" Wardrobes", "")}
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className="col-span-5 grid grid-cols-3 gap-3">
            {kids.filter((k) => k.image).slice(0, 6).map((c, i) => (
              <motion.div key={c.handle} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i + 0.05 }}>
                <Link onClick={onClose} to={`/collections/${c.handle}`} className="group block">
                  <Img src={c.image!} alt={c.title} width={300} className="aspect-square rounded-2xl" imgClassName="group-hover:scale-110 !duration-700" />
                  <p className="mt-2 text-center text-xs font-semibold text-ink group-hover:text-accent-text">{c.title}</p>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="col-span-4 flex flex-col gap-3">
            <Link onClick={onClose} to={`/collections/${handle}`} className="group relative block flex-1 overflow-hidden rounded-2xl">
              <Img src={handle === "bedroom-set" ? BANNERS.bedroomMenu : parent.image!} alt={parent.title} width={600} className="absolute inset-0 h-full" imgClassName="group-hover:scale-105 !duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              <div className="absolute bottom-0 p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-accent-dark">Up to 50% off</p>
                <p className="font-heading text-xl font-extrabold">{parent.title}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold">Shop now <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              {featured.map((p) => (
                <Link onClick={onClose} key={p.id} to={`/products/${p.handle}`} className="group flex items-center gap-2 rounded-xl bg-grey-50 p-2 transition hover:bg-accent-soft">
                  <Img src={p.images[0]} alt={p.title} width={120} className="h-12 w-12 shrink-0 rounded-lg" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">{p.title}</p>
                    <p className="text-xs font-bold text-accent-text">{money(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const count = useCart((s) => cartTotals(s.items).count);
  const wish = useLists((s) => s.wishlist.length);
  const user = useCurrentUser();
  const { setCart, setSearch, setMenu } = useUI();

  useEffect(() => {
    let frame = 0;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => { window.removeEventListener("scroll", check); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => setOpen(null), [pathname]);

  return (
    <header
      className={clsx("relative w-full border-b border-grey-100/70 transition-[background,box-shadow] duration-300", scrolled ? "bg-white/95 shadow-[0_12px_35px_rgba(15,30,61,.10)] backdrop-blur-xl" : "bg-white")}
      onMouseLeave={() => setOpen(null)}
    >
      <div className="container flex h-[72px] items-center gap-3 lg:h-[76px] lg:gap-4 min-[1680px]:max-w-[1600px]">
        <button onClick={() => setMenu(true)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-grey-100 min-[1680px]:hidden" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <Link to="/" className="group flex items-center gap-2.5">
          <motion.span whileHover={{ rotate: -8, scale: 1.05 }} className="grid h-10 w-10 place-items-center rounded-xl bg-navy font-heading text-sm font-extrabold text-white shadow-card">
            <span>MN<span className="text-accent">.</span></span>
          </motion.span>
          <span className="hidden whitespace-nowrap leading-none sm:block">
            <span className="block font-heading text-lg font-extrabold text-navy">MN Furniture</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-grey-400">LTD · Est. UK</span>
          </span>
        </Link>

        <nav className="mx-auto hidden min-w-0 items-center min-[1680px]:flex">
          {NAV.map((n) => (
            <div key={n.label} onMouseEnter={() => setOpen(n.handle ?? null)} onFocus={() => setOpen(n.handle ?? null)} className="relative">
              <NavLink
                to={n.to}
                className={({ isActive }) =>
                  clsx("group relative flex items-center gap-1 whitespace-nowrap px-3 py-6 text-sm font-semibold transition", isActive ? "text-accent-text" : "text-ink hover:text-accent-text", n.hot && "text-danger")
                }
              >
                {n.label}
                {n.handle && <ChevronDown size={14} className={clsx("transition-transform", open === n.handle && "rotate-180")} />}
                <span className="absolute inset-x-3 bottom-4 h-0.5 origin-left scale-x-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1 min-[1680px]:ml-0">
          <IconBtn label="Search" onClick={() => setSearch(true)}><Search size={20} /></IconBtn>
          <Link to="/account" aria-label="Account" className="relative hidden h-10 w-10 place-items-center rounded-full transition hover:bg-grey-100 sm:grid">
            <User size={20} />
            {user && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-success ring-2 ring-white" />}
          </Link>
          <Link to="/pages/my-wishlist" aria-label="Wishlist" className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-grey-100">
            <Heart size={20} />
            <Badge n={wish} />
          </Link>
          <IconBtn label="Cart" onClick={() => setCart(true)} className="bg-navy text-white hover:!bg-navy-600">
            <ShoppingBag size={19} />
            <Badge n={count} accent />
          </IconBtn>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-accent transition-[width] duration-200" style={{ width: scrolled ? "100%" : "0%", opacity: scrolled ? .65 : 0 }} />
      <AnimatePresence>
        {open && <MegaMenu key={open} handle={open} colours={NAV.find((n) => n.handle === open)?.colours} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </header>
  );
}

function IconBtn({ children, label, onClick, className }: { children: React.ReactNode; label: string; onClick: () => void; className?: string }) {
  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={onClick} aria-label={label} className={clsx("relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-grey-100", className)}>
      {children}
    </motion.button>
  );
}

function Badge({ n, accent }: { n: number; accent?: boolean }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          key={n}
          initial={{ scale: 0 }}
          animate={{ scale: [1.5, 1] }}
          exit={{ scale: 0 }}
          className={clsx("absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold text-white ring-2 ring-white", accent ? "bg-accent" : "bg-navy")}
        >
          {n}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
