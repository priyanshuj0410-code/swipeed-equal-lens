import type { Metadata, Viewport } from "next";
import { Nunito, Fredoka } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "SwipeEd",
  title: { default: "SwipeEd", template: "%s · SwipeEd" },
  description:
    "SwipeEd is a learning path of warm, no-fail games for ages 3–18 — feelings, bodies, relationships, gender, rights and digital life — built on Unlearn → Relearn → Grow.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "SwipeEd" },
  icons: {
    icon: [
      { url: "/swipeed-logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f6ef7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
      className={`${nunito.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppShell>{children}</AppShell>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
