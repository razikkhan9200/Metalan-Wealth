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
    <header className="absolute left-0 top-0 z-50 w-full border-b border-white/[0.06] bg-[#171717]/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[88px] w-full max-w-[1280px] items-center px-6 lg:px-[1900px]">

        <Link
          to={ROUTES.HOME}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-[#D4A853] bg-[#1A3C34]">
            <span className="font-serif text-[18px] leading-none text-[#D4A853]">
              M
            </span>
          </div>

          <span className="whitespace-nowrap font-serif text-[16px] tracking-[-0.2px] text-[#F1EEE7]">
            METALAN WEALTH
          </span>
        </Link>

        <nav className="ml-[120px] hidden h-full items-center gap-[39px] lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `text-[13px] font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-[#D4A853]"
                    : "text-[#8F8F8A] hover:text-[#F1EEE7]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-[31px] lg:flex">

          <div className="whitespace-nowrap font-mono text-[12px] font-semibold tracking-[-0.2px] text-[#00D4AA]">
            ₣1 FAIX = $0.80 ↗2.4%
          </div>

          <Link
            to={ROUTES.LOGIN}
            className="whitespace-nowrap text-[13px] font-medium text-[#D4A853] transition-colors duration-200 hover:text-[#F1EEE7]"
          >
            Sign In
          </Link>

          <Link
            to={ROUTES.LOGIN}
            className="flex h-[42px] min-w-[129px] items-center justify-center rounded-full bg-[#D4A853] px-[25px] text-[13px] font-semibold text-[#0A0A0A] transition-transform duration-200 hover:scale-[1.03]"
          >
            Launch App
          </Link>

        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="ml-auto flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-white/[0.10] bg-[#181817] text-white lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="absolute left-0 top-[88px] w-full border-t border-white/[0.06] bg-[#0A0A0A] lg:hidden">
          <nav className="flex flex-col px-6 py-7">

            {navigation.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-[11px] text-[14px] font-medium ${
                    isActive
                      ? "text-[#D4A853]"
                      : "text-[#8F8F8A] hover:text-[#F1EEE7]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-4 border-t border-white/[0.06] pt-6">

              <div className="mb-6 font-mono text-[12px] font-semibold text-[#00D4AA]">
                ₣1 FAIX = $0.80 ↗2.4%
              </div>

              <Link
                to={ROUTES.LOGIN}
                onClick={() => setOpen(false)}
                className="mb-5 block text-[14px] font-medium text-[#8F8F8A] hover:text-[#F1EEE7]"
              >
                Sign In
              </Link>

              <Link
                to={ROUTES.LOGIN}
                onClick={() => setOpen(false)}
                className="flex h-[46px] w-full items-center justify-center rounded-full bg-[#D4A853] text-[14px] font-semibold text-[#0A0A0A]"
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