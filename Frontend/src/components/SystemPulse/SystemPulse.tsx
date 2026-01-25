/**
 * System Pulse Component
 * Real-time telemetry display with glassmorphism design
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../../services/apiService';
import type { SystemMetrics } from '../../services/apiService';
import { Activity, Cpu, HardDrive, Thermometer, Zap } from 'lucide-react';

export const SystemPulse = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await apiService.getTelemetry();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMetrics();

    // Poll every 5 seconds
    const interval = setInterval(fetchMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Activity className="w-8 h-8 text-cyan-400" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-6">
        <div className="text-red-400 text-sm">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-panel p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          System Pulse
        </h2>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Activity className="w-6 h-6 text-green-400" />
        </motion.div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CPU Load */}
        <motion.div variants={itemVariants} className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-gray-300">CPU Load</span>
            </div>
            <span className="text-2xl font-bold text-cyan-400">
              {metrics.cpu_load.toFixed(1)}%
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${metrics.cpu_load}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* RAM Usage */}
        <motion.div variants={itemVariants} className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">RAM Usage</span>
            </div>
            <span className="text-2xl font-bold text-purple-400">
              {metrics.ram_usage_percent.toFixed(1)}%
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${metrics.ram_usage_percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {metrics.ram_used_gb.toFixed(2)} GB / {metrics.ram_total_gb.toFixed(2)} GB
          </div>
        </motion.div>

        {/* Temperature */}
        <motion.div variants={itemVariants} className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-gray-300">Temperature</span>
            </div>
            <span className="text-2xl font-bold text-orange-400">
              {metrics.temperature_celsius > 0 
                ? `${metrics.temperature_celsius.toFixed(1)}°C`
                : 'N/A'
              }
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill bg-gradient-to-r from-yellow-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((metrics.temperature_celsius / 100) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Active Transactions */}
        <motion.div variants={itemVariants} className="metric-card md:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-300">Active Transactions</span>
            </div>
            <motion.span
              key={metrics.active_transactions}
              initial={{ scale: 1.5, color: '#fbbf24' }}
              animate={{ scale: 1, color: '#facc15' }}
              className="text-3xl font-bold"
            >
              {metrics.active_transactions}
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SystemPulse;
