import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Tokenization() {
  const sectionRef = useRef(null);

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

      tl.from(".tokenization-heading", {
        y: 35,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          ".tokenization-description",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.45"
        )
        .from(
          ".tokenization-visual",
          {
            x: -30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.35"
        )
        .from(
          ".tokenization-step",
          {
            x: 25,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.5"
        )
        .from(
          ".tokenization-card",
          {
            x: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          ".tokenization-benefit",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0A0A0A] text-white"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/Tokenization-Images/tokenization-bg-export.png')",
        }}
      />

      <div className="absolute inset-0 bg-[#0A0A0A]/90" />

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-16 lg:px-10 lg:py-20 xl:px-16 2xl:px-20">
        <div className="mx-auto w-full max-w-[1320px]">
          <h2 className="tokenization-heading max-w-[1100px] font-['Instrument_Serif'] text-[clamp(30px,3.2vw,48px)] font-normal leading-[1.05] tracking-normal text-[#FFFFFF]">
            Own Premium Real Estate — One Token at a Time
          </h2>

          <p className="tokenization-description mt-4 max-w-[850px] text-[13px] leading-[1.55] text-[#8F9A96] sm:mt-5 sm:text-[14px] lg:text-[15px]">
            Metalan Wealth lowers the barrier to prime global property assets
            through regulatory-compliant SPV fractional tokenization. Secure
            physical yield on-chain.
          </p>

          <div className="tokenization-main mt-8 grid grid-cols-1 gap-8 sm:mt-10 lg:grid-cols-2 lg:gap-8 min-[1200px]:grid-cols-[minmax(300px,370px)_minmax(300px,420px)_minmax(360px,440px)] min-[1200px]:gap-8 xl:gap-10">
            {/* Image */}
            <div className="tokenization-visual h-[300px] w-full overflow-hidden rounded-[24px] bg-[#121614] sm:h-[380px] md:h-[420px] lg:h-[460px] min-[1200px]:h-[520px] xl:h-[592px]">
              <img
                src="/images/Tokenization-Images/isometric-visual.png"
                alt="Premium real estate"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Steps */}
            <div className="flex w-full max-w-full flex-col gap-5 sm:gap-6 min-[1200px]:h-auto min-[1200px]:gap-7">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="tokenization-step flex min-h-[44px] w-full items-start gap-3 sm:gap-4"
                >
                  <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-[#D4A853] bg-[#1A3C34] text-[13px] font-medium text-[#D4A853] sm:h-[36px] sm:w-[36px] sm:text-[14px]">
                    {step.number}
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <h3 className="font-['Instrument_Serif'] text-[17px] font-normal leading-[1.2] text-[#FFFFFF] sm:text-[18px]">
                      {step.title}
                    </h3>

                    <p className="mt-1 max-w-full text-[12px] leading-[1.35] text-[#8F9A96] sm:text-[13px]">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Property Card */}
            <div className="tokenization-card w-full rounded-[24px] border border-[#D4A853] bg-[#121614]/[0.8784] p-4 shadow-[0_4px_24px_0_#D4A853] sm:p-5 md:p-6 lg:col-span-2 min-[1200px]:col-span-1 min-[1200px]:h-[430px] min-[1200px]:w-full">
              <div className="h-[150px] w-full overflow-hidden rounded-[12px] bg-[#121614] sm:h-[160px]">
                <img
                  src="/images/Tokenization-Images/card-img.png"
                  alt="Marina Bay Tower, Dubai"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-5">
                <h3 className="font-['Instrument_Serif'] text-[20px] font-normal leading-[1.1] text-[#FFFFFF] sm:text-[22px]">
                  Marina Bay Tower, Dubai
                </h3>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-[#8F9A96] sm:text-[11px]">
                    Total Value: $2.4M
                  </span>

                  <span className="text-[10px] text-[#D4A853] sm:text-[11px]">
                    Token Cost: ₣500
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-[#8F9A96] sm:text-[11px]">
                    3,200 of 4,800 sold
                  </span>

                  <span className="text-[10px] text-[#00D4AA] sm:text-[11px]">
                    67% Funded
                  </span>
                </div>

                <div className="mt-1.5 h-[5px] w-full overflow-hidden rounded-full bg-[#26312D]">
                  <div className="h-full w-[67%] rounded-full bg-[#D4A853]" />
                </div>

                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] text-[#8F9A96] sm:text-[10px]">
                      Est. Yield
                    </p>

                    <p className="mt-[3px] font-mono text-[15px] font-semibold text-[#00D4AA] sm:text-[16px]">
                      8.2% p.a.
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] text-[#8F9A96] sm:text-[10px]">
                      Next Payout
                    </p>

                    <p className="mt-[3px] font-mono text-[11px] text-[#FFFFFF] sm:text-[12px]">
                      Monthly (FAIX)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-4 flex h-[44px] w-full items-center justify-center rounded-[12px] bg-[#D4A853] text-[13px] !font-[700] text-[#0A0A0A] sm:h-[46px] sm:text-[14px]"
                >
                  Invest Now
                </button>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 md:gap-5 xl:grid-cols-3">
            <div className="tokenization-benefit rounded-[16px] border border-white/[0.08] bg-[#111513] px-4 py-5 sm:px-5">
              <h3 className="font-['Instrument_Serif'] text-[19px] font-normal text-[#D4A853] sm:text-[20px]">
                Fractional Access
              </h3>

              <p className="mt-3 text-[12px] leading-[1.5] text-[#8F9A96] sm:text-[13px]">
                Invest from just ₣500 in institutional real estate portfolios.
              </p>
            </div>

            <div className="tokenization-benefit rounded-[16px] border border-white/[0.08] bg-[#111513] px-4 py-5 sm:px-5">
              <h3 className="font-['Instrument_Serif'] text-[19px] font-normal text-[#D4A853] sm:text-[20px]">
                Passive Yield
              </h3>

              <p className="mt-3 text-[12px] leading-[1.5] text-[#8F9A96] sm:text-[13px]">
                Earn quarterly or monthly rental dividends sent directly to
                your FAIX wallet.
              </p>
            </div>

            <div className="tokenization-benefit rounded-[16px] border border-white/[0.08] bg-[#111513] px-4 py-5 sm:px-5 md:col-span-2 xl:col-span-1">
              <h3 className="font-['Instrument_Serif'] text-[19px] font-normal text-[#D4A853] sm:text-[20px]">
                Instant Liquidity
              </h3>

              <p className="mt-3 text-[12px] leading-[1.5] text-[#8F9A96] sm:text-[13px]">
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