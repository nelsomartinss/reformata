import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://reformata.example.com",
  ),
  title: {
    default: "REFORMATA ·  A fé reformada em seus textos",
    template: "%s · Reformata",
  },
  description:
    "Uma leitura simples e cuidadosa dos textos reformados com suas referências bíblicas.",
  applicationName: "REFORMATA",
  openGraph: {
    title: "REFORMATA · A fé reformada em seus textos",
    description: "A fé reformada com referências bíblicas.",
    type: "website",
    locale: "pt_BR",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
