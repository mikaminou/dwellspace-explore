
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { useLanguage } from "@/contexts/language/LanguageContext"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

interface LabelProps extends 
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
  VariantProps<typeof labelVariants> {
  translatable?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, translatable = true, children, ...props }, ref) => {
  const { t, dir } = useLanguage();
  
  // If children is a simple string, try to translate it
  let displayContent = children;
  if (translatable && typeof children === 'string') {
    displayContent = t(children, children);
  }
  
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), 
        dir === 'rtl' ? 'arabic-text' : '',
        className
      )}
      {...props}
    >
      {displayContent}
    </LabelPrimitive.Root>
  )
})

Label.displayName = LabelPrimitive.Root.displayName

export { Label }
