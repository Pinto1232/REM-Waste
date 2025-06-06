import axios, { AxiosError } from 'axios';
import { SkipListResponseSchema, SkipSchema, SkipSearchParamsSchema } from '../schemas/skip';
import type { Skip, SkipSearchParams } from '../schemas/skip';
import { logger } from '../utils/logger';

interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: string;
}
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://app.wewantwaste.co.uk/api';

const skipApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
  withCredentials: false,
});

skipApi.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please check your connection and try again');
    }

    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error - please check your internet connection');
    }

    if (error.message?.includes('CORS') || error.message?.includes('Access-Control')) {
      throw new Error('CORS error - API access blocked by browser security policy');
    }

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as ApiErrorResponse;

      switch (status) {
        case 400: {
          const message =
            data?.message ||
            data?.error ||
            'Invalid search parameters. Please check your postcode and try again.';
          throw new Error(message);
        }
        case 401:
          throw new Error('Authentication required - please log in');
        case 403:
          throw new Error('Access denied - insufficient permissions');
        case 404:
          throw new Error('No skips found for this location');
        case 429:
          throw new Error('Too many requests - please wait a moment and try again');
        case 500:
        case 502:
        case 503:
        case 504:
          throw new Error('Server error - please try again later');
        default:
          throw new Error(`Request failed with status ${status}`);
      }
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
);

function getAreaVariations(postcode: string): string[] {
  const trimmed = postcode.trim().toUpperCase();
  const variations: string[] = [];

  variations.push(trimmed);

  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex > 0) {
    variations.push(trimmed.substring(0, spaceIndex));
  }

  const lettersMatch = trimmed.match(/^([A-Z]+)/);
  if (lettersMatch && lettersMatch[1]) {
    variations.push(lettersMatch[1]);
  }

  const letterDigitMatch = trimmed.match(/^([A-Z]+\d)/);
  if (letterDigitMatch && letterDigitMatch[1]) {
    variations.push(letterDigitMatch[1]);
  }

  return [...new Set(variations)]; 
}

export const skipService = {
  getSkipsByLocation: async (params: SkipSearchParams): Promise<Skip[]> => {

    const validatedParams = SkipSearchParamsSchema.parse(params);

    const postcode = validatedParams.postcode.trim();
    const providedArea = validatedParams.area?.trim();

    if (providedArea) {
      const searchParams = new URLSearchParams();
      searchParams.append('postcode', postcode);
      searchParams.append('area', providedArea);

      const url = `/skips/by-location?${searchParams.toString()}`;

      logger.debug('Skip service API request', {
        url: `${API_BASE_URL}${url}`,
        params: { postcode, area: providedArea }
      });

      const response = await skipApi.get(url);
      const validatedData = SkipListResponseSchema.parse(response.data);

      logger.debug('Skip service API response', {
        resultCount: validatedData.length
      });

      return validatedData;
    }

    const areaVariations = getAreaVariations(postcode);
    let lastError: Error | null = null;

    for (const area of areaVariations) {
      try {
        const searchParams = new URLSearchParams();
        searchParams.append('postcode', postcode);
        searchParams.append('area', area);

        const url = `/skips/by-location?${searchParams.toString()}`;

        logger.debug('Skip service API request attempt', {
          url: `${API_BASE_URL}${url}`,
          params: { postcode, area },
          attempt: areaVariations.indexOf(area) + 1,
          totalAttempts: areaVariations.length
        });

        const response = await skipApi.get(url);
        const validatedData = SkipListResponseSchema.parse(response.data);

        logger.debug('Skip service API response success', {
          resultCount: validatedData.length,
          successfulArea: area
        });

        return validatedData;
      } catch (error) {
        lastError = error as Error;
        logger.debug('Skip service API attempt failed', {
          area,
          error: lastError.message,
          attempt: areaVariations.indexOf(area) + 1,
          totalAttempts: areaVariations.length
        });

        if (areaVariations.indexOf(area) === areaVariations.length - 1) {
          break;
        }
      }
    }

    logger.error('Skip service API all attempts failed', {
      postcode,
      areaVariations,
      lastError: lastError?.message
    });

    throw lastError || new Error('Failed to fetch skips for this location');
  },

  getSkipById: async (id: number): Promise<Skip> => {
    if (!id || id <= 0) {
      throw new Error('Invalid skip ID provided');
    }

    const response = await skipApi.get(`/skips/${id}`);

    const validatedData = SkipSchema.parse(response.data);

    return validatedData;
  },
};
