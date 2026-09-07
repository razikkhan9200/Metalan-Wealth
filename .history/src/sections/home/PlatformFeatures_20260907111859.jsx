import {
  LockKeyhole,
  FileText,
  RefreshCw,
  Globe2,
  Wallet,
  TrendingUp,
} from "lucide-react";

const FEATURES = [
  {
    icon: LockKeyhole,
    title: "Blockchain Security",
    description:
      "All holdings transparently recorded and immutably synchronized on enterprise-grade networks.",
  },
  {
    icon: FileText,
    title: "Regulatory Compliance",
    description:
      "Secured through direct institutional SPV real-world structures globally.",
  },
  {
    icon: RefreshCw,
    title: "Automated Yields",
    description:
      "Smart contracts distribute dividend proceeds automatically and directly to your wallet.",
  },
  {
    icon: Globe2,
    title: "Global Access",
    description:
      "Institutional invest in prestigious properties across London, Singapore, Tokyo, and more.",
  },
  {
    icon: Wallet,
    title: "Low Entry from ₣500",
    description:
      "Unlock historically gated high-net-worth real estate syndicates without massive upfront cash requirements.",
  },
  {
    icon: TrendingUp,
    title: "24/7 Trading",
    description:
      "Instant trade-swaps allow you to liquidate fractions on the Metalan Decentralized Exchange anytime.",
  },
];

export default function PlatformFeatures() {
  return (
    <section className="bg-[#0A0A0A] px-4 py-16 sm:px-6 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-[1312px]">
        <div className="text-center">
          <h2 className="font-['Instrument_Serif'] text-[38px] font-normal leading-[1.1] text-white sm:text-[46px] lg:text-[52px]">
            Why Choose Metalan Wealth
          </h2>

          <p className="mx-auto mt-6 max-w-[650px] text-[14px] leading-[1.6] text-[#8F9A96] sm:text-[16px]">
            An institutional tokenized environment engineered for absolute
            safety, automated liquidity, and wealth preservation.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="min-h-[198px] rounded-[16px] border border-white/[0.10] bg-[#101412] p-8"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#17483D]">
                  <Icon size={19} strokeWidth={2} className="text-[#D4A853]" />
                </div>

                <h3 className="mt-5 font-['Instrument_Serif'] text-[22px] font-normal text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 max-w-[350px] text-[14px] leading-[1.55] text-[#919A96]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}