import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative h-[692px] overflow-hidden bg-[#0b0d0c] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero-section.png')",
        }}
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="absolute left-1/2 top-[47%] h-[520px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[125px]" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="w-full max-w-[1100px] -translate-y-[2px] text-center">
          <h1 className="font-serif text-[56px] leading-[1.05] tracking-[-0.025em] sm:text-[64px] md:text-[70px] lg:text-[76px]">
            Tokenize. Invest.{" "}
            <span className="text-[#d7a94c]">Transform</span>
          </h1>

          <p className="mx-auto mt-8 max-w-[720px] text-[17px] leading-[1.7] text-white/60">
            Fractional ownership of premium real estate and expert-managed
            forex funds —
            <br />
            powered by blockchain technology and FAIX tokens.
          </p>

          <div className="mt-10 flex items-center justify-center gap-5">
            <Link
              to="/login"
              className="flex h-[58px] min-w-[190px] items-center justify-center rounded-xl bg-[#d9a64a] px-8 text-[15px] font-semibold text-black shadow-[0_0_35px_rgba(217,166,74,0.4)] transition hover:bg-[#e3b45d]"
            >
              Start Investing
            </Link>

            <Link
              to="/properties"
              className="flex h-[58px] min-w-[235px] items-center justify-center rounded-xl border border-[#d9a64a] px-8 text-[15px] font-semibold text-[#d9a64a] transition hover:bg-[#d9a64a]/10"
            >
              Explore Properties →
            </Link>
          </div>

          <div className="mt-14 flex items-center justify-center gap-5">
            <div className="rounded-full border border-[#d9a64a]/45 bg-[#07100d]/75 px-6 py-2.5 text-[13px] font-medium text-[#d9a64a] shadow-[0_0_18px_rgba(217,166,74,0.35)] backdrop-blur-md">
              ₣2.4B+ Tokenized
            </div>

            <div className="rounded-full border border-[#d9a64a]/45 bg-[#07100d]/75 px-6 py-2.5 text-[13px] font-medium text-[#d9a64a] shadow-[0_0_18px_rgba(217,166,74,0.35)] backdrop-blur-md">
              12,400+ Investors
            </div>

            <div className="rounded-full border border-[#d9a64a]/45 bg-[#07100d]/75 px-6 py-2.5 text-[13px] font-medium text-[#d9a64a] shadow-[0_0_18px_rgba(217,166,74,0.35)] backdrop-blur-md">
              45+ Properties
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}