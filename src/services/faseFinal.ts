// src/services/faseFinal.ts
import { api } from "../api";

export type FinalistaRow = {
  id: number;
  inscrito: {
    id: number;
    apellidos: string;
    nombres: string;
    area_id: number | null;
    nivel_id: number | null;
  } | null;
  area_id: number | null;
  nivel_id: number | null;
  habilitado_at: string;
  origen_hash: string;
};

export type SnapshotRow = {
  id: number;
  origen: string; // 'FILTRO'
  origen_hash: string;
  responsable_id: number;
  payload: {
    meta: { area_id?: number | null; nivel_id?: number | null };
    total: number;
    ids: number[];
  };
  creado_at: string;
};

export type Page<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type PromoteParams = {
  area_id?: number;
  nivel_id?: number;
};

type ListParams = {
  page?: number;
  area_id?: number | "";
  nivel_id?: number | "";
};

type PromoteResponse = {
  message: string;
  total?: number;
  origen?: string;
  snapshot?: SnapshotRow;
};

export async function promoverPorFiltro(params: PromoteParams): Promise<PromoteResponse> {
  const payload: Record<string, number> = {};
  if (typeof params.area_id === "number") payload.area_id = params.area_id;
  if (typeof params.nivel_id === "number") payload.nivel_id = params.nivel_id;

  const { data } = await api.post<PromoteResponse>("/responsable/fase-final/promover-por-filtro", payload);
  return data;
}

export async function listarFinalistas(params: ListParams): Promise<Page<FinalistaRow>> {
  const query: Record<string, number> = {};
  const page = typeof params.page === "number" ? params.page : 1;
  query.page = page;

  if (typeof params.area_id === "number") query.area_id = params.area_id;
  if (typeof params.nivel_id === "number") query.nivel_id = params.nivel_id;

  const { data } = await api.get<Page<FinalistaRow>>("/responsable/fase-final/listado", { params: query });
  return data;
}

export async function listarSnapshots(page = 1): Promise<Page<SnapshotRow>> {
  const { data } = await api.get<Page<SnapshotRow>>("/responsable/fase-final/snapshots", { params: { page } });
  return data;
}

// ============================================================
// Funciones para Evaluador (Fase Final)
// ============================================================

export type AsignadaFinal = {
  id: number;
  inscrito: {
    id: number;
    apellidos: string;
    nombres: string;
    area_id: number | null;
    nivel_id: number | null;
  } | null;
  area_id: number | null;
  nivel_id: number | null;
  habilitado_at: string;
  estado: "EN_EDICION" | "FINALIZADA";
  nota_final: number | null;
  notas: Record<string, unknown> | null;
};

export async function listarFinalAsignadas(page = 1): Promise<Page<AsignadaFinal>> {
  const { data } = await api.get<Page<AsignadaFinal>>("/evaluador/final/asignadas", { params: { page } });
  return data;
}

export async function guardarFinal(
  finalistaId: number,
  payload: {
    nota_final: number;
    notas: Record<string, unknown>;
    concepto?: string;
  }
): Promise<{ message: string; data: unknown }> {
  const { data } = await api.post<{ message: string; data: unknown }>(
    `/evaluador/final/${finalistaId}/guardar`,
    payload
  );
  return data;
}

export async function finalizarFinal(finalistaId: number): Promise<{ message: string; data: unknown }> {
  const { data } = await api.post<{ message: string; data: unknown }>(
    `/evaluador/final/${finalistaId}/finalizar`
  );
  return data;
}