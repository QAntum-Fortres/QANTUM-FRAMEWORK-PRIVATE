import { Activity, Zap, TrendingUp, Layers, Server, Clock, Hash, FileCode } from "lucide-react";
import { useSystemMetrics } from "./hooks/useMetrics";
import { useRealtime } from "@/hooks/useRealtime";
import { MetricCard } from "./components/MetricCard";
import { EntropyChart } from "./components/EntropyChart";
import { SystemConsole } from "./components/SystemConsole";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export function DashboardPage() {
    // 1. Activate Neural Link (WebSocket)
    useRealtime();

    // 2. Consume Data Stream
    const { data: metrics } = useSystemMetrics();

    const isLoading = !metrics;

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content */}
            <div className="pl-64 transition-all duration-300">
                {/* Header */}
                <Header
                    title="Sovereign Dashboard"
                    subtitle="Real-time system telemetry & orchestration"
                    isOnline={!isLoading}
                />

                {/* Dashboard Content */}
                <main className="p-6 space-y-6">
                    {/* Metric Cards Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            title="Bio Stress"
                            stress={metrics?.bio?.stress ?? 0}
                            action={metrics?.bio?.action ?? "IDLE"}
                            icon={<Activity className="h-4 w-4" />}
                            color="red"
                            loading={isLoading}
                            trend={metrics?.bio?.stress && metrics.bio.stress > 0.5 ? "up" : "down"}
                            subtitle="Health Monitor"
                        />
                        <MetricCard
                            title="Market Risk"
                            stress={metrics?.market?.stress ?? 0}
                            action={metrics?.market?.action ?? "IDLE"}
                            icon={<TrendingUp className="h-4 w-4" />}
                            color="green"
                            loading={isLoading}
                            trend={metrics?.market?.stress && metrics.market.stress > 0.7 ? "up" : "down"}
                            subtitle="Financial Status"
                        />
                        <MetricCard
                            title="Grid Load"
                            stress={metrics?.energy?.stress ?? 0}
                            action={metrics?.energy?.action ?? "IDLE"}
                            icon={<Zap className="h-4 w-4" />}
                            color="blue"
                            loading={isLoading}
                            trend="neutral"
                            subtitle="Power System"
                        />
                        <MetricCard
                            title="Project Entropy"
                            stress={(100 - (metrics?.entropy ?? 100)) / 100}
                            action="CALCULATING"
                            icon={<Layers className="h-4 w-4" />}
                            color="purple"
                            loading={isLoading}
                            trend="neutral"
                            subtitle="System Order"
                        />
                    </div>

                    {/* Charts and Console Grid */}
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

                    {/* Additional Stats Row */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Project Stats Card */}
                        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Project Files
                                </CardTitle>
                                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20">
                                    <FileCode className="h-4 w-4 text-cyan-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {metrics?.project?.files?.toLocaleString() ?? "—"}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Total files tracked
                                </p>
                            </CardContent>
                        </Card>

                        {/* LOC Stats Card */}
                        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Lines of Code
                                </CardTitle>
                                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-amber-500/10 border border-amber-500/20">
                                    <Server className="h-4 w-4 text-amber-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {metrics?.project?.loc?.toLocaleString() ?? "—"}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Total LOC
                                </p>
                            </CardContent>
                        </Card>

                        {/* Timestamp Card */}
                        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Last Update
                                </CardTitle>
                                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-pink-500/10 border border-pink-500/20">
                                    <Clock className="h-4 w-4 text-pink-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold font-mono">
                                    {metrics?.timestamp ?? "—"}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Real-time sync
                                </p>
                            </CardContent>
                        </Card>

                        {/* Hash Card */}
                        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Block Hash
                                </CardTitle>
                                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-violet-500/10 border border-violet-500/20">
                                    <Hash className="h-4 w-4 text-violet-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold font-mono text-violet-400 truncate">
                                    {metrics?.hash ?? "NO_HASH"}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    SHA-512 Signature
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-6 border-t border-border/50">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-400">
                                v2.0.0
                            </Badge>
                            <span>Sovereign Engine</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>Secured by SHA-512</span>
                            <span className="font-mono">{metrics?.hash?.substring(0, 16) ?? "NO_HASH"}</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
