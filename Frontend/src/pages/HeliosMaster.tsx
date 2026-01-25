import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Shield, Zap, Cpu, Globe, Terminal,
    Layers, ExternalLink, RefreshCw, AlertTriangle
} from 'lucide-react';
import { useSovereignStore } from '../core/socket/NativeWebSocket';
import { NervePanel } from '../components/NervePanel';

// --- COMPONENTS ---

const ProjectCard = ({ name, status, url, type, color, description }: {
    name: string;
    status: 'online' | 'offline' | 'degraded';
    url: string;
    type: string;
    color: string;
    description?: string;
}) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-[#0a0a12]/80 backdrop-blur-xl border border-[#2a2a50] p-6 rounded-2xl relative overflow-hidden group min-h-[220px] flex flex-col"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: color }}>
                <Layers size={24} style={{ color }} />
            </div>
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">{status === 'online' ? 'SYNCED' : 'AWAITING_UPLINK'}</span>
            </div>
        </div>

        <h3 className="text-xl font-black italic tracking-tight mb-1 uppercase group-hover:text-[var(--neon-cyan)] transition-colors">
            {name}
        </h3>
        <p className="text-xs opacity-50 font-mono mb-3 uppercase tracking-wider">{type}</p>
        <p className="text-[10px] opacity-40 mb-6 flex-1 italic">{description}</p>

        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full py-3 px-4 bg-white/5 rounded-xl text-xs font-bold tracking-widest hover:bg-white/10 transition-all border border-white/5"
        >
            LAUNCH PORTAL <ExternalLink size={14} />
        </a>

        {/* GLOW DECOR */}
        <div className="absolute -bottom-10 -right-10 w-24 h-24 blur-[60px] opacity-20" style={{ backgroundColor: color }} />
    </motion.div>
);

const SubstrateCard = ({ icon: Icon, label, value, color }: {
    icon: any;
    label: string;
    value: string;
    color: string;
}) => (
    <div className="bg-[#0a0a12]/40 border border-[#2a2a50] p-4 rounded-xl flex items-center gap-4">
        <div className="p-2 rounded-lg bg-opacity-10" style={{ backgroundColor: color }}>
            <Icon size={18} style={{ color }} />
        </div>
        <div>
            <p className="text-[9px] font-mono uppercase tracking-widest opacity-40">{label}</p>
            <p className="text-lg font-black tracking-tight">{value}</p>
        </div>
    </div>
);

// --- MAIN PAGE ---

export const HeliosMaster = () => {
    const { metrics, isConnected } = useSovereignStore();

    return (
        <div className="min-h-screen bg-[#020205] text-white p-8 font-['Outfit'] overflow-x-hidden relative">
            {/* VORTEX SOURCE */}
            <div className="vortex-bg" />

            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-2"
                        >
                            <div className="w-12 h-0.5 bg-[var(--neon-cyan)]" />
                            <span className="text-xs font-mono uppercase tracking-[0.5em] text-[var(--neon-cyan)]">
                                Master Control Plane
                            </span>
                        </motion.div>
                        <h1 className="text-6xl font-[900] italic uppercase tracking-tighter leading-none">
                            HELIOS <span className="text-white/20">SINGULARITY</span>
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        <SubstrateCard
                            icon={Cpu}
                            label="Ryzen 7950X"
                            value={`${metrics?.hardware?.cpu?.toFixed(1) || "0.0"}%`}
                            color="var(--neon-cyan)"
                        />
                        <SubstrateCard
                            icon={Activity}
                            label="Resonance"
                            value={`${metrics?.hardware?.resonance?.toFixed(4) || "0.8890"}`}
                            color="var(--neon-gold)"
                        />
                        <div className="flex flex-col justify-center items-end ml-4">
                            <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">System Link</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold tracking-tighter">{isConnected ? 'CONNECTED' : 'OFFLINE'}</span>
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-cyan-400' : 'bg-red-500'}`} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* GLOBAL EMPIRE STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="text-center p-4">
                        <p className="text-3xl font-black text-white italic">{metrics?.project?.loc?.toLocaleString() || "958,219"}</p>
                        <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">Lines of Code</p>
                    </div>
                    <div className="text-center p-4">
                        <p className="text-3xl font-black text-purple-400 italic">{metrics?.project?.files?.toLocaleString() || "1,420"}</p>
                        <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">Total Files</p>
                    </div>
                    <div className="text-center p-4">
                        <p className="text-3xl font-black text-emerald-400 italic">93,434</p>
                        <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">Neural Vectors</p>
                    </div>
                    <div className="text-center p-4">
                        <p className="text-3xl font-black text-amber-400 italic">8</p>
                        <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">Empire Depts</p>
                    </div>
                </div>

                {/* PROJECT GRID */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                    <ProjectCard
                        name="Helios Command"
                        status={metrics.projects?.["Helios Command"] || "offline"}
                        url="https://framework-frontend-1000690699464.us-central1.run.app"
                        type="Sovereign HUD"
                        color="#00f5ff"
                        description="Live React dashboard. Neural telemetry and real-time monitoring of the QAntum Singularity."
                    />
                    <ProjectCard
                        name="Logos Mind"
                        status={metrics.projects?.["Logos Mind"] || "offline"}
                        url="https://aeterna-logos-1000690699464.europe-west1.run.app"
                        type="Core Engine"
                        color="#bc13fe"
                        description="The Aeterna Core Engine. OmniCore and Lwas Economy running in europe-west1."
                    />
                    <ProjectCard
                        name="Wealth Bridge"
                        status={metrics.projects?.["Wealth Bridge"] || "offline"}
                        url="https://framework-backend-1000690699464.us-central1.run.app/docs"
                        type="Fiscal Logic"
                        color="#ffd700"
                        description="Direct uplink to the Stripe-integrated Python backend. Ready for transaction mining."
                    />
                    <ProjectCard
                        name="SEO Auditor"
                        status={metrics.projects?.["SEO Auditor"] || "offline"}
                        url="https://framework-frontend-1000690699464.us-central1.run.app/seo-audit"
                        type="Micro-SaaS"
                        color="#00ff00"
                        description="Autonomous analysis of meta, mobile, and performance. Generates (0-100) Veritas score."
                    />
                </motion.div>

                {/* MIDDLE LAYER: NERVE CENTER */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-white/10 flex-1" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Nerve Center / Cognitive Substrate</h2>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>
                    <NervePanel />
                </div>

                {/* BOTTOM LAYER: SYSTEM LOGS & ACTIONS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-[#0a0a12]/60 border border-[#2a2a50] rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold tracking-[0.3em] uppercase opacity-60">System Log Stream</h3>
                            <RefreshCw size={14} className="opacity-40" />
                        </div>
                        <div className="space-y-3 font-mono text-[11px]">
                            <div className="flex gap-4 opacity-100">
                                <span className="text-[var(--neon-gold)]">[REALITY_SYNC]</span>
                                <span className="opacity-60">Architect Identity Verified. Authority: 0x4121</span>
                            </div>
                            <div className="flex gap-4 opacity-80">
                                <span className="text-[var(--neon-cyan)]">[TELEMETRY]</span>
                                <span className="opacity-60">Rust Core reporting O(1) latency. Substrate stable.</span>
                            </div>
                            <div className="flex gap-4 opacity-60">
                                <span className="text-[var(--neon-purple)]">[NETWORK]</span>
                                <span className="opacity-60">Tunnel Port 8890 established. Wealth Bridge synced.</span>
                            </div>
                            <div className="flex gap-4 opacity-40">
                                <span className="text-white/40">[INITIALIZE]</span>
                                <span className="opacity-60">HELIOS Singularity manifested in us-central1.</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0a0a12]/60 border border-[#2a2a50] rounded-2xl p-6 flex flex-col gap-4">
                        <h3 className="text-sm font-bold tracking-[0.3em] uppercase opacity-60 mb-2">Omni Actions</h3>
                        <button className="w-full py-4 bg-[var(--neon-cyan)] text-black font-black italic uppercase tracking-tighter hover:bg-white transition-all rounded-lg flex items-center justify-center gap-2">
                            <RefreshCw size={18} /> SYNC ALL DEPLOYMENTS
                        </button>
                        <button className="w-full py-4 border border-red-500/30 text-red-500 font-bold uppercase tracking-widest text-[10px] hover:bg-red-500/10 transition-all rounded-lg flex items-center justify-center gap-2">
                            <AlertTriangle size={14} /> EMERGENCY PURGE
                        </button>
                        <div className="mt-auto pt-6 border-t border-white/5">
                            <p className="text-[10px] opacity-40 uppercase tracking-widest leading-relaxed">
                                Warning: Emergency Purge will disconnect all live ports and enter Veritas Lockdown.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FLOATING DECORATIONS */}
            <div className="fixed bottom-8 right-8 flex items-center gap-3">
                <div className="text-right">
                    <p className="text-[9px] font-mono uppercase tracking-[0.3em] opacity-40">Orchestrator</p>
                    <p className="text-xs font-black italic uppercase">QANTUM_v1.0</p>
                </div>
                <div className="w-12 h-12 border-2 border-[var(--neon-cyan)] rounded-full flex items-center justify-center animate-spin-slow">
                    <div className="w-8 h-8 border border-[var(--neon-gold)] rounded-full" />
                </div>
            </div>
        </div>
    );
};
