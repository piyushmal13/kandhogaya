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
    <div className="mb-14 overflow-hidden py-5 -mx-4 px-6 bg-emerald-500/[0.02] border-y border-white/5 backdrop-blur-3xl relative group">
      {/* Live Status Pulse */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/20">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest font-mono">LIVE FEED</span>
      </div>

      <div className="flex items-center gap-16 whitespace-nowrap animate-ticker translate-x-32 group-hover:[animation-play-state:paused] transition-all duration-500">
        {[...data, ...data].map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-4 group/item">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] font-mono group-hover/item:text-emerald-500 transition-colors">{item.symbol}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-black text-white tabular-nums tracking-tighter italic">${item.price}</span>
                <div className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-tighter transition-all",
                  item.up ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                )}>
                  {item.up ? "▲" : "▼"} {item.change}
                </div>
              </div>
            </div>
            {/* Visual Separator */}
            <div className="w-px h-6 bg-white/5 mx-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
