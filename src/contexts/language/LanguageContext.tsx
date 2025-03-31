
import React, { createContext, useContext } from 'react';
import { t as translate, defaultLocale } from '@/localization';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, valuesOrDefaultText?: string | Record<string, string | number>, defaultText?: string) => string;
  dir: 'rtl' | 'ltr';
  translateUserInput: (text: string) => string;
  translateData: <T>(data: T) => Promise<T>;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, valuesOrDefaultText?: string | Record<string, string | number>, defaultText?: string) => 
    typeof valuesOrDefaultText === 'string' ? valuesOrDefaultText : defaultText || key,
  dir: 'ltr',
  translateUserInput: (text: string) => text,
  translateData: async (data) => data,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our translation utility with support for interpolation values
  const t = (key: string, valuesOrDefaultText?: string | Record<string, string | number>, defaultText?: string): string => {
    // Check if the second parameter is a string (default text) or an object (values)
    if (typeof valuesOrDefaultText === 'object') {
      // It's a values object for interpolation
      const translated = translate(key);
      
      // If the key was not found and defaultText is provided, use defaultText
      let result = translated === key && defaultText ? defaultText : translated;
      
      // Simple interpolation for values
      if (valuesOrDefaultText && typeof result === 'string') {
        Object.entries(valuesOrDefaultText).forEach(([valueKey, value]) => {
          result = result.replace(new RegExp(`\\{${valueKey}\\}`, 'g'), String(value));
        });
      }
      
      return result;
    } else {
      // It's just the default text
      const translated = translate(key);
      // If the key was not found and valuesOrDefaultText is provided as default text, return it
      if (translated === key && valuesOrDefaultText) {
        return valuesOrDefaultText;
      }
      return translated;
    }
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
