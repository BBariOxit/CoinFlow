import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { fetcher } from "@/lib/coingecko.action";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let trendingCoins: TrendingCoin[] = [];

  try {
    const trendingData = await fetcher<{ coins: TrendingCoin[] }>(
      "/search/trending",
      undefined,
      300
    );
    trendingCoins = trendingData.coins ?? [];
  } catch (error) {
    console.error("Failed to load header trending coins", error);
  }

  return (
    <html lang="en" className="dark">
      <body className={`${robotoSans.variable} ${geistMono.variable} antialiased`}>
        <Header trendingCoins={trendingCoins} />
        {children}
      </body>
    </html>
  );
}
