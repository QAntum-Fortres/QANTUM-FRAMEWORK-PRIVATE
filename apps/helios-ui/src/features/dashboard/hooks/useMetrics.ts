// src/features/dashboard/hooks/useMetrics.ts
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "@/api/client";

// 1. Define the Schema (Contract)
const MetricsSchema = z.object({
  activeNodes: z.number(),
  entropyLevel: z.number().min(0).max(1),
  systemStatus: z.enum(["OPERATIONAL", "DEGRADED", "CRITICAL"]),
});

// 2. Infer the Type
type Metrics = z.infer<typeof MetricsSchema>;

export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ["system-metrics"],
    queryFn: async (): Promise<Metrics> => {
      // In a real app, this would be a real GET request.
      // We force the mock return here for demonstration if the API isn't running.
      try {
        const { data } = await api.get("/status");
        return MetricsSchema.parse(data);
      } catch (e) {
        // Fallback for demo since we don't have a real backend running on /api
        console.warn("API failed, using mock data");
        const mockData = {
          activeNodes: 1024,
          entropyLevel: 0.12,
          systemStatus: "OPERATIONAL"
        };
        return MetricsSchema.parse(mockData);
      }
    },
    refetchInterval: 5000, // Real-time telemetry emulation
  });
};
