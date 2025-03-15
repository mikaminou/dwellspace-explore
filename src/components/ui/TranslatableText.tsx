
import React, { useState } from 'react';
import { TranslateButton } from './TranslateButton';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface TranslatableTextProps {
  originalText: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  className?: string;
  showTranslateButton?: boolean;
}

export function TranslatableText({ 
  originalText, 
  as = 'p', 
  className = '',
  showTranslateButton = true
}: TranslatableTextProps) {
  const [displayText, setDisplayText] = useState(originalText);
  const [isTranslated, setIsTranslated] = useState(false);
  const { language } = useLanguage();
  
  // Don't show translation button if the text is empty or not user content
  if (!originalText || !showTranslateButton) {
    return React.createElement(as, { className }, originalText);
  }

  const handleTranslated = (translatedText: string) => {
    setDisplayText(translatedText);
    setIsTranslated(true);
  };

  return (
    <div className="relative group">
      {React.createElement(
        as,
        { className },
        displayText
      )}
      {!isTranslated && showTranslateButton && (
        <div className="mt-1">
          <TranslateButton 
            originalText={originalText} 
            onTranslated={handleTranslated} 
          />
        </div>
      )}
    </div>
  );
}
