import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { searchProducts } from "../layout/Overlays";
import { PageHero } from "../components/ui";
import { ActiveChips, FilterDrawer, ResultsGrid, Toolbar, useFilteredProducts } from "./Collection";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [text, setText] = useState(q);
  const base = useMemo(() => searchProducts(q), [q]);
  const s = useFilteredProducts(base);
  const [dense, setDense] = useState(true);
  const [drawer, setDrawer] = useState(false);
  useEffect(() => { setText(q); document.title = `Search: ${q} | MN Furniture`; }, [q]);

  return (
    <>
      <PageHero title={q ? `Results for “${q}”` : "Search"} sub={`${base.length} products found`} crumbs={[{ label: "Home", to: "/" }, { label: "Search" }]} />
      <section className="container py-10">
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={(e) => { e.preventDefault(); params.set("q", text); setParams(params); }}
          className="relative mx-auto mb-8 flex max-w-2xl flex-col gap-3 sm:mb-10 sm:block"
        >
          <SearchIcon className="pointer-events-none absolute left-5 top-4 text-grey-400" size={20} />
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search products…" className="input !rounded-full !py-4 !pl-14 !pr-4 text-base shadow-soft sm:!pr-32" />
          <button className="btn-primary w-full sm:absolute sm:right-1.5 sm:top-1.5 sm:w-auto">Search</button>
        </motion.form>
        <Toolbar s={s} count={s.list.length} dense={dense} setDense={setDense} openFilters={() => setDrawer(true)} />
        <ActiveChips s={s} />
        <ResultsGrid list={s.list} dense={dense} emptyAction={s.reset} />
      </section>
      <FilterDrawer open={drawer} onClose={() => setDrawer(false)} s={s} count={s.list.length} />
    </>
  );
}
