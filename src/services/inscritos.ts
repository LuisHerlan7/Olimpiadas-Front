import { api } from "../api";

// Definimos los tipos para el manejo de errores y resumen de la importación
export type ImportError = { row: number; cause: string };
export type ImportSummary = {
  total: number;
  inserted: number;
  rejected: number;
  errors: ImportError[];
  log?: string;
};

// Función común para manejar tanto la simulación como la importación real
async function importInscritos(
  file: File,
  noDuplicateKey: boolean,
  simulate: boolean
): Promise<ImportSummary> {
  // Se prepara el FormData con el archivo y los parámetros
  const fd = new FormData();
  fd.append("file", file);
  fd.append("simulate", simulate ? "true" : "false");  // Si es simulación, pasamos "true"
  fd.append("no_duplicate_key", noDuplicateKey ? "1" : "0"); // No duplicar claves

  // Realizamos la solicitud POST al backend
  const { data } = await api.post<ImportSummary>("/inscritos/import", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data; // Devolvemos el resumen de la importación
}

// Función de simulación: establece simulate=true
export async function simulateImportInscritos(
  file: File,
  noDuplicateKey: boolean
): Promise<ImportSummary> {
  return importInscritos(file, noDuplicateKey, true); // Llamamos con simulate=true
}

// Función para realizar la importación real: establece simulate=false
export async function commitImportInscritos(
  file: File,
  noDuplicateKey: boolean
): Promise<ImportSummary> {
  return importInscritos(file, noDuplicateKey, false); // Llamamos con simulate=false
}

// ============================================================
// Crear inscrito manualmente
// ============================================================

export type CreateInscritoPayload = {
  documento: string;
  nombres: string;
  apellidos: string;
  unidad?: string;
  area: string;
  nivel: string;
  area_id?: number | null;
  nivel_id?: number | null;
};

export type InscritoResponse = {
  message: string;
  data: {
    id: number;
    documento: string;
    nombres: string;
    apellidos: string;
    unidad: string;
    area: string;
    nivel: string;
    area_id: number | null;
    nivel_id: number | null;
    created_at: string;
    updated_at: string;
  };
};

export async function createInscrito(payload: CreateInscritoPayload): Promise<InscritoResponse> {
  const { data } = await api.post<InscritoResponse>("/inscritos", payload);
  return data;
}

export async function deleteInscrito(id: number): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/inscritos/${id}`);
  return data;
}