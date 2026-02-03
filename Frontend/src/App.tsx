import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { SaaSDemo } from '@/pages/SaaSDemo';

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="fixed top-0 right-0 p-2 z-50 opacity-50 hover:opacity-100 transition-opacity">
           <nav className="flex gap-2">
             <Link to="/" className="text-xs bg-black text-white px-2 py-1 rounded">Dashboard</Link>
             <Link to="/saas-demo" className="text-xs bg-blue-600 text-white px-2 py-1 rounded">SaaS Demo</Link>
           </nav>
        </div>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/saas-demo" element={<SaaSDemo />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
