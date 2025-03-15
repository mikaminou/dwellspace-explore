
import { en } from './en';

// Type for all translated keys based on English translations
export type TranslationKeys = typeof en;

// Simple utility to get nested keys with dot notation
export function t(key: string, defaultText?: string): string {
  const keys = key.split('.');
  let current: any = en; // Always use English translations for now
  
  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return defaultText || key;
    }
    current = current[k];
  }
  
  return current;
}

// Export default locale
export const defaultLocale = en;
