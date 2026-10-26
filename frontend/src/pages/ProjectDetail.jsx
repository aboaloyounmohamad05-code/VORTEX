import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { api } from "@/lib/api";
import { Reveal, Eyebrow } from "@/components/Reveal";
import Seo from "@/components/Seo";
import { FinalCta } from "@/pages/Home";
import NotFound from "@/pages/NotFound";

export default function ProjectDetail() {
  const { lang, slug } = useParams();
  const { t, bi } = useLang();
  const [project, setProject] = useState(null);
  const [next, setNext] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    setState("loading");
    api.get(`/public/projects/${slug}`)
      .then((r) => { setProject(r.data); setState("ok"); })
      .catch(() => setState("error"));
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    api.get("/public/projects").then((r) => {
      const list = r.data || [];
      const idx = list.findIndex((p) => p.slug === slug);
      setNext(list[(idx + 1) % list.length] || null);
    }).catch(() => {});
  }, [project, slug]);

  if (state === "error") return <NotFound />;
  if (state === "loading") return <div className="pt-40 pb-32 text-center text-zinc-500 font-mono-x text-sm">{t("common.loading")}</div>;

  const seo = project.seo || {};
  const sections = [
    { label: t("caseStudy.objectives"), value: bi(project.objectives) },
    { label: t("caseStudy.approach"), value: bi(project.approach) },
    { label: t("caseStudy.challenges"), value: bi(project.challenges) },
  ].filter((s) => s.value);

  return (
    <>
      <Seo title={bi(seo.title) || bi(project.title)} description={bi(seo.description) || bi(project.short)} />
      <section className="pt-40 pb-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <Link to={`/${lang}/portfolio`} data-testid="case-back" className="inline-flex items-center gap-2 text-xs font-mono-x uppercase tracking-[0.2em] text-zinc-500 hover:text-[#CCFF00] transition-colors mb-10">
            <ArrowLeft size={13} className="rtl:-scale-x-100" />
            {t("caseStudy.backToWork")}
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="font-mono-x text-[10px] uppercase tracking-[0.25em] text-zinc-500 border border-zinc-700 px-3 py-1.5">
              {t(`portfolio.filters.${project.category}`)}
            </span>
            {project.is_concept && (
              <span data-testid="case-concept-badge" className="font-mono-x text-[10px] uppercase tracking-[0.25em] text-[#CCFF00] border border-[#CCFF00]/50 px-3 py-1.5">
                {t("portfolio.concept")}
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter uppercase leading-[1.02]">{bi(project.title)}</h1>
          <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl">{bi(project.description)}</p>
          {project.is_concept && (
            <p className="mt-5 text-xs text-zinc-500 border-s-2 border-[#CCFF00]/50 ps-4 max-w-2xl" data-testid="case-concept-note">
              {t("caseStudy.conceptNote")}
            </p>
          )}
          {project.preview_url && (
            <a href={project.preview_url} target="_blank" rel="noopener noreferrer" data-testid="case-preview-link"
               className="mt-8 inline-flex items-center gap-2 border border-[#CCFF00] text-[#CCFF00] font-extrabold uppercase tracking-wide text-sm px-6 py-3.5 hover:bg-[#CCFF00] hover:text-[#08080A] transition-colors duration-300">
              {t("caseStudy.visit")}
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="border border-zinc-800 overflow-hidden">
              <img src={project.image} alt={bi(project.title)} className="spotlight-img w-full aspect-[16/8] object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-10">
            {bi(project.overview) && (
              <Reveal>
                <h2 className="font-mono-x text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-4">{t("caseStudy.overview")}</h2>
                <p className="text-zinc-300 leading-relaxed">{bi(project.overview)}</p>
              </Reveal>
            )}
            {sections.map((s, i) => (
              <Reveal key={i} delay={0.05}>
                <h2 className="font-mono-x text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-4">{s.label}</h2>
                <p className="text-zinc-300 leading-relaxed">{s.value}</p>
              </Reveal>
            ))}
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="border border-zinc-800 bg-[#0A0A0D] p-7">
                <h2 className="font-mono-x text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-5">{t("caseStudy.features")}</h2>
                <ul className="space-y-3">
                  {(project.features || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <Check size={15} className="text-[#CCFF00] shrink-0 mt-0.5" />
                      {bi(f)}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {(project.gallery || []).length > 1 && (
        <section className="pb-20">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 grid sm:grid-cols-2 gap-6">
            {project.gallery.map((g, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="border border-zinc-800 overflow-hidden">
                  <img src={g} alt="" loading="lazy" className="spotlight-img w-full aspect-[4/3] object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {next && next.slug !== project.slug && (
        <section className="border-t border-zinc-800/70">
          <Link to={`/${lang}/portfolio/${next.slug}`} data-testid="case-next-project"
                className="group block max-w-[1400px] mx-auto px-5 sm:px-8 py-16">
            <p className="font-mono-x text-xs uppercase tracking-[0.25em] text-zinc-500 mb-3">{t("caseStudy.nextProject")}</p>
            <span className="inline-flex items-center gap-3 text-3xl sm:text-4xl font-extrabold tracking-tighter uppercase group-hover:text-[#CCFF00] transition-colors duration-300">
              {bi(next.title)}
              <ArrowUpRight size={30} className="rtl:-scale-x-100" />
            </span>
          </Link>
        </section>
      )}
      <FinalCta />
    </>
  );
}
