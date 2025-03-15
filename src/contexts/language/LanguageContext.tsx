
import React, { createContext, useContext } from 'react';

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
  // Simplified provider with no actual translation functionality
  
  // Simple passthrough functions
  const t = (key: string, defaultText?: string): string => {
    return defaultText || key;
  };

  const translateUserInput = (text: string): string => {
    return text;
  };

  const translateData = async <T,>(data: T): Promise<T> => {
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
