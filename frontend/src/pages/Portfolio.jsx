import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { api } from "@/lib/api";
import { Reveal, Eyebrow } from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import Seo from "@/components/Seo";
import { FinalCta } from "@/pages/Home";

const CATS = ["all", "restaurants", "hospitality", "ecommerce", "corporate", "real-estate", "professional-services"];

export default function Portfolio() {
  const { t } = useLang();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/public/projects").then((r) => setProjects(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <Seo title={`${t("nav.work")} — VORTEX`} description={t("portfolio.sub")} />
      <section className="pt-40 pb-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <Eyebrow>{t("portfolio.eyebrow")}</Eyebrow>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter uppercase">{t("portfolio.heading")}</h1>
          <p className="mt-5 text-zinc-400 max-w-2xl text-base sm:text-lg">{t("portfolio.sub")}</p>
          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Project filters">
            {CATS.map((c) => (
              <button
                key={c}
                data-testid={`filter-${c}`}
                role="tab"
                aria-selected={filter === c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 text-[12px] font-extrabold uppercase tracking-widest border transition-colors duration-300 ${
                  filter === c ? "bg-[#CCFF00] text-[#08080A] border-[#CCFF00]" : "border-zinc-700 text-zinc-400 hover:border-[#CCFF00] hover:text-[#CCFF00]"
                }`}
              >
                {t(`portfolio.filters.${c}`)}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="pb-24 min-h-[300px]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          {loading ? (
            <p className="text-zinc-500 font-mono-x text-sm" data-testid="portfolio-loading">{t("common.loading")}</p>
          ) : filtered.length === 0 ? (
            <p className="text-zinc-500" data-testid="portfolio-empty">{t("portfolio.empty")}</p>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <motion.div key={p.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                  <ProjectCard project={p} index={i} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      <Reveal><div /></Reveal>
      <FinalCta />
    </>
  );
}
