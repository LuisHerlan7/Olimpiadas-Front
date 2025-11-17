// Servicio para gestionar las fases del proceso
import { api } from "../api";

export type FaseInscripcion = {
  id?: number;
  activa: boolean;
  fecha_inicio?: string;
  fecha_fin?: string;
  mensaje?: string;
  cancelada?: boolean;
};

export type UpdateFaseInscripcionPayload = {
  fecha_inicio?: string;
  fecha_fin?: string;
  activa?: boolean;
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

