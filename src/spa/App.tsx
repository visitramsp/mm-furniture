import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUI } from "./store";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "sonner";
import Layout from "./layout/Layout";
import PageTransition from "./layout/PageTransition";
import Home from "./pages/Home";
import CollectionPage from "./pages/Collection";
import ProductPage from "./pages/Product";
import SearchPage from "./pages/Search";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import AccountPage from "./pages/Account";
import WishlistPage from "./pages/Wishlist";
import ComparePage from "./pages/Compare";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import InfoPageView from "./pages/InfoPage";
import ContactPage from "./pages/Contact";
import TrackOrder from "./pages/TrackOrder";
import CollectionsIndex from "./pages/CollectionsIndex";
import NotFound from "./pages/NotFound";

function AnimatedRoutes() {
  const location = useLocation();
  const wrap = (el: React.ReactNode) => <PageTransition>{el}</PageTransition>;
  useEffect(() => {
    useUI.getState().setCart(false);
    useUI.getState().setSearch(false);
    useUI.getState().setMenu(false);
    useUI.getState().openQuickView(undefined);
  }, [location.pathname]);
  return (
      <Routes location={location} key={location.pathname}>
        <Route index element={wrap(<Home />)} />
        <Route path="collections" element={wrap(<CollectionsIndex />)} />
        <Route path="collections/:handle" element={wrap(<CollectionPage />)} />
        <Route path="products/:handle" element={wrap(<ProductPage />)} />
        <Route path="search" element={wrap(<SearchPage />)} />
        <Route path="cart" element={wrap(<CartPage />)} />
        <Route path="checkout" element={wrap(<CheckoutPage />)} />
        <Route path="order/:id" element={wrap(<OrderSuccess />)} />
        <Route path="account/*" element={wrap(<AccountPage />)} />
        <Route path="pages/my-wishlist" element={wrap(<WishlistPage />)} />
        <Route path="wishlist" element={wrap(<WishlistPage />)} />
        <Route path="compare" element={wrap(<ComparePage />)} />
        <Route path="blogs/style" element={wrap(<BlogList />)} />
        <Route path="blogs/style/:slug" element={wrap(<BlogPost />)} />
        <Route path="pages/contact-us" element={wrap(<ContactPage />)} />
        <Route path="pages/live-chat-support" element={wrap(<ContactPage chat />)} />
        <Route path="pages/track-order" element={wrap(<TrackOrder />)} />
        <Route path="pages/:slug" element={wrap(<InfoPageView />)} />
        <Route path="*" element={wrap(<NotFound />)} />
      </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <ErrorBoundary key="page-error"><AnimatedRoutes /></ErrorBoundary>
      </Layout>
      <Toaster position="bottom-center" richColors closeButton toastOptions={{ style: { borderRadius: 14, fontFamily: "var(--font-body)" } }} />
    </BrowserRouter>
  );
}
