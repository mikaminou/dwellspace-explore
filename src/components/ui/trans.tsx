
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { TranslateButton } from './TranslateButton';

interface TransProps {
  id?: string;
  children?: React.ReactNode;
  values?: Record<string, string | number>;
  defaultText?: string;
  className?: string;
  userContent?: boolean;
}

/**
 * Translation component that makes it easy to translate text throughout the application
 * Usage examples:
 * <Trans id="welcome.message">Welcome to our site</Trans>
 * <Trans id="home.greeting" values={{ name: user.name }}>Hello, {name}</Trans>
 * <Trans userContent={true}>User generated content</Trans>
 */
export function Trans({ id, children, values = {}, defaultText, className, userContent = false }: TransProps) {
  const { t, dir, translateUserInput } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  
  // If no id is provided, treat children as the translation key
  const key = id || (typeof children === 'string' ? children : '');
  
  // Get the translation
  let translation = key ? t(key, defaultText || (typeof children === 'string' ? children : '')) : '';
  
  // Replace any placeholders with values
  if (values && Object.keys(values).length > 0) {
    Object.entries(values).forEach(([key, value]) => {
      translation = translation.replace(new RegExp(`{${key}}`, 'g'), String(value));
    });
  }

  // If this is user content and we have a translated version, use that instead
  const displayContent = translatedContent || translation;
  
  // For user-generated content, show the translate button
  if (userContent && typeof children === 'string') {
    return (
      <div className="relative group">
        <span className={`${dir === 'rtl' ? 'arabic-text' : ''} ${className || ''}`}>
          {displayContent}
        </span>
        {!translatedContent && (
          <div className="mt-1">
            <TranslateButton 
              originalText={children} 
              onTranslated={setTranslatedContent}
            />
          </div>
        )}
      </div>
    );
  }
  
  // Standard translation without translate button
  return (
    <span className={`${dir === 'rtl' ? 'arabic-text' : ''} ${className || ''}`}>
      {displayContent}
    </span>
  );
}

/**
 * Translation component for headings
 * Usage examples:
 * <TransHeading as="h1" id="welcome.title">Welcome</TransHeading>
 * <TransHeading as="h2" userContent={true}>User generated heading</TransHeading>
 */
interface TransHeadingProps extends TransProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function TransHeading({ as: Component = 'h2', id, children, values, defaultText, className, userContent = false }: TransHeadingProps) {
  const { t, dir, translateUserInput } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  
  // If no id is provided, treat children as the translation key
  const key = id || (typeof children === 'string' ? children : '');
  
  // Get the translation
  let translation = key ? t(key, defaultText || (typeof children === 'string' ? children : '')) : '';
  
  // Replace any placeholders with values
  if (values && Object.keys(values).length > 0) {
    Object.entries(values).forEach(([key, value]) => {
      translation = translation.replace(new RegExp(`{${key}}`, 'g'), String(value));
    });
  }

  // If this is user content and we have a translated version, use that instead
  const displayContent = translatedContent || translation;
  
  // For user-generated content, show the translate button
  if (userContent && typeof children === 'string') {
    return (
      <div className="relative group">
        {React.createElement(
          Component, 
          { className: `${dir === 'rtl' ? 'arabic-text' : ''} ${className || ''}` },
          displayContent
        )}
        {!translatedContent && (
          <div className="mt-1">
            <TranslateButton 
              originalText={children} 
              onTranslated={setTranslatedContent}
            />
          </div>
        )}
      </div>
    );
  }
  
  // Standard translation without translate button
  return React.createElement(
    Component,
    { className: `${dir === 'rtl' ? 'arabic-text' : ''} ${className || ''}` },
    displayContent
  );
}
