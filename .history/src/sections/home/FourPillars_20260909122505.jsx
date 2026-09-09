import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  House,
  ChartNoAxesCombined,
  ArrowLeftRight,
  ShoppingBag,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    image: "/images/Four-pillars/real-estate.png",
    icon: House,
    title: "Tokenized Real Estate",
    description:
      "Own fractions of premium global properties - from Marina Bay penthouses to Alpine ski lodges. Each property is legally structured through SPV, with tokens starting at just F500. Earn automated rental yields of 8-12% p.a. distributed monthly in FAIX.",
    badges: ["F500 Min Investment", "45+ Properties", "12 Countries"],
    button: "Browse Properties →",
  },
  {
    image: "/images/Four-pillars/expert-funds.png",
    icon: ChartNoAxesCombined,
    title: "Expert-Managed Funds",
    description:
      "Access institutional-grade forex and real estate funds managed by tier-1 asset managers. Choose from growth, alpha, or stable income strategies with transparent 1-year track records and automated index rebalancing. Returns of 9-24% across fund categories.",
    badges: ["$43M+ AUM", "3 Fund Strategies", "CFA Managers"],
    button: "Explore Funds →",
  },
  {
    image: "/images/Four-pillars/token-exchange.png",
    icon: ArrowLeftRight,
    title: "FAIX Token Exchange",
    description:
      "Trade property and fund tokens 24/7 on the Metalan Decentralized Exchange. Instant swaps between FAIX and major stablecoins with sovereign-grade liquidity pools. Full transparency with on-chain settlement and real-time order books.",
    badges: ["24/7 Trading", "Instant Settlement", "Multi-Pair"],
    button: "Start Trading →",
  },
  {
    image: "/images/Four-pillars/luxury-ecommerce.png",
    icon: ShoppingBag,
    title: "Luxury E-Commerce",
    description:
      "Spend your FAIX tokens on exclusive luxury goods and experiences in the Metalan marketplace. From premium timepieces to curated travel packages - access a world of sovereign commerce powered by your investment returns.",
    badges: ["500+ Products", "Global Shipping", "FAIX Payment"],
    button: "Browse Store →",
  },
];

export default function FourPillars() {
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

      tl.from(".pillars-label", {
        y: 20,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          ".pillars-heading",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.45"
        )
        .from(
          ".pillars-description",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".pillar-card",
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
      className="bg-[#0A0A0A] py-14 sm:py-16 lg:py-20"
    >
      <Container>
        <div className="text-center">
          <Text
            size="sm"
            className="pillars-label !text-[12px] !font-semibold !tracking-[0.08em] !text-[#D4A853]"
          >
            OUR SERVICES
          </Text>

          <Heading
            level={2}
            className="pillars-heading mt-3 !font-['Instrument_Serif'] !text-[40px] !font-normal !leading-[1.1] !text-white sm:!text-[44px] lg:!text-[48px]"
          >
            Four Pillars of Wealth Creation
          </Heading>

          <Text
            size="sm"
            className="pillars-description mx-auto mt-4 w-full max-w-[700px] !text-[16px] !leading-[24px] !text-[#8F9A96]"
          >
            Metalan Wealth offers a comprehensive suite of tokenized investment
            products designed for the modern sovereign investor.
          </Text>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <Card
                key={pillar.title}
                className="pillar-card !overflow-hidden !rounded-[16px] !border-[#D4A853]/30 !bg-[#121614] !p-0 !shadow-none"
              >
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="h-[150px] w-full object-cover sm:h-[170px] lg:h-[180px]"
                />

                <div className="p-4 sm:p-5">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4A853] bg-[#1A3C34]">
                  <Icon
                    size={14}
                    strokeWidth={2}
                    className="text-[#D4A853]"
                  />
                </div>

                  <Heading
                    level={3}
                    className="mt-3 !font-['Instrument_Serif'] !text-[18px] !font-normal !leading-[1.15] !text-white"
                  >
                    {pillar.title}
                  </Heading>

                <Text
                  size="sm"
                  className="mt-2 line-clamp-3 !text-[12px] !leading-[18px] !text-[#8F9A96]"
                >
                  {pillar.description}
                </Text>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {pillar.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-[#D4A853]/30 bg-[#0A0A0A] px-3 py-1 text-[11px] font-medium text-[#D4A853]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="#"
                    className="mt-4 flex h-9 w-full items-center justify-center rounded-xl border border-[#D4A853]/30 text-[12px] font-semibold text-[#D4A853] transition-colors duration-200 hover:bg-[#D4A853]/10"
                  >
                    {pillar.button}
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}