import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { VeritasDashboard } from '@/pages/VeritasDashboard';

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  }));

  const [view, setView] = useState<'vortex' | 'veritas'>('veritas');

  return (
    <QueryClientProvider client={queryClient}>
        <div className="relative min-h-screen bg-background">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 h-14 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 z-50">
                <div className="text-sm font-mono text-slate-500 tracking-wider">
                    SOVEREIGN ENGINE <span className="text-slate-700">|</span> v2.0
                </div>
                <div className="flex gap-2">
                     <button
                        onClick={() => setView('vortex')}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${view === 'vortex' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                     >
                        VORTEX UI
                     </button>
                     <button
                        onClick={() => setView('veritas')}
                         className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${view === 'veritas' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                     >
                        VERITAS QA
                     </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="pt-14">
                 {view === 'vortex' ? <DashboardPage /> : <VeritasDashboard />}
            </div>
        </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
