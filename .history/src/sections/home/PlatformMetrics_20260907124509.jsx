import { useLayoutEffect, useRef } from "react";
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
          toggleActions: "play none none none",
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
        .from(
          ".metric-card",
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
          },
          "-=0.4"
        )
        .from(
          ".metrics-benefit",
          {
            y: 15,
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
      className="bg-[#0A0A0A] py-16 sm:py-20 lg:py-[100px]"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Text
              size="sm"
              className="metrics-label !text-[11px] !font-semibold !tracking-[0.02em] !text-[#D4A853]"
            >
              PLATFORM METRICS
            </Text>

            <Heading
              level={2}
              className="metrics-heading mt-5 max-w-[600px] !font-['Instrument_Serif'] !text-[40px] !font-normal !leading-[1.08] !text-white sm:!text-[48px] lg:!text-[52px]"
            >
              Consistent Sovereign Capital Appreciation
            </Heading>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {METRICS.map((metric) => (
                <Card
                  key={metric.label}
                  className="metric-card !min-h-[165px] !rounded-[16px] !border-[#D4A853]/30 !bg-[#121614]/[0.8784] !p-6 !shadow-none"
                >
                 <Text
                size="sm"
                className="!text-[10px] !font-semibold !leading-[13px] !tracking-[0.1em] !text-[#8F9A96]"
                >
                {metric.label}
                </Text>

                  <div className="mt-3 font-mono text-[40px] font-bold leading-none text-[#D4A853]">
                    {metric.value}
                  </div>

                  <Text
                    size="sm"
                    className="mt-4 !text-[13px] !leading-[20px] !text-[#8F9A96]"
                  >
                    {metric.description}
                  </Text>
                </Card>
              ))}
            </div>

            <div className="metrics-benefits mt-8 space-y-3">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit}
                  className="metrics-benefit flex items-center gap-3"
                >
                  <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#D4A853]" />
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

          <div className="metrics-visual relative mx-auto w-full max-w-[620px]">
            <div className="overflow-hidden rounded-[24px] border border-[#D4A853]">
            <img
                src="/images/metric.png"
                alt="Platform metrics"
                className="h-[780px] w-[632px] object-cover"
            />
            </div>

           <Card
            className="absolute bottom-5 right-5 !h-[143px] !w-[240px] !rounded-[16px] !border-[#D4A853]/[0.3137] !bg-[#0A0D0B]/80 !p-5 !shadow-none"
            >
              <div className="flex items-center justify-between">
                <Text
                  size="sm"
                  className="!text-[12px] !font-semibold !text-white"
                >
                  Live Portfolio Growth
                </Text>

                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  LIVE
                </span>
              </div>

             <div className="mt-3 flex h-[40px] w-[200px] items-end gap-1">
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
                <span className="font-mono text-[20px] font-bold text-[#D4A853]">
                  +128.4%
                </span>

                <span className="text-[10px] text-emerald-400">
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