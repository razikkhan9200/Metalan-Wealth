import { Link } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          toggleActions: "play none play reverse",
        },
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".hero-heading", {
        y: 45,
        opacity: 0,
        duration: 1,
      })
        .from(
          ".hero-description",
          {
            y: 25,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          ".hero-buttons",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".hero-stats",
          {
            y: 15,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.4"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
        <section
          ref={heroRef}
        className="relative min-h-[700px] overflow-hidden bg-[#0A0A0A] text-white sm:min-h-[700px] lg:h-[700px] lg:min-h-0"
        >
        <div
          className="absolute inset-0 w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/Hero-images/hero-section-3.png')",
          }}
        />


        <div className="absolute inset-0 w-full bg-black/50" />



        <div className="absolute left-1/2 top-[48%] h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1A3C34]/80 blur-[120px]" />


     <div className="relative z-10 flex h-full items-start justify-center px-4 pt-[120px] sm:px-6 sm:pt-[165px] lg:pt-[180px]">
        <div className="w-full max-w-[1200px] -translate-y-[1px] text-center">
       <h1 className="hero-heading w-full max-w-[1200px] font-['Instrument_Serif'] text-[52px] font-normal leading-[105%] tracking-[-2px] text-white sm:text-[62px] md:text-[70px] lg:text-[80px]">
            Tokenize. Invest.{" "}
            <span className="text-[#D4A853]">Transform</span>
          </h1>

          <p className="hero-description mx-auto mt-8 max-w-[720px] text-[17px] leading-[1.7] text-[#A7AAA6]">
            Fractional ownership of premium real estate and expert-managed
            forex funds —
            <br />
            powered by blockchain technology and FAIX tokens.
          </p>

           <div className="hero-buttons mt-10 flex w-full items-center justify-center gap-3 sm:gap-5">
            <Link
                to="/login"
                className="flex h-[57px] flex-1 items-center justify-center rounded-[12px] bg-gradient-to-r from-[#D4A853] to-[#B87333] px-3 text-[13px] !font-[700] !text-[#0A0A0A] shadow-[0_6px_24px_0_#B87333] transition-transform duration-200 hover:scale-[1.02] sm:h-[57px] sm:w-[190px] sm:flex-none sm:px-[36px] sm:text-[15px]"
            >
                Start Investing
            </Link>

            <Link
                to="/properties"
                className="flex h-[57px] flex-1 items-center justify-center rounded-[12px] border-[1.5px] border-[#B87333] bg-transparent px-3 text-center text-[13px] font-semibold !text-[#D4A853] transition-colors duration-200 hover:bg-[#D4A853]/10 sm:h-[57px] sm:w-[235px] sm:flex-none sm:px-[36px] sm:text-[15px]"
            >
                Explore Properties →
            </Link>
            </div>

        <div className="hero-stats mt-10 flex w-full items-center justify-center gap-2 sm:mt-14 sm:gap-3 lg:mt-14 lg:gap-5">
              <div className="flex h-[33px] w-[calc((100%-16px)/3)] max-w-[152px] items-center justify-center whitespace-nowrap rounded-full border border-[#D4A853]/25 bg-[#121614]/50 px-1 text-[9px] font-medium text-[#D4A853] shadow-[0_0_12px_0_#D4A853] backdrop-blur-md sm:w-[calc((100%-24px)/3)] sm:px-2 sm:text-[11px] lg:w-[152px] lg:px-5 lg:text-[12px]">
                ₣2.4B+ Tokenized
              </div>

              <div className="flex h-[33px] w-[calc((100%-16px)/3)] max-w-[152px] items-center justify-center whitespace-nowrap rounded-full border border-[#D4A853]/25 bg-[#121614]/50 px-1 text-[9px] font-medium text-[#D4A853] shadow-[0_0_12px_0_#D4A853] backdrop-blur-md sm:w-[calc((100%-24px)/3)] sm:px-2 sm:text-[11px] lg:w-[152px] lg:px-5 lg:text-[12px]">
                12,400+ Investors
              </div>

              <div className="flex h-[33px] w-[calc((100%-16px)/3)] max-w-[152px] items-center justify-center whitespace-nowrap rounded-full border border-[#D4A853]/25 bg-[#121614]/50 px-1 text-[9px] font-medium text-[#D4A853] shadow-[0_0_12px_0_#D4A853] backdrop-blur-md sm:w-[calc((100%-24px)/3)] sm:px-2 sm:text-[11px] lg:w-[152px] lg:px-5 lg:text-[12px]">
                45+ Properties
              </div>
        </div>
        </div>
      </div>
    </section>
  );
}