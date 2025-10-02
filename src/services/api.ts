import axios from 'axios';

const api = axios.create({
  baseURL: 'https://qymxhxajotbsprbvtbne.supabase.co', // Cambia esto por la URL de tu backend
  timeout: 10000, // Tiempo máximo de espera (opcional)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;