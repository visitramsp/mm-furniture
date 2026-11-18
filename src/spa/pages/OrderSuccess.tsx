import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Package, Truck, Home as HomeIcon, ClipboardCheck } from "lucide-react";
import { money } from "../data/catalog";
import { useAuth } from "../store";
import { Img, ease } from "../components/ui";
import NotFound from "./NotFound";

const CONFETTI = Array.from({ length: 36 });

export function OrderTimeline({ status }: { status: string }) {
  const steps = [
    { t: "Processing", i: ClipboardCheck },
    { t: "Dispatched", i: Package },
    { t: "Out for delivery", i: Truck },
    { t: "Delivered", i: HomeIcon },
  ];
  const idx = steps.findIndex((s) => s.t === status);
  return (
    <div className="relative grid grid-cols-4">
      <div className="absolute left-[12.5%] right-[12.5%] top-5 h-1 rounded-full bg-grey-200" />
      <motion.div initial={{ width: 0 }} animate={{ width: `${(idx / 3) * 75}%` }} transition={{ duration: 1, ease, delay: 0.3 }} className="absolute left-[12.5%] top-5 h-1 rounded-full bg-accent" />
      {steps.map((s, i) => (
        <div key={s.t} className="relative flex flex-col items-center gap-2 text-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.12, type: "spring" }} className={`grid h-11 w-11 place-items-center rounded-full ${i <= idx ? "bg-accent text-white" : "bg-grey-200 text-grey-400"}`}>
            <s.i size={18} />
          </motion.span>
          <span className={`text-xs font-bold ${i <= idx ? "text-navy" : "text-grey-400"}`}>{s.t}</span>
        </div>
      ))}
    </div>
  );
}

export default function OrderSuccess() {
  const { id } = useParams();
  const order = useAuth((s) => s.orders.find((o) => o.id === id));
  useEffect(() => { document.title = "Order confirmed | MN Furniture"; }, []);
  if (!order) return <NotFound />;

  return (
    <section className="relative overflow-hidden py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
        {CONFETTI.map((_, i) => (
          <motion.span
            key={i}
            initial={{ y: -40, x: 0, opacity: 1, rotate: 0 }}
            animate={{ y: 700, x: (Math.random() - 0.5) * 300, opacity: 0, rotate: Math.random() * 720 }}
            transition={{ duration: 2.5 + Math.random() * 1.5, delay: Math.random() * 0.6, ease: "easeOut" }}
            className="absolute top-0 h-3 w-2 rounded-sm"
            style={{ left: `${(i / CONFETTI.length) * 100}%`, background: ["#f28c28", "#0f1e3d", "#f7b26b", "#135c2c"][i % 4] }}
          />
        ))}
      </div>
      <div className="container relative max-w-3xl text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-success text-white shadow-lift">
          <Check size={44} strokeWidth={3} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 text-4xl font-extrabold md:text-5xl">Thank you, {order.address.name.split(" ")[0]}!</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-3 text-grey-600">
          Your order <b className="text-navy">#{order.id}</b> is confirmed. We’ve sent a confirmation to {order.email}.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6, ease }} className="mt-10 rounded-3xl bg-white p-6 text-left shadow-card md:p-8">
          <OrderTimeline status={order.status} />
          <div className="mt-8 grid gap-6 border-t border-grey-100 pt-6 md:grid-cols-3">
            <div><p className="label">Delivery to</p><p className="text-sm">{order.address.line1}, {order.address.city}, {order.address.postcode}</p></div>
            <div><p className="label">Delivery</p><p className="text-sm">{order.delivery}</p></div>
            <div><p className="label">Payment</p><p className="text-sm">{order.payment}</p></div>
          </div>
          <ul className="mt-6 divide-y divide-grey-100 border-t border-grey-100">
            {order.items.map((it) => (
              <li key={it.key} className="flex items-center gap-4 py-4">
                <Img src={it.image} alt="" width={120} className="h-14 w-14 rounded-xl" />
                <div className="flex-1"><p className="text-sm font-bold">{it.title} × {it.qty}</p><p className="text-xs text-grey-600">{[it.colour, it.size].filter(Boolean).join(" · ")}</p></div>
                <span className="font-bold">{money(it.unitPrice * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-grey-100 pt-4 font-heading text-xl font-extrabold"><span>Total paid</span><span>{money(order.total)}</span></div>
        </motion.div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/account" className="btn-dark">View my orders</Link>
          <Link to="/collections/all" className="btn-primary">Continue shopping</Link>
        </div>
      </div>
    </section>
  );
}
