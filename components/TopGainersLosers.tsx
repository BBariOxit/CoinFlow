"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TopGainersLosersProps {
  initialGainers: TopGainersLosers[];
  initialLosers: TopGainersLosers[];
}

function CoinRow({ coin }: { coin: TopGainersLosers }) {
  const isGainer = coin.priceChangePercentage24h > 0;

  return (
    <Link
      href={`/coins/${coin.id}`}
      className="flex items-center justify-between bg-dark-500 rounded-xl px-5 py-4 border border-dark-400/50 hover:border-purple-600/40 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Image
          src={coin.image}
          alt={coin.name}
          width={44}
          height={44}
          className="size-11 rounded-full"
        />
        <div className="flex flex-col gap-1.5">
          <p className="font-semibold text-base text-white">{coin.name}</p>
          <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <p className="font-semibold text-base text-white">
          {formatCurrency(coin.price)}
        </p>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            isGainer ? "text-green-400" : "text-red-400"
          }`}
        >
          {isGainer ? (
            <TrendingUp width={14} height={14} />
          ) : (
            <TrendingDown width={14} height={14} />
          )}
          <span>
            {formatPercentage(Math.abs(coin.priceChangePercentage24h))}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function TopGainersLosers({
  initialGainers,
  initialLosers,
}: TopGainersLosersProps) {
  if (initialGainers.length === 0 && initialLosers.length === 0) {
    return null;
  }

  return (
    <div id="top-gainers-losers">
      <Tabs defaultValue="gainers">
        <TabsList className="tabs-list">
          <TabsTrigger value="gainers" className="tabs-trigger text-purple-100 data-[state=active]:text-white">
            Top Gainers
          </TabsTrigger>
          <TabsTrigger value="losers" className="tabs-trigger text-purple-100 data-[state=active]:text-white">
            Top Losers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gainers" className="tabs-content grid gap-5 mt-2">
          {initialGainers.map((coin) => (
            <CoinRow key={coin.id} coin={coin} />
          ))}
        </TabsContent>

        <TabsContent value="losers" className="tabs-content grid gap-5 mt-2">
          {initialLosers.map((coin) => (
            <CoinRow key={coin.id} coin={coin} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
