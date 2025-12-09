// Servicio para gestionar las fases del proceso
import { api } from "../api";

export type FaseInscripcion = {
  id?: number;
  activa: boolean;
  fecha_inicio?: string;
  fecha_fin?: string;
  mensaje?: string;
  cancelada?: boolean;
  nota_minima_suficiente?: number;
};

export type UpdateFaseInscripcionPayload = {
  fecha_inicio?: string;
  fecha_fin?: string;
  activa?: boolean;
  nota_minima_suficiente?: number;
};

// Obtener el estado de la fase de inscripción desde el backend
export async function getFaseInscripcion(): Promise<FaseInscripcion> {
  try {
    const { data } = await api.get<FaseInscripcion>("/fases/inscripcion");
    return data;
  } catch (error) {
    console.warn("Endpoint de fases no disponible, usando configuración por defecto");
    return {
      activa: false,
      mensaje: "Fase de inscripción no configurada",
    };
  }
}

// Actualizar la fase de inscripción
export async function updateFaseInscripcion(payload: UpdateFaseInscripcionPayload): Promise<FaseInscripcion> {
  const { data } = await api.put<{ message: string; data: FaseInscripcion }>("/fases/inscripcion", payload);
  return data.data;
}

// Cancelar la fase de inscripción
export async function cancelarFaseInscripcion(): Promise<FaseInscripcion> {
  const { data } = await api.post<{ message: string; data: FaseInscripcion }>("/fases/inscripcion/cancelar");
  return data.data;
}

// Verificar si la fase de inscripción está activa
export async function isFaseInscripcionActiva(): Promise<boolean> {
  const fase = await getFaseInscripcion();
  return fase.activa;
}

// Obtener el estado de la fase de asignación (subida de notas)
export async function getFaseAsignacion(): Promise<FaseInscripcion> {
  try {
    const { data } = await api.get<FaseInscripcion>("/fases/asignacion");
    return data;
  } catch (error) {
    console.warn("Endpoint de fase de asignación no disponible");
    return {
      activa: false,
      mensaje: "Fase de asignación no configurada",
    };
  }
}

// Actualizar la fase de asignación
export async function updateFaseAsignacion(payload: UpdateFaseInscripcionPayload): Promise<FaseInscripcion> {
  const { data } = await api.put<{ message: string; data: FaseInscripcion }>("/fases/asignacion", payload);
  return data.data;
}

// Cancelar la fase de asignación
export async function cancelarFaseAsignacion(): Promise<FaseInscripcion> {
  const { data } = await api.post<{ message: string; data: FaseInscripcion }>("/fases/asignacion/cancelar");
  return data.data;
}

// Verificar si la fase de asignación está activa
export async function isFaseAsignacionActiva(): Promise<boolean> {
  const fase = await getFaseAsignacion();
  return fase.activa;
}

// Obtener el estado de la fase de clasificados
export async function getFaseClasificados(): Promise<FaseInscripcion> {
  try {
    const { data } = await api.get<FaseInscripcion>("/fases/clasificados");
    return data;
  } catch (error) {
    console.warn("Endpoint de fase de clasificados no disponible");
    return {
      activa: false,
      mensaje: "Fase de clasificados no configurada",
      nota_minima_suficiente: 70,
    };
  }
}

// Actualizar la fase de clasificados
export async function updateFaseClasificados(payload: UpdateFaseInscripcionPayload): Promise<FaseInscripcion> {
  const { data } = await api.put<{ message: string; data: FaseInscripcion }>("/fases/clasificados", payload);
  return data.data;
}

// Cancelar la fase de clasificados
export async function cancelarFaseClasificados(): Promise<FaseInscripcion> {
  const { data } = await api.post<{ message: string; data: FaseInscripcion }>("/fases/clasificados/cancelar");
  return data.data;
}

// Verificar si la fase de clasificados está activa (dentro del período)
export async function isFaseClasificadosActiva(): Promise<boolean> {
  const fase = await getFaseClasificados();
  if (!fase.activa) return false;
  
  const ahora = new Date();
  if (fase.fecha_inicio) {
    const inicio = new Date(fase.fecha_inicio);
    if (ahora < inicio) return false;
  }
  if (fase.fecha_fin) {
    const fin = new Date(fase.fecha_fin);
    if (ahora > fin) return false;
  }
  
  return true;
}
