import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Bell,
  Search,
  ChevronDown,
  TrendingUp,
  Wallet,
  Coins,
  Building2,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowLeftRight,
  Landmark,
  CircleDollarSign,
  CheckCircle2,
  X,
  MapPin,
  CalendarDays,
  BarChart3,
  ShieldCheck,
  Activity,
  ShoppingBag,
  Layers3,
} from "lucide-react";

/* =========================================================
   DUMMY DATA
========================================================= */

const funds = [
  {
    id: 1,
    name: "Oil Grow Fund",
    category: "Growth",
    risk: "Moderate",
    nav: 10,
    growth: 15.3,
    icon: BarChart3,
  },
  {
    id: 2,
    name: "Metals Strength Fund",
    category: "Commodity",
    risk: "Medium",
    nav: 20,
    growth: 12.5,
    icon: Coins,
  },
  {
    id: 3,
    name: "Classic Opportunity",
    category: "Balanced",
    risk: "Low",
    nav: 14,
    growth: 9.8,
    icon: Layers3,
  },
];

const properties = [
  {
    id: 1,
    name: "Green Valley Apartments",
    location: "Toronto, ON",
    price: 500000,
    tokenValue: 11,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Lakeview Residences",
    location: "Mississauga, ON",
    price: 750000,
    tokenValue: 11,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
  },
];

const chartData = {
  "1D": [
    { label: "9 AM", value: 180000, baseline: 175000 },
    { label: "10 AM", value: 187000, baseline: 178000 },
    { label: "11 AM", value: 184000, baseline: 181000 },
    { label: "12 PM", value: 198000, baseline: 185000 },
    { label: "1 PM", value: 205000, baseline: 189000 },
    { label: "2 PM", value: 218000, baseline: 194000 },
    { label: "3 PM", value: 225000, baseline: 200000 },
  ],

  "1W": [
    { label: "Mon", value: 158000, baseline: 145000 },
    { label: "Tue", value: 174000, baseline: 152000 },
    { label: "Wed", value: 166000, baseline: 158000 },
    { label: "Thu", value: 192000, baseline: 168000 },
    { label: "Fri", value: 208000, baseline: 176000 },
    { label: "Sat", value: 216000, baseline: 184000 },
    { label: "Sun", value: 225000, baseline: 192000 },
  ],

  "1M": [
    { label: "W1", value: 42000, baseline: 30000 },
    { label: "W2", value: 76000, baseline: 52000 },
    { label: "W3", value: 112000, baseline: 72000 },
    { label: "W4", value: 158000, baseline: 97000 },
  ],

  "1Y": [
    { label: "Jan", value: 18000, baseline: 20000 },
    { label: "Feb", value: 34000, baseline: 25000 },
    { label: "Mar", value: 29000, baseline: 32000 },
    { label: "Apr", value: 82000, baseline: 45000 },
    { label: "May", value: 68000, baseline: 60000 },
    { label: "Jun", value: 118000, baseline: 72000 },
    { label: "Jul", value: 92000, baseline: 85000 },
    { label: "Aug", value: 241789, baseline: 98000 },
    { label: "Sep", value: 204000, baseline: 125000 },
    { label: "Oct", value: 216000, baseline: 153000 },
    { label: "Nov", value: 202000, baseline: 170000 },
    { label: "Dec", value: 215000, baseline: 185000 },
  ],
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function UserAdmin() {
  const pageRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [period, setPeriod] = useState("1Y");

  const [balance, setBalance] = useState(17181);
  const [invested, setInvested] = useState(7240);
  const [returns, setReturns] = useState(2200);

  const [fundCount, setFundCount] = useState(3);
  const [propertyCount, setPropertyCount] = useState(2);

  const [fundModal, setFundModal] = useState(false);
  const [propertyModal, setPropertyModal] = useState(false);

  const [selectedFund, setSelectedFund] = useState(funds[0]);
  const [selectedProperty, setSelectedProperty] = useState(
    properties[0]
  );

  const [fundAmount, setFundAmount] = useState(500);
  const [propertyTokens, setPropertyTokens] = useState(10);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      name: "Metals Strength Fund",
      type: "Fund Investment",
      amount: 400,
      date: "19 Sep 2025",
    },
    {
      id: 2,
      name: "Green Valley Apartments",
      type: "Property Purchase",
      amount: 110,
      date: "18 Sep 2025",
    },
    {
      id: 3,
      name: "Oil Grow Fund",
      type: "Fund Investment",
      amount: 500,
      date: "17 Sep 2025",
    },
    {
      id: 4,
      name: "Wallet Deposit",
      type: "Deposit",
      amount: 1000,
      date: "16 Sep 2025",
    },
  ]);

  /* =========================================================
     GSAP
  ========================================================= */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".top-nav", {
        y: -25,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          ".hero-content",
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .from(
          ".stat-card",
          {
            y: 35,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          ".dashboard-panel",
          {
            y: 35,
            opacity: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.3"
        );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  /* =========================================================
     CALCULATIONS
  ========================================================= */

  const units = Number(fundAmount || 0) / selectedFund.nav;

  const propertyCost =
    Number(propertyTokens || 0) *
    selectedProperty.tokenValue;

  const totalPortfolio =
    invested + returns + 6000;

  const availableAfterInvestment = Math.max(
    balance,
    0
  );

  /* =========================================================
     FUND PURCHASE
  ========================================================= */

const handleFundPurchase = () => {
  const amount = Number(fundAmount);

  if (!amount || amount <= 0) {
    alert("Enter a valid investment amount.");
    return;
  }

  if (amount > balance) {
    alert("Insufficient FAIX balance.");
    return;
  }

  setProcessing(true);

  setTimeout(() => {
    setBalance((prev) => prev - amount);
    setInvested((prev) => prev + amount);
    setFundCount((prev) => prev + 1);

    setTransactions((prev) => [
      {
        id: Date.now(),
        name: selectedFund.name,
        type: "Fund Investment",
        amount,
        date: "19 Sep 2026",
      },
      ...prev,
    ]);

    setProcessing(false);
    setFundModal(false);
    setSuccessMessage(
      `Investment of ₣${amount.toLocaleString()} completed successfully.`
    );

    setTimeout(() => {
      setSuccessMessage("");
    }, 3500);
  }, 1200);
};

  /* =========================================================
     PROPERTY PURCHASE
  ========================================================= */

  const handlePropertyPurchase = () => {
    const tokens = Number(propertyTokens);

    if (!tokens || tokens <= 0) {
      alert("Enter valid FAIX tokens.");
      return;
    }

    if (tokens > balance) {
      alert("Insufficient FAIX balance.");
      return;
    }

    setBalance((prev) => prev - tokens);
    setInvested((prev) => prev + propertyCost);
    setPropertyCount((prev) => prev + 1);

    setTransactions((prev) => [
      {
        id: Date.now(),
        name: selectedProperty.name,
        type: "Property Purchase",
        amount: tokens,
        date: "19 Sep 2025",
      },
      ...prev,
    ]);

    setPropertyModal(false);
  };

  /* =========================================================
     ADD FUNDS
  ========================================================= */

  const handleAddFunds = () => {
    setBalance((prev) => prev + 1000);

    setTransactions((prev) => [
      {
        id: Date.now(),
        name: "Wallet Deposit",
        type: "Deposit",
        amount: 1000,
        date: "19 Sep 2025",
      },
      ...prev,
    ]);
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#040607] text-[#f4f4ef]"
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="top-nav sticky top-0 z-40 border-b border-white/[0.06] bg-[#050708]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5 md:px-8">

          {/* LOGO */}

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d9a441] bg-[#101315] font-serif text-xl text-[#e7bd69]">
              M
            </div>

            <div className="hidden sm:block">
              <h1 className="font-serif text-lg tracking-wide">
                METALAN WEALTH
              </h1>

              <p className="text-[9px] tracking-[0.22em] text-slate-600">
                INVEST. OWN. GROW.
              </p>
            </div>
          </div>

          {/* NAV */}

          <nav className="hidden items-center gap-8 lg:flex">
            {[
              "Dashboard",
              "Investments",
              "Blockchain",
              "Resources",
              "About",
            ].map((item, index) => (
              <button
                key={item}
                className={`relative py-7 text-sm transition ${
                  index === 0
                    ? "text-[#e6b95f]"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {item}

                {index === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d9a441]" />
                )}
              </button>
            ))}
          </nav>

          {/* RIGHT */}

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden items-center gap-2 text-sm md:flex">
              <span className="font-semibold text-[#22c7c4]">
                ₣1 FAIX
              </span>

              <span className="text-slate-700">=</span>

              <span className="text-[#22c7c4]">
                $0.80
              </span>

              <span className="text-emerald-400">
                ↗ 2.4%
              </span>
            </div>

            <button className="hidden text-sm text-[#d9a441] md:block">
              Sign In
            </button>

            <button className="rounded-full bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#10110f] transition hover:bg-[#edc16d]">
              Launch App
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1500px] px-5 py-7 md:px-8">

        {/* HERO */}

        <section className="hero-content relative mb-7 overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#080b0c]">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(217,164,65,0.10),transparent_32%)]" />

          <div className="relative flex min-h-[180px] items-center justify-between px-6 py-8 md:px-10">

            <div>
              <p className="font-serif text-lg text-slate-300">
                Welcome back,
              </p>

              <h2 className="mt-1 font-serif text-4xl font-semibold md:text-5xl">
                Test User
              </h2>

              <p className="mt-3 max-w-xl text-sm text-slate-500">
                Your portfolio overview. Keep building your wealth.
              </p>

              <div className="mt-5 flex items-center gap-2">
                <span className="h-[2px] w-7 bg-[#d9a441]" />
                <span className="h-[2px] w-3 bg-[#d9a441]" />
              </div>
            </div>

            <div className="hidden text-right lg:block">
              <p className="font-serif text-xl italic text-slate-300">
                Real Assets.
              </p>

              <p className="font-serif text-xl italic text-slate-300">
                Real Ownership.
              </p>

              <p className="font-serif text-xl italic text-slate-300">
                A Stronger Tomorrow.
              </p>

              <p className="mt-4 text-[10px] tracking-[0.25em] text-[#a98139]">
                — METALAN WEALTH
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">

          <StatCard
            icon={<BarChart3 size={19} />}
            title="TOTAL PORTFOLIO"
            value={`₣ ${totalPortfolio.toLocaleString()}`}
            sub="+18.5%"
            positive
          />

          <StatCard
            icon={<Coins size={19} />}
            title="AVAILABLE FAIX"
            value={availableAfterInvestment.toLocaleString()}
            sub="Wallet balance"
          />

          <StatCard
            icon={<Wallet size={19} />}
            title="INVESTED AMOUNT"
            value={`₣ ${invested.toLocaleString()}`}
            sub="Across all assets"
          />

          <StatCard
            icon={<TrendingUp size={19} />}
            title="TOTAL RETURNS"
            value="+18.5%"
            sub="₣ 2,200"
            positive
          />

          <StatCard
            icon={<Building2 size={19} />}
            title="PROPERTIES"
            value={propertyCount}
            sub="Owned assets"
          />

          <StatCard
            icon={<PieIcon size={19} />}
            title="FUND INVESTMENTS"
            value={fundCount}
            sub="Active funds"
          />
        </section>

        {/* =================================================
            CHART + ALLOCATION
        ================================================= */}

        <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.8fr_0.82fr]">

          {/* GRAPH */}

          <div className="dashboard-panel rounded-[24px] border border-white/[0.08] bg-[#0a0e0f] p-5 md:p-7">

            <div className="flex flex-col justify-between gap-5 md:flex-row">

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-2xl font-semibold">
                    Portfolio Growth
                  </h2>

                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    LIVE
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  Showing assets development comparing to baseline
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-[#131719] p-1">
                {["1D", "1W", "1M", "1Y"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => setPeriod(item)}
                      className={`rounded-full px-4 py-2 text-xs transition ${
                        period === item
                          ? "bg-[#e4b45e] text-[#10120f]"
                          : "text-slate-500 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mt-6 h-[330px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={chartData[period]}
                  margin={{
                    top: 15,
                    right: 10,
                    left: 5,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="goldArea"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#d9a441"
                        stopOpacity={0.28}
                      />

                      <stop
                        offset="100%"
                        stopColor="#d9a441"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke="#1c2526"
                  />

                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#596163",
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#596163",
                      fontSize: 10,
                    }}
                    tickFormatter={(value) =>
                      `₣${Math.round(
                        value / 1000
                      )}K`
                    }
                  />

                  <Tooltip
                    cursor={{
                      stroke: "#d9a441",
                      strokeDasharray: "4 5",
                    }}
                    content={<ChartTooltip />}
                  />

                  <Area
                    type="monotone"
                    dataKey="baseline"
                    stroke="#666f70"
                    strokeWidth={2}
                    strokeDasharray="4 6"
                    fill="none"
                    dot={false}
                  />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#e5b45c"
                    strokeWidth={3}
                    fill="url(#goldArea)"
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: "#e5b45c",
                      stroke: "#0a0e0f",
                      strokeWidth: 3,
                    }}
                    animationDuration={1100}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 flex justify-center gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#e5b45c]" />
                Portfolio Value
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-500" />
                Baseline
              </span>
            </div>
          </div>

          {/* DONUT */}

          <div className="dashboard-panel rounded-[24px] border border-white/[0.08] bg-[#0a0e0f] p-5 md:p-7">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold">
                  Asset Allocation
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  By asset type
                </p>
              </div>

              <button className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-2 text-xs text-slate-500">
                By Asset Type
                <ChevronDown size={13} />
              </button>
            </div>

            <div className="relative mt-5 h-[230px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Funds",
                        value: 45,
                      },
                      {
                        name: "Property",
                        value: 30,
                      },
                      {
                        name: "Exchange",
                        value: 25,
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={92}
                    paddingAngle={2}
                    stroke="none"
                    animationDuration={1000}
                  >
                    <Cell fill="#e5b45c" />
                    <Cell fill="#16bfd0" />
                    <Cell fill="#20b981" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-serif text-xl font-semibold">
                    ₣ {totalPortfolio.toLocaleString()}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-600">
                    Total Value
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2 space-y-3">
              <AllocationRow
                color="#e5b45c"
                name="Funds"
                percentage="45%"
                value="₣ 6,948"
              />

              <AllocationRow
                color="#16bfd0"
                name="Property"
                percentage="30%"
                value="₣ 4,632"
              />

              <AllocationRow
                color="#20b981"
                name="Exchange"
                percentage="25%"
                value="₣ 3,860"
              />
            </div>
          </div>
        </section>

        {/* =================================================
            CHART SUMMARY
        ================================================= */}

        <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MiniStat
            icon={<CircleDollarSign size={17} />}
            title="TOTAL REVENUE"
            value="₣ 245,800"
            sub="▲ +18.5% vs last year"
            positive
          />

          <MiniStat
            icon={<TrendingUp size={17} />}
            title="OVERALL GROWTH"
            value="+18.5%"
            sub="▲ Annualized return rate"
            positive
          />

          <MiniStat
            icon={<Coins size={17} />}
            title="AVG INVESTMENT"
            value="₣ 12,500"
            sub="Per asset position"
          />

          <MiniStat
            icon={<Activity size={17} />}
            title="PEAK VALUE"
            value="₣ 241,789"
            sub="Aug 2025 record high"
          />
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="dashboard-panel mt-4 overflow-hidden rounded-[22px] border border-[#70572f]/50 bg-[#0c0e0d]">

          <div className="flex flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="font-serif text-2xl font-semibold">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Take the next step in growing your wealth.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              <ActionButton
                gold
                icon={<TrendingUp size={17} />}
                text="Invest in Fund"
                onClick={() => setFundModal(true)}
              />

              <ActionButton
                icon={<Building2 size={17} />}
                text="Buy Property"
                onClick={() => setPropertyModal(true)}
              />

              <ActionButton
                icon={<Plus size={17} />}
                text="Add Funds"
                onClick={handleAddFunds}
              />

              <ActionButton
                icon={<ArrowLeftRight size={17} />}
                text="Exchange"
                onClick={() =>
                  alert("Exchange module coming next.")
                }
              />
            </div>
          </div>
        </section>

        {/* =================================================
            FUNDS + PROPERTIES
        ================================================= */}

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* FUNDS */}

          <div className="dashboard-panel rounded-[22px] border border-white/[0.08] bg-[#090d0e] p-5">

            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold">
                Investment Funds
              </h2>

              <button className="text-xs text-[#d9a441]">
                View All →
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {funds.map((fund) => {
                const Icon = fund.icon;

                return (
                  <div
                    key={fund.id}
                    className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#0c1112] p-4 transition hover:border-[#d9a441]/30"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium">
                        {fund.name}
                      </h3>

                      <div className="mt-1 flex gap-2">
                        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500">
                          {fund.category}
                        </span>

                        <span className="rounded-md bg-[#3a2c15] px-2 py-0.5 text-[10px] text-[#d9a441]">
                          {fund.risk}
                        </span>
                      </div>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-semibold text-emerald-400">
                        +{fund.growth}%
                      </p>

                      <p className="text-[10px] text-slate-600">
                        1Y Return
                      </p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-semibold">
                        ₣ {fund.nav}
                      </p>

                      <p className="text-[10px] text-slate-600">
                        NAV
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedFund(fund);
                        setFundModal(true);
                      }}
                      className="rounded-lg bg-[#e5b45c] px-4 py-2 text-xs font-semibold text-[#14150f] transition hover:bg-[#f1c976]"
                    >
                      Invest
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PROPERTIES */}

          <div className="dashboard-panel rounded-[22px] border border-white/[0.08] bg-[#090d0e] p-5">

            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold">
                Featured Properties
              </h2>

              <button className="text-xs text-[#d9a441]">
                View All →
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="flex gap-4 rounded-2xl border border-white/[0.07] bg-[#0c1112] p-3"
                >
                  <img
                    src={property.image}
                    alt={property.name}
                    className="h-[100px] w-[130px] rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium">
                      {property.name}
                    </h3>

                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                      <MapPin size={12} />
                      {property.location}
                    </p>

                    <div className="mt-4 flex items-center gap-6">
                      <div>
                        <p className="text-[10px] text-slate-600">
                          Property Value
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          ₣ {property.price.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-600">
                          Token Value
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {property.tokenValue} FAIX
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        setSelectedProperty(property);
                        setPropertyModal(true);
                      }}
                      className="rounded-lg bg-[#e5b45c] px-4 py-2 text-xs font-semibold text-[#14150f] hover:bg-[#f1c976]"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            TRANSACTIONS + SUMMARY
        ================================================= */}

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.65fr_0.85fr]">

          {/* TRANSACTIONS */}

          <div className="dashboard-panel rounded-[22px] border border-white/[0.08] bg-[#090d0e] p-5">

            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold">
                Recent Transactions
              </h2>

              <button className="text-xs text-[#d9a441]">
                View All →
              </button>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-white/[0.07] text-left text-[10px] uppercase tracking-wider text-slate-600">
                    <th className="pb-3">Asset</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions
                    .slice(0, 6)
                    .map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-white/[0.05]"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171c1d] text-[#d9a441]">
                              {transaction.type ===
                              "Property Purchase" ? (
                                <Building2 size={15} />
                              ) : transaction.type ===
                                "Deposit" ? (
                                <Wallet size={15} />
                              ) : (
                                <Landmark size={15} />
                              )}
                            </div>

                            <span className="text-xs font-medium">
                              {transaction.name}
                            </span>
                          </div>
                        </td>

                        <td className="text-xs text-slate-600">
                          {transaction.type}
                        </td>

                        <td className="text-xs">
                          ₣ {transaction.amount.toLocaleString()}
                        </td>

                        <td className="text-xs text-slate-600">
                          {transaction.date}
                        </td>

                        <td>
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-400">
                            <CheckCircle2 size={10} />
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SUMMARY */}

          <div className="dashboard-panel rounded-[22px] border border-white/[0.08] bg-[#090d0e] p-5">

            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold">
                Portfolio Summary
              </h2>

              <button className="flex items-center gap-1 text-xs text-slate-500">
                This month
                <ChevronDown size={12} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <SummaryRow
                label="Starting Balance"
                value="₣ 13,240"
              />

              <SummaryRow
                label="Total Deposits"
                value="₣ 2,000"
                green
              />

              <SummaryRow
                label="Total Investments"
                value="- ₣ 1,800"
                red
              />

              <div className="border-t border-white/[0.07] pt-4">
                <SummaryRow
                  label="Current Balance"
                  value={`₣ ${balance.toLocaleString()}`}
                  strong
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400">
                <TrendingUp size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  You're up 18.5% this month
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Your portfolio is performing well.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FUND MODAL
      ===================================================== */}

      {fundModal && (
        <Modal onClose={() => setFundModal(false)}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
            Fund Investment
          </p>

          <h2 className="mt-2 font-serif text-2xl font-semibold">
            {selectedFund.name}
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            {selectedFund.category} • {selectedFund.risk} Risk
          </p>

          <div className="mt-6 rounded-2xl border border-white/[0.06] bg-[#090d0e] p-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">
                Current NAV
              </span>

              <span className="font-semibold">
                ₣ {selectedFund.nav}
              </span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-sm text-slate-600">
                1Y Growth
              </span>

              <span className="text-emerald-400">
                +{selectedFund.growth}%
              </span>
            </div>
          </div>

          <label className="mt-6 block text-sm text-slate-400">
            Investment Amount
          </label>

          <input
            type="number"
            min="1"
            value={fundAmount}
            onChange={(e) =>
              setFundAmount(e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#080c0d] px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.06] p-4">
              <p className="text-xs text-slate-600">
                Estimated Units
              </p>

              <p className="mt-2 text-lg font-semibold text-cyan-400">
                {units.toFixed(2)}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] p-4">
              <p className="text-xs text-slate-600">
                Available FAIX
              </p>

              <p className="mt-2 text-lg font-semibold">
                {balance.toLocaleString()}
              </p>
            </div>
          </div>

        <button
  onClick={handleFundPurchase}
  disabled={processing}
  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e5b45c] py-3 font-semibold text-[#14150f] transition hover:bg-[#f1c976] disabled:cursor-not-allowed disabled:opacity-60"
>
  {processing ? (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#14150f] border-t-transparent" />
      Processing Investment...
    </>
  ) : (
    <>
      <ShieldCheck size={17} />
      Confirm Investment
    </>
  )}
</button>
        </Modal>
      )}

      {/* =====================================================
          PROPERTY MODAL
      ===================================================== */}

      {propertyModal && (
        <Modal onClose={() => setPropertyModal(false)}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
            Property Purchase
          </p>

          <h2 className="mt-2 font-serif text-2xl font-semibold">
            {selectedProperty.name}
          </h2>

          <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
            <MapPin size={13} />
            {selectedProperty.location}
          </p>

          <img
            src={selectedProperty.image}
            alt={selectedProperty.name}
            className="mt-5 h-40 w-full rounded-2xl object-cover"
          />

          <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[#090d0e] p-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">
                Property Value
              </span>

              <span className="font-semibold">
                ₣ {selectedProperty.price.toLocaleString()}
              </span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-sm text-slate-600">
                Token Value
              </span>

              <span className="font-semibold">
                {selectedProperty.tokenValue} FAIX
              </span>
            </div>
          </div>

          <label className="mt-5 block text-sm text-slate-400">
            FAIX Tokens
          </label>

          <input
            type="number"
            min="1"
            value={propertyTokens}
            onChange={(e) =>
              setPropertyTokens(e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#080c0d] px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.06] p-4">
            <span className="text-sm text-slate-600">
              Purchase Amount
            </span>

            <span className="font-semibold text-cyan-400">
              {propertyCost} FAIX
            </span>
          </div>

          <button
            onClick={handlePropertyPurchase}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e5b45c] py-3 font-semibold text-[#14150f] transition hover:bg-[#f1c976]"
          >
            <ShieldCheck size={17} />
            Confirm Purchase
          </button>
        </Modal>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  title,
  value,
  sub,
  positive,
}) {
  return (
    <div className="stat-card group rounded-2xl border border-white/[0.08] bg-[#090d0e] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#d9a441]/25">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.08] text-cyan-400 transition group-hover:bg-cyan-400/[0.14]">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-[10px] tracking-wider text-slate-600">
        {title}
      </p>

      <p className="mt-2 text-xl font-semibold md:text-2xl">
        {value}
      </p>

      <p
        className={`mt-1 text-[11px] ${
          positive
            ? "text-emerald-400"
            : "text-slate-600"
        }`}
      >
        {positive && "▲ "}
        {sub}
      </p>
    </div>
  );
}

/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({
  icon,
  title,
  value,
  sub,
  positive,
}) {
  return (
    <div className="dashboard-panel rounded-2xl border border-white/[0.08] bg-[#090d0e] p-5">
      <div className="flex items-center gap-2 text-slate-600">
        {icon}

        <span className="text-[10px] tracking-wider">
          {title}
        </span>
      </div>

      <p className="mt-4 text-xl font-semibold">
        {value}
      </p>

      <p
        className={`mt-2 text-xs ${
          positive
            ? "text-emerald-400"
            : "text-slate-600"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}

/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({
  icon,
  text,
  onClick,
  gold,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-xs font-medium transition ${
        gold
          ? "border-[#e5b45c] bg-[#e5b45c] text-[#15150f] hover:bg-[#f1c976]"
          : "border-white/[0.09] bg-[#0c1112] text-slate-300 hover:border-cyan-400/30 hover:text-white"
      }`}
    >
      {icon}
      {text}
    </button>
  );
}

/* =========================================================
   ALLOCATION
========================================================= */

function AllocationRow({
  color,
  name,
  percentage,
  value,
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: color }}
        />

        <span className="text-sm text-slate-400">
          {name}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <span className="text-sm font-medium">
          {percentage}
        </span>

        <span className="text-xs text-slate-600">
          {value}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function SummaryRow({
  label,
  value,
  green,
  red,
  strong,
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${
          strong
            ? "font-medium text-white"
            : "text-slate-600"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-sm ${
          green
            ? "text-emerald-400"
            : red
            ? "text-red-400"
            : strong
            ? "font-semibold"
            : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   TOOLTIP
========================================================= */

function ChartTooltip({
  active,
  payload,
  label,
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const value = payload.find(
    (item) => item.dataKey === "value"
  )?.value;

  return (
    <div className="rounded-2xl border border-[#70572f] bg-[#111116] px-5 py-4 shadow-2xl">
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label} 2025
      </p>

      <p className="mt-2 text-xl font-semibold">
        ₣ {Number(value).toLocaleString()}
      </p>

      <p className="mt-1 flex items-center gap-1 text-sm text-emerald-400">
        <ArrowUpRight size={14} />
        +18.5%
      </p>
    </div>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  children,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[26px] border border-white/[0.09] bg-[#0a0e0f] p-6 shadow-2xl">
        <div className="mb-1 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-white/[0.04] hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}