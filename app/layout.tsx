import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoinFlow",
  description: "Crypto Screener App with a built-in High-Frequency Terminal & Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${robotoSans.variable} ${geistMono.variable} antialiased`}
      >
      <Header />
        {children}
      </body>
    </html>
  );
}
