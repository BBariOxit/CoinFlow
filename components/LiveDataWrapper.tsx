"use client";

import { useOkxWebSocket } from "@/hooks/useOkxWebSocket";
import CandlestickChart from "./CandlestickChart";
import { Separator } from "./ui/separator";
import { formatCurrency, timeAgo } from "@/lib/utils";
import DataTable from "./DataTable";

const LiveDataWrapper = ({ children, coinId, poolId, coin, coinOHLCData }: LiveDataProps) => {
  const { trades } = useOkxWebSocket({ coinId, poolId });

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
    <section id="live-data-wrapper">
      <p>Coin header</p>
      <Separator className="divider" />
      <div className="trend">
        <CandlestickChart coinId={coinId} data={coinOHLCData}>
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
    </section>
  );
};

export default LiveDataWrapper;
