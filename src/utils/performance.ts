import { logger } from './logger';

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, WebVitalsMetric> = new Map();
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    this.observeLCP();

    this.observeFID();

    this.observeCLS();

    this.observeFCP();

    this.observeTTFB();
  }

  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };

        if (lastEntry) {
          const value = lastEntry.renderTime || lastEntry.loadTime || 0;
          this.recordMetric('LCP', value, this.getLCPRating(value));
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('Failed to observe LCP', error);
    }
  }

  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & { processingStart?: number };
          if (fidEntry.processingStart) {
            const value = fidEntry.processingStart - entry.startTime;
            this.recordMetric('FID', value, this.getFIDRating(value));
          }
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('Failed to observe FID', error);
    }
  }

  private observeCLS(): void {
    try {
      let clsValue = 0;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
          if (layoutShiftEntry.value && !layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
            this.recordMetric('CLS', clsValue, this.getCLSRating(clsValue));
          }
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('Failed to observe CLS', error);
    }
  }

  private observeFCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('FCP', entry.startTime, this.getFCPRating(entry.startTime));
          }
        });
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('Failed to observe FCP', error);
    }
  }

  private observeTTFB(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const navEntry = entry as PerformanceNavigationTiming;
          if (navEntry.responseStart) {
            const ttfb = navEntry.responseStart - navEntry.fetchStart;
            this.recordMetric('TTFB', ttfb, this.getTTFBRating(ttfb));
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('Failed to observe TTFB', error);
    }
  }

  private recordMetric(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor'): void {
    const previousMetric = this.metrics.get(name);
    const delta = previousMetric ? value - previousMetric.value : value;

    const metric: WebVitalsMetric = {
      name,
      value,
      rating,
      delta,
      id: this.generateId(),
    };

    this.metrics.set(name, metric);

    logger.info(`Performance metric recorded: ${name}`, {
      value: Math.round(value),
      rating,
      delta: Math.round(delta),
    });

    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      this.reportToAnalytics(metric);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  private getFCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  }

  private getTTFBRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 800) return 'good';
    if (value <= 1800) return 'needs-improvement';
    return 'poor';
  }

  private reportToAnalytics(metric: WebVitalsMetric): void {

    logger.debug('Reporting metric to analytics', metric);
  }

  public getMetrics(): Map<string, WebVitalsMetric> {
    return new Map(this.metrics);
  }

  public getMetric(name: string): WebVitalsMetric | undefined {
    return this.metrics.get(name);
  }

  public disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const bundleAnalyzer = {
  logBundleSize: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      const jsFiles = entries.filter(entry => 
        entry.name.includes('.js') && !entry.name.includes('node_modules')
      );

      const cssFiles = entries.filter(entry => 
        entry.name.includes('.css') && !entry.name.includes('node_modules')
      );

      const totalJSSize = jsFiles.reduce((total, entry) => total + (entry.transferSize || 0), 0);
      const totalCSSSize = cssFiles.reduce((total, entry) => total + (entry.transferSize || 0), 0);

      logger.info('Bundle size analysis', {
        jsFiles: jsFiles.length,
        cssFiles: cssFiles.length,
        totalJSSize: `${(totalJSSize / 1024).toFixed(2)} KB`,
        totalCSSSize: `${(totalCSSSize / 1024).toFixed(2)} KB`,
        totalSize: `${((totalJSSize + totalCSSSize) / 1024).toFixed(2)} KB`,
      });
    }
  },
};

export const memoryMonitor = {
  logMemoryUsage: () => {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;

      logger.info('Memory usage', {
        usedJSHeapSize: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        totalJSHeapSize: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  },

  startMonitoring: (intervalMs: number = 30000) => {
    return setInterval(() => {
      memoryMonitor.logMemoryUsage();
    }, intervalMs);
  },
};

export const initializePerformanceMonitoring = (): PerformanceMonitor => {
  const monitor = PerformanceMonitor.getInstance();

  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        bundleAnalyzer.logBundleSize();
        memoryMonitor.logMemoryUsage();
      }, 1000);
    });
  }

  return monitor;
};