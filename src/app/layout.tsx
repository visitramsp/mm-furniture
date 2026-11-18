import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "MN Furniture LTD | Wardrobes, Sofas, Sofa Beds & Beds UK",
  description:
    "Affordable premium furniture across the UK. Wardrobes, sofas, sofa beds, bedroom sets, beds, mattresses and garden furniture with free delivery and 30-day returns.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="font-body bg-grey-50 text-ink antialiased">{children}</body>
    </html>
  );
}
