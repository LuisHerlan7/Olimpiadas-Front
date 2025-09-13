// Servicios de API para el Sistema de Olimpiadas Oh! SanSi
// Placeholder para integración con backend real (PHP/Laravel o Java)

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Configuración de headers por defecto
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Función helper para hacer requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: defaultHeaders,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Servicios de Participantes
export const participantesService = {
  // Obtener todos los participantes
  getAll: () => apiRequest('/participantes'),
  
  // Obtener participante por ID
  getById: (id) => apiRequest(`/participantes/${id}`),
  
  // Crear nuevo participante
  create: (data) => apiRequest('/participantes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Actualizar participante
  update: (id, data) => apiRequest(`/participantes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Eliminar participante
  delete: (id) => apiRequest(`/participantes/${id}`, {
    method: 'DELETE',
  }),
  
  // Carga masiva desde CSV
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest('/participantes/bulk-upload', {
      method: 'POST',
      headers: {
        // No establecer Content-Type para FormData
      },
      body: formData,
    });
  },
  
  // Exportar lista de participantes
  export: (format = 'excel') => apiRequest(`/participantes/export?format=${format}`),
};

// Servicios de Evaluaciones
export const evaluacionesService = {
  // Obtener todas las evaluaciones
  getAll: () => apiRequest('/evaluaciones'),
  
  // Obtener evaluaciones por participante
  getByParticipante: (participanteId) => apiRequest(`/evaluaciones/participante/${participanteId}`),
  
  // Crear nueva evaluación
  create: (data) => apiRequest('/evaluaciones', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Actualizar evaluación
  update: (id, data) => apiRequest(`/evaluaciones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Obtener evaluaciones pendientes
  getPendientes: () => apiRequest('/evaluaciones/pendientes'),
  
  // Marcar evaluación como completada
  completar: (id) => apiRequest(`/evaluaciones/${id}/completar`, {
    method: 'PATCH',
  }),
};

// Servicios de Resultados
export const resultadosService = {
  // Obtener todos los resultados
  getAll: () => apiRequest('/resultados'),
  
  // Obtener resultados por área
  getByArea: (area) => apiRequest(`/resultados/area/${area}`),
  
  // Obtener resultados por nivel
  getByNivel: (nivel) => apiRequest(`/resultados/nivel/${nivel}`),
  
  // Obtener medallero
  getMedallero: () => apiRequest('/resultados/medallero'),
  
  // Exportar resultados
  export: (format = 'excel', filtros = {}) => {
    const params = new URLSearchParams(filtros);
    return apiRequest(`/resultados/export?format=${format}&${params}`);
  },
  
  // Generar reportes
  generarReporte: (tipo, parametros = {}) => apiRequest('/resultados/reportes', {
    method: 'POST',
    body: JSON.stringify({ tipo, parametros }),
  }),
};

// Servicios de Usuarios
export const usuariosService = {
  // Obtener todos los usuarios
  getAll: () => apiRequest('/usuarios'),
  
  // Obtener usuario por ID
  getById: (id) => apiRequest(`/usuarios/${id}`),
  
  // Crear nuevo usuario
  create: (data) => apiRequest('/usuarios', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Actualizar usuario
  update: (id, data) => apiRequest(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Eliminar usuario
  delete: (id) => apiRequest(`/usuarios/${id}`, {
    method: 'DELETE',
  }),
  
  // Cambiar estado de usuario
  toggleEstado: (id) => apiRequest(`/usuarios/${id}/toggle-estado`, {
    method: 'PATCH',
  }),
};

// Servicios de Autenticación
export const authService = {
  // Iniciar sesión
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  // Cerrar sesión
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
  
  // Obtener usuario actual
  getCurrentUser: () => apiRequest('/auth/me'),
  
  // Refrescar token
  refreshToken: () => apiRequest('/auth/refresh', {
    method: 'POST',
  }),
};

// Servicios de Configuración
export const configService = {
  // Obtener configuración del sistema
  get: () => apiRequest('/config'),
  
  // Actualizar configuración
  update: (data) => apiRequest('/config', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Obtener configuración del medallero
  getMedallero: () => apiRequest('/config/medallero'),
  
  // Actualizar configuración del medallero
  updateMedallero: (data) => apiRequest('/config/medallero', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Servicios de Logs
export const logsService = {
  // Obtener logs de actividad
  getActivityLogs: (filtros = {}) => {
    const params = new URLSearchParams(filtros);
    return apiRequest(`/logs/activity?${params}`);
  },
  
  // Obtener logs de cambios en notas
  getNotasLogs: (filtros = {}) => {
    const params = new URLSearchParams(filtros);
    return apiRequest(`/logs/notas?${params}`);
  },
};

// Servicios de Estadísticas
export const estadisticasService = {
  // Obtener estadísticas generales
  getGenerales: () => apiRequest('/estadisticas/generales'),
  
  // Obtener estadísticas por área
  getByArea: (area) => apiRequest(`/estadisticas/area/${area}`),
  
  // Obtener estadísticas de evaluaciones
  getEvaluaciones: () => apiRequest('/estadisticas/evaluaciones'),
  
  // Obtener estadísticas de medallero
  getMedallero: () => apiRequest('/estadisticas/medallero'),
};

// Mock data para desarrollo (cuando no hay backend)
export const mockData = {
  participantes: [
    {
      id: 1,
      nombreCompleto: 'Ana García López',
      documento: '12345678',
      contacto: 'ana.garcia@email.com',
      unidadEducativa: 'Colegio San José',
      departamento: 'La Paz',
      grado: '5° de Secundaria',
      areaCompetencia: 'Matemáticas',
      nivelCompetencia: 'Intermedio',
      tutorAcademico: 'Dr. María González',
      fechaRegistro: '2024-01-15',
      estado: 'Registrado',
      codigo: 'OH123456'
    }
  ],
  
  evaluadores: [
    {
      id: 1,
      nombre: 'Dr. María González',
      email: 'maria.gonzalez@umss.edu.bo',
      telefono: '70123456',
      area: 'Matemáticas',
      especialidad: 'Álgebra Superior',
      experiencia: '15 años',
      estado: 'Activo'
    }
  ],
  
  resultados: [
    {
      id: 1,
      participanteId: 1,
      area: 'Matemáticas',
      nivel: 'Intermedio',
      nota: 95.5,
      clasificacion: 'Clasificado',
      posicion: 1,
      medalla: 'Oro',
      evaluador: 'Dr. María González',
      observaciones: 'Excelente desempeño en álgebra y geometría',
      fechaEvaluacion: '2024-01-20'
    }
  ]
};

export default {
  participantesService,
  evaluacionesService,
  resultadosService,
  usuariosService,
  authService,
  configService,
  logsService,
  estadisticasService,
  mockData
};


