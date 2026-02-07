import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 1. Define the Schema (Contract)
const ComponentStatusSchema = z.object({
    stress: z.number(),
    action: z.string(),
});

const MetricsSchema = z.object({
  timestamp: z.string(),
  entropy: z.number(),
  orchestrator: z.string(),
  bio: ComponentStatusSchema,
  market: ComponentStatusSchema,
  energy: ComponentStatusSchema,
  project: z.object({
      files: z.number(),
      loc: z.number()
  }),
  hash: z.string().optional()
});

// 2. Infer the Type
export type Metrics = z.infer<typeof MetricsSchema>;

export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ["system-metrics"],
    // QueryFn is technically optional if we only rely on WS push,
    // but having a fetch fallback is good practice.
    // For now, we return null or a promise that never resolves to avoid refetching loop if no endpoint.
    // Or simpler: just let it be stale forever and wait for WS.
    queryFn: () => Promise.resolve(null as unknown as Metrics),
    staleTime: Infinity, // Rely on WebSocket updates
    enabled: false, // Don't fetch on mount, wait for WS
  });
};
