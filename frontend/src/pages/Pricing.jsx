import { X } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { Reveal, Eyebrow } from "@/components/Reveal";
import Seo from "@/components/Seo";
import { PricingCards, FinalCta } from "@/pages/Home";

export default function Pricing() {
  const { t } = useLang();
  return (
    <>
      <Seo title={`${t("pricing.eyebrow")} — VORTEX`} description={t("pricing.sub")} />
      <section className="pt-40 pb-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <Eyebrow>{t("pricing.eyebrow")}</Eyebrow>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter uppercase">{t("pricing.heading")}</h1>
          <p className="mt-5 text-zinc-400 max-w-2xl text-base sm:text-lg">{t("pricing.sub")}</p>
        </div>
      </section>
      <section className="pb-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <PricingCards />
          <Reveal>
            <div className="mt-16 border border-zinc-800 bg-[#0A0A0D] p-8 max-w-3xl">
              <h2 className="font-mono-x text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-5">{t("pricing.exclusionsTitle")}</h2>
              <ul className="space-y-3">
                {t("pricing.exclusions").map((x, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <X size={15} className="text-zinc-600 shrink-0 mt-0.5" />
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-zinc-500 leading-relaxed">{t("pricing.note")}</p>
            </div>
          </Reveal>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
