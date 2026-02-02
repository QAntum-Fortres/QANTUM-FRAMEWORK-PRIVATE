
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const data = [
    { name: 'A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'B', uv: 3000, pv: 1398, amt: 2210 },
];

export const EntropyChart = ({ currentEntropy: _current, timestamp: _ts }: any) => (
    <Card className="col-span-4">
        <CardHeader>
            <CardTitle>Entropy</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip />
                    <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);
