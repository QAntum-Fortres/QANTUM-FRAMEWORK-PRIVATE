import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSystemMetrics } from "./features/dashboard/hooks/useMetrics";

const queryClient = new QueryClient();

function Dashboard() {
  const { data, isLoading, error } = useSystemMetrics();

  if (isLoading) return <div className="p-10 text-white">Loading System Metrics...</div>;
  if (error) return <div className="p-10 text-red-500">Error loading metrics</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 font-mono">
      <h1 className="text-3xl font-bold mb-8 text-purple-400">HELIOS UI // DASHBOARD</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-2">Active Nodes</h3>
          <div className="text-4xl font-bold text-cyan-400">{data?.activeNodes}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-2">Entropy Level</h3>
          <div className="text-4xl font-bold text-pink-400">{data?.entropyLevel}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-2">System Status</h3>
          <div className={`text-4xl font-bold ${data?.systemStatus === 'OPERATIONAL' ? 'text-green-400' : 'text-yellow-400'}`}>
            {data?.systemStatus}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
