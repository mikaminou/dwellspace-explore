
import * as React from "react"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  translatable?: boolean;
  translatePlaceholder?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, translatable = false, translatePlaceholder = true, value, placeholder, ...props }, ref) => {
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
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
Input.displayName = "Input"

export { Input }
