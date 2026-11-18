import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUI } from "../store";

export const scrollToTop = () => {
  if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
};
export const scrollTo = (y: number | string) => {
  if (typeof window === "undefined") return;
  if (typeof y === "number") window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  else document.querySelector(y)?.scrollIntoView({ behavior: "smooth", block: "start" });
};
/** Native scrolling is stable with sticky headers, keyboard navigation and mobile browsers. */
export default function SmoothScroll() {
  const { pathname } = useLocation();
  const locked = useUI((s) => s.cartOpen || s.searchOpen || s.menuOpen || !!s.quickView);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = previous; };
  }, [locked]);
  useEffect(() => { document.body.style.overflow = ""; return () => { document.body.style.overflow = ""; }; }, [pathname]);
  return null;
}
