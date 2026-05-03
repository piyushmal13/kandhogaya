/**
 * Server-Side SEO Route Map
 * Maps routes to their meta tags for server-side injection.
 * This ensures crawlers see proper meta tags without JavaScript.
 */

export interface RouteMeta {
  title: string;
  description: string;
  keywords: string;
  robots?: string;
  ogType?: string;
}

const BASE_KEYWORDS =
  "IFXTrades, algo trading, algorithmic trading, forex signals, gold trading, trading academy, market intelligence";

export const routeMetaMap: Record<string, RouteMeta> = {
  "/": {
    title: "IFXTrades | Institutional Trading Intelligence",
    description:
      "Institutional-grade algorithmic trading, live signals, trader education, and market intelligence for serious retail execution.",
    keywords: `${BASE_KEYWORDS}, forex trading platform, live trading signals, automated trading bots`,
  },
  "/signals": {
    title: "Live Signals | IFXTrades",
    description:
      "Access IFXTrades live signal workflows with exact entry, stop loss, and take profit levels. Join 12,000+ traders using institutional-grade setups.",
    keywords: `${BASE_KEYWORDS}, forex signals, gold signals, XAUUSD signals, live trading signals, WhatsApp signals`,
  },
  "/marketplace": {
    title: "Algorithm Marketplace | IFXTrades",
    description:
      "Explore IFXTrades trading algorithms. Automated MT5 strategies designed by our quantitative research desk for gold, forex, and indices.",
    keywords: `${BASE_KEYWORDS}, trading algorithms, algo marketplace, MT5 trading bots, automated forex trading, EA trading`,
  },
  "/results": {
    title: "Performance Independently Verified",
    description:
      "Review IFXTrades performance metrics, equity growth, and institutional-grade transparency across signals and systematic trading workflows.",
    keywords: `${BASE_KEYWORDS}, trading performance, forex results, trading win rate, equity curve`,
  },
  "/academy": {
    title: "Trading Academy | IFXTrades",
    description:
      "Structured trader education across forex, gold, and algorithmic execution. From beginner concepts to advanced institutional order block strategies.",
    keywords: `${BASE_KEYWORDS}, trading academy, forex education, algo trading course, learn forex, trading courses`,
  },
  "/courses": {
    title: "Trading Courses | IFXTrades",
    description:
      "Explore all IFXTrades courses. Structured paths from market basics to execution systems for disciplined traders.",
    keywords: `${BASE_KEYWORDS}, trading courses, forex courses, online trading education`,
  },
  "/webinars": {
    title: "Live Webinars | IFXTrades",
    description:
      "Register for IFXTrades webinars covering market structure, live analysis, algorithmic workflows, and trader education.",
    keywords: `${BASE_KEYWORDS}, trading webinars, live market analysis, forex webinar`,
  },
  "/blog": {
    title: "Market Insights | IFXTrades",
    description:
      "Read IFXTrades research on forex, gold, macro structure, and execution workflows from the institutional analysis desk.",
    keywords: `${BASE_KEYWORDS}, trading blog, forex market analysis, gold market insights, trading research`,
  },
  "/about": {
    title: "About IFXTrades | Institutional Trading DNA",
    description:
      "Learn how IFXTrades combines institutional market structure, trader education, and algorithmic systems into one execution-focused platform.",
    keywords: `${BASE_KEYWORDS}, about IFXTrades, institutional trading team, algorithmic trading firm`,
  },
  "/contact": {
    title: "Contact | IFXTrades",
    description:
      "Contact IFXTrades for support, partnership inquiries, algorithm licensing, or signal access questions.",
    keywords: `${BASE_KEYWORDS}, contact IFXTrades, trading support, algo licensing`,
  },
  "/hiring": {
    title: "Careers | IFXTrades",
    description:
      "Join the IFXTrades team. Explore careers in quantitative trading, development, market research, and operations.",
    keywords: `${BASE_KEYWORDS}, trading careers, fintech jobs, quantitative analyst`,
  },
  "/login": {
    title: "Client Access | IFXTrades",
    description:
      "Sign in to IFXTrades to access dashboards, trading products, and client workflows.",
    keywords: BASE_KEYWORDS,
    robots: "noindex,follow",
  },
  "/privacy": {
    title: "Privacy Policy | IFXTrades",
    description:
      "IFXTrades privacy policy covering data handling, cookies, and user rights.",
    keywords: BASE_KEYWORDS,
  },
  "/terms": {
    title: "Terms of Service | IFXTrades",
    description:
      "IFXTrades terms of service for platform usage, signal subscriptions, and algorithm licensing.",
    keywords: BASE_KEYWORDS,
  },
  "/risk": {
    title: "Risk Disclosure | IFXTrades",
    description:
      "IFXTrades risk disclosure for leveraged trading products including forex, CFDs, and algorithmic strategies.",
    keywords: BASE_KEYWORDS,
  },
  "/cookies": {
    title: "Cookie Policy | IFXTrades",
    description:
      "IFXTrades cookie policy and consent management.",
    keywords: BASE_KEYWORDS,
  },
};

/**
 * Injects per-route meta tags into the HTML template for SSR.
 */
export function injectMetaTags(html: string, path: string): string {
  // Normalize path: strip query strings and trailing slashes
  const cleanPath = path.split("?")[0].replace(/\/$/, "") || "/";
  const meta = routeMetaMap[cleanPath];

  if (!meta) return html;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${meta.title}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${meta.description}" />`
  );

  // Replace meta keywords
  html = html.replace(
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/,
    `<meta name="keywords" content="${meta.keywords}" />`
  );

  // Replace OG title
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${meta.title}" />`
  );

  // Replace OG description
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${meta.description}" />`
  );

  // Replace Twitter title
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${meta.title}" />`
  );

  // Replace Twitter description
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${meta.description}" />`
  );

  // Add robots meta if specified
  if (meta.robots) {
    const robotsTag = `<meta name="robots" content="${meta.robots}" />`;
    if (html.includes('name="robots"')) {
      html = html.replace(
        /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/,
        robotsTag
      );
    } else {
      html = html.replace("</head>", `    ${robotsTag}\n  </head>`);
    }
  }

  // Add canonical link
  const canonicalUrl = `https://ifxtrades.com${cleanPath === "/" ? "" : cleanPath}`;
  if (html.includes('rel="canonical"')) {
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );
  } else {
    html = html.replace(
      "</head>",
      `    <link rel="canonical" href="${canonicalUrl}" />\n  </head>`
    );
  }

  return html;
}
