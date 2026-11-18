import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Heart, LogOut, MapPin, Package, User, ChevronDown, Truck, ShieldCheck, CreditCard } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { money, products } from "../data/catalog";
import { useAuth, useCurrentUser, useLists, type Order } from "../store";
import { Empty, Img, PageHero, ease } from "../components/ui";
import { ProductCard } from "../components/product";
import { OrderTimeline } from "./OrderSuccess";

function AuthForms() {
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [show, setShow] = useState(false);
  const { login, register } = useAuth();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (mode === "reset") { toast.info("This demo has no email service. Please use your demo login or create a new account."); return; }
    if (!/^\S+@\S+\.\S+$/.test(fd.email)) return toast.error("Enter a valid email");
    if (mode === "register") {
      if ((fd.password ?? "").length < 6) return toast.error("Password must be at least 6 characters");
      const err = register({ name: fd.name, email: fd.email, password: fd.password, newsletter: !!fd.newsletter });
      err ? toast.error(err) : toast.success("Welcome to MN Furniture!");
    } else {
      const err = login(fd.email, fd.password);
      err ? toast.error(err) : toast.success("Welcome back!");
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-card md:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy p-10 text-white md:block grain">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <p className="relative font-heading text-3xl font-extrabold">Your home, <span className="text-accent">your account.</span></p>
        <ul className="relative mt-8 space-y-4 text-white/80">
          {["Track orders in real time", "Save your wishlist across visits", "Faster checkout with saved address", "Members-only offers"].map((t, i) => (
            <motion.li key={t} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-sm font-bold">✓</span>{t}
            </motion.li>
          ))}
        </ul>
        <div className="relative mt-10 grid grid-cols-3 gap-2">
          {products.slice(0, 3).map((p) => <Img key={p.id} src={p.images[0]} alt="" width={200} className="aspect-square rounded-2xl" />)}
        </div>
      </div>
      <div className="p-8 md:p-12">
        {mode !== "reset" && (
          <LayoutGroup>
            <div className="mb-8 flex rounded-full bg-grey-100 p-1">
              {(["login", "register"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={clsx("relative flex-1 rounded-full py-2.5 text-sm font-bold", mode === m ? "text-white" : "text-navy")}>
                  {mode === m && <motion.span layoutId="auth-tab" className="absolute inset-0 rounded-full bg-navy" />}
                  <span className="relative">{m === "login" ? "Log in" : "Create account"}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        )}
        <AnimatePresence mode="wait">
          <motion.form key={mode} onSubmit={submit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3, ease }} className="space-y-4">
            {mode === "reset" && <><h2 className="text-2xl font-extrabold">Password assistance</h2><p className="text-sm text-grey-600">Password reset emails are not available in this browser-only demo.</p></>}
            {mode === "register" && <input name="name" placeholder="Full name" className="input" required />}
            <input name="email" type="email" placeholder="Email address" className="input" required />
            {mode !== "reset" && (
              <div className="relative">
                <input name="password" type={show ? "text" : "password"} placeholder="Password" className="input pr-12" required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-400" aria-label="Show password">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            )}
            {mode === "register" && <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="newsletter" className="accent-[#f28c28]" defaultChecked /> Send me £20 off & offers</label>}
            {mode === "login" && <button type="button" onClick={() => setMode("reset")} className="text-sm font-semibold text-accent-text">Forgot password?</button>}
            <button className="btn-primary btn-shine w-full !py-3.5">{mode === "login" ? "Log in" : mode === "register" ? "Create account" : "Check options"}</button>
            {mode === "reset" && <button type="button" onClick={() => setMode("login")} className="w-full text-sm font-semibold text-grey-600">← Back to login</button>}
          </motion.form>
        </AnimatePresence>
        <p className="mt-6 text-center text-xs text-grey-400">Demo accounts are stored in this browser only.</p>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const date = Number.isNaN(Date.parse(order.date)) ? order.date : new Date(order.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-grey-100 bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-grey-50 to-white p-5 sm:p-6">
        <div><p className="text-xs font-bold uppercase tracking-widest text-grey-400">Order reference</p><h3 className="mt-1 font-heading text-xl font-extrabold">#{order.id}</h3><p className="mt-1 text-xs text-grey-600">Placed {date}</p></div>
        <div className="rounded-full bg-accent-soft px-4 py-2 text-xs font-bold text-accent-text">{order.status || "Processing"}</div>
        <div className="text-right"><p className="text-xs text-grey-600">Order total</p><p className="font-heading text-2xl font-extrabold text-navy">{money(order.total)}</p></div>
      </div>
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="divide-y divide-grey-100">
          {(order.items ?? []).map((item) => (
            <div key={item.key} className="flex items-center gap-4 py-4">
              <Link to={`/products/${item.handle}`} className="shrink-0"><Img src={item.image} alt={item.title} width={150} className="h-20 w-20 rounded-xl bg-grey-50" /></Link>
              <div className="min-w-0 flex-1"><Link to={`/products/${item.handle}`} className="line-clamp-2 font-semibold hover:text-accent-text">{item.title}</Link><p className="mt-1 text-xs text-grey-600">{[item.colour, item.size, ...(item.addons ?? [])].filter(Boolean).join(" · ") || "Standard"}</p><p className="mt-1 text-xs text-grey-600">Qty: {item.qty} · {money(item.unitPrice)} each</p></div>
              <p className="whitespace-nowrap font-bold">{money(item.qty * item.unitPrice)}</p>
            </div>
          ))}
        </div>
        <button type="button" aria-expanded={expanded} onClick={() => setExpanded(v => !v)} className="mt-2 flex w-full items-center justify-between rounded-xl border border-grey-200 px-4 py-3 text-sm font-bold text-navy transition hover:border-accent hover:bg-accent-soft/30">{expanded ? "Hide order details" : "View complete order details"}<ChevronDown size={18} className={`transition-transform ${expanded ? "rotate-180" : ""}`} /></button>
        {expanded && <div className="mt-5 space-y-6 border-t border-grey-100 pt-5">
          <OrderTimeline status={order.status} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-grey-50 p-4"><p className="mb-2 flex items-center gap-2 text-sm font-bold"><Truck size={17}/> Shipping address</p><p className="text-sm leading-6 text-grey-600">{order.address?.name}<br/>{order.address?.line1}{order.address?.line2 ? `, ${order.address.line2}` : ""}<br/>{order.address?.city}, {order.address?.postcode}<br/>{order.address?.phone}</p><p className="mt-2 text-xs font-semibold text-navy">{order.delivery}</p></div>
            <div className="rounded-2xl bg-grey-50 p-4"><p className="mb-2 flex items-center gap-2 text-sm font-bold"><CreditCard size={17}/> Payment details</p><p className="text-sm text-grey-600">{order.payment}</p><p className="mt-2 break-all text-xs text-grey-600">{order.email}</p><p className="mt-3 flex items-center gap-2 text-xs text-grey-600"><ShieldCheck size={15}/> Demo order record · no payment captured</p></div>
          </div>
          <div className="ml-auto max-w-sm space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{money(order.subtotal)}</span></div><div className="flex justify-between text-success"><span>Discount</span><span>−{money(order.discount)}</span></div><div className="flex justify-between"><span>Delivery</span><span>{order.shipping === 0 ? "Free" : money(order.shipping)}</span></div><div className="flex justify-between border-t border-grey-200 pt-3 text-lg font-extrabold"><span>Total</span><span>{money(order.total)}</span></div></div>
          <Link to={`/order/${order.id}`} className="inline-flex text-sm font-bold text-accent-text hover:underline">View confirmation →</Link>
        </div>}
      </div>
    </article>
  );
}

function Dashboard() {
  const user = useCurrentUser()!;
  const { logout, update, orders } = useAuth();
  const mine = orders.filter((o) => o.email?.toLowerCase() === user.email?.toLowerCase());
  const wish = useLists((s) => s.wishlist);
  const [tab, setTab] = useState<"orders" | "details" | "address" | "wishlist">("orders");
  const [changePassword, setChangePassword] = useState(false);
  const tabs = [
    { k: "orders", label: "Orders", icon: Package },
    { k: "details", label: "Account details", icon: User },
    { k: "address", label: "Address", icon: MapPin },
    { k: "wishlist", label: "Wishlist", icon: Heart },
  ] as const;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3 border-b border-grey-100 pb-5">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent font-heading text-xl font-extrabold text-white">{user.name[0]}</div>
          <div className="min-w-0"><p className="truncate font-bold">{user.name}</p><p className="truncate text-xs text-grey-600">{user.email}</p></div>
        </div>
        <LayoutGroup>
          <nav className="mt-4 space-y-1">
            {tabs.map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)} className={clsx("relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition", tab === t.k ? "text-white" : "text-navy hover:bg-grey-50")}>
                {tab === t.k && <motion.span layoutId="acc-tab" className="absolute inset-0 rounded-xl bg-navy" />}
                <t.icon size={17} className="relative" /> <span className="relative">{t.label}</span>
              </button>
            ))}
            <button onClick={() => { logout(); toast("Logged out"); }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-danger hover:bg-danger-soft"><LogOut size={17} /> Log out</button>
          </nav>
        </LayoutGroup>
      </aside>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease }}>
          {tab === "orders" && (mine.length === 0 ? (
            <Empty icon={<Package size={40} />} title="No orders yet" text="When you place an order, it’ll show up here." action={<Link to="/collections/all" className="btn-primary">Start shopping</Link>} />
          ) : (
            <div className="space-y-4">
              {mine.map((o) => <OrderCard key={o.id} order={o} />)}
            </div>
          ))}
          {tab === "details" && (
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const name = String(fd.get("name") ?? "").trim(); const phone = String(fd.get("phone") ?? "").trim(); if (name.length < 2) return toast.error("Enter your full name"); if (phone && !/^[+\d\s()-]{7,20}$/.test(phone)) return toast.error("Enter a valid phone number"); const patch: {name: string; phone: string; password?: string} = {name, phone}; if (changePassword) { const old = String(fd.get("oldPassword") ?? ""); const next = String(fd.get("newPassword") ?? ""); const confirm = String(fd.get("confirmPassword") ?? ""); if (old !== user.password) return toast.error("Current password is incorrect"); if (next.length < 8) return toast.error("New password needs at least 8 characters"); if (next !== confirm) return toast.error("New passwords do not match"); patch.password = next; } update(patch); setChangePassword(false); toast.success("Account details updated"); }} className="space-y-4 rounded-3xl border border-grey-100 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="text-2xl font-extrabold">Account details</h2>
              <label className="block"><span className="label">Full name</span><input name="name" defaultValue={user.name} className="input" required minLength={2} /></label>
              <label className="block"><span className="label">Email</span><input defaultValue={user.email} disabled className="input opacity-60" /></label>
              <label className="block"><span className="label">Phone</span><input name="phone" defaultValue={user.phone} className="input" /></label>
              <button type="button" onClick={() => setChangePassword(v => !v)} className="text-sm font-bold text-accent-text hover:underline">{changePassword ? "Cancel password change" : "Change password"}</button>
              {changePassword && <div className="space-y-3 rounded-2xl bg-grey-50 p-4"><label className="block"><span className="label">Current password</span><input name="oldPassword" type="password" autoComplete="current-password" className="input" required /></label><label className="block"><span className="label">New password</span><input name="newPassword" type="password" autoComplete="new-password" className="input" minLength={8} required /></label><label className="block"><span className="label">Confirm new password</span><input name="confirmPassword" type="password" autoComplete="new-password" className="input" required /></label></div>}
              <p className="text-xs text-grey-600">Demo data is saved only in this browser. Do not reuse a real password.</p>
              <button className="btn-primary">Save changes</button>
            </form>
          )}
          {tab === "address" && (
            <form onSubmit={(e) => { e.preventDefault(); const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>; const postcode = fd.postcode?.trim().toUpperCase(); if (!/^(GIR\s?0AA|(?:[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}))$/.test(postcode)) return toast.error("Enter a valid UK postcode"); update({ address: { line1: fd.line1.trim(), line2: fd.line2.trim(), city: fd.city.trim(), postcode } }); toast.success("Address saved. It will be used at checkout"); }} className="space-y-4 rounded-3xl border border-grey-100 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="text-2xl font-extrabold">Delivery address</h2>
              <input name="line1" defaultValue={user.address?.line1} placeholder="Address line 1" className="input" required />
              <input name="line2" defaultValue={user.address?.line2} placeholder="Address line 2" className="input" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="city" defaultValue={user.address?.city} placeholder="Town / City" className="input" required />
                <input name="postcode" defaultValue={user.address?.postcode} placeholder="Postcode" className="input uppercase" required />
              </div>
              <button className="btn-primary">Save address</button>
            </form>
          )}
          {tab === "wishlist" && (
            wish.length ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{products.filter((p) => wish.includes(p.id)).map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}</div>
            ) : <Empty icon={<Heart size={40} />} title="No saved items" text="Tap the heart on any product to save it." />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function AccountPage() {
  const user = useCurrentUser();
  useEffect(() => { document.title = "My Account | MN Furniture"; }, []);
  return (
    <>
      <PageHero title={user ? `Hello, ${user.name.split(" ")[0]}` : "My Account"} sub={user ? "Manage your orders, details and wishlist." : "Log in or create an account to track orders and save favourites."} crumbs={[{ label: "Home", to: "/" }, { label: "Account" }]} />
      <section className="container py-12">{user ? <Dashboard /> : <AuthForms />}</section>
    </>
  );
}
