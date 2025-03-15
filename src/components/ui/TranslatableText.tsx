
import React from 'react';

interface TranslatableTextProps {
  originalText: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  className?: string;
}

export function TranslatableText({ 
  originalText, 
  as = 'p', 
  className = '',
}: TranslatableTextProps) {
  // Simply render the original text without translation UI
  return React.createElement(as, { className }, originalText);
}
