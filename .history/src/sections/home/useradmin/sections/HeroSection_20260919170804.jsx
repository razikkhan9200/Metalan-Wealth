import { Area, ComposedChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Bell, Clock, Search, ShieldCheck } from "lucide-react";

export default function HeroSection({
  IMAGES, Photo, AnimatedNumber, Delta, C, ICON_BTN, ACCENT,
  greeting, total, monthGrowth, monthChange, faix, holdings, pctOf,
  searchOpen, setSearchOpen, query, setQuery,
  notifRef, notifOpen, setNotifOpen, unread, setUnread,
  txs, TX_META, fmt0, fmtDate,
}) {
  return (
        <header data-anim="header" className="relative z-30 rounded-3xl border border-white/[0.08] shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
          {/* background layers (clipped separately so the notification dropdown can overflow the hero) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl bg-[#080d15]" aria-hidden>
            <Photo src={IMAGES.hero} eager className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,#05080d_12%,rgba(5,8,13,0.88)_44%,rgba(5,8,13,0.45)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#05080d]/80 to-transparent" />
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#d4af6a]/10 blur-3xl" />
          </div>

          <div className="relative p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
                  <span className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-[#e2c17f] to-cyan-400/60 opacity-80" />
                  <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-full border-2 border-[#05080d] bg-[#1a1710] text-sm font-semibold text-[#e2c17f]">
                    AA
                    <Photo src={IMAGES.avatar} alt="Andrew Alex" eager className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#05080d] bg-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{greeting}</p>
                  <h1 className="text-xl font-semibold text-white sm:text-2xl">Andrew Alex</h1>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#e2c17f]"><ShieldCheck className="h-3 w-3" />Verified investor</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" aria-label="Search transactions" onClick={() => { setSearchOpen((o) => !o); setQuery(""); }} className={`${ICON_BTN} ${searchOpen ? "border-cyan-400/40 text-cyan-200" : ""}`}>
                  <Search className="h-[18px] w-[18px]" />
                </button>
               <div ref={notifRef} className="relative">
  <button
    type="button"
    aria-label="Notifications"
    onClick={() => {
      setNotifOpen((o) => !o);
      setUnread(0);
    }}
    className={`${ICON_BTN} ${
      notifOpen ? "border-cyan-400/40 bg-cyan-400/[0.06] text-cyan-200" : ""
    }`}
  >
    <Bell className="h-[18px] w-[18px]" />

    {unread > 0 && (
      <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-400 px-1 text-[9px] font-bold text-white ring-2 ring-[#05080d]">
        {unread}
      </span>
    )}
  </button>

  {notifOpen && (
    <div className="absolute right-0 z-50 mt-3 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0a1019] shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5">
        <div>
          <p className="text-sm font-semibold text-white">
            Notifications
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Latest account activity
          </p>
        </div>

        <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] font-medium text-cyan-300 ring-1 ring-cyan-400/20">
          {txs.length} updates
        </span>
      </div>

      {/* Notifications */}
      <div className="max-h-[340px] overflow-y-auto scrollbar-hide p-2">
        {txs.slice(0, 5).map((t) => {
          const { icon: Icon, tone } = TX_META[t.type];

          return (
            <div
              key={t.id}
              className="group flex gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.035]"
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ${ACCENT[tone]}`}
              >
                <Icon className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium text-slate-100">
                    {t.asset}
                  </p>

                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                      t.status === "Completed"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="mt-1 truncate text-[11px] text-slate-500">
                  {t.type} • {fmt0(Math.abs(t.amount))} FAIX
                </p>

                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-600">
                  <Clock className="h-3 w-3" />
                  {fmtDate(t.date)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-4 py-2.5 text-center">
        <button
          type="button"
          onClick={() => setNotifOpen(false)}
          className="text-[11px] font-medium text-cyan-300 transition hover:text-cyan-200"
        >
          Close notifications
        </button>
      </div>
    </div>
  )}
</div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-[1.15fr_1fr] lg:items-end">
              <div>
                <p className="text-sm text-slate-300">Your portfolio is worth</p>
                <p className="mt-2 text-4xl font-semibold tabular-nums text-white sm:text-5xl">
                  <AnimatedNumber value={total} format={fmt0} />
                  <span className="ml-2 text-base font-medium text-slate-400 sm:text-lg">FAIX</span>
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Delta value={monthGrowth} />
                  <span className="text-xs text-slate-400">over the last 30 days</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-200 backdrop-blur">
                    <ShieldCheck className={`h-3.5 w-3.5 ${monthGrowth >= 0 ? "text-emerald-300" : "text-rose-300"}`} />
                    {monthGrowth >= 0 ? "Performing well" : "Below trend"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Last 30 days</p>
                    <p className="text-lg font-semibold tabular-nums text-white">
                      {monthChange >= 0 ? "+" : "−"}{fmt0(Math.abs(monthChange))} <span className="text-xs font-normal text-slate-500">FAIX</span>
                    </p>
                  </div>
                  <p className="text-right text-[11px] text-slate-500">Liquid {pctOf(faix, total).toFixed(1)}%<br />Invested {pctOf(holdings, total).toFixed(1)}%</p>
                </div>
                <div className="mt-2 h-24 w-full [&_*]:outline-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthly} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={C.cyan} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis hide dataKey="label" />
                      <YAxis hide domain={["dataMin", "dataMax"]} />
                      <Area dataKey="value" type="monotone" stroke={C.cyan} strokeWidth={2} fill="url(#heroFill)" dot={false} activeDot={false} isAnimationActive={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
  );
}
