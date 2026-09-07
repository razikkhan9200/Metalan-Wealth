import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    title: "Create Account",
    description: "Sign up and complete KYC verification in minutes.",
  },
  {
    number: "02",
    title: "Browse Assets",
    description: "Explore premium properties and expert-managed funds.",
  },
  {
    number: "03",
    title: "Invest with FAIX",
    description: "Purchase fractional tokens starting from just F500.",
  },
  {
    number: "04",
    title: "Earn Yields",
    description: "Receive automated monthly dividend payouts.",
  },
  {
    number: "05",
    title: "Trade Anytime",
    description: "Liquidate on the Metalan Decentralized Exchange 24/7.",
  },
];

export default function HowItWorks() {
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

      tl.from(".journey-label", {
        y: 25,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          ".journey-heading",
          {
            y: 35,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.45"
        )
        .from(
          ".journey-line",
          {
            scaleX: 0,
            transformOrigin: "left center",
            opacity: 0,
            duration: 0.8,
          },
          "-=0.35"
        )
        .from(
          ".journey-card",
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
          },
          "-=0.5"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[720px] overflow-hidden bg-[#0A0A0A]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/how-it-works.png')" }}
      />

      <div className="absolute inset-0 bg-[#0A0A0A]/60" />

      <div className="relative z-10">
        <Container className="flex min-h-[720px] flex-col items-center pt-24 sm:pt-28 lg:pt-[120px]">
          <Text
            size="sm"
            className="journey-label !text-[12px] !font-semibold !tracking-[0.08em] !text-[#D4A853]"
          >
            YOUR INVESTMENT JOURNEY
          </Text>

          <Heading
            level={2}
            className="journey-heading mt-4 !font-['Instrument_Serif'] !text-[42px] !font-normal !leading-[1.1] !text-white sm:!text-[48px]"
          >
            How It Works
          </Heading>

          <div className="relative mt-14 w-full">
            <div className="journey-line absolute left-0 right-0 top-[24px] hidden h-px bg-[#D4A853]/70 lg:block" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              {STEPS.map((step) => (
                <Card
                  key={step.number}
                  className="journey-card relative !min-h-[202px] !rounded-[16px] !border-white/10 !bg-[#101412]/90 !p-6 !shadow-none backdrop-blur-sm"
                >
                  <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#D4A853] text-[16px] font-bold text-[#0A0A0A]">
                    {step.number}
                  </div>

                  <Heading
                    level={3}
                    className="mt-4 text-center !font-sans !text-[16px] !font-bold !leading-[1.2] !text-white"
                  >
                    {step.title}
                  </Heading>

                  <Text
                    size="sm"
                    className="mt-4 text-center !text-[14px] !leading-[22px] !text-[#8F9A96]"
                  >
                    {step.description}
                  </Text>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}