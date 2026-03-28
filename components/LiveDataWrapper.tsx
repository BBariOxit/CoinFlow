"use client";

import { useOkxWebSocket } from "@/hooks/useOkxWebSocket";
import CandlestickChart from "./CandlestickChart";
import { Separator } from "./ui/separator";

const LiveDataWrapper = ({ children, coinId, poolId, coin, coinOHLCData }: LiveDataProps) => {
  const { trades } = useOkxWebSocket({ coinId, poolId });
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
    </section>
  );
};

export default LiveDataWrapper;
