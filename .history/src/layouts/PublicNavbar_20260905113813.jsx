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
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#1b1b1a]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[88px] w-full max-w-[1280px] items-center px-6 lg:px-8">
        <Link
          to={ROUTES.HOME}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-[#d9a64a] bg-[#181817]">
            <span className="font-serif text-[18px] text-[#d9a64a]">
              M
            </span>
          </div>

          <span className="whitespace-nowrap font-serif text-[16px] tracking-[-0.2px] text-[#f1eee7]">
            METALAN WEALTH
          </span>
        </Link>

        <nav className="ml-[120px] hidden h-full items-center gap-[39px] lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-[#d9a64a]"
                    : "text-[#92928e] hover:text-[#f1eee7]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-[31px] lg:flex">
          <div className="whitespace-nowrap font-mono text-[12px] font-semibold text-[#00e5c7]">
            ₣1 FAIX = $0.80 ↗2.4%
          </div>

          <Link
            to={ROUTES.LOGIN}
            className="whitespace-nowrap text-[13px] font-medium text-[#d9a64a] transition-colors hover:text-[#f1eee7]"
          >
            Sign In
          </Link>

          <Link
            to={ROUTES.LOGIN}
            className="flex h-[42px] items-center justify-center rounded-full bg-gradient-to-r from-[#e0ad4c] to-[#c98236] px-[25px] text-[13px] font-semibold text-[#11110f] transition-transform duration-200 hover:scale-[1.03]"
          >
            Launch App
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="ml-auto flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-white/10 bg-[#181817] text-white lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.06] bg-[#1b1b1a] px-6 py-6 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-5">
            {navigation.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-[14px] font-medium ${
                    isActive
                      ? "text-[#d9a64a]"
                      : "text-[#a4a49f]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-2 border-t border-white/[0.06] pt-5">
              <div className="mb-5 font-mono text-[12px] font-semibold text-[#00e5c7]">
                ₣1 FAIX = $0.80 ↗2.4%
              </div>

              <Link
                to={ROUTES.LOGIN}
                onClick={() => setOpen(false)}
                className="mb-4 block text-[14px] font-medium text-[#d9a64a]"
              >
                Sign In
              </Link>

              <Link
                to={ROUTES.LOGIN}
                onClick={() => setOpen(false)}
                className="flex h-[46px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#e0ad4c] to-[#c98236] text-[14px] font-semibold text-[#11110f]"
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