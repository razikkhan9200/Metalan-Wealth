import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote:
      "Metalan allowed our private office to diversify seamlessly into prime commercial spaces. The legal structure and FAIX payouts run flawlessly every month.",
    name: "Marcus V.",
    location: "Zürich, Switzerland",
  },
  {
    quote:
      "The ability to trade property fractions 24/7 with zero waiting time is a complete paradigm shift for global real estate syndication.",
    name: "Elena R.",
    location: "Singapore",
  },
  {
    quote:
      "Their tier-1 forex and real estate index indices consistently outpace traditional private banking returns with total on-chain sovereignty.",
    name: "Al-Maktoum family trust delegate",
    location: "Dubai, UAE",
  },
];

export default function Testimonials() {
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

      tl.from(".testimonials-heading", {
        y: 35,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          ".testimonials-description",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".testimonial-card",
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
      className="min-h-[700px] bg-[#0A0A0A] px-0 py-16 sm:py-20 lg:py-[100px]"
    >
      <Container>
        <div className="text-center">
          <Heading
            level={2}
            className="testimonials-heading !font-['Instrument_Serif'] !text-[36px] !font-normal !leading-[1.1] !text-white sm:!text-[42px] lg:!text-[48px]"
          >
            Prestige Testimonials
          </Heading>

          <Text
            size="sm"
            className="testimonials-description mx-auto mt-5 w-full max-w-[600px] !text-[16px] !leading-[24px] !text-[#8F9A96]"
          >
            What sovereign allocators and distinguished global portfolio
            clients say about our service.
          </Text>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="testimonial-card !min-h-[289px] !rounded-[16px] !border-[#D4A853]/30 !bg-[#101412] !p-8 !shadow-none"
            >
              <div className="flex h-full flex-col">
                <span className="font-serif text-[32px] leading-none text-[#D4A853]/40">
                  “
                </span>

                <Text
                  size="sm"
                  className="mt-10 !text-[16px] !leading-[24px] !text-[#8F9A96]"
                >
                  {testimonial.quote}
                </Text>

                <div className="mt-auto pt-7">
                  <Heading
                    level={3}
                    className="!font-['Instrument_Serif'] !text-[18px] !font-normal !leading-none !text-white"
                  >
                    {testimonial.name}
                  </Heading>

                  <Text
                    size="sm"
                    className="mt-2 !text-[13px] !leading-[20px] !text-[#D4A853]"
                  >
                    {testimonial.location}
                  </Text>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}