const funds = [
  {
    title: "Metalan Real Estate Growth Fund",
    manager: "Sarah Chen, CFA",
    returnValue: "18.4% 1Y",
    aum: "$12.4M",
    risk: "Moderate",
    points: "0,56 38,48 76,54 114,40 152,48 190,24 228,32 266,15 304,20 342,6",
  },
  {
    title: "Global Forex Alpha Fund",
    manager: "James Robertson",
    returnValue: "24.1% 1Y",
    aum: "$8.7M",
    risk: "High",
    points: "0,56 38,48 76,54 114,40 152,48 190,24 228,32 266,15 304,20 342,6",
  },
  {
    title: "Stable Income Fund",
    manager: "Priya Sharma",
    returnValue: "9.2% 1Y",
    aum: "$22.1M",
    risk: "Low",
    points: "0,56 38,48 76,54 114,40 152,48 190,24 228,32 266,15 304,20 342,6",
  },
];

export default function Funds() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] py-20 text-white lg:py-[80px]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(10,10,10,0.94),rgba(10,10,10,0.97))]" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 lg:px-0">
        <div className="mb-10">
          <h2 className="font-['Instrument_Serif'] text-[48px] font-normal leading-[1.05] text-[#FFFFFF]">
            Expert-Managed Funds — Forex, Real Estate & Beyond
          </h2>

          <p className="mt-5 text-[16px] leading-6 text-[#8F9A96]">
            Secure passive growth via automated indices curated by our tier-1
            asset management desks.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {funds.map((fund) => (
            <div
              key={fund.title}
              className="rounded-[20px] border border-[#D4A853]/30 bg-[#121614] p-6"
            >
              <h3 className="font-['Instrument_Serif'] text-[23px] font-normal text-[#FFFFFF]">
                {fund.title}
              </h3>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-[30px] w-[30px] rounded-full bg-[#26352F]" />

                <span className="text-[13px] text-[#8F9A96]">
                  {fund.manager}
                </span>
              </div>

              <div className="mt-7">
                <svg
                  viewBox="0 0 342 70"
                  className="h-[70px] w-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <polyline
                    points={fund.points}
                    fill="none"
                    stroke="#00D4AA"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <p className="mt-1 text-center text-[11px] text-[#8F9A96]">
                  1-Year Performance Trend
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#8F9A96]">
                    1Y Return
                  </span>

                  <span className="font-mono text-[13px] font-semibold text-[#00D4AA]">
                    {fund.returnValue}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#8F9A96]">
                    Fund AUM
                  </span>

                  <span className="font-mono text-[13px] text-[#FFFFFF]">
                    {fund.aum}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#8F9A96]">
                    Risk Level
                  </span>

                  <span className="text-[13px] text-[#D4A853]">
                    {fund.risk}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="mt-5 flex h-[42px] w-full items-center justify-center rounded-[10px] border border-[#D4A853] bg-transparent text-[13px] font-semibold text-[#D4A853]"
              >
                View Fund Details
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[16px] border border-white/[0.08] bg-[#121614]/80 px-4 py-5 lg:px-4">
          <h3 className="font-['Instrument_Serif'] text-[18px] text-[#D4A853]">
            Fund Comparison Index
          </h3>

          <div className="mt-4 grid gap-4 text-[13px] text-[#8F9A96] md:grid-cols-3">
            <span>RE Growth: 18.4% Est IRR</span>
            <span className="md:text-center">
              Forex Alpha: 24.1% Est IRR
            </span>
            <span className="md:text-right">
              Stable Income: 9.2% Est IRR
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}