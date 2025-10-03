import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api', // URL del backend
  timeout: 10000, // Tiempo máximo de espera (opcional)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;