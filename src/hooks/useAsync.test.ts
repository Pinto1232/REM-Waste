import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  it('should handle successful async function', async () => {
    const mockAsyncFn = vi.fn().mockResolvedValue('success');

    const { result } = renderHook(() => useAsync(mockAsyncFn, false));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe('success');
    expect(result.current.error).toBe(null);
  });

  it('should handle async function errors', async () => {
    const mockError = new Error('Test error');
    const mockAsyncFn = vi.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useAsync(mockAsyncFn, false));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(mockError);
  });

  it('should set loading state correctly', async () => {
    const mockAsyncFn = vi
      .fn()
      .mockImplementation(() => new Promise<string>(resolve => setTimeout(() => resolve('success'), 100)));

    const { result } = renderHook(() => useAsync<string>(mockAsyncFn, false));

    let executePromise: ReturnType<typeof result.current.execute>;
    
    act(() => {
      executePromise = result.current.execute();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await executePromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('should execute immediately when immediate is true', async () => {
    const mockAsyncFn = vi.fn().mockResolvedValue('immediate');

    await act(async () => {
      renderHook(() => useAsync(mockAsyncFn, true));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockAsyncFn).toHaveBeenCalled();
  });
});
