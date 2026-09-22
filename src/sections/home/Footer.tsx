import {
  Twitter,
  Linkedin,
  Send,
  Instagram,
} from "lucide-react";

import Container from "../../components/ui/Container";
import Text from "../../components/ui/Text";

const FOOTER_LINKS = [
  {
    title: "COMPANY",
    links: ["About Us", "Careers", "Press", "Blog"],
  },
  {
    title: "PRODUCTS",
    links: ["Properties", "Funds", "Token Exchange", "Marketplace"],
  },
  {
    title: "RESOURCES",
    links: ["Help Center", "Documentation", "API", "FAQs"],
  },
  {
    title: "LEGAL",
    links: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Disclaimers"],
  },
];

const SOCIALS = [
  { icon: Twitter, label: "Twitter" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Send, label: "Telegram" },
  { icon: Instagram, label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white">
      <Container>
        <div className="border-t border-white/[0.08] py-10 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:gap-10">
            <div className="max-w-[360px] sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[#D4A853] bg-[#1A3C34] font-['Instrument_Serif'] text-[20px] text-[#D4A853]">
                  M
                </div>

                <span className="font-['Instrument_Serif'] text-[21px] text-white">
                  Metalan Wealth
                </span>
              </div>

              <Text
                size="sm"
                className="mt-5 !max-w-[350px] !text-[14px] !leading-[21px] !text-[#8F9A96]"
              >
                Institutional-grade tokenized real estate and expert-managed
                funds - powered by blockchain and FAIX.
              </Text>

              <Text
                size="sm"
                className="mt-5 !text-[12px] !leading-[18px] !text-[#8F9A96]"
              >
                Dubai, UAE • Singapore • London
              </Text>

              <Text
                size="sm"
                className="mt-1 break-words !text-[12px] !leading-[18px] !text-[#8F9A96]"
              >
                support@metalanwealth.com
              </Text>
            </div>

            {FOOTER_LINKS.map((column) => (
              <div key={column.title}>
                <Text
                  size="sm"
                  className="!text-[12px] !font-semibold !tracking-[0.05em] !text-[#D4A853]"
                >
                  {column.title}
                </Text>

                <div className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="block text-[14px] text-[#8F9A96] transition-colors duration-200 hover:text-white"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-white/[0.08] pt-6 sm:mt-12 sm:pt-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
              <Text
                size="sm"
                className="!text-[13px] !leading-5 !text-[#8F9A96]"
              >
                © 2026 Metalan Wealth. All rights reserved.
              </Text>

              <Text
                size="sm"
                className="!text-[13px] !leading-5 !text-[#8F9A96]"
              >
                Regulated by DFSA · Licensed under ADGM
              </Text>

              <div className="flex items-center gap-3">
                {SOCIALS.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href="#"
                      aria-label={social.label}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#D4A853]/25 text-[#D4A853] transition-all duration-200 hover:border-[#D4A853]/60 hover:bg-[#D4A853]/10"
                    >
                      <Icon size={17} strokeWidth={1.8} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}