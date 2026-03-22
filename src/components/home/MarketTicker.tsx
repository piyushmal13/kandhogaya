import React, { useEffect } from 'react';

const defaultPairs = [
  { symbol: "XAUUSD", price: "2150.45", change: "+0.45%", up: true },
  { symbol: "EURUSD", price: "1.0845", change: "-0.12%", up: false },
  { symbol: "BTCUSD", price: "64230.00", change: "+2.40%", up: true },
  { symbol: "NASDAQ", price: "18240.50", change: "+1.10%", up: true },
  { symbol: "GBPUSD", price: "1.2650", change: "-0.05%", up: false },
  { symbol: "USDJPY", price: "149.80", change: "+0.20%", up: true },
  { symbol: "US30", price: "39087.30", change: "+0.85%", up: true },
  { symbol: "ETHUSD", price: "3450.00", change: "+1.80%", up: true },
];

export const MarketTicker = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget if it exists
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        { "proName": "FOREXCOM:XAUUSD", "title": "Gold" },
        { "proName": "FOREXCOM:EURUSD", "title": "EUR/USD" },
        { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
        { "proName": "FOREXCOM:GBPUSD", "title": "GBP/USD" },
        { "proName": "FOREXCOM:USDJPY", "title": "USD/JPY" },
        { "proName": "INDEX:SPX", "title": "S&P 500" },
        { "proName": "INDEX:IUXX", "title": "Nasdaq 100" },
        { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full bg-[#050505] border-y border-white/5 relative z-20 overflow-hidden">
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
      <style>{`
        .tradingview-widget-container {
          width: 100%;
          height: 46px; /* Optimized height for the ticker tape */
        }
        /* Hide the TradingView attribution link to keep it institutional */
        .tradingview-widget-copyright {
          display: none !important;
        }
      `}</style>
    </div>
  );
};
