import type { Metadata } from "next";
import "./globals.css";
import NextAuthProvider from "@/components/providers/SessionProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "IdjorTrade — Terminal IA",
  description: "Analyse trading par IA pour les traders d'Afrique de l'Ouest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full circuit-bg" suppressHydrationWarning>
        <NextAuthProvider>{children}</NextAuthProvider>
        <Script src="https://cdn.kkiapay.me/k.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
