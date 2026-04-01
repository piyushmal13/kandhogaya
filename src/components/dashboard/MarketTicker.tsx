import React from "react";
import { cn } from "@/utils/cn";

interface MarketItem {
  symbol: string;
  price: string | number;
  change: string | number;
  up?: boolean;
}

interface MarketTickerProps {
  data: MarketItem[];
}

export const MarketTicker: React.FC<MarketTickerProps> = ({ data }) => {
  if (data.length === 0) return null;

  return (
    <div className="mb-12 overflow-hidden py-4 -mx-4 px-4 bg-white/5 border-y border-white/10 backdrop-blur-md">
      <div className="flex items-center gap-12 whitespace-nowrap animate-ticker">
        {[...data, ...data].map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-3">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.symbol}</span>
            <span className="text-sm font-bold text-white tabular-nums">${item.price}</span>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded",
              item.up ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            )}>
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
