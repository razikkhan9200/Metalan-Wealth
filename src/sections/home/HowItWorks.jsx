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
        y: 20,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          ".journey-heading",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.45"
        )
        .from(
          ".journey-description",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
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
          ".journey-step",
          {
            y: 35,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
          },
          "-=0.45"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0A0A0A] py-16 sm:py-20 lg:py-24"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/How-it-works-images/how-it-works.png')",
        }}
      />

      <div className="absolute inset-0 bg-[#0A0A0A]/65" />

      <Container className="relative z-10">
        <div className="text-center">
          <Text
            size="sm"
            className="journey-label !text-[12px] !font-semibold !tracking-[0.12em] !text-[#D4A853]"
          >
            YOUR INVESTMENT JOURNEY
          </Text>

          <Heading
            level={2}
            className="journey-heading mt-3 !font-['Instrument_Serif'] !text-[46px] !font-normal !leading-[1.1] !text-white sm:!text-[52px] lg:!text-[56px]"
          >
            How It Works
          </Heading>

          <Text
            size="sm"
            className="journey-description mx-auto mt-4 max-w-[560px] !text-[14px] !leading-[21px] !text-[#9AA39F]"
          >
            A simple five-step journey from account creation to global
            tokenized investing.
          </Text>
        </div>

        <div className="relative mt-16">
          <div className="journey-line absolute left-[10%] right-[10%] top-[24px] hidden h-px bg-gradient-to-r from-transparent via-[#D4A853]/70 to-transparent lg:block" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="journey-step relative flex flex-col items-center"
              >
                <div className="relative z-20 flex h-12 w-12 items-center justify-center rounded-full border border-[#D4A853] bg-[#D4A853] font-mono text-[14px] font-bold text-[#0A0A0A] shadow-[0_0_20px_rgba(212,168,83,0.2)]">
                  {step.number}
                </div>

                <Card className="mt-4 !min-h-[175px] !w-full !rounded-[18px] !border-white/[0.08] !bg-[#101412]/85 !p-6 !shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md">
                  <div className="text-center">
                    <Heading
                      level={3}
                      className="!font-sans !text-[16px] !font-bold !leading-[1.2] !text-white"
                    >
                      {step.title}
                    </Heading>

                    <Text
                      size="sm"
                      className="mt-4 !text-[13px] !leading-[21px] !text-[#8F9A96]"
                    >
                      {step.description}
                    </Text>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}