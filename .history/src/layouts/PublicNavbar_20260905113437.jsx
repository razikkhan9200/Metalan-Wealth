import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "../constants/routes";

const navigation = [
  { label: "Platform", href: ROUTES.HOME },
  { label: "Investments", href: ROUTES.PROPERTIES },
  { label: "Blockchain", href: ROUTES.FUNDS },
  { label: "About", href: ROUTES.ABOUT },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-[88px] border-b border-white/[0.06] bg-[#1b1b1a]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[88px] w-full max-w-[1280px] items-center px-6 lg:px-0">
        <Link
          to={ROUTES.HOME}
          className="flex shrink-0 items-center gap-[12px]"
        >
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-[#d9a64a] bg-[#181817]">
            <span className="font-serif text-[18px] text-[#d9a64a]">M</span>
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
                `whitespace-nowrap text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-[#d9a64a]"
                    : "text-[#969690] hover:text-[#f1eee7]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-[31px] lg:flex">
          <span className="whitespace-nowrap font-mono text-[12px] font-semibold text-[#00e5c3]">
            F1 FAIX = $0.80 ↑2.4%
          </span>

          <Link
            to={ROUTES.LOGIN}
            className="whitespace-nowrap text-[13px] font-medium text-[#d9a64a] transition-colors hover:text-[#f1eee7]"
          >
            Sign In
          </Link>

          <Link
            to={ROUTES.LOGIN}
            className="flex h-[42px] min-w-[129px] items-center justify-center rounded-full bg-[#d9a64a] px-[25px] text-[13px] font-semibold text-[#11110f] transition-transform hover:scale-[1.02]"
          >
            Launch App
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto rounded-lg border border-white/10 p-2 text-white lg:hidden"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#1b1b1a] px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-5">
            {navigation.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-[#b5b5ae]"
              >
                {item.label}
              </NavLink>
            ))}

            <Link
              to={ROUTES.LOGIN}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-[#d9a64a]"
            >
              Sign In
            </Link>

            <Link
              to={ROUTES.LOGIN}
              onClick={() => setOpen(false)}
              className="flex h-11 items-center justify-center rounded-full bg-[#d9a64a] font-semibold text-black"
            >
              Launch App
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}