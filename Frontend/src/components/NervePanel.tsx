import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Key, Activity, Send, Terminal } from 'lucide-react';
import { useNerveCenter } from '../hooks/useNerveCenter';

export const NervePanel = () => {
    const { queryMetaLogic, transcendProblem, manifestReality, loading } = useNerveCenter();
    const [activeTab, setActiveTab] = useState<'metalogic' | 'transcendence' | 'genesis'>('metalogic');
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);

    const handleAction = async () => {
        if (!input.trim()) return;
        let data;
        if (activeTab === 'metalogic') data = await queryMetaLogic(input);
        else if (activeTab === 'transcendence') data = await transcendProblem(input);
        else data = await manifestReality({ name: input });
        setResult(data);
    };

    return (
        <div className="bg-[#0a0a12]/80 backdrop-blur-2xl border border-[#2a2a50] rounded-3xl overflow-hidden flex flex-col h-[500px]">
            {/* TABS */}
            <div className="flex border-b border-white/5">
                {[
                    { id: 'metalogic', label: 'MetaLogic', icon: Key },
                    { id: 'transcendence', label: 'Transcendence', icon: Zap },
                    { id: 'genesis', label: 'Genesis Forge', icon: Cpu },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as any); setResult(null); }}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border-b-2 border-[var(--neon-cyan)]' : 'opacity-40 hover:opacity-100'
                            }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            <div className="p-8 flex-1 flex flex-col gap-6 overflow-y-auto">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase opacity-40 tracking-widest">Input Stream</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAction()}
                            placeholder={
                                activeTab === 'metalogic' ? "Ask the Golden Key..." :
                                    activeTab === 'transcendence' ? "Enter paradox for analysis..." :
                                        "Define reality identifier..."
                            }
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm font-mono focus:border-[var(--neon-cyan)] outline-none transition-all pr-12"
                        />
                        <button
                            onClick={handleAction}
                            disabled={loading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--neon-cyan)] hover:scale-110 transition-all disabled:opacity-20"
                        >
                            {loading ? <Activity size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-black/60 rounded-2xl border border-white/5 p-6 font-mono text-[11px] relative">
                    <div className="absolute top-4 right-4 text-[var(--neon-gold)] opacity-50"><Terminal size={14} /></div>
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <div className="text-[var(--neon-cyan)] uppercase tracking-tighter">/// RESPONSE_MANIFESTED ///</div>
                                {activeTab === 'metalogic' && (
                                    <div className="space-y-2">
                                        <p className="text-white/80">{result.answer}</p>
                                        <p className="text-[var(--neon-purple)] leading-relaxed italic opacity-80">{result.bypass}</p>
                                    </div>
                                )}
                                {activeTab === 'transcendence' && (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                                            {result.mechanism?.split('\n')[0]}
                                        </div>
                                        <p className="opacity-80 leading-relaxed text-[10px]">{result.mechanism}</p>
                                        <div className="text-[var(--neon-gold)]">Resolution: {result.resolution}</div>
                                    </div>
                                )}
                                {activeTab === 'genesis' && (
                                    <div className="space-y-2 text-green-400">
                                        <p>Reality ID: {result.realityId}</p>
                                        <p>Stability Score: {result.coherenceScore || '0.998'}</p>
                                        <p>Dimensions: {result.spacetime?.dimensions?.length || 4}</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center opacity-20 italic">
                                Awaiting cognitive uplink...
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
