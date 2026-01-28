import React from 'react';
import { useDashboardStats } from '../api/useDashboard';
import { Button } from '@/components/ui/button';

export const Dashboard: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="animate-spin text-primary">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <h3 className="font-semibold">Error loading dashboard</h3>
        <p className="text-sm">{(error as Error).message}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="mt-2 border-destructive/50 hover:bg-destructive/20"
        >
          Retry
        </Button>
      </div>
    );
  }

  // data is typed as DashboardStats here
  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value={data?.totalUsers} />
        <StatsCard title="Active Sessions" value={data?.activeSessions} />
        <StatsCard title="Revenue" value={data?.revenue} />
        <StatsCard
          title="System Health"
          value={data?.systemHealth}
          className={
            data?.systemHealth === 'healthy' ? 'text-green-600' :
            data?.systemHealth === 'degraded' ? 'text-yellow-600' : 'text-red-600'
          }
        />
      </div>

      <div className="text-xs text-muted-foreground">
        Last updated: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : '-'}
      </div>
    </div>
  );
};

// Simple internal component for the example
const StatsCard = ({ title, value, className }: { title: string; value?: string | number; className?: string }) => (
  <div className="rounded-xl border bg-card text-card-foreground shadow">
    <div className="flex flex-col space-y-1.5 p-6">
      <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
      <div className={`text-2xl font-bold ${className}`}>{value}</div>
    </div>
  </div>
);
