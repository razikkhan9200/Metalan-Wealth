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
      text: "Vote on crucial syndicate asset purchases and real-estate listings.",
    },
    {
      title: "E-Commerce Luxury Portal",
      text: "Procure physical tier-1 assets directly using the system FAIX liquidity.",
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

  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#0A0A0A] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-[80px] py-[80px]">
        <h2 className="font-['Instrument_Serif'] text-[48px] font-normal leading-[1.05] text-[#FFFFFF]">
          FAIX — The Currency of Tokenized Wealth
        </h2>

        <div className="mt-[40px] grid grid-cols-[480px_1fr] items-center gap-[48px]">
          <div className="relative h-[320px] w-[480px] overflow-hidden rounded-[16px]">
            <img
              src="/images/faix-coin-bg-export.png"
              alt="FAIX token visualization"
              className="h-full w-full object-cover"
            />

            <div className="absolute left-1/2 top-1/2 h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#D4A853] bg-[#1A3C34]/80 shadow-[0_0_40px_0_#D4A853]" />
          </div>

          <div className="flex flex-col gap-[16px]">
            {details.map((item) => (
              <div key={item.title}>
                <h3 className="font-['Instrument_Serif'] text-[17px] font-normal leading-[1.1] text-[#D4A853]">
                  {item.title}
                </h3>

                <p className="mt-[5px] max-w-[690px] text-[13px] leading-[1.45] text-[#8F9A96]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[40px] grid grid-cols-2 gap-[16px] md:grid-cols-3 lg:grid-cols-6">
          {metrics.map(([label, value]) => (
            <div
              key={label}
              className="h-[70px] rounded-[8px] border border-white/[0.08] bg-[#121614] px-[14px] py-[12px]"
            >
              <p className="text-[9px] leading-[1.2] text-[#8F9A96]">
                {label}
              </p>

              <p className="mt-[7px] font-mono text-[16px] font-semibold text-[#D4A853]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}