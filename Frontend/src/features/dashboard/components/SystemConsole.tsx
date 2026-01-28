import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SystemConsoleProps {
    message: string;
    timestamp: string;
}

export function SystemConsole({ message, timestamp }: SystemConsoleProps) {
    const [logs, setLogs] = useState<{ msg: string; time: string }[]>([]);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!message) return;
        setLogs(prev => {
            const newLogs = [...prev, { msg: message, time: timestamp }];
            if (newLogs.length > 10) return newLogs.slice(newLogs.length - 10);
            return newLogs;
        });
    }, [message, timestamp]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <Card className="col-span-3 border-border/40 bg-black/90 font-mono text-green-500">
            <CardHeader className="p-4 border-b border-border/20">
                <CardTitle className="text-sm uppercase tracking-widest text-green-700">Orchestrator Log</CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[200px] overflow-y-auto space-y-2">
                {logs.map((log, i) => (
                    <div key={i} className="text-xs">
                        <span className="opacity-50">[{log.time}]</span> {log.msg}
                    </div>
                ))}
                <div ref={endRef} />
            </CardContent>
        </Card>
    );
}
