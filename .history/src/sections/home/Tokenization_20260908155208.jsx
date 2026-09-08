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
         backgroundImage: "url('/images/Tokenization-Images/tokenization-bg-export.png')",
        }}
      />

      <div className="absolute inset-0 bg-[#0A0A0A]/90" />

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 py-14 sm:px-6 sm:py-16 lg:px-20 lg:py-20">
        <div className="w-full max-w-[1320px]">
          <h2 className="tokenization-heading font-['Instrument_Serif'] text-[34px] font-normal leading-[1.05] tracking-normal text-[#FFFFFF] sm:text-[40px] lg:text-[48px]">
            Own Premium Real Estate — One Token at a Time
          </h2>

          <p className="tokenization-description mt-5 max-w-[850px] text-[14px] leading-[1.5] text-[#8F9A96] sm:text-[15px] lg:text-[15px]">
            Metalan Wealth lowers the barrier to prime global property assets
            through regulatory-compliant SPV
            <br />
            fractional tokenization. Secure physical yield on-chain.
          </p>

          <div className="tokenization-main mt-8 grid grid-cols-1 items-start gap-8 sm:mt-10 lg:grid-cols-2 lg:gap-8 xl:mt-10 xl:grid-cols-[370px_minmax(0,420px)_440px] xl:gap-10">
            <div className="tokenization-visual h-[320px] w-full overflow-hidden rounded-[24px] bg-[#121614] sm:h-[400px] lg:h-[480px] lg:w-[370px]">
              <img
                src="/images/Tokenization-Images/isometric-visual.png"
                alt="Premium real estate"
                className="h-full w-full object-cover"
              />
            </div>

                    <div className="flex h-auto w-full max-w-[420px] flex-col gap-[24px] lg:w-full xl:h-[592px] xl:w-[420px]">
            {steps.map((step) => (
                <div
                key={step.number}
                className="tokenization-step flex h-[44px] items-start gap-4"
                >
                <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-[#D4A853] bg-[#1A3C34] text-[14px] font-medium text-[#D4A853]">
                    {step.number}
                </div>

                <div className="pt-0.5">
                <h3 className="font-['Instrument_Serif'] text-[18px] font-normal leading-[1.2] text-[#FFFFFF]">
                    {step.title}
                    </h3>

                    <p className="mt-1 text-[13px] leading-[1.2] text-[#8F9A96]">
                    {step.text}
                    </p>
                </div>
                </div>
            ))}
            </div>

          <div className="tokenization-card h-auto min-h-[430px] w-full max-w-full rounded-[24px] border border-[#D4A853] bg-[#121614]/[0.8784] p-5 shadow-[0_4px_24px_0_#D4A853] sm:p-[24px] lg:col-span-2 xl:col-span-1 xl:h-[430px] xl:w-[440px]">
              <div className="h-[150px] w-full overflow-hidden rounded-[12px] bg-[#121614]">
                <img
                  src="/images/Tokenization-Images/card-img.png"
                  alt="Marina Bay Tower, Dubai"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-[20px]">
                <h3 className="font-['Instrument_Serif'] text-[20px] font-normal leading-[1.1] text-[#FFFFFF] sm:text-[22px]">
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
                  className="mt-[16px] flex h-[46px] w-full items-center justify-center rounded-[12px] bg-[#D4A853] text-[14px] !font-[700] text-[#0A0A0A]"
                >
                  Invest Now
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
            <div className="tokenization-benefit rounded-[16px] border border-white/[0.08] bg-[#111513] px-5 py-5">
              <h3 className="font-['Instrument_Serif'] text-[20px] font-normal text-[#D4A853]">
                Fractional Access
              </h3>

              <p className="mt-3 text-[13px] leading-[1.5] text-[#8F9A96]">
                Invest from just ₣500 in institutional real estate portfolios.
              </p>
            </div>

            <div className="tokenization-benefit rounded-[16px] border border-white/[0.08] bg-[#111513] px-5 py-5">
              <h3 className="font-['Instrument_Serif'] text-[20px] font-normal text-[#D4A853]">
                Passive Yield
              </h3>

              <p className="mt-3 text-[13px] leading-[1.5] text-[#8F9A96]">
                Earn quarterly or monthly rental dividends sent directly to
                your FAIX wallet.
              </p>
            </div>

            <div className="tokenization-benefit rounded-[16px] border border-white/[0.08] bg-[#111513] px-5 py-5">
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