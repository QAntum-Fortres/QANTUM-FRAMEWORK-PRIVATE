import React, { useState, useEffect, useRef } from 'react';
import {
    Home, MessageSquare, Terminal, GitBranch, Cpu, Zap, Shield, Atom, Dna, Globe,
    Menu, X, Search, Bell, Settings, Play, Send, Paperclip, Mic,
    Trash, Download, Link as LinkIcon, User, Activity
} from 'lucide-react';
import { useSovereignStore } from '../core/socket/NativeWebSocket';
import { motion } from 'framer-motion';

// --- TYPES ---

type Page = 'dashboard' | 'chat' | 'terminal' | 'skilltree' | 'intelligence' | 'omega' | 'physics' | 'fortress' | 'biology' | 'guardians' | 'reality' | 'chemistry';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// --- COMPONENTS ---

const StatusBadge = ({ health }: { health: number }) => (
    <div className="flex items-center gap-2 text-[10px] font-mono tracking-tighter uppercase px-2 py-1 bg-[#0a0a12] border border-[#2a2a50] rounded-md">
        <span className={`w-1.5 h-1.5 rounded-full ${health > 90 ? 'bg-[var(--neon-green)] animate-pulse' : 'bg-[var(--neon-red)] shadow-[0_0_8px_red]'}`} />
        <span style={{ color: health > 90 ? 'var(--neon-green)' : 'var(--neon-red)' }}>
            {health > 90 ? 'HEALTH_OPTIMAL' : 'CRITICAL_DISCREPANCY'}
        </span>
    </div>
);

// --- MAIN COMPONENT ---

export const SovereignHUD = () => {
    const { metrics, isConnected } = useSovereignStore();
    const [activePage, setActivePage] = useState<Page>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: "Welcome back, Sovereign. Reality sync initialized. Systems operational.", timestamp: new Date() }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [terminalOutput, setTerminalOutput] = useState<string[]>([
        "QAntum Terminal v34.1 - Singular Command Interface",
        "Type 'help' for available commands",
        "System initialized successfully."
    ]);
    const [terminalInput, setTerminalInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    // Derived Integrity
    const integrity = Math.max(0, 100 - (metrics.entropy * 100));

    // Auto-scroll
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [terminalOutput]);

    // Handlers
    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;
        const newMsg: Message = { id: Date.now().toString(), role: 'user', content: inputMessage, timestamp: new Date() };
        setMessages(prev => [...prev, newMsg]);
        setInputMessage('');

        // Mock AI Response
        setTimeout(() => {
            let response = "I am processing your request through the Veritas Engine...";
            if (inputMessage.toLowerCase().includes('status')) response = "All systems operational. Health: 98.7%. No critical anomalies detected.";
            if (inputMessage.toLowerCase().includes('analyze')) response = "Initiating deep scan... 1420 files analyzed. Optimization potential: 12%.";

            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: response, timestamp: new Date() }]);
        }, 1000);
    };

    const handleTerminalCommand = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.trim();
            if (!cmd) return;
            setTerminalOutput(prev => [...prev, `quantum@empire:~$ ${cmd}`]);
            setTerminalInput('');

            // Process Command
            setTimeout(() => {
                let output = `Command not found: ${cmd}`;
                if (cmd === 'help') output = "Available commands: help, status, clear, audit, deploy";
                if (cmd === 'status') output = "System Status: ONLINE\nCores: 8/8 Active\nMemory: 12TB Available";
                if (cmd === 'clear') { setTerminalOutput([]); return; }
                if (cmd === 'audit') output = "Running security audit...\nScanning 1.2M vectors...\n[OK] No vulnerabilities found.";

                setTerminalOutput(prev => [...prev, output]);
            }, 300);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--quantum-void)] text-gray-200 font-[var(--font-body)] relative">
            {/* VORTEX SOURCE */}
            <div className="vortex-bg opacity-30" />

            {/* SIDEBAR */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-[#0a0a12]/95 backdrop-blur border-r border-[#2a2a50] transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 border-b border-[#2a2a50]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center text-xl shadow-[0_0_20px_rgba(0,245,255,0.3)] animate-pulse">
                            🧠
                        </div>
                        <div>
                            <div className="font-[var(--font-display)] font-bold text-white tracking-widest">QAntum</div>
                            <div className="text-[10px] text-[var(--neon-cyan)]">v34.1 Singular</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                    <div className="space-y-1">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest px-3 mb-2">Main Module</div>
                        <NavItem icon={Home} label="Dashboard" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
                        <NavItem icon={MessageSquare} label="Chat AI" active={activePage === 'chat'} onClick={() => setActivePage('chat')} />
                        <NavItem icon={Terminal} label="Terminal" active={activePage === 'terminal'} onClick={() => setActivePage('terminal')} />
                        <NavItem icon={GitBranch} label="Skill Tree" active={activePage === 'skilltree'} onClick={() => setActivePage('skilltree')} />
                    </div>

                    <div className="space-y-1">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest px-3 mb-2">Departments</div>
                        <NavItem icon={Cpu} label="Intelligence" active={activePage === 'intelligence'} onClick={() => setActivePage('intelligence')} color="--dept-intelligence" />
                        <NavItem icon={Zap} label="Omega" active={activePage === 'omega'} onClick={() => setActivePage('omega')} color="--dept-omega" />
                        <NavItem icon={Atom} label="Physics" active={activePage === 'physics'} onClick={() => setActivePage('physics')} color="--dept-physics" />
                        <NavItem icon={Shield} label="Fortress" active={activePage === 'fortress'} onClick={() => setActivePage('fortress')} color="--dept-fortress" />
                        <NavItem icon={Dna} label="Biology" active={activePage === 'biology'} onClick={() => setActivePage('biology')} color="--dept-biology" />
                        <NavItem icon={Globe} label="Reality" active={activePage === 'reality'} onClick={() => setActivePage('reality')} color="--dept-reality" />
                        <NavItem icon={LinkIcon} label="Chemistry" active={activePage === 'chemistry'} onClick={() => setActivePage('chemistry')} color="--dept-chemistry" />
                    </div>
                </div>

                <div className="p-4 border-t border-[#2a2a50]">
                    <StatusBadge health={integrity} />
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[var(--quantum-void)]">

                {/* HEADER */}
                <header className="h-[70px] bg-[#0a0a12]/80 backdrop-blur border-b border-[#2a2a50] flex items-center justify-between px-8 relative z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-400 hover:text-white">
                            {sidebarOpen ? <X /> : <Menu />}
                        </button>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search modules... (Ctrl+K)"
                                className="bg-[var(--quantum-void)] border border-[#2a2a50] rounded-md py-1.5 pl-10 pr-4 text-sm w-64 focus:border-[var(--neon-cyan)] outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a12] border border-[#2a2a50] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className="text-[10px] font-mono font-bold text-gray-300 tracking-tighter">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
                        </div>
                        <button className="text-gray-400 hover:text-white transition-colors"><Bell size={18} /></button>
                        <button className="text-gray-400 hover:text-white transition-colors"><Settings size={18} /></button>
                    </div>
                </header>

                {/* SCROLLABLE VIEWPORT */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">

                    {/* DASHBOARD */}
                    {activePage === 'dashboard' && (
                        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                            {/* WELCOME BANNER */}
                            <div className="p-8 rounded-2xl bg-gradient-to-br from-[var(--neon-cyan)]/10 to-[var(--neon-purple)]/10 border border-[#2a2a50] flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-[var(--font-display)] mb-2 text-white italic tracking-tighter">Welcome to QAntum Empire</h2>
                                    <p className="text-gray-400 mb-6 max-w-xl text-sm leading-relaxed">
                                        Your sovereign command center. Dashboard telemetry is verified by the Veritas Engine.
                                        {metrics.project.files > 0 ? ` Physical Integrity: OK.` : ` Syncing reality...`}
                                    </p>
                                    <div className="flex gap-4">
                                        <button onClick={() => setActivePage('chat')} className="px-5 py-2.5 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] text-black font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
                                            <MessageSquare size={18} /> Start Chat
                                        </button>
                                        <button onClick={() => setActivePage('terminal')} className="px-5 py-2.5 bg-[#1a1a3a] border border-[#2a2a50] text-white rounded-lg hover:border-[var(--neon-cyan)] transition-all flex items-center gap-2">
                                            <Terminal size={18} /> Open Terminal
                                        </button>
                                    </div>
                                </div>
                                <div className="hidden lg:block text-9xl select-none opacity-20 filter grayscale hue-rotate-15">🧠</div>
                            </div>

                            {/* STATS GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard label="Resonance (Mojo)" value={`${metrics.hardware?.resonance?.toFixed(4) || "0.8890"}`} color="var(--neon-gold)" />
                                <StatCard label="CPU Integrity" value={`${metrics.hardware?.cpu?.toFixed(1) || "0.0"}%`} color="var(--neon-cyan)" />
                                <StatCard label="RAM Substrate" value={`${metrics.hardware?.ram?.toFixed(2) || "0.0"} GB`} color="var(--neon-purple)" />
                                <StatCard label="Physical Files" value={metrics.project.files.toLocaleString()} color="var(--neon-green)" />
                            </div>

                            {/* DEPARTMENTS OVERVIEW */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="p-6 rounded-xl bg-[#0a0a12] border border-[#2a2a50]">
                                    <h3 className="text-lg font-[var(--font-display)] mb-6 flex items-center gap-2"> <Activity className="text-[var(--neon-cyan)]" /> System Health</h3>
                                    <div className="space-y-4">
                                        <HealthBar label="Intelligence" value={98} color="var(--dept-intelligence)" />
                                        <HealthBar label="Omega Core" value={99} color="var(--dept-omega)" />
                                        <HealthBar label="Physics Engine" value={97} color="var(--dept-physics)" />
                                        <HealthBar label="Fortress Security" value={100} color="var(--dept-fortress)" />
                                    </div>
                                </div>
                                <div className="p-6 rounded-xl bg-[#0a0a12] border border-[#2a2a50]">
                                    <h3 className="text-lg font-[var(--font-display)] mb-6 flex items-center gap-2"> <Zap className="text-[var(--neon-purple)]" /> Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <QuickAction icon={Play} label="Run Auto-Test" />
                                        <QuickAction icon={Shield} label="Security Scan" />
                                        <QuickAction icon={Download} label="Backup System" />
                                        <QuickAction icon={LinkIcon} label="Sync APIs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CHAT */}
                    {activePage === 'chat' && (
                        <div className="flex flex-col h-[calc(100vh-140px)] gap-4 animate-[fadeIn_0.5s_ease-out]">
                            <div className="flex-1 bg-[#0a0a12]/50 backdrop-blur border border-[#2a2a50] rounded-2xl flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-[#2a2a50] flex justify-between items-center bg-[#1a1a3a]/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex justify-center items-center">🧠</div>
                                        <div>
                                            <h3 className="font-bold">QAntum AI</h3>
                                            <div className="text-xs text-[var(--neon-green)] flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[var(--neon-green)] rounded-full"></span> Online</div>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-white/10 rounded-lg"><Trash size={16} /></button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'assistant' ? 'bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)]' : 'bg-[#2a2a50]'}`}>
                                                {msg.role === 'assistant' ? '🧠' : <User size={16} />}
                                            </div>
                                            <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-[#1a1a3a] border border-[#2a2a50]' : 'bg-[var(--neon-blue)] text-white'}`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>

                                <div className="p-4 border-t border-[#2a2a50] bg-[#0a0a12]">
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={inputMessage}
                                                onChange={(e) => setInputMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Ask QAntum anything..."
                                                className="w-full bg-[#020205] border border-[#2a2a50] rounded-xl py-3 pl-4 pr-20 focus:border-[var(--neon-cyan)] outline-none text-white transition-all"
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                                <button className="p-2 text-gray-400 hover:text-white"><Paperclip size={16} /></button>
                                                <button className="p-2 text-gray-400 hover:text-white"><Mic size={16} /></button>
                                            </div>
                                        </div>
                                        <button onClick={handleSendMessage} className="p-3 bg-[var(--neon-cyan)] text-black rounded-xl hover:bg-[var(--neon-cyan)]/80 transition-all">
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TERMINAL */}
                    {activePage === 'terminal' && (
                        <div className="h-[calc(100vh-140px)] animate-[fadeIn_0.5s_ease-out]">
                            <div className="h-full bg-[#05050a] border border-[#1a1a3a] rounded-xl flex flex-col shadow-inner font-mono text-sm">
                                <div className="bg-[#1a1a3a] p-2 flex items-center gap-2 rounded-t-xl border-b border-[#2a2a50]">
                                    <div className="flex gap-1.5 ml-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                                    </div>
                                    <div className="flex-1 text-center text-gray-400 text-xs">quantum@empire: ~</div>
                                </div>
                                <div className="flex-1 p-4 overflow-y-auto space-y-1 text-[var(--neon-green)]">
                                    {terminalOutput.map((line, i) => (
                                        <div key={i} className="break-all">{line}</div>
                                    ))}
                                    <div ref={terminalEndRef} />
                                </div>
                                <div className="p-4 border-t border-[#1a1a3a] flex gap-2 items-center">
                                    <span className="text-[var(--neon-cyan)]">quantum@empire:~$</span>
                                    <input
                                        type="text"
                                        value={terminalInput}
                                        onChange={(e) => setTerminalInput(e.target.value)}
                                        onKeyDown={handleTerminalCommand}
                                        className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PLACEHOLDER FOR OTHER PAGES - Keeping it robust */}
                    {['skilltree', 'intelligence', 'omega', 'physics', 'fortress', 'biology', 'guardians', 'reality', 'chemistry'].includes(activePage) && activePage !== 'dashboard' && activePage !== 'chat' && activePage !== 'terminal' && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
                            <div className="w-24 h-24 rounded-3xl bg-[#0a0a12] border border-[#2a2a50] flex items-center justify-center">
                                <Cpu size={48} className="text-[var(--neon-purple)] animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-[var(--font-display)] uppercase tracking-widest">{activePage} Module</h2>
                                <p className="text-gray-500 mt-2">Initialize sub-system protocol...</p>
                            </div>
                            <div className="w-64 h-1 bg-[#2a2a50] rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[var(--neon-cyan)]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

// --- SUBCOMPONENTS ---

const NavItem = ({ icon: Icon, label, active, onClick, color }: { icon: any, label: string, active: boolean, onClick: () => void, color?: string }) => (
    <div
        onClick={onClick}
        className={`
            flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all relative overflow-hidden group
            ${active ? 'bg-gradient-to-r from-[var(--neon-cyan)]/10 to-transparent text-[var(--neon-cyan)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
        `}
    >
        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]" />}
        <Icon size={18} style={{ color: active && color ? `var(${color})` : undefined }} />
        <span className="font-medium text-sm">{label}</span>
    </div>
);

const StatCard = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="bg-[#0a0a12] border border-[#2a2a50] p-6 rounded-xl hover:border-[var(--neon-cyan)] transition-all group relative overflow-hidden">
        <div className="relative z-10 text-center">
            <div className="text-3xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300" style={{ color }}>{value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--neon-cyan)_0%,transparent_70%)] opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
    </div>
);

const HealthBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">{label}</span>
            <span style={{ color }}>{value}%</span>
        </div>
        <div className="h-1.5 bg-[#121225] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: `var(${color})` }} />
        </div>
    </div>
);

const QuickAction = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <button className="flex flex-col items-center justify-center gap-2 p-4 bg-[#121225] border border-[#2a2a50] rounded-lg hover:bg-[#1a1a3a] hover:border-[var(--neon-cyan)] transition-all group">
        <Icon size={20} className="text-gray-400 group-hover:text-[var(--neon-cyan)] transition-colors" />
        <span className="text-xs text-gray-400 group-hover:text-white">{label}</span>
    </button>
);
