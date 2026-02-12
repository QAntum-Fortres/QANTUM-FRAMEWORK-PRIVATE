import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Lock, ArrowRight, UserPlus } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(email, password);
      localStorage.setItem('access_token', response.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex items-center justify-center p-4 relative overflow-hidden font-['Outfit']">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0a0a12]/80 backdrop-blur-xl border border-[#2a2a50] p-8 rounded-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
                <Eye className="text-cyan-400" size={32} />
            </div>
        </div>

        <h2 className="text-3xl font-black text-center mb-2 tracking-tight">HELIOS IDENTITY</h2>
        <p className="text-center text-gray-500 mb-8 text-sm uppercase tracking-widest">Secure Access Point</p>

        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-xs font-mono">
                [ERROR]: {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Email / Identity</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#05050a] border border-[#2a2a50] rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors"
              placeholder="agent@sovereign.ai"
              required
            />
          </div>

          <div>
             <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Passkey</label>
            <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-600" size={16} />
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#05050a] border border-[#2a2a50] rounded-lg p-3 pl-10 text-white focus:border-cyan-500 outline-none transition-colors"
                placeholder="••••••••"
                required
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'AUTHENTICATING...' : (
                <>
                    ACCESS DASHBOARD <ArrowRight size={16} />
                </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">New Agent?</p>
            <button
                onClick={() => navigate('/register')}
                className="text-cyan-400 text-xs font-bold uppercase tracking-widest hover:underline mt-1 flex items-center justify-center gap-1 mx-auto"
            >
                <UserPlus size={12} /> Initialize Profile
            </button>
        </div>
      </motion.div>
    </div>
  );
};
