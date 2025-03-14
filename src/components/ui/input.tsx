
import * as React from "react"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  translatable?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, translatable = false, value, ...props }, ref) => {
    const { translateUserInput } = useLanguage();
    
    // If translatable is true and we have a value, translate it for display
    const displayValue = translatable && typeof value === 'string' 
      ? translateUserInput(value)
      : value;
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        value={displayValue}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
