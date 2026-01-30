import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar, Legend, Cell } from 'recharts';
import { Activity, Shield, Brain, Zap, Terminal, Eye, Network } from 'lucide-react';

// Mock Data
const swarmData = [
  { region: 'US-East', agents: 350, latency: 12 },
  { region: 'EU-West', agents: 280, latency: 45 },
  { region: 'Asia-Pac', agents: 410, latency: 85 },
];

const neuralMapData = Array.from({ length: 50 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  confidence: Math.random() * 0.2 + 0.8,
  type: i % 3 === 0 ? 'Button' : i % 3 === 1 ? 'Input' : 'Container',
}));

const auditLog = [
  { id: 1, time: '10:42:01', agent: 'Agent-007', action: 'Visual Scan', detail: 'Identified "Checkout" (99.8%)' },
  { id: 2, time: '10:42:02', agent: 'Agent-007', action: 'Semantic Heal', detail: 'Healed #submit-btn -> .pay-now' },
  { id: 3, time: '10:42:03', agent: 'Agent-007', action: 'Assertion', detail: 'Price Verified: $420.00' },
  { id: 4, time: '10:42:05', agent: 'Swarm-Leader', action: 'Scale Up', detail: 'Deployed +50 micro-agents' },
];

export const VeritasDashboard = () => {
  const [activeAgents, setActiveAgents] = useState(1040);
  const [coverage, setCoverage] = useState(98.5);

  // Simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgents(prev => prev + Math.floor(Math.random() * 5) - 2);
      setCoverage(prev => Math.min(100, prev + 0.01));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <header className="mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-400 flex items-center gap-2">
            <Brain className="w-8 h-8" />
            VERITAS COGNITIVE QA <span className="text-slate-500 text-lg font-normal">v1.0</span>
          </h1>
          <p className="text-slate-400 mt-1">Singularity Audit Log & Neural Control Plane</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-mono text-green-400">SYSTEM: ONLINE</span>
          </div>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex justify-between">
              Active Swarm Agents
              <Network className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeAgents}</div>
            <p className="text-xs text-slate-500">Distributed across 3 Regions</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex justify-between">
              Neural Map Coverage
              <Eye className="w-4 h-4 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{coverage.toFixed(1)}%</div>
            <p className="text-xs text-slate-500">Self-Healing Active</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex justify-between">
              Visual Inferences / Sec
              <Zap className="w-4 h-4 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4,291</div>
            <p className="text-xs text-slate-500">ViT Layer Latency: 12ms</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex justify-between">
              Auto-Remediation
              <Shield className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-slate-500">Elements Healed in last 1h</p>
          </CardContent>
        </Card>
      </div>

      {/* MAIN VISUALIZATION AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* SINGULARITY AUDIT LOG */}
        <Card className="col-span-1 bg-slate-900 border-slate-800 h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Terminal className="w-5 h-5 text-blue-400" />
              Singularity Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-4">
              {auditLog.map((log) => (
                <div key={log.id} className="border-l-2 border-slate-700 pl-4 py-1 hover:bg-slate-800/50 transition-colors">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span className="font-mono">{log.time}</span>
                    <span className="text-blue-400">{log.agent}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-200">{log.action}</div>
                  <div className="text-xs text-slate-400">{log.detail}</div>
                </div>
              ))}
              <div className="border-l-2 border-green-500 pl-4 py-1 animate-pulse">
                <div className="text-xs text-green-500 font-mono">LIVE FEED...</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEURAL MAP VISUALIZATION */}
        <Card className="col-span-1 lg:col-span-2 bg-slate-900 border-slate-800 h-[500px]">
          <CardHeader>
             <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-purple-400" />
              Neural Map Visualization (Real-time Intent Embedding)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" dataKey="x" name="UI Position X" unit="%" stroke="#475569" />
                <YAxis type="number" dataKey="y" name="UI Position Y" unit="%" stroke="#475569" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                <Scatter name="UI Elements" data={neuralMapData} fill="#8884d8">
                    {neuralMapData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.type === 'Button' ? '#60a5fa' : entry.type === 'Input' ? '#34d399' : '#a78bfa'} />
                    ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SWARM DISTRIBUTION */}
        <Card className="col-span-1 lg:col-span-3 bg-slate-900 border-slate-800">
           <CardHeader>
             <CardTitle className="flex items-center gap-2 text-white">
              <Network className="w-5 h-5 text-indigo-400" />
              Global Swarm Distribution & Latency
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={swarmData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="region" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="agents" name="Active Agents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="latency" name="Avg Latency (ms)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
