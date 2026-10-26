import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { api } from "@/lib/api";
import { Reveal, Eyebrow } from "@/components/Reveal";
import Seo from "@/components/Seo";
import { FinalCta, ICONS } from "@/pages/Home";

export default function Services() {
  const { lang, t, bi } = useLang();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/public/services").then((r) => setServices(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Seo title={`${t("nav.services")} — VORTEX`} description={t("services.sub")} />
      <section className="pt-40 pb-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <Eyebrow>{t("services.eyebrow")}</Eyebrow>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter uppercase">{t("services.heading")}</h1>
          <p className="mt-5 text-zinc-400 max-w-2xl text-base sm:text-lg">{t("services.sub")}</p>
        </div>
      </section>
      <section className="pb-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          {loading ? (
            <p className="text-zinc-500 font-mono-x text-sm" data-testid="services-loading">{t("common.loading")}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800/70 border border-zinc-800/70">
              {services.map((s, i) => {
                const Icon = ICONS[s.icon] || ICONS.Palette;
                return (
                  <Reveal key={s.slug} delay={(i % 3) * 0.06} className="bg-[#0A0A0D]">
                    <Link to={`/${lang}/services/${s.slug}`} data-testid={`service-card-${s.slug}`}
                          className="group flex flex-col h-full p-7 sm:p-8 hover:bg-[#101014] transition-colors duration-300">
                      <div className="flex items-start justify-between mb-8">
                        <Icon size={26} strokeWidth={1.6} className="text-[#CCFF00]" />
                        <span className="font-mono-x text-xs text-zinc-600">{String(s.display_order).padStart(2, "0")}</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold tracking-tight mb-3 group-hover:text-[#CCFF00] transition-colors duration-300">{bi(s.title)}</h2>
                      <p className="text-sm text-zinc-400 leading-relaxed flex-1">{bi(s.short)}</p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-zinc-500 group-hover:text-[#CCFF00] transition-colors duration-300">
                        {t("services.learnMore")}
                        <ArrowUpRight size={13} className="rtl:-scale-x-100" />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
