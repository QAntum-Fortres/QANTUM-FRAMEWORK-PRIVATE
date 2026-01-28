import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EntropyChartProps {
    currentEntropy: number;
    timestamp: string;
}

export function EntropyChart({ currentEntropy, timestamp }: EntropyChartProps) {
    const [data, setData] = useState<{ time: string; value: number }[]>([]);

    useEffect(() => {
        if (!timestamp) return;

        setData(prev => {
            const newData = [...prev, { time: timestamp, value: currentEntropy }];
            if (newData.length > 20) return newData.slice(newData.length - 20);
            return newData;
        });
    }, [currentEntropy, timestamp]);

    return (
        <Card className="col-span-4 border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Global Entropy Index</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorEntropy" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorEntropy)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
