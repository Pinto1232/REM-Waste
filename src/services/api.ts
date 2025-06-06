import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiException, type ApiError } from '../types/api';
import { logger } from '../utils/logger';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  config => {
    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
    });
    return config;
  },
  error => {
    logger.error('API Request Error', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.debug('API Response Success', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      status: error.response?.status ?? undefined,
      details: error.response?.data ?? undefined,
    };

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as Record<string, unknown>;

      apiError.status = status;
      apiError.message =
        (typeof data?.['message'] === 'string' ? data['message'] : undefined) || error.message;
      apiError.code =
        (typeof data?.['code'] === 'string' ? data['code'] : undefined) || `HTTP_${status}`;

      switch (status) {
        case 400:
          apiError.message =
            (typeof data?.['message'] === 'string' ? data['message'] : undefined) || 'Bad request';
          apiError.code = 'BAD_REQUEST';
          break;
        case 401:
          apiError.message = 'Unauthorized access';
          apiError.code = 'UNAUTHORIZED';
          logger.warn('Unauthorized API access attempt');
          break;
        case 403:
          apiError.message = 'Access forbidden';
          apiError.code = 'FORBIDDEN';
          break;
        case 404:
          apiError.message = 'Resource not found';
          apiError.code = 'NOT_FOUND';
          break;
        case 429:
          apiError.message = 'Too many requests';
          apiError.code = 'RATE_LIMITED';
          break;
        case 500:
          apiError.message = 'Internal server error';
          apiError.code = 'SERVER_ERROR';
          break;
        default:
          apiError.message =
            (typeof data?.['message'] === 'string' ? data['message'] : undefined) ||
            `HTTP Error ${status}`;
          apiError.code = `HTTP_${status}`;
      }
    } else if (error.request) {
      apiError.message = 'Network error - please check your connection';
      apiError.code = 'NETWORK_ERROR';
    } else {
      apiError.message = error.message || 'Request configuration error';
      apiError.code = 'REQUEST_ERROR';
    }

    logger.error('API Error', apiError);
    return Promise.reject(new ApiException(apiError));
  }
);

export const apiWithRetry = {
  async get<T>(url: string, retries = 2): Promise<T> {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await api.get<T>(url);
        return response.data;
      } catch (error) {
        if (i === retries) throw error;

        const delay = Math.pow(2, i) * 1000;
        logger.warn(`API request failed, retrying in ${delay}ms`, { attempt: i + 1, url });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  },

  async post<T>(url: string, data?: unknown, retries = 1): Promise<T> {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await api.post<T>(url, data);
        return response.data;
      } catch (error) {
        if (i === retries) throw error;

        const delay = Math.pow(2, i) * 1000;
        logger.warn(`API request failed, retrying in ${delay}ms`, { attempt: i + 1, url });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  },
};
