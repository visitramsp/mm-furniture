import type { ReactNode } from "react";
import Header, { AnnouncementBar } from "./Header";
import Footer from "./Footer";
import SmoothScroll from "./SmoothScroll";
import { CartDrawer, ChatWidget, CompareBar, MobileMenu, QuickView, ScrollChrome, SearchOverlay } from "./Overlays";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SmoothScroll />
      <ScrollChrome />
      <div className="site-header-stack sticky top-0 z-50 w-full lg:fixed lg:inset-x-0">
        <AnnouncementBar />
        <Header />
      </div>
      <main className="flex-1 lg:pt-[var(--header-stack-h)]">{children}</main>
      <Footer />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <QuickView />
      <CompareBar />
      <ChatWidget />
    </div>
  );
}
