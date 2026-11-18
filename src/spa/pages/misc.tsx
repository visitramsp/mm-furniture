import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Clock, Heart, Mail, MapPin, MessageCircle, Phone, Scale, Search, Send, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { collections, money, products, STORE, discountPct } from "../data/catalog";
import { blogs, getInfoPage, infoPages } from "../data/content";
import { useAuth, useLists, useUI } from "../store";
import { Empty, Img, PageHero, Reveal, Stars, ease, staggerChild, staggerParent } from "../components/ui";
import { ProductCard, useAddToCart } from "../components/product";
import { OrderTimeline } from "./OrderSuccess";

/* ------------------------------ Wishlist ------------------------------ */
export function WishlistPage() {
  const ids = useLists((s) => s.wishlist);
  const list = products.filter((p) => ids.includes(p.id));
  const addToCart = useAddToCart();
  const toggle = useLists((s) => s.toggleWish);
  useEffect(() => { document.title = "My Wishlist | MN Furniture"; }, []);
  return (
    <>
      <PageHero title="My Wishlist" sub={`${list.length} saved item${list.length === 1 ? "" : "s"}`} crumbs={[{ label: "Home", to: "/" }, { label: "Wishlist" }]} />
      <section className="container py-12">
        {list.length === 0 ? (
          <Empty icon={<Heart size={40} />} title="Your wishlist is empty" text="Tap the heart on any product to save it for later." action={<Link to="/collections/all" className="btn-primary">Explore products</Link>} />
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => { list.forEach((p) => addToCart(p, { colour: p.colours?.[0]?.name, size: p.sizes?.find((s) => s.delta === 0)?.label ?? p.sizes?.[0]?.label, addons: [], qty: 1, unit: p.price }, false)); toast.success("All items added to cart"); }}
                className="btn-dark"
              >
                <ShoppingBag size={16} /> Add all to cart
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {list.map((p, i) => (
                <motion.div key={p.id} layout exit={{ opacity: 0, scale: 0.9 }} className="relative">
                  <ProductCard p={p} index={i} />
                  <button onClick={() => toggle(p.id)} className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-danger-soft text-danger transition hover:bg-danger hover:text-white" aria-label="Remove"><Trash2 size={15} /></button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}

/* ------------------------------ Compare ------------------------------ */
export function ComparePage() {
  const ids = useLists((s) => s.compare);
  const toggle = useLists((s) => s.toggleCompare);
  const list = products.filter((p) => ids.includes(p.id));
  const addToCart = useAddToCart();
  const specKeys = [...new Set(list.flatMap((p) => Object.keys(p.specs)))];
  return (
    <>
      <PageHero title="Compare products" sub="See key details side by side." crumbs={[{ label: "Home", to: "/" }, { label: "Compare" }]} />
      <section className="container py-12">
        {list.length === 0 ? (
          <Empty icon={<Scale size={40} />} title="Nothing to compare" text="Use the compare button on product cards to add up to 4 items." action={<Link to="/collections/all" className="btn-primary">Browse products</Link>} />
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-white shadow-soft" data-lenis-prevent>
            <table className="w-full min-w-[700px] text-sm">
              <tbody>
                <tr>
                  <th className="w-44 p-5" />
                  {list.map((p, i) => (
                    <td key={p.id} className="p-5 align-top">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Link to={`/products/${p.handle}`}><Img src={p.images[0]} alt={p.title} width={400} className="aspect-square rounded-2xl" /></Link>
                        <p className="mt-3 font-heading font-bold">{p.title}</p>
                        <button onClick={() => toggle(p.id)} className="mt-1 text-xs font-semibold text-danger">Remove</button>
                      </motion.div>
                    </td>
                  ))}
                </tr>
                {[
                  ["Price", (p: (typeof list)[0]) => <b className="text-lg">{money(p.price)}</b>],
                  ["Discount", (p: (typeof list)[0]) => (discountPct(p) ? <span className="font-bold text-success">-{discountPct(p)}%</span> : "-")],
                  ["Rating", (p: (typeof list)[0]) => <span className="flex items-center gap-1"><Stars rating={p.rating} size={12} /> {p.rating}</span>],
                  ["Colours", (p: (typeof list)[0]) => p.colours?.map((c) => c.name).join(", ") ?? "-"],
                  ["Sizes", (p: (typeof list)[0]) => p.sizes?.map((s) => s.label).join(", ") ?? "-"],
                  ["Delivery", (p: (typeof list)[0]) => (p.fastDelivery ? "48h Fast" : "3–5 days")],
                  ...specKeys.map((k) => [k, (p: (typeof list)[0]) => p.specs[k] ?? "-"] as const),
                ].map(([label, fn], r) => (
                  <tr key={label as string} className={r % 2 ? "" : "bg-grey-50"}>
                    <th className="p-4 text-left font-semibold text-grey-600">{label as string}</th>
                    {list.map((p) => <td key={p.id} className="p-4">{(fn as (p: (typeof list)[0]) => React.ReactNode)(p)}</td>)}
                  </tr>
                ))}
                <tr>
                  <th />
                  {list.map((p) => (
                    <td key={p.id} className="p-5">
                      <button onClick={() => addToCart(p, { colour: p.colours?.[0]?.name, size: p.sizes?.find((s) => s.delta === 0)?.label ?? p.sizes?.[0]?.label, addons: [], qty: 1, unit: p.price })} className="btn-primary w-full">Add to cart</button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

/* ------------------------------ Blog ------------------------------ */
export function BlogList() {
  const [feat, ...rest] = blogs;
  useEffect(() => { document.title = "Inspirations & Ideas | MN Furniture"; }, []);
  return (
    <>
      <PageHero title="Inspirations & Ideas" sub="Tips, guides and ideas to help you make the most of your home." crumbs={[{ label: "Home", to: "/" }, { label: "Blog" }]} />
      <section className="container py-14">
        <Reveal>
          <Link to={`/blogs/style/${feat.slug}`} className="group grid overflow-hidden rounded-[2rem] bg-white shadow-soft transition hover:shadow-lift md:grid-cols-2">
            <Img src={feat.image} alt={feat.title} width={1200} className="aspect-[4/3] md:aspect-auto md:h-full" imgClassName="group-hover:scale-105 !duration-1000" />
            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className="eyebrow w-fit">Featured · {feat.tag}</span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight transition group-hover:text-accent-text">{feat.title}</h2>
              <p className="mt-4 text-grey-600">{feat.excerpt}</p>
              <p className="mt-6 flex items-center gap-2 text-xs font-semibold text-grey-400"><Clock size={13} /> {feat.read} read · {new Date(feat.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </Link>
        </Reveal>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {rest.map((b, i) => (
            <Reveal key={b.slug} delay={i * 0.1}>
              <Link to={`/blogs/style/${b.slug}`} className="group block overflow-hidden rounded-[2rem] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                <Img src={b.image} alt={b.title} width={900} className="aspect-[16/9]" imgClassName="group-hover:scale-105 !duration-1000" />
                <div className="p-7">
                  <span className="eyebrow">{b.tag}</span>
                  <h3 className="mt-3 text-xl font-bold transition group-hover:text-accent-text">{b.title}</h3>
                  <p className="mt-2 text-sm text-grey-600">{b.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const b = blogs.find((x) => x.slug === slug);
  useEffect(() => { if (b) document.title = `${b.title} | MN Furniture`; }, [b]);
  if (!b) return <NotFound />;
  const others = blogs.filter((x) => x.slug !== b.slug);
  const related = products.filter((p) => (b.tag === "Living" ? p.category === "sofabeds" : p.category === "wardrobes")).slice(0, 3);
  return (
    <>
      <PageHero title={b.title} sub={`${b.read} read · ${new Date(b.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`} image={b.image} crumbs={[{ label: "Home", to: "/" }, { label: "Blog", to: "/blogs/style" }, { label: b.tag }]} />
      <section className="container grid gap-12 py-14 lg:grid-cols-[1fr_340px]">
        <article className="prose-mn max-w-none rounded-[2rem] bg-white p-8 shadow-soft md:p-12">
          <p className="!text-lg !text-navy">{b.excerpt}</p>
          {b.body.map((blk, i) => (
            <Reveal key={i} y={14}>
              {blk.h && <h2>{blk.h}</h2>}
              {blk.p && <p>{blk.p}</p>}
              {blk.list && <ul>{blk.list.map((l) => <li key={l}>{l}</li>)}</ul>}
            </Reveal>
          ))}
        </article>
        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="label">Shop the article</p>
            <div className="space-y-3">
              {related.map((p) => (
                <Link key={p.id} to={`/products/${p.handle}`} className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-grey-50">
                  <Img src={p.images[0]} alt="" width={140} className="h-16 w-16 rounded-xl" />
                  <div><p className="text-sm font-bold">{p.title}</p><p className="text-sm font-bold text-accent-text">{money(p.price)}</p></div>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="label">More articles</p>
            {others.map((o) => <Link key={o.slug} to={`/blogs/style/${o.slug}`} className="block border-b border-grey-100 py-3 text-sm font-semibold last:border-0 hover:text-accent-text">{o.title}</Link>)}
          </div>
        </aside>
      </section>
    </>
  );
}

/* ------------------------------ Info pages ------------------------------ */
export function InfoPageView() {
  const { slug = "" } = useParams();
  const page = getInfoPage(slug);
  useEffect(() => { if (page) document.title = `${page.title} | MN Furniture`; }, [page]);
  if (!page) return <NotFound />;
  const groups = [
    { t: "Customer service", s: ["money-back-guarantee", "free-delivery", "care-and-maintenance", "interest-free-credit", "faq"] },
    { t: "Assembly", s: ["assembly-instructions", "bed-assembly", "wardrobe-assembly", "sofa-assembly"] },
    { t: "Legal", s: ["terms-conditions", "terms-of-use", "return-policy", "privacy-policy", "about-us"] },
  ];
  return (
    <>
      <PageHero title={page.title} sub={page.intro} crumbs={[{ label: "Home", to: "/" }, { label: page.title }]} />
      <section className="container grid gap-10 py-14 lg:grid-cols-[260px_1fr]">
        <aside className="hidden h-fit space-y-6 rounded-3xl bg-white p-6 shadow-soft lg:sticky lg:top-28 lg:block">
          {groups.map((g) => (
            <div key={g.t}>
              <p className="label">{g.t}</p>
              {g.s.map((s) => {
                const pg = infoPages.find((x) => x.slug === s)!;
                return (
                  <Link key={s} to={`/pages/${s}`} className={`block rounded-xl px-3 py-2 text-sm font-semibold transition ${s === slug ? "bg-navy text-white" : "hover:bg-grey-50"}`}>{pg.title}</Link>
                );
              })}
            </div>
          ))}
        </aside>
        <motion.div variants={staggerParent} initial="hidden" animate="show" className="space-y-5">
          {page.sections.map((s, i) => (
            <motion.div key={s.h} variants={staggerChild} className="prose-mn rounded-3xl bg-white p-8 shadow-soft">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft font-heading font-extrabold text-accent-text">{i + 1}</span>
                <h2 className="!m-0 !text-xl">{s.h}</h2>
              </div>
              {s.p && <p className="!mb-0">{s.p}</p>}
              {s.list && <ul className="!mb-0">{s.list.map((l) => <li key={l}>{l}</li>)}</ul>}
            </motion.div>
          ))}
          <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-navy p-8 text-white md:flex-row md:items-center">
            <div><p className="font-heading text-xl font-bold">Still need help?</p><p className="text-sm text-white/70">Our team is here 7 days a week.</p></div>
            <Link to="/pages/contact-us" className="btn-primary">Contact us <ArrowRight size={16} /></Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}

/* ------------------------------ Contact ------------------------------ */
export function ContactPage({ chat }: { chat?: boolean }) {
  const setChat = useUI((s) => s.setChat);
  useEffect(() => {
    document.title = chat ? "Live Chat Support | MN Furniture" : "Contact Us | MN Furniture";
    if (chat) {
      const timer = setTimeout(() => setChat(true), 300);
      return () => clearTimeout(timer);
    }
  }, [chat, setChat]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if ((fd.name ?? "").trim().length < 2 || !/^\S+@\S+\.\S+$/.test(fd.email ?? "") || (fd.message ?? "").trim().length < 10) return toast.error("Please enter your name, a valid email and a message of at least 10 characters");
    // The demo has no contact API. Open a real email draft instead of claiming a message was delivered.
    const subject = `${fd.subject || "MN Furniture enquiry"} — ${fd.name.trim()}${fd.order ? ` (${fd.order})` : ""}`;
    const body = `${fd.message.trim()}\n\nFrom: ${fd.name.trim()}\nEmail: ${fd.email.trim()}${fd.phone ? `\nPhone: ${fd.phone}` : ""}${fd.order ? `\nOrder: ${fd.order}` : ""}`;
    window.location.href = `mailto:${STORE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.info("Your email app will open with the message. Please send it there.");
  };

  const cards = [
    { i: Phone, t: "Call us", d: STORE.phone, href: STORE.phoneHref },
    { i: Mail, t: "Email us", d: STORE.email, href: `mailto:${STORE.email}` },
    { i: MessageCircle, t: "Live chat", d: "Chat with our team now", onClick: () => setChat(true) },
    { i: Clock, t: "Opening hours", d: STORE.hours },
  ];
  return (
    <>
      <PageHero title={chat ? "Live Chat Support" : "Contact Us"} sub="Questions about an order, delivery or a product? We’re happy to help." crumbs={[{ label: "Home", to: "/" }, { label: chat ? "Live Chat" : "Contact" }]} />
      <section className="container py-14">
        <motion.div variants={staggerParent} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const inner = (
              <>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white"><c.i size={22} /></span>
                <p className="mt-4 font-heading font-bold">{c.t}</p>
                <p className="mt-1 text-sm text-grey-600">{c.d}</p>
              </>
            );
            return (
              <motion.div key={c.t} variants={staggerChild}>
                {c.href ? <a href={c.href} className="group block h-full rounded-3xl bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">{inner}</a>
                  : c.onClick ? <button onClick={c.onClick} className="group block h-full w-full rounded-3xl bg-white p-6 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-card">{inner}</button>
                  : <div className="group h-full rounded-3xl bg-white p-6 shadow-soft">{inner}</div>}
              </motion.div>
            );
          })}
        </motion.div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <form onSubmit={submit} className="space-y-4 rounded-[2rem] bg-white p-8 shadow-soft md:p-10">
              <h2 className="text-2xl font-extrabold">Write to our team</h2>
              <p className="text-sm leading-relaxed text-grey-600">This demo opens a prepared message in your email app. You can review it and press Send there.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label><span className="label">Name</span><input name="name" className="input" /></label>
                <label><span className="label">Email</span><input name="email" type="email" className="input" /></label>
                <label><span className="label">Phone (optional)</span><input name="phone" className="input" /></label>
                <label><span className="label">Order number (optional)</span><input name="order" className="input" placeholder="MN123456" /></label>
              </div>
              <label className="block"><span className="label">Subject</span>
                <select name="subject" className="input">
                  {["General enquiry", "Order & delivery", "Returns & refunds", "Product question", "Damaged item", "Finance"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
              <label className="block"><span className="label">Message</span><textarea name="message" rows={5} className="input resize-none" /></label>
              <button className="btn-primary btn-shine !px-8"><Send size={16} /> Open email draft</button>
            </form>
          </Reveal>
          <Reveal delay={0.1} className="relative overflow-hidden rounded-[2rem] bg-navy p-8 text-white grain md:p-10">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
            <MapPin className="relative text-accent" size={28} />
            <h3 className="relative mt-4 text-2xl font-extrabold !text-white">We deliver across the UK</h3>
            <p className="relative mt-2 text-white/70">Free delivery to UK mainland addresses, with surcharges for some remote areas.</p>
            <div className="relative mt-8 space-y-3">
              {["FAQ", "Free delivery", "Return policy", "Interest free credit"].map((t, i) => (
                <Link key={t} to={`/pages/${["faq", "free-delivery", "return-policy", "interest-free-credit"][i]}`} className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 font-semibold transition hover:bg-white/20">
                  {t} <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ Track order ------------------------------ */
export function TrackOrder() {
  const orders = useAuth((s) => s.orders);
  const [found, setFound] = useState<(typeof orders)[0] | null | undefined>(undefined);
  return (
    <>
      <PageHero title="Track Your Order" sub="Enter your order number and email to see the latest status." crumbs={[{ label: "Home", to: "/" }, { label: "Track order" }]} />
      <section className="container max-w-3xl py-14">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
            const id = fd.id.replace("#", "").trim().toUpperCase();
            setFound(orders.find((o) => o.id === id && o.email.toLowerCase() === fd.email.trim().toLowerCase()) ?? null);
          }}
          className="grid gap-4 rounded-[2rem] bg-white p-8 shadow-soft sm:grid-cols-[1fr_1fr_auto]"
        >
          <input name="id" placeholder="Order number e.g. MN123456" className="input" required />
          <input name="email" type="email" placeholder="Email used at checkout" className="input" required />
          <button className="btn-primary"><Search size={16} /> Track</button>
        </form>
        {found === null && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center text-danger">We couldn’t find that order. Check the number and email.</motion.p>}
        {found && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ease }} className="mt-8 rounded-[2rem] bg-white p-8 shadow-card">
            <div className="mb-8 flex justify-between"><p className="font-heading text-xl font-extrabold">#{found.id}</p><p className="font-bold">{money(found.total)}</p></div>
            <OrderTimeline status={found.status} />
          </motion.div>
        )}
      </section>
    </>
  );
}

/* ------------------------------ All collections ------------------------------ */
export function CollectionsIndex() {
  const tops = collections.filter((c) => !c.parent && c.handle !== "all");
  return (
    <>
      <PageHero title="All Collections" sub="Browse every category in the MN Furniture range." crumbs={[{ label: "Home", to: "/" }, { label: "Collections" }]} />
      <section className="container grid gap-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {tops.map((c, i) => (
          <Reveal key={c.handle} delay={(i % 3) * 0.08}>
            <Link to={`/collections/${c.handle}`} className="group relative block aspect-[4/3] overflow-hidden rounded-[2rem]">
              <Img src={c.image!} alt={c.title} width={800} className="absolute inset-0 h-full" imgClassName="group-hover:scale-110 !duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <p className="font-heading text-2xl font-extrabold">{c.title}</p>
                <p className="mt-1 line-clamp-1 text-sm text-white/70">{c.blurb}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
    </>
  );
}

/* ------------------------------ 404 ------------------------------ */
export function NotFound() {
  return (
    <section className="container grid min-h-[70vh] place-items-center py-20 text-center">
      <div>
        <motion.p initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120 }} className="font-heading text-[9rem] font-extrabold leading-none text-navy md:text-[13rem]">
          4<motion.span animate={{ rotate: [0, 12, -12, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="inline-block text-accent">0</motion.span>4
        </motion.p>
        <h1 className="mt-2 text-3xl font-extrabold">This page has moved out</h1>
        <p className="mt-2 text-grey-600">The page you’re looking for doesn’t exist or has been moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-dark">Back to home</Link>
          <Link to="/collections/all" className="btn-primary">Shop all</Link>
        </div>
      </div>
    </section>
  );
}
