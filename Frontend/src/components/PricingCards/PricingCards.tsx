/**
 * Pricing Cards Component
 * Three subscription tiers with Stripe Checkout integration
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { apiService, PRICING_TIERS } from '../../services/apiService';
import type { PricingTier } from '../../services/apiService';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';

const tierIcons = {
  singularity: Sparkles,
  aeterna: Crown,
  vortex: Zap
};

const tierGradients = {
  singularity: 'from-cyan-500 to-blue-500',
  aeterna: 'from-purple-500 to-pink-500',
  vortex: 'from-yellow-500 to-orange-500'
};

export const PricingCards = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier['tier'] | null>(null);

  const handleUpgrade = async (tier: PricingTier['tier']) => {
    if (!email) {
      setSelectedTier(tier);
      setShowEmailInput(true);
      return;
    }

    setLoading(tier);

    try {
      const response = await apiService.createCheckoutSession(
        tier,
        email
      );

      if (response.success && response.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.url;
      } else {
        alert(response.message || 'Failed to create checkout session');
        setLoading(null);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout');
      setLoading(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  // Email Input Modal
  if (showEmailInput && selectedTier) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        onClick={() => setShowEmailInput(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Enter Your Email
          </h3>
          <p className="text-gray-300 mb-6">
            We'll use this email for your subscription and account.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 mb-4"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowEmailInput(false)}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowEmailInput(false);
                handleUpgrade(selectedTier);
              }}
              disabled={!email}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-12"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
          Choose Your Path to Sovereignty
        </h2>
        <p className="text-gray-400 text-lg">
          Unlock the power of QANTUM Framework with premium features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {PRICING_TIERS.map((tier, index) => {
          const Icon = tierIcons[tier.tier];
          const isPopular = index === 1; // Aeterna is popular

          return (
            <motion.div
              key={tier.tier}
              variants={cardVariants}
              className={`pricing-card ${isPopular ? 'popular' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${tierGradients[tier.tier]} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Tier Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${tierGradients[tier.tier]}">
                    ${tier.price}
                  </span>
                  <span className="text-gray-400">/month</span>
                </div>

                {/* Credits Badge */}
                <div className="inline-block mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                  <span className="text-cyan-400 font-semibold">{tier.credits} Credits</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-gray-300"
                    >
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Upgrade Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpgrade(tier.tier)}
                  disabled={loading === tier.tier}
                  className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
                    loading === tier.tier
                      ? 'bg-gray-600 cursor-not-allowed'
                      : `bg-gradient-to-r ${tierGradients[tier.tier]} hover:shadow-lg hover:shadow-${tier.tier === 'singularity' ? 'cyan' : tier.tier === 'aeterna' ? 'purple' : 'yellow'}-500/50`
                  }`}
                >
                  {loading === tier.tier ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </span>
                  ) : (
                    'Upgrade Now'
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PricingCards;
