
import React from 'react';
import { t } from '@/localization';

interface TranslatableTextProps {
  textKey: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  className?: string;
}

export function TranslatableText({ 
  textKey, 
  as = 'p', 
  className = '',
}: TranslatableTextProps) {
  const translatedText = t(textKey);
  return React.createElement(as, { className }, translatedText);
}
