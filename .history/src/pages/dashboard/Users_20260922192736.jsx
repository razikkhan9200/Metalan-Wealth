/* Users.jsx — "Users" page: every investor on the platform */
"use client";

import { useMemo, useState } from "react";
import {
  Users as UsersIcon,
  Search,
  UserCheck,
  Coins,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  ACCENT,
  CARD,
  TIER,
  USERS,
  USER_STATUS,
  fmt0,
  initials,
  signedPct,
} from "./shared/theme";
import { PageHeader, PageShell, SectionTitle, StatCard } from "./shared/ui";

const TIERS = ["All", "Platinum", "Gold", "Silver", "Bronze"];
const STATUSES = ["All", "Active", "Pending KYC", "Suspended"];
const PAGE_SIZE = 8;

function ThemeSelect({ value, onChange, options, allLabel }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative w-full sm:w-auto sm:min-w-[155px] ${
        open ? "z-[300]" : "z-0"
      }`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-3.5 text-left text-sm font-medium outline-none transition-all duration-200"
        style={{
          backgroundColor: "var(--mt-surface)",
          color: "var(--color-slate-200)",
          borderColor: open
            ? "var(--mt-gold)"
            : "rgba(255,255,255,.10)",
          boxShadow: open
            ? "0 0 0 1px color-mix(in srgb, var(--mt-gold) 18%, transparent)"
            : "none",
        }}
      >
        <span className="min-w-0 truncate">
          {value === "All" ? allLabel : value}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 text-[#D4AF6A]" : "text-slate-500"
          }`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close dropdown"
            className="fixed inset-0 z-[-1] cursor-default"
            onClick={() => setOpen(false)}
          />

          <div
            role="listbox"
            aria-label={allLabel}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-[400] overflow-hidden rounded-xl border p-1.5 shadow-2xl"
            style={{
              backgroundColor: "var(--mt-surface)",
              color: "var(--color-slate-200)",
              borderColor: "rgba(255,255,255,.10)",
            }}
          >
            {options.map((option) => {
              const selected = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange({ target: { value: option } });
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                  style={{
                    backgroundColor: selected
                      ? "color-mix(in srgb, var(--mt-gold) 10%, transparent)"
                      : "transparent",
                    color: selected
                      ? "var(--mt-gold-text)"
                      : "var(--color-slate-300)",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) {
                      e.currentTarget.style.backgroundColor =
                        "color-mix(in srgb, var(--mt-gold) 7%, transparent)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span className="truncate">
                    {option === "All" ? allLabel : option}
                  </span>

                  {selected && (
                    <Check className="h-4 w-4 shrink-0 text-[#D4AF6A]" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function UserAvatar({ name, size = "h-9 w-9", index = 0 }) {
  const tones = [
    ACCENT.cyan,
    ACCENT.gold,
    ACCENT.violet,
    ACCENT.emerald,
    ACCENT.rose,
  ];

  return (
    <span
      className={`grid ${size} shrink-0 place-items-center rounded-full text-[11px] font-semibold ring-1 ${
        tones[index % tones.length]
      }`}
    >
      {initials(name)}
    </span>
  );
}

export default function Users({ onNavigate = () => {} }) {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(0);

  const ranked = useMemo(
    () => [...USERS].sort((a, b) => b.invested - a.invested),
    []
  );

  const filtered = useMemo(
    () =>
      ranked.filter((u) => {
        if (tier !== "All" && u.tier !== tier) return false;
        if (status !== "All" && u.status !== status) return false;
        if (
          query &&
          !`${u.name} ${u.email} ${u.country}`
            .toLowerCase()
            .includes(query.toLowerCase())
        ) {
          return false;
        }
        return true;
      }),
    [ranked, tier, status, query]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  const totalInvested = USERS.reduce((s, u) => s + u.invested, 0);
  const active = USERS.filter((u) => u.status === "Active").length;
  const avgReturn =
    USERS.reduce((s, u) => s + u.returns, 0) / USERS.length;

  const reset = (fn) => (e) => {
    fn(e.target.value);
    setPage(0);
  };

  return (
    <PageShell active="Users" onNavigate={onNavigate}>
      <PageHeader
        icon={UsersIcon}
        tone="cyan"
        eyebrow="Users"
        title="Every investor on the platform"
        subtitle="Ranked by total invested capital. Search, filter by tier or status, and review account health at a glance."
      />

      <section
        aria-label="User summary"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <StatCard
          icon={UsersIcon}
          tone="cyan"
          label="Total users"
          value={String(USERS.length)}
          note="Registered investors"
        />
        <StatCard
          icon={UserCheck}
          tone="emerald"
          label="Active users"
          value={String(active)}
          note={`${USERS.length - active} need attention`}
        />
        <StatCard
          icon={Coins}
          tone="gold"
          label="Total invested"
          value={fmt0(totalInvested)}
          unit="FAIX"
          note="Across all users"
        />
        <StatCard
          icon={TrendingUp}
          tone="violet"
          label="Average return"
          value={signedPct(avgReturn)}
          note="Mean across users"
        />
      </section>

      <section className={`${CARD} relative z-[200] !overflow-visible flex flex-col gap-3 p-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:p-4`}>
        <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3.5">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={query}
            onChange={reset(setQuery)}
            placeholder="Search by name, email or country"
            className="min-w-0 w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
          />
        </div>

        <ThemeSelect
          value={tier}
          options={TIERS}
          allLabel="All tiers"
          onChange={reset(setTier)}
        />

        <ThemeSelect
          value={status}
          options={STATUSES}
          allLabel="All statuses"
          onChange={reset(setStatus)}
        />
      </section>

      <section className={`${CARD} relative z-0 min-w-0 overflow-hidden p-4 sm:p-5`}>
        <SectionTitle
          icon={UsersIcon}
          tone="cyan"
          title="All users"
          subtitle={`${filtered.length} matching users`}
        />

        <div className="mt-thin overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-1 text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Tier</th>
                <th className="px-3 py-2 font-medium">Country</th>
                <th className="px-3 py-2 font-medium">Positions</th>
                <th className="px-3 py-2 text-right font-medium">
                  Invested (FAIX)
                </th>
                <th className="px-3 py-2 text-right font-medium">Return</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((u) => {
                const rank = ranked.findIndex((r) => r.id === u.id);

                return (
                  <tr
                    key={u.id}
                    className="bg-white/[0.02] text-slate-200"
                  >
                    <td className="rounded-l-xl px-3 py-3 tabular-nums text-slate-500">
                      {rank + 1}
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={u.name} index={rank} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">
                            {u.name}
                          </p>
                          <p className="truncate text-[11px] text-slate-500">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ring-inset ${TIER[u.tier]}`}
                      >
                        {u.tier}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-slate-400">{u.country}</td>
                    <td className="px-3 py-3 tabular-nums text-slate-400">
                      {u.positions}
                    </td>

                    <td className="px-3 py-3 text-right font-medium tabular-nums text-white">
                      {fmt0(u.invested)}
                    </td>

                    <td
                      className={`px-3 py-3 text-right font-medium tabular-nums ${
                        u.returns >= 0
                          ? "text-emerald-300"
                          : "text-rose-300"
                      }`}
                    >
                      {signedPct(u.returns)}
                    </td>

                    <td className="rounded-r-xl px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${USER_STATUS[u.status]}`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pageItems.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500">
            No users match your filters.
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="mt-3 flex flex-col gap-3 border-t border-white/[0.06] pt-3.5 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between">
            <p className="text-center text-[11px] text-slate-500 min-[430px]:text-left">
              Page {page + 1} of {pageCount}
            </p>

            <div className="flex items-center justify-center gap-2 min-[430px]:justify-end">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Previous page"
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                disabled={page >= pageCount - 1}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next page"
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
