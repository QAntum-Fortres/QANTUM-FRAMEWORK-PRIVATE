import { useState, useCallback } from 'react';

const NERVE_API = 'http://localhost:3001/api';

export const useNerveCenter = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryMetaLogic = useCallback(async (question: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${NERVE_API}/metalogic/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });
            return await res.json();
        } catch (e: any) {
            setError(e.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const transcendProblem = useCallback(async (problem: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${NERVE_API}/transcendence/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ problem })
            });
            return await res.json();
        } catch (e: any) {
            setError(e.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const manifestReality = useCallback(async (params: any) => {
        setLoading(true);
        try {
            const res = await fetch(`${NERVE_API}/genesis/manifestReality`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });
            return await res.json();
        } catch (e: any) {
            setError(e.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        queryMetaLogic,
        transcendProblem,
        manifestReality
    };
};
