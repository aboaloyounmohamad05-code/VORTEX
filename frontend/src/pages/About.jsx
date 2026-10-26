import { useLang } from "@/context/LangContext";
import { Reveal, Eyebrow } from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import Seo from "@/components/Seo";
import { FinalCta } from "@/pages/Home";

export default function About() {
  const { t } = useLang();
  return (
    <>
      <Seo title={`${t("nav.about")} — VORTEX`} description={t("about.p1")} />
      <section className="pt-40 pb-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <Eyebrow>{t("about.eyebrow")}</Eyebrow>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter uppercase max-w-4xl leading-[1.02]">
            {t("about.heading")}
          </h1>
        </div>
      </section>
      <Marquee />
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-6 space-y-6">
            <Reveal><p className="text-lg text-zinc-300 leading-relaxed">{t("about.p1")}</p></Reveal>
            <Reveal delay={0.1}><p className="text-base text-zinc-400 leading-relaxed">{t("about.p2")}</p></Reveal>
            <Reveal delay={0.15}><p className="text-base text-zinc-400 leading-relaxed">{t("about.p3")}</p></Reveal>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-5">
            <Reveal className="col-span-2">
              <div className="border border-zinc-800 overflow-hidden">
                <img src="https://images.pexels.com/photos/9218544/pexels-photo-9218544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                     alt="Studio work" className="spotlight-img w-full aspect-[16/9] object-cover" loading="lazy" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="border border-zinc-800 overflow-hidden">
                <img src="https://images.pexels.com/photos/9595285/pexels-photo-9595285.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                     alt="Design process" className="spotlight-img w-full aspect-square object-cover" loading="lazy" />
              </div>
            </Reveal>
            <Reveal delay={0.15} className="flex">
              <div className="border border-[#CCFF00]/40 bg-[#CCFF00]/[0.05] p-6 flex flex-col justify-center w-full">
                <span className="font-mono-x text-xs uppercase tracking-[0.25em] text-[#CCFF00]">VORTEX</span>
                <p className="mt-3 text-sm text-zinc-300 leading-relaxed">{t("hero.tagline")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="pb-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <Reveal>
            <h2 className="font-mono-x text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-10">{t("about.valuesTitle")}</h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-px bg-zinc-800/70 border border-zinc-800/70">
            {t("about.values").map((v, i) => (
              <Reveal key={i} delay={i * 0.08} className="bg-[#0A0A0D]">
                <div className="p-8 h-full">
                  <h3 className="text-lg font-extrabold tracking-tight mb-2">{v.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
