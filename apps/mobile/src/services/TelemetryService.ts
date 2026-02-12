/**
 * 📊 Advanced Telemetry & Analytics Service
 * Sophisticated tracking and monitoring for recording operations
 */

export interface TelemetryEvent {
  type: string;
  timestamp: Date;
  duration?: number;
  metadata?: Record<string, unknown>;
  success: boolean;
  error?: string;
}

export interface PerformanceMetrics {
  operationType: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  memoryUsage?: NodeJS.MemoryUsage;
  customMetrics?: Record<string, number>;
}

export class TelemetryService {
  private static instance: TelemetryService;
  private events: TelemetryEvent[] = [];
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private readonly MAX_EVENTS = 1000;

  private constructor() {
    this.startPeriodicCleanup();
  }

  static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  /**
   * Track an event
   */
  trackEvent(
    type: string,
    success: boolean,
    metadata?: Record<string, unknown>,
    duration?: number
  ): void {
    const event: TelemetryEvent = {
      type,
      timestamp: new Date(),
      success,
      metadata,
      duration,
    };

    this.events.push(event);

    // Trim old events if we exceed max
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    console.log(
      `[Telemetry] ${type}: ${success ? 'SUCCESS' : 'FAILURE'}${
        duration ? ` (${duration}ms)` : ''
      }`
    );
  }

  /**
   * Track recording start
   */
  trackRecordingStart(quality: string, deviceId: string): void {
    this.trackEvent('recording_start', true, { quality, deviceId });
  }

  /**
   * Track recording stop
   */
  trackRecordingStop(duration: number, fileSize: number): void {
    this.trackEvent('recording_stop', true, { duration, fileSize }, duration);
  }

  /**
   * Track encryption operation
   */
  trackEncryption(duration: number, dataSize: number): void {
    this.trackEvent('encryption', true, { dataSize }, duration);
  }

  /**
   * Track biometric authentication
   */
  trackBiometricAuth(success: boolean, method: string): void {
    this.trackEvent('biometric_auth', success, { method });
  }

  /**
   * Track error
   */
  trackError(operationType: string, error: Error): void {
    this.trackEvent('error', false, {
      operationType,
      errorMessage: error.message,
      errorStack: error.stack,
    });
  }

  /**
   * Start performance measurement
   */
  startMeasurement(operationId: string, operationType: string): void {
    const metric: PerformanceMetrics = {
      operationType,
      startTime: Date.now(),
    };

    this.metrics.set(operationId, metric);
    console.log(`[Performance] Started measuring: ${operationType}`);
  }

  /**
   * End performance measurement
   */
  endMeasurement(
    operationId: string,
    customMetrics?: Record<string, number>
  ): number {
    const metric = this.metrics.get(operationId);

    if (!metric) {
      console.warn(`[Performance] No measurement found for: ${operationId}`);
      return 0;
    }

    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.customMetrics = customMetrics;

    console.log(
      `[Performance] ${metric.operationType}: ${metric.duration}ms`
    );

    if (customMetrics) {
      console.log(`[Performance] Custom metrics:`, customMetrics);
    }

    return metric.duration;
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): AnalyticsSummary {
    const now = Date.now();
    const last24h = this.events.filter(
      e => now - e.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    const summary: AnalyticsSummary = {
      totalEvents: this.events.length,
      last24Hours: last24h.length,
      successRate: this.calculateSuccessRate(this.events),
      successRate24h: this.calculateSuccessRate(last24h),
      avgDuration: this.calculateAvgDuration(this.events),
      eventsByType: this.groupEventsByType(this.events),
      recentErrors: this.getRecentErrors(10),
    };

    return summary;
  }

  /**
   * Calculate success rate
   */
  private calculateSuccessRate(events: TelemetryEvent[]): number {
    if (events.length === 0) return 0;
    const successful = events.filter(e => e.success).length;
    return (successful / events.length) * 100;
  }

  /**
   * Calculate average duration
   */
  private calculateAvgDuration(events: TelemetryEvent[]): number {
    const withDuration = events.filter(e => e.duration !== undefined);
    if (withDuration.length === 0) return 0;

    const totalDuration = withDuration.reduce(
      (sum, e) => sum + (e.duration || 0),
      0
    );
    return totalDuration / withDuration.length;
  }

  /**
   * Group events by type
   */
  private groupEventsByType(
    events: TelemetryEvent[]
  ): Record<string, number> {
    const grouped: Record<string, number> = {};

    events.forEach(event => {
      grouped[event.type] = (grouped[event.type] || 0) + 1;
    });

    return grouped;
  }

  /**
   * Get recent errors
   */
  private getRecentErrors(limit: number): TelemetryEvent[] {
    return this.events
      .filter(e => !e.success)
      .slice(-limit)
      .reverse();
  }

  /**
   * Periodic cleanup of old events
   */
  private startPeriodicCleanup(): void {
    setInterval(() => {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days
      this.events = this.events.filter(
        e => e.timestamp.getTime() > cutoff
      );
      console.log(`[Telemetry] Cleanup: ${this.events.length} events retained`);
    }, 24 * 60 * 60 * 1000); // Daily
  }

  /**
   * Export telemetry data
   */
  exportData(): {
    events: TelemetryEvent[];
    summary: AnalyticsSummary;
  } {
    return {
      events: [...this.events],
      summary: this.getAnalyticsSummary(),
    };
  }

  /**
   * Clear all telemetry data
   */
  clearData(): void {
    this.events = [];
    this.metrics.clear();
    console.log('[Telemetry] All data cleared');
  }
}

export interface AnalyticsSummary {
  totalEvents: number;
  last24Hours: number;
  successRate: number;
  successRate24h: number;
  avgDuration: number;
  eventsByType: Record<string, number>;
  recentErrors: TelemetryEvent[];
}

export const telemetryService = TelemetryService.getInstance();
