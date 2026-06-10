export const homeContent = {
  hero: {
    badge: "IFX Trading Technology",
    titleLine1: "The Quantitative",
    titleLine2: "Architecture for",
    titleHighlight: "Elite Capital",
    description: "Institutional-grade research, automated algorithmic models, and high-fidelity education. Developed for the meticulous operator who demands precision.",
    primaryCta: { text: "Audit Research Feed", link: "/signals" },
    secondaryCta: { text: "Discover Algos", link: "/marketplace" }
  },
  stats: [
    { label: "Performance Metrics", value: "Verified" },
    { label: "Historical Win Rate", value: "82.4%" },
    { label: "Active Clients", value: "12,000+" },
    { label: "Capital Supervised", value: "$2.4M" }
  ],
  terminal: {
    title: "Institutional Precision",
    description: "Experience the power of our proprietary trading ecosystem, built for speed and accuracy.",
    activeSignals: [
      { pair: "XAUUSD", type: "BUY", entry: "2150.45", tp: "2165.00", sl: "2140.00", time: "2m ago", profit: "+45 Pips" },
      { pair: "EURUSD", type: "SELL", entry: "1.0845", tp: "1.0790", sl: "1.0880", time: "15m ago", profit: "+12 Pips" }
    ]
  },
  videoSection: {
    badge: "Under the Hood",
    title: "How Our Strategies Dominate",
    description: "Watch the breakdown of our proprietary trading logic and see why thousands trust IFXTrades.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    posterUrl: "https://picsum.photos/seed/tradingchart/1920/1080",
    videoTitle: "The Quantitative Edge",
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
