import axios from 'axios';
import type { RegistrationData } from './validation';
import { config } from '@/config';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cliente de axios específico para ChatGPTBuilder
export const chatGPTBuilderApi = axios.create({
  baseURL: config.chatGPTBuilder.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-ACCESS-TOKEN': config.chatGPTBuilder.accessToken
  }
});

export interface UserResponse {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthMonth?: string;
  birthDay?: string;
  chatbotUserId?: string;
  createdAt?: string;
}

export interface ChatGPTBuilderData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  birth_month?: string;
  birth_day?: string;
}

export const userApi = {
  register: async (data: RegistrationData): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>('/register', data);
    return response.data;
  },

  getUserData: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/user-data');
    return response.data;
  },
  
  confirmData: async (): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>('/confirm-data');
    return response.data;
  },
  
  // Nuevo método para enviar datos directamente a ChatGPTBuilder
  sendToChatGPTBuilder: async (userData: UserResponse): Promise<{ success: boolean }> => {
    try {
      // Preparar los datos en el formato requerido por ChatGPTBuilder
      const chatGPTBuilderData: ChatGPTBuilderData = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        email: userData.email
      };
      
      // Opcionalmente incluir datos de cumpleaños si están disponibles
      if (userData.birthMonth) chatGPTBuilderData.birth_month = userData.birthMonth;
      if (userData.birthDay) chatGPTBuilderData.birth_day = userData.birthDay;
      
      // Determinar el ID de usuario correcto para ChatGPTBuilder
      const userId = userData.chatbotUserId || config.chatGPTBuilder.defaultUserId;
      
      // Realizar la petición directamente a ChatGPTBuilder
      const url = `/users/${userId}/send_content`;
      const response = await chatGPTBuilderApi.post(url, chatGPTBuilderData);
      
      console.log('ChatGPTBuilder response:', response.data);
      return { success: true };
    } catch (error) {
      console.error('Error sending data to ChatGPTBuilder:', error);
      throw error;
    }
  }
};

export default userApi;