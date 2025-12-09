import  { useEffect, useState } from "react";

import { api } from "../../api";
import * as XLSX from "xlsx";

interface Competidor {
  id: number;
  documento: string;
  nombres: string;
  apellidos: string;
  unidad: string;
  area: string;
  nivel: string;
}

interface EditFormData {
  documento: string;
  nombres: string;
  apellidos: string;
  unidad: string;
  area: string;
  nivel: string;
  area_id?: number | null;
  nivel_id?: number | null;
}

type Filtros = {
  area: string;
  nivel: string;
  unidad: string;
};

type OpcionesFiltros = {
  areas: string[];
  niveles: string[];
  unidades: string[]; // si no lo quieres, elimínalo
};

export default function CompetidoresList() {
  const [lista, setLista] = useState<Competidor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [filtros, setFiltros] = useState<Filtros>({
    area: "",
    nivel: "",
    unidad: "",
  });

  const [opciones, setOpciones] = useState<OpcionesFiltros>({
    areas: [],
    niveles: [],
    unidades: [],
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<EditFormData>({
    documento: "",
    nombres: "",
    apellidos: "",
    unidad: "",
    area: "",
    nivel: "",
    area_id: null,
    nivel_id: null,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 1) Cargar opciones de filtros (independientes de la lista)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get<OpcionesFiltros>("/responsable/opciones-filtros", {
          params: { scope: "all" }, // o "mine" si quieres acotar al responsable
        });
        if (!alive) return;
        setOpciones({
          areas: data.areas ?? [],
          niveles: data.niveles ?? [],
          unidades: data.unidades ?? [],
        });
      } catch (err) {
        console.error("No se pudieron cargar opciones de filtros:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 2) Cargar lista cuando cambian filtros
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/responsable/lista-competidores", {
  params: {
    ...(filtros.area ? { area: filtros.area } : {}),
    ...(filtros.nivel ? { nivel: filtros.nivel } : {}),
    ...(filtros.unidad ? { unidad: filtros.unidad } : {}),
  },
});

const payload = res.data as unknown;

// Si el backend devuelve un array directamente
if (Array.isArray(payload)) {
  setLista(payload as Competidor[]);
}
// Si devuelve un objeto con propiedad data
else if (payload && typeof payload === "object" && "data" in payload) {
  setLista((payload as { data: Competidor[] }).data);
} else {
  setLista([]);
}

    } catch (err) {
      console.error("Error al cargar lista:", err);
      setLista([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, [filtros.area, filtros.nivel, filtros.unidad]);

  // Exportaciones
    // 📝 Abrir modal de edición
    const abrirModalEditar = (competidor: Competidor) => {
      setEditingId(competidor.id);
      setFormData({
        documento: competidor.documento,
        nombres: competidor.nombres,
        apellidos: competidor.apellidos,
        unidad: competidor.unidad,
        area: competidor.area,
        nivel: competidor.nivel,
        area_id: null,
        nivel_id: null,
      });
      setFormErrors({});
      setShowModal(true);
    };

    // 🔒 Cerrar modal
    const cerrarModal = () => {
      setShowModal(false);
      setEditingId(null);
      setFormData({
        documento: "",
        nombres: "",
        apellidos: "",
        unidad: "",
        area: "",
        nivel: "",
        area_id: null,
        nivel_id: null,
      });
      setFormErrors({});
    };

    // 💾 Guardar cambios
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormErrors({});
      setSaving(true);

      try {
        const errors: Record<string, string> = {};
        if (!formData.documento.trim() || !/^\d{5,}$/.test(formData.documento)) {
          errors.documento = "Documento debe tener al menos 5 dígitos";
        }
        if (!formData.nombres.trim()) {
          errors.nombres = "Nombres es requerido";
        }
        if (!formData.apellidos.trim()) {
          errors.apellidos = "Apellidos es requerido";
        }
        if (!formData.area.trim()) {
          errors.area = "Área es requerida";
        }
        if (!formData.nivel.trim()) {
          errors.nivel = "Nivel es requerido";
        }

        if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          setSaving(false);
          return;
        }

        if (editingId) {
          await api.put(`/inscritos/${editingId}`, formData);
          await cargarDatos();
          cerrarModal();
          alert("Competidor actualizado exitosamente");
        }
      } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "response" in error) {
          const axiosError = error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
          const errorData = axiosError.response?.data;
          if (errorData?.errors) {
            const normalizedErrors: Record<string, string> = {};
            Object.entries(errorData.errors).forEach(([key, messages]) => {
              normalizedErrors[key] = Array.isArray(messages) ? messages[0] : String(messages);
            });
            setFormErrors(normalizedErrors);
          } else {
            alert(errorData?.message || "Error al actualizar el competidor");
          }
        } else {
          alert("Error al actualizar el competidor");
        }
      } finally {
        setSaving(false);
      }
    };

  const exportarCSV = () => {
    if (!lista.length) return;
    const header = Object.keys(lista[0]) as (keyof Competidor)[];
    const rows = lista.map((i) => header.map((h) => String(i[h] ?? "")).join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "competidores.csv";
    a.click();
  };

  const exportarExcel = () => {
    if (!lista.length) return;
    const hoja = XLSX.utils.json_to_sheet(lista);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, hoja, "Competidores");
    XLSX.writeFile(wb, "competidores.xlsx");
  };

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">🧾 Lista de Competidores – Panel Responsable</h1>
          <a
            href="/responsable/panel"
            className="rounded-xl bg-slate-800 border border-white/10 px-4 py-2 text-sm hover:border-cyan-400/40"
          >
            ← Volver al panel
          </a>
        </div>

        {/* Filtros */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm mb-1 text-slate-300">Área</label>
            <select
              className="w-full rounded-xl bg-slate-800 border border-white/10 px-3 py-2"
              value={filtros.area}
              onChange={(e) => setFiltros((f) => ({ ...f, area: e.target.value }))}
            >
              <option value="">(Todas)</option>
              {opciones.areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-300">Nivel</label>
            <select
              className="w-full rounded-xl bg-slate-800 border border-white/10 px-3 py-2"
              value={filtros.nivel}
              onChange={(e) => setFiltros((f) => ({ ...f, nivel: e.target.value }))}
            >
              <option value="">(Todos)</option>
              {opciones.niveles.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-300">Unidad educativa</label>
            <input
              type="text"
              placeholder="(opcional)"
              className="w-full rounded-xl bg-slate-800 border border-white/10 px-3 py-2"
              value={filtros.unidad}
              onChange={(e) => setFiltros((f) => ({ ...f, unidad: e.target.value }))}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-400">Acceso exclusivo para responsables académicos</p>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltros({ area: "", nivel: "", unidad: "" })}
              className="rounded-xl bg-slate-800 border border-white/10 px-4 py-2 text-sm hover:border-cyan-400/40"
            >
              Limpiar filtros
            </button>
            <button
              onClick={exportarCSV}
              className="rounded-xl bg-slate-800 border border-white/10 px-4 py-2 text-sm hover:border-cyan-400/40"
            >
              Exportar CSV
            </button>
            <button
              onClick={exportarExcel}
              className="rounded-xl bg-slate-800 border border-white/10 px-4 py-2 text-sm hover:border-cyan-400/40"
            >
              Exportar Excel
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/70">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/70 text-slate-300">
              <tr>
                <th className="px-4 py-2 text-left">Documento</th>
                <th className="px-4 py-2 text-left">Nombres</th>
                <th className="px-4 py-2 text-left">Apellidos</th>
                <th className="px-4 py-2 text-left">Unidad</th>
                <th className="px-4 py-2 text-left">Área</th>
                <th className="px-4 py-2 text-left">Nivel</th>
                              <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400 animate-pulse">
                    Cargando competidores…
                  </td>
                </tr>
              ) : lista.length > 0 ? (
                lista.map((c) => (
                  <tr key={c.id} className="border-t border-white/10 hover:bg-slate-800/40 transition">
                    <td className="px-4 py-2">{c.documento}</td>
                    <td className="px-4 py-2">{c.nombres}</td>
                    <td className="px-4 py-2">{c.apellidos}</td>
                    <td className="px-4 py-2">{c.unidad}</td>
                    <td className="px-4 py-2">{c.area}</td>
                    <td className="px-4 py-2">{c.nivel}</td>
                                      <td className="px-4 py-2 text-center">
                                        <button
                                          onClick={() => abrirModalEditar(c)}
                                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs"
                                          title="Editar competidor"
                                        >
                                          ✏️ Editar
                                        </button>
                                      </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                    No hay competidores con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Los cambios en el padrón de competidores se actualizan tras recargar la vista o importar nuevos inscritos.
        </p>
        {/* Modal de edición */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-2xl bg-white text-slate-900 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">{editingId ? 'Editar competidor' : 'Nuevo competidor'}</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-600">Documento</label>
                    <input
                      className="w-full rounded-xl border px-3 py-2"
                      value={formData.documento}
                      onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                    />
                    {formErrors.documento && <p className="text-xs text-rose-600">{formErrors.documento}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600">Unidad</label>
                    <input
                      className="w-full rounded-xl border px-3 py-2"
                      value={formData.unidad}
                      onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                    />
                    {formErrors.unidad && <p className="text-xs text-rose-600">{formErrors.unidad}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-600">Nombres</label>
                    <input
                      className="w-full rounded-xl border px-3 py-2"
                      value={formData.nombres}
                      onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                    />
                    {formErrors.nombres && <p className="text-xs text-rose-600">{formErrors.nombres}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600">Apellidos</label>
                    <input
                      className="w-full rounded-xl border px-3 py-2"
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    />
                    {formErrors.apellidos && <p className="text-xs text-rose-600">{formErrors.apellidos}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-600">Área</label>
                    <select
                      className="w-full rounded-xl border px-3 py-2"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    >
                      <option value="">(Seleccione)</option>
                      {opciones.areas.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    {formErrors.area && <p className="text-xs text-rose-600">{formErrors.area}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600">Nivel</label>
                    <select
                      className="w-full rounded-xl border px-3 py-2"
                      value={formData.nivel}
                      onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                    >
                      <option value="">(Seleccione)</option>
                      {opciones.niveles.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    {formErrors.nivel && <p className="text-xs text-rose-600">{formErrors.nivel}</p>}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={cerrarModal} className="px-4 py-2 rounded-xl border">Cancelar</button>
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-cyan-600 text-white rounded-xl">
                    {saving ? 'Guardando…' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
