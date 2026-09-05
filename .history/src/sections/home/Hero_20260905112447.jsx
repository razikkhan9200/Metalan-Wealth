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

      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute left-1/2 top-[48%] h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[120px]" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="mx-auto w-full max-w-6xl -translate-y-[2px] text-center">
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[76px]">
            Tokenize. Invest.{" "}
            <span className="text-[#d7a94c]">Transform</span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Fractional ownership of premium real estate and expert-managed
            forex funds —
            <br className="hidden sm:block" />
            powered by blockchain technology and FAIX tokens.
          </p>

          <div className="mt-10 flex items-center justify-center gap-5">
            <Link
              to="/login"
              className="rounded-xl bg-[#d9a64a] px-9 py-4 font-semibold text-black shadow-[0_0_35px_rgba(217,166,74,0.45)] transition hover:scale-105"
            >
              Start Investing
            </Link>

            <Link
              to="/properties"
              className="rounded-xl border border-[#d9a64a] px-9 py-4 font-semibold text-[#d9a64a] transition hover:bg-[#d9a64a]/10"
            >
              Explore Properties →
            </Link>
          </div>

          <div className="mt-14 flex items-center justify-center gap-5">
            {[
              "₣2.4B+ Tokenized",
              "12,400+ Investors",
              "45+ Properties",
            ].map((stat) => (
              <div
                key={stat}
                className="rounded-full border border-[#d9a64a]/50 bg-black/40 px-6 py-2 text-sm font-medium text-[#d9a64a] shadow-[0_0_18px_rgba(217,166,74,0.35)] backdrop-blur-md"
              >
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}