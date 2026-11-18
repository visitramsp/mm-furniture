import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Check, ChevronDown, LayoutGrid, Grid3x3, SlidersHorizontal, X, PackageSearch } from "lucide-react";
import clsx from "clsx";
import { childCollections, getCollection, money, productsInCollection, discountPct } from "../data/catalog";
import type { Product } from "../data/types";
import { Empty, Img, PageHero, ease } from "../components/ui";
import { ProductCard } from "../components/product";
import NotFound from "./NotFound";

const SORTS = [
  { k: "featured", label: "Featured" },
  { k: "best", label: "Best selling" },
  { k: "price-asc", label: "Price: Low to High" },
  { k: "price-desc", label: "Price: High to Low" },
  { k: "discount", label: "Biggest discount" },
  { k: "rating", label: "Top rated" },
  { k: "az", label: "Alphabetically, A–Z" },
];
const PAGE = 8;

type Filters = { colours: string[]; min: number; max: number; sale: boolean; fast: boolean; rating: number; cats: string[] };

function sortList(list: Product[], k: string) {
  const l = [...list];
  switch (k) {
    case "best": return l.sort((a, b) => b.reviews - a.reviews);
    case "price-asc": return l.sort((a, b) => a.price - b.price);
    case "price-desc": return l.sort((a, b) => b.price - a.price);
    case "discount": return l.sort((a, b) => discountPct(b) - discountPct(a));
    case "rating": return l.sort((a, b) => b.rating - a.rating);
    case "az": return l.sort((a, b) => a.title.localeCompare(b.title));
    default: return l;
  }
}

export function useFilteredProducts(base: Product[]) {
  const [params, setParams] = useSearchParams();
  const sort = params.get("sort") ?? "featured";
  const bounds = useMemo(() => {
    const ps = base.map((p) => p.price);
    return { lo: Math.floor(Math.min(...ps, 0)), hi: Math.ceil(Math.max(...ps, 100)) };
  }, [base]);
  const initial: Filters = { colours: [], min: 0, max: bounds.hi, sale: false, fast: false, rating: 0, cats: [] };
  const [f, setF] = useState<Filters>(initial);
  useEffect(() => setF({ ...initial, max: bounds.hi }), [bounds.hi]); // eslint-disable-line react-hooks/exhaustive-deps

  const colours = useMemo(() => {
    const m = new Map<string, string>();
    base.forEach((p) => p.colours?.forEach((c) => m.set(c.name, c.hex)));
    return [...m.entries()];
  }, [base]);
  const cats = useMemo(() => [...new Set(base.map((p) => p.category))], [base]);

  const list = useMemo(() => {
    const out = base.filter(
      (p) =>
        p.price >= f.min &&
        p.price <= f.max &&
        (!f.colours.length || p.colours?.some((c) => f.colours.includes(c.name))) &&
        (!f.sale || discountPct(p) > 0) &&
        (!f.fast || p.fastDelivery) &&
        p.rating >= f.rating &&
        (!f.cats.length || f.cats.includes(p.category))
    );
    return sortList(out, sort);
  }, [base, f, sort]);

  const active =
    f.colours.length + (f.sale ? 1 : 0) + (f.fast ? 1 : 0) + (f.rating ? 1 : 0) + f.cats.length + (f.min > 0 || f.max < bounds.hi ? 1 : 0);
  const setSort = (k: string) => {
    params.set("sort", k);
    setParams(params, { replace: true });
  };
  return { list, f, setF, sort, setSort, bounds, colours, cats, active, reset: () => setF({ ...initial, max: bounds.hi }) };
}

const CAT_LABEL: Record<string, string> = { wardrobes: "Wardrobes", sofas: "Sofas", sofabeds: "Sofa Beds", bedroom: "Bedroom Sets", beds: "Beds & Mattresses", outdoor: "Outdoor" };

export function FilterPanel({ s }: { s: ReturnType<typeof useFilteredProducts> }) {
  const { f, setF, bounds, colours, cats } = s;
  const toggle = (key: "colours" | "cats", v: string) => setF({ ...f, [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] });
  return (
    <div className="space-y-2">
      <Group title="Price">
        <div className="px-1">
          <div className="relative h-1.5 rounded-full bg-grey-200">
            <div className="absolute h-full rounded-full bg-accent" style={{ left: `${(f.min / bounds.hi) * 100}%`, right: `${100 - (f.max / bounds.hi) * 100}%` }} />
          </div>
          <div className="relative -mt-1.5 h-4">
            <input type="range" min={0} max={bounds.hi} value={f.min} onChange={(e) => setF({ ...f, min: Math.min(+e.target.value, f.max - 10) })} className="range-thumb pointer-events-none absolute inset-0 w-full appearance-none bg-transparent" aria-label="Minimum price" />
            <input type="range" min={0} max={bounds.hi} value={f.max} onChange={(e) => setF({ ...f, max: Math.max(+e.target.value, f.min + 10) })} className="range-thumb pointer-events-none absolute inset-0 w-full appearance-none bg-transparent" aria-label="Maximum price" />
          </div>
          <div className="mt-3 flex justify-between text-sm font-semibold">
            <span className="rounded-lg bg-grey-100 px-3 py-1">{money(f.min)}</span>
            <span className="rounded-lg bg-grey-100 px-3 py-1">{money(f.max)}</span>
          </div>
        </div>
      </Group>
      {cats.length > 1 && (
        <Group title="Category">
          {cats.map((c) => <CheckRow key={c} on={f.cats.includes(c)} onClick={() => toggle("cats", c)} label={CAT_LABEL[c]} />)}
        </Group>
      )}
      {colours.length > 0 && (
        <Group title="Colour">
          <div className="flex flex-wrap gap-2">
            {colours.map(([name, hex]) => (
              <button key={name} onClick={() => toggle("colours", name)} className={clsx("flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-xs font-semibold transition", f.colours.includes(name) ? "border-navy bg-navy text-white" : "border-grey-200 hover:border-navy")}>
                <span className="h-5 w-5 rounded-full ring-1 ring-black/10" style={{ background: hex }} /> {name}
              </button>
            ))}
          </div>
        </Group>
      )}
      <Group title="Offers & delivery">
        <CheckRow on={f.sale} onClick={() => setF({ ...f, sale: !f.sale })} label="On sale" />
        <CheckRow on={f.fast} onClick={() => setF({ ...f, fast: !f.fast })} label="Fast delivery (48h)" />
      </Group>
      <Group title="Rating">
        {[4.5, 4].map((r) => <CheckRow key={r} on={f.rating === r} onClick={() => setF({ ...f, rating: f.rating === r ? 0 : r })} label={`${r}★ & up`} />)}
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-grey-200 py-4">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between font-heading font-bold text-navy">
        {title} <ChevronDown size={16} className={clsx("transition", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
            <div className="space-y-1 pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckRow({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left text-sm transition hover:text-accent-text">
      <span className={clsx("grid h-5 w-5 place-items-center rounded-md border transition", on ? "border-accent bg-accent text-white" : "border-grey-400")}>
        <AnimatePresence>{on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={12} strokeWidth={3} /></motion.span>}</AnimatePresence>
      </span>
      {label}
    </button>
  );
}

export function Toolbar({ s, count, dense, setDense, openFilters }: { s: ReturnType<typeof useFilteredProducts>; count: number; dense: boolean; setDense: (v: boolean) => void; openFilters: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6 flex items-center gap-3">
      <button onClick={openFilters} className="btn-outline !px-4 !py-2.5 lg:hidden">
        <SlidersHorizontal size={16} /> Filters {s.active > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] text-white">{s.active}</span>}
      </button>
      <p className="hidden text-sm text-grey-600 sm:block"><b className="text-navy">{count}</b> products</p>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <button type="button" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full border border-grey-200 bg-white px-4 py-2.5 text-sm font-semibold">
            <span className="hidden text-grey-600 sm:inline">Sort:</span> {SORTS.find((x) => x.k === s.sort)?.label}
            <ChevronDown size={14} className={clsx("transition", open && "rotate-180")} />
          </button>
          <AnimatePresence>
            {open && (
              <motion.ul initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-grey-100 bg-white p-1.5 shadow-lift">
                {SORTS.map((o) => (
                  <li key={o.k}>
                    <button type="button" onClick={() => { s.setSort(o.k); setOpen(false); }} className={clsx("flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-grey-50", s.sort === o.k && "font-bold text-accent-text")}>
                      {o.label} {s.sort === o.k && <Check size={14} />}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
        <div className="hidden rounded-full border border-grey-200 bg-white p-1 md:flex">
          <button onClick={() => setDense(false)} className={clsx("grid h-8 w-8 place-items-center rounded-full transition", !dense && "bg-navy text-white")} aria-label="3 columns"><LayoutGrid size={15} /></button>
          <button onClick={() => setDense(true)} className={clsx("grid h-8 w-8 place-items-center rounded-full transition", dense && "bg-navy text-white")} aria-label="4 columns"><Grid3x3 size={15} /></button>
        </div>
      </div>
    </div>
  );
}

export function ActiveChips({ s }: { s: ReturnType<typeof useFilteredProducts> }) {
  const { f, setF, bounds } = s;
  const chips: { label: string; clear: () => void }[] = [
    ...f.colours.map((c) => ({ label: c, clear: () => setF({ ...f, colours: f.colours.filter((x) => x !== c) }) })),
    ...f.cats.map((c) => ({ label: CAT_LABEL[c], clear: () => setF({ ...f, cats: f.cats.filter((x) => x !== c) }) })),
    ...(f.sale ? [{ label: "On sale", clear: () => setF({ ...f, sale: false }) }] : []),
    ...(f.fast ? [{ label: "Fast delivery", clear: () => setF({ ...f, fast: false }) }] : []),
    ...(f.rating ? [{ label: `${f.rating}★+`, clear: () => setF({ ...f, rating: 0 }) }] : []),
    ...(f.min > 0 || f.max < bounds.hi ? [{ label: `${money(f.min)} – ${money(f.max)}`, clear: () => setF({ ...f, min: 0, max: bounds.hi }) }] : []),
  ];
  if (!chips.length) return null;
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <AnimatePresence>
        {chips.map((c) => (
          <motion.button layout key={c.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={c.clear} className="flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-danger">
            {c.label} <X size={12} />
          </motion.button>
        ))}
      </AnimatePresence>
      <button onClick={s.reset} className="text-xs font-bold text-accent-text hover:underline">Clear all</button>
    </div>
  );
}

export function FilterDrawer({ open, onClose, s, count }: { open: boolean; onClose: () => void; s: ReturnType<typeof useFilteredProducts>; count: number }) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", escape);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", escape); };
  }, [open, onClose]);
  return (
    typeof document !== "undefined" ? createPortal(<AnimatePresence>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Filter products" className="fixed inset-0 z-[110] lg:hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-navy/50 backdrop-blur-sm" />
          <motion.div data-lenis-prevent initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.45, ease }} className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-[2rem] bg-white">
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-grey-200" />
            <div className="flex items-center justify-between px-6 py-4">
              <p className="font-heading text-lg font-extrabold">Filters</p>
              <button onClick={onClose} aria-label="Close"><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6"><FilterPanel s={s} /></div>
            <div className="grid grid-cols-2 gap-3 border-t border-grey-100 p-5">
              <button onClick={s.reset} className="btn-outline">Reset</button>
              <button onClick={onClose} className="btn-primary">Show {count}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>, document.body) : null
  );
}

export function ResultsGrid({ list, dense, emptyAction }: { list: Product[]; dense: boolean; emptyAction: () => void }) {
  const [shown, setShown] = useState(PAGE);
  useEffect(() => setShown(PAGE), [list]);
  if (!list.length)
    return <Empty icon={<PackageSearch size={40} />} title="No products match" text="Try removing a filter or widening your price range." action={<button onClick={emptyAction} className="btn-primary">Clear filters</button>} />;
  return (
    <>
      <motion.div layout className={clsx("grid grid-cols-2 gap-3 sm:gap-5", dense ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3")}>
        <AnimatePresence mode="popLayout">
          {list.slice(0, shown).map((p, i) => (
            <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35 }}>
              <ProductCard p={p} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <div className="mt-12 flex flex-col items-center gap-4">
        <p className="text-sm text-grey-600">Showing {Math.min(shown, list.length)} of {list.length}</p>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-grey-200">
          <motion.div animate={{ width: `${(Math.min(shown, list.length) / list.length) * 100}%` }} className="h-full bg-accent" />
        </div>
        {shown < list.length && <button onClick={() => setShown((n) => n + PAGE)} className="btn-dark btn-shine !px-10">Load more</button>}
      </div>
    </>
  );
}

export default function CollectionPage() {
  const { handle = "all" } = useParams();
  const col = getCollection(handle);
  const base = useMemo(() => productsInCollection(handle), [handle]);
  const s = useFilteredProducts(base);
  const [dense, setDense] = useState(false);
  const [drawer, setDrawer] = useState(false);
  useEffect(() => { if (col) document.title = `${col.title} | MN Furniture`; }, [col]);

  if (!col) return <NotFound />;
  const parent = col.parent ? getCollection(col.parent) : undefined;
  const kids = childCollections(col.parent ?? col.handle).filter((c) => c.image);

  return (
    <>
      <PageHero
        title={col.title}
        sub={col.blurb ?? parent?.blurb}
        image={col.image ?? parent?.image}
        crumbs={[{ label: "Home", to: "/" }, ...(parent ? [{ label: parent.title, to: `/collections/${parent.handle}` }] : []), { label: col.title }]}
      />

      {kids.length > 0 && (
        <div className="border-b border-grey-200 bg-white">
          <div className="container flex gap-3 overflow-x-auto py-5 no-scrollbar">
            {kids.map((k, i) => (
              <motion.div key={k.handle} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.3 }}>
                <Link to={`/collections/${k.handle}`} className={clsx("group flex shrink-0 items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-4 transition", k.handle === handle ? "border-navy bg-navy text-white" : "border-grey-200 hover:border-navy")}>
                  <Img src={k.image!} alt="" width={100} className="h-10 w-10 rounded-full" />
                  <span className="whitespace-nowrap text-sm font-semibold">{k.title}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <section className="container py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="flex items-center justify-between">
                <p className="font-heading text-lg font-extrabold">Filters</p>
                {s.active > 0 && <button onClick={s.reset} className="text-xs font-bold text-accent-text">Reset</button>}
              </div>
              <FilterPanel s={s} />
            </div>
          </aside>
          <div>
            <Toolbar s={s} count={s.list.length} dense={dense} setDense={setDense} openFilters={() => setDrawer(true)} />
            <ActiveChips s={s} />
            <ResultsGrid list={s.list} dense={dense} emptyAction={s.reset} />
          </div>
        </div>
      </section>
      <FilterDrawer open={drawer} onClose={() => setDrawer(false)} s={s} count={s.list.length} />
    </>
  );
}
