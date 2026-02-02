import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import {
    Activity, Brain, Shield, Terminal, Zap, Eye, Play, FileCode,
    Network, Database, Lock, Cpu, Globe, Layers, AlertTriangle, Users
} from "lucide-react";

const DEPARTMENTS = [
    { id: 'intelligence', name: 'Intelligence (AI)', icon: Brain, color: 'text-cyan-neon', status: 'Active' },
    { id: 'omega', name: 'Omega (Data)', icon: Database, color: 'text-magenta-neon', status: 'Synced' },
    { id: 'physics', name: 'Physics (Infra)', icon: Network, color: 'text-purple-neon', status: 'Stable' },
    { id: 'fortress', name: 'Fortress (Sec)', icon: Shield, color: 'text-green-neon', status: 'Secure' },
    { id: 'biology', name: 'Biology (UX)', icon: Users, color: 'text-orange-500', status: 'Optimal' },
    { id: 'guardians', name: 'Guardians (Ops)', icon: Lock, color: 'text-yellow-500', status: 'Patrolling' },
    { id: 'reality', name: 'Reality (Web)', icon: Globe, color: 'text-red-neon', status: 'Online' },
    { id: 'chemistry', name: 'Chemistry (API)', icon: Layers, color: 'text-blue-500', status: 'Reactive' },
];

const AVAILABLE_MODULES = [
    { id: 'god_mode', name: 'ANALYZE_GOD_MODULES.ps1', type: 'CORE' },
    { id: 'vortex', name: 'FIND_VORTEX_FILES.ps1', type: 'SCAN' },
    { id: 'saas_integration', name: 'GOD_LEVEL_SAAS_AUTO_INTEGRATOR.ps1', type: 'DEPLOY' },
    { id: 'repo_org', name: 'ULTIMATE_REPO_ORGANIZER.ps1', type: 'SYS' },
    { id: 'deploy_all', name: 'DEPLOY_ALL_REPOS.ps1', type: 'DEPLOY' },
    { id: 'wealth_bridge', name: 'MINT_WEALTH.ps1', type: 'FINANCE' },
];

export function ArchitectPage() {
    const [selectedDept, setSelectedDept] = useState('intelligence');
    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    const [logs, setLogs] = useState<string[]>([
        "[SYSTEM] MISTER MIND CONTROL NEXUS v3.0 INITIALIZED",
        "[SYSTEM] Connectivity: QUANTUM ENCRYPTION ACTIVE",
        "[SYSTEM] Departments: 8/8 ONLINE",
        "[SYSTEM] Awaiting Operator Input..."
    ]);
    const consoleEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    // --- LIVE SYSTEM SIMULATION ---
    const [sysStats, setSysStats] = useState({ cpu: 12, ram: 45, net: 890 });

    useEffect(() => {
        const interval = setInterval(() => {
            setSysStats({
                cpu: Math.floor(Math.random() * (45 - 10) + 10),
                ram: Math.floor(Math.random() * (70 - 40) + 40),
                net: Math.floor(Math.random() * (990 - 800) + 800)
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // --- VISUALIZATION COMPONENT ---
    const renderVisualization = () => {
        switch (selectedDept) {
            case 'fortress': // Shield Visual
                return (
                    <div className="relative w-64 h-64 flex items-center justify-center animate-pulse">
                        <Shield size={120} className="text-green-500 opacity-20 absolute" />
                        <Shield size={100} className="text-green-400 opacity-40 absolute animate-ping-slow" />
                        <div className="absolute inset-0 border-4 border-green-500/10 rounded-full animate-spin-slow-reverse border-t-transparent"></div>
                        <div className="text-green-neon font-bold text-xs mt-32 bg-black/60 px-2 rounded border border-green-900">SHIELD: ACTIVE</div>
                    </div>
                );
            case 'omega': // Database Visual
                return (
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <div className="grid grid-cols-4 gap-2 opacity-50">
                            {[...Array(16)].map((_, i) => <div key={i} className="w-8 h-8 bg-magenta-500/20 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>)}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Database size={80} className="text-magenta-neon drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]" />
                        </div>
                    </div>
                );
            case 'wealth_bridge': // Finance Visual
                return (
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <div className="w-48 h-48 border-2 border-yellow-500/30 rounded-full animate-spin-slow border-b-transparent"></div>
                        <div className="w-32 h-32 border-2 border-yellow-400/50 rounded-full absolute animate-reverse-spin border-t-transparent"></div>
                        <div className="text-yellow-400 font-mono text-4xl font-bold animate-pulse">$ MINT</div>
                    </div>
                );
            default: // Default AI Core
                return (
                    <div className="relative w-64 h-64 border border-cyan-500/20 rounded-full animate-spin-slow flex items-center justify-center">
                        <div className="w-48 h-48 border border-magenta-500/20 rounded-full animate-reverse-spin flex items-center justify-center">
                            <div className="w-32 h-32 bg-cyan-500/5 rounded-full blur-xl animate-pulse"></div>
                            <Brain size={64} className="text-cyan-neon relative z-10 opacity-80" />
                        </div>
                        <div className="absolute top-0 w-full text-center text-[10px] text-cyan-900 tracking-[0.5em] animate-pulse">NEURAL LINK</div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-quantum-void text-slate-300 font-mono overflow-hidden flex">

            {/* BACKGROUND EFFECTS */}
            <div className="scan-line"></div>

            {/* SIDEBAR - DEPARTMENTS */}
            <div className="w-80 bg-quantum-deep border-r border-slate-800 flex flex-col z-20">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-display font-bold text-center text-cyan-neon tracking-widest animate-pulse">
                        NEXUS v3.0
                    </h1>
                    <p className="text-[10px] text-center text-slate-500 uppercase mt-1">Fullstack Empire Command</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {DEPARTMENTS.map(dept => (
                        <div
                            key={dept.id}
                            onClick={() => setSelectedDept(dept.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-800/50 flex items-center gap-3 ${selectedDept === dept.id
                                ? 'bg-slate-800/80 border-cyan-neon shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                                : 'bg-quantum-dark border-slate-800/50 opacity-70 hover:opacity-100'
                                }`}
                        >
                            <div className={`p-2 rounded bg-slate-900/50 ${dept.color}`}>
                                <dept.icon size={18} />
                            </div>
                            <div className="flex-1">
                                <h3 className={`text-xs font-bold uppercase tracking-wider ${selectedDept === dept.id ? 'text-white' : 'text-slate-400'
                                    }`}>
                                    {dept.name}
                                </h3>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[10px] text-slate-500">Status</span>
                                    <span className={`text-[10px] font-bold ${dept.color}`}>{dept.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-800 text-[10px] text-slate-600 text-center">
                    SECURE CONNECTION | ID: OMEGA-99
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* HEADS UP DISPLAY (HEADER) */}
                <div className="h-16 bg-quantum-deep border-b border-slate-800 flex items-center justify-between px-8 z-20">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 uppercase">System Level</span>
                            <span className="text-sm font-bold text-magenta-neon glitch-text">GOD_MODE</span>
                        </div>
                        <div className="h-8 w-px bg-slate-800"></div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 uppercase">Active Sector</span>
                            <span className="text-sm font-bold text-white font-display uppercase">
                                {DEPARTMENTS.find(d => d.id === selectedDept)?.name}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="border-red-500/50 text-red-500 bg-red-500/10 animate-pulse">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            GHOST PROTOCOL
                        </Badge>
                        <Badge variant="outline" className="border-green-500/50 text-green-500 bg-green-500/10">
                            <Activity className="w-3 h-3 mr-1" />
                            ONLINE
                        </Badge>
                    </div>
                </div>

                {/* WORKSPACE GRID */}
                <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-y-auto z-10 custom-scrollbar">

                    {/* LEFT COLUMN: MODULES & CONTROLS */}
                    <div className="col-span-4 flex flex-col gap-6">
                        <Card className="bg-quantum-dark border-slate-800 text-slate-300 shadow-lg">
                            <CardContent className="p-0">
                                <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/30">
                                    <span className="text-cyan-neon font-bold text-sm flex items-center gap-2">
                                        <Zap size={16} /> EXECUTION GRID
                                    </span>
                                    <span className="text-[10px] text-slate-500">READY</span>
                                </div>
                                <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {AVAILABLE_MODULES.map(module => (
                                        <button
                                            key={module.id}
                                            onClick={() => setSelectedModule(module.id)}
                                            className={`w-full text-left p-3 rounded text-xs font-mono transition-all flex justify-between items-center group ${selectedModule === module.id
                                                ? 'bg-purple-900/30 border border-purple-500 text-white'
                                                : 'text-slate-400 hover:bg-slate-800 border border-transparent'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <FileCode size={14} className={selectedModule === module.id ? 'text-purple-400' : 'text-slate-600'} />
                                                {module.name}
                                            </span>
                                            <span className={`text-[10px] opacity-70 px-2 py-0.5 rounded w-16 text-center border ${module.type === 'CORE' ? 'border-red-500 text-red-500' :
                                                module.type === 'FINANCE' ? 'border-yellow-500 text-yellow-500' :
                                                    'border-slate-600 text-slate-400'
                                                }`}>
                                                {module.type}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-slate-800">
                                    <Button
                                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-wider relative overflow-hidden group"
                                        disabled={!selectedModule || isExecuting}
                                        onClick={handleExecute}
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        {isExecuting ? <div className="animate-spin"><Zap size={16} /></div> : <Play size={16} className="mr-2" />}
                                        {isExecuting ? 'EXECUTING...' : 'ENGAGE PROTOCOL'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SYSTEM HEALTH (LIVE) */}
                        <Card className="bg-quantum-dark border-slate-800 text-slate-300">
                            <CardContent className="p-4 space-y-4">
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Live System Resources</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs"><span>CPU Core</span> <span className="text-cyan-neon font-mono">{sysStats.cpu}%</span></div>
                                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                        <div className="bg-cyan-500 h-1 transition-all duration-500 ease-out shadow-[0_0_10px_cyan]" style={{ width: `${sysStats.cpu}%` }}></div>
                                    </div>

                                    <div className="flex justify-between text-xs"><span>Neural Memory</span> <span className="text-magenta-neon font-mono">{sysStats.ram}%</span></div>
                                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                        <div className="bg-magenta-500 h-1 transition-all duration-500 ease-out shadow-[0_0_10px_magenta]" style={{ width: `${sysStats.ram}%` }}></div>
                                    </div>

                                    <div className="flex justify-between text-xs"><span>Bandwidth (Global)</span> <span className="text-green-neon font-mono">{sysStats.net} Mbps</span></div>
                                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-1 transition-all duration-500 ease-out shadow-[0_0_10px_lime]" style={{ width: `${(sysStats.net / 1000) * 100}%` }}></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: VISUALIZATION & TERMINAL */}
                    <div className="col-span-8 flex flex-col gap-6 h-full min-h-[600px]">

                        {/* THE EYE (Adaptive Visualization) */}
                        <div className="flex-1 bg-black/40 border border-slate-800 rounded-lg relative overflow-hidden group flex items-center justify-center">

                            {/* Render the Active Visual */}
                            {renderVisualization()}

                            <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur rounded border border-slate-800">
                                <span className="text-xs text-cyan-neon font-mono flex items-center gap-2">
                                    <Eye size={12} /> LIVE FEED: {selectedDept.toUpperCase()}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                        </div>

                        {/* TERMINAL */}
                        <div className="h-64 bg-black border border-slate-800 rounded-lg shadow-inner shadow-black flex flex-col font-mono text-xs overflow-hidden">
                            <div className="bg-slate-900/50 p-2 border-b border-slate-800 flex justify-between items-center px-4">
                                <span className="text-slate-400 flex items-center gap-2"><Terminal size={12} /> NERVE CENTER TERMINAL</span>
                                <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><div className="w-2 h-2 rounded-full bg-yellow-500"></div><div className="w-2 h-2 rounded-full bg-green-500"></div></div>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto space-y-1 custom-scrollbar bg-black/90">
                                {logs.map((log, i) => (
                                    <div key={i} className={`break-words font-mono ${log.includes('[CMD]') ? 'text-cyan-neon font-bold' :
                                        log.includes('[SUCCESS]') ? 'text-green-400' :
                                            log.includes('[WARN]') ? 'text-yellow-400' :
                                                log.includes('[SYSTEM]') ? 'text-slate-500' :
                                                    'text-slate-300'
                                        }`}>
                                        {log}
                                    </div>
                                ))}
                                <div ref={consoleEndRef} />
                                {isExecuting && <div className="opacity-50 animate-pulse text-cyan-500">_ Processing directive...</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
