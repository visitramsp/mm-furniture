import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, CreditCard, Headphones, Lock, Mail, MapPin, Phone, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { STORE } from "../data/catalog";
import { Reveal, SocialIcon } from "../components/ui";

const COLS = [
  {
    title: "Customer Service",
    links: [
      ["Money Back Guarantee", "/pages/money-back-guarantee"],
      ["Live Chat Support", "/pages/live-chat-support"],
      ["Free Delivery All Over the UK", "/pages/free-delivery"],
      ["Care and Maintenance", "/pages/care-and-maintenance"],
      ["Interest Free Credit Option", "/pages/interest-free-credit"],
      ["Track Your Order", "/pages/track-order"],
      ["Contact Us", "/pages/contact-us"],
    ],
  },
  {
    title: "Assembly Guideline",
    links: [
      ["Assembly Instructions", "/pages/assembly-instructions"],
      ["Bed Assembly", "/pages/bed-assembly"],
      ["Wardrobe Assembly", "/pages/wardrobe-assembly"],
      ["Sofa / Sofa Bed Assembly", "/pages/sofa-assembly"],
      ["Terms & Conditions", "/pages/terms-conditions"],
      ["FAQs", "/pages/faq"],
    ],
  },
  {
    title: "Shop",
    links: [
      ["Wardrobes", "/collections/sliding-wardrobes"],
      ["Sofas", "/collections/sofas"],
      ["Sofa Beds", "/collections/sofabeds"],
      ["Beds & Mattresses", "/collections/beds-for-sale-uk"],
      ["Outdoor & Garden", "/collections/outdoor-and-garden-furniture"],
      ["Sale", "/collections/sales-and-discount"],
    ],
  },
];

const PERKS = [
  { icon: Truck, title: "Free UK Delivery", text: "On mainland orders" },
  { icon: RotateCcw, title: "30-Day Returns", text: "Easy & hassle-free" },
  { icon: CreditCard, title: "0% Finance", text: "Pay in 3 with Klarna" },
  { icon: Headphones, title: "24/7 Support", text: "Chat, phone or email" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy text-white grain">
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-navy-500/40 blur-3xl" />

      <div className="relative border-b border-white/10">
        <div className="container grid grid-cols-1 gap-5 py-8 sm:grid-cols-2 md:grid-cols-4 md:gap-6 md:py-10">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="flex items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-accent"><p.icon size={22} /></div>
              <div>
                <p className="font-heading font-bold">{p.title}</p>
                <p className="text-xs text-white/60">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="container relative grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent font-heading text-sm font-extrabold">MN.</span>
            <span className="font-heading text-xl font-extrabold">MN Furniture LTD</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">Quality home and office furniture at prices that make sense. Delivered free across the UK mainland.</p>
          <div className="mt-6 space-y-2.5 text-sm">
            <a href={STORE.phoneHref} className="flex items-center gap-3 text-white/80 transition hover:text-accent-dark"><Phone size={16} className="text-accent" /> {STORE.phone}</a>
            <a href={`mailto:${STORE.email}`} className="flex items-center gap-3 text-white/80 transition hover:text-accent-dark"><Mail size={16} className="text-accent" /> {STORE.email}</a>
            <p className="flex items-center gap-3 text-white/80"><MapPin size={16} className="text-accent" /> United Kingdom</p>
          </div>
          <div className="mt-6 flex gap-2">
            {Object.entries(STORE.socials).map(([k, url]) => (
              <motion.a whileHover={{ y: -4, scale: 1.08 }} key={k} href={url} target="_blank" rel="noreferrer" aria-label={k} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-accent">
                <SocialIcon name={k} />
              </motion.a>
            ))}
          </div>
        </div>

        {COLS.map((c, i) => (
          <Reveal key={c.title} delay={0.05 * i} className="lg:col-span-2">
            <p className="mb-5 font-heading font-bold">{c.title}</p>
            <ul className="space-y-2.5">
              {c.links.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="group inline-flex items-center text-sm text-white/65 transition hover:text-white">
                    <span className="mr-0 h-px w-0 bg-accent transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal delay={0.2} className="lg:col-span-2">
          <p className="mb-5 font-heading font-bold">Get £20 Off</p>
          <p className="mb-4 text-sm text-white/65">Sign up for offers and your first-order discount.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Please enter a valid email");
              toast.success("Subscribed! Your code: WELCOME20");
              setEmail("");
            }}
            className="relative"
          >
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-full border border-white/15 bg-white/5 py-3 pl-4 pr-12 text-sm outline-none transition placeholder:text-white/40 focus:border-accent" />
            <button aria-label="Subscribe" className="absolute right-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-full bg-accent transition hover:bg-accent-hover"><ArrowRight size={16} /></button>
          </form>
        </Reveal>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/55 md:flex-row">
          <p>© {new Date().getFullYear()} MN Furniture LTD. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/pages/terms-of-use" className="hover:text-white">Terms of Use</Link>
            <Link to="/pages/return-policy" className="hover:text-white">Return Policy</Link>
            <Link to="/pages/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/pages/about-us" className="hover:text-white">About</Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><Lock size={12} /> Secure</span>
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> SSL</span>
            <span className="flex items-center gap-1"><Award size={12} /> Money Back</span>
            {["VISA", "MC", "AMEX", "PayPal", "Klarna"].map((p) => (
              <span key={p} className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-extrabold text-navy">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
