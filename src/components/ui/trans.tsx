
import React from 'react';
import { t } from '@/localization';

interface TransProps {
  id: string;
  children?: React.ReactNode;
  values?: Record<string, string | number>;
  defaultText?: string;
  className?: string;
  userContent?: boolean;
}

/**
 * Translation component that uses the localization system
 */
export function Trans({ id, children, values = {}, defaultText, className, userContent = false }: TransProps) {
  // Get the translated text using the id
  const translatedText = t(id, defaultText || (typeof children === 'string' ? children : undefined));
  
  // Return the translated text
  return (
    <span className={className}>
      {translatedText}
    </span>
  );
}

/**
 * Heading translation component
 */
interface TransHeadingProps extends TransProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function TransHeading({ as: Component = 'h2', id, children, values, defaultText, className, userContent = false }: TransHeadingProps) {
  // Get the translated text using the id
  const translatedText = t(id, defaultText || (typeof children === 'string' ? children : undefined));
  
  // Render the component with the translated text
  return React.createElement(
    Component,
    { className },
    translatedText
  );
}
