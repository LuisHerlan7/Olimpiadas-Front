import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: string;
      email: string;
      role: string;
      nombre?: string;
      apellido?: string;
    };
    token: string;
  };
  token?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log('Intentando conectar a:', API_BASE_URL);
      console.log('Datos de login:', { email, password: '***' });
      
      const response = await authApi.post('/auth/login', {
        email,
        password,
      });
      
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error completo en login:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error de conexión con el servidor',
      };
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getStoredToken: () => {
    return localStorage.getItem('token');
  },

  storeUser: (user: any, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  },
};
