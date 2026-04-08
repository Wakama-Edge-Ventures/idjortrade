import type { Metadata } from "next";
import "./globals.css";
import NextAuthProvider from "@/components/providers/SessionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Wickox — Terminal IA",
  description: "Analyse trading par IA pour les traders d'Afrique de l'Ouest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark h-full" suppressHydrationWarning>
      <body className="min-h-full antialiased" suppressHydrationWarning>
        <NextAuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </NextAuthProvider>
        <Script src="https://cdn.kkiapay.me/k.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
