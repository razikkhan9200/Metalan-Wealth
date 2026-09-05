import { Link } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".hero-bg", {
        scale: 1.08,
        duration: 1.8,
      })
        .from(
          ".hero-title",
          {
            y: 60,
            opacity: 0,
            duration: 1.1,
          },
          "-=1.25"
        )
        .from(
          ".hero-subtitle",
          {
            y: 30,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.7"
        )
        .from(
          ".hero-cta",
          {
            y: 25,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
          },
          "-=0.55"
        )
        .from(
          ".hero-stat",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
          },
          "-=0.4"
        );

      gsap.to(".hero-glow", {
        scale: 1.08,
        opacity: 0.85,
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-[692px] overflow-hidden bg-[#0b0d0c] text-white"
    >
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero-section.png')",
        }}
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="hero-glow absolute left-1/2 top-[48%] h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00D4AA]/20 blur-[120px]" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="w-full max-w-[1200px] -translate-y-[1px] text-center">
          <h1 className="hero-title w-full font-['Instrument_Serif'] text-[76px] font-normal leading-[105%] text-white">
            Tokenize. Invest.{" "}
            <span className="text-[#D4A853]">Transform</span>
          </h1>

          <p className="hero-subtitle mx-auto mt-8 max-w-[720px] text-[17px] leading-[1.7] text-[#A7AAA6]">
            Fractional ownership of premium real estate and expert-managed
            forex funds —
            <br />
            powered by blockchain technology and FAIX tokens.
          </p>

          <div className="mt-10 flex items-center justify-center gap-5">
            <Link
              to="/login"
              className="hero-cta flex h-[57px] w-[190px] items-center justify-center rounded-[12px] bg-gradient-to-r from-[#D4A853] to-[#B87333] text-[15px] !font-[700] !text-[#0A0A0A] shadow-[0_6px_24px_0_#B87333]"
            >
              Start Investing
            </Link>

            <Link
              to="/properties"
              className="hero-cta flex h-[57px] w-[235px] items-center justify-center rounded-[12px] border-[1.5px] border-[#B87333] bg-transparent px-8 text-[15px] !font-[700] !text-[#D4A853]"
            >
              Explore Properties →
            </Link>
          </div>

          <div className="mt-14 flex items-center justify-center gap-5">
            <div className="hero-stat rounded-full border border-[#D9A64A]/45 bg-[#07100D]/75 px-6 py-2.5 text-[13px] font-medium text-[#D9A64A] shadow-[0_0_18px_rgba(217,166,74,0.35)] backdrop-blur-md">
              ₣2.4B+ Tokenized
            </div>

            <div className="hero-stat rounded-full border border-[#D9A64A]/45 bg-[#07100D]/75 px-6 py-2.5 text-[13px] font-medium text-[#D9A64A] shadow-[0_0_18px_rgba(217,166,74,0.35)] backdrop-blur-md">
              12,400+ Investors
            </div>

            <div className="hero-stat rounded-full border border-[#D9A64A]/45 bg-[#07100D]/75 px-6 py-2.5 text-[13px] font-medium text-[#D9A64A] shadow-[0_0_18px_rgba(217,166,74,0.35)] backdrop-blur-md">
              45+ Properties
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}