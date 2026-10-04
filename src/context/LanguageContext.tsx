import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, translations } from "@/data/translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chocofarms_lang") as Language;
      if (saved === "en" || saved === "te") return saved;
    }
    return "en";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("chocofarms_lang", newLang);
      document.documentElement.lang = newLang;
    }
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "te" : "en");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
};
