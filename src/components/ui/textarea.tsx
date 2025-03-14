
import * as React from "react"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  translatable?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, translatable = false, value, ...props }, ref) => {
    const { translateUserInput } = useLanguage();
    
    // If translatable is true and we have a value, translate it for display
    const displayValue = translatable && typeof value === 'string' 
      ? translateUserInput(value)
      : value;
    
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={displayValue}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
