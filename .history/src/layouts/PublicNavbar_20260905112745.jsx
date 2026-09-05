import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "../constants/routes";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 h-[88px] border-b border-white/5 bg-[#171716]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6 lg:px-8">
        <Link
          to={ROUTES.HOME}
          className="flex shrink-0 items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-[#d9a64a] text-[19px] font-serif text-[#d9a64a]">
            M
          </span>

          <span className="font-serif text-[16px] tracking-wide text-white">
            METALAN WEALTH
          </span>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          <Link
            to={ROUTES.HOME}
            className="text-[13px] text-white/55 transition hover:text-white"
          >
            Platform
          </Link>

          <Link
            to={ROUTES.PROPERTIES}
            className="text-[13px] text-white/55 transition hover:text-white"
          >
            Investments
          </Link>

          <Link
            to={ROUTES.EXCHANGE}
            className="text-[13px] text-white/55 transition hover:text-white"
          >
            Blockchain
          </Link>

          <Link
            to={ROUTES.ABOUT}
            className="text-[13px] text-white/55 transition hover:text-white"
          >
            About
          </Link>
        </nav>

        <div className="hidden items-center gap-9 lg:flex">
          <span className="font-mono text-[12px] font-semibold text-[#00e5c3]">
            F1 FAIX = $0.80 ▲2.4%
          </span>

          <Link
            to={ROUTES.LOGIN}
            className="text-[13px] font-medium text-[#d9a64a] transition hover:text-white"
          >
            Sign In
          </Link>

          <Link
            to={ROUTES.LOGIN}
            className="rounded-full bg-[#d9a64a] px-7 py-3 text-[13px] font-semibold text-black transition hover:bg-[#e4b65d]"
          >
            Launch App
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg border border-white/10 p-2 text-white lg:hidden"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#171716] px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-5">
            <Link
              to={ROUTES.HOME}
              onClick={() => setOpen(false)}
              className="text-sm text-white/70"
            >
              Platform
            </Link>

            <Link
              to={ROUTES.PROPERTIES}
              onClick={() => setOpen(false)}
              className="text-sm text-white/70"
            >
              Investments
            </Link>

            <Link
              to={ROUTES.EXCHANGE}
              onClick={() => setOpen(false)}
              className="text-sm text-white/70"
            >
              Blockchain
            </Link>

            <Link
              to={ROUTES.ABOUT}
              onClick={() => setOpen(false)}
              className="text-sm text-white/70"
            >
              About
            </Link>

            <Link
              to={ROUTES.LOGIN}
              onClick={() => setOpen(false)}
              className="mt-2 w-full rounded-full bg-[#d9a64a] px-6 py-3 text-center text-sm font-semibold text-black"
            >
              Launch App
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}