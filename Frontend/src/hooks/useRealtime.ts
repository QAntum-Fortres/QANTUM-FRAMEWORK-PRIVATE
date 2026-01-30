import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Metrics } from '@/features/dashboard/hooks/useMetrics';

export const useRealtime = () => {
    const queryClient = useQueryClient();
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connect = () => {
            // Determine WS URL (assuming local for now or env)
            const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws";

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('🔌 Neural Link Established');
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    // Optimistically update the query cache
                    // "Server State" pushed to client
                    queryClient.setQueryData<Metrics>(['system-metrics'], data);
                } catch (e) {
                    console.error('Failed to parse nerve signal:', e);
                }
            };

            ws.onclose = () => {
                console.log('🔌 Neural Link Severed. Retrying...');
                setTimeout(connect, 3000);
            };
        };

        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [queryClient]);
};
