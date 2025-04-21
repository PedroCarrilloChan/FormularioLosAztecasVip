import axios from 'axios';
import type { RegistrationData } from './validation';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UserResponse {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export const userApi = {
  register: async (data: RegistrationData): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>('/register', data);
    return response.data;
  },

  getUserData: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/user-data');
    return response.data;
  }
};

export default userApi;