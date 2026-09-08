/* data/funds.js: shared fund data, consumed by Funds.jsx (grid) and FundDetails.jsx (single-fund page). */

// Single source of truth for every fund. Previously Funds.jsx had its
// own inline FUNDS array with card-only fields, and FundDetails.jsx had
// a separate DEFAULT_FUND with detail-only fields — the two could never
// be looked up from one another. Pulling both into one shared array
// (keyed by `slug`) is what makes "VIEW FUND" able to actually navigate
// anywhere real: the grid links to `/dashboard/funds/:slug`, and the
// detail page looks that slug up right here.
//
// Field notes:
// - `slug` is the URL segment (see routes/AppRoutes.jsx) and the React
//   `key` in the grid — keep it unique and URL-safe.
// - `currentNav` and `yield1y` are numbers, not pre-formatted strings,
//   so both pages can format them consistently (`F${nav.toFixed(2)}`,
//   `+${yield1y}%`) instead of maintaining two separately-typed copies
//   of the same value.
// - `badges`, `principalTitle`, `return3yPercent`, `expenseRatioPercent`,
//   `allocation`, and `managerCommentary` only appear on the detail
//   page. Only "re-growth" reflects real reference-design data (from
//   the fund-details.png mockup) — the other five have reasonable
//   placeholder detail data so their pages render correctly, but every
//   number past NAV/yield/AUM/risk should be treated as a TODO for real
//   backend data once it exists.
export const FUNDS = [
  {
    slug: "re-growth",
    name: "Metalan Real Estate Growth Fund",
    manager: "Sarah Jenkins",
    principalTitle: "former UBS Wealth Architect",
    principalAvatar: null,
    risk: "Moderate",
    category: "Real Estate",
    netAum: "$12.4M",
    currentNav: 125.4,
    yield1y: 18.4,
    minFaix: 500,
    barTrend: [0.4, 0.5, 0.45, 0.55, 0.6, 0.7, 0.8],
    badges: [
      { label: "5-Star Rated Index", tone: "green" },
      { label: "Shariah Compliant", tone: "gold" },
    ],
    return3yPercent: 42.1,
    expenseRatioPercent: 1.2,
    allocation: [
      { label: "Commercial Real Estate (APAC)", percent: 40, color: "#e8b46a" },
      { label: "Residential Premium Developments (London/EU)", percent: 25, color: "#d9822f" },
      { label: "Forex Reserves Liquidity Pools", percent: 20, color: "#34d399" },
      { label: "Government Bond Backed Reserves", percent: 15, color: "#f2c380" },
    ],
    managerCommentary:
      "We have adjusted asset concentration towards low-risk commercial holdings. This guarantees sustained payout shields against high-interest inflationary indexes worldwide.",
  },
  {
    slug: "forex-yield",
    name: "Global Forex Yield Index Fund",
    manager: "Pierre Dubois",
    principalTitle: "former Deutsche Bank FX Strategist",
    principalAvatar: null,
    risk: "High Risk",
    category: "Forex",
    netAum: "$24.1M",
    currentNav: 98.1,
    yield1y: 22.1,
    minFaix: 500,
    barTrend: [0.35, 0.4, 0.5, 0.45, 0.6, 0.65, 0.85],
    badges: [{ label: "Algorithmic Index", tone: "green" }],
    return3yPercent: 51.6,
    expenseRatioPercent: 1.6,
    allocation: [
      { label: "G10 Currency Pairs", percent: 55, color: "#e8b46a" },
      { label: "Emerging Market FX", percent: 30, color: "#d9822f" },
      { label: "FAIX Cash Reserve", percent: 15, color: "#34d399" },
    ],
    managerCommentary:
      "Volatility across G10 pairs has created attractive carry opportunities. We remain positioned for continued rate divergence through the next two quarters.",
  },
  {
    slug: "sovereign-shield",
    name: "Sovereign Bond Sovereign Shield",
    manager: "Alistair Sterling",
    principalTitle: "former IMF Fixed Income Advisor",
    principalAvatar: null,
    risk: "Low Risk",
    category: "Mixed Allocation",
    netAum: "$45.0M",
    currentNav: 105.0,
    yield1y: 6.8,
    minFaix: 500,
    barTrend: [0.4, 0.42, 0.4, 0.45, 0.48, 0.5, 0.55],
    badges: [{ label: "Capital Protected", tone: "green" }],
    return3yPercent: 19.4,
    expenseRatioPercent: 0.6,
    allocation: [
      { label: "Sovereign Bonds (G7)", percent: 65, color: "#e8b46a" },
      { label: "Investment-Grade Corporate Debt", percent: 25, color: "#d9822f" },
      { label: "FAIX Cash Reserve", percent: 10, color: "#34d399" },
    ],
    managerCommentary:
      "Capital preservation remains the mandate. We favor short-duration sovereign paper to limit rate sensitivity while still clearing our yield target.",
  },
  {
    slug: "hospitality-syndicate",
    name: "Luxury Hospitality Syndicate",
    manager: "Yuki Tanaka",
    principalTitle: "former Aman Resorts Development Lead",
    principalAvatar: null,
    risk: "Moderate",
    category: "Real Estate",
    netAum: "$8.9M",
    currentNav: 150.2,
    yield1y: 14.2,
    minFaix: 500,
    barTrend: [0.3, 0.4, 0.5, 0.55, 0.5, 0.6, 0.75],
    badges: [{ label: "Hospitality Syndicate", tone: "gold" }],
    return3yPercent: 33.8,
    expenseRatioPercent: 1.4,
    allocation: [
      { label: "Resort & Leisure Real Estate", percent: 70, color: "#e8b46a" },
      { label: "Hospitality Operating Reserves", percent: 20, color: "#d9822f" },
      { label: "FAIX Cash Reserve", percent: 10, color: "#34d399" },
    ],
    managerCommentary:
      "Occupancy across our flagship properties has outperformed regional benchmarks. We're evaluating two additional acquisitions for next quarter.",
  },
  {
    slug: "multi-strategy",
    name: "Metalan Multi-Strategy Liquid Fund",
    manager: "Arjun Mehta",
    principalTitle: "former Bridgewater Portfolio Manager",
    principalAvatar: null,
    risk: "Moderate",
    category: "Mixed Allocation",
    netAum: "$18.5M",
    currentNav: 112.5,
    yield1y: 15.9,
    minFaix: 500,
    barTrend: [0.35, 0.45, 0.5, 0.5, 0.6, 0.65, 0.78],
    badges: [{ label: "Multi-Strategy", tone: "green" }],
    return3yPercent: 37.2,
    expenseRatioPercent: 1.3,
    allocation: [
      { label: "Real Estate Syndicates", percent: 40, color: "#e8b46a" },
      { label: "Forex Yield Pools", percent: 35, color: "#d9822f" },
      { label: "Sovereign Bond Reserves", percent: 25, color: "#34d399" },
    ],
    managerCommentary:
      "Blending across our three underlying strategies has smoothed drawdowns considerably this year without meaningfully capping upside.",
  },
  {
    slug: "tech-vc",
    name: "Tech token VC Yield Fund",
    manager: "Zack Snyder",
    principalTitle: "former a16z Crypto Partner",
    principalAvatar: null,
    risk: "High Risk",
    category: "High Yield",
    netAum: "$31.2M",
    currentNav: 210.4,
    yield1y: 29.4,
    minFaix: 500,
    barTrend: [0.3, 0.35, 0.45, 0.5, 0.65, 0.7, 0.9],
    badges: [{ label: "High Yield", tone: "gold" }],
    return3yPercent: 88.5,
    expenseRatioPercent: 2.0,
    allocation: [
      { label: "Early-Stage Token Positions", percent: 50, color: "#e8b46a" },
      { label: "Liquid Token Index", percent: 35, color: "#d9822f" },
      { label: "FAIX Cash Reserve", percent: 15, color: "#34d399" },
    ],
    managerCommentary:
      "Deal flow into tokenized infrastructure has been exceptional this cycle. Position sizing stays disciplined given the tier's volatility profile.",
  },
];

/** Looks up a single fund by its URL slug; returns undefined if none match. */
export function getFundBySlug(slug) {
  return FUNDS.find((fund) => fund.slug === slug);
}
