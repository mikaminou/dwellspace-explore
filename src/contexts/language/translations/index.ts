
import arTranslations from './ar';
import frTranslations from './fr';
import enTranslations from './en';

export type SupportedLanguage = 'ar' | 'fr' | 'en';

export const translations = {
  ar: arTranslations,
  fr: frTranslations,
  en: enTranslations
};

export type TranslationKey = keyof typeof enTranslations;
