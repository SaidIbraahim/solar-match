"use client";

import { Globe } from "lucide-react";
import { getLanguage, Language, setLanguage, t } from "@/lib/i18n";
import { useState, useEffect } from "react";

export const LanguageToggle = () => {
  const [currentLang, setCurrentLang] = useState<Language>(getLanguage());

  useEffect(() => {
    setCurrentLang(getLanguage());
  }, []);

  const toggleLanguage = () => {
    const newLang: Language = currentLang === "en" ? "so" : "en";
    setLanguage(newLang);
    setCurrentLang(newLang);
    // Reload page to apply translations
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-emerald-900 shadow-md transition hover:bg-white"
      title={`Switch to ${currentLang === "en" ? "Somali" : "English"}`}
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase">{currentLang === "en" ? "SO" : "EN"}</span>
    </button>
  );
};

