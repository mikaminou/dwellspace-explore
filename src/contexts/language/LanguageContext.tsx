
import React, { createContext, useContext } from 'react';
import { t as translate, defaultLocale } from '@/localization';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, defaultText?: string) => string;
  dir: 'rtl' | 'ltr';
  translateUserInput: (text: string) => string;
  translateData: <T>(data: T) => Promise<T>;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, defaultText?: string) => defaultText || key,
  dir: 'ltr',
  translateUserInput: (text: string) => text,
  translateData: async (data) => data,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our translation utility
  const t = (key: string, defaultText?: string): string => {
    const translated = translate(key);
    // If the key was not found and defaultText is provided, return defaultText
    if (translated === key && defaultText) {
      return defaultText;
    }
    return translated;
  };

  const translateUserInput = (text: string): string => {
    // No translation for user input for now
    return text;
  };

  const translateData = async <T,>(data: T): Promise<T> => {
    // No translation for data for now
    return data;
  };

  const setLanguage = (lang: string) => {
    console.log('Language setting is disabled');
  };

  return (
    <LanguageContext.Provider value={{ 
      language: 'en', 
      setLanguage, 
      t,
      dir: 'ltr',
      translateUserInput,
      translateData
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
