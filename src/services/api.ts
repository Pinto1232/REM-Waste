import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access');
    }

    if (error instanceof Error) {
      return Promise.reject(error);
    }

    return Promise.reject(new Error(error?.message ?? 'An unexpected error occurred'));
  }
);
