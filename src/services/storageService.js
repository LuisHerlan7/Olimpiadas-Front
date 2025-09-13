// Servicio de almacenamiento local para el Sistema de Olimpiadas Oh! SanSi
// Maneja el almacenamiento en localStorage y sessionStorage

const STORAGE_KEYS = {
  USER_DATA: 'oh_sansi_user_data',
  USER_PREFERENCES: 'oh_sansi_user_preferences',
  FORM_DATA: 'oh_sansi_form_data',
  FILTERS: 'oh_sansi_filters',
  THEME: 'oh_sansi_theme',
  LANGUAGE: 'oh_sansi_language'
};

// Función helper para manejar errores de localStorage
const safeStorageOperation = (operation) => {
  try {
    return operation();
  } catch (error) {
    console.warn('Storage operation failed:', error);
    return null;
  }
};

// Servicio de localStorage
export const localStorageService = {
  // Guardar datos
  setItem: (key, value) => {
    return safeStorageOperation(() => {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    });
  },

  // Obtener datos
  getItem: (key, defaultValue = null) => {
    return safeStorageOperation(() => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    }) || defaultValue;
  },

  // Eliminar datos
  removeItem: (key) => {
    return safeStorageOperation(() => {
      localStorage.removeItem(key);
      return true;
    });
  },

  // Limpiar todo el localStorage
  clear: () => {
    return safeStorageOperation(() => {
      localStorage.clear();
      return true;
    });
  },

  // Verificar si existe una clave
  hasItem: (key) => {
    return safeStorageOperation(() => {
      return localStorage.getItem(key) !== null;
    }) || false;
  }
};

// Servicio de sessionStorage
export const sessionStorageService = {
  // Guardar datos
  setItem: (key, value) => {
    return safeStorageOperation(() => {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    });
  },

  // Obtener datos
  getItem: (key, defaultValue = null) => {
    return safeStorageOperation(() => {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    }) || defaultValue;
  },

  // Eliminar datos
  removeItem: (key) => {
    return safeStorageOperation(() => {
      sessionStorage.removeItem(key);
      return true;
    });
  },

  // Limpiar todo el sessionStorage
  clear: () => {
    return safeStorageOperation(() => {
      sessionStorage.clear();
      return true;
    });
  }
};

// Servicio específico para datos de usuario
export const userDataService = {
  // Guardar datos del usuario
  saveUserData: (userData) => {
    return localStorageService.setItem(STORAGE_KEYS.USER_DATA, userData);
  },

  // Obtener datos del usuario
  getUserData: () => {
    return localStorageService.getItem(STORAGE_KEYS.USER_DATA);
  },

  // Eliminar datos del usuario
  clearUserData: () => {
    return localStorageService.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // Verificar si hay datos de usuario
  hasUserData: () => {
    return localStorageService.hasItem(STORAGE_KEYS.USER_DATA);
  }
};

// Servicio para preferencias del usuario
export const preferencesService = {
  // Guardar preferencias
  savePreferences: (preferences) => {
    return localStorageService.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  // Obtener preferencias
  getPreferences: () => {
    return localStorageService.getItem(STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'light',
      language: 'es',
      notifications: true,
      autoSave: true
    });
  },

  // Actualizar una preferencia específica
  updatePreference: (key, value) => {
    const preferences = preferencesService.getPreferences();
    preferences[key] = value;
    return preferencesService.savePreferences(preferences);
  },

  // Obtener tema
  getTheme: () => {
    return preferencesService.getPreferences().theme;
  },

  // Establecer tema
  setTheme: (theme) => {
    return preferencesService.updatePreference('theme', theme);
  },

  // Obtener idioma
  getLanguage: () => {
    return preferencesService.getPreferences().language;
  },

  // Establecer idioma
  setLanguage: (language) => {
    return preferencesService.updatePreference('language', language);
  }
};

// Servicio para datos de formularios
export const formDataService = {
  // Guardar datos de formulario
  saveFormData: (formName, data) => {
    const key = `${STORAGE_KEYS.FORM_DATA}_${formName}`;
    return localStorageService.setItem(key, {
      data,
      timestamp: Date.now()
    });
  },

  // Obtener datos de formulario
  getFormData: (formName) => {
    const key = `${STORAGE_KEYS.FORM_DATA}_${formName}`;
    const stored = localStorageService.getItem(key);
    
    if (stored && stored.timestamp) {
      // Verificar si los datos no son muy antiguos (24 horas)
      const maxAge = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
      if (Date.now() - stored.timestamp < maxAge) {
        return stored.data;
      } else {
        // Eliminar datos antiguos
        formDataService.clearFormData(formName);
      }
    }
    
    return null;
  },

  // Limpiar datos de formulario
  clearFormData: (formName) => {
    const key = `${STORAGE_KEYS.FORM_DATA}_${formName}`;
    return localStorageService.removeItem(key);
  },

  // Limpiar todos los datos de formularios
  clearAllFormData: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_KEYS.FORM_DATA)) {
        localStorageService.removeItem(key);
      }
    });
  }
};

// Servicio para filtros
export const filtersService = {
  // Guardar filtros
  saveFilters: (pageName, filters) => {
    const key = `${STORAGE_KEYS.FILTERS}_${pageName}`;
    return localStorageService.setItem(key, filters);
  },

  // Obtener filtros
  getFilters: (pageName, defaultFilters = {}) => {
    const key = `${STORAGE_KEYS.FILTERS}_${pageName}`;
    return localStorageService.getItem(key, defaultFilters);
  },

  // Limpiar filtros
  clearFilters: (pageName) => {
    const key = `${STORAGE_KEYS.FILTERS}_${pageName}`;
    return localStorageService.removeItem(key);
  }
};

// Servicio para cache de datos
export const cacheService = {
  // Guardar en cache
  set: (key, data, ttl = 300000) => { // TTL por defecto: 5 minutos
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    return sessionStorageService.setItem(`cache_${key}`, cacheData);
  },

  // Obtener del cache
  get: (key) => {
    const cacheData = sessionStorageService.getItem(`cache_${key}`);
    
    if (cacheData && cacheData.timestamp && cacheData.ttl) {
      // Verificar si el cache no ha expirado
      if (Date.now() - cacheData.timestamp < cacheData.ttl) {
        return cacheData.data;
      } else {
        // Eliminar cache expirado
        cacheService.remove(key);
      }
    }
    
    return null;
  },

  // Eliminar del cache
  remove: (key) => {
    return sessionStorageService.removeItem(`cache_${key}`);
  },

  // Limpiar todo el cache
  clear: () => {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        sessionStorageService.removeItem(key);
      }
    });
  },

  // Verificar si existe en cache
  has: (key) => {
    return cacheService.get(key) !== null;
  }
};

// Servicio para exportar/importar datos
export const dataService = {
  // Exportar datos a JSON
  exportToJSON: (data, filename = 'data') => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      return { success: true, message: 'Datos exportados exitosamente' };
    } catch (error) {
      console.error('Error al exportar datos:', error);
      return { success: false, message: 'Error al exportar datos' };
    }
  },

  // Importar datos desde JSON
  importFromJSON: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve({ success: true, data });
        } catch (error) {
          reject({ success: false, message: 'Error al parsear el archivo JSON' });
        }
      };
      
      reader.onerror = () => {
        reject({ success: false, message: 'Error al leer el archivo' });
      };
      
      reader.readAsText(file);
    });
  }
};

// Función para limpiar todos los datos del sistema
export const clearAllData = () => {
  localStorageService.clear();
  sessionStorageService.clear();
  return { success: true, message: 'Todos los datos han sido eliminados' };
};

// Función para obtener información del almacenamiento
export const getStorageInfo = () => {
  const localStorageSize = JSON.stringify(localStorage).length;
  const sessionStorageSize = JSON.stringify(sessionStorage).length;
  
  return {
    localStorage: {
      size: localStorageSize,
      sizeFormatted: `${(localStorageSize / 1024).toFixed(2)} KB`,
      items: localStorage.length
    },
    sessionStorage: {
      size: sessionStorageSize,
      sizeFormatted: `${(sessionStorageSize / 1024).toFixed(2)} KB`,
      items: sessionStorage.length
    }
  };
};

export default {
  localStorageService,
  sessionStorageService,
  userDataService,
  preferencesService,
  formDataService,
  filtersService,
  cacheService,
  dataService,
  clearAllData,
  getStorageInfo
};


