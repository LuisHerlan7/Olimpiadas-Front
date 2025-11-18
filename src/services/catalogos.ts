// src/services/catalogos.ts
import { api } from "../api";
import { listAreas } from "./areas";

export type Area = { id: number; nombre: string; activo?: boolean };
export type Nivel = { id: number; nombre: string };

const NIVEL_FALLBACK: Nivel[] = [
  { id: 1, nombre: "Principiante" },
  { id: 2, nombre: "Intermedio" },
  { id: 3, nombre: "Avanzado" },
];

export async function fetchAreas(): Promise<Area[]> {
  try {
    // Reutilizamos el servicio de areas (devuelve [] si falla)
    const arr = await listAreas({ per_page: 1000 });
    return (arr as Area[]).filter(Boolean);
  } catch {
    return [];
  }
}

export async function fetchNiveles(): Promise<Nivel[]> {
  try {
    const { data } = await api.get("/niveles", { params: { per_page: 1000 } });
    const arr = Array.isArray(data) ? data : (data?.data ?? []);
    const list = (arr as Nivel[]).filter(Boolean);
    return list.length ? list : NIVEL_FALLBACK;
  } catch {
    // Fallback fijo si no hay endpoint
    return NIVEL_FALLBACK;
  }
}
