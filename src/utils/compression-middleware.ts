interface CompressionSupport {
  gzip: boolean;
  brotli: boolean;
  deflate: boolean;
}

type CustomHeaders = {
  entries(): IterableIterator<[string, string]>;
  get(name: string): string | null;
  set(name: string, value: string): void;
};

type CustomFile = {
  name: string;
  size: number;
  type: string;
};

type CustomFormData = {
  append(name: string, value: string | CustomFile): void;
  get(name: string): string | CustomFile | null;
};

type CustomBlob = {
  size: number;
  type: string;
  slice(start?: number, end?: number, contentType?: string): CustomBlob;
};

type CustomAbortSignal = {
  aborted: boolean;
  addEventListener(type: string, listener: () => void): void;
};

type FetchOptions = {
  method?: string;
  headers?: Record<string, string> | string[][] | CustomHeaders;
  body?: string | CustomFormData | CustomBlob;
  mode?: 'cors' | 'no-cors' | 'same-origin' | 'navigate';
  credentials?: 'omit' | 'same-origin' | 'include';
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';
  redirect?: 'follow' | 'error' | 'manual';
  referrer?: string;
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
  integrity?: string;
  keepalive?: boolean;
  signal?: CustomAbortSignal;
};

type FetchResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  headers: {
    get(name: string): string | null;
  };
  json(): Promise<unknown>;
  text(): Promise<string>;
  blob(): Promise<CustomBlob>;
};

type PerformanceEntryWithTiming = {
  name: string;
  transferSize?: number;
  decodedBodySize?: number;
};

type PerformanceObserverCallback = (list: { getEntries(): PerformanceEntryWithTiming[] }) => void;

type CustomRequest = {
  url: string;
  method: string;
  headers: CustomHeaders;
};

type CustomWindow = {
  fetch: (input: string | CustomRequest, init?: FetchOptions) => Promise<FetchResponse>;
  document: {
    createElement(tagName: string): {
      rel: string;
      href: string;
      as: string;
      type: string;
      crossOrigin: string;
      setAttribute(name: string, value: string): void;
    };
    head: {
      appendChild(element: unknown): void;
    };
  };
  CompressionStream?: unknown;
  DecompressionStream?: unknown;
};

type WindowWithPerformance = CustomWindow & {
  PerformanceObserver: {
    new (callback: PerformanceObserverCallback): {
      observe(options: { entryTypes: string[] }): void;
    };
  };
  performance: {
    getEntriesByType(type: string): PerformanceEntryWithTiming[];
  };
};

export function detectCompressionSupport(): CompressionSupport {
  if (typeof window === 'undefined') {
    return { gzip: false, brotli: false, deflate: false };
  }

  const customWindow = window as unknown as CustomWindow;
  return {
    gzip: true, 
    brotli: 'CompressionStream' in customWindow && 'DecompressionStream' in customWindow,
    deflate: true, 
  };
}

export function addCompressionHeaders(
  headers: Record<string, string> = {}
): Record<string, string> {
  const support = detectCompressionSupport();
  const acceptEncoding: string[] = [];

  if (support.brotli) acceptEncoding.push('br');
  if (support.gzip) acceptEncoding.push('gzip');
  if (support.deflate) acceptEncoding.push('deflate');

  return {
    ...headers,
    'Accept-Encoding': acceptEncoding.join(', '),
  };
}

export async function compressedFetch(
  url: string, 
  options: FetchOptions = {}
): Promise<FetchResponse> {
  const headersObj = options.headers || {};
  const normalizedHeaders = Array.isArray(headersObj) 
    ? Object.fromEntries(headersObj)
    : (headersObj as CustomHeaders).entries
    ? Object.fromEntries((headersObj as CustomHeaders).entries())
    : headersObj as Record<string, string>;

  const cleanOptions: Record<string, unknown> = {
    headers: addCompressionHeaders(normalizedHeaders),
  };

  if (options['method']) cleanOptions['method'] = options['method'];
  if (typeof options['body'] === 'string') cleanOptions['body'] = options['body'];
  if (options['mode']) cleanOptions['mode'] = options['mode'];
  if (options['credentials']) cleanOptions['credentials'] = options['credentials'];
  if (options['cache']) cleanOptions['cache'] = options['cache'];
  if (options['redirect']) cleanOptions['redirect'] = options['redirect'];
  if (options['referrer']) cleanOptions['referrer'] = options['referrer'];
  if (options['referrerPolicy']) cleanOptions['referrerPolicy'] = options['referrerPolicy'];
  if (options['integrity']) cleanOptions['integrity'] = options['integrity'];
  if (options['keepalive'] !== undefined) cleanOptions['keepalive'] = options['keepalive'];

  return fetch(url, cleanOptions as never) as Promise<FetchResponse>;
}

export function monitorCompressionSavings(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  const windowWithPerf = window as unknown as WindowWithPerformance;
  const observer = new windowWithPerf.PerformanceObserver((list) => {
    list.getEntries().forEach((entry: PerformanceEntryWithTiming) => {
      if (entry.transferSize && entry.decodedBodySize) {
        const compressionRatio = entry.transferSize / entry.decodedBodySize;
        const savings = entry.decodedBodySize - entry.transferSize;
        const savingsPercent = ((savings / entry.decodedBodySize) * 100).toFixed(1);

        if (compressionRatio < 0.9 && savings > 1024) { 
          console.log(`📦 Compression savings for ${entry.name}:`, {
            original: `${(entry.decodedBodySize / 1024).toFixed(1)}KB`,
            compressed: `${(entry.transferSize / 1024).toFixed(1)}KB`,
            savings: `${(savings / 1024).toFixed(1)}KB (${savingsPercent}%)`,
            ratio: compressionRatio.toFixed(2),
          });
        }
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });
}

export function preloadWithCompression(resources: Array<{
  href: string;
  as: string;
  type?: string;
  crossorigin?: boolean;
}>): void {
  resources.forEach(({ href, as, type, crossorigin }) => {
    const customWindow = window as unknown as CustomWindow;
    const link = customWindow.document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;

    if (type) link.type = type;
    if (crossorigin) link.crossOrigin = 'anonymous';

    const support = detectCompressionSupport();
    if (support.brotli) {
      link.setAttribute('data-compression', 'br');
    } else if (support.gzip) {
      link.setAttribute('data-compression', 'gzip');
    }

    customWindow.document.head.appendChild(link);
  });
}

export function initializeCompressionMonitoring(): void {
  if (import.meta.env.DEV) {
    console.log('🗜️ Compression monitoring enabled');

    const support = detectCompressionSupport();
    console.log('📊 Browser compression support:', support);

    monitorCompressionSavings();

    const customWindow = window as unknown as CustomWindow;
    const originalFetch = customWindow.fetch;
    customWindow.fetch = async (input, init) => {
      const headersObj = init?.headers || {};
      const normalizedHeaders = Array.isArray(headersObj) 
        ? Object.fromEntries(headersObj)
        : (headersObj as CustomHeaders).entries
        ? Object.fromEntries((headersObj as CustomHeaders).entries())
        : headersObj as Record<string, string>;

      const headers = addCompressionHeaders(normalizedHeaders);
      const response = await originalFetch(input, { ...init, headers });

      if (response.headers.get('content-encoding')) {
        console.log(`🗜️ Compressed response from ${input}:`, {
          encoding: response.headers.get('content-encoding'),
          size: response.headers.get('content-length'),
        });
      }

      return response;
    };
  }
}

export function getCompressionStats(): Promise<{
  totalOriginalSize: number;
  totalCompressedSize: number;
  totalSavings: number;
  averageCompressionRatio: number;
}> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      resolve({
        totalOriginalSize: 0,
        totalCompressedSize: 0,
        totalSavings: 0,
        averageCompressionRatio: 1,
      });
      return;
    }

    const windowWithPerf = window as unknown as WindowWithPerformance;
    const entries = windowWithPerf.performance.getEntriesByType('resource');
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    let compressedEntries = 0;

    entries.forEach((entry: PerformanceEntryWithTiming) => {
      if (entry.transferSize && entry.decodedBodySize) {
        totalOriginalSize += entry.decodedBodySize;
        totalCompressedSize += entry.transferSize;
        compressedEntries++;
      }
    });

    const totalSavings = totalOriginalSize - totalCompressedSize;
    const averageCompressionRatio = compressedEntries > 0 
      ? totalCompressedSize / totalOriginalSize 
      : 1;

    resolve({
      totalOriginalSize,
      totalCompressedSize,
      totalSavings,
      averageCompressionRatio,
    });
  });
}