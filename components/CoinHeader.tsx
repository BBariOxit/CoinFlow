import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";

const CoinHeader = ({
  livePriceChangePercentage24h,
  priceChangePercentage30d,
  name,
  image,
  livePrice,
  priceChange24h,
}: LiveCoinHeaderProps) => {
  const getTrendDirection = (value: number) => {
    if (value > 0) return "up";
    if (value < 0) return "down";
    return "flat";
  };

  const trend24hDirection = getTrendDirection(livePriceChangePercentage24h);
  const trend30dDirection = getTrendDirection(priceChangePercentage30d);
  const priceChangeDirection = getTrendDirection(priceChange24h);

  const stats = [
    {
      label: "Today",
      value: livePriceChangePercentage24h,
      direction: trend24hDirection,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: "30 Days",
      value: priceChangePercentage30d,
      direction: trend30dDirection,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: "Price Change (24h)",
      value: priceChange24h,
      direction: priceChangeDirection,
      formatter: formatCurrency,
      showIcon: false,
    },
  ];

  return (
    <div id="coin-header">
      <h3>{name}</h3>

      <div className="info">
        <Image src={image} alt={name} width={77} height={77} />

        <div className="price-row">
          <h1>{formatCurrency(livePrice)}</h1>
          <Badge
            className={cn(
              "badge",
              trend24hDirection === "up" && "badge-up",
              trend24hDirection === "down" && "badge-down"
            )}
          >
            {formatPercentage(livePriceChangePercentage24h)}
            {trend24hDirection === "up" && <TrendingUp className="-translate-y-0.5" />}
            {trend24hDirection === "down" && <TrendingDown className="-translate-y-0.5" />}
            (24h)
          </Badge>
        </div>
      </div>

      <ul className="stats">
        {stats.map((stat) => (
          <li key={stat.label}>
            <p className="label">{stat.label}</p>

            <div
              className={cn("value", {
                "text-green-400": stat.direction === "up",
                "text-red-400": stat.direction === "down",
                "text-purple-100": stat.direction === "flat",
              })}
            >
              <p>{stat.formatter(stat.value)}</p>
              {stat.showIcon && stat.direction === "up" && (
                <TrendingUp width={16} height={16} className="-translate-y-0.5" />
              )}
              {stat.showIcon && stat.direction === "down" && (
                <TrendingDown width={16} height={16} className="-translate-y-0.5" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinHeader;
