import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Baloo_2, Poppins } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

// The Equal Lens type system: Nunito Sans (body), Baloo 2 (headlines / mascots / Lensy speech),
// Poppins (wordmark + UI labels). See docs/brand-alignment.md.
const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  applicationName: "SwipeEd",
  title: { default: "SwipeEd by The Equal Lens", template: "%s · SwipeEd" },
  description:
    "SwipeEd is a learning path of warm, no-fail games for ages 3-18 about feelings, bodies, relationships, gender, rights and digital life, built on Unlearn → Relearn → Grow.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "SwipeEd" },
  icons: {
    icon: [
      { url: "/brand/swipeed/logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#553286",
  width: "device-width",
  initialScale: 1,
  // Allow pinch-zoom (WCAG 1.4.4 / 1.4.10): never disable user scaling. Drag gestures scope their own
  // touch-action, so zoom and gestures coexist.
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${baloo.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppShell>{children}</AppShell>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
