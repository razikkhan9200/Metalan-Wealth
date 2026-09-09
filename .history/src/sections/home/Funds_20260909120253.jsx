import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const funds = [
  {
    title: "Metalan Real Estate Growth Fund",
    manager: "Sarah Chen, CFA",
    avatar: "/images/Funds-images/mgr-avatar-1.png",
    returnValue: "18.4% 1Y",
    aum: "$12.4M",
    risk: "Moderate",
    points:
      "0,56 38,48 76,54 114,40 152,48 190,24 228,32 266,15 304,20 342,6",
  },
  {
    title: "Global Forex Alpha Fund",
    manager: "James Robertson",
    avatar: "/images/Funds-images/mgr-avatar-2.png",
    returnValue: "24.1% 1Y",
    aum: "$8.7M",
    risk: "High",
    points:
      "0,56 38,48 76,54 114,40 152,48 190,24 228,32 266,15 304,20 342,6",
  },
  {
    title: "Stable Income Fund",
    manager: "Priya Sharma",
    avatar: "/images/Funds-images/mgr-avatar-3.png",
    returnValue: "9.2% 1Y",
    aum: "$22.1M",
    risk: "Low",
    points:
      "0,56 38,48 76,54 114,40 152,48 190,24 228,32 266,15 304,20 342,6",
  },
];

export default function Funds() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none play reverse",
        },
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".funds-heading", {
        y: 40,
        opacity: 0,
        duration: 0.9,
      })
        .from(
          ".funds-description",
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".fund-card",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
          },
          "-=0.4"
        )
        .from(
          ".fund-comparison",
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[820px] overflow-hidden bg-[#0A0A0A] text-white"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/Funds-images/funds-bg-export.png')",
        }}
      />

      <div className="absolute inset-0 bg-[#0A0A0A]/90" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-5 sm:py-12 md:px-6 md:py-14 lg:px-10 lg:py-16 xl:px-20">
        <div className="w-full">
          <h2 className="funds-heading font-['Instrument_Serif'] text-[30px] font-normal leading-[1.05] tracking-normal text-[#FFFFFF] sm:text-[36px] lg:text-[44px] xl:text-[48px]">
            Expert-Managed Funds — Forex, Real Estate & Beyond
          </h2>

          <p className="funds-description mt-[14px] max-w-[800px] text-[14px] leading-[1.5] text-[#8F9A96] sm:text-[15px] lg:text-[16px]">
            Secure passive growth via automated indices curated by our tier-1
            asset management desks.
          </p>
        </div>

       <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 lg:mt-[40px] lg:grid-cols-3">
          {funds.map((fund) => (
            <div
              key={fund.title}
              className="fund-card h-auto min-h-[340px] w-full rounded-[18px] border border-[#D4A853]/25 bg-[#121614]/[0.8784] p-4 sm:p-5 lg:h-[350px]"
            >
              <h3 className="font-['Instrument_Serif'] text-[19px] font-normal leading-[1.15] text-[#FFFFFF] sm:text-[21px]">
                {fund.title}
              </h3>

              <div className="mt-[12px] flex items-center gap-[10px]">
                <img
                  src={fund.avatar}
                  alt={fund.manager}
                  className="h-[30px] w-[30px] rounded-full object-cover"
                />

                <span className="text-[13px] font-normal text-[#8F9A96]">
                  {fund.manager}
                </span>
              </div>

              <div className="mt-[19px]">
                <svg
                  viewBox="0 0 342 70"
                  className="h-[70px] w-full"
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

                <p className="mt-[1px] text-center text-[11px] leading-[1.2] text-[#8F9A96]">
                  1-Year Performance Trend
                </p>
              </div>

              <div className="mt-[16px] space-y-[8px]">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-normal text-[#8F9A96]">
                    1Y Return
                  </span>

                  <span className="font-mono text-[13px] font-semibold text-[#00D4AA]">
                    {fund.returnValue}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-normal text-[#8F9A96]">
                    Fund AUM
                  </span>

                  <span className="font-mono text-[13px] font-normal text-[#FFFFFF]">
                    {fund.aum}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-normal text-[#8F9A96]">
                    Risk Level
                  </span>

                  <span className="text-[13px] font-normal text-[#D4A853]">
                    {fund.risk}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="mt-[14px] flex h-[41px] w-full items-center justify-center rounded-[8px] border border-[#D4A853] bg-[#0A0A0A]/55 px-0 py-[12px] text-[13px] font-medium text-[#D4A853]"
              >
                View Fund Details
              </button>
            </div>
          ))}
        </div>

        <div className="fund-comparison mt-8 w-full rounded-[16px] border border-white/[0.08] bg-[#121614]/80 px-4 py-4 sm:mt-[39px] sm:px-[16px] sm:py-[17px]">
          <h3 className="font-['Instrument_Serif'] text-[18px] font-normal text-[#D4A853]">
            Fund Comparison Index
          </h3>

          <div className="mt-[13px] grid grid-cols-1 gap-3 text-[13px] font-normal text-[#8F9A96] md:grid-cols-3">
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