# MN Furniture: Next.js + React Router storefront

This is a rebuild of mnfurnitureltd.co.uk with the Strivera Global look (navy `#0f1e3d`, orange `#f28c28`, Plus Jakarta Sans and Inter). It has premium animations and smooth page transitions.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

To deploy, push the repo to Vercel. You don't need any extra config.

## How routing works

Next.js sends every URL to `src/app/[[...slug]]/page.tsx`. That file mounts `src/spa/App.tsx`, and `BrowserRouter` from **react-router-dom** handles all navigation from there. Deep links and page refreshes keep working on every route.

## Libraries

| Library | Used for |
|---|---|
| next 14 | Framework, build, hosting |
| react-router-dom 6 | All page routing |
| framer-motion | Page transitions (curtain wipe), reveals, layout animations, drawers, modals |
| lenis | Smooth scrolling |
| swiper | Hero slider (fade + Ken Burns), testimonials |
| zustand (persist) | Cart, wishlist, compare, recently viewed, accounts and orders, saved in localStorage |
| react-hook-form + zod | Checkout validation (UK phone and postcode) |
| sonner | Toast notifications |
| lucide-react | Icons |
| tailwindcss | Styling, with the Strivera theme tokens in `tailwind.config.ts` |
| @fontsource | Self-hosted Inter and Plus Jakarta Sans |

## Pages and features (matches the live site, plus extras)

- **Home**: rotating announcement bar, parallax hero slider, perks marquee, top categories, sale bento grid, tabbed best sellers, deal of the week with live countdown, animated stats counters, shop by colour, testimonials slider, "why us" accordion (the site's SEO blocks), blog cards, recently viewed
- **Header**: sticky and hides on scroll, glass effect, **mega menu** with sub-categories, colour links, images and featured products. Mobile drawer menu.
- **Search overlay** (Ctrl/Cmd + K) with live suggestions, plus a full `/search` results page
- **Collection** `/collections/:handle`: 44 collection pages, sub-category chips, price range slider, colour/category/sale/fast-delivery/rating filters, 7 sort options, 3- or 4-column grid, "Load more", mobile filter sheet
- **Product card**: discount badge, hover image swap, wishlist, compare, quick view, quick add, delivery label, swatches, reviews, "Save £X"
- **Product page** `/products/:handle`: gallery with hover zoom, swipe and fullscreen lightbox; colour swatches; size options with price change; LED and assembly add-ons with "× Clear"; quantity; Add to Cart and Buy Now; Klarna pay-in-3 line; stock bar; delivery ETA date; share; "Ask about product" email link; tabs (Description, Additional information with specs and size table, Delivery, Reviews with write-a-review); sticky add-to-cart bar; related products
- **Cart drawer and cart page**: free-delivery progress bar, upsells, coupons (`WELCOME20`, `MN10`, `SALE15`)
- **Checkout**: 3 animated steps (information, delivery method, payment) with an animated card preview, PayPal or Klarna options, and an order confirmation page with confetti and a status timeline
- **Account**: log in, register, reset password, orders with tracking timeline, account details, saved address (fills checkout), wishlist
- **Wishlist** `/pages/my-wishlist`, **Compare** `/compare`, **Track order** `/pages/track-order`
- **Blog** `/blogs/style` and its 3 articles
- **Info pages** `/pages/...`: about, returns, privacy, terms, money-back, free delivery, care, interest-free credit, assembly guides (bed, wardrobe, sofa), FAQ
- **Contact** and **Live chat** (chat widget with auto-replies and quick topics), newsletter popup (£20 off), scroll progress bar, back-to-top button, 404 page

## Data

- `src/spa/data/catalog.ts`: products, collections, menu and store details. Images load from the live MN Furniture Shopify CDN.
- `src/spa/data/content.ts`: blog posts and info pages.
- 8 products in categories with no captured product photos (bedroom sets, mattress, bunk bed, chest, two sofa beds, grey sofa) are **sample entries**. They use the site's collection images and placeholder prices. Replace them with real products.

## Demo-only parts (need a backend before going live)

- Payments, accounts, orders, reviews and contact forms run in the browser and are saved in localStorage only.
- To go live, connect the Shopify Storefront API (or your own Node API) and Stripe or Klarna in `src/spa/store/index.ts` and `src/spa/pages/Checkout.tsx`.


## Stability & UI refresh (November 2026)
- Replaced the old full-screen route curtain and `AnimatePresence mode="wait"` with non-blocking transitions.
- Fixed navigation scroll behaviour: header stays visible and sticky; native scrolling replaces wheel interception.
- Initial splash redesigned with an elegant branded, reduced-motion-aware animated loading indicator.
- Route changes close side panels and reset any locked body scrolling.
- Added route rendering error fallback, image source reset, focus styles, and responsive finishing touches.
- Removed intrusive automatic newsletter popup (newsletter sign-up remains available in footer).
- Existing checkout, accounts and orders are **demo/browser-only**; no production payments or server-side authentication are integrated.

## Account, orders, gallery and chat fixes
- Account order cards now show every purchased item with photo, quantity, options, unit/line totals, and expandable address, delivery, payment, status and cost breakdown.
- Product fullscreen images render in a body-level portal so they cannot overlap the page or be clipped by route animation. Body scrolling locks while the lightbox is open; Escape and arrow keys work.
- Chat scrolling stays inside the widget rather than unexpectedly scrolling the whole website; delayed replies are cleaned up.
- Account updates validate name and phone, delivery address validates a UK postcode, and demo users can update their password with current-password confirmation.
- Password reset email is explicitly unavailable in the browser-only demo; no fake email-delivered message is shown.
- `npm run build` passed on Next.js 14.2.35 after these changes.

## Cross-page audit (V3)
- Collection/search sorting now uses real click events, enabling keyboard and touch selection reliably.
- Mobile filter drawer uses a document-level portal and locks background scrolling; Escape closes the drawer.
- Contact form opens a prefilled email draft for the customer to send. No fictitious "sent" confirmation is shown without a contact backend.
- Automated chat identifies itself as a demo assistant, and unsupported topics direct visitors to actual contact details.
- Checkout labels all payment methods as demo-only, never requests card numbers, and creates sample orders only. A production payment gateway is still required.
- Global button, typography, focus and narrow-screen polish applied consistently across the storefront.
- Production build passed. Automated interactive Chromium testing was not possible in the workspace due to Chromium socket permissions; backend-powered account/payment/contact workflows remain outside this frontend-only demo.

## Responsive gallery and storefront update (V4)
- Product gallery now has a horizontal thumbnail selector **below** the main image on every screen size. Each image has an accessible label, visible selected border, and scroll-snap scrolling.
- Fixed product-card semantics: separate image link from wishlist, compare, quick-view and add-to-cart buttons (no interactive controls nested inside links). Touch devices can use actions without hover.
- Product/quick-view purchase controls stack on narrow phones; image thumbnail strips scroll independently of the page.
- Header switches to mobile/tablet navigation until 2XL width so the nine-item desktop menu does not crowd smaller laptops.
- Search form, Home hero, cart item rows, checkout-adjacent cards and footer perks received small-screen layout fixes.
- New design remains compatible with the same Next.js / Tailwind setup and local browser-demo stores.
