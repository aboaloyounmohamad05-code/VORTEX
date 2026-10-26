import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowDown, Plus, Check, Palette, UtensilsCrossed, BedDouble, Building2, ShoppingBag, Store, Rocket, KeyRound, Stethoscope, RefreshCw, TrendingUp, Wrench } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { api } from "@/lib/api";
import { Reveal, MaskLines, Eyebrow } from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import ProjectCard from "@/components/ProjectCard";
import Seo from "@/components/Seo";

export const ICONS = { Palette, UtensilsCrossed, BedDouble, Building2, ShoppingBag, Store, Rocket, KeyRound, Stethoscope, RefreshCw, TrendingUp, Wrench };

function Hero() {
  const { t, lang } = useLang();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const yImg2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  return (
    <section ref={ref} data-testid="hero" className="relative min-h-[100svh] flex items-center overflow-hidden pt-[72px]">
      <div className="absolute inset-0 opacity-[0.13]" aria-hidden="true"
           style={{ backgroundImage: "linear-gradient(#27272A 1px, transparent 1px), linear-gradient(90deg, #27272A 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 grid lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        <div className="lg:col-span-7">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono-x text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#CCFF00] mb-7"
          >
            {t("hero.eyebrow")}
          </motion.p>
          <h1 className="text-[11.5vw] sm:text-6xl lg:text-[4.6rem] xl:text-[5.2rem] font-extrabold tracking-tighter leading-[0.98] uppercase">
            <MaskLines
              lines={t("hero.lines")}
              lineClassName={lang === "ar" ? "leading-[1.15]" : ""}
            />
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-7 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl"
          >
            {t("hero.sub")}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link to={`/${lang}/quote`} data-testid="hero-cta-primary"
                  className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#08080A] font-extrabold uppercase tracking-wide text-sm px-7 py-4 hover:bg-[#E6FF66] hover:shadow-[0_0_40px_rgba(204,255,0,0.25)] transition-all duration-300">
              {t("hero.ctaPrimary")}
              <ArrowUpRight size={17} strokeWidth={2.5} className="rtl:-scale-x-100" />
            </Link>
            <Link to={`/${lang}/portfolio`} data-testid="hero-cta-secondary"
                  className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-200 font-extrabold uppercase tracking-wide text-sm px-7 py-4 hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors duration-300 bg-[#08080A]/40 backdrop-blur">
              {t("hero.ctaSecondary")}
            </Link>
          </motion.div>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-8 font-mono-x text-[11px] uppercase tracking-[0.3em] text-zinc-500"
          >
            {t("hero.tagline")}
          </motion.p>
        </div>

        <div className="lg:col-span-5 relative hidden md:block" aria-hidden="true">
          <motion.div style={{ y: yImg }} className="relative z-10">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 40, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="border border-zinc-700/80 shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <img src="https://images.pexels.com/photos/12936940/pexels-photo-12936940.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                   alt="" className="spotlight-img w-full aspect-[4/3] object-cover" />
            </motion.div>
          </motion.div>
          <motion.div style={{ y: yImg2 }} className="absolute -bottom-16 -end-8 w-2/3 z-20">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 60, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ duration: 1, delay: 0.75 }}
              className="border-2 border-[#CCFF00]/60 shadow-[0_40px_80px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              <img src="https://images.pexels.com/photos/19876064/pexels-photo-19876064.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                   alt="" className="spotlight-img w-full aspect-[3/4] object-cover" />
            </motion.div>
          </motion.div>
          <div className="absolute -top-10 -start-6 w-24 h-24 border border-[#CCFF00]/30 z-0" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 start-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600"
        aria-hidden="true"
      >
        <span className="font-mono-x text-[10px] uppercase tracking-[0.3em]">{t("hero.scroll")}</span>
        <ArrowDown size={14} className="animate-bounce" />
      </motion.div>
    </section>
  );
}

function ServicesSection({ preview = false }) {
  const { lang, t, bi } = useLang();
  const [services, setServices] = useState([]);
  useEffect(() => {
    api.get("/public/services").then((r) => setServices(r.data || [])).catch(() => {});
  }, []);
  const list = preview ? services.slice(0, 6) : services;

  return (
    <section data-testid="services-section" className="py-24 sm:py-32">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <Reveal>
          <Eyebrow>{t("services.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase">{t("services.heading")}</h2>
          <p className="mt-4 text-zinc-400 max-w-2xl">{t("services.sub")}</p>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800/70 border border-zinc-800/70">
          {list.map((s, i) => {
            const Icon = ICONS[s.icon] || Palette;
            return (
              <Reveal key={s.slug} delay={(i % 3) * 0.08} className="bg-[#0A0A0D]">
                <Link
                  to={`/${lang}/services/${s.slug}`}
                  data-testid={`service-card-${s.slug}`}
                  className="group flex flex-col h-full p-7 sm:p-8 hover:bg-[#101014] transition-colors duration-300"
                >
                  <div className="flex items-start justify-between mb-8">
                    <Icon size={26} strokeWidth={1.6} className="text-[#CCFF00]" />
                    <span className="font-mono-x text-xs text-zinc-600">{String(s.display_order).padStart(2, "0")}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mb-3 group-hover:text-[#CCFF00] transition-colors duration-300">
                    {bi(s.title)}
                  </h3>
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
        {preview && (
          <Reveal className="mt-10 text-center">
            <Link to={`/${lang}/services`} data-testid="services-view-all"
                  className="inline-flex items-center gap-2 border border-zinc-700 px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors duration-300">
              {t("services.viewAll")}
              <ArrowUpRight size={15} className="rtl:-scale-x-100" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Industries() {
  const { t } = useLang();
  return (
    <section data-testid="industries-section" className="py-24 sm:py-32 bg-[#0A0A0D] border-y border-zinc-800/70">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <Reveal>
          <Eyebrow>{t("industries.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase max-w-3xl">{t("industries.heading")}</h2>
          <p className="mt-4 text-zinc-400 max-w-2xl">{t("industries.sub")}</p>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-zinc-800/60 border border-zinc-800/60">
          {t("industries.items").map((item, i) => (
            <Reveal key={i} delay={(i % 5) * 0.06} className="bg-[#08080A]">
              <div className="p-6 h-full hover:bg-[#101014] transition-colors duration-300 group">
                <span className="font-mono-x text-[10px] text-zinc-600 group-hover:text-[#CCFF00] transition-colors">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-extrabold tracking-tight mb-2">{item.name}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-8 text-xs text-zinc-500 max-w-3xl leading-relaxed border-s-2 border-[#CCFF00]/50 ps-4">{t("industries.note")}</p>
        </Reveal>
      </div>
    </section>
  );
}

function WorkPreview() {
  const { lang, t } = useLang();
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    api.get("/public/projects").then((r) => setProjects((r.data || []).slice(0, 3))).catch(() => {});
  }, []);
  return (
    <section data-testid="work-preview" className="py-24 sm:py-32">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{t("portfolio.eyebrow")}</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase">{t("portfolio.heading")}</h2>
          </div>
          <Link to={`/${lang}/portfolio`} data-testid="work-view-all"
                className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-[#CCFF00] hover:text-[#E6FF66] transition-colors">
            {t("portfolio.viewAll")}
            <ArrowUpRight size={15} className="rtl:-scale-x-100" />
          </Link>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <ProjectCard project={p} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const { t } = useLang();
  return (
    <section data-testid="why-section" className="py-24 sm:py-32 bg-[#0A0A0D] border-y border-zinc-800/70">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <Reveal>
          <Eyebrow>{t("why.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase">{t("why.heading")}</h2>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {t("why.items").map((item, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08}>
              <div className="border-t-2 border-[#CCFF00] pt-5">
                <span className="font-mono-x text-xs text-zinc-600">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-extrabold tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const { t } = useLang();
  return (
    <section data-testid="process-section" className="py-24 sm:py-32">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <Reveal>
          <Eyebrow>{t("process.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase">{t("process.heading")}</h2>
          <p className="mt-4 text-zinc-400 max-w-2xl">{t("process.sub")}</p>
        </Reveal>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800/60 border border-zinc-800/60">
          {t("process.steps").map((step, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08} className="bg-[#08080A]">
              <div className="p-7 sm:p-8 h-full group hover:bg-[#101014] transition-colors duration-300">
                <span className="text-4xl font-extrabold tracking-tighter text-stroke group-hover:text-[#CCFF00] group-hover:[-webkit-text-stroke:0px] transition-all duration-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-xl font-extrabold tracking-tight mb-2 uppercase">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingCards({ compact = false }) {
  const { lang, t, bi } = useLang();
  const [packages, setPackages] = useState([]);
  useEffect(() => {
    api.get("/public/packages").then((r) => setPackages(r.data || [])).catch(() => {});
  }, []);
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {packages.map((p, i) => (
        <Reveal key={p.slug} delay={i * 0.1} className="h-full">
          <div
            data-testid={`package-card-${p.slug}`}
            className={`relative h-full flex flex-col p-8 border transition-transform duration-500 hover:-translate-y-1.5 ${
              p.is_featured ? "border-[#CCFF00] bg-[#CCFF00]/[0.04]" : "border-zinc-800 bg-[#0A0A0D]"
            }`}
          >
            {p.is_featured && (
              <span className="absolute -top-3 start-6 bg-[#CCFF00] text-[#08080A] font-mono-x text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1">
                {t("pricing.featured")}
              </span>
            )}
            <h3 className="text-xl font-extrabold tracking-tight uppercase">{bi(p.name)}</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{bi(p.description)}</p>
            <div className="mt-6 mb-7">
              {p.is_custom_quote || p.price == null ? (
                <span className="text-3xl font-extrabold tracking-tight text-[#CCFF00]">{t("pricing.customQuote")}</span>
              ) : (
                <span className="text-4xl font-extrabold tracking-tighter">
                  {p.price} <span className="text-base font-bold text-zinc-500">{p.currency}</span>
                </span>
              )}
            </div>
            <ul className="space-y-3 flex-1">
              {(p.features || []).map((f, fi) => (
                <li key={fi} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <Check size={15} className="text-[#CCFF00] shrink-0 mt-0.5" />
                  {bi(f)}
                </li>
              ))}
            </ul>
            <Link
              to={`/${lang}/quote`}
              data-testid={`package-cta-${p.slug}`}
              className={`mt-8 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide transition-colors duration-300 ${
                p.is_featured
                  ? "bg-[#CCFF00] text-[#08080A] hover:bg-[#E6FF66]"
                  : "border border-zinc-700 hover:border-[#CCFF00] hover:text-[#CCFF00]"
              }`}
            >
              {t("pricing.getStarted")}
              <ArrowUpRight size={15} className="rtl:-scale-x-100" />
            </Link>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);
  return (
    <section data-testid="faq-section" className="py-24 sm:py-32">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        <Reveal>
          <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase">{t("faq.heading")}</h2>
        </Reveal>
        <div className="mt-12 border-t border-zinc-800">
          {t("faq.items").map((item, i) => (
            <div key={i} className="border-b border-zinc-800">
              <button
                data-testid={`faq-question-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-4 py-5 text-start group"
              >
                <span className={`font-bold tracking-tight transition-colors duration-300 ${open === i ? "text-[#CCFF00]" : "group-hover:text-[#CCFF00]"}`}>
                  {item.q}
                </span>
                <Plus size={18} className={`shrink-0 text-zinc-500 transition-transform duration-300 ${open === i ? "rotate-45 text-[#CCFF00]" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p data-testid={`faq-answer-${i}`} className="pb-6 text-sm text-zinc-400 leading-relaxed max-w-2xl">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  const { lang, t } = useLang();
  return (
    <section data-testid="final-cta" className="py-24 sm:py-32 border-t border-zinc-800/70 bg-[#0A0A0D] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true"
           style={{ backgroundImage: "linear-gradient(#27272A 1px, transparent 1px), linear-gradient(90deg, #27272A 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 relative z-10">
        <Reveal>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter uppercase leading-[1.02] max-w-4xl">
            {t("cta.heading")}
          </h2>
          <p className="mt-6 text-zinc-400 max-w-xl text-base sm:text-lg">{t("cta.sub")}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to={`/${lang}/quote`} data-testid="final-cta-primary"
                  className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#08080A] font-extrabold uppercase tracking-wide text-sm px-8 py-4 hover:bg-[#E6FF66] hover:shadow-[0_0_40px_rgba(204,255,0,0.25)] transition-all duration-300">
              {t("cta.primary")}
              <ArrowUpRight size={17} strokeWidth={2.5} className="rtl:-scale-x-100" />
            </Link>
            <Link to={`/${lang}/contact`} data-testid="final-cta-secondary"
                  className="inline-flex items-center gap-2 border border-zinc-700 font-extrabold uppercase tracking-wide text-sm px-8 py-4 hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors duration-300">
              {t("cta.secondary")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  const { t, bi } = useLang();
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    api.get("/public/settings").then((r) => setSettings(r.data)).catch(() => {});
  }, []);
  return (
    <>
      <Seo
        title={settings ? bi(settings.seo_title) : "VORTEX — Digital Studio"}
        description={settings ? bi(settings.seo_description) : ""}
      />
      <Hero />
      <Marquee />
      <section data-testid="value-section" className="py-24 sm:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <Reveal>
            <Eyebrow>{t("value.eyebrow")}</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase max-w-3xl">{t("value.heading")}</h2>
            <p className="mt-4 text-zinc-400 max-w-2xl text-base sm:text-lg">{t("value.sub")}</p>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t("value.benefits").map((b, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="border border-zinc-800 bg-[#0A0A0D] p-7 h-full hover:border-[#CCFF00]/50 transition-colors duration-300">
                  <span className="font-mono-x text-xs text-[#CCFF00]">0{i + 1}</span>
                  <h3 className="mt-4 font-extrabold tracking-tight mb-2">{b.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <ServicesSection preview />
      <Industries />
      <WorkPreview />
      <WhyUs />
      <Process />
      <section data-testid="pricing-preview" className="py-24 sm:py-32 bg-[#0A0A0D] border-y border-zinc-800/70">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <Reveal>
            <Eyebrow>{t("pricing.eyebrow")}</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase">{t("pricing.heading")}</h2>
            <p className="mt-4 text-zinc-400 max-w-2xl">{t("pricing.sub")}</p>
          </Reveal>
          <div className="mt-14">
            <PricingCards />
          </div>
        </div>
      </section>
      <Faq />
      <FinalCta />
    </>
  );
}
