import { Activity, Zap, TrendingUp, Layers, Terminal } from "lucide-react";
import { useSystemMetrics } from "./hooks/useMetrics";
import { useRealtime } from "@/hooks/useRealtime";
import { MetricCard } from "./components/MetricCard";
import { EntropyChart } from "./components/EntropyChart";
import { SystemConsole } from "./components/SystemConsole";
import { Badge } from "@/components/ui/badge";

export function DashboardPage() {
    // 1. Activate Neural Link (WebSocket)
    useRealtime();

    // 2. Consume Data Stream
    const { data: metrics } = useSystemMetrics();

    const isLoading = !metrics;

    return (
        <div className="min-h-screen bg-background p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Sovereign Dashboard</h2>
                    <p className="text-muted-foreground">Real-time system telemetry & orchestration.</p>
                </div>
                <div className="flex items-center space-x-2">
                     <Badge variant={isLoading ? "destructive" : "default"} className="animate-pulse">
                        {isLoading ? "CONNECTING..." : "SYSTEM ONLINE"}
                     </Badge>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Bio Stress"
                    stress={metrics?.bio?.stress ?? 0}
                    action={metrics?.bio?.action ?? "IDLE"}
                    icon={<Activity className="h-4 w-4" />}
                    color="red"
                    loading={isLoading}
                />
                <MetricCard
                    title="Market Risk"
                    stress={metrics?.market?.stress ?? 0}
                    action={metrics?.market?.action ?? "IDLE"}
                    icon={<TrendingUp className="h-4 w-4" />}
                    color="green"
                    loading={isLoading}
                />
                <MetricCard
                    title="Grid Load"
                    stress={metrics?.energy?.stress ?? 0}
                    action={metrics?.energy?.action ?? "IDLE"}
                    icon={<Zap className="h-4 w-4" />}
                    color="blue"
                    loading={isLoading}
                />
                <MetricCard
                    title="Project Entropy"
                    stress={(100 - (metrics?.entropy ?? 100)) / 100} // Inverse for display as stress
                    action="CALCULATING"
                    icon={<Layers className="h-4 w-4" />}
                    color="blue"
                    loading={isLoading}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <EntropyChart
                    currentEntropy={metrics?.entropy ?? 0}
                    timestamp={metrics?.timestamp ?? ""}
                />
                <SystemConsole
                    message={metrics?.orchestrator ?? ""}
                    timestamp={metrics?.timestamp ?? ""}
                />
            </div>

            <div className="text-xs text-muted-foreground text-center pt-10">
                Sovereign Engine v2.0 • Secured by SHA-512 • {metrics?.hash?.substring(0, 16) ?? "NO_HASH"}
            </div>
        </div>
    );
}
