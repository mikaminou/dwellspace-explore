
import * as React from "react"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  translatable?: boolean;
  translatePlaceholder?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, translatable = false, translatePlaceholder = true, value, placeholder, ...props }, ref) => {
    const { translateUserInput, t, dir } = useLanguage();
    
    // If translatable is true and we have a value, translate it for display
    const displayValue = translatable && typeof value === 'string' 
      ? translateUserInput(value)
      : value;
    
    // If translatePlaceholder is true and we have a placeholder, try to translate it
    // First try to use it as a translation key, then as direct text
    const displayPlaceholder = translatePlaceholder && typeof placeholder === 'string'
      ? t(placeholder, translateUserInput(placeholder))
      : placeholder;
    
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={displayValue}
        placeholder={displayPlaceholder as string}
        dir={props.dir || dir}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
