import axios, { AxiosError } from 'axios';
import type { Skip, SkipSearchParams } from '../types/skip';

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

export const skipService = {
  getSkipsByLocation: async (params: SkipSearchParams): Promise<Skip[]> => {
    if (!params.postcode || params.postcode.trim().length < 3) {
      throw new Error('Please provide a valid postcode (minimum 3 characters)');
    }

    const searchParams = new URLSearchParams();
    searchParams.append('postcode', params.postcode.trim());
    searchParams.append('area', params.area?.trim() || '');

    const url = `/skips/by-location?${searchParams.toString()}`;

    if (import.meta.env.DEV) {
      console.log('API Request URL:', `${API_BASE_URL}${url}`);
      console.log('Search params:', {
        postcode: params.postcode.trim(),
        area: params.area?.trim() || '',
      });
    }

    const response = await skipApi.get<Skip[]>(url);

    if (import.meta.env.DEV) {
      console.log('API Response:', response.data);
    }

    return response.data;
  },

  getSkipById: async (id: number): Promise<Skip> => {
    if (!id || id <= 0) {
      throw new Error('Invalid skip ID provided');
    }

    const response = await skipApi.get<Skip>(`/skips/${id}`);
    return response.data;
  },
};
