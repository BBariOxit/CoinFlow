import React from "react";
import DataTable from "@/components/DataTable";

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image skeleton" />
        <div className="info">
          <div className="header-line-sm skeleton" />
          <div className="header-line-lg skeleton" />
        </div>
      </div>

      <div className="chart">
        <div className="chart-skeleton skeleton" />
      </div>
    </div>
  );
};

export const TrendingCoinsFallback = () => {
  const data = Array.from({ length: 6 }, (_, index) => index);

  const columns: DataTableColumn<number>[] = [
    {
      header: "Name",
      cellClassName: "name-cell",
      cell: () => (
        <div className="name-link">
          <div className="name-image skeleton" />
          <div className="name-line skeleton" />
        </div>
      ),
    },
    {
      header: "24h change",
      cellClassName: "change-cell",
      cell: () => (
        <div className="price-change">
          <div className="change-icon skeleton" />
          <div className="change-line skeleton" />
        </div>
      ),
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: () => <div className="price-line skeleton" />,
    },
  ];

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        data={data}
        columns={columns}
        rowKey={(row) => row}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
    </div>
  );
};

export const CategoriesFallback = () => {
  const data = Array.from({ length: 10 }, (_, index) => index);

  const columns: DataTableColumn<number>[] = [
    {
      header: "Category",
      cellClassName: "category-cell",
      cell: () => <div className="category-skeleton skeleton" />,
    },
    {
      header: "Top Gainers",
      cellClassName: "top-gainers-cell",
      cell: () => (
        <div className="top-gainers-cell">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="coin-skeleton skeleton" />
          ))}
        </div>
      ),
    },
    {
      header: "24h Change",
      cellClassName: "change-header-cell",
      cell: () => (
        <div className="change-cell">
          <div className="change-icon skeleton" />
          <div className="value-skeleton-sm skeleton" />
        </div>
      ),
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: () => <div className="value-skeleton-md skeleton" />,
    },
    {
      header: "24h Volume",
      cellClassName: "volume-cell",
      cell: () => <div className="value-skeleton-lg skeleton" />,
    },
  ];

  return (
    <div id="categories-fallback" className="custom-scrollbar">
      <h4>Top Categories</h4>
      <DataTable columns={columns} data={data} rowKey={(row) => row} tableClassName="mt-3" />
    </div>
  );
};
