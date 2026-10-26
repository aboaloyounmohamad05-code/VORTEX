import { Link } from "react-router-dom";
import { useLang } from "@/context/LangContext";
import Seo from "@/components/Seo";
import { Logo } from "@/components/Navbar";

export default function NotFound({ standalone = false }) {
  const { lang, t } = useLang();
  const content = (
    <section className="min-h-[80vh] flex items-center justify-center px-5">
      <div className="text-center max-w-lg">
        <p className="font-mono-x text-xs uppercase tracking-[0.3em] text-[#CCFF00] mb-6">Error 404</p>
        <h1 data-testid="notfound-title" className="text-4xl sm:text-6xl font-extrabold tracking-tighter uppercase">{t("notfound.title")}</h1>
        <p className="mt-5 text-zinc-400">{t("notfound.desc")}</p>
        <Link to={`/${lang}`} data-testid="notfound-home"
              className="mt-9 inline-flex items-center gap-2 bg-[#CCFF00] text-[#08080A] font-extrabold uppercase tracking-wide text-sm px-7 py-4 hover:bg-[#E6FF66] transition-colors duration-300">
          {t("notfound.cta")}
        </Link>
      </div>
    </section>
  );
  if (standalone) {
    return (
      <div className="min-h-screen bg-[#08080A] text-[#F7F7F4]">
        <Seo title="404 — VORTEX" />
        <div className="p-6"><Logo /></div>
        {content}
      </div>
    );
  }
  return (
    <>
      <Seo title="404 — VORTEX" />
      {content}
    </>
  );
}
