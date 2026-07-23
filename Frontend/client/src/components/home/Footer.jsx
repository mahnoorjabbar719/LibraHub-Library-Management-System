import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiGithub,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="border-t border-white/10 bg-[#07111b] px-5 pb-8 pt-16 text-white sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 xl:grid-cols-[1.25fr_0.75fr_0.75fr_1fr]">
          <div>
            <a href="#home" className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-2xl text-emerald-400">
                <FiBookOpen />
              </div>

              <div>
                <h2 className="text-xl font-bold">LibraHub</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Smart Library Management System
                </p>
              </div>
            </a>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
              A secure MERN stack platform for managing books, users,
              borrowing records, returns, reports, and profiles.
            </p>

            <a
              href="#home"
              className="mt-6 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:border-emerald-400/30 hover:text-emerald-300"
            >
              Back to top
            </a>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Platform
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              {[
                ["Home", "#home"],
                ["Features", "#features"],
                ["Books", "#books"],
                ["About", "#about"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="w-fit text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Account
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/login"
                className="w-fit text-sm text-slate-400 transition hover:text-emerald-400"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="w-fit text-sm text-slate-400 transition hover:text-emerald-400"
              >
                Create Account
              </Link>

              <Link
                to="/student/dashboard"
                className="w-fit text-sm text-slate-400 transition hover:text-emerald-400"
              >
                Student Portal
              </Link>

              <Link
                to="/admin/dashboard"
                className="w-fit text-sm text-slate-400 transition hover:text-emerald-400"
              >
                Admin Portal
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Contact
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <FiMapPin className="mt-0.5 shrink-0 text-emerald-400" />
                <span>Gujrat, Pakistan</span>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-400">
                <FiMail className="mt-0.5 shrink-0 text-emerald-400" />
                <span>support@librahub.com</span>
              </div>

              <div className="flex items-start gap-3 text-sm text-slate-400">
                <FiPhone className="mt-0.5 shrink-0 text-emerald-400" />
                <span>Library Support</span>
              </div>
            </div>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <FiGithub />
              GitHub
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} LibraHub. All rights reserved.
          </p>

          <p>
            Built with React, Tailwind CSS, Node.js, Express, and MongoDB.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;