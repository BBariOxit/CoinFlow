import Converter from "@/components/Converter";
import ExchangeListing from "@/components/ExchangeListing";
import LiveDataWrapper from "@/components/LiveDataWrapper";
import TopGainersLosers from "@/components/TopGainersLosers";
import { fetcher, getPools } from "@/lib/coingecko.action";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  const [coinData, coinOHLCData, marketData] = await Promise.all([
    fetcher<CoinDetailsData>(`/coins/${id}`, {
      dex_pair_format: "contract_address",
    }),

    fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
      vs_currency: "usd",
      days: 1,
      // interval: "hourly",
      precision: "full",
    }),

    fetcher<CoinMarketData[]>("/coins/markets", {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 250,
      page: 1,
      sparkline: false,
      price_change_percentage: "24h",
    }),
  ]);

  const platform = coinData.asset_platform_id
    ? coinData.detail_platforms?.[coinData.asset_platform_id]
    : null;

  const geckoTerminalUrl = platform?.geckoterminal_url;
  const netWork = geckoTerminalUrl ? geckoTerminalUrl.split("/")[3] || null : null;
  const contractAddress = platform?.contract_address || null;

  const pool = await getPools(id, netWork, contractAddress);

  // Compute top gainers and losers from market data
  const validCoins = marketData.filter(
    (coin) =>
      coin.price_change_percentage_24h !== null &&
      coin.price_change_percentage_24h !== undefined &&
      coin.current_price !== null &&
      coin.image
  );

  const sorted = [...validCoins].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
  );

  const topGainers: TopGainersLosers[] = sorted.slice(0, 4).map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    image: coin.image,
    price: coin.current_price,
    priceChangePercentage24h: coin.price_change_percentage_24h,
  }));

  const topLosers: TopGainersLosers[] = sorted
    .slice(-4)
    .reverse()
    .map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      price: coin.current_price,
      priceChangePercentage24h: coin.price_change_percentage_24h,
    }));

  const coinDetails = [
    {
      label: "Market Cap",
      value: formatCurrency(coinData.market_data.market_cap.usd),
    },
    {
      label: "Market Cap Rank",
      value: `# ${coinData.market_cap_rank}`,
    },
    {
      label: "Total Volume",
      value: formatCurrency(coinData.market_data.total_volume.usd),
    },
    {
      label: "Website",
      value: "-",
      link: coinData.links.homepage[0],
      linkText: "Homepage",
    },
    {
      label: "Explorer",
      value: "-",
      link: coinData.links.blockchain_site[0],
      linkText: "Explorer",
    },
    {
      label: "Community",
      value: "-",
      link: coinData.links.subreddit_url,
      linkText: "Community",
    },
  ];

  return (
    <main id="coin-details-page">
      <LiveDataWrapper
        coinId={id}
        poolId={pool.id}
        coin={coinData}
        coinOHLCData={coinOHLCData}
        secondaryContent={(
          <section key="secondary" className="secondary">
            <Converter
              symbol={coinData.symbol}
              icon={coinData.image.small}
              priceList={coinData.market_data.current_price}
            />

            <div className="details">
              <h4>Coin Details</h4>

              <ul className="details-grid">
                {coinDetails.map(({ label, value, link, linkText }, index) => (
                  <li key={index}>
                    <p className={label}>{label}</p>

                    {link ? (
                      <div className="link">
                        <Link href={link} target="_blank">
                          {linkText || label}
                        </Link>
                        <ArrowUpRight size={16} />
                      </div>
                    ) : (
                      <p className="text-base font-medium">{value}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <TopGainersLosers initialGainers={topGainers} initialLosers={topLosers} />
          </section>
        )}
      >
        <ExchangeListing tickers={coinData.tickers} />
      </LiveDataWrapper>
    </main>
  );
};

export default page;
