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

      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute left-1/2 top-[48%] h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00D4AA]/20 blur-[120px]" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="w-full max-w-[1100px] -translate-y-[1px] text-center">
         <h1 className="w-full max-w-[1200px] font-['Instrument_Serif'] text-[80px] font-normal leading-[105%] text-white">
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
           className="flex h-[57px] w-[190px] items-center justify-center rounded-[12px] bg-gradient-to-r from-[#D4A853] to-[#B87333] text-[15px] !font-[700] !text-[#0A0A0A] shadow-[0_6px_24px_0_#B87333] transition-transform duration-200 hover:scale-[1.02]"
           >
           Start Investing
           </Link>

            <Link
              to="/properties"
              className="flex h-[57px] w-[235px] items-center justify-center rounded-[12px] border-[1.5px] border-[#B87333] bg-transparent px-8 text-[15px] font-semibold !text-[#D4A853] transition-colors duration-200 hover:bg-[#D4A853]/10"
            >
              Explore Properties →
            </Link>
          </div>

          <div className="mt-14 flex items-center justify-center gap-5">
            <div className="rounded-full border border-[#D9A64A]/45 bg-[#07100D]/75 px-6 py-2.5 text-[13px] font-medium text-[#D9A64A] shadow-[0_0_18px_rgba(217,166,74,0.35)] backdrop-blur-md">
              ₣2.4B+ Tokenized
            </div>

            <div className="rounded-full border border-[#D9A64A]/45 bg-[#07100D]/75 px-6 py-2.5 text-[13px] font-medium text-[#D9A64A] shadow-[0_0_18px_rgba(217,166,74,0.35)] backdrop-blur-md">
              12,400+ Investors
            </div>

            <div className="rounded-full border border-[#D9A64A]/45 bg-[#07100D]/75 px-6 py-2.5 text-[13px] font-medium text-[#D9A64A] shadow-[0_0_18px_rgba(217,166,74,0.35)] backdrop-blur-md">
              45+ Properties
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}