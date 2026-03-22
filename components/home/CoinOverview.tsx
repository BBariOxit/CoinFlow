/* eslint-disable react-hooks/error-boundaries */
import { fetcher } from "@/lib/coingecko.action";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import CandlestickChart from "../CandlestickChart";
import { CoinOverviewFallback } from "./fallback";

const CoinOverview = async () => {
  let coin;
  let coinOHLCData;

  try {
    [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>("/coins/bitcoin", {
        dex_pair_format: "symbol",
      }),
      fetcher<OHLCData[]>("/coins/bitcoin/ohlc", {
        vs_currency: "usd",
        days: 1,
        precision: "full",
      }),
    ]);

    return (
      <div id="coin-overview">
        <CandlestickChart data={coinOHLCData} coinId="bitcoin">
          <div className="header pt-2">
            <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
            <div className="info">
              <p>
                {coin.name} / {coin.symbol.toUpperCase()}
              </p>
              <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
            </div>
          </div>
        </CandlestickChart>
      </div>
    );
  } catch (error) {
    console.error("Failed to load CoinOverview data", error);
    return <CoinOverviewFallback />;
  }
};

export default CoinOverview;
