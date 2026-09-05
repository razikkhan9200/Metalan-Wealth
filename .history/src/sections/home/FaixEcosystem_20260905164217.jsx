export default function FaixEcosystem() {
  const details = [
    {
      title: "Investment Currency",
      text: "Use FAIX to invest in physical property fractions and fund pools seamlessly.",
    },
    {
      title: "Staking Rewards",
      text: "Earn up to 5.2% APY system-wide by locking FAIX into reserve vaults.",
    },
    {
      title: "Governance Rights",
      text: "Vote on curated syndicate asset purchases and real-estate listings.",
    },
    {
      title: "E-Commerce Luxury Portal",
      text: "Purchase physical tier-1 assets directly using the system FAIX liquidity.",
    },
  ];

  const metrics = [
    ["Circulating Supply", "120M FAIX"],
    ["Total Supply", "500M FAIX"],
    ["Market Cap", "$96.0M USD"],
    ["24h Volume", "$2.1M USD"],
    ["Current Price", "$0.80 FAIX"],
    ["All-Time High", "$1.24 FAIX"],
  ];

  const stats = [
    {
      value: "$2.4B+",
      title: "Total Assets Tokenized",
      text: "Premium assets globally",
    },
    {
      value: "12,400+",
      title: "Global Active Investors",
      text: "Diversified in multiple funds",
    },
    {
      value: "8.2%",
      title: "Average Annual Yield",
      text: "Outperforming commercial baselines",
    },
    {
      value: "99.9%",
      title: "Platform Uptime Index",
      text: "Redundant validator ledger",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-[80px] lg:px-[80px]">
        <div className="flex flex-col gap-[40px]">
          <h2 className="font-['Instrument_Serif'] text-[48px] font-normal leading-[1.05] text-[#FFFFFF]">
            FAIX — The Currency of Tokenized Wealth
          </h2>

          <div className="grid items-center gap-[40px] lg:grid-cols-[1fr_1fr]">
            <div className="flex h-[170px] items-center justify-center overflow-hidden rounded-[16px] border border-[#D4A853]/25 bg-[#121614]">
              <div className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full border border-[#D4A853] bg-[#12352D] shadow-[0_0_30px_rgba(212,168,83,0.45)]">
                <div className="absolute inset-[12px] rounded-full border border-[#00D4AA]/40" />

                <span className="font-serif text-[34px] text-[#D4A853]">
                  F
                </span>
              </div>
            </div>

            <div className="grid gap-[12px]">
              {details.map((item) => (
                <div key={item.title}>
                  <h3 className="font-['Instrument_Serif'] text-[17px] font-normal text-[#D4A853]">
                    {item.title}
                  </h3>

                  <p className="mt-[3px] text-[12px] leading-[1.45] text-[#8F9A96]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3 lg:grid-cols-6">
            {metrics.map(([label, value]) => (
              <div
                key={label}
                className="rounded-[8px] border border-white/[0.08] bg-[#121614] px-[12px] py-[11px]"
              >
                <p className="text-[9px] text-[#8F9A96]">
                  {label}
                </p>

                <p className="mt-[4px] font-mono text-[11px] font-semibold text-[#D4A853]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[48px] grid grid-cols-2 gap-[40px] lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title}>
              <p className="font-['Instrument_Serif'] text-[38px] font-normal leading-none text-[#D4A853]">
                {stat.value}
              </p>

              <h3 className="mt-[10px] text-[11px] font-semibold text-[#FFFFFF]">
                {stat.title}
              </h3>

              <p className="mt-[3px] text-[10px] text-[#8F9A96]">
                {stat.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[38px] flex flex-wrap items-center justify-center gap-[32px] text-[9px] text-[#8F9A96]">
          <span>AS FEATURED IN:</span>
          <span>Bloomberg</span>
          <span>Forbes</span>
          <span>TechCrunch</span>
          <span>CoinDesk</span>
        </div>
      </div>
    </section>
  );
}