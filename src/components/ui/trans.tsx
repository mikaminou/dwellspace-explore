
import React from 'react';

interface TransProps {
  id?: string;
  children?: React.ReactNode;
  values?: Record<string, string | number>;
  defaultText?: string;
  className?: string;
  userContent?: boolean;
}

/**
 * Simplified translation component placeholder
 */
export function Trans({ id, children, values = {}, defaultText, className, userContent = false }: TransProps) {
  // Simply render the children or default text without translation UI
  return (
    <span className={className}>
      {typeof children === 'string' ? children : defaultText || ''}
    </span>
  );
}

/**
 * Simplified heading translation component placeholder
 */
interface TransHeadingProps extends TransProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function TransHeading({ as: Component = 'h2', id, children, values, defaultText, className, userContent = false }: TransHeadingProps) {
  // Simply render the component with children or default text without translation UI
  return React.createElement(
    Component,
    { className },
    typeof children === 'string' ? children : defaultText || ''
  );
}
