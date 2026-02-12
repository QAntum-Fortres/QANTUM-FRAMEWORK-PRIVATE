import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Play, ShieldCheck, Activity, BrainCircuit, Scan, Cpu, Loader2 } from "lucide-react";
import { veritas } from "@/veritas_sdk/VeritasClient";
import { AgentStep, VisionResult } from "@/veritas_sdk/types";

export function VeritasControlCenter() {
    const [goal, setGoal] = useState("Verify that a user can complete a purchase with a 10% discount code.");
    const [status, setStatus] = useState<"IDLE" | "SCANNING" | "EXECUTING" | "COMPLETE">("IDLE");
    const [logs, setLogs] = useState<AgentStep[]>([]);
    const [visionResult, setVisionResult] = useState<VisionResult | null>(null);

    const handleAnalyze = async () => {
        setStatus("SCANNING");
        // Mock image base64
        const mockImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
        const result = await veritas.locate(mockImage, "Find Checkout Button");
        setVisionResult(result);
        setStatus("IDLE");
    };

    const handleExecute = async () => {
        setStatus("EXECUTING");
        setLogs([]);
        const result = await veritas.executeGoal(goal);
        setLogs(result.steps);
        setStatus("COMPLETE");
    };

    return (
        <Card className="border-cyan-500/30 bg-black/40 backdrop-blur-md">
            <CardHeader className="border-b border-border/10 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="h-5 w-5 text-cyan-400" />
                        <CardTitle className="text-lg font-mono tracking-wider text-cyan-100">
                            VERITAS COGNITIVE QA v1.0
                        </CardTitle>
                    </div>
                    <Badge role="status" aria-live="polite" variant="outline" className={`
                        ${status === 'EXECUTING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse' : ''}
                        ${status === 'SCANNING' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 animate-pulse' : ''}
                        ${status === 'COMPLETE' ? 'bg-green-500/10 text-green-400 border-green-500/30' : ''}
                        ${status === 'IDLE' ? 'bg-slate-500/10 text-slate-400 border-slate-500/30' : ''}
                    `}>
                        STATUS: {status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">

                {/* Vision Interface */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Eye className="h-4 w-4" /> VISION-BASED INTERFACE (THE EYES)
                        </h3>
                        <div className="aspect-video bg-slate-900/50 rounded-lg border border-border/20 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity" />
                            {status === 'SCANNING' && (
                                <div className="absolute inset-0 bg-cyan-500/10 animate-scan" />
                            )}

                            {/* Overlay Bounding Box if Found */}
                            {visionResult?.location && (
                                <div
                                    className="absolute border-2 border-green-500 bg-green-500/20 z-20 flex items-center justify-center"
                                    style={{
                                        // Mock positioning relative to container (just centering for demo)
                                        left: '40%', top: '40%', width: '20%', height: '10%'
                                    }}
                                >
                                    <span className="text-[10px] text-green-400 font-mono bg-black/80 px-1">
                                        {visionResult.location.label || "TARGET"}
                                    </span>
                                </div>
                            )}

                            <Button variant="outline" onClick={handleAnalyze} disabled={status !== 'IDLE'} className="relative z-10 bg-black/60 border-cyan-500/50 hover:bg-cyan-500/20">
                                {status === 'SCANNING' ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> ANALYZING...
                                    </>
                                ) : (
                                    <>
                                        <Scan className="h-4 w-4 mr-2" /> TRIGGER NEURAL LOCATOR
                                    </>
                                )}
                            </Button>
                        </div>

                        {visionResult && (
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                <div className="bg-slate-950 p-2 rounded border border-border/10">
                                    <div className="text-muted-foreground mb-1 flex items-center gap-1">
                                        <Scan className="h-3 w-3" /> CANDIDATES
                                    </div>
                                    <div className="text-cyan-400">{visionResult.candidates?.length ?? 0} Detected</div>
                                </div>
                                <div className="bg-slate-950 p-2 rounded border border-border/10">
                                    <div className="text-muted-foreground mb-1 flex items-center gap-1">
                                        <Cpu className="h-3 w-3" /> LATENCY
                                    </div>
                                    <div className="text-cyan-400">{visionResult.processing_time_ms}ms</div>
                                </div>
                                <div className="col-span-2 bg-slate-950 p-2 rounded border border-border/10">
                                     <div className="text-muted-foreground mb-1">REASONING</div>
                                     <div className="text-slate-300 italic">"{visionResult.reasoning}"</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Agent Interface */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Activity className="h-4 w-4" /> AUTONOMOUS AGENT (THE BRAIN)
                        </h3>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="mission-goal" className="sr-only">Mission Objective</label>
                            <div className="flex gap-2">
                                <input
                                    id="mission-goal"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={goal}
                                    placeholder="Enter mission objective..."
                                    onChange={(e) => setGoal(e.target.value)}
                                />
                                <Button onClick={handleExecute} disabled={status !== 'IDLE'} className="bg-cyan-600 hover:bg-cyan-700">
                                    {status === 'EXECUTING' ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> EXECUTING...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="h-4 w-4 mr-2" /> EXECUTE
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="bg-slate-950 rounded-md border border-border/20 p-4 h-[200px] overflow-y-auto font-mono text-xs">
                            {logs.length === 0 ? (
                                <span className="text-muted-foreground italic">Awaiting mission parameters...</span>
                            ) : (
                                <div className="space-y-3">
                                    {logs.map((step, i) => (
                                        <div key={i} className="border-l-2 border-cyan-500/30 pl-3 pb-1">
                                            <div className="flex items-center justify-between text-cyan-300 mb-1">
                                                <span className="font-bold">{step.action}</span>
                                                <span className="text-[10px] text-slate-500">{step.duration_ms}ms</span>
                                            </div>
                                            <p className="text-slate-300 mb-1">{step.observation}</p>
                                            <p className="text-[10px] text-slate-500 italic">Reasoning: {step.reasoning}</p>
                                        </div>
                                    ))}
                                    <div className="text-green-400 font-bold border-t border-green-500/20 pt-2 mt-2 flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" /> MISSION COMPLETE. SINGULARITY LOG GENERATED.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
