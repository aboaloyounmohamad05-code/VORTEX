import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Globe } from "lucide-react";
import { useLang } from "@/context/LangContext";

export function Logo({ className = "" }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
        <rect width="64" height="64" rx="10" fill="#CCFF00" />
        <path d="M14 14h11l7 22 7-22h11L37.5 50h-11L14 14z" fill="#08080A" />
      </svg>
      <span className="font-extrabold tracking-tighter text-lg leading-none">VORTEX</span>
    </span>
  );
}

export default function Navbar() {
  const { lang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const other = lang === "en" ? "ar" : "en";
  const switchLang = () => {
    const rest = location.pathname.replace(/^\/(en|ar)/, "");
    navigate(`/${other}${rest}${location.search}`);
  };

  const links = [
    { to: `/${lang}`, label: t("nav.home"), end: true, id: "nav-home" },
    { to: `/${lang}/services`, label: t("nav.services"), id: "nav-services" },
    { to: `/${lang}/portfolio`, label: t("nav.work"), id: "nav-work" },
    { to: `/${lang}/pricing`, label: t("nav.pricing"), id: "nav-pricing" },
    { to: `/${lang}/about`, label: t("nav.about"), id: "nav-about" },
    { to: `/${lang}/contact`, label: t("nav.contact"), id: "nav-contact" },
  ];

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 border-b ${
        scrolled ? "bg-[#08080A]/85 backdrop-blur-xl border-zinc-800/80" : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between gap-4">
        <Link to={`/${lang}`} data-testid="nav-logo" aria-label="VORTEX home">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.id}
              to={l.to}
              end={l.end}
              data-testid={l.id}
              className={({ isActive }) =>
                `text-[13px] font-semibold tracking-wide uppercase transition-colors duration-300 hover:text-[#CCFF00] ${
                  isActive ? "text-[#CCFF00]" : "text-zinc-400"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            data-testid="lang-switcher"
            onClick={switchLang}
            className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold font-mono-x uppercase border border-zinc-700 hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors duration-300 rounded-none"
            aria-label="Switch language"
          >
            <Globe size={14} strokeWidth={2.2} />
            {t("nav.switchTo")}
          </button>
          <Link
            to={`/${lang}/quote`}
            data-testid="nav-cta"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#CCFF00] text-[#08080A] text-[13px] font-extrabold uppercase tracking-wide px-4 py-2.5 hover:bg-[#E6FF66] transition-colors duration-300"
          >
            {t("nav.startProject")}
            <ArrowUpRight size={15} strokeWidth={2.5} className="rtl:-scale-x-100" />
          </Link>
          <button
            data-testid="mobile-menu-button"
            className="lg:hidden p-2 text-zinc-200"
            onClick={() => setOpen(!open)}
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            data-testid="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#08080A]/97 backdrop-blur-xl border-b border-zinc-800 px-5 pb-8 pt-2 flex flex-col gap-1"
            aria-label="Mobile"
          >
            {links.map((l) => (
              <NavLink
                key={l.id}
                to={l.to}
                end={l.end}
                data-testid={`mobile-${l.id}`}
                className={({ isActive }) =>
                  `py-3 text-2xl font-extrabold tracking-tight uppercase border-b border-zinc-900 ${
                    isActive ? "text-[#CCFF00]" : "text-zinc-200"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to={`/${lang}/quote`}
              data-testid="mobile-nav-cta"
              className="mt-5 inline-flex items-center justify-center gap-2 bg-[#CCFF00] text-[#08080A] font-extrabold uppercase tracking-wide px-5 py-4"
            >
              {t("nav.startProject")}
              <ArrowUpRight size={16} className="rtl:-scale-x-100" />
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
