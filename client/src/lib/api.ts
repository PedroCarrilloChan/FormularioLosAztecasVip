import axios from 'axios';
import type { RegistrationData } from './validation';
import { months } from './validation';
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

export interface ChatGPTBuilderAction {
  action: string;
  field_name: string;
  value: string;
}

export interface ChatGPTBuilderData {
  phone: string;
  first_name: string;
  last_name: string;
  email: string;
  WC_UserBirthday?: string;
  actions: ChatGPTBuilderAction[];
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
  
  // Método para enviar datos directamente a ChatGPTBuilder (actualizado con acciones)
  sendToChatGPTBuilder: async (userData: UserResponse): Promise<{ success: boolean }> => {
    try {
      // Determinar el ID de usuario correcto para ChatGPTBuilder
      const userId = userData.chatbotUserId || config.chatGPTBuilder.defaultUserId;
      
      // Formatear la fecha de nacimiento si está disponible
      let formattedBirthDate = '';
      if (userData.birthMonth && userData.birthDay) {
        // Formatear correctamente el valor de cumpleaños
        const monthIndex = months.indexOf(userData.birthMonth);
        if (monthIndex > -1) {
          const monthNumber = (monthIndex + 1).toString().padStart(2, '0');
          formattedBirthDate = `1980-${monthNumber}-${userData.birthDay.padStart(2, '0')}`;
        }
      }
      
      // Crear las acciones para actualizar los campos del usuario
      const actions: ChatGPTBuilderAction[] = [
        {
          action: "set_field_value",
          field_name: "first_name",
          value: userData.firstName
        },
        {
          action: "set_field_value",
          field_name: "last_name",
          value: userData.lastName
        },
        {
          action: "set_field_value",
          field_name: "email",
          value: userData.email
        },
        {
          action: "set_field_value",
          field_name: "phone",
          value: userData.phone
        },
        {
          action: "set_field_value",
          field_name: "full_name",
          value: `${userData.firstName} ${userData.lastName}`
        }
      ];
      
      // Agregar la acción de cumpleaños si existe
      if (formattedBirthDate) {
        actions.push({
          action: "set_field_value",
          field_name: "WC_UserBirthday",
          value: formattedBirthDate
        });
      }
      
      // Preparar los datos en el formato requerido por ChatGPTBuilder
      const chatGPTBuilderData: ChatGPTBuilderData = {
        phone: userData.phone,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        actions: actions
      };
      
      // Agregar el campo de cumpleaños si está disponible
      if (formattedBirthDate) {
        chatGPTBuilderData.WC_UserBirthday = formattedBirthDate;
      }
      
      console.log(`🧪 INICIO PROCESO DE ACTUALIZACIÓN 🧪`);
      console.log(`🧪 ID Usuario: ${userId}`);
      console.log(`🧪 API URL: ${config.chatGPTBuilder.baseUrl}/users/${userId}/send_content`);
      console.log(`🧪 Payload completo:`, JSON.stringify(chatGPTBuilderData, null, 2));
      
      // Realizar la petición directamente a ChatGPTBuilder
      const url = `/users/${userId}/send_content`;
      console.log(`🧪 Enviando petición a: ${url}`);
      try {
        const response = await chatGPTBuilderApi.post(url, chatGPTBuilderData);
        
        console.log('🧪 PETICIÓN EXITOSA ✅');
        console.log('🧪 Status code:', response.status);
        console.log('🧪 Respuesta de ChatGPTBuilder:', JSON.stringify(response.data, null, 2));
        
        // Imprimir la URL completa para verificar
        console.log('🧪 URL completa:', `${config.chatGPTBuilder.baseUrl}/users/${userId}/send_content`);
        console.log('🧪 Cabeceras enviadas:', JSON.stringify({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-ACCESS-TOKEN': config.chatGPTBuilder.accessToken
        }, null, 2));
        
        return { success: true };
      } catch (apiError: any) {
        console.log('🧪 ERROR EN LA PETICIÓN ❌');
        console.log('🧪 Mensaje de error:', apiError.message);
        
        // Capturar información detallada de respuesta si está disponible
        if (apiError.response) {
          console.log('🧪 Status code:', apiError.response.status);
          console.log('🧪 Respuesta de error:', JSON.stringify(apiError.response.data, null, 2));
        }
        
        // Re-lanzar el error para manejarlo en el nivel superior
        throw apiError;
      }
    } catch (error) {
      console.error('🚨 ERROR al enviar datos a ChatGPTBuilder:', error);
      console.error('🚨 Stack trace:', (error as any)?.stack);
      throw error;
    }
  }
};

export default userApi;