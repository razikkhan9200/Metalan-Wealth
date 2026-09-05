export default function Tokenization() {
  const steps = [
    {
      number: "1",
      title: "Property Acquisition",
      text: "Metalan acquires premium verified properties worldwide",
    },
    {
      number: "2",
      title: "Legal Structuring",
      text: "SPV creation, regulatory compliance, title verification",
    },
    {
      number: "3",
      title: "Token Generation",
      text: "Property value divided into FAIX-denominated digital tokens",
    },
    {
      number: "4",
      title: "Investor Distribution",
      text: "Tokens available for purchase starting from ₣500",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 bg-[#0A0A0A]/95" />

      <div className="relative z-10 mx-auto max-w-[1480px] px-6 py-16 sm:px-10 lg:px-20 lg:py-20">
        <div className="max-w-[1320px]">
          <h2 className="font-['Instrument_Serif'] text-[48px] font-normal leading-none tracking-normal text-[#FFFFFF]">
            Own Premium Real Estate — One Token at a Time
          </h2>

          <p className="mt-5 max-w-[850px] text-[15px] leading-[1.45] text-[#8F9A96]">
            Metalan Wealth lowers the barrier to prime global property assets
            through regulatory-compliant SPV
            <br />
            fractional tokenization. Secure physical yield on-chain.
          </p>

          <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[370px_minmax(0,1fr)_440px] lg:gap-10">
            <div className="h-[465px] w-full overflow-hidden rounded-[24px] bg-[#121614]">
              <div className="h-full w-full bg-[radial-gradient(circle_at_50%_28%,#F4D9C3_0%,#D8B8A2_35%,#96715F_70%,#4C4039_100%)]" />
            </div>

            <div className="flex flex-col gap-6">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-[#D4A853] bg-[#1A3C34] text-[14px] font-medium text-[#D4A853]">
                    {step.number}
                  </div>

                  <div className="pt-0.5">
                    <h3 className="font-['Instrument_Serif'] text-[20px] font-normal leading-[1.2] text-[#FFFFFF]">
                      {step.title}
                    </h3>

                    <p className="mt-1 text-[13px] leading-[1.45] text-[#8F9A96]">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-[430px] w-[440px] max-w-full rounded-[24px] border border-[#D4A853] bg-[#121614]/[0.8784] p-[24px] shadow-[0_4px_24px_0_#D4A853]">
              <div className="h-[150px] w-full overflow-hidden rounded-[12px] bg-[#121614]">
                <div className="h-full w-full bg-[linear-gradient(135deg,#D89A73_0%,#D6A07E_35%,#6F805C_70%,#304C36_100%)]" />
              </div>

              <div className="mt-[20px]">
                <h3 className="font-['Instrument_Serif'] text-[22px] font-normal leading-[1.1] text-[#FFFFFF]">
                  Marina Bay Tower, Dubai
                </h3>

                <div className="mt-[8px] flex items-center justify-between">
                  <span className="text-[11px] font-normal text-[#8F9A96]">
                    Total Value: $2.4M
                  </span>

                  <span className="text-[11px] font-normal text-[#D4A853]">
                    Token Cost: ₣500
                  </span>
                </div>

                <div className="mt-[16px] flex items-center justify-between">
                  <span className="text-[11px] font-normal text-[#8F9A96]">
                    3,200 of 4,800 sold
                  </span>

                  <span className="text-[11px] font-normal text-[#00D4AA]">
                    67% Funded
                  </span>
                </div>

                <div className="mt-[6px] h-[5px] w-full overflow-hidden rounded-full bg-[#26312D]">
                  <div className="h-full w-[67%] rounded-full bg-[#D4A853]" />
                </div>

                <div className="mt-[16px] flex items-start justify-between">
                  <div>
                    <p className="text-[10px] text-[#8F9A96]">
                      Est. Yield
                    </p>

                    <p className="mt-[3px] font-mono text-[16px] font-semibold text-[#00D4AA]">
                      8.2% p.a.
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-[#8F9A96]">
                      Next Payout
                    </p>

                    <p className="mt-[3px] font-mono text-[12px] text-[#FFFFFF]">
                      Monthly (FAIX)
                    </p>
                  </div>
                </div>

                    <button
                     type="button"
                     className="mt-[16px] flex h-[46px] w-full items-center justify-center rounded-[12px] bg-[#D4A853] text-[14px] font-[700] text-[#0A0A0A]"
                      >
                     Invest Now
                   </button>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-[16px] border border-white/[0.08] bg-[#111513] px-5 py-5">
              <h3 className="font-['Instrument_Serif'] text-[20px] font-normal text-[#D4A853]">
                Fractional Access
              </h3>

              <p className="mt-3 text-[13px] leading-[1.5] text-[#8F9A96]">
                Invest from just ₣500 in institutional real estate portfolios.
              </p>
            </div>

            <div className="rounded-[16px] border border-white/[0.08] bg-[#111513] px-5 py-5">
              <h3 className="font-['Instrument_Serif'] text-[20px] font-normal text-[#D4A853]">
                Passive Yield
              </h3>

              <p className="mt-3 text-[13px] leading-[1.5] text-[#8F9A96]">
                Earn quarterly or monthly rental dividends sent directly to
                your FAIX wallet.
              </p>
            </div>

            <div className="rounded-[16px] border border-white/[0.08] bg-[#111513] px-5 py-5">
              <h3 className="font-['Instrument_Serif'] text-[20px] font-normal text-[#D4A853]">
                Instant Liquidity
              </h3>

              <p className="mt-3 text-[13px] leading-[1.5] text-[#8F9A96]">
                Buy, sell, or swap your fractions 24/7 on the Metalan Token
                Exchange.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}