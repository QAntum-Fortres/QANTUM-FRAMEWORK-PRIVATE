
export const useSystemMetrics = () => {
    return {
        data: {
            bio: { stress: 0.2, action: "OPTIMAL" },
            market: { stress: 0.5, action: "HOLD" },
            energy: { stress: 0.1, action: "EFFICIENT" },
            entropy: 0,
            timestamp: new Date().toISOString(),
            orchestrator: "SYSTEM_ONLINE",
            hash: "SHA512-VALID"
        }
    };
};
