/* pages/dashboard/property/Property.jsx: application source file. Tokenized real estate marketplace. */
import { useEffect, useMemo, useRef, useState } from "react";

// React Router
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";

// Lucide-react icons
import { MapPin, ChevronDown, ShieldCheck } from "lucide-react";

// Components
import Navbar from "../../../layouts/DashboardNavbar";
import Text from "../../../components/ui/Text";
import { PROPERTIES } from "../../../data/properties";

// Images

// Images
import heroBg from "../../../../public/images/Dashboard-Property-images/hero-banner.png";

// Shared brand colors — same values used across Login/Dashboard so this
// page's palette stays identical rather than drifting if edited alone.
const ACCENT = "#1A3C34";
const GOLD = "#e8b46a";

// Minimum estimated-yield thresholds offered in the "Yield" filter.
const YIELD_OPTIONS = [
  { label: "Any yield", value: 0 },
  { label: "6%+ p.a.", value: 6 },
  { label: "8%+ p.a.", value: 8 },
  { label: "10%+ p.a.", value: 10 },
];

// Sort strategies for the "Sort by" dropdown. Each maps to a comparator
// so `PROPERTIES.slice().sort(...)` can run directly off the selection
// rather than a chain of if/else in the component body.
const SORT_OPTIONS = {
  Popular: () => 0, // keep the curated, hand-authored order
  "Yield: High to Low": (a, b) => b.investment.estimatedYield - a.investment.estimatedYield,
  "Price: Low to High": (a, b) => a.investment.tokenPrice - b.investment.tokenPrice,
  "Fractions Sold": (a, b) =>
    b.investment.faixSold / b.investment.faixTotal -
    a.investment.faixSold / a.investment.faixTotal,
};

export default function Property() {
  // "Global" always means "no location filter applied" — it's prepended
  // to the list of cities actually present in PROPERTIES so it's never
  // accidentally omitted or duplicated if a property's city happens to
  // also be named "Global".
  const locationOptions = useMemo(
    () => ["Global", ...new Set(PROPERTIES.map((property) => property.city))],
    []
  );
  const typeOptions = useMemo(
    () => ["All", ...new Set(PROPERTIES.map((property) => property.type))],
    []
  );

  const [location, setLocation] = useState("Global");
  const [propertyType, setPropertyType] = useState("All");
  const [minYield, setMinYield] = useState(0);
  const [sortBy, setSortBy] = useState("Popular");

  // Recomputed only when a filter/sort control actually changes, rather
  // than on every render, since filtering+sorting the same array
  // repeatedly on unrelated re-renders would be wasted work.
  const visibleProperties = useMemo(() => {
    return PROPERTIES.filter((property) => {
      const matchesLocation = location === "Global" || property.city === location;
      const matchesType = propertyType === "All" || property.type === propertyType;
      const matchesYield = property.investment.estimatedYield >= minYield;
      return matchesLocation && matchesType && matchesYield;
    }).sort(SORT_OPTIONS[sortBy]);
  }, [location, propertyType, minYield, sortBy]);

  // The featured syndicate promoted in the sidebar is derived from real
  // listing data (highest yield) rather than a separate hand-authored
  // "Palm Resort" entry — that way it never points at a photo or route
  // that doesn't actually exist.
  const featuredProperty = useMemo(
    () =>
      PROPERTIES.slice().sort(
        (a, b) => b.investment.estimatedYield - a.investment.estimatedYield
      )[0],
    []
  );

  return (
    <div className="min-h-screen w-full bg-[#0E1211] pb-16">
      <Navbar faixBalance="24,850.00" notificationCount={3} userInitial="A" />

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-10">
        {/* ============================================================
            HERO BANNER
            Same photo-plus-gradient-scrim treatment as the Dashboard
            hero: a fixed building photo with a horizontal dark gradient
            so the badge/heading/copy on the left stay legible without
            needing the photo itself to be dark everywhere.
        ============================================================ */}
        <div className="relative overflow-hidden rounded-3xl border border-white/5">
          <div
            className="h-44 w-full bg-cover bg-center sm:h-52"
            style={{ backgroundImage: `url(${heroBg})` }}
            role="presentation"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,9,16,0.95) 0%, rgba(10,9,16,0.75) 45%, rgba(10,9,16,0.35) 100%)",
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-center gap-3 px-6 sm:px-10">
            <span
              className="inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-[10px] font-semibold tracking-[0.15em] text-[#e8b46a]"
              style={{ borderColor: `${GOLD}66` }}
            >
              METAVERSE REAL WORLD ASSETS
            </span>

            <h1 className="font-serif text-2xl text-white sm:text-3xl lg:text-4xl">
              Tokenized Real Estate
            </h1>

            <p className="max-w-lg text-sm text-white/60">
              Own fractions of high-yield, institutional-grade physical assets
              globally. Liquid real estate syndication secured on-chain with
              automatic yield indexation and sovereign protection.
            </p>
          </div>
        </div>

        {/* ============================================================
            FILTER BAR
        ============================================================ */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#18211E] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <FilterDropdown
              label="Location"
              value={location}
              options={locationOptions}
              onChange={setLocation}
            />
            <FilterDropdown
              label="Property Type"
              value={propertyType}
              options={typeOptions}
              onChange={setPropertyType}
            />
            <FilterDropdown
              label="Yield"
              value={YIELD_OPTIONS.find((option) => option.value === minYield)?.label}
              options={YIELD_OPTIONS.map((option) => option.label)}
              onChange={(label) =>
                setMinYield(YIELD_OPTIONS.find((option) => option.label === label).value)
              }
            />
          </div>

          <FilterDropdown
            label="Sort by"
            value={sortBy}
            options={Object.keys(SORT_OPTIONS)}
            onChange={setSortBy}
            align="right"
          />
        </div>

        {/* ============================================================
            LISTINGS + FEATURED SYNDICATE
        ============================================================ */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Property grid */}
          <div className="lg:col-span-2">
            {visibleProperties.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {visibleProperties.map((property) => (
                  <PropertyCard key={property.slug} property={property} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#18211E] py-16 text-center">
                <Text size="sm" color="muted" className="!text-white/40">
                  No properties match these filters. Try widening your search.
                </Text>
              </div>
            )}
          </div>

          {/* Sidebar: featured syndicate + trust note */}
          <div className="flex flex-col gap-4">
            {featuredProperty && <SyndicateCard property={featuredProperty} />}

            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#18211E] p-4">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-white/40" />
              <Text size="sm" color="muted" className="!text-xs !text-white/40 leading-relaxed">
                All properties are institutionalized under custody of Metalan
                Trust Ltd., ensuring automated ledger security.
              </Text>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * One property tile in the marketplace grid: cover photo, title,
 * location, a fractions-sold progress bar, the per-token price and
 * estimated yield, and a details CTA that routes to the matching
 * PropertyDetail.jsx page via slug.
 */
function PropertyCard({ property }) {
  const committedPct = Math.round(
    (property.investment.faixSold / property.investment.faixTotal) * 100
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#18211E] transition-colors hover:border-white/20">
      <div
        className="h-40 w-full bg-cover bg-center sm:h-44"
        style={{ backgroundImage: `url(${property.heroImage})` }}
        role="img"
        aria-label={property.name}
      />

      <div className="p-4 sm:p-5">
        <Text size="lg" weight="semibold" color="white" className="font-serif">
          {property.name}
        </Text>
        <p className="mt-1 flex items-center gap-1 text-xs text-white/40">
          <MapPin size={12} />
          {property.city}
        </p>

        {/* Fractions sold */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Fractions Sold</span>
            <span className="font-semibold text-[#e8b46a]">{committedPct}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
            <div
              className="h-full rounded-full"
              style={{
                width: `${committedPct}%`,
                background: `linear-gradient(90deg, ${GOLD}, #d9822f)`,
              }}
            />
          </div>
        </div>

        {/* Price / yield */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-white/40">Token Price</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-white">
              F {property.investment.tokenPrice.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-white/40">Est. Yield</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-emerald-400">
              {property.investment.estimatedYield}% p.a.
            </p>
          </div>
        </div>

        <Link
          to={`/dashboard/properties/${property.slug}`}
          className="mt-4 block w-full rounded-xl border border-white/15 py-2.5 text-center text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:bg-white/5"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

/**
 * The gold-bordered sidebar promo for the marketplace's top-yielding
 * listing. Visually louder than a PropertyCard on purpose — the gold
 * border and filled CTA button mark it as the page's featured
 * opportunity. Links through to the same PropertyDetail page as its
 * grid card, since it's the same underlying listing, just spotlighted.
 */
function SyndicateCard({ property }) {
  const committedPct = Math.round(
    (property.investment.faixSold / property.investment.faixTotal) * 100
  );

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: `${GOLD}66`, background: "rgba(255,255,255,0.02)" }}
    >
      <span
        className="inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold tracking-[0.1em] text-[#e8b46a]"
        style={{ borderColor: `${GOLD}66` }}
      >
        FEATURED SYNDICATE
      </span>

      <Text size="lg" weight="semibold" color="white" className="mt-3 font-serif !text-xl">
        {property.name}
      </Text>
      <Text size="sm" color="muted" className="mt-2 !text-xs !text-white/45 leading-relaxed">
        {property.description}
      </Text>

      <div
        className="mt-4 h-32 w-full rounded-xl bg-cover bg-center"
        style={{ backgroundImage: `url(${property.heroImage})` }}
        role="img"
        aria-label={property.name}
      />

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-white/40">Est. Yield</p>
          <p className="mt-0.5 font-mono text-lg font-bold text-emerald-400">
            {property.investment.estimatedYield}% p.a.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-white/40">Asset Valuation</p>
          <p className="mt-0.5 font-mono text-lg font-bold text-white">
            {property.metrics.assetValuation}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/40">Syndicate Progress</span>
          <span className="font-semibold text-[#e8b46a]">{committedPct}% Allotted</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
          <div
            className="h-full rounded-full"
            style={{
              width: `${committedPct}%`,
              background: `linear-gradient(90deg, ${GOLD}, #d9822f)`,
            }}
          />
        </div>
      </div>

      <Link
        to={`/dashboard/properties/${property.slug}`}
        className="mt-5 block w-full rounded-xl py-3 text-center text-sm font-extrabold tracking-wide text-[#241608] transition-all hover:brightness-105"
        style={{ background: `linear-gradient(90deg, #f2c380, ${GOLD}, #d9822f)` }}
      >
        VIEW INVESTMENT SUITE
      </Link>
    </div>
  );
}

/**
 * A single filter/sort control. Deliberately built on a native <select>
 * rather than a custom dropdown: it gets keyboard support, mobile-native
 * pickers, and screen-reader behavior for free, and is styled (via the
 * wrapping div + a chevron icon layered on top) to still match the dark
 * pill look from the design rather than the browser's default select
 * chrome.
 *
 * `align="right"` only affects text alignment for the standalone
 * "Sort by" control, which sits alone on the right side of the filter
 * bar rather than grouped with the others on the left.
 */
// function FilterDropdown({ label, value, options, onChange, align = "left" }) {
//   return (
//     <label
//       className={
//         "flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs " +
//         (align === "right" ? "sm:flex-row-reverse" : "")
//       }
//     >
//       <span className="whitespace-nowrap text-white/40">{label}:</span>
//       <span className="relative flex items-center">
//         <select
//           value={value}
//           onChange={(event) => onChange(event.target.value)}
//           className="appearance-none bg-transparent pr-4 font-semibold text-white outline-none"
//         >
//           {options.map((option) => (
//             <option key={option} value={option} className="bg-[#121614] text-white">
//               {option}
//             </option>
//           ))}
//         </select>
//         <ChevronDown size={12} className="pointer-events-none absolute right-0 text-white/40" />
//       </span>
//     </label>
//   );
// }

function FilterDropdown({ label, value, options, onChange, align = "left" }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
          <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
       className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 !text-[12px] text-white transition-colors hover:border-white/20"
      >
        <span className="whitespace-nowrap !text-[12px] text-white/40">
          {label}:
        </span>

        <span className="flex items-center gap-1 font-medium">
          {value}

          <ChevronDown
            size={10}
            className={`text-white/40 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>
      {open && (
        <div
          className={
            "absolute top-full z-50 mt-2 min-w-full overflow-hidden rounded-xl border border-white/10 bg-[#121614] p-1 shadow-[0_12px_30px_rgba(0,0,0,0.45)] " +
            (align === "right" ? "right-0" : "left-0")
          }
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full rounded-md px-2.5 py-1.5 text-left !text-[13px] font-normal transition-colors ${
                option === value
                  ? "bg-[#1A3C34] text-[#e8b46a]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}