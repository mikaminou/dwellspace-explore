
import React from 'react';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface TransProps {
  id?: string;
  children?: React.ReactNode;
  values?: Record<string, string>;
  defaultText?: string;
  className?: string;
}

/**
 * Translation component that makes it easy to translate text throughout the application
 * Usage examples:
 * <Trans id="welcome.message">Welcome to our site</Trans>
 * <Trans id="home.greeting" values={{ name: user.name }}>Hello, {name}</Trans>
 */
export function Trans({ id, children, values = {}, defaultText, className }: TransProps) {
  const { t, dir } = useLanguage();
  
  // If no id is provided, treat children as the translation key
  const key = id || (typeof children === 'string' ? children : '');
  
  // Get the translation
  let translation = key ? t(key, defaultText || (typeof children === 'string' ? children : '')) : '';
  
  // Replace any placeholders with values
  if (values && Object.keys(values).length > 0) {
    Object.entries(values).forEach(([key, value]) => {
      translation = translation.replace(new RegExp(`{${key}}`, 'g'), value);
    });
  }
  
  return (
    <span className={`${dir === 'rtl' ? 'arabic-text' : ''} ${className || ''}`}>
      {translation}
    </span>
  );
}

/**
 * Translation component for headings
 * Usage examples:
 * <TransHeading as="h1" id="welcome.title">Welcome</TransHeading>
 */
interface TransHeadingProps extends TransProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function TransHeading({ as: Component = 'h2', id, children, values, defaultText, className }: TransHeadingProps) {
  const { t, dir } = useLanguage();
  
  // If no id is provided, treat children as the translation key
  const key = id || (typeof children === 'string' ? children : '');
  
  // Get the translation
  let translation = key ? t(key, defaultText || (typeof children === 'string' ? children : '')) : '';
  
  // Replace any placeholders with values
  if (values && Object.keys(values).length > 0) {
    Object.entries(values).forEach(([key, value]) => {
      translation = translation.replace(new RegExp(`{${key}}`, 'g'), value);
    });
  }
  
  return React.createElement(
    Component,
    { className: `${dir === 'rtl' ? 'arabic-text' : ''} ${className || ''}` },
    translation
  );
}
