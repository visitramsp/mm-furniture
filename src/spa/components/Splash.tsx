/** Initial hydration fallback; deliberately non-blocking and free from perpetual animations. */
export default function Splash() {
  return (
    <div role="status" aria-label="Loading MN Furniture" className="mn-splash fixed inset-0 z-[100] grid place-items-center bg-[#f8f7f4]">
      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="mn-splash-orbit absolute -top-14 h-44 w-44 rounded-full border border-[#e9dfd4]" aria-hidden="true" />
        <div className="mn-splash-orbit absolute -top-9 h-32 w-32 rounded-full border border-dashed border-[#dfc9b5]" aria-hidden="true" />
        <div className="mn-splash-mark relative z-10 mb-7 grid h-20 w-20 place-items-center rounded-[1.7rem] bg-[#13243a] shadow-[0_22px_55px_rgba(19,36,58,.22)]">
          <span className="font-heading text-[24px] font-extrabold tracking-[-.09em] text-white">MN<span className="text-[#efa45d]">.</span></span>
        </div>
        <div className="font-heading text-xl font-extrabold tracking-[-.04em] text-[#13243a]">MN Furniture</div>
        <div className="mt-1 text-[10px] font-bold uppercase tracking-[.32em] text-[#9a897e]">Thoughtfully made for living</div>
        <div className="mt-9 h-[3px] w-40 overflow-hidden rounded-full bg-[#e6ddd4]"><div className="mn-splash-progress h-full rounded-full bg-[#dd8440]" /></div>
        <span className="sr-only">Loading the store</span>
      </div>
    </div>
  );
}
