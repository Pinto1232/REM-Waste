import { useState, useCallback } from 'react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { skipService } from '../services/skipService';
import type { Skip, SkipSearchParams } from '../types/skip';

export const skipQueryKeys = {
  all: ['skips'] as const,
  byLocation: (params: SkipSearchParams) => ['skips', 'by-location', params] as const,
  byId: (id: number) => ['skips', 'by-id', id] as const,
};

export function useSkipsByLocation(
  params: SkipSearchParams | null,
  options?: Omit<UseQueryOptions<Skip[], Error>, 'queryKey' | 'queryFn'>
) {
  if (import.meta.env.DEV) {
    console.log('useSkipsByLocation - params:', params);
    console.log('useSkipsByLocation - enabled:', !!params?.postcode);
  }

  return useQuery<Skip[], Error>(
    params ? skipQueryKeys.byLocation(params) : ['skips', 'disabled'],
    async () => {
      if (!params) {
        throw new Error('No search parameters provided');
      }

      if (import.meta.env.DEV) {
        console.log('useSkipsByLocation - queryFn called with params:', params);
      }

      try {
        const result = await skipService.getSkipsByLocation(params);

        if (import.meta.env.DEV) {
          console.log('useSkipsByLocation - API result:', result);
        }

        return result;
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('useSkipsByLocation - API error:', error);
        }
        throw error;
      }
    },
    {
      enabled: !!params?.postcode && params.postcode.trim().length >= 3,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: (failureCount: number, error: Error) => {
        if (error.message.includes('Please provide a valid postcode')) {
          return false;
        }
        if (error.message.includes('No skips found')) {
          return false;
        }
        if (error.message.includes('Invalid search parameters')) {
          return false;
        }
        if (
          error.message.includes('CORS error') ||
          error.message.includes('Network error - this might be a CORS issue')
        ) {
          return false;
        }
        return failureCount < 2;
      },
      ...options,
    }
  );
}

export function useSkipById(
  id: number,
  options?: Omit<UseQueryOptions<Skip, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Skip, Error>(skipQueryKeys.byId(id), () => skipService.getSkipById(id), {
    enabled: !!id && id > 0,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    retry: (failureCount: number, error: Error) => {
      if (error.message.includes('Invalid skip ID')) {
        return false;
      }
      if (error.message.includes('Skip not found')) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
}

export function useSkipSearch() {
  const [searchParams, setSearchParams] = useState<SkipSearchParams>({
    postcode: '',
    area: '',
  });

  const query = useSkipsByLocation(searchParams, {
    enabled: searchParams.postcode.length >= 3,
  });

  const search = useCallback((params: SkipSearchParams) => {
    setSearchParams(params);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchParams({ postcode: '', area: '' });
  }, []);

  return {
    ...query,
    search,
    clearSearch,
    searchParams,
  };
}
