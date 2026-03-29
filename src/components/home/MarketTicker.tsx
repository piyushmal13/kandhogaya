import React, { useEffect, useRef, memo } from "react";

/**
 * MarketTicker - Institutional TradingView Protocol
 * Migrated from legacy internal polling to authoritative industry-standard feeds.
 * Styled for maximum-density institutional aesthetic.
 */
export const MarketTicker = memo(() => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent duplicate scripts in dev/hot-reload
    const scriptId = "tradingview-ticker-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        { "proName": "FX_IDC:XAUUSD", "title": "GOLD" },
        { "proName": "FX_IDC:XAGUSD", "title": "SILVER" },
        { "proName": "OANDA:EURUSD", "title": "EUR/USD" },
        { "proName": "OANDA:GBPUSD", "title": "GBP/USD" },
        { "proName": "OANDA:USDJPY", "title": "USD/JPY" },
        { "proName": "BITSTAMP:BTCUSD", "title": "BTC/USD" },
        { "proName": "BITSTAMP:ETHUSD", "title": "ETH/USD" }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en",
      "backgroundColor": "#000000"
    });

    if (container.current) {
      container.current.appendChild(script);
    }

    return () => {
      // Cleanup on unmount to prevent memory leaks in navigation
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, []);

  return (
    <div className="w-full bg-[#050505] border-y border-white/5 backdrop-blur-3xl relative z-40 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div ref={container} className="tradingview-widget-container h-[48px] flex items-center">
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>
      
      {/* Institutional Left/Right Fade Guards */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
    </div>
  );
});

MarketTicker.displayName = "MarketTicker";
