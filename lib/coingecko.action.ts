"use server";

import qs from "query-string";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error("could not get base url");
if (!API_KEY) throw new Error("could not get api key");

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
  );

  const response = await fetch(url, {
    headers: {
      "x-cg-demo-api-key": API_KEY,
      "Content-Type": "application/json",
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));

    throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText} `);
  }
  return response.json();
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null
): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
  };

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`
      );

      return poolData.data?.[0] ?? fallback;
    } catch (error) {
      console.log(error);
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>("/onchain/search/pools", { query: id });

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}

interface CoinGeckoSearchCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

interface CoinGeckoSearchResponse {
  coins?: CoinGeckoSearchCoin[];
}

interface CoinMarketSearchResponse {
  id: string;
  current_price?: number;
  price_change_percentage_24h?: number;
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) return [];

  const searchData = await fetcher<CoinGeckoSearchResponse>("search", {
    query: trimmedQuery,
  });

  const topCoins = (searchData.coins ?? []).slice(0, 10);

  if (topCoins.length === 0) return [];

  const ids = topCoins.map((coin) => coin.id).join(",");

  const marketData = await fetcher<CoinMarketSearchResponse[]>("coins/markets", {
    vs_currency: "usd",
    ids,
    per_page: 10,
    page: 1,
    sparkline: false,
  });

  const marketById = new Map(marketData.map((coin) => [coin.id, coin]));

  return topCoins.map((coin) => {
    const market = marketById.get(coin.id);

    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      market_cap_rank: coin.market_cap_rank,
      thumb: coin.thumb,
      large: coin.large,
      data: {
        price: market?.current_price,
        price_change_percentage_24h: market?.price_change_percentage_24h ?? 0,
      },
    };
  });
}
