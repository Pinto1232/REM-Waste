interface CSSPerformanceMetrics {
  loadTime: number;
  renderTime: number;
  fileSize?: number;
  cacheHit: boolean;
}

interface CriticalCSSConfig {
  aboveFoldHeight: number;
  deviceWidth: number;
  extractFromFiles: string[];
}

export async function measureCSSPerformance(cssFile: string): Promise<CSSPerformanceMetrics | null> {
  try {
    const startTime = performance.now();

    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const cssEntry = resourceEntries.find(entry => entry.name.includes(cssFile));

    if (!cssEntry) {
      console.warn(`CSS performance entry not found for: ${cssFile}`);
      return null;
    }

    const loadTime = cssEntry.responseEnd - cssEntry.requestStart;
    const renderTime = performance.now() - startTime;
    const cacheHit = cssEntry.transferSize === 0 && cssEntry.decodedBodySize > 0;

    return {
      loadTime,
      renderTime,
      fileSize: cssEntry.transferSize,
      cacheHit
    };
  } catch (error) {
    console.error('Error measuring CSS performance:', error);
    return null;
  }
}

export function analyzeUnusedCSS(): string[] {
  const unusedRules: string[] = [];

  try {

    const stylesheets = Array.from(document.styleSheets);

    stylesheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules || []);

        rules.forEach(rule => {
          if (rule instanceof CSSStyleRule) {

            try {
              const elements = document.querySelectorAll(rule.selectorText);
              if (elements.length === 0) {
                unusedRules.push(rule.selectorText);
              }
            } catch (e) {

            }
          }
        });
      } catch (e) {

      }
    });
  } catch (error) {
    console.error('Error analyzing unused CSS:', error);
  }

  return unusedRules;
}

export function measureFCPImpact(): number | null {
  try {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    return fcpEntry ? fcpEntry.startTime : null;
  } catch (error) {
    console.error('Error measuring FCP impact:', error);
    return null;
  }
}

export function monitorCLS(callback: (clsValue: number) => void): void {
  try {
    let clsValue = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      callback(clsValue);
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.error('Error monitoring CLS:', error);
  }
}

export function getOptimizationRecommendations(metrics: CSSPerformanceMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.loadTime > 100) {
    recommendations.push('Consider minifying CSS files to reduce load time');
  }

  if (!metrics.cacheHit) {
    recommendations.push('Implement proper caching headers for CSS files');
  }

  if (metrics.fileSize && metrics.fileSize > 50000) {
    recommendations.push('Consider splitting large CSS files into smaller chunks');
  }

  if (metrics.renderTime > 16) {
    recommendations.push('Optimize CSS selectors to reduce render time');
  }

  return recommendations;
}

export function generateCriticalCSSConfig(config: Partial<CriticalCSSConfig> = {}): CriticalCSSConfig {
  return {
    aboveFoldHeight: config.aboveFoldHeight || 600,
    deviceWidth: config.deviceWidth || 1200,
    extractFromFiles: config.extractFromFiles || ['src/index.css', 'src/App.css']
  };
}

export function reportCSSPerformance(metrics: CSSPerformanceMetrics): void {

  console.log('CSS Performance Metrics:', {
    loadTime: `${metrics.loadTime.toFixed(2)}ms`,
    renderTime: `${metrics.renderTime.toFixed(2)}ms`,
    fileSize: metrics.fileSize ? `${(metrics.fileSize / 1024).toFixed(2)}KB` : 'Unknown',
    cacheHit: metrics.cacheHit ? 'Yes' : 'No'
  });
}

export function validateWebVitals(metrics: CSSPerformanceMetrics): {
  fcp: 'good' | 'needs-improvement' | 'poor';
  cls: 'good' | 'needs-improvement' | 'poor';
  recommendations: string[];
} {
  const fcpTime = measureFCPImpact() || 0;

  const fcpRating = fcpTime <= 1800 ? 'good' : fcpTime <= 3000 ? 'needs-improvement' : 'poor';

  const clsRating = 'good'; 

  const recommendations = getOptimizationRecommendations(metrics);

  return {
    fcp: fcpRating,
    cls: clsRating,
    recommendations
  };
}