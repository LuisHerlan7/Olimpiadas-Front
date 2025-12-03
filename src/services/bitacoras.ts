import { api } from "../api";

export type BitacoraEntry = {
  id: number;
  actor_email: string;
  actor_tipo: string;
  mensaje: string;
  created_at: string;
  hora?: string;
  fecha?: string;
};

export type BitacoraPagination = {
  data: BitacoraEntry[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type BitacoraFilters = {
  page?: number;
  per_page?: number;
  actor_email?: string;
  actor_tipo?: string;
};

export async function fetchBitacoras(params: BitacoraFilters = {}): Promise<BitacoraPagination> {
  const { data } = await api.get<BitacoraPagination>("/admin/bitacoras", { params });
  return data;
}

