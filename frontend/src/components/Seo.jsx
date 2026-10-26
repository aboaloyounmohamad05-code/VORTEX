import { useEffect } from "react";
import { useLang } from "@/context/LangContext";

export default function Seo({ title, description }) {
  const { lang } = useLang();
  useEffect(() => {
    if (title) document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute("content", description);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
    document.querySelectorAll('link[rel="alternate"][data-hreflang]').forEach((el) => el.remove());
    const base = window.location.origin;
    const path = window.location.pathname.replace(/^\/(en|ar)/, "");
    ["en", "ar"].forEach((l) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", l);
      link.setAttribute("data-hreflang", "1");
      link.setAttribute("href", `${base}/${l}${path}`);
      document.head.appendChild(link);
    });
  }, [title, description, lang]);
  return null;
}
