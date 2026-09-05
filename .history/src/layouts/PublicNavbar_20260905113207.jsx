import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "../constants/routes";
import { publicNavigation } from "../constants/navigation";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-[88px] border-b border-white/5 bg-[#181817]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1280px] items-center px-6 lg:px-0">
        <Link
          to={ROUTES.HOME}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9a64a] bg-[#151515] font-serif text-xl text-[#d9a64a]">
            M
          </div>

          <span className="font-serif text-[18px] tracking-tight text-white">
            METALAN WEALTH
          </span>
        </Link>

        <nav className="ml-[135px] hidden items-center gap-[39px] lg:flex">
          {publicNavigation.slice(0, 4).map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `text-[14px] font-medium transition ${
                  isActive
                    ? "text-white"
                    : "text-[#969690] hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-8 lg:flex">
          <div className="font-mono text-[13px] font-semibold text-[#00e5c3]">
            F1 FAIX = $0.80 ↑2.4%
          </div>

          <Link
            to={ROUTES.LOGIN}
            className="text-[14px] font-medium text-[#d9a64a] transition hover:text-white"
          >
            Sign In
          </Link>

          <Link
            to={ROUTES.LOGIN}
            className="flex h-11 min-w-[129px] items-center justify-center rounded-full bg-[#d9a64a] px-7 text-[14px] font-semibold text-black transition hover:bg-[#e3b45d]"
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
        <div className="border-t border-white/10 bg-[#181817] px-6 py-5 lg:hidden">
          <nav className="flex flex-col gap-5">
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-[#b0b0aa]"
              >
                {item.label}
              </Link>
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