import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Lock, ArrowRight, Shield } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
    }

    try {
      await apiService.register(email, password);
      // Auto login after register? Or redirect to login.
      // For simplicity, redirect to login with success message implies.
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex items-center justify-center p-4 relative overflow-hidden font-['Outfit']">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0a0a12]/80 backdrop-blur-xl border border-[#2a2a50] p-8 rounded-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl">
                <Shield className="text-purple-400" size={32} />
            </div>
        </div>

        <h2 className="text-3xl font-black text-center mb-2 tracking-tight">AGENT ONBOARDING</h2>
        <p className="text-center text-gray-500 mb-8 text-sm uppercase tracking-widest">Join the Sovereign Network</p>

        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-xs font-mono">
                [ERROR]: {error}
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Email / Identity</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#05050a] border border-[#2a2a50] rounded-lg p-3 text-white focus:border-purple-500 outline-none transition-colors"
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
                className="w-full bg-[#05050a] border border-[#2a2a50] rounded-lg p-3 pl-10 text-white focus:border-purple-500 outline-none transition-colors"
                placeholder="••••••••"
                required
                />
            </div>
          </div>

          <div>
             <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Confirm Passkey</label>
            <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-600" size={16} />
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#05050a] border border-[#2a2a50] rounded-lg p-3 pl-10 text-white focus:border-purple-500 outline-none transition-colors"
                placeholder="••••••••"
                required
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'INITIALIZING...' : (
                <>
                    CREATE AGENT PROFILE <UserPlus size={16} />
                </>
            )}
          </button>
        </form>

         <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">Already Registered?</p>
            <button
                onClick={() => navigate('/')}
                className="text-purple-400 text-xs font-bold uppercase tracking-widest hover:underline mt-1 flex items-center justify-center gap-1 mx-auto"
            >
                Return to Login
            </button>
        </div>
      </motion.div>
    </div>
  );
};
