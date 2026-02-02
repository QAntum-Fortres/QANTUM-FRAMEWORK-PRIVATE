
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
export const SystemConsole = ({ message, timestamp }: any) => (
    <Card className="col-span-3">
        <CardHeader>
            <CardTitle>System Console</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="font-mono text-xs">
                <div>[{timestamp}] {message}</div>
            </div>
        </CardContent>
    </Card>
);
