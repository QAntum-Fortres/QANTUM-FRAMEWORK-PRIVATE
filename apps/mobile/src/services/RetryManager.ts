/**
 * 🔄 Advanced Retry Logic with Exponential Backoff
 * Sophisticated retry mechanism for recording operations
 */

export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  shouldRetry?: (error: Error) => boolean;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

export class RetryManager {
  private static instance: RetryManager;

  private constructor() {}

  static getInstance(): RetryManager {
    if (!RetryManager.instance) {
      RetryManager.instance = new RetryManager();
    }
    return RetryManager.instance;
  }

  /**
   * Execute operation with exponential backoff retry
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig = DEFAULT_RETRY_CONFIG
  ): Promise<T> {
    let lastError: Error | null = null;
    let delay = config.initialDelay;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        console.log(`[RetryManager] Attempt ${attempt}/${config.maxAttempts}`);
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Check if we should retry this error
        if (config.shouldRetry && !config.shouldRetry(lastError)) {
          console.log('[RetryManager] Error not retryable, failing immediately');
          throw lastError;
        }

        // Don't wait after last attempt
        if (attempt === config.maxAttempts) {
          break;
        }

        console.log(
          `[RetryManager] Attempt ${attempt} failed: ${lastError.message}`
        );
        console.log(`[RetryManager] Retrying in ${delay}ms...`);

        // Wait with exponential backoff
        await this.delay(delay);

        // Calculate next delay with cap at maxDelay
        delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
      }
    }

    console.error(
      `[RetryManager] All ${config.maxAttempts} attempts failed`
    );
    throw lastError || new Error('Operation failed after all retries');
  }

  /**
   * Execute with retry and jitter to prevent thundering herd
   */
  async executeWithRetryAndJitter<T>(
    operation: () => Promise<T>,
    config: RetryConfig = DEFAULT_RETRY_CONFIG
  ): Promise<T> {
    const configWithJitter = {
      ...config,
      initialDelay: config.initialDelay + Math.random() * 500,
    };

    return this.executeWithRetry(operation, configWithJitter);
  }

  /**
   * Circuit breaker pattern implementation
   */
  private circuitBreakerState: Map<string, CircuitBreakerState> = new Map();

  async executeWithCircuitBreaker<T>(
    operationKey: string,
    operation: () => Promise<T>,
    options: CircuitBreakerOptions = {}
  ): Promise<T> {
    const {
      failureThreshold = 5,
      resetTimeout = 60000,
      halfOpenAttempts = 1,
    } = options;

    let state = this.circuitBreakerState.get(operationKey);

    if (!state) {
      state = {
        status: 'closed',
        failures: 0,
        lastFailureTime: 0,
        halfOpenAttempts: 0,
      };
      this.circuitBreakerState.set(operationKey, state);
    }

    // Check circuit state
    if (state.status === 'open') {
      const now = Date.now();
      if (now - state.lastFailureTime > resetTimeout) {
        console.log(`[CircuitBreaker] ${operationKey}: Transitioning to half-open`);
        state.status = 'half-open';
        state.halfOpenAttempts = 0;
      } else {
        throw new Error(
          `Circuit breaker OPEN for ${operationKey}. Try again later.`
        );
      }
    }

    try {
      const result = await operation();

      // Success - reset or close circuit
      if (state.status === 'half-open') {
        state.halfOpenAttempts++;
        if (state.halfOpenAttempts >= halfOpenAttempts) {
          console.log(`[CircuitBreaker] ${operationKey}: Closing circuit`);
          state.status = 'closed';
          state.failures = 0;
          state.halfOpenAttempts = 0;
        }
      } else {
        state.failures = 0;
      }

      return result;
    } catch (error) {
      state.failures++;
      state.lastFailureTime = Date.now();

      if (state.status === 'half-open') {
        console.log(`[CircuitBreaker] ${operationKey}: Reopening circuit`);
        state.status = 'open';
      } else if (state.failures >= failureThreshold) {
        console.log(
          `[CircuitBreaker] ${operationKey}: Opening circuit after ${state.failures} failures`
        );
        state.status = 'open';
      }

      throw error;
    }
  }

  /**
   * Utility: Wait with promise
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get circuit breaker statistics
   */
  getCircuitBreakerStats(operationKey: string): CircuitBreakerState | null {
    return this.circuitBreakerState.get(operationKey) || null;
  }

  /**
   * Reset circuit breaker for operation
   */
  resetCircuitBreaker(operationKey: string): void {
    this.circuitBreakerState.delete(operationKey);
    console.log(`[CircuitBreaker] Reset circuit for ${operationKey}`);
  }
}

interface CircuitBreakerState {
  status: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailureTime: number;
  halfOpenAttempts: number;
}

interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  halfOpenAttempts?: number;
}

export const retryManager = RetryManager.getInstance();
