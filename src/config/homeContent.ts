export const homeContent = {
  hero: {
    badge: "IFXTrades Intelligence Hub",
    titleLine1: "The Operating",
    titleLine2: "System for",
    titleHighlight: "Retail Traders",
    description: "Institutional-grade signals, automated algorithms, and elite education. Built for the modern trader who demands precision.",
    primaryCta: { text: "View Live Signals", link: "/signals" },
    secondaryCta: { text: "Explore Algorithms", link: "/marketplace" }
  },
  stats: [
    { label: "Pips Generated", value: "48,250+" },
    { label: "Strategy Accuracy", value: "82.4%" },
    { label: "Active Traders", value: "12,000+" },
    { label: "Trader Payouts", value: "$2.4M" }
  ],
  terminal: {
    title: "Institutional Precision",
    description: "Experience the power of our proprietary trading terminal, built for speed and accuracy.",
    activeSignals: [
      { pair: "XAUUSD", type: "BUY", entry: "2150.45", tp: "2165.00", sl: "2140.00", time: "2m ago", profit: "+45 pips" },
      { pair: "EURUSD", type: "SELL", entry: "1.0845", tp: "1.0790", sl: "1.0880", time: "15m ago", profit: "+12 pips" }
    ]
  },
  videoSection: {
    badge: "Under the Hood",
    title: "How Our Algos Dominate",
    description: "Watch the breakdown of our proprietary trading logic and see why thousands trust IFXTrades.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Replace with your actual video URL
    posterUrl: "https://picsum.photos/seed/tradingchart/1920/1080", // Replace with your actual poster image
    videoTitle: "The Neural Net Architecture",
    videoDuration: "04:28 / 12:15"
  },
  reviews: [
    { 
      name: "Michael T.", 
      role: "Prop Firm Funded", 
      text: "Passed my $100k challenge in 12 days using the XAUUSD bot. The drawdown management is insane.", 
      rating: 5 
    },
    { 
      name: "Sarah L.", 
      role: "Retail Trader", 
      text: "I've tried dozens of EAs. This is the only one that actually adapts to news events instead of blowing the account.", 
      rating: 5 
    },
    { 
      name: "David K.", 
      role: "Institutional Analyst", 
      text: "The underlying logic mirrors institutional order block trading. Very impressive architecture.", 
      rating: 5 
    }
  ]
};
