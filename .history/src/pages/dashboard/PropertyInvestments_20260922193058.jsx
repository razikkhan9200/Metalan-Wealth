"use client";
/**
 * PropertyInvestments.jsx — dedicated "Property Investments" page for the Metalan platform.
 * Dummy data only, same visual language as UserAdmin.jsx (dark navy / gold / cyan).
 */
import { useEffect, useMemo, useState } from "react";
import {
  Building2, Search, MapPin, Coins, Layers, PieChart, Check, ChevronDown,
} from "lucide-react";
import {
  BTN, CARD, fmt, fmt0,
} from "./shared/theme";
import {
  AmountField, FormError, InfoList, InfoRow, Modal, OptionList, PageHeader, PageShell,
  SectionTitle, StatCard, Toast,
} from "./shared/ui";
import { get, post } from "../../services/Api";
import { mapProperty, TOKEN_VALUE } from "../../utils/apiMappers";


function FilterSelect({ value, onChange, options, label = "" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (event) => {
      if (!event.target.closest?.("[data-property-filter-select]")) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectedLabel = options.find((option) => option.value === value)?.label || label;

  return (
    <div
      data-property-filter-select
      className={`relative z-${open ? "[100]" : "[1]"} w-full sm:w-auto sm:min-w-[190px]`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-3.5 text-left text-sm font-medium outline-none transition-all duration-200 ${
          open
            ? "border-[#d4af6a]/45 ring-1 ring-[#d4af6a]/15"
            : "border-white/10 hover:border-white/15"
        }`}
        style={{
          backgroundColor: "var(--mt-surface)",
          color: "var(--color-slate-200)",
        }}
      >
        <span className="min-w-0 truncate">{selectedLabel}</span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          style={{ color: "var(--mt-gold-text)" }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-[110] overflow-hidden rounded-xl border p-1 shadow-2xl"
          style={{
            backgroundColor: "var(--mt-surface)",
            borderColor: "rgba(255,255,255,.10)",
          }}
        >
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  selected ? "bg-[#d4af6a]/10" : "hover:bg-white/[0.05]"
                }`}
                style={{
                  color: selected
                    ? "var(--mt-gold-text)"
                    : "var(--color-slate-200)",
                }}
              >
                <span className="truncate">{option.label}</span>

                {selected && (
                  <Check
                    className="h-4 w-4 shrink-0"
                    style={{ color: "var(--mt-gold)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PropertyInvestments({ onNavigate = () => {} }) {
  const [faix, setFaix] = useState(0);
  const [properties, setProperties] = useState([]);
  const [propPos, setPropPos] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("yield");
  const [modalId, setModalId] = useState(null);
  const [toast, setToast] = useState(null);

  // Real data: available FAIX (wallet), the property catalog, and the
  // user's own purchase history — replacing the PROPERTIES/
  // INITIAL_PROPS dummy arrays this page used to import from
  // shared/theme.js. There is no dedicated "my property purchases"
  // endpoint on the backend (only a global top-5 in GET /dashboard),
  // so holdings here are derived from the user's own transaction
  // history: every "Buy" transaction whose asset name matches a
  // property IS a property purchase (see purchaseProperty() in
  // Backend/src/controllers/properties.controller.js — it logs a
  // Transaction with asset: property.propertyName).
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const [walletRes, propertiesRes, txRes] = await Promise.all([
          get("/wallet/me"),
          get("/properties"),
          get("/transactions?page=1&limit=100"),
        ]);
        if (cancelled) return;

        const mappedProperties = propertiesRes.data.properties.map(mapProperty);
        setFaix(walletRes.data.userTokenSummary.availableFaixToken);
        setProperties(mappedProperties);

        const nameToId = new Map(mappedProperties.map((p) => [p.name, p.id]));
        const positions = {};
        (txRes.data.records || []).forEach((record) => {
          if (record.type !== "Buy") return;
          const propertyId = nameToId.get(record.asset);
          if (!propertyId) return; // a fund investment, not a property purchase
          const existing = positions[propertyId];
          positions[propertyId] = existing
            ? { tokens: existing.tokens + record.amount, cost: existing.cost + record.total }
            : { tokens: record.amount, cost: record.total };
        });
        setPropPos(positions);
      } catch (error) {
        if (!cancelled) setLoadError(error.message || "Couldn't load properties.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let list = properties.filter(
      (p) => !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase())
    );
    list = [...list].sort((a, b) => (sort === "yield" ? b.yield - a.yield : sort === "price" ? a.tokenPrice - b.tokenPrice : b.value - a.value));
    return list;
  }, [properties, query, sort]);

  const { propsValue, propsCost } = useMemo(() => {
    let pv = 0, pc = 0;
    properties.forEach((p) => {
      const pos = propPos[p.id];
      if (pos) { pv += pos.tokens * p.tokenPrice; pc += pos.cost; }
    });
    return { propsValue: pv, propsCost: pc };
  }, [properties, propPos]);

  const returns = propsValue - propsCost;
  const totalTokens = Object.values(propPos).reduce((s, p) => s + p.tokens, 0);

  const buyProperty = async ({ property, qty, amount }) => {
    try {
      const res = await post("/properties/purchase", {
        propertyName: property.name,
        purchasedFaixToken: qty,
      });

      setFaix((v) => Math.max(v - qty, 0));
      setProperties((prev) => prev.map((p) => (p.id === property.id ? { ...p, available: p.available - qty } : p)));
      setPropPos((prev) => {
        const existing = prev[property.id];
        return {
          ...prev,
          [property.id]: existing ? { tokens: existing.tokens + qty, cost: existing.cost + amount } : { tokens: qty, cost: amount },
        };
      });
      setToast(res.message || `Bought ${qty} tokens of ${property.name}`);
    } catch (error) {
      setToast(error.message || "Couldn't complete the purchase.");
    } finally {
      setTimeout(() => setToast(null), 3200);
    }
  };

  const modalProperty = modalId ? properties.find((p) => p.id === modalId) : null;

  return (
    <PageShell active="Properties" onNavigate={onNavigate}>
      <div className="mx-auto w-full max-w-7xl min-w-0 space-y-5 overflow-x-hidden sm:space-y-6">
        <PageHeader
        icon={Building2}
        tone="gold"
        eyebrow="Property Investments"
        title="Own a share of premium real estate"
        subtitle="Buy tokenized shares of income-generating properties around the world — no minimum property purchase required."
        right={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-left backdrop-blur-md sm:text-right">
              <p className="text-[11px] text-slate-400">Available FAIX</p>
              <p className="text-lg font-semibold tabular-nums text-white">{fmt(faix, 4)}</p>
            </div>
            <button
              type="button"
              disabled={properties.length === 0}
              onClick={() => setModalId(properties[0].id)}
              className={BTN.gold}
            >
              <Building2 className="h-4 w-4" /> Buy property
            </button>
          </div>
        }
      />

      {/* stats */}
      <section aria-label="Property portfolio overview" className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Coins} tone="gold" label="Invested (cost)" value={fmt(propsCost)} unit="FAIX" note="Across all token holdings" />
        <StatCard icon={PieChart} tone="cyan" label="Current value" value={fmt(propsValue)} unit="FAIX" note="At today's token price" />
        <StatCard icon={Building2} tone="emerald" label="Total returns" value={`${returns >= 0 ? "+" : ""}${fmt(returns)}`} unit="FAIX" note="Unrealised gain / loss" />
        <StatCard icon={Layers} tone="violet" label="Tokens owned" value={fmt0(totalTokens)} note={`Across ${Object.keys(propPos).length} properties`} />
      </section>

      {/* holdings */}
      {Object.keys(propPos).length > 0 && (
        <section className={`${CARD} min-w-0 overflow-hidden p-4 sm:p-5`}>
          <SectionTitle icon={Layers} tone="violet" title="Your property holdings" subtitle="Token positions at today's price" />
          <div className="overflow-x-auto mt-thin">
            <table className="w-full min-w-[620px] border-separate border-spacing-y-1 text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-2 font-medium">Property</th>
                  <th className="px-3 py-2 font-medium">Tokens</th>
                  <th className="px-3 py-2 font-medium">Cost</th>
                  <th className="px-3 py-2 font-medium">Value</th>
                  <th className="px-3 py-2 font-medium">Gain / loss</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(propPos).map(([id, pos]) => {
                  const property = properties.find((p) => p.id === id);
                  const value = pos.tokens * property.tokenPrice;
                  const gain = value - pos.cost;
                  return (
                    <tr key={id} className="rounded-xl bg-white/[0.02] text-slate-200">
                      <td className="rounded-l-xl px-3 py-3 font-medium text-white">{property.name}</td>
                      <td className="px-3 py-3 tabular-nums text-slate-400">{pos.tokens}</td>
                      <td className="px-3 py-3 tabular-nums text-slate-400">{fmt(pos.cost, 4)}</td>
                      <td className="px-3 py-3 tabular-nums text-white">{fmt(value, 4)}</td>
                      <td className={`rounded-r-xl px-3 py-3 tabular-nums font-medium ${gain >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                        {gain >= 0 ? "+" : ""}{fmt(gain, 4)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* filters */}
      <section className={`${CARD} relative z-[90] flex flex-col gap-3 overflow-visible p-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:p-4`}>
        <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3.5 transition-colors focus-within:border-cyan-400/50">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by property or location"
            className="min-w-0 w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
          />
        </div>

        <FilterSelect
          value={sort}
          onChange={setSort}
          options={[
            { value: "yield", label: "Sort by yield" },
            { value: "price", label: "Sort by token price" },
            { value: "value", label: "Sort by property value" },
          ]}
          label="Sort properties"
        />
      </section>

      {/* property grid */}
      <section aria-label="Available properties">
        <SectionTitle icon={Building2} tone="gold" title="Available properties" subtitle={`${filtered.length} of ${properties.length} properties`} />
        {loading && (
          <div className={`${CARD} p-8 text-center text-sm text-slate-500`}>Loading properties…</div>
        )}
        {!loading && loadError && (
          <div className={`${CARD} p-8 text-center text-sm text-rose-300`}>{loadError}</div>
        )}
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {!loading && !loadError && filtered.map((p) => {
            const held = propPos[p.id];
            const pctSold = ((p.total - p.available) / p.total) * 100;
            return (
              <div key={p.id} className={`${CARD} min-w-0 flex flex-col overflow-hidden transition-colors hover:border-white/15`}>
                <div className="relative h-40 w-full overflow-hidden">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover" loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05080d] via-transparent to-transparent" />
                  <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-emerald-300 backdrop-blur">
                    {p.yield.toFixed(1)}% yield
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" /> {p.location}</p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-500">Property value</p>
                      <p className="mt-0.5 font-medium tabular-nums text-white">${fmt(p.value, 4)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Token price</p>
                      <p className="mt-0.5 font-medium tabular-nums text-white">{fmt(p.tokenPrice, 4)} FAIX</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{fmt0(p.total - p.available)} / {fmt0(p.total)} tokens sold</span>
                      <span>{pctSold.toFixed(0)}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#d4af6a] to-[#e2c17f]" style={{ width: `${pctSold}%` }} />
                    </div>
                  </div>

                  {held && (
                    <div className="mt-4 rounded-xl border border-[#d4af6a]/20 bg-[#d4af6a]/[0.06] px-3 py-2 text-[11px] text-[#e2c17f]">
                      You own {held.tokens} tokens · {fmt(held.tokens * p.tokenPrice, 4)} FAIX
                    </div>
                  )}

                  <button type="button" disabled={p.available <= 0} onClick={() => setModalId(p.id)} className={`${BTN.goldSoft} mt-4 w-full`}>
                    <Coins className="h-4 w-4" /> {p.available > 0 ? "Buy tokens" : "Sold out"}
                  </button>
                </div>
              </div>
            );
          })}
          {!loading && !loadError && filtered.length === 0 && (
            <div className={`${CARD} col-span-full p-8 text-center text-sm text-slate-500`}>No properties match your search.</div>
          )}
        </div>
      </section>

      {modalProperty && (
        <Modal title="Buy property tokens" subtitle="Confirm your token purchase" icon={Building2} tone="gold" onClose={() => setModalId(null)}>
          {(close) => (
            <PropertyForm
              faix={faix} properties={properties} initialId={modalProperty.id}
              onSubmit={(payload) => { buyProperty(payload); close(); }}
            />
          )}
        </Modal>
      )}

        {toast && <Toast message={toast} />}
      </div>
    </PageShell>
  );
}

function PropertyForm({ faix, properties, initialId, onSubmit }) {
  const [id, setId] = useState(initialId || properties.find((p) => p.available > 0)?.id || properties[0].id);
  const [qtyText, setQtyText] = useState("");
  const property = properties.find((p) => p.id === id);
  const qty = Math.max(0, Math.floor(parseFloat(qtyText) || 0));
  const amount = qty * property.tokenPrice;
  const maxQty = Math.max(0, Math.min(property.available, Math.floor(faix / property.tokenPrice)));
  const error = !qty ? "" : qty > property.available ? `Only ${fmt(property.available, 4)} tokens are available.` : amount > faix ? "Purchase amount is higher than your available FAIX." : "";
  const valid = qty > 0 && !error;

  return (
    <div className="space-y-5">
      <OptionList value={id} onChange={setId}
        options={properties.map((p) => ({ id: p.id, title: p.name, sub: p.location, meta: `${fmt(p.tokenPrice, 4)} FAIX / token` }))} />
      <AmountField label="FAIX token quantity" unit="tokens" step={1} value={qtyText} onChange={setQtyText} hint={`${fmt(property.available, 4)} available`}
        chips={[1, 5, 10].filter((v) => v <= maxQty).map((v) => ({ label: String(v), value: v })).concat({ label: "Max", value: maxQty })} />
      <InfoList>
        <InfoRow label="Token value" value={`${fmt(property.tokenPrice, 4)} FAIX`} />
        <InfoRow label="Purchase amount" value={`${fmt(amount)} FAIX`} accent="text-[#e2c17f]" />
        <InfoRow label="Ownership share" value={`${((qty / property.total) * 100).toFixed(4)}%`} />
        <InfoRow label="Available FAIX" value={fmt(faix, 4)} />
      </InfoList>
      <FormError>{error}</FormError>
      <button type="button" disabled={!valid} onClick={() => onSubmit({ property, qty, amount })} className={`${BTN.gold} w-full`}>
        <Check className="h-4 w-4" /> Confirm purchase
      </button>
    </div>
  );
}
