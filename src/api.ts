// src/api.ts
import axios, { AxiosError, AxiosHeaders } from "axios";

/**
 * Axios para OhSansi (API JSON con Bearer)
 * - baseURL: VITE_API_URL o '/api'
 * - Siempre Accept: application/json
 * - Bearer token desde localStorage en cada request
 * - Manejo de 401/403/419 y respuestas HTML (redir a /login del SPA)
 * - Patch: NO patear al login por errores de /responsable/fase-final/*
 */

// Validar y normalizar la URL del backend
const getBaseURL = (): string => {
  const envURL = import.meta.env.VITE_API_URL;
  
  // Si no hay VITE_API_URL, usar ruta relativa (proxy en dev)
  if (!envURL) {
    if (import.meta.env.PROD) {
      console.error("❌ ERROR: VITE_API_URL no está configurada en producción!");
      console.error("🔧 Ve a Vercel → Settings → Environment Variables");
      console.error("🔧 Agrega: VITE_API_URL = https://olimpiadas-back-production-6956.up.railway.app/api");
    }
    return "/api";
  }
  
  // Asegurar que la URL esté completa y bien formada
  let url = String(envURL).trim();
  
  // Validar que la URL no esté truncada o incompleta
  if (url.length < 10) {
    console.error("❌ ERROR: VITE_API_URL parece estar incompleta:", url);
    console.error("🔧 Verifica en Vercel que la URL esté completa");
    return "/api"; // Fallback a relativa
  }
  
  // Si no empieza con http:// o https://, agregar https://
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  
  // Eliminar barra final si existe (excepto si es solo "/")
  if (url.endsWith("/") && url.length > 1) {
    url = url.slice(0, -1);
  }
  
  // Validar formato básico de URL
  try {
    new URL(url); // Esto lanzará error si la URL es inválida
  } catch (e) {
    console.error("❌ ERROR: VITE_API_URL tiene formato inválido:", url);
    console.error("🔧 Verifica en Vercel que la URL sea correcta");
    return "/api"; // Fallback a relativa
  }
  
  // Log para debug (siempre, no solo en dev)
  console.log("🔧 API Base URL configurada:", url);
  console.log("🔧 VITE_API_URL desde env:", envURL);
  
  return url;
};

export const baseURL = getBaseURL();

export const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
  },
});

// ====== Claves de storage ======
const TOKEN_KEY = "ohsansi_token";
const USER_KEY = "usuario";
const AUTH_KIND_KEY = "auth_kind"; // "admin" | "responsable" | "evaluador"

// ====== Helpers token ======
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token?: string): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common.Authorization;
  }
}

/** Limpia toda la sesión local (token, usuario y tipo de sesión) */
function hardClearSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(AUTH_KIND_KEY);
    delete api.defaults.headers.common.Authorization;
  } catch {
    // no-op
  }
}

// Cargar token al iniciar (si existe)
const saved = getToken();
if (saved) {
  api.defaults.headers.common.Authorization = `Bearer ${saved}`;
}

// ====== Interceptor de REQUEST ======
api.interceptors.request.use((config) => {
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

  // Token
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  // Accept
  headers.set("Accept", "application/json");

  // Content-Type (solo si no es FormData)
  const isFormData =
    config.data &&
    typeof FormData !== "undefined" &&
    config.data instanceof FormData;

  if (!isFormData) {
    const method = (config.method || "").toLowerCase();
    if (["post", "put", "patch"].includes(method) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  config.headers = headers;
  return config;
});

// ====== Interceptor de RESPONSE ======
type ValidationErrors = Record<string, string[]>;
type ValidationErrorShape = {
  status: 422;
  message?: string;
  errors?: ValidationErrors;
};

// ✅ Rutas seguras que NO deben patear la sesión si dan 401/403/419
const SAFE_NO_LOGOUT_REGEX = /^\/responsable\/fase-final\//; // <— SOLO FASE FINAL

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const res = error?.response;
    const status = res?.status;
    const reqUrl = String(error?.config?.url || "");

    // Log útil para depurar
    const fullURL = error?.config?.baseURL 
      ? `${error.config.baseURL}${error?.config?.url || ""}` 
      : error?.config?.url;
    
    console.error("API ERROR", {
      baseURL: error?.config?.baseURL,
      url: error?.config?.url,
      fullURL: fullURL,
      method: error?.config?.method,
      status: res?.status,
      errorCode: error?.code,
      errorMessage: error?.message,
      headers: res?.headers,
      data: res?.data,
    });
    
    // Si es un error de red (ERR_NAME_NOT_RESOLVED, ERR_FAILED, etc.)
    if (error?.code === "ERR_NAME_NOT_RESOLVED" || error?.code === "ERR_FAILED") {
      console.error("❌ Error de conexión. Verifica que VITE_API_URL esté configurado correctamente en Vercel.");
      console.error("🔧 URL configurada:", baseURL);
      console.error("🔧 VITE_API_URL desde env:", import.meta.env.VITE_API_URL);
    }

    if (!res) return Promise.reject(error);

    // 🚫 Evitar limpiar sesión en rutas de autenticación (handshake)
    const isHandshake =
      /\/auth\/login$/.test(reqUrl) ||
      /\/auth\/perfil$/.test(reqUrl) ||
      /\/responsable\/perfil$/.test(reqUrl) ||
      /\/evaluador\/perfil$/.test(reqUrl);

    // 🚫 Evitar patear si el error proviene de Fase Final (solo este módulo)
    const isSafeNoLogout = SAFE_NO_LOGOUT_REGEX.test(reqUrl);

    // HTML/Unauthorized → limpiar sesión (excepto en rutas seguras o handshake)
    const data = res.data as unknown;
    const isHtml =
      typeof data === "string" &&
      (data.toLowerCase().includes("<!doctype html") ||
        data.toLowerCase().includes("<html") ||
        data.includes("Unauthorized."));

    // 401/419 → cerrar sesión (token inválido/expirado)
    // 403 → NO cerrar sesión (solo rol insuficiente, mostrar error)
    if ((status === 401 || status === 419 || isHtml) && !isHandshake && !isSafeNoLogout) {
      hardClearSession();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    // 403 se maneja en el componente, no cerramos sesión

    // 🎯 Si es 422, devolvemos un objeto tipado con mensajes de validación
    if (status === 422) {
      const payload = res.data as { message?: string; errors?: ValidationErrors } | undefined;
      
      // Construir mensaje de error más descriptivo
      let errorMessage = payload?.message || "Error de validación";
      
      // Si hay errores específicos, agregarlos al mensaje
      if (payload?.errors) {
        const errorDetails = Object.entries(payload.errors)
          .map(([field, messages]) => {
            const fieldName = field === "correo" ? "correo electrónico" : field;
            return `${fieldName}: ${messages.join(", ")}`;
          })
          .join("; ");
        
        if (errorDetails) {
          errorMessage = `${errorMessage}. ${errorDetails}`;
        }
      }
      
      console.error("❌ Error de validación (422):", {
        message: errorMessage,
        errors: payload?.errors,
        requestData: error?.config?.data,
      });
      
      const vErr: ValidationErrorShape = {
        status: 422,
        message: errorMessage,
        errors: payload?.errors,
      };
      return Promise.reject(vErr);
    }

    return Promise.reject(error);
  }
);
