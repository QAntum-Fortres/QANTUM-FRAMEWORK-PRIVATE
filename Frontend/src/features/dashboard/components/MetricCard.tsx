import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    title: string;
    stress: number;
    action: string;
    icon: React.ReactNode;
    color: "blue" | "red" | "green";
    loading?: boolean;
}

export function MetricCard({ title, stress, action, icon, color, loading }: MetricCardProps) {
    if (loading) {
        return <Skeleton className="h-[180px] w-full rounded-xl" />;
    }

    const stressPercent = Math.min(stress * 100, 100).toFixed(1);

    // Dynamic color mapping
    const colorMap = {
        blue: "text-blue-500",
        red: "text-red-500",
        green: "text-green-500"
    };

    return (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <div className={cn("h-4 w-4", colorMap[color])}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stress.toFixed(4)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    Stress Load: {stressPercent}%
                </p>
                <div className="mt-4">
                    <Badge variant={action === "OPTIMAL" || action === "IDLE" ? "secondary" : "destructive"} className="text-[10px] uppercase">
                        {action}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
