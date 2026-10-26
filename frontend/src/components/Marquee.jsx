import { useLang } from "@/context/LangContext";

export default function Marquee({ items }) {
  const { t } = useLang();
  const row = items || t("marquee");
  const doubled = [...row, ...row];
  return (
    <div
      data-testid="marquee"
      className="overflow-hidden border-y border-zinc-800/80 bg-[#0C0C0F] py-5 select-none"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max items-center">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tighter text-zinc-700 px-6 whitespace-nowrap">
              {item}
            </span>
            <span className="w-2 h-2 bg-[#CCFF00] rounded-full shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
