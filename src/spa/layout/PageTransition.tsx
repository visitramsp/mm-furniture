import { motion, useReducedMotion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "./SmoothScroll";

/** Lightweight, non-blocking route animation. No fullscreen curtain or wait-mode deadlocks. */
export default function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  useEffect(() => { scrollToTop(); }, [pathname]);
  return (
    <motion.div
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[45vh]"
    >
      {children}
    </motion.div>
  );
}
