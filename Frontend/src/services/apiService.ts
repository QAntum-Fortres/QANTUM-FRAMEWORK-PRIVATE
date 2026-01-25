/**
 * API Service for QANTUM Framework
 * Provides communication with Backend (Python) and Rust Economy Module
 */

// API Configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050';
const RUST_ECONOMY_URL = import.meta.env.VITE_RUST_ECONOMY_URL || 'http://localhost:8890';

// Types
export interface UserBalance {
  user_id: string;
  credits: number;
  unlocked_modules: string[];
}

export interface SystemMetrics {
  cpu_load: number;
  ram_usage_percent: number;
  ram_used_gb: number;
  ram_total_gb: number;
  temperature_celsius: number;
  active_transactions: number;
}

export interface CheckoutSessionResponse {
  success: boolean;
  url?: string;
  id?: string;
  error?: string;
  message?: string;
}

export interface PricingTier {
  name: string;
  tier: 'singularity' | 'aeterna' | 'vortex';
  price: number;
  credits: number;
  features: string[];
}

// Pricing Tiers Configuration
export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Singularity',
    tier: 'singularity',
    price: 29,
    credits: 100,
    features: [
      'Basic Analytics',
      '100 Credits/month',
      'Community Support',
      'Real-time Telemetry'
    ]
  },
  {
    name: 'Aeterna',
    tier: 'aeterna',
    price: 99,
    credits: 500,
    features: [
      'All Singularity features',
      'Advanced Arbitrage Engine',
      'AI-Powered Insights',
      '500 Credits/month',
      'Priority Support'
    ]
  },
  {
    name: 'Vortex',
    tier: 'vortex',
    price: 299,
    credits: 2000,
    features: [
      'All Aeterna features',
      'Enterprise Support',
      'Custom Integrations',
      '2000 Credits/month',
      'Dedicated Account Manager',
      'White-label Options'
    ]
  }
];

// API Client Class
class ApiService {
  private baseUrl: string;
  private economyUrl: string;

  constructor() {
    this.baseUrl = BACKEND_URL;
    this.economyUrl = RUST_ECONOMY_URL;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    retries = 3
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
    throw new Error('Max retries reached');
  }

  // ========== RUST ECONOMY MODULE APIs ==========

  /**
   * Get user balance from Rust Economy module
   */
  async getBalance(userId: string): Promise<UserBalance> {
    const url = `${this.economyUrl}/api/balance?user_id=${encodeURIComponent(userId)}`;
    return this.fetchWithRetry<UserBalance>(url);
  }

  /**
   * Get all user balances
   */
  async getAllBalances(): Promise<UserBalance[]> {
    const url = `${this.economyUrl}/api/balances`;
    return this.fetchWithRetry<UserBalance[]>(url);
  }

  /**
   * Get real-time system telemetry (CPU, RAM, temperature, transactions)
   */
  async getTelemetry(): Promise<SystemMetrics> {
    const url = `${this.economyUrl}/api/telemetry`;
    return this.fetchWithRetry<SystemMetrics>(url);
  }

  /**
   * Check Rust Economy server health
   */
  async checkEconomyHealth(): Promise<{ status: string; service: string }> {
    const url = `${this.economyUrl}/health`;
    return this.fetchWithRetry(url);
  }

  // ========== PYTHON BACKEND APIs ==========

  /**
   * Create a Stripe Checkout session
   */
  async createCheckoutSession(
    tier: 'singularity' | 'aeterna' | 'vortex',
    userEmail: string,
    successUrl?: string,
    cancelUrl?: string
  ): Promise<CheckoutSessionResponse> {
    const url = `${this.baseUrl}/api/checkout`;
    return this.fetchWithRetry<CheckoutSessionResponse>(url, {
      method: 'POST',
      body: JSON.stringify({
        tier,
        userEmail,
        successUrl: successUrl || `${window.location.origin}/success`,
        cancelUrl: cancelUrl || `${window.location.origin}/cancel`,
      }),
    });
  }

  /**
   * Generate a Sovereign Truth Certificate
   */
  async generateCertificate(): Promise<any> {
    const url = `${this.baseUrl}/generate-certificate`;
    return this.fetchWithRetry(url, {
      method: 'POST',
    });
  }

  /**
   * Process a payment intent
   */
  async processPayment(amount: number, currency: string = 'usd'): Promise<any> {
    const url = `${this.baseUrl}/api/pay`;
    return this.fetchWithRetry(url, {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  }
}

// Singleton instance
export const apiService = new ApiService();

// Export for direct use
export default apiService;
