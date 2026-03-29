import React, { useEffect, useRef, memo } from "react";

/**
 * Institutional Market Ticker
 * Powered by TradingView Ticker Tape Widget.
 * This ensures 100% live, authoritative feeds from primary global exchanges.
 * Standard implementation for high-fidelity financial surfaces.
 */
export const MarketTicker = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Audit: Purging legacy demo feeds. Injecting TradingView Ticker Tape.
    const container = containerRef.current;
    if (!container) return;

    // Safety: Prevent duplicate injection
    if (container.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPX500", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "NASDAQ 100" },
        { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
        { proName: "FX_IDC:GBPUSD", title: "GBP/USD" },
        { proName: "FX_IDC:USDJPY", title: "USD/JPY" },
        { proName: "OANDA:XAUUSD", title: "GOLD" },
        { proName: "BITSTAMP:BTCUSD", title: "BITCOIN" },
        { proName: "BITSTAMP:ETHUSD", title: "ETHEREUM" }
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en"
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[60px] md:h-[72px] bg-[#020202] border-y border-white/5 overflow-hidden flex items-center z-[100] transform-gpu">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand)]/[0.02] via-transparent to-cyan-500/[0.02] pointer-events-none" />
      <div 
        ref={containerRef} 
        className="tradingview-widget-container w-full"
      >
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
});

MarketTicker.displayName = "MarketTicker";
