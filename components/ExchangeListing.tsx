"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import DataTable from "@/components/DataTable";
import { formatCurrency, timeAgo } from "@/lib/utils";

interface ExchangeListingProps {
  tickers: Ticker[];
}

const ExchangeListing = ({ tickers }: ExchangeListingProps) => {
  // Force re-render every 30s to keep timeAgo values fresh
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);
  const exchangeColumns: DataTableColumn<Ticker>[] = [
    {
      header: "Exchange",
      cellClassName: "exchange-name",
      cell: (ticker) => (
        <>
          {ticker.market.name || "-"}
          {ticker.trade_url && (
            <Link href={ticker.trade_url} target="_blank" aria-label="Open exchange market" />
          )}
        </>
      ),
    },
    {
      header: "Pair",
      cellClassName: "pair",
      cell: (ticker) => (
        <>
          <p>{ticker.base || "-"}</p>
          <span>/</span>
          <p>{ticker.target || "-"}</p>
        </>
      ),
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (ticker) =>
        typeof ticker.converted_last?.usd === "number"
          ? formatCurrency(ticker.converted_last.usd)
          : "-",
    },
    {
      header: "Last Traded",
      headClassName: "text-end",
      cellClassName: "time-cell",
      cell: (ticker) => (ticker.timestamp ? timeAgo(ticker.timestamp) : "-"),
    },
  ];

  const exchangeRows = tickers.slice(0, 10);

  return (
    <section className="exchange-section">
      <h4>Exchange Listings</h4>

      <DataTable
        columns={exchangeColumns}
        data={exchangeRows}
        rowKey={(ticker, index) => `${ticker.market.name}-${ticker.base}-${ticker.target}-${index}`}
        tableClassName="exchange-table"
      />
    </section>
  );
};

export default ExchangeListing;
