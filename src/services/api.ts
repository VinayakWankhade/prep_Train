import axios, { AxiosResponse, AxiosError } from 'axios';
import { APIResponse } from '@/types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  config => {
    // You can add custom headers or tokens here
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);
    const res: APIResponse<null> = {
      success: false,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message,
        details: error.response?.data,
      },
    };
    return Promise.reject(res);
  }
);

export const get = async <T>(url: string, params?: any): Promise<APIResponse<T>> => {
  try {
    const response = await api.get<T>(url, { params });
    return response.data;
  } catch (error) {
    return error as APIResponse<null>;
  }
};

export const post = async <T>(url: string, data?: any): Promise<APIResponse<T>> => {
  try {
    const response = await api.post<T>(url, data);
    return response.data;
  } catch (error) {
    return error as APIResponse<null>;
  }
};

export const put = async <T>(url: string, data?: any): Promise<APIResponse<T>> => {
  try {
    const response = await api.put<T>(url, data);
    return response.data;
  } catch (error) {
    return error as APIResponse<null>;
  }
};

export const remove = async <T>(url: string): Promise<APIResponse<T>> => {
  try {
    const response = await api.delete<T>(url);
    return response.data;
  } catch (error) {
    return error as APIResponse<null>;
  }
};

export default api;

