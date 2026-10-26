import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/context/LangContext";

export default function ProjectCard({ project, index = 0 }) {
  const { lang, t, bi } = useLang();
  return (
    <Link
      to={`/${lang}/portfolio/${project.slug}`}
      data-testid={`project-card-${project.slug}`}
      className="group relative block border border-zinc-800/80 bg-[#0C0C0F] overflow-hidden transition-transform duration-500 hover:-translate-y-1.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={project.image}
          alt={bi(project.title)}
          loading={index > 2 ? "lazy" : undefined}
          className="spotlight-img w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-transparent opacity-80" />
        {project.is_concept && (
          <span className="absolute top-4 start-4 font-mono-x text-[10px] uppercase tracking-[0.2em] bg-[#08080A]/85 backdrop-blur border border-[#CCFF00]/40 text-[#CCFF00] px-2.5 py-1">
            {t("portfolio.concept")}
          </span>
        )}
      </div>
      <div className="p-6">
        <p className="font-mono-x text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">
          {t(`portfolio.filters.${project.category}`)}
        </p>
        <h3 className="text-xl font-extrabold tracking-tight mb-2 group-hover:text-[#CCFF00] transition-colors duration-300">
          {bi(project.title)}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-4">{bi(project.short)}</p>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-widest text-[#CCFF00]">
          {t("portfolio.viewProject")}
          <ArrowUpRight size={14} className="rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
