import { motion, useInView, animate, type HTMLMotionProps } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import clsx from "clsx";
import { img, money } from "../data/catalog";

export const ease = [0.22, 1, 0.36, 1] as const;

/** Fade/slide in when scrolled into view. */
export function Reveal({ children, delay = 0, y = 28, x = 0, className, once = true, ...rest }: { children: ReactNode; delay?: number; y?: number; x?: number; className?: string; once?: boolean } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export const staggerParent = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
export const staggerChild = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };

/** Image with skeleton shimmer and fade-in. */
export function Img({ src, alt, width = 800, className, imgClassName, eager }: { src: string; alt: string; width?: number; className?: string; imgClassName?: string; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => { setLoaded(false); setError(false); }, [src]);
  return (
    <div className={clsx(!className?.includes("absolute") && !className?.includes("fixed") && "relative", "overflow-hidden bg-grey-100", className)}>
      {!loaded && !error && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-grey-100 to-grey-200 font-heading text-xs font-extrabold text-grey-400">MN</div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img(src, width)}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={clsx("h-full w-full object-cover transition-all duration-700", loaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-sm", imgClassName)}
        />
      )}
    </div>
  );
}

export function Stars({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < Math.round(rating) ? "fill-accent text-accent" : "fill-grey-200 text-grey-200"} />
      ))}
    </span>
  );
}

export function Price({ price, compareAt, size = "md" }: { price: number; compareAt?: number; size?: "sm" | "md" | "lg" }) {
  const big = size === "lg" ? "text-3xl" : size === "md" ? "text-lg" : "text-base";
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={clsx("font-heading font-extrabold text-navy", big)}>{money(price)}</span>
      {compareAt && compareAt > price && (
        <>
          <span className="text-sm text-grey-400 line-through">{money(compareAt)}</span>
          <span className="text-xs font-bold text-success">Save {money(compareAt - price)}</span>
        </>
      )}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs text-grey-600" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {it.to ? <Link to={it.to} className="transition hover:text-accent">{it.label}</Link> : <span className="font-semibold text-navy">{it.label}</span>}
          {i < items.length - 1 && <ChevronRight size={12} className="text-grey-400" />}
        </span>
      ))}
    </nav>
  );
}

export function SectionHead({ eyebrow, title, sub, action, center }: { eyebrow?: string; title: ReactNode; sub?: string; action?: ReactNode; center?: boolean }) {
  return (
    <div className={clsx("mb-10 flex flex-col gap-4 md:mb-14", center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between")}>
      <Reveal className={clsx("max-w-2xl", center && "flex flex-col items-center")}>
        {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
        <h2 className="h-section">{title}</h2>
        {sub && <p className="mt-3 text-grey-600 md:text-lg">{sub}</p>}
      </Reveal>
      {action && <Reveal delay={0.1}>{action}</Reveal>}
    </div>
  );
}

export function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const c = animate(0, to, {
      duration: 2,
      ease,
      onUpdate: (v) => { if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix; },
    });
    return () => c.stop();
  }, [inView, to, suffix, decimals]);
  return <span ref={ref}>0{suffix}</span>;
}

export function PageHero({ title, sub, crumbs, image }: { title: string; sub?: string; crumbs: { label: string; to?: string }[]; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-navy text-white grain">
      {image && <Img src={image} alt="" width={1600} className="absolute inset-0 opacity-25" />}
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
      <div className="container relative py-14 md:py-20">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="[&_a]:text-white/70 [&_span]:text-white/90">
          <Breadcrumbs items={crumbs} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease }} className="mt-4 max-w-3xl text-4xl font-extrabold !text-white md:text-6xl">
          {title}
        </motion.h1>
        {sub && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease }} className="mt-4 max-w-2xl text-white/75 md:text-lg">
            {sub}
          </motion.p>
        )}
      </div>
    </section>
  );
}

/** Small SVG brand icons (lucide no longer ships brand logos). */
export const SocialIcon = ({ name, size = 16 }: { name: string; size?: number }) => {
  const paths: Record<string, string> = {
    instagram: "M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8zm5.4-9.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z",
    facebook: "M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z",
    tiktok: "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 1 0 5 5.7V9a7.4 7.4 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.3-1.5z",
    youtube: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-3.2.5-4.8s-.1-3.2-.5-4.8zM9.7 15V9l5.8 3-5.8 3z",
    pinterest: "M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.2c0 .2-.2.2-.4.1-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A10 10 0 1 0 12 2z",
    x: "M17.8 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.8 3h6.4l4.4 5.9L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
};

export function Empty({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <Reveal className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <motion.div initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="mb-6 grid h-24 w-24 place-items-center rounded-full bg-accent-soft text-accent">
        {icon}
      </motion.div>
      <h2 className="text-2xl font-extrabold">{title}</h2>
      <p className="mt-2 text-grey-600">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </Reveal>
  );
}
