import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
    variant?: "default" | "success" | "warning" | "danger";
    showValue?: boolean;
    animated?: boolean;
}

/**
 * Determines the appropriate variant based on percentage value
 */
function getAutoVariant(percentage: number): "success" | "warning" | "danger" {
    if (percentage > 80) {
        return "danger";
    }
    if (percentage > 50) {
        return "warning";
    }
    return "success";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value = 0, max = 100, variant = "default", showValue = false, animated = true, ...props }, ref) => {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

        const variantStyles = {
            default: "bg-primary",
            success: "bg-green-500",
            warning: "bg-yellow-500",
            danger: "bg-red-500"
        };

        // Auto-determine variant based on value if using default
        const effectiveVariant = variant === "default" ? getAutoVariant(percentage) : variant;

        return (
            <div
                ref={ref}
                className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
                {...props}
            >
                <div
                    className={cn(
                        "h-full transition-all duration-500 ease-out rounded-full",
                        variantStyles[effectiveVariant],
                        animated && "animate-pulse"
                    )}
                    style={{ width: `${percentage}%` }}
                />
                {showValue && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 text-[10px] font-medium">
                        {percentage.toFixed(1)}%
                    </span>
                )}
            </div>
        );
    }
);
Progress.displayName = "Progress";

export { Progress };
