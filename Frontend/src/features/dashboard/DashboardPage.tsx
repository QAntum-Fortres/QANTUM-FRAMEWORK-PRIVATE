import { Activity, Zap, TrendingUp, Layers, Server, Clock, Hash, FileCode, Play, Eye, Brain, ShieldCheck } from "lucide-react";
import { useSystemMetrics } from "./hooks/useMetrics";
import { useRealtime } from "@/hooks/useRealtime";
import { MetricCard } from "./components/MetricCard";
import { EntropyChart } from "./components/EntropyChart";
import { SystemConsole } from "./components/SystemConsole";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { Agent, GoalResult } from '@/veritas_sdk/Agent';

export function DashboardPage() {
    // 1. Activate Neural Link (WebSocket)
    useRealtime();

    // 2. Consume Data Stream
    const { data: metrics } = useSystemMetrics();

    const isLoading = !metrics;

    // Veritas Agent State
    const [agentResult, setAgentResult] = useState<GoalResult | null>(null);
    const [isAgentRunning, setIsAgentRunning] = useState(false);

    const runVeritasAgent = async () => {
        setIsAgentRunning(true);
        setAgentResult(null);
        const agent = new Agent();
        // Simulate a delay to show "Thinking" state
        await new Promise(r => setTimeout(r, 500));
        const result = await agent.execute("Verify that a user can complete a purchase with a 10% discount code.");
        setAgentResult(result);
        setIsAgentRunning(false);
    };

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

                    {/* Veritas Intelligence Control Center */}
                    <Card className="border-cyan-500/30 bg-cyan-950/5">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Brain className="h-5 w-5 text-cyan-400" />
                                        Veritas Cognitive QA Framework
                                    </CardTitle>
                                    <CardDescription>Autonomous Neural Agents & Semantic Healing</CardDescription>
                                </div>
                                <Button
                                    onClick={runVeritasAgent}
                                    disabled={isAgentRunning}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                >
                                    {isAgentRunning ? (
                                        <span className="flex items-center gap-2">
                                            <Activity className="h-4 w-4 animate-spin" /> Executing Agent...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Play className="h-4 w-4" /> Run Autonomous Test
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 border border-cyan-500/20 rounded bg-black/20">
                                    <h3 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                                        <Eye className="h-4 w-4" /> Neural Locator
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Vision-Transformer (ViT) Active.
                                        Scanning for visual intents: "Buy", "Checkout", "Login".
                                    </p>
                                </div>
                                <div className="p-4 border border-cyan-500/20 rounded bg-black/20">
                                    <h3 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" /> Semantic Healing
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Zero-Wait Observer: Stable.
                                        Embeddings mapped for resilience.
                                    </p>
                                </div>
                                <div className="p-4 border border-cyan-500/20 rounded bg-black/20">
                                     <h3 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                                        <Activity className="h-4 w-4" /> Agent Status
                                    </h3>
                                    <div className="text-xs">
                                        {isAgentRunning ? "Agent Exploring SaaS..." : agentResult ? "Mission Complete" : "Standby"}
                                    </div>
                                </div>
                            </div>

                            {/* Agent Results Log */}
                            {agentResult && (
                                <div className="mt-4 p-4 bg-black/40 border border-border rounded font-mono text-xs max-h-60 overflow-y-auto">
                                    <div className="flex justify-between text-green-400 mb-2">
                                        <span>GOAL: Verify purchase with 10% discount</span>
                                        <span>STATUS: {agentResult.success ? "SUCCESS" : "FAILED"}</span>
                                    </div>
                                    <div className="space-y-1">
                                        {agentResult.steps.map((step, i) => (
                                            <div key={i} className="flex gap-2 border-b border-white/5 pb-1 mb-1 last:border-0">
                                                <span className="text-slate-500">[{new Date(step.timestamp).toLocaleTimeString()}]</span>
                                                <span className="text-blue-400">{step.action}</span>
                                                <span className="text-slate-300">➜ {step.observation}</span>
                                                <span className="text-yellow-500/70 italic">({step.reasoning})</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-purple-400">
                                        Generated Singularity Audit Log: {agentResult.auditLog}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>


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
