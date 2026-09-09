/* pages/dashboard/property/Propertydetail.jsx: application source file. */
import { useMemo, useState } from "react";

// React Router
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

// Lucide-react icons
import { ChevronLeft, MapPin, Coins, ShieldCheck } from "lucide-react";

// Components
import Navbar from "../../../layouts/DashboardNavbar";
import Heading from "../../../components/ui/Heading";
import Text from "../../../components/ui/Text";
import Button from "../../../components/ui/Button";
import { getPropertyBySlug } from "../../../data/properties";

const ACCENT = "#1A3C34";
const GOLD = "#e8b46a";

/**
 * Property detail / investment page.
 *
 * One template drives every listing (Canal Side Heritage, Central Park
 * Tower Suite, Malibu Coastal Sanctuary, Marina Bay Residences, and any
 * future property) — the actual copy, numbers, and hero photo all come
 * from data/properties.js, looked up by the :slug route param.
 *
 * Route: /property/:slug  (wire this up in your router config)
 */
export default function PropertyDetail() {
  const { slug } = useParams();
  const property = getPropertyBySlug(slug);
  const [investing, setInvesting] = useState(false);
  const [invested, setInvested] = useState(false);
  const [amount, setAmount] = useState(10);

  const totalCost = useMemo(
    () => (property ? amount * property.investment.tokenPrice : 0),
    [amount, property],
  );
  const estReturn = useMemo(
    () =>
      property ? (totalCost * property.investment.estimatedYield) / 100 : 0,
    [totalCost, property],
  );

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0E1211]">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-10">
          <Text color="white" size="lg">
            We couldn't find that property listing.
          </Text>
          <Link
            to={ROUTES.DASHBOARD_PROPERTIES || "#"}
            className="mt-3 inline-block text-sm font-semibold text-[#e8b46a] underline underline-offset-2"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const { faixSold, faixTotal, tokenPrice, estimatedYield } =
    property.investment;
  const committedPct = Math.round((faixSold / faixTotal) * 100);

  return (
    <div className="min-h-screen w-full bg-[#0E1211] pb-16">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/40">
          <Link
            to={ROUTES.DASHBOARD_PROPERTIES || "#"}
            className="flex items-center gap-1 hover:text-white/70"
          >
            <ChevronLeft size={15} />
            Back to Marketplace
          </Link>
          <span>/</span>
          <span>{property.city}</span>
          <span>/</span>
          <span className="font-medium text-[#e8b46a]">{property.name}</span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ============================================================
              LEFT COLUMN
          ============================================================ */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Hero */}
            <div
              className="relative overflow-hidden rounded-3xl border"
              style={{ borderColor: `${GOLD}99` }}
            >
              <div
                className="h-[320px] w-full bg-cover bg-center sm:h-[420px] lg:h-[500px]"
                style={{ backgroundImage: `url(${property.heroImage})` }}
                role="presentation"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,9,16,0.05) 0%, rgba(10,9,16,0.15) 55%, rgba(10,9,16,0.92) 100%)",
                }}
              />

              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wide text-[#e8f5ee]"
                  style={{ background: `${ACCENT}` }}
                >
                  PRIME REAL ESTATE
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  SECURED DEED
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <Heading
                  level={1}
                  className="font-serif !text-white text-3xl sm:text-4xl"
                >
                  {property.name}
                </Heading>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
                  <MapPin size={14} className="text-[#e8b46a]" />
                  {property.address}
                </p>
              </div>
            </div>

            {/* Property Description */}
            <Card>
              <SectionHeading>Property Description</SectionHeading>
              <Text
                size="sm"
                color="muted"
                className="mt-4 !text-white/55 leading-relaxed"
              >
                {property.description}
              </Text>

              <hr className="my-5 border-white/10" />

              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {property.features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.label}
                      className="flex items-center gap-2"
                    >
                      <Icon size={16} className="text-[#e8b46a]" />
                      <Text size="sm" color="muted" className="!text-white/70">
                        {feature.label}
                      </Text>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Investment Structured Metrics */}
            <Card>
              <SectionHeading>Investment Structured Metrics</SectionHeading>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <MetricBox
                  label="Minimum Investment"
                  value={property.metrics.minInvestment}
                />
                <MetricBox
                  label="Asset Valuation"
                  value={property.metrics.assetValuation}
                />
                <MetricBox
                  label="Total Token Supply"
                  value={property.metrics.totalTokenSupply}
                />
                <MetricBox
                  label="Projected Capital ROI"
                  value={property.metrics.projectedRoi}
                  valueClassName="!text-emerald-400"
                />
              </div>
            </Card>

            {/* Prime Location Details */}
            <Card>
              <SectionHeading>Prime Location Details</SectionHeading>
              <Text
                size="sm"
                color="muted"
                className="mt-4 !text-white/55 leading-relaxed"
              >
                Situated at the premium location focal point of {property.city}.
                Easy access, high commercial desirability and solid long-term
                capital stability metrics.
              </Text>

              <div className="mt-5">
                <LocationMap
                  accent={property.mapAccent}
                  label={property.city}
                />
              </div>
            </Card>
          </div>

          {/* ============================================================
              RIGHT COLUMN
          ============================================================ */}
          <div className="flex flex-col gap-6">
            {/* Investment Suite */}
            <div
              className="rounded-2xl border bg-[#0e0a12]/75 p-6 shadow-[0_0_40px_-20px_rgba(232,180,106,0.5)] backdrop-blur-xl"
              style={{ borderColor: `${GOLD}80` }}
            >
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#e8b46a]">
                LIVE SYNDICATE POOL
              </p>
              <Heading
                level={2}
                className="mt-1 font-serif !text-white text-2xl"
              >
                Investment Suite
              </Heading>

              <div className="mt-5 flex items-start justify-between">
                <div>
                  <p className="text-xs text-white/40">Token Price</p>
                  <p className="mt-1 font-mono text-xl font-bold text-white">
                    F {tokenPrice.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40">Estimated Yield</p>
                  <p className="mt-1 font-mono text-xl font-bold text-emerald-400">
                    {estimatedYield}% p.a.
                  </p>
                </div>
              </div>

              <hr className="my-5 border-white/10" />

              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Fractions Allotted</span>
                <span className="font-semibold text-[#e8b46a]">
                  {committedPct}% Committed
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#f2c380] to-[#d9822f]"
                  style={{ width: `${committedPct}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-white/40">
                <span>{faixSold.toLocaleString()} FAIX Sold</span>
                <span>{faixTotal.toLocaleString()} FAIX Total</span>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs text-white/40">
                  Enter Investment Amount
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                  <Coins size={15} className="text-[#e8b46a]" />
                  <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(event) =>
                      setAmount(Math.max(1, Number(event.target.value) || 0))
                    }
                    className="w-full bg-transparent text-sm text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="shrink-0 text-xs text-white/40">
                    FAIX Tokens
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-white/40">Total Cost:</span>
                <span className="font-mono font-semibold text-white">
                  F {totalCost.toLocaleString()}.00
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-sm">
                <span className="text-white/40">Est. Return (p.a.):</span>
                <span className="font-mono font-semibold text-emerald-400">
                  F {estReturn.toFixed(2)} / yr
                </span>
              </div>

              {/* <Button
                type="button"
                className="mt-5 h-12 w-full !rounded-full !bg-gradient-to-r from-[#f2c380] via-[#e8a655] to-[#d9822f] !text-[#241608] text-sm font-bold tracking-wide shadow-lg shadow-orange-900/40 transition-all duration-200 hover:!brightness-105 hover:scale-[1.02] active:scale-[0.98]"
              >
                INVEST NOW
              </Button> */}

              <Button
                type="button"
                disabled={investing || invested}
                onClick={() => {
                  setInvesting(true);

                  setTimeout(() => {
                    setInvesting(false);
                    setInvested(true);
                  }, 1600);
                }}
                className={`relative mt-5 h-12 w-full !rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                  invested
                    ? "!bg-[linear-gradient(135deg,rgb(26,60,52),rgb(14,33,28))] !text-[#e8b46a] !shadow-none"
                    : "!bg-gradient-to-r from-[#f2c380] via-[#e8a655] to-[#d9822f] !text-[#241608] shadow-lg shadow-orange-900/40"
                }`}
              >
                {investing ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="relative flex h-5 w-5 items-center justify-center">
                      <span className="absolute h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-[#241608]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#241608]" />
                    </span>
                    Processing Investment...
                  </span>
                ) : invested ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8b46a] text-[#2c5c51]">
                      ✓
                    </span>
                    Investment Successful
                  </span>
                ) : (
                  "INVEST NOW"
                )}
              </Button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-white/35">
                <ShieldCheck size={12} />
                Transactions secured via automated ledger protocol
              </p>
            </div>

            {/* Syndicate Structure */}
            <Card>
              <Heading level={2} className="font-serif !text-white text-lg">
                Syndicate Structure
              </Heading>
              <div className="mt-4 space-y-3 text-sm">
                <Row label="Custodian" value={property.syndicate.custodian} />
                <Row
                  label="Registry ID"
                  value={property.syndicate.registryId}
                  mono
                />
                <Row
                  label="Expected Settlement"
                  value={property.syndicate.settlement}
                  valueClassName="!text-[#e8b46a]"
                />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#18211E] p-6">
      {children}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <Heading level={2} className="font-serif text-2xl !text-[#e8b46a]">
      {children}
    </Heading>
  );
}

function MetricBox({ label, value, valueClassName = "" }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-4">
      <Text size="sm" color="muted" className="!text-xs !text-white/40">
        {label}
      </Text>
      <Text
        size="lg"
        weight="bold"
        color="white"
        className={`mt-1 font-mono ${valueClassName}`}
      >
        {value}
      </Text>
    </div>
  );
}

function Row({ label, value, mono = false, valueClassName = "" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/40">{label}</span>
      <span
        className={
          (mono ? "font-mono " : "font-semibold ") +
          "text-white/90 " +
          valueClassName
        }
      >
        {value}
      </span>
    </div>
  );
}

function LocationMap({ accent, label }) {
  return (
    <div className="relative h-52 w-full overflow-hidden rounded-xl border border-white/5 bg-[#0a0c14] sm:h-60">
      <svg
        viewBox="0 0 800 300"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={`mapGlow-${label}`} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="800" height="300" fill="#0a0c14" />
        <circle cx="400" cy="150" r="180" fill={`url(#mapGlow-${label})`} />

        {/* abstract road network */}
        <g stroke={accent} strokeOpacity="0.35" strokeWidth="1" fill="none">
          {[...Array(10)].map((_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            const x2 = 400 + Math.cos(angle) * 260;
            const y2 = 150 + Math.sin(angle) * 130;
            return <line key={i} x1="400" y1="150" x2={x2} y2={y2} />;
          })}
          <circle cx="400" cy="150" r="60" />
          <circle cx="400" cy="150" r="110" />
          <circle cx="400" cy="150" r="170" />
        </g>

        <circle cx="400" cy="150" r="5" fill={accent} />
        <circle
          cx="400"
          cy="150"
          r="10"
          fill="none"
          stroke={accent}
          strokeOpacity="0.5"
          strokeWidth="1.5"
        >
          <animate
            attributeName="r"
            values="8;22;8"
            dur="2.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0;0.6"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      <span
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 translate-y-3 items-center gap-1.5 whitespace-nowrap rounded-full border bg-black/70 px-4 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur-sm"
        style={{ borderColor: `${accent}99` }}
      >
        <MapPin size={12} style={{ color: accent }} />
        {label.toUpperCase()}
      </span>
    </div>
  );
}
