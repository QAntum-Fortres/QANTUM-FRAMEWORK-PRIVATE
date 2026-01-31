import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
    title: string;
    stress: number;
    action: string;
    icon: React.ReactNode;
    color: "blue" | "red" | "green" | "purple";
    loading?: boolean;
    trend?: "up" | "down" | "neutral";
    subtitle?: string;
}

export function MetricCard({ title, stress, action, icon, color, loading, trend = "neutral", subtitle }: MetricCardProps) {
    if (loading) {
        return (
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-2 w-full mb-3" />
                    <Skeleton className="h-5 w-16" />
                </CardContent>
            </Card>
        );
    }

    const stressPercent = Math.min(stress * 100, 100);

    // Dynamic color mapping
    const colorMap = {
        blue: {
            text: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            glow: "shadow-blue-500/10"
        },
        red: {
            text: "text-red-500",
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            glow: "shadow-red-500/10"
        },
        green: {
            text: "text-green-500",
            bg: "bg-green-500/10",
            border: "border-green-500/20",
            glow: "shadow-green-500/10"
        },
        purple: {
            text: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            glow: "shadow-purple-500/10"
        }
    };

    const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
    const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground";

    return (
        <Card className={cn(
            "border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300",
            "hover:border-border/60 hover:shadow-lg",
            colorMap[color].glow
        )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center",
                    colorMap[color].bg,
                    colorMap[color].border,
                    "border"
                )}>
                    <div className={colorMap[color].text}>
                        {icon}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight">
                        {stress.toFixed(4)}
                    </span>
                    <TrendIcon className={cn("h-4 w-4", trendColor)} />
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Stress Load</span>
                        <span className={cn("font-medium", stressPercent > 80 ? "text-red-400" : stressPercent > 50 ? "text-yellow-400" : "text-green-400")}>
                            {stressPercent.toFixed(1)}%
                        </span>
                    </div>
                    <Progress value={stressPercent} animated={stressPercent > 50} />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <Badge
                        variant={action === "OPTIMAL" || action === "IDLE" ? "secondary" : "destructive"}
                        className={cn(
                            "text-[10px] uppercase font-semibold",
                            action === "OPTIMAL" && "bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20",
                            action === "IDLE" && "bg-muted text-muted-foreground"
                        )}
                    >
                        {action}
                    </Badge>
                    {subtitle && (
                        <span className="text-[10px] text-muted-foreground">{subtitle}</span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
