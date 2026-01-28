import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "@/api/client";

// 1. Define the Schema (Contract)
// This matches the "payload" structure from Backend/app/routers/system.py
// {
//     "timestamp": "...",
//     "entropy": 99.0,
//     "orchestrator": "...",
//     "bio": {"stress": 0.0, "action": "IDLE"},
//     ...
// }

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
    queryFn: async (): Promise<Metrics> => {
        // Assuming we fetch from the system websocket or a REST endpoint
        // For REST, we might need to expose an endpoint.
        // Currently system.py only has WebSocket /ws.
        // Let's assume we might have a snapshot endpoint or we use this for the initial fetch.
        // Or we just mock it for now if we strictly follow the requested pattern.

        // Let's assume we added a GET /system/status endpoint or similar.
        // If not, we will likely get 404.
        // But the task is about the *Pattern*.
        const { data } = await api.get("/system/status");

        // 3. Runtime Validation (The Firewall)
        return MetricsSchema.parse(data);
    },
    // refetchInterval: 1000,
    enabled: false // Disabled by default as we don't have the endpoint yet
  });
};
