"use client";

import { useOkxWebSocket } from "@/hooks/useOkxWebSocket";
import CandlestickChart from "./CandlestickChart";
import { Separator } from "./ui/separator";
import { formatCurrency, timeAgo } from "@/lib/utils";
import DataTable from "./DataTable";
import { useState } from "react";
import CoinHeader from "./CoinHeader";
import { LivePriceContext } from "@/hooks/useLivePrice";

const LiveDataWrapper = ({ children, coinId, poolId, coin, coinOHLCData, secondaryContent }: LiveDataProps) => {
  const [liveInterval, setLiveInterval] = useState<"1s" | "1m">("1s");

  const { trades, ohlcv, price } = useOkxWebSocket({ coinId, poolId, liveInterval });

  const tradeColumns: DataTableColumn<Trade>[] = [
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (trade) => (trade.price ? formatCurrency(trade.price) : "-"),
    },
    {
      header: "Amount",
      cellClassName: "amount-cell",
      cell: (trade) => trade.amount?.toFixed(4) ?? "-",
    },
    {
      header: "Value",
      cellClassName: "value-cell",
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : "-"),
    },
    {
      header: "Buy/Sell",
      cellClassName: "type-cell",
      cell: (trade) => {
        const side = trade.type?.toLowerCase();
        const isBuy = side === "buy" || side === "b";
        const isSell = side === "sell" || side === "s";

        if (!isBuy && !isSell) {
          return <span>-</span>;
        }

        return (
          <span className={isBuy ? "text-green-400" : "text-red-400"}>
            {isBuy ? "Buy" : "Sell"}
          </span>
        );
      },
    },
    {
      header: "Time",
      cellClassName: "time-cell",
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : "-"),
    },
  ];

  return (
    <LivePriceContext.Provider value={price?.usd}>
    <section id="live-data-wrapper" className="primary">
      <CoinHeader
        name={coin.name}
        image={coin.image.large}
        livePrice={price?.usd ?? coin.market_data.current_price.usd}
        livePriceChangePercentage24h={
          price?.change24h ?? coin.market_data.price_change_percentage_24h_in_currency.usd
        }
        priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
        priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
      />
      <Separator className="divider" />
      <div className="trend">
        <CandlestickChart
          coinId={coinId}
          data={coinOHLCData}
          liveOhlcv={ohlcv}
          mode="live"
          initialPeriod="daily"
          liveInterval={liveInterval}
          setLiveInterval={setLiveInterval}
        >
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>

      <Separator className="divider" />

      {tradeColumns && (
        <div className="trades">
          <h4>Recent Trades</h4>

          <DataTable
            columns={tradeColumns}
            data={trades}
            rowKey={(_, index) => index}
            tableClassName="trades-table"
          />
        </div>
      )}

      {children}
    </section>

    {secondaryContent}
    </LivePriceContext.Provider>
  );
};

export default LiveDataWrapper;
