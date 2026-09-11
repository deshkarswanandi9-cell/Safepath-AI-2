import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, TRANSLATIONS, Translations } from '../data/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
  languageName: string;
}

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English (US)',
  hi: 'Hindi (हिन्दी)',
  es: 'Español',
  fr: 'Français'
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('saferoute_language');
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'es' || saved === 'fr')) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('saferoute_language', lang);
    } catch {
      // ignore
    }
  };

  const value = {
    language,
    setLanguage,
    t: TRANSLATIONS[language] || TRANSLATIONS.en,
    languageName: LANGUAGE_NAMES[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      t: TRANSLATIONS.en,
      languageName: 'English (US)'
    };
  }
  return context;
};
