import { useState, useCallback } from 'react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { skipService } from '../services/skipService';
import type { Skip, SkipSearchParams } from '../schemas/skip';
import { logger } from '../utils/logger';

export const skipQueryKeys = {
  all: ['skips'] as const,
  byLocation: (params: SkipSearchParams) => ['skips', 'by-location', params] as const,
  byId: (id: number) => ['skips', 'by-id', id] as const,
};

export function useSkipsByLocation(
  params: SkipSearchParams | null,
  options?: Omit<UseQueryOptions<Skip[], Error>, 'queryKey' | 'queryFn'>
) {
  logger.debug('useSkipsByLocation called', {
    params,
    enabled: !!params?.postcode,
  });

  return useQuery({
    queryKey: params ? skipQueryKeys.byLocation(params) : ['skips', 'disabled'],
    queryFn: async () => {
      if (!params) {
        throw new Error('No search parameters provided');
      }

      logger.debug('useSkipsByLocation queryFn called', { params });

      try {
        const result = await skipService.getSkipsByLocation(params);
        logger.debug('useSkipsByLocation API success', { resultCount: result.length });
        return result;
      } catch (error) {
        logger.error('useSkipsByLocation API error', error);
        throw error;
      }
    },
    enabled: !!params?.postcode && params.postcode.trim().length >= 3,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
  });
}

export function useSkipById(
  id: number,
  options?: Omit<UseQueryOptions<Skip, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: skipQueryKeys.byId(id),
    queryFn: () => skipService.getSkipById(id),
    enabled: !!id && id > 0,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
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
    area: undefined,
  });

  const query = useSkipsByLocation(searchParams, {
    enabled: searchParams.postcode.length >= 3,
  });

  const search = useCallback((params: SkipSearchParams) => {
    setSearchParams(params);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchParams({ postcode: '', area: undefined });
  }, []);

  return {
    ...query,
    search,
    clearSearch,
    searchParams,
  };
}
