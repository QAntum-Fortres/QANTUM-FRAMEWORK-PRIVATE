import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Eye, ShieldCheck, Brain, Zap, Globe,
    Activity, PlayCircle, AlertCircle, CheckCircle
} from 'lucide-react';

// --- MOCK DATA FOR DEMO ---
const MOCK_AUDIT_LOGS = [
    { id: 1, intent: "Verify Checkout 10% Off", status: "success", duration: "1.2s", confidence: 0.99, region: "us-east-1" },
    { id: 2, intent: "Login Failure Recovery", status: "healed", duration: "0.8s", confidence: 0.92, region: "eu-central-1" },
    { id: 3, intent: "Find 'Subscribe' Button", status: "success", duration: "0.4s", confidence: 0.98, region: "ap-northeast-1" },
];

const SwarmNode = ({ x, y, status }: { x: number, y: number, status: string }) => (
    <motion.div
        className={`absolute w-2 h-2 rounded-full ${status === 'active' ? 'bg-[var(--neon-cyan)]' : 'bg-[var(--neon-purple)]'}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
        style={{ left: `${x}%`, top: `${y}%` }}
    />
);

export const VeritasDashboard = () => {
    const [logs, setLogs] = useState(MOCK_AUDIT_LOGS);
    const [swarmNodes, setSwarmNodes] = useState<{x: number, y: number, id: number}[]>([]);

    useEffect(() => {
        // Generate random swarm nodes
        const nodes = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 20
        }));
        setSwarmNodes(nodes);
    }, []);

    return (
        <div className="w-full bg-[#05050a] border border-[#2a2a50] rounded-2xl overflow-hidden font-['Outfit'] relative">
            {/* HEADER */}
            <div className="p-6 border-b border-[#2a2a50] flex justify-between items-center bg-[#0a0a12]/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--neon-cyan)]/10 rounded-lg">
                        <Eye className="text-[var(--neon-cyan)]" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">
                            Veritas <span className="text-[var(--neon-purple)]">Cognitive QA</span>
                        </h2>
                        <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">Vision-Based • Self-Healing • Zero-Wait</p>
                    </div>
                </div>

                <div className="flex gap-4">
                     <div className="text-right">
                        <p className="text-2xl font-black text-[var(--neon-cyan)]">1,024</p>
                        <p className="text-[9px] uppercase tracking-widest opacity-40">Active Agents</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-[var(--neon-gold)]">99.9%</p>
                        <p className="text-[9px] uppercase tracking-widest opacity-40">Amniotic Stability</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* LEFT: SWARM MAP */}
                <div className="lg:col-span-2 p-6 relative min-h-[300px] border-r border-[#2a2a50]">
                    <div className="absolute top-6 left-6 z-10">
                        <h3 className="text-sm font-bold tracking-[0.2em] uppercase opacity-60 flex items-center gap-2">
                            <Globe size={14} /> Global Swarm Mesh
                        </h3>
                    </div>

                    {/* Fake Map Grid */}
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

                    {/* World Map Silhouette (CSS shapes or SVG) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                         <div className="w-[80%] h-[60%] border-2 border-dashed border-white rounded-full" />
                    </div>

                    {/* Nodes */}
                    {swarmNodes.map(node => (
                        <SwarmNode key={node.id} x={node.x} y={node.y} status="active" />
                    ))}

                    <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur border border-white/10 p-4 rounded-xl">
                        <div className="flex items-center gap-3 text-xs mb-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
                            <span className="opacity-60">US-EAST-1</span>
                            <span className="font-mono font-bold text-[var(--neon-cyan)]">OPTIMAL</span>
                        </div>
                         <div className="flex items-center gap-3 text-xs">
                            <span className="w-2 h-2 rounded-full bg-[var(--neon-purple)]" />
                            <span className="opacity-60">EU-WEST-3</span>
                            <span className="font-mono font-bold text-[var(--neon-purple)]">HEALING</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: SINGULARITY LOG */}
                <div className="p-6 bg-[#020205]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold tracking-[0.2em] uppercase opacity-60 flex items-center gap-2">
                            <Brain size={14} /> Singularity Audit
                        </h3>
                        <Activity size={14} className="text-[var(--neon-cyan)] animate-pulse" />
                    </div>

                    <div className="space-y-4">
                        {logs.map(log => (
                            <motion.div
                                key={log.id}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-white group-hover:text-[var(--neon-cyan)] transition-colors">
                                        {log.intent}
                                    </span>
                                    {log.status === 'success' ? (
                                        <CheckCircle size={14} className="text-green-400" />
                                    ) : (
                                        <ShieldCheck size={14} className="text-[var(--neon-purple)]" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-mono opacity-50 uppercase tracking-wider mb-3">
                                    <span>{log.region}</span>
                                    <span>•</span>
                                    <span>{log.duration}</span>
                                </div>

                                {/* AI Annotation Mock */}
                                <div className="p-2 bg-black/40 rounded text-[10px] font-mono text-[var(--neon-cyan)] opacity-80 border-l-2 border-[var(--neon-cyan)]">
                                    AI: {log.status === 'healed' ? "Selector failure detected. Semantic Healer engaged. Confidence: 92%." : "Visual intent matched. OBI verification passed."}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-3 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[var(--neon-cyan)] hover:text-black transition-all flex items-center justify-center gap-2">
                        <PlayCircle size={16} /> View Full Replay
                    </button>
                </div>
            </div>
        </div>
    );
};
