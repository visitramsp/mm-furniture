import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, CreditCard, Loader2, Lock, ShieldCheck, Truck, Wallet, Zap, CalendarDays } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { money } from "../data/catalog";
import { cartTotals, useAuth, useCart, useCurrentUser } from "../store";
import { Img, ease } from "../components/ui";
import { CouponBox } from "./Cart";

const infoSchema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().min(2, "Enter your full name"),
  phone: z.string().regex(/^(\+44\s?|0)\d[\d\s]{8,12}$/, "Enter a valid UK phone number"),
  line1: z.string().min(3, "Enter your address"),
  line2: z.string().optional(),
  city: z.string().min(2, "Enter your town or city"),
  postcode: z.string().regex(/^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/, "Enter a valid UK postcode"),
  newsletter: z.boolean().optional(),
});
type Info = z.infer<typeof infoSchema>;

const DELIVERY = [
  { id: "standard", title: "Standard Delivery", sub: "3–5 working days", price: 0, icon: Truck },
  { id: "express", title: "Express 48h", sub: "On selected items, next 2 days", price: 29.99, icon: Zap },
  { id: "nominated", title: "Nominated Day", sub: "Choose your date", price: 19.99, icon: CalendarDays },
];
const PAYMENTS = [
  { id: "card", title: "Credit / Debit Card", sub: "Visa, Mastercard, Amex", icon: CreditCard },
  { id: "paypal", title: "PayPal", sub: "Including PayPal Pay in 3", icon: Wallet },
  { id: "klarna", title: "Klarna · Pay in 3", sub: "0% interest, split in 3", icon: Wallet },
];
const STEPS = ["Information", "Delivery", "Payment"];

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      <AnimatePresence>{error && <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1 block text-xs font-semibold text-danger">{error}</motion.span>}</AnimatePresence>
    </label>
  );
}

export default function CheckoutPage() {
  const { items, coupon, clear } = useCart();
  const user = useCurrentUser();
  const addOrder = useAuth((s) => s.addOrder);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [info, setInfo] = useState<Info | null>(null);
  const [delivery, setDelivery] = useState("standard");
  const [date, setDate] = useState("");
  const [payment, setPayment] = useState("card");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [flip, setFlip] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => { document.title = "Checkout | MN Furniture"; }, []);
  const { subtotal, discount } = cartTotals(items, coupon);
  const ship = DELIVERY.find((d) => d.id === delivery)!.price;
  const total = subtotal - discount + ship;

  const form = useForm<Info>({
    resolver: zodResolver(infoSchema),
    defaultValues: { email: user?.email ?? "", name: user?.name ?? "", phone: user?.phone ?? "", line1: user?.address?.line1 ?? "", line2: user?.address?.line2 ?? "", city: user?.address?.city ?? "", postcode: user?.address?.postcode ?? "", newsletter: true },
  });
  const minDate = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 3); return d.toISOString().slice(0, 10); }, []);

  if (items.length === 0 && !placing)
    return (
      <div className="container grid min-h-[60vh] place-items-center text-center">
        <div>
          <h1 className="text-3xl font-extrabold">Your cart is empty</h1>
          <Link to="/collections/all" className="btn-primary mt-6">Continue shopping</Link>
        </div>
      </div>
    );

  const placeOrder = () => {
    if (delivery === "nominated" && !date) return toast.error("Please choose a delivery date");
    setPlacing(true);
    setTimeout(() => {
      const id = "MN" + Math.floor(100000 + Math.random() * 900000);
      addOrder({
        id, date: new Date().toISOString(), email: info!.email, items, subtotal, discount, shipping: ship, total,
        address: { name: info!.name, phone: info!.phone, line1: info!.line1, line2: info!.line2, city: info!.city, postcode: info!.postcode.toUpperCase() },
        delivery: DELIVERY.find((d) => d.id === delivery)!.title + (date ? ` (${date})` : ""),
        payment: PAYMENTS.find((p) => p.id === payment)!.title,
        status: "Processing",
      });
      clear();
      navigate(`/order/${id}`);
    }, 1800);
  };

  const fmtCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; };

  return (
    <section className="min-h-screen bg-grey-50">
      <div className="container py-10">
        <div className="mx-auto max-w-xl">
          <div className="relative flex justify-between">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-grey-200" />
            <motion.div className="absolute left-0 top-5 h-0.5 bg-accent" animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} transition={{ duration: 0.6, ease }} />
            {STEPS.map((s, i) => (
              <button key={s} disabled={i > step} onClick={() => setStep(i)} className="relative z-10 flex flex-col items-center gap-2">
                <motion.span animate={{ scale: i === step ? 1.15 : 1 }} className={clsx("grid h-10 w-10 place-items-center rounded-full border-2 font-bold transition-colors", i < step ? "border-accent bg-accent text-white" : i === step ? "border-accent bg-white text-accent" : "border-grey-200 bg-white text-grey-400")}>
                  {i < step ? <Check size={18} /> : i + 1}
                </motion.span>
                <span className={clsx("text-xs font-bold", i <= step ? "text-navy" : "text-grey-400")}>{s}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_420px]">
          <div className="rounded-3xl bg-white p-6 shadow-soft md:p-10">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.form key="s0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4, ease }}
                  onSubmit={form.handleSubmit((d) => { setInfo(d); setStep(1); })} className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold">Contact & delivery address</h2>
                    {!user && <Link to="/account" className="text-sm font-semibold text-accent-text hover:underline">Log in</Link>}
                  </div>
                  <Field label="Email" error={form.formState.errors.email?.message}><input {...form.register("email")} className="input" placeholder="you@example.com" /></Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" error={form.formState.errors.name?.message}><input {...form.register("name")} className="input" /></Field>
                    <Field label="Phone" error={form.formState.errors.phone?.message}><input {...form.register("phone")} className="input" placeholder="07..." /></Field>
                  </div>
                  <Field label="Address line 1" error={form.formState.errors.line1?.message}><input {...form.register("line1")} className="input" /></Field>
                  <Field label="Address line 2 (optional)"><input {...form.register("line2")} className="input" /></Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Town / City" error={form.formState.errors.city?.message}><input {...form.register("city")} className="input" /></Field>
                    <Field label="Postcode" error={form.formState.errors.postcode?.message}><input {...form.register("postcode")} className="input uppercase" placeholder="E13 9AU" /></Field>
                  </div>
                  <label className="flex items-center gap-3 text-sm"><input type="checkbox" {...form.register("newsletter")} className="h-4 w-4 accent-[#f28c28]" /> Email me offers and news</label>
                  <div className="flex items-center justify-between pt-4">
                    <Link to="/cart" className="btn-ghost"><ArrowLeft size={16} /> Back to cart</Link>
                    <button className="btn-primary btn-shine !px-8">Continue to delivery</button>
                  </div>
                </motion.form>
              )}

              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4, ease }} className="space-y-5">
                  <h2 className="text-2xl font-extrabold">Delivery method</h2>
                  <div className="rounded-2xl bg-grey-50 p-4 text-sm">
                    <p className="font-semibold">{info?.name} · {info?.phone}</p>
                    <p className="text-grey-600">{[info?.line1, info?.line2, info?.city, info?.postcode.toUpperCase()].filter(Boolean).join(", ")}</p>
                    <button onClick={() => setStep(0)} className="mt-1 text-xs font-bold text-accent-text">Change</button>
                  </div>
                  <div className="space-y-3">
                    {DELIVERY.map((d) => (
                      <Option key={d.id} on={delivery === d.id} onClick={() => setDelivery(d.id)} icon={<d.icon size={20} />} title={d.title} sub={d.sub} right={d.price ? money(d.price) : "FREE"} />
                    ))}
                  </div>
                  <AnimatePresence>
                    {delivery === "nominated" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <Field label="Delivery date"><input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className="input" /></Field>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex items-center justify-between pt-4">
                    <button onClick={() => setStep(0)} className="btn-ghost"><ArrowLeft size={16} /> Back</button>
                    <button onClick={() => setStep(2)} className="btn-primary btn-shine !px-8">Continue to payment</button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4, ease }} className="space-y-5">
                  <h2 className="text-2xl font-extrabold">Payment</h2>
                  <p className="flex items-center gap-2 text-sm text-grey-600"><ShieldCheck size={16} className="text-success" /> All transactions are secure and encrypted.</p>
                  <div className="space-y-3">
                    {PAYMENTS.map((p) => (
                      <Option key={p.id} on={payment === p.id} onClick={() => setPayment(p.id)} icon={<p.icon size={20} />} title={p.title} sub={p.sub} right={p.id === "klarna" ? `3 × ${money(total / 3)}` : ""} />
                    ))}
                  </div>
                  <div role="note" className="rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm font-medium text-navy">Demo checkout — no actual payment is taken. Please do not enter real card information.</div>
                  <AnimatePresence mode="wait">
                    {payment === "card" ? (
                      <motion.div key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid items-center gap-6 pt-2 md:grid-cols-2">
                        <div className="[perspective:1000px]">
                          <motion.div animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.6, ease }} className="relative aspect-[1.6] w-full [transform-style:preserve-3d]">
                            <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-navy via-navy-600 to-navy-500 p-5 text-white shadow-lift [backface-visibility:hidden]">
                              <div className="flex justify-between"><span className="h-8 w-11 rounded-md bg-gradient-to-br from-accent-dark to-accent" /><span className="font-heading font-extrabold italic">MN Pay</span></div>
                              <p className="font-mono text-lg tracking-widest">{card.number || "•••• •••• •••• ••••"}</p>
                              <div className="flex justify-between text-xs uppercase"><span>{card.name || "Card holder"}</span><span>{card.exp || "MM/YY"}</span></div>
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-navy-600 to-navy p-5 text-white shadow-lift [backface-visibility:hidden] [transform:rotateY(180deg)]">
                              <div className="-mx-5 mt-3 h-10 bg-black/60" />
                              <div className="mt-4 flex items-center justify-end gap-2"><span className="text-xs">CVC</span><span className="rounded bg-white px-3 py-1 font-mono text-navy">{card.cvc || "•••"}</span></div>
                            </div>
                          </motion.div>
                        </div>
                        <div className="rounded-2xl border border-grey-200 bg-grey-50 p-5"><p className="font-heading text-lg font-extrabold">Preview your checkout</p><p className="mt-2 text-sm leading-relaxed text-grey-600">We’ll create a local sample order so you can explore the order confirmation, tracking and account pages. Card payments will be enabled when a secure payment provider is connected.</p><p className="mt-4 flex items-center gap-2 text-sm font-semibold text-navy"><ShieldCheck size={18} className="text-success" /> No payment or card details required</p></div>
                      </motion.div>
                    ) : (
                      <motion.p key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-2xl bg-grey-50 p-5 text-sm text-grey-600">
                        {payment === "paypal" ? "PayPal" : "Klarna"} integration is not connected in this demo. Continue to preview a sample order without making any payment.
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <div className="flex items-center justify-between pt-4">
                    <button onClick={() => setStep(1)} className="btn-ghost"><ArrowLeft size={16} /> Back</button>
                    <button onClick={placeOrder} disabled={placing} className="btn-primary btn-shine !px-8">
                      {placing ? <><Loader2 size={18} className="animate-spin" /> Creating sample order…</> : <><Lock size={16} /> Place demo order · {money(total)}</>}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-soft lg:sticky lg:top-28">
            <h3 className="text-lg font-extrabold">Order summary</h3>
            <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1 pt-2" data-lenis-prevent>
              {items.map((it) => (
                <li key={it.key} className="flex items-center gap-3">
                  <div className="relative">
                    <Img src={it.image} alt="" width={140} className="h-16 w-16 rounded-xl" />
                    <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-navy text-[10px] font-bold text-white">{it.qty}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{it.title}</p>
                    <p className="truncate text-xs text-grey-600">{[it.colour, it.size].filter(Boolean).join(" · ")}</p>
                  </div>
                  <span className="text-sm font-bold">{money(it.unitPrice * it.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="my-5"><CouponBox /></div>
            <div className="space-y-2 border-t border-grey-200 pt-4 text-sm">
              <div className="flex justify-between"><span className="text-grey-600">Subtotal</span><span>{money(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{money(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-grey-600">Delivery</span><span>{ship ? money(ship) : "FREE"}</span></div>
              <div className="flex items-baseline justify-between pt-3 font-heading">
                <span className="text-lg font-bold">Total</span>
                <motion.span key={total} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl font-extrabold">{money(total)}</motion.span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Option({ on, onClick, icon, title, sub, right }: { on: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string; right: string }) {
  return (
    <button type="button" onClick={onClick} className={clsx("flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition", on ? "border-accent bg-accent-soft/50" : "border-grey-200 hover:border-grey-400")}>
      <span className={clsx("grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition", on ? "border-accent" : "border-grey-400")}>
        {on && <motion.span layoutId="opt-dot" className="h-3 w-3 rounded-full bg-accent" />}
      </span>
      <span className={clsx("grid h-11 w-11 shrink-0 place-items-center rounded-xl", on ? "bg-accent text-white" : "bg-grey-100 text-navy")}>{icon}</span>
      <span className="flex-1">
        <span className="block font-bold text-navy">{title}</span>
        <span className="block text-xs text-grey-600">{sub}</span>
      </span>
      <span className="font-heading font-extrabold">{right}</span>
    </button>
  );
}
