import {
  LockKeyhole,
  FileText,
  RefreshCw,
  Globe2,
  Wallet,
  TrendingUp,
} from "lucide-react";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

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
      "Instantly invest in prestigious properties across London, Singapore, Tokyo, and more.",
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
    <section className="min-h-[800px] bg-[#0A0A0A] py-16 sm:py-20 lg:h-[800px] lg:py-[100px]">
      <Container className="h-full">
        <div className="text-center">
          <Heading
            level={2}
            className="!font-['Instrument_Serif'] !text-[36px] !font-normal !leading-[1.1] !text-white sm:!text-[42px] lg:!text-[48px]"
          >
            Why Choose Metalan Wealth
          </Heading>

          <Text
            size="sm"
            className="mx-auto mt-5 w-full max-w-[600px] !text-[16px] !leading-[24px] !text-[#8F9A96]"
          >
            An institutional tokenized environment engineered for absolute
            safety, automated liquidity, and wealth preservation.
          </Text>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="!h-[199px] !rounded-[16px] !border-white/10 !bg-[#101412] !p-8 !shadow-none"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#1A3C34]">
                  <Icon
                    size={19}
                    strokeWidth={2}
                    className="text-[#D4A853]"
                  />
                </div>

                <Heading
                  level={3}
                  className="!mt-4 !font-['Instrument_Serif'] !text-[22px] !font-normal !leading-none !text-white"
                >
                  {feature.title}
                </Heading>

                <Text
                  size="sm"
                  className="!mt-4 !text-[14px] !leading-[21px] !text-[#8F9A96]"
                >
                  {feature.description}
                </Text>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}