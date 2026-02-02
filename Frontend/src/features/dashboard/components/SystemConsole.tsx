import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, Circle } from 'lucide-react';

interface SystemConsoleProps {
    message: string;
    timestamp: string;
}

export function SystemConsole({ message, timestamp }: SystemConsoleProps) {
    const [logs, setLogs] = useState<{ msg: string; time: string; type: 'info' | 'warning' | 'success' }[]>([]);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!message) return;

        // Determine log type based on content
        let type: 'info' | 'warning' | 'success' = 'info';
        if (message.includes('⚠️') || message.includes('STRESS') || message.includes('CRASH')) {
            type = 'warning';
        } else if (message.includes('SYNCED') || message.includes('OPTIMAL')) {
            type = 'success';
        }

        setLogs(prev => {
            const newLogs = [...prev, { msg: message, time: timestamp, type }];
            if (newLogs.length > 15) return newLogs.slice(newLogs.length - 15);
            return newLogs;
        });
    }, [message, timestamp]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const getLogColor = (type: 'info' | 'warning' | 'success') => {
        switch (type) {
            case 'warning': return 'text-amber-400';
            case 'success': return 'text-green-400';
            default: return 'text-cyan-400';
        }
    };

    return (
        <Card className="col-span-3 border-border/40 bg-slate-950/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-slate-800/50 bg-slate-900/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-cyan-500" />
                        <CardTitle className="text-sm font-medium text-slate-300">Orchestrator Log</CardTitle>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Circle className="h-2.5 w-2.5 fill-red-500 text-red-500" />
                        <Circle className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
                        <Circle className="h-2.5 w-2.5 fill-green-500 text-green-500" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-[200px] overflow-y-auto font-mono text-xs p-4 space-y-1.5 scrollbar-thin">
                    {logs.length === 0 && (
                        <div className="text-slate-500 animate-pulse">
                            Waiting for system signals...
                        </div>
                    )}
                    {logs.map((log, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-2 hover:bg-slate-800/30 rounded px-1 -mx-1 transition-colors"
                        >
                            <span className="text-slate-600 select-none shrink-0">[{log.time}]</span>
                            <span className="text-slate-500 select-none">$</span>
                            <span className={getLogColor(log.type)}>{log.msg}</span>
                        </div>
                    ))}
                    <div ref={endRef} />
                </div>
                {/* Status bar */}
                <div className="border-t border-slate-800/50 bg-slate-900/30 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                        </span>
                        Live Stream Active
                    </div>
                    <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-400 px-1.5 py-0">
                        {logs.length} entries
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
