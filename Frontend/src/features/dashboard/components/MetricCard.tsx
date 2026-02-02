
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
export const MetricCard = ({ title, stress, action, icon, color: _color, loading }: any) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stress}</div>
            <p className="text-xs text-muted-foreground">{action}</p>
        </CardContent>
    </Card>
);
