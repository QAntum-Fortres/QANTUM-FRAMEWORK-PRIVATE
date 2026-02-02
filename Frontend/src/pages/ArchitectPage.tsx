import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Activity, Brain, Shield, Terminal, Zap, GitBranch, Eye } from "lucide-react";

export function ArchitectPage() {
    return (
        <div className="min-h-screen bg-black text-blue-100 p-8 space-y-8 font-mono">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-blue-900/30 pb-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black tracking-tighter text-blue-500 uppercase glitch-text">
                        The Architect Workspace
                    </h2>
                    <p className="text-xs text-blue-400/60 uppercase tracking-widest">
                        System Level: GOD_MODE • Clearance: OMEGA
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="outline" className="border-blue-800 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300" asChild>
                        <Link to="/">
                            <Terminal className="mr-2 h-4 w-4" />
                            SYS_DASHBOARD
                        </Link>
                    </Button>
                    <Badge variant="outline" className="border-green-500/50 text-green-500 animate-pulse bg-green-500/10">
                        <Activity className="mr-1 h-3 w-3" />
                        NODE_ONLINE
                    </Badge>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Neural Map Engine */}
                <Card className="bg-slate-950 border-blue-800/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                    <CardHeader>
                        <CardTitle className="flex items-center text-blue-400">
                            <Brain className="mr-2 h-5 w-5" />
                            NEURAL MAP ENGINE
                        </CardTitle>
                        <CardDescription className="text-slate-500">Cognitive Anchor Analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-blue-950/30 p-2 rounded border border-blue-900/30">
                                <span className="block text-slate-500 text-xs">Anchors</span>
                                <span className="text-xl font-bold text-blue-300">1,024</span>
                            </div>
                            <div className="bg-blue-950/30 p-2 rounded border border-blue-900/30">
                                <span className="block text-slate-500 text-xs">Confidence</span>
                                <span className="text-xl font-bold text-green-400">98.2%</span>
                            </div>
                        </div>
                        <div className="text-xs text-slate-400 font-mono bg-black/50 p-2 rounded h-32 overflow-y-auto">
                            <div className="flex justify-between"><span className="text-blue-500">[SCAN]</span> <span>DOM Tree parsed</span></div>
                            <div className="flex justify-between"><span className="text-green-500">[OK]</span> <span>Semantic match: login_btn</span></div>
                            <div className="flex justify-between"><span className="text-green-500">[OK]</span> <span>Visual hash verified</span></div>
                            <div className="flex justify-between"><span className="text-yellow-500">[WARN]</span> <span>Drift detected: 2px</span></div>
                            <div className="flex justify-between"><span className="text-blue-500">[HEAL]</span> <span>Selector updated</span></div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            <Eye className="mr-2 h-4 w-4" />
                            VISUALIZE MAP
                        </Button>
                    </CardContent>
                </Card>

                {/* Swarm Intelligence */}
                <Card className="bg-slate-950 border-purple-800/50 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                    <CardHeader>
                        <CardTitle className="flex items-center text-purple-400">
                            <Zap className="mr-2 h-5 w-5" />
                            SWARM INTELLIGENCE
                        </CardTitle>
                        <CardDescription className="text-slate-500">Distributed Execution Grid</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-purple-950/30 p-2 rounded border border-purple-900/30">
                                <span className="block text-slate-500 text-xs">Active Agents</span>
                                <span className="text-xl font-bold text-purple-300">128</span>
                            </div>
                            <div className="bg-purple-950/30 p-2 rounded border border-purple-900/30">
                                <span className="block text-slate-500 text-xs">Load</span>
                                <span className="text-xl font-bold text-yellow-400">42%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between text-xs text-slate-400">
                                <span>Agent-01 (Alpha)</span>
                                <span className="text-green-500">IDLE</span>
                             </div>
                             <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full w-[0%]"></div>
                             </div>

                             <div className="flex justify-between text-xs text-slate-400">
                                <span>Agent-02 (Beta)</span>
                                <span className="text-blue-500">PROCESSING</span>
                             </div>
                             <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[75%] animate-pulse"></div>
                             </div>
                             
                             <div className="flex justify-between text-xs text-slate-400">
                                <span>Agent-03 (Gamma)</span>
                                <span className="text-purple-500">LEARNING</span>
                             </div>
                             <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                <div className="bg-purple-500 h-full w-[45%]"></div>
                             </div>
                        </div>
                         <Button variant="outline" className="w-full border-purple-800 text-purple-400 hover:bg-purple-950">
                            <GitBranch className="mr-2 h-4 w-4" />
                            DEPLOY SWARM
                        </Button>
                    </CardContent>
                </Card>

                {/* Ghost Protocol */}
                <Card className="bg-slate-950 border-red-800/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                    <CardHeader>
                        <CardTitle className="flex items-center text-red-400">
                            <Shield className="mr-2 h-5 w-5" />
                            GHOST PROTOCOL
                        </CardTitle>
                        <CardDescription className="text-slate-500">Security & Obfuscation Layer</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between bg-red-950/20 p-3 rounded border border-red-900/30">
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
                                <span className="text-red-200 text-sm font-bold">ACTIVE</span>
                            </div>
                            <span className="text-xs text-slate-500">Level 5 Obfuscation</span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-slate-400">
                            <div className="flex justify-between border-b border-red-900/20 pb-1">
                                <span>TLS Fingerprint</span>
                                <span className="text-red-300 font-mono">RANDOMIZED</span>
                            </div>
                            <div className="flex justify-between border-b border-red-900/20 pb-1">
                                <span>Canvas Noise</span>
                                <span className="text-red-300 font-mono">INJECTED</span>
                            </div>
                            <div className="flex justify-between border-b border-red-900/20 pb-1">
                                <span>WebGL Mutator</span>
                                <span className="text-red-300 font-mono">ACTIVE</span>
                            </div>
                            <div className="flex justify-between pb-1">
                                <span>Proxy Chain</span>
                                <span className="text-red-300 font-mono">3 HOP</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Console Output */}
            <div className="border border-slate-800 bg-black rounded-lg p-4 font-mono text-xs h-64 overflow-hidden relative">
                <div className="absolute top-2 right-2 flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-1 text-slate-300">
                    <p><span className="text-slate-500">[20:45:10]</span> <span className="text-blue-500">INFO</span> Initializing Architect Core...</p>
                    <p><span className="text-slate-500">[20:45:11]</span> <span className="text-blue-500">INFO</span> Connected to Neural Map Engine.</p>
                    <p><span className="text-slate-500">[20:45:11]</span> <span className="text-purple-500">SWARM</span> 128 Agents on standby.</p>
                    <p><span className="text-slate-500">[20:45:12]</span> <span className="text-red-500">SEC</span> Ghost Protocol engaged. TLS fingerprint randomized.</p>
                    <p><span className="text-slate-500">[20:45:12]</span> <span className="text-green-500">SUCCESS</span> System fully operational.</p>
                    <p className="animate-pulse">_</p>
                </div>
            </div>
        </div>
    );
}
