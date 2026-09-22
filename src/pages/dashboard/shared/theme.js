/**
 * theme.js — shared design tokens + dummy data for the Metalan investor platform.
 * Kept in sync with the palette / patterns already used in UserAdmin.jsx so every
 * page (Dashboard, Fund Investments, Property Investments, Transactions, Wallet)
 * looks like one product.
 */
import {
  TrendingUp, ShieldCheck, Building2, Coins, Cpu, Leaf, ArrowDownToLine,
  ArrowLeftRight, Plus,
} from "lucide-react";

/* ────────────────────────────── design tokens ────────────────────────────── */

export const C = { cyan: "#22d3ee", gold: "#d4af6a", violet: "#8b9cf7" };

export const BG =
  "radial-gradient(60rem 28rem at 90% -8%, rgba(34,211,238,0.06), transparent 60%), radial-gradient(48rem 26rem at -8% 6%, rgba(212,175,106,0.05), transparent 60%)";

export const CARD =
  "rounded-2xl border border-white/[0.06] bg-[#0a1019]/90 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm";

export const ICON_BTN =
  "relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/30 text-slate-200 backdrop-blur transition-colors hover:border-cyan-400/40 hover:text-cyan-200";

export const ACCENT = {
  cyan: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/20",
  gold: "bg-[#d4af6a]/10 text-[#e2c17f] ring-[#d4af6a]/25",
  emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  violet: "bg-indigo-400/10 text-indigo-300 ring-indigo-400/20",
  rose: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
};

export const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";
export const BTN = {
  gold: `${BTN_BASE} bg-[#d4af6a] text-[#1a1305] hover:bg-[#e2c17f]`,
  goldSoft: `${BTN_BASE} border border-[#d4af6a]/40 bg-[#d4af6a]/10 text-[#e2c17f] hover:bg-[#d4af6a]/20`,
  cyanSoft: `${BTN_BASE} border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20`,
  ghost: `${BTN_BASE} border border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white`,
};

export const RISK = {
  Low: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Moderate: "bg-[#d4af6a]/10 text-[#e2c17f] ring-[#d4af6a]/25",
  High: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
};

export const STYLES = `
.mt-hide-scroll{scrollbar-width:none;-ms-overflow-style:none;cursor:grab;scroll-behavior:smooth;touch-action:pan-y;overscroll-behavior-x:contain;}
.mt-hide-scroll:active{cursor:grabbing;}
.mt-hide-scroll::-webkit-scrollbar{display:none;width:0;height:0;}
.scrollbar-hide{scrollbar-width:none;-ms-overflow-style:none;}
.scrollbar-hide::-webkit-scrollbar{display:none;width:0;height:0;}
.mt-thin{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.16) transparent;}
.mt-thin::-webkit-scrollbar{height:6px;width:6px;}
.mt-thin::-webkit-scrollbar-track{background:transparent;}
.mt-thin::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:999px;}
.mt-thin::-webkit-scrollbar-thumb:hover{background:rgba(34,211,238,.45);}
`;

/* ────────────────────────────── images ────────────────────────────── */

export const U = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ────────────────────────────── formatting ────────────────────────────── */

export const fmt = (n, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
export const fmt0 = (n) => fmt(n, 0);
export const compact = (n) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
export const signedPct = (n) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
export const fmtDate = (d) =>
  `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

/* ────────────────────────────── dummy data ────────────────────────────── */

export const FUNDS = [
  { id: "growth", name: "Metalan Growth Fund", category: "Equity growth", nav: 12.485, growth: 18.4, risk: "Moderate", status: "Open", min: 100, icon: TrendingUp },
  { id: "income", name: "Sovereign Income Fund", category: "Fixed income", nav: 10.213, growth: 7.2, risk: "Low", status: "Open", min: 100, icon: ShieldCheck },
  { id: "realty", name: "Prime Realty REIT Fund", category: "Real estate", nav: 24.76, growth: 11.6, risk: "Moderate", status: "Limited", min: 250, icon: Building2 },
  { id: "digital", name: "Digital Assets Alpha", category: "Digital assets", nav: 8.942, growth: 26.9, risk: "High", status: "Open", min: 100, icon: Coins },
  { id: "tech", name: "Global Tech Leaders Fund", category: "Technology equity", nav: 15.372, growth: 21.3, risk: "High", status: "Open", min: 100, icon: Cpu },
  { id: "green", name: "Green Energy Transition", category: "Sustainable energy", nav: 9.318, growth: 14.1, risk: "Moderate", status: "Open", min: 150, icon: Leaf },
];

export const PROPERTIES = [
  { id: "marina", name: "Azure Marina Residences", location: "Dubai Marina, UAE", value: 4850000, tokenPrice: 250, total: 19400, available: 7420, yield: 6.2, img: U("photo-1512453979798-5ea266f8880c") },
  { id: "bkc", name: "Central Park Offices", location: "Bandra Kurla, Mumbai", value: 3200000, tokenPrice: 200, total: 16000, available: 5180, yield: 7.4, img: U("photo-1486406146926-c627a92ad1ab") },
  { id: "aldwych", name: "The Aldwych Suites", location: "Covent Garden, London", value: 6400000, tokenPrice: 500, total: 12800, available: 3960, yield: 4.9, img: U("photo-1513635269975-59663e0ac1ad") },
  { id: "palm", name: "Palm Grove Villas", location: "Phuket, Thailand", value: 1950000, tokenPrice: 150, total: 13000, available: 4310, yield: 8.1, img: U("photo-1613490493576-7fde63acd811") },
  { id: "sg", name: "Marina Bay Towers", location: "Marina Bay, Singapore", value: 5600000, tokenPrice: 400, total: 14000, available: 5230, yield: 5.4, img: U("photo-1525625293386-3f8f99389edd") },
  { id: "bali", name: "Emerald Bay Resort", location: "Ubud, Bali", value: 2300000, tokenPrice: 120, total: 19200, available: 6840, yield: 9.0, img: U("photo-1582719508461-905c673771fd") },
];

export const USERS = [
  { id: "u01", name: "Priya Nair", email: "priya.nair@example.com", country: "India", tier: "Platinum", invested: 412500, returns: 14.8, positions: 9, joined: "Mar 2024", status: "Active" },
  { id: "u02", name: "Omar Al-Farsi", email: "omar.alfarsi@example.com", country: "UAE", tier: "Platinum", invested: 386200, returns: 12.1, positions: 8, joined: "Jan 2024", status: "Active" },
  { id: "u03", name: "Sofia Marchetti", email: "sofia.m@example.com", country: "Italy", tier: "Gold", invested: 274900, returns: 16.3, positions: 7, joined: "Jun 2024", status: "Active" },
  { id: "u04", name: "Liam O'Connor", email: "liam.oconnor@example.com", country: "Ireland", tier: "Gold", invested: 231750, returns: 9.4, positions: 6, joined: "Aug 2024", status: "Active" },
  { id: "u05", name: "Mei Tanaka", email: "mei.tanaka@example.com", country: "Japan", tier: "Gold", invested: 198300, returns: 11.7, positions: 6, joined: "Sep 2024", status: "Active" },
  { id: "u06", name: "Andrew Alex", email: "andrew.alex@example.com", country: "United States", tier: "Silver", invested: 156800, returns: 8.9, positions: 5, joined: "Nov 2024", status: "Active" },
  { id: "u07", name: "Fatima Zahra", email: "f.zahra@example.com", country: "Morocco", tier: "Silver", invested: 121400, returns: 7.2, positions: 4, joined: "Dec 2024", status: "Pending KYC" },
  { id: "u08", name: "Noah Becker", email: "noah.becker@example.com", country: "Germany", tier: "Silver", invested: 98650, returns: 10.5, positions: 4, joined: "Jan 2025", status: "Active" },
  { id: "u09", name: "Aisha Khan", email: "aisha.khan@example.com", country: "Pakistan", tier: "Bronze", invested: 64200, returns: 5.8, positions: 3, joined: "Feb 2025", status: "Active" },
  { id: "u10", name: "Lucas Silva", email: "lucas.silva@example.com", country: "Brazil", tier: "Bronze", invested: 41900, returns: -1.6, positions: 2, joined: "Apr 2025", status: "Suspended" },
  { id: "u11", name: "Hannah Weiss", email: "hannah.weiss@example.com", country: "Austria", tier: "Bronze", invested: 28750, returns: 3.1, positions: 2, joined: "May 2025", status: "Active" },
  { id: "u12", name: "Ravi Menon", email: "ravi.menon@example.com", country: "Singapore", tier: "Bronze", invested: 15300, returns: 2.4, positions: 1, joined: "Jul 2025", status: "Pending KYC" },
];

export const TIER = {
  Platinum: "bg-indigo-400/10 text-indigo-300 ring-indigo-400/20",
  Gold: "bg-[#d4af6a]/10 text-[#e2c17f] ring-[#d4af6a]/25",
  Silver: "bg-slate-400/10 text-slate-300 ring-slate-400/20",
  Bronze: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
};

export const USER_STATUS = {
  Active: "bg-emerald-400/10 text-emerald-300",
  "Pending KYC": "bg-amber-400/10 text-amber-300",
  Suspended: "bg-rose-400/10 text-rose-300",
};

export const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export const INITIAL_FUNDS = { growth: { units: 2400, cost: 26400 }, income: { units: 3000, cost: 29700 }, realty: { units: 500, cost: 10950 } };
export const INITIAL_PROPS = { marina: { tokens: 30, cost: 7200 }, bkc: { tokens: 40, cost: 7600 } };

export const ago = (hours) => new Date(Date.now() - hours * 3600e3);

export const SEED_TXS = [
  { id: 1, asset: "Metalan Growth Fund", type: "Investment", amount: -5000, date: ago(5), status: "Completed", ref: "TXN-84213" },
  { id: 2, asset: "FAIX Wallet", type: "Deposit", amount: 15000, date: ago(29), status: "Completed", ref: "TXN-84190" },
  { id: 3, asset: "Azure Marina Residences", type: "Buy", amount: -3750, date: ago(76), status: "Completed", ref: "TXN-84102" },
  { id: 4, asset: "Exchange Wallet", type: "Exchange", amount: -2500, date: ago(120), status: "Completed", ref: "TXN-83977" },
  { id: 5, asset: "Sovereign Income Fund", type: "Investment", amount: -8000, date: ago(190), status: "Completed", ref: "TXN-83820" },
  { id: 6, asset: "Central Park Offices", type: "Buy", amount: -4000, date: ago(310), status: "Completed", ref: "TXN-83655" },
  { id: 7, asset: "FAIX Wallet", type: "Withdraw", amount: -6000, date: ago(410), status: "Completed", ref: "TXN-83502" },
  { id: 8, asset: "Digital Assets Alpha", type: "Investment", amount: -3200, date: ago(500), status: "Pending", ref: "TXN-83411" },
  { id: 9, asset: "Palm Grove Villas", type: "Buy", amount: -1800, date: ago(610), status: "Completed", ref: "TXN-83290" },
  { id: 10, asset: "FAIX Wallet", type: "Deposit", amount: 9000, date: ago(720), status: "Completed", ref: "TXN-83140" },
  { id: 11, asset: "Global Tech Leaders Fund", type: "Investment", amount: -4500, date: ago(840), status: "Completed", ref: "TXN-82998" },
  { id: 12, asset: "Exchange Wallet", type: "Exchange", amount: 1750, date: ago(960), status: "Failed", ref: "TXN-82871" },
];

export const TX_META = {
  Deposit: { icon: ArrowDownToLine, tone: "emerald" },
  Withdraw: { icon: ArrowDownToLine, tone: "rose" },
  Investment: { icon: TrendingUp, tone: "cyan" },
  Buy: { icon: Building2, tone: "gold" },
  Exchange: { icon: ArrowLeftRight, tone: "violet" },
};

export const QUICK_ACTIONS = [
  { key: "invest", label: "Invest in Fund", hint: "Put FAIX into a fund at today's NAV", icon: TrendingUp, tone: "cyan" },
  { key: "property", label: "Buy Property", hint: "Own a share of tokenized real estate", icon: Building2, tone: "gold" },
  { key: "deposit", label: "Add Funds", hint: "Top up your FAIX balance", icon: Plus, tone: "emerald" },
  { key: "exchange", label: "Exchange", hint: "Move value to or from exchange assets", icon: ArrowLeftRight, tone: "violet" },
];
