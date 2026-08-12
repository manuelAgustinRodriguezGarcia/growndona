import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "@/styles/globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Growndona",
    template: "%s · Growndona",
  },
  description: "Seguimiento organizado de cultivos: parámetros, riegos, fotos y más.",
  openGraph: {
    title: "Growndona",
    description:
      "Seguimiento organizado de cultivos: parámetros, riegos, fotos y más.",
    siteName: "Growndona",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={geistSans.variable}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
