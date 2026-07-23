import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "Books", href: "#books" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-2xl text-emerald-400">
            <FiBookOpen />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">
              LibraHub
            </h1>

            <p className="text-[11px] text-slate-400">
              Smart Library System
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-emerald-400"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-bold text-white transition hover:border-emerald-400/50 hover:bg-white/5"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-500"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((currentValue) => !currentValue)}
          className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-xl text-white transition hover:bg-white/15 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-emerald-400"
              >
                {item.label}
              </a>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-bold text-white"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-bold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;