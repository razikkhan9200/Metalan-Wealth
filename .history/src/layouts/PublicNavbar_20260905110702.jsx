import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "../constants/routes";
import { publicNavigation } from "../constants/navigation";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-[#171717]/80 backdrop-blur-md">
      <div className="mx-auto flex h-[88px] max-w-[1280px] items-center justify-between px-6 lg:px-10">

        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D9A441] text-xl font-serif text-[#D9A441]">
            M
          </div>

          <span className="font-serif text-[17px] tracking-wide text-white">
            METALAN WEALTH
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-9 lg:flex">
          {publicNavigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `text-[13px] transition ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden items-center gap-8 lg:flex">

          <div className="font-mono text-[12px] font-semibold text-[#00e0c6]">
            ₣1 FAIX = $0.80 ↗2.4%
          </div>

          <Link
            to={ROUTES.LOGIN}
            className="text-[13px] font-medium text-[#D9A441] transition hover:text-white"
          >
            Sign In
          </Link>

          <Link
            to={ROUTES.LOGIN}
            className="rounded-full bg-gradient-to-r from-[#DDAE52] to-[#C98232] px-7 py-3 text-[13px] font-semibold text-black transition hover:scale-105"
          >
            Launch App
          </Link>

        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg border border-white/20 p-2 text-white lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-white/10 bg-[#171717]/95 px-6 py-6 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-5">

            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="text-sm text-gray-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 border-t border-white/10 pt-5">

              <div className="mb-4 font-mono text-xs text-[#00e0c6]">
                ₣1 FAIX = $0.80 ↗2.4%
              </div>

              <Link
                to={ROUTES.LOGIN}
                onClick={() => setOpen(false)}
                className="mb-3 block text-sm text-[#D9A441]"
              >
                Sign In
              </Link>

              <Link
                to={ROUTES.LOGIN}
                onClick={() => setOpen(false)}
                className="block rounded-full bg-gradient-to-r from-[#DDAE52] to-[#C98232] py-3 text-center text-sm font-semibold text-black"
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