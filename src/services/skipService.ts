import axios from 'axios';
import type { Skip, SkipSearchParams } from '../types/skip';


const skipApi = axios.create({
  baseURL: 'https://app.wewantwaste.co.uk/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

skipApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again');
    }
    if (error.response?.status === 404) {
      throw new Error('No skips found for this location');
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error - please try again later');
    }
    throw error;
  }
);

export const skipService = {
  getSkipsByLocation: async (params: SkipSearchParams): Promise<Skip[]> => {
    const searchParams = new URLSearchParams();
    searchParams.append('postcode', params.postcode);
    
    if (params.area) {
      searchParams.append('area', params.area);
    }

    const response = await skipApi.get<Skip[]>(`/skips/by-location?${searchParams.toString()}`);
    return response.data;
  },

  getSkipById: async (id: number): Promise<Skip> => {
    const response = await skipApi.get<Skip>(`/skips/${id}`);
    return response.data;
  },
};
