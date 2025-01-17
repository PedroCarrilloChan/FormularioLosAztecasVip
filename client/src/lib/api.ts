import axios from 'axios';
import type { RegistrationData } from './validation';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoyaltyResponse {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  card?: {
    url: string;
  };
  customFields: {
    Nivel: string;
    Id_CBB: string;
    Ofertas: string;
    Id_Tarjeta: string;
    Descuento: string;
    UrlSubirNivel: string;
    Id_DeReferido: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const loyaltyApi = {
  // Register a new customer
  register: async (data: RegistrationData): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>('/register', data);
    return response.data;
  },

  // Get loyalty program data
  getLoyaltyData: async (): Promise<LoyaltyResponse> => {
    const response = await api.get<LoyaltyResponse>('/loyalty-data');
    return response.data;
  },

  // Get modified installation URL
  getModifiedUrl: async (originalUrl: string): Promise<string> => {
    try {
      const response = await axios.post('https://ModificarUrlWalletClub.replit.app/modifyUrl', {
        url: originalUrl
      });
      return response.data.url;
    } catch (error) {
      console.error('Error modifying URL:', error);
      throw new Error('No se pudo procesar la URL de instalación');
    }
  }
};

export default loyaltyApi;