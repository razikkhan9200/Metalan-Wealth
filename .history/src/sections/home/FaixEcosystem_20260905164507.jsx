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

        <div className="mt-[40px] grid grid-cols-[480px_1fr] gap-[48px]">
          <div className="h-[320px] w-[480px] overflow-hidden rounded-[16px] border border-[#D4A853]/30 bg-[#111513]">
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,170,0.16),transparent_42%)]" />

              <div className="absolute h-[220px] w-[220px] rounded-full border-[3px] border-[#D4A853] bg-[#12382F] shadow-[0_0_35px_rgba(212,168,83,0.6)]" />

              <div className="absolute h-[190px] w-[190px] rounded-full border border-[#00D4AA]/30" />

              <div className="absolute h-[150px] w-[150px] rounded-full border border-[#D4A853]/20" />

              <div className="absolute left-[-20px] right-[-20px] top-[92px] h-[100px] bg-[repeating-radial-gradient(ellipse_at_center,rgba(212,168,83,0.55)_0_1px,transparent_1px_8px)] opacity-60" />
            </div>
          </div>

          <div className="flex flex-col justify-center gap-[16px]">
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

              <p className="mt-[7px] font-mono text-[12px] font-semibold text-[#D4A853]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}