import { useEffect, useState } from 'react';

export const VeritasStatus = () => {
    const [lastAttack, setLastAttack] = useState<string | null>(null);
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        const handleLockdown = (e: any) => {
            setLastAttack(e.detail.reason);
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 1000); // Short visual effect
        };

        window.addEventListener('VERITAS_LOCKDOWN', handleLockdown);
        return () => window.removeEventListener('VERITAS_LOCKDOWN', handleLockdown);
    }, []);

    return (
        <div className={`flex items-center gap-4 px-4 py-2 rounded-md border transition-all duration-200 ${isGlitching ? 'glitch-red border-[#ff003c] text-[#ff003c]' : 'border-sovereign-success/30 bg-sovereign-success/5 text-sovereign-success'}`}>
            <div className="text-xl">{isGlitching ? '⚠️' : '🛡️'}</div>
            <div className="flex flex-col">
                <span className="text-[10px] tracking-widest font-bold">COGNITIVE FIREWALL</span>
                <span className="text-xs font-mono">{isGlitching ? 'BLOCKING HALLUCINATION' : 'ACTIVE'}</span>
            </div>
            {isGlitching && <div className="ml-4 text-[10px] font-mono text-[#ff003c] animate-pulse">DETECTED: {lastAttack}</div>}
        </div>
    );
};
