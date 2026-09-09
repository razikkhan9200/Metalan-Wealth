import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "../constants/routes";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  const navigation = [
    { label: "Platform", href: ROUTES.HOME },
    { label: "Investments", href: ROUTES.PROPERTIES },
    { label: "Blockchain", href: ROUTES.EXCHANGE },
    { label: "About", href: ROUTES.ABOUT },
  ];

  return (
<header className="absolute left-0 top-0 z-50 w-full border-b border-white/[0.0824] !bg-[#121614]/[0.502] text-white !backdrop-blur-[24px]">
      <div className="mx-auto flex h-[88px] w-full max-w-[1440px] items-center px-4 sm:px-6 xl:px-[80px]">
        <Link
          to={ROUTES.HOME}
          className="flex min-w-0 shrink-0 items-center gap-2"
        >
          <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] border border-[#D4A853] bg-[#1A3C34]">
            <span className="font-serif text-[18px] leading-none text-[#D4A853]">
              M
            </span>
          </div>

          <span className="whitespace-nowrap font-serif text-[14px] tracking-[-0.2px] text-[#F1EEE7] sm:text-[16px]">
            METALAN WEALTH
          </span>
        </Link>

        <nav className="ml-[120px] hidden h-full items-center gap-[39px] xl:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className="text-[14px] font-medium !text-[#8F9A96] transition-colors duration-200 hover:text-[#F1EEE7]"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-[31px] lg:flex">
          <div className="whitespace-nowrap font-mono text-[13px] font-semibold tracking-[0] text-[#00D4AA]">
            ₣1 FAIX = $0.80 ↗2.4%
          </div>

          <Link
            to={ROUTES.LOGIN}
            className="whitespace-nowrap text-[13px] font-medium !text-[#D4A853] transition-colors duration-200 hover:text-[#F1EEE7]"
          >
            Sign In
          </Link>

          <Link
            to={ROUTES.LOGIN}
            className="flex h-[42px] w-[129px] items-center justify-center rounded-full bg-gradient-to-r from-[#D4A853] to-[#B87333] px-[24px] py-[12px] !text-[13px] font-bold !text-[#0A0A0A] transition-transform duration-200 hover:scale-[1.03]"
          >
            Launch App
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="ml-auto flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] border border-white/[0.10] bg-[#181817] text-white lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="absolute left-0 top-[88px] max-h-[calc(100vh-88px)] w-full overflow-y-auto border-t border-white/[0.0824] !bg-[#0A0A0A]/[0.96] backdrop-blur-[24px] lg:hidden">
          <nav className="flex flex-col px-5 py-5 sm:px-6 sm:py-7">
            {navigation.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-[9px] text-[14px] font-medium sm:py-[11px] ${
                    isActive
                      ? "text-[#D4A853]"
                      : "!text-[#8F9A96] hover:text-[#F1EEE7]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-3 border-t border-white/[0.06] pt-5 sm:mt-4 sm:pt-6">
              <div className="mb-5 font-mono text-[11px] font-semibold text-[#00D4AA] sm:mb-6 sm:text-[12px]">
                ₣1 FAIX = $0.80 ↗2.4%
              </div>

              <Link
                to={ROUTES.LOGIN}
                onClick={() => setOpen(false)}
                className="mb-4 block text-[14px] font-medium !text-[#8F9A96] hover:!text-[#F1EEE7] sm:mb-5"
              >
                Sign In
              </Link>

              <Link
                to={ROUTES.LOGIN}
                onClick={() => setOpen(false)}
                className="flex h-[46px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#D4A853] to-[#B87333] text-[14px] font-semibold text-[#0A0A0A]"
              >
                Launch App
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}