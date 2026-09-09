import { useLayoutEffect, useRef } from "react";
import {
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Globe2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
  {
    label: "TOTAL AUM",
    value: "$45M+",
    description: "Institutional-grade tokenized assets secured globally.",
  },
  {
    label: "AVERAGE YIELD",
    value: "12.4% p.a.",
    description: "Weighted across syndicates and forex indices.",
  },
  {
    label: "PROPERTIES",
    value: "45+",
    description: "Prime assets across 12 countries worldwide.",
  },
  {
    label: "ACTIVE INVESTORS",
    value: "12,400+",
    description: "Sovereign allocators and private wealth clients.",
  },
];

const BENEFITS = [
  "Automated monthly yield payouts",
  "24/7 trading on Metalan Exchange",
  "Institutional insurance backing",
];

export default function PlatformMetrics() {
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

      tl.from(".metrics-label", {
        y: 25,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          ".metrics-heading",
          {
            y: 35,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.45"
        )
       .fromTo(
  ".metric-card",
  {
    y: 25,
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.1,
  },
  "-=0.4"
)
        .from(
          ".metrics-benefit",
          {
            x: -15,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.35"
        )
        .from(
          ".metrics-visual",
          {
            x: 40,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0A0A0A] py-16 sm:py-20 lg:py-[96px]"
    >
      <div className="absolute left-[-180px] top-[20%] h-[420px] w-[420px] rounded-full bg-[#1A3C34]/20 blur-[140px]" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div>
            <div className="metrics-label inline-flex items-center gap-2 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/[0.05] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4A853]" />

              <Text
                size="sm"
                className="!text-[10px] !font-semibold !tracking-[0.18em] !text-[#D4A853]"
              >
                PLATFORM METRICS
              </Text>
            </div>

            <Heading
              level={2}
              className="metrics-heading mt-6 max-w-[610px] !font-['Instrument_Serif'] !text-[40px] !font-normal !leading-[1.08] !text-white sm:!text-[48px] lg:!text-[52px]"
            >
              Consistent Sovereign Capital Appreciation
            </Heading>

            <Text
              size="sm"
              className="mt-5 max-w-[520px] !text-[15px] !leading-[24px] !text-[#8F9A96]"
            >
              Built for investors who value long-term capital growth,
              institutional access, and transparent wealth infrastructure.
            </Text>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {METRICS.map((metric, index) => (
                <Card
                  key={metric.label}
                  className="metric-card group relative !min-h-[168px] !overflow-hidden !rounded-[18px] !border-white/[0.08] !bg-[#111614] !p-5 !shadow-none transition-all duration-300 hover:-translate-y-1 hover:!border-[#D4A853]/30"
                >
                  <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-[#D4A853]/[0.04] blur-2xl" />

                  <div className="relative flex items-start justify-between">
                    <Text
                      size="sm"
                      className="!text-[10px] !font-semibold !leading-[13px] !tracking-[0.18em] !text-[#8F9A96]"
                    >
                      {metric.label}
                    </Text>

                    <ArrowUpRight
                      size={15}
                      className="text-white/25 transition-colors duration-300 group-hover:text-[#D4A853]"
                    />
                  </div>

                  <div className="mt-5 font-mono text-[34px] font-semibold leading-none text-[#D4A853]">
                    {metric.value}
                  </div>

                  <Text
                    size="sm"
                    className="mt-4 !max-w-[220px] !text-[12px] !leading-[18px] !text-[#707A76]"
                  >
                    {metric.description}
                  </Text>
                </Card>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              {BENEFITS.map((benefit, index) => (
                <div
                  key={benefit}
                  className="metrics-benefit flex items-center gap-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#D4A853]/20 bg-[#D4A853]/[0.06]">
                    {index === 0 && (
                      <TrendingUp
                        size={12}
                        className="text-[#D4A853]"
                      />
                    )}

                    {index === 1 && (
                      <Globe2 size={12} className="text-[#D4A853]" />
                    )}

                    {index === 2 && (
                      <ShieldCheck
                        size={12}
                        className="text-[#D4A853]"
                      />
                    )}
                  </span>

                  <Text
                    size="sm"
                    className="!font-['Geist'] !text-[14px] !leading-normal !text-[#C4A265]"
                  >
                    {benefit}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <div className="metrics-visual relative mx-auto w-full max-w-[500px]">
            <div className="absolute -inset-4 rounded-[32px] bg-[#D4A853]/[0.04] blur-2xl" />

            <div className="relative w-full overflow-hidden rounded-[24px] border border-[#D4A853]/70 bg-[#101412]">
              <img
                src="/images/Matrics-images/metric.png"
                alt="Platform metrics"
               className="h-[480px] w-full object-cover sm:h-[540px] md:h-[560px] lg:h-[580px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#080B09]/35 via-transparent to-transparent" />
            </div>

            <Card className="absolute bottom-4 right-4 !w-[200px] !rounded-[14px] !border-[#D4A853]/[0.3137] !bg-[#0A0D0B]/[0.92] !p-4 !shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:bottom-5 sm:right-5 sm:!w-[220px] sm:!p-5 lg:bottom-7 lg:right-7 lg:!w-[240px]">
              <div className="flex items-center justify-between">
                <Text
                  size="sm"
                  className="!text-[11px] sm:!text-[12px] !font-semibold !text-white"
                >
                  Live Portfolio Growth
                </Text>

                <span className="flex h-4 w-[45px] items-center justify-center gap-1 rounded-full bg-[#33D966]/[0.1216] px-2 py-[3px] text-[10px] font-semibold leading-none text-[#33D966]">
                  <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#33D966]" />
                  LIVE
                </span>
              </div>

              <div className="mt-4 flex h-[40px] w-full items-end gap-1">
                {[14, 20, 18, 28, 24, 32, 36, 40].map((height, index) => (
                  <span
                    key={index}
                    className={`flex-1 rounded-sm ${
                      index < 3
                        ? "bg-[#1A3C34]"
                        : index < 5
                          ? "bg-[#D4A853]/50"
                          : "bg-[#D4A853]"
                    }`}
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-end justify-between">
                <span className="font-mono text-[18px] sm:text-[20px] font-bold text-[#D4A853]">
                  +128.4%
                </span>

                <span className="text-[10px] text-[#33D966]">
                  ↑ 12mo
                </span>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}