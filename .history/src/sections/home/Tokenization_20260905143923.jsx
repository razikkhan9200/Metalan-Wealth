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
    <section className="relative overflow-hidden bg-[#0A0A0A] px-6 py-20 text-white lg:px-20 lg:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(10,10,10,0.92),rgba(10,10,10,0.96))]" />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <div className="max-w-[820px]">
          <h2 className="font-serif text-[42px] leading-[1.1] text-[#F1EEE7] sm:text-[50px] lg:text-[56px]">
            Own Premium Real Estate — One Token at a Time
          </h2>

          <p className="mt-5 max-w-[760px] text-[15px] leading-7 text-[#8F9A96] sm:text-[16px]">
            Metalan Wealth lowers the barrier to prime global property assets
            through regulatory-compliant SPV fractional tokenization. Secure
            physical yield on-chain.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[370px_1fr_430px]">
          <div className="h-[465px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#BBAFA8] via-[#E6C9B6] to-[#A47E68]">
            <div className="flex h-full items-end justify-center bg-[radial-gradient(circle_at_65%_25%,rgba(255,235,210,0.75),transparent_30%),linear-gradient(180deg,rgba(255,200,150,0.18),rgba(0,0,0,0.16))]">
              <div className="mb-[-20px] h-[180px] w-[85%] rounded-t-[120px] bg-white/20 blur-[2px]" />
            </div>
          </div>

          <div className="space-y-7">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-4">
                <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-[#D4A853] bg-[#1A3C34] text-[14px] font-semibold text-[#D4A853]">
                  {step.number}
                </div>

                <div>
                  <h3 className="font-serif text-[20px] text-[#F1EEE7]">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-[13px] leading-6 text-[#8F9A96]">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border border-[#D4A853] bg-[#121614] p-[22px] shadow-[0_0_24px_rgba(212,168,83,0.25)]">
            <div className="h-[150px] overflow-hidden rounded-[14px] bg-gradient-to-br from-[#D69A73] via-[#E9C39D] to-[#365B45]">
              <div className="h-full w-full bg-[linear-gradient(135deg,transparent_20%,rgba(0,0,0,0.18)),radial-gradient(circle_at_75%_20%,rgba(255,240,215,0.7),transparent_25%)]" />
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <h3 className="font-serif text-[22px] text-[#F1EEE7]">
                Marina Bay Tower, Dubai
              </h3>
            </div>

            <div className="mt-3 flex items-center justify-between text-[13px]">
              <span className="text-[#8F9A96]">Total Value: $2.4M</span>
              <span className="text-[#D4A853]">Token Cost: ₣500</span>
            </div>

            <div className="mt-6 flex items-center justify-between text-[12px] text-[#8F9A96]">
              <span>3,200 of 4,800 sold</span>
              <span className="text-[#00D4AA]">67% Funded</span>
            </div>

            <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#25302C]">
              <div className="h-full w-[67%] rounded-full bg-[#D4A853]" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-[#8F9A96]">Est. Yield</p>
                <p className="mt-1 font-mono text-[17px] font-semibold text-[#00D4AA]">
                  8.2% p.a.
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-[#8F9A96]">Next Payout</p>
                <p className="mt-1 font-mono text-[14px] text-[#F1EEE7]">
                  Monthly (FAIX)
                </p>
              </div>
            </div>

            <button className="mt-6 flex h-[45px] w-full items-center justify-center rounded-[12px] bg-[#D4A853] text-[14px] font-semibold text-[#0A0A0A]">
              Invest Now
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          <div className="rounded-[16px] border border-white/[0.08] bg-[#111513] p-6">
            <h3 className="font-serif text-[20px] text-[#D4A853]">
              Fractional Access
            </h3>

            <p className="mt-3 text-[13px] leading-6 text-[#8F9A96]">
              Invest from just ₣500 in institutional real estate portfolios.
            </p>
          </div>

          <div className="rounded-[16px] border border-white/[0.08] bg-[#111513] p-6">
            <h3 className="font-serif text-[20px] text-[#D4A853]">
              Passive Yield
            </h3>

            <p className="mt-3 text-[13px] leading-6 text-[#8F9A96]">
              Earn quarterly or monthly rental dividends sent directly to your
              FAIX wallet.
            </p>
          </div>

          <div className="rounded-[16px] border border-white/[0.08] bg-[#111513] p-6">
            <h3 className="font-serif text-[20px] text-[#D4A853]">
              Instant Liquidity
            </h3>

            <p className="mt-3 text-[13px] leading-6 text-[#8F9A96]">
              Buy, sell, or swap your fractions 24/7 on the Metalan Token
              Exchange.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}