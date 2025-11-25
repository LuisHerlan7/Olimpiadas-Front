import { api } from "../api";

export type Area = {
  id?: number;
  nombre: string;
  codigo?: string;
  descripcion?: string | null;
  activo?: boolean;
};

export async function listAreas(params?: Record<string, unknown>) {
  const { data } = await api.get("/areas", { params });
  const arr = Array.isArray(data) ? data : data?.data ?? [];
  return arr as Area[];
}

export async function getArea(id: string | number) {
  const { data } = await api.get(`/areas/${id}`);
  return data as Area;
}

export async function createArea(payload: Area) {
  const { data } = await api.post(`/areas`, payload);
  return data as Area;
}

export async function updateArea(id: string | number, payload: Area) {
  const { data } = await api.put(`/areas/${id}`, payload);
  return data as Area;
}

export async function deleteArea(id: string | number) {
  await api.delete(`/areas/${id}`);
}

export default {
  listAreas,
  getArea,
  createArea,
  updateArea,
  deleteArea,
};