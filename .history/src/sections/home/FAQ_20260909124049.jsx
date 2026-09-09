import { useLayoutEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    question: "What is FAIX token?",
    answer:
      "FAIX is the native utility token powering the Metalan Wealth ecosystem - used for property purchases, fund investments, and exchange trading. 1 FAIX = $0.80 USD.",
  },
  {
    question: "How do I earn yields?",
    answer:
      "Yields are generated through the underlying investment products and distributed according to the terms of the selected asset or fund.",
  },
  {
    question: "What is the minimum investment?",
    answer:
      "The minimum investment starts from F500 for eligible investment opportunities.",
  },
  {
    question: "How are properties selected?",
    answer:
      "Properties are selected based on investment quality, location, structure, and long-term asset potential.",
  },
  {
    question: "Is my investment insured?",
    answer:
      "Eligible assets may be supported by institutional insurance and protection frameworks.",
  },
  {
    question: "Can I sell tokens anytime?",
    answer:
      "Token liquidity and trading availability depend on the supported asset and the available market on the Metalan Exchange.",
  },
];

export default function FAQ() {
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);

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

      tl.from(".faq-left", {
        x: -35,
        opacity: 0,
        duration: 0.8,
      }).from(
        ".faq-item",
        {
          y: 25,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
        },
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0A0A0A]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/FAQ-images/faq-bg.png')" }}
      />

      <Container className="relative z-10 flex items-center">
        <div className="grid w-full grid-cols-1 gap-8 py-12 sm:gap-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-16 xl:gap-16">
          <div className="faq-left max-w-[500px]">
            <div className="mb-5 h-px w-16 bg-[#D4A853]" />

            <Heading
              level={2}
              className="!font-['Instrument_Serif'] !text-[36px] sm:!text-[42px] lg:!text-[48px]!font-normal !leading-[1.1] !text-white"
            >
              Frequently Asked Questions
            </Heading>

            <Text
              size="sm"
              className="mt-6 max-w-[480px] !text-[16px] !leading-[24px] !text-[#8F9A96]"
            >
              A curated selection of answers to help you navigate the Metalan
              Wealth ecosystem with confidence.
            </Text>
          </div>

          <div className="w-full">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className="faq-item border-b border-white/10"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? -1 : index)
                    }
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[18px] font-semibold text-white sm:text-[19px]">
                      {faq.question}
                    </span>

                    <span
                      className={`shrink-0 text-[#D4A853] transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      <Plus size={24} strokeWidth={1.5} />
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] pb-6 opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <Text
                        size="sm"
                        className="max-w-[720px] !text-[14px] !leading-[21px] !text-[#8F9A96]"
                      >
                        {faq.answer}
                      </Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}