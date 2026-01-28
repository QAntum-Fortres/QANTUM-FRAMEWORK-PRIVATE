import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '@/lib/axios';

// 1. Define the Schema (Runtime Validation)
export const DashboardStatsSchema = z.object({
  totalUsers: z.number(),
  activeSessions: z.number(),
  revenue: z.number().transform((val) => `$${val.toFixed(2)}`), // Transform example
  systemHealth: z.enum(['healthy', 'degraded', 'down']),
  lastUpdated: z.string().datetime(),
});

// 2. Derive the Type (Static Type)
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

// 3. Define the Fetch Function
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/dashboard/stats');
  // Runtime validation: If API changes contract, this throws immediately
  return DashboardStatsSchema.parse(data);
};

// 4. Custom Hook
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  });
};
