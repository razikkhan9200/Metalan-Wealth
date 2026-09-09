import {
  LockKeyhole,
  FileText,
  RefreshCw,
  Globe2,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef(null);

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

      tl.from(".features-heading", {
        y: 35,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          ".features-description",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".feature-card",
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
          },
          "-=0.35"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-[680px] bg-[#0A0A0A] py-10 sm:py-12 md:py-14 lg:h-[760px] lg:py-[80px]"
    >
      <Container className="h-full">
        <div className="text-center">
          <Heading
            level={2}
            className="features-heading !font-['Instrument_Serif'] !text-[30px] !font-normal !leading-[1.1] !text-white sm:!text-[36px] lg:!text-[44px] xl:!text-[48px]"
          >
            Why Choose Metalan Wealth
          </Heading>

          <Text
            size="sm"
            className="features-description mx-auto mt-4 w-full max-w-[560px] !text-[14px] !leading-[22px] sm:!text-[15px] !text-[#8F9A96]"
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
                className="feature-card !h-[199px] !rounded-[16px] !border-white/10 !bg-[#101412] !p-8 !shadow-none"
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