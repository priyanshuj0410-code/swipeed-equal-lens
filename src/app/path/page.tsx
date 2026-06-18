"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

// The 3D scene is a self-contained, client-only module — lazy-loaded (ssr:false) so
// the three.js bundle never touches the main entry and only loads on this route.
const PathScene = dynamic(() => import("@/components/path-scene").then((m) => m.PathScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
      <span className="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" aria-hidden />
      <span className="ml-2">Loading the path…</span>
    </div>
  ),
});

export default function PathPage() {
  return (
    <>
      {/* full-viewport scene; fixed so R3F always has a definite size to measure */}
      <div className="fixed inset-0 z-0 bg-[#d6ecfb]">
        <PathScene />
      </div>
      <Link
        href="/"
        aria-label="Back"
        className={buttonVariants({ variant: "secondary", size: "icon", className: "fixed left-4 top-4 z-50 rounded-full shadow-md" })}
      >
        <ArrowLeft className="size-5" aria-hidden />
      </Link>
    </>
  );
}
