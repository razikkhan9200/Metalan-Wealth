import { Link } from "react-router-dom";

const stats = [
  "₣2.4B+ Tokenized",
  "12,400+ Investors",
  "45+ Properties",
];

export default function Hero() {
  return (
    <section className="relative h-[800px] overflow-hidden bg-[#0A0A0A] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-section.png')",
        }}
      />

      <div className="absolute inset-0 bg-[#121614]/50" />

      <div
        className="absolute left-1/2 top-[47%] h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1A3C34]/80 blur-[70px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full items-center justify-center px-6 pt-[88px]">
        <div className="w-full max-w-[1100px] text-center">
          <h1 className="font-serif text-[56px] leading-[1.05] tracking-[-0.025em] sm:text-[64px] md:text-[70px] lg:text-[76px]">
            Tokenize. Invest.{" "}
            <span className="text-[#D4A853]">Transform</span>
          </h1>

          <p className="mx-auto mt-8 max-w-[720px] text-[17px] leading-[1.7] text-[#A7AAA6]">
            Fractional ownership of premium real estate and expert-managed
            forex funds —
            <br />
            powered by blockchain technology and FAIX tokens.
          </p>

          <div className="mt-10 flex items-center justify-center gap-5">
            <Link
              to="/login"
              className="flex h-[57px] w-[190px] items-center justify-center rounded-[12px] bg-gradient-to-r from-[#D4A853] to-[#B87333] text-[15px] font-semibold text-[#0A0A0A] shadow-[0_6px_24px_0_#B87333] transition-transform duration-200 hover:scale-[1.02]"
            >
              Start Investing
            </Link>

            <Link
              to="/properties"
              className="flex h-[57px] w-[235px] items-center justify-center rounded-[12px] bg-gradient-to-r from-[#D4A853] to-[#B87333] p-[1.5px] transition-transform duration-200 hover:scale-[1.02]"
            >
              <span className="flex h-full w-full items-center justify-center rounded-[10.5px] transparent text-[15px] font-semibold text-[#D4A853]">
                Explore Properties →
              </span>
            </Link>
          </div>

          <div className="mt-14 flex items-center justify-center gap-[8px]">
            {stats.map((stat) => (
              <div
                key={stat}
                className="flex h-[33px] items-center justify-center rounded-full border border-[#D4A853]/25 bg-[#121614]/50 px-[16px] text-[12px] font-medium text-[#D4A853] shadow-[0_0_12px_0_#D4A853]"
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