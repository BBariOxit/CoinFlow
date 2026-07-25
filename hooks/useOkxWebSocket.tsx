"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const OKX_WS_URL = "wss://ws.okx.com:8443/ws/v5/public";

const COIN_ID_TO_SYMBOL: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  tether: "USDT",
  ripple: "XRP",
  solana: "SOL",
  dogecoin: "DOGE",
  cardano: "ADA",
  tron: "TRX",
  chainlink: "LINK",
  litecoin: "LTC",
  polkadot: "DOT",
  avalanche: "AVAX",
  toncoin: "TON",
  "shiba-inu": "SHIB",
  aptos: "APT",
  sui: "SUI",
  uniswap: "UNI",
  binancecoin: "BNB",
  "usd-coin": "USDC",
  stellar: "XLM",
  hedera: "HBAR",
  monero: "XMR",
  "matic-network": "MATIC",
  polygon: "POL",
  filecoin: "FIL",
  cosmos: "ATOM",
  "internet-computer": "ICP",
  render: "RENDER",
  near: "NEAR",
  algorand: "ALGO",
  pepe: "PEPE",
  aave: "AAVE",
  "the-graph": "GRT",
  arbitrum: "ARB",
  optimism: "OP",
  injective: "INJ",
  sei: "SEI",
  "fetch-ai": "FET",
  mantle: "MNT",
  maker: "MKR",
  ondo: "ONDO",
  kaspa: "KAS",
  celestia: "TIA",
  worldcoin: "WLD",
  bonk: "BONK",
  floki: "FLOKI",
  "lido-dao": "LDO",
  sandbox: "SAND",
  decentraland: "MANA",
  axie: "AXS",
  eos: "EOS",
  "bitcoin-cash": "BCH",
  "ethereum-classic": "ETC",
};

const QUOTE_CURRENCIES = new Set(["USDT", "USDC", "USD", "BTC", "ETH", "EUR"]);

const toNumber = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const toExplicitInstId = (value: string): string | null => {
  if (!value) return null;

  const parts = value.toUpperCase().split("-");
  if (parts.length !== 2) return null;

  const [base, quote] = parts;
  if (!base || !quote || !QUOTE_CURRENCIES.has(quote)) {
    return null;
  }

  return `${base}-${quote}`;
};

const toInstId = (coinId: string, poolId: string): string => {
  const poolInstId = toExplicitInstId(poolId);
  if (poolInstId) return poolInstId;

  const coinInstId = toExplicitInstId(coinId);
  if (coinInstId) return coinInstId;

  const mappedSymbol = COIN_ID_TO_SYMBOL[coinId?.toLowerCase()];
  if (mappedSymbol) {
    return `${mappedSymbol}-USDT`;
  }

  return `${coinId?.toUpperCase()}-USDT`;
};

const getCandleChannel = (liveInterval: "1s" | "1m") =>
  liveInterval === "1s" ? "candle1s" : "candle1m";

interface OkxWsEvent {
  event?: string;
  arg?: {
    channel?: string;
    instId?: string;
  };
  data?: string[][] | Array<Record<string, string>>;
  msg?: string;
}

export const useOkxWebSocket = ({
  coinId,
  poolId,
  liveInterval = "1m",
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const instId = useMemo(() => toInstId(coinId, poolId), [coinId, poolId]);

  useEffect(() => {
    let unmounted = false;

    const clearTimers = () => {
      if (pingTimerRef.current) {
        clearInterval(pingTimerRef.current);
        pingTimerRef.current = null;
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const closeSocket = () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };

    const connect = () => {
      clearTimers();
      closeSocket();

      const ws = new WebSocket(OKX_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (unmounted) return;

        setIsConnected(true);

        ws.send(
          JSON.stringify({
            op: "subscribe",
            args: [
              { channel: "tickers", instId },
              { channel: "trades", instId },
              { channel: getCandleChannel(liveInterval), instId },
            ],
          })
        );

        pingTimerRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send("ping");
          }
        }, 25000);
      };

      ws.onmessage = (event: MessageEvent) => {
        const raw = event.data;

        if (raw === "pong") {
          return;
        }

        let payload: OkxWsEvent;
        try {
          payload = JSON.parse(raw);
        } catch {
          return;
        }

        if (payload.event === "error") {
          return;
        }

        if (!payload.arg?.channel || !payload.data || payload.data.length === 0) {
          return;
        }

        const channel = payload.arg.channel;

        if (channel === "tickers") {
          const ticker = payload.data[0] as Record<string, string>;
          const last = toNumber(ticker.last);
          const open24h = toNumber(ticker.open24h);
          const change24h = open24h === 0 ? 0 : ((last - open24h) / open24h) * 100;

          setPrice({
            usd: last,
            coin: payload.arg.instId,
            price: last,
            change24h,
            volume24h: toNumber(ticker.vol24h),
            timestamp: toNumber(ticker.ts),
          });
          return;
        }

        if (channel === "trades") {
          const trade = payload.data[0] as Record<string, string>;
          const tradePrice = toNumber(trade.px);
          const amount = toNumber(trade.sz);
          const newTrade: Trade = {
            price: tradePrice,
            value: tradePrice * amount,
            timestamp: toNumber(trade.ts),
            type: trade.side,
            amount,
          };

          setTrades((prev) => [newTrade, ...prev].slice(0, 7));
          return;
        }

        if (channel.startsWith("candle")) {
          const candle = payload.data[0] as string[];
          if (!Array.isArray(candle) || candle.length < 5) {
            return;
          }

          setOhlcv([
            toNumber(candle[0]),
            toNumber(candle[1]),
            toNumber(candle[2]),
            toNumber(candle[3]),
            toNumber(candle[4]),
          ]);
        }
      };

      ws.onerror = () => {
        if (unmounted) return;
        setIsConnected(false);
      };

      ws.onclose = () => {
        if (unmounted) return;

        setIsConnected(false);
        clearTimers();

        reconnectTimerRef.current = setTimeout(() => {
          connect();
        }, 2500);
      };
    };

    connect();

    return () => {
      unmounted = true;
      clearTimers();
      closeSocket();
      setIsConnected(false);
    };
  }, [instId, liveInterval]);

  return {
    price,
    trades,
    ohlcv,
    isConnected,
  };
};
