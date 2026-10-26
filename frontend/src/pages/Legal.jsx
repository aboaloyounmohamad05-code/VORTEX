import { useLang } from "@/context/LangContext";
import { Reveal } from "@/components/Reveal";
import Seo from "@/components/Seo";

export default function Legal({ kind }) {
  const { t } = useLang();
  const doc = t(`legal.${kind}`);
  return (
    <>
      <Seo title={`${doc.title} — VORTEX`} description={doc.title} />
      <section className="pt-40 pb-24">
        <div className="max-w-[800px] mx-auto px-5 sm:px-8">
          <Reveal>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter uppercase">{doc.title}</h1>
            <p className="mt-4 font-mono-x text-xs uppercase tracking-[0.2em] text-zinc-500">{doc.updated}</p>
          </Reveal>
          <div className="mt-12 space-y-10">
            {doc.sections.map((s, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <h2 className="text-lg font-extrabold tracking-tight mb-3 text-[#CCFF00]">{s.h}</h2>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">{s.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
