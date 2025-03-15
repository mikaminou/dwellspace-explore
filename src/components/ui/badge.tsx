
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-sm hover:shadow-primary/40",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm hover:shadow-secondary/40",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:shadow-sm hover:shadow-destructive/40",
        outline: "text-foreground hover:shadow-sm",
        success: 
          "border-transparent bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 hover:bg-green-100 hover:shadow-sm hover:shadow-green-200/60 dark:hover:shadow-green-900/60",
        info: 
          "border-transparent bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 hover:shadow-sm hover:shadow-blue-200/60 dark:hover:shadow-blue-900/60",
        warning: 
          "border-transparent bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 hover:bg-orange-100 hover:shadow-sm hover:shadow-orange-200/60 dark:hover:shadow-orange-900/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
