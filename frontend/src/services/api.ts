import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: (error.response?.data as { message?: string })?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(apiError);
  }
);

// Category Types
export interface Category {
  id: string;
  name: string;
  priority: number;
  budget: number;
  spent: number;
  isPaid?: boolean;
}

export interface CategoryCreate {
  name: string;
  priority: number;
  budget: number;
}

// Category API calls
export const categoryApi = {
  getAll: () => api.get<Category[]>('/categories'),
  create: (data: CategoryCreate) => api.post<Category>('/categories', data),
  update: (id: string, data: Partial<Category>) => api.put<Category>(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  age?: number;
  gender?: string;
  monthlyIncome?: number;
  totalSavings?: number;
}

export interface UserUpdate {
  age?: number;
  gender?: string;
  monthlyIncome?: number;
  totalSavings?: number;
  password?: string;
}

// User API calls
export const userApi = {
  getProfile: () => api.get<User>('/users/profile'),
  updateProfile: (data: UserUpdate) => api.put<User>('/users/profile', data),
};

// Rule Types
export interface Rule {
  id: string;
  name: string;
  description: string;
  allocations: {
    needs: number;
    wants: number;
    savings: number;
  };
}

// Rule API calls
export const ruleApi = {
  getAll: () => api.get<Rule[]>('/rules'),
  getActive: () => api.get<Rule>('/rules/active'),
  setActive: (id: string) => api.post(`/rules/${id}/activate`),
  customize: (id: string, allocations: Rule['allocations']) =>
    api.put(`/rules/${id}/customize`, allocations),
};

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
}

// Auth API calls
export const authApi = {
  login: (credentials: LoginCredentials) => api.post<{ token: string; user: User }>('/auth/login', credentials),
  register: (data: RegisterData) => api.post<{ token: string; user: User }>('/auth/register', data),
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default api; 