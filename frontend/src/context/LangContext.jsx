import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { translations } from "@/i18n/translations";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem("vortex_lang");
    return saved === "ar" || saved === "en" ? saved : "en";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l) => {
    localStorage.setItem("vortex_lang", l);
    setLangState(l);
  }, []);

  const t = useCallback(
    (key) => {
      const get = (obj) => key.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
      return get(translations[lang]) ?? get(translations.en) ?? key;
    },
    [lang]
  );

  const bi = useCallback(
    (field) => {
      if (field == null) return "";
      if (typeof field === "string") return field;
      const v = field[lang] ?? field.en ?? "";
      return v;
    },
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t, bi, isRtl: lang === "ar" }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
