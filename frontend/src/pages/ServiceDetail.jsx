import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Check, ArrowLeft } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { api } from "@/lib/api";
import { Reveal, Eyebrow } from "@/components/Reveal";
import Seo from "@/components/Seo";
import { FinalCta } from "@/pages/Home";
import NotFound from "@/pages/NotFound";

export default function ServiceDetail() {
  const { lang, slug } = useParams();
  const { t, bi } = useLang();
  const [service, setService] = useState(null);
  const [others, setOthers] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    setState("loading");
    api.get(`/public/services/${slug}`)
      .then((r) => { setService(r.data); setState("ok"); })
      .catch(() => setState("error"));
    api.get("/public/services").then((r) => setOthers((r.data || []).filter((s) => s.slug !== slug).slice(0, 3))).catch(() => {});
  }, [slug]);

  if (state === "error") return <NotFound />;
  if (state === "loading") return <div className="pt-40 pb-32 text-center text-zinc-500 font-mono-x text-sm">{t("common.loading")}</div>;

  const seo = service.seo || {};
  return (
    <>
      <Seo title={bi(seo.title) || bi(service.title)} description={bi(seo.description) || bi(service.short)} />
      <section className="pt-40 pb-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <Link to={`/${lang}/services`} data-testid="service-back" className="inline-flex items-center gap-2 text-xs font-mono-x uppercase tracking-[0.2em] text-zinc-500 hover:text-[#CCFF00] transition-colors mb-10">
            <ArrowLeft size={13} className="rtl:-scale-x-100" />
            {t("nav.services")}
          </Link>
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <Eyebrow>{t("services.eyebrow")}</Eyebrow>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tighter uppercase leading-[1.02]">{bi(service.title)}</h1>
              <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed">{bi(service.description)}</p>
              <Link to={`/${lang}/quote`} data-testid="service-quote-cta"
                    className="mt-9 inline-flex items-center gap-2 bg-[#CCFF00] text-[#08080A] font-extrabold uppercase tracking-wide text-sm px-7 py-4 hover:bg-[#E6FF66] transition-colors duration-300">
                {t("hero.ctaPrimary")}
                <ArrowUpRight size={16} strokeWidth={2.5} className="rtl:-scale-x-100" />
              </Link>
            </div>
            <div className="lg:col-span-5">
              <Reveal>
                <div className="border border-zinc-800 overflow-hidden">
                  <img src={service.image} alt={bi(service.title)} className="spotlight-img w-full aspect-[4/3] object-cover" />
                </div>
              </Reveal>
              {service.features?.length > 0 && (
                <Reveal delay={0.1}>
                  <div className="mt-8 border border-zinc-800 bg-[#0A0A0D] p-7">
                    <h2 className="font-mono-x text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-5">{t("services.featuresLabel")}</h2>
                    <ul className="space-y-3">
                      {service.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                          <Check size={15} className="text-[#CCFF00] shrink-0 mt-0.5" />
                          {bi(f)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="pb-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <h2 className="font-mono-x text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6">{t("services.related")}</h2>
          <div className="grid sm:grid-cols-3 gap-px bg-zinc-800/70 border border-zinc-800/70">
            {others.map((s) => (
              <Link key={s.slug} to={`/${lang}/services/${s.slug}`} data-testid={`related-service-${s.slug}`}
                    className="group bg-[#0A0A0D] p-6 hover:bg-[#101014] transition-colors duration-300">
                <h3 className="font-extrabold tracking-tight group-hover:text-[#CCFF00] transition-colors">{bi(s.title)}</h3>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-zinc-500 group-hover:text-[#CCFF00] transition-colors">
                  {t("services.learnMore")}
                  <ArrowUpRight size={12} className="rtl:-scale-x-100" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
