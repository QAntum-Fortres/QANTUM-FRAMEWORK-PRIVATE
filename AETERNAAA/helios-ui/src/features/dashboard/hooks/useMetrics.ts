import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "../../../api/client";

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
      const { data } = await api.get("/status");

      // 3. Runtime Validation (The Firewall)
      // If the backend returns invalid format, it fails here, not in UI.
      return MetricsSchema.parse(data);
    },
    refetchInterval: 5000, // Real-time telemetry emulation
  });
};
