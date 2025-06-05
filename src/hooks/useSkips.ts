import { useState, useCallback } from 'react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { skipService } from '../services/skipService';
import type { Skip, SkipSearchParams } from '../types/skip';

// Query keys for React Query
export const skipQueryKeys = {
  all: ['skips'] as const,
  byLocation: (params: SkipSearchParams) => ['skips', 'by-location', params] as const,
  byId: (id: number) => ['skips', 'by-id', id] as const,
};

/**
 * Hook to fetch skips by location using React Query
 */
export function useSkipsByLocation(
  params: SkipSearchParams | null,
  options?: Omit<UseQueryOptions<Skip[], Error>, 'queryKey' | 'queryFn'>
) {
  console.log('useSkipsByLocation - params:', params);
  console.log('useSkipsByLocation - enabled:', !!params?.postcode);
  
  return useQuery<Skip[], Error>({
    queryKey: params ? skipQueryKeys.byLocation(params) : ['skips', 'disabled'],
    queryFn: async () => {
      if (!params) {
        throw new Error('No search parameters provided');
      }
      console.log('useSkipsByLocation - queryFn called with params:', params);
      try {
        const result = await skipService.getSkipsByLocation(params);
        console.log('useSkipsByLocation - API result:', result);
        return result;
      } catch (error) {
        console.error('useSkipsByLocation - API error:', error);
        throw error;
      }
    },
    enabled: !!params?.postcode, // Only run query if params exist and postcode is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount: number, error: Error) => {
      // Don't retry on 404 errors (no skips found)
      if (error.message.includes('No skips found')) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    ...options,
  });
}

/**
 * Hook to fetch a single skip by ID
 */
export function useSkipById(
  id: number,
  options?: Omit<UseQueryOptions<Skip, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Skip, Error>({
    queryKey: skipQueryKeys.byId(id),
    queryFn: () => skipService.getSkipById(id),
    enabled: !!id && id > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
}

/**
 * Custom hook that provides search functionality with debouncing
 */
export function useSkipSearch() {
  const [searchParams, setSearchParams] = useState<SkipSearchParams>({
    postcode: '',
    area: '',
  });

  const query = useSkipsByLocation(searchParams, {
    enabled: searchParams.postcode.length >= 3, // Only search when postcode has at least 3 characters
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


