import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useSystemMetrics } from '@/features/dashboard/hooks/useMetrics'
import { useUIStore } from '@/stores/ui'
import { cn } from '@/lib/utils'

const queryClient = new QueryClient()

function Dashboard() {
  const { data, isLoading, error } = useSystemMetrics()
  const { theme, toggleSidebar } = useUIStore()

  if (isLoading) return <div className="text-foreground">Loading Telemetry...</div>
  if (error) return <div className="text-red-500">System Critical: {error.message}</div>

  return (
    <div className={cn("p-6 rounded-lg border", theme === 'dark' ? "bg-slate-900 text-white" : "bg-white text-black")}>
      <h1 className="text-2xl font-bold mb-4">Vortex Helios Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded shadow border border-border">
          <h3 className="text-sm font-medium text-muted-foreground">Active Nodes</h3>
          <p className="text-2xl font-bold">{data?.activeNodes}</p>
        </div>
        <div className="p-4 bg-card rounded shadow border border-border">
          <h3 className="text-sm font-medium text-muted-foreground">Entropy Level</h3>
          <p className={cn("text-2xl font-bold", data!.entropyLevel > 0.5 ? "text-red-500" : "text-green-500")}>
            {data?.entropyLevel}
          </p>
        </div>
        <div className="p-4 bg-card rounded shadow border border-border">
          <h3 className="text-sm font-medium text-muted-foreground">System Status</h3>
          <p className="text-2xl font-bold">{data?.systemStatus}</p>
        </div>
      </div>
      <button
        onClick={toggleSidebar}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
      >
        Toggle Sidebar (Zustand Test)
      </button>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background p-8 flex items-center justify-center dark">
        <Dashboard />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
