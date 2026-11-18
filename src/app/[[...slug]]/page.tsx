"use client";

// Next.js hands every URL to this optional catch-all route.
// From here React Router DOM takes over all client-side navigation.
import dynamic from "next/dynamic";
import Splash from "@/spa/components/Splash";

const App = dynamic(() => import("@/spa/App"), { ssr: false, loading: () => <Splash /> });

export default function Page() {
  return <App />;
}
