
import * as React from "react"
import { cn } from "@/lib/utils"

const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "absolute h-px w-px p-0 overflow-hidden whitespace-nowrap border-0",
        className
      )}
      {...props}
      style={{
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        margin: "-1px",
      }}
    />
  )
})
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }
