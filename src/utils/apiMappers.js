/* utils/apiMappers.js: application source file.
 *
 * The dashboard pages (FundInvestments.jsx, PropertyInvestments.jsx,
 * Wallet.jsx, Transactions.jsx) were built against dummy arrays in
 * pages/dashboard/shared/theme.js (FUNDS, PROPERTIES, SEED_TXS) with a
 * specific shape baked into their JSX (f.icon rendered as a component,
 * p.img as a URL, etc.). Rather than rewrite that JSX, these mappers
 * translate a real backend record into that exact same shape, so the
 * existing rendering code keeps working unchanged and only the DATA
 * SOURCE changes (dummy array -> API response).
 *
 * Per the explicit instruction that images stay dummy/frontend-only:
 * every mapper below assigns an image from a small local pool instead
 * of anything the backend might return, cycling by index so the same
 * property/fund keeps the same picture for the length of a session.
 */
import {
  TrendingUp,
  ShieldCheck,
  Building2,
  Coins,
  Cpu,
  Leaf,
  BarChart3,
  Activity,
  Zap,
  Landmark,
  Waves,
  TreePine,
} from "lucide-react";
import { U } from "../pages/dashboard/shared/theme";

// Fixed FAIX <-> ₹ rate used everywhere on the backend (see
// Backend/src/controllers/properties.controller.js /
// fund.controller.js / wallet.controller.js — TOKEN_VALUE = 11).
export const TOKEN_VALUE = 11;

// ---------------------------------------------------------------
// DUMMY IMAGE POOLS (frontend-only — see file header)
// ---------------------------------------------------------------

const PROPERTY_IMAGES = [
  U("photo-1512453979798-5ea266f8880c"),
  U("photo-1486406146926-c627a92ad1ab"),
  U("photo-1513635269975-59663e0ac1ad"),
  U("photo-1613490493576-7fde63acd811"),
  U("photo-1525625293386-3f8f99389edd"),
  U("photo-1582719508461-905c673771fd"),
];

function dummyPropertyImage(index) {
  return PROPERTY_IMAGES[index % PROPERTY_IMAGES.length];
}

// ---------------------------------------------------------------
// ICON NAME -> lucide-react component
// ---------------------------------------------------------------
// Backend Fund.icon / Property.icon (seed data) are free-text strings
// (e.g. "trending-up", "bar-chart", "building"), not components — this
// is the one place that turns a name into something `<Icon />` can
// render. Unknown/missing names fall back to a sensible default.

const FUND_ICON_MAP = {
  "trending-up": TrendingUp,
  "bar-chart": BarChart3,
  activity: Activity,
  shield: ShieldCheck,
  zap: Zap,
};

export function fundIconFor(name) {
  return FUND_ICON_MAP[name] || TrendingUp;
}

const PROPERTY_ICON_MAP = {
  building: Building2,
  waves: Waves,
  tree: TreePine,
  landmark: Landmark,
};

export function propertyIconFor(name) {
  return PROPERTY_ICON_MAP[name] || Building2;
}

// ---------------------------------------------------------------
// RISK LEVEL — the backend Fund model has no risk field, so it's
// inferred from `category` (a small fixed enum). Purely a display
// heuristic; documented so nobody mistakes it for backend data.
// ---------------------------------------------------------------

const RISK_BY_CATEGORY = {
  Growth: "Moderate",
  Index: "Low",
  Balanced: "Moderate",
  Fixed: "Low",
  Commodity: "High",
};

// ---------------------------------------------------------------
// FUND mapper: backend Fund document -> shared/theme.js FUNDS shape
// { id, name, category, nav, growth, risk, status, min, icon }
// ---------------------------------------------------------------

export function mapFund(fund) {
  return {
    id: fund._id,
    name: fund.name,
    category: fund.category,
    nav: Number(fund.nav) || 0,
    growth: Number(fund.growthPercent) || 0,
    risk: RISK_BY_CATEGORY[fund.category] || "Moderate",
    // Backend only ever returns isActive:true funds from GET /funds,
    // so every fund shown here is open to invest in.
    status: "Open",
    // No minimum-investment field on the backend yet — 100 FAIX
    // matches the platform-wide default used across the dummy data.
    min: 100,
    icon: fundIconFor(fund.icon),
  };
}

// ---------------------------------------------------------------
// PROPERTY mapper: backend Property document -> shared/theme.js
// PROPERTIES shape { id, name, location, value, tokenPrice, total,
// available, yield, img }
// ---------------------------------------------------------------

export function mapProperty(property, index = 0) {
  return {
    id: property._id,
    name: property.propertyName,
    location: property.location,
    value: Number(property.totalPropertyCost) || 0,
    // Every property uses the same fixed FAIX rate — there is no
    // per-property token price on the backend.
    tokenPrice: TOKEN_VALUE,
    total: Number(property.totalFaixToken) || 0,
    available: Number(property.availableFaixToken) || 0,
    // No yield field on the backend yet — deterministic placeholder
    // (4%–9%) derived from the property id, purely for display so
    // cards don't all show an identical number. Not real return data.
    yield: 4 + (hashString(property._id) % 50) / 10,
    img: dummyPropertyImage(index),
  };
}

function hashString(value) {
  let hash = 0;
  const str = String(value || "");
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// ---------------------------------------------------------------
// TRANSACTION mapper: backend Transaction document -> shared/theme.js
// SEED_TXS shape { id, asset, type, amount, date, status, ref }
// ---------------------------------------------------------------

export function mapTransaction(record) {
  return {
    id: record._id,
    asset: record.asset,
    // The dashboard pages' TX_META only has entries for Deposit,
    // Withdraw, Investment, Buy, Exchange — the backend never emits
    // "Investment" (fund invests are logged as type: "Buy", same as
    // property purchases), so no separate mapping is needed here.
    type: record.type,
    amount: Number(record.amount) || 0,
    date: new Date(record.date || record.createdAt),
    status: record.status,
    ref: `TXN-${String(record._id || "").slice(-6).toUpperCase()}`,
  };
}
