import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

    // Determine status based on entropy
    const getEntropyStatus = () => {
        if (currentEntropy >= 80) return { label: "OPTIMAL", color: "bg-green-500/10 text-green-400 border-green-500/20" };
        if (currentEntropy >= 50) return { label: "STABLE", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" };
        return { label: "CRITICAL", color: "bg-red-500/10 text-red-400 border-red-500/20" };
    };

    const status = getEntropyStatus();

    return (
        <Card className="col-span-4 border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg font-semibold">Global Entropy Index</CardTitle>
                    <CardDescription>System order measurement over time</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{currentEntropy.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Current Value</p>
                    </div>
                    <Badge variant="outline" className={status.color}>
                        {status.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorEntropy" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(263, 70%, 50%)" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="hsl(263, 70%, 50%)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis
                                dataKey="time"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderRadius: '8px',
                                    border: '1px solid hsl(var(--border))',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="hsl(263, 70%, 50%)"
                                strokeWidth={2}
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
