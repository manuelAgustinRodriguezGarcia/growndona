import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "@/styles/globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Growndona",
    template: "%s · Growndona",
  },
  description: "Seguimiento organizado de cultivos: parámetros, riegos, fotos y más.",
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
