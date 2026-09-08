import { useLayoutEffect, useRef } from "react";
import {
  LockKeyhole,
  ShieldCheck,
  House,
  CircleX,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

gsap.registerPlugin(ScrollTrigger);

const SECURITY_FEATURES = [
  {
    icon: LockKeyhole,
    title: "Blockchain Immutability",
    description:
      "All transactions transparently recorded and immutably synchronized on enterprise-grade distributed ledger networks.",
  },
  {
    icon: ShieldCheck,
    title: "Regulatory Compliance",
    description:
      "Assets structured through direct institutional SPVs with full regulatory oversight across Singapore, UAE, and EU jurisdictions.",
  },
  {
    icon: House,
    title: "Custodian Security",
    description:
      "Holdings secured under Metalan Trust Ltd. with automated ledger protocols, multi-sig authorization, and sovereign protection.",
  },
  {
    icon: CircleX,
    title: "Insurance Protection",
    description:
      "Assets backed by institutional insurance frameworks from Lloyd's of London, protecting investor capital against operational risks.",
  },
];

export default function Security() {
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

      tl.from(".security-label", {
        y: 20,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          ".security-heading",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.45"
        )
        .from(
          ".security-description",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".security-card",
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
      className="bg-[#0A0A0A] py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="text-center">
          <Text
            size="sm"
            className="security-label !text-[12px] !font-semibold !tracking-[0.08em] !text-[#D4A853]"
          >
            INSTITUTIONAL SECURITY
          </Text>

          <Heading
            level={2}
            className="security-heading mt-4 !font-['Instrument_Serif'] !text-[42px] !font-normal !leading-[1.1] !text-white sm:!text-[50px] lg:!text-[56px]"
          >
            Built on Unbreakable Trust
          </Heading>

          <Text
            size="sm"
            className="security-description mx-auto mt-5 w-full max-w-[850px] !text-[16px] !leading-[24px] !text-[#8F9A96]"
          >
            Every layer of the Metalan Wealth platform is engineered for
            sovereign-grade protection and regulatory clarity.
          </Text>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {SECURITY_FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="security-card !min-h-[255px] !rounded-[16px] !border-[#D4A853]/30 !bg-[#121614]/[0.8784] !p-8 !shadow-none"
              >
                <div className="flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#1A3C34]">
                    <Icon
                      size={21}
                      strokeWidth={2}
                      className="text-[#D4A853]"
                    />
                  </div>
                </div>

                <Heading
                  level={3}
                  className="mt-5 !text-center !font-sans !text-[18px] !font-bold !leading-[1.2] !text-white"
                >
                  {feature.title}
                </Heading>

                <Text
                  size="sm"
                  className="mt-4 !text-center !text-[14px] !leading-[21px] !text-[#8F9A96]"
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