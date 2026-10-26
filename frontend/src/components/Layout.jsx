import { useEffect } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { useLang } from "@/context/LangContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";

export default function LangLayout() {
  const { lang } = useParams();
  const { lang: current, setLang } = useLang();
  const location = useLocation();
  const valid = lang === "en" || lang === "ar";

  useEffect(() => {
    if (valid && lang !== current) setLang(lang);
  }, [lang, valid, current, setLang]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  if (!valid) return <NotFound standalone />;

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F7F7F4]" key={lang}>
      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
