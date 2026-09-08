/* pages/dashboard/exchange/Exchange.jsx: application source file. Sovereign exchange "coming soon" launch page. */
import { useState } from "react";

// lucide-react icons
import { Tag, CheckCircle2, ArrowRight, Zap } from "lucide-react";

// Components
import Navbar from "../../../layouts/DashboardNavbar";
import Text from "../../../components/ui/Text";

// Images

import coreArchitectureBg from "../../../../public/images/Dashboard-Exchange-Images/abstract-bg.png";

// Shared brand colors — same values used across Dashboard/Funds/Property
// so this page's palette stays identical rather than drifting if edited
// in isolation.
const ACCENT = "#1A3C34";
const GOLD = "#e8b46a";

// System release pipeline shown in the right-hand card. `status` drives
// both the badge label/color and the card's border/background — see
// `PHASE_STYLES` below.
const PIPELINE = [
  {
    id: "phase-1",
    label: "PHASE 1",
    title: "Secure Multi-Chain Testnet Setup",
    status: "complete",
  },
  {
    id: "phase-2",
    label: "PHASE 2",
    title: "Consensys Audited Smart Contracts",
    status: "complete",
  },
  {
    id: "phase-3",
    label: "PHASE 3",
    title: "Sovereign Mainnet Launch & Swap Pool Initialization",
    status: "in-progress",
  },
  {
    id: "phase-4",
    label: "PHASE 4",
    title: "Sovereign Vault Public Allocation",
    status: "upcoming",
  },
];

// How far along the pipeline is overall — drives the progress bar and
// the "% COMPLETE" label above it.
const PIPELINE_PROGRESS = 75;

// Headline platform stats shown in the bottom strip.
const STATS = [
  { value: "12+", label: "Blockchains Native Swaps" },
  { value: "$2.4B", label: "Audited Treasury Backing" },
  { value: "< 0.01%", label: "Institutional Execution Fee" },
];

export default function Exchange() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function handleJoinWaitlist(event) {
    event.preventDefault();
    if (!email.trim()) return;
    // TODO(waitlist-api): POST { email } to the waitlist service once
    // that endpoint exists.
    setJoined(true);
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0910] pb-16">
      <Navbar
        faixBalance="24,850.00"
        notificationCount={3}
        user={{ name: "Arjun Mehta", email: "arjun@metalanwealth.com", balance: "24,850.00" }}
      />

      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-10 lg:pt-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
          {/* LEFT: HEADLINE + WAITLIST */}
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide"
              style={{ borderColor: "#4ADE8055", color: GOLD }}
            >
              <Tag size={13} />
              PHASE 3 IN FLIGHT
            </span>

            <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-white sm:text-6xl lg:text-[3.4rem]">
              THE
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, #ffffff 0%, ${GOLD} 100%)`,
                }}
              >
                EXCHANGE
              </span>
              <br />
              IS COMING
            </h1>

            <Text size="lg" className="mt-6 max-w-lg !text-white/60 leading-relaxed">
              The next evolutionary leap in institutional-grade crypto
              reserve assets. Execute high-throughput, multi-chain
              liquidity swaps directly against audited real-world asset
              pools.
            </Text>

            <form
              onSubmit={handleJoinWaitlist}
              className="mt-8 flex max-w-lg items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2"
            >
              <input
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your institutional wallet or email address..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold tracking-wide text-[#241608] transition-opacity hover:opacity-60"
                style={{ background: `linear-gradient(90deg, ${GOLD}, #d99a4e)` }}
              >
                {joined ? "REQUEST RECEIVED" : "JOIN WAITLIST"}
                <ArrowRight size={14} />
              </button>
            </form>

            <p className="mt-4 flex max-w-lg items-start gap-2 text-xs leading-relaxed text-white/40">
              <Zap size={14} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
              Whitelisted addresses receive priority allocations in our
              sovereign liquidity pools upon mainnet launch.
            </p>
          </div>

          {/* RIGHT: CORE VISUAL + RELEASE PIPELINE */}
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10">
              <img
                src={coreArchitectureBg}
                alt="Metalan core architecture — intersecting gold and graphite rings"
                className="h-56 w-full object-cover sm:h-64"
              />
              <span className="absolute left-5 top-5 rounded-md bg-black/50 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white/70 backdrop-blur">
                METALAN CORE ARCHITECTURE
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <Text size="lg" weight="semibold" color="white" className="font-serif">
                  System Release Pipeline
                </Text>
                <span className="font-mono text-xs font-semibold" style={{ color: GOLD }}>
                  {PIPELINE_PROGRESS}% COMPLETE
                </span>
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${PIPELINE_PROGRESS}%`,
                    background: `linear-gradient(90deg, ${GOLD}, #d99a4e)`,
                  }}
                />
              </div>

              <div className="mt-5 flex flex-col gap-3">
                {PIPELINE.map((phase) => (
                  <PipelinePhase key={phase.id} phase={phase} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STAT STRIP */}
        {/* <div className="mt-14 grid grid-cols-1 gap-8 border-t border-white/5 pt-10 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-2xl font-bold sm:text-4xl" style={{ color: GOLD }}>
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </div> */}
      </main>
    </div>
  );
}

const PHASE_STYLES = {
  complete: {
    card: "border-white/10 bg-white/[0.02]",
    badge: "text-emerald-400",
    badgeLabel: "COMPLETE",
    icon: <CheckCircle2 size={13} />,
  },
  "in-progress": {
    card: "border-[#e8b46a]/50",
    badge: "",
    badgeLabel: "IN PROGRESS",
    icon: <span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />,
  },
  upcoming: {
    card: "border-white/5 bg-transparent opacity-60",
    badge: "text-white/40",
    badgeLabel: "UPCOMING",
    icon: null,
  },
};

function PipelinePhase({ phase }) {
  const style = PHASE_STYLES[phase.status];
  const isInProgress = phase.status === "in-progress";

  return (
    <div
      className={`rounded-xl border p-4 ${style.card}`}
      style={isInProgress ? { background: `${ACCENT}40` } : undefined}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-white/40">
          {phase.label}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide ${style.badge}`}
          style={isInProgress ? { color: GOLD } : undefined}
        >
          {style.icon}
          {style.badgeLabel}
        </span>
      </div>
      <p
        className={
          "mt-1.5 text-sm font-medium " +
          (phase.status === "upcoming" ? "text-white/50" : "text-white")
        }
      >
        {phase.title}
      </p>
    </div>
  );
}