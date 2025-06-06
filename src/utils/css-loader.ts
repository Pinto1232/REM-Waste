export function loadCSSAsync(href: string, media: string = 'all'): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print'; 
    link.onload = () => {
      link.media = media; 
      resolve();
    };
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));

    document.head.appendChild(link);
  });
}

export function preloadCSS(href: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  document.head.appendChild(link);
}

export function inlineCriticalCSS(css: string): void {
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
}

export function loadNonCriticalCSS(cssFiles: string[]): void {
  const loadCSS = () => {
    cssFiles.forEach(file => {
      loadCSSAsync(file).catch(error => {
        console.warn('Failed to load non-critical CSS:', error);
      });
    });
  };

  if (document.readyState === 'complete') {
    loadCSS();
  } else {
    window.addEventListener('load', loadCSS);
  }
}

export function optimizeCSSLoading(criticalCSS: string, nonCriticalFiles: string[]): void {

  inlineCriticalCSS(criticalCSS);

  loadNonCriticalCSS(nonCriticalFiles);
}

export function isCSSLoaded(href: string): boolean {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  return Array.from(links).some(link => (link as HTMLLinkElement).href.includes(href));
}

export function removeUnusedCSS(selector: string): void {
  const links = document.querySelectorAll(selector);
  links.forEach(link => link.remove());
}

export function monitorCSSPerformance(cssFile: string): Promise<PerformanceEntry | null> {
  return new Promise((resolve) => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const cssEntry = entries.find(entry => entry.name.includes(cssFile));
      if (cssEntry) {
        observer.disconnect();
        resolve(cssEntry);
      }
    });

    observer.observe({ entryTypes: ['resource'] });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, 5000);
  });
}