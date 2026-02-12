import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Eye, Activity, GitBranch, Target } from 'lucide-react';

const AgentNode = ({ id, status, task, x, y }: { id: string, status: string, task: string, x: number, y: number }) => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute flex flex-col items-center"
        style={{ left: `${x}%`, top: `${y}%` }}
    >
        <div className={`w-3 h-3 rounded-full ${status === 'active' ? 'bg-[var(--neon-cyan)] animate-pulse' : 'bg-gray-500'}`} />
        <div className="absolute top-4 w-32 bg-black/80 border border-white/10 p-2 rounded text-[8px] backdrop-blur-md">
            <p className="font-bold text-[var(--neon-cyan)]">{id}</p>
            <p className="opacity-70 truncate">{task}</p>
        </div>
    </motion.div>
);

export const VeritasCognitiveLayer = () => {
    const [agents, setAgents] = useState<any[]>([]);

    // Simulate active agents from the Swarm
    useEffect(() => {
        const interval = setInterval(() => {
            const newAgents = Array.from({ length: 5 }).map((_, i) => ({
                id: `AGENT-${Math.floor(Math.random() * 1000)}`,
                status: 'active',
                task: ['Locating Checkout', 'Verifying Price', 'Healing Selector', 'Exploring'][Math.floor(Math.random() * 4)],
                x: 20 + Math.random() * 60,
                y: 20 + Math.random() * 60
            }));
            setAgents(newAgents);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0a0a12]/60 border border-[#2a2a50] rounded-2xl p-6 relative overflow-hidden min-h-[300px]">
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--neon-purple)]/10 rounded-lg">
                        <Brain size={20} className="text-[var(--neon-purple)]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold tracking-[0.3em] uppercase opacity-80">Cognitive Layer</h3>
                        <p className="text-[10px] opacity-40 uppercase tracking-widest">Active Neural Map</p>
                    </div>
                </div>
                <div className="flex gap-4">
                     <div className="flex items-center gap-2">
                        <Eye size={14} className="text-[var(--neon-cyan)]" />
                        <span className="text-[10px] font-mono">VISION: ONLINE</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Target size={14} className="text-[var(--neon-gold)]" />
                        <span className="text-[10px] font-mono">GOALS: {agents.length}</span>
                     </div>
                </div>
            </div>

            {/* Neural Map Visualization */}
            <div className="absolute inset-0 top-20 opacity-30">
                 <svg width="100%" height="100%">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                 </svg>
            </div>

            {/* Agents */}
            <div className="relative z-10 w-full h-[200px]">
                {agents.map((agent, i) => (
                    <AgentNode key={i} {...agent} />
                ))}
            </div>

            {/* Footer Stats */}
            <div className="absolute bottom-4 left-6 right-6 flex justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-2">
                    <GitBranch size={12} className="opacity-40" />
                    <span className="text-[9px] font-mono opacity-40">SWARM MESH: v2.0.1</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Activity size={12} className="text-green-500" />
                    <span className="text-[9px] font-mono text-green-500">HEALING: ACTIVE</span>
                </div>
            </div>
        </div>
    );
};
