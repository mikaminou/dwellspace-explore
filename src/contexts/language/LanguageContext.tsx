
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, SupportedLanguage, TranslationKey } from './translations';

type LanguageContextType = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, defaultText?: string) => string;
  dir: 'rtl' | 'ltr';
  translateUserInput: (text: string, originalLanguage?: SupportedLanguage) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
  dir: 'ltr',
  translateUserInput: (text: string) => text,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // Try to get saved language preference from localStorage
    const savedLang = localStorage.getItem('language');
    return (savedLang === 'ar' ? 'ar' : savedLang === 'en' ? 'en' : 'fr');
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    // Set initial direction based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, defaultText?: string): string => {
    return translations[language]?.[key as keyof typeof translations.fr] || defaultText || key;
  };

  // Function to display user input in the selected language
  // For a real implementation, you would need to integrate with a translation API
  const translateUserInput = (text: string, originalLanguage?: SupportedLanguage): string => {
    // In a real app, you would call a translation API here
    // For this demo, we're just returning the original text
    // as implementing actual translation requires external APIs
    
    // For demonstration purposes only:
    // This simulates translation for a few hardcoded phrases
    const demoTranslations: Record<string, Record<SupportedLanguage, string>> = {
      "Hello World": {
        en: "Hello World",
        fr: "Bonjour le Monde",
        ar: "مرحبا بالعالم"
      },
      "My name is": {
        en: "My name is",
        fr: "Je m'appelle",
        ar: "اسمي هو"
      },
      "I am a buyer": {
        en: "I am a buyer",
        fr: "Je suis un acheteur",
        ar: "أنا مشتري"
      },
      "I am a seller": {
        en: "I am a seller",
        fr: "Je suis un vendeur",
        ar: "أنا بائع"
      },
      "I am an agent": {
        en: "I am an agent",
        fr: "Je suis un agent",
        ar: "أنا وكيل"
      }
    };
    
    // Check if we have a translation for this text
    if (demoTranslations[text] && demoTranslations[text][language]) {
      return demoTranslations[text][language];
    }
    
    return text; // Return original text if no translation is available
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      dir: language === 'ar' ? 'rtl' : 'ltr',
      translateUserInput
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
