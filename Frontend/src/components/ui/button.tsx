
import { forwardRef } from "react"
export const Button = forwardRef(({ children, className, variant, size, ...props }: any, ref: any) => {
    return <button ref={ref} className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 ${className}`} {...props}>{children}</button>;
});
Button.displayName = "Button"
