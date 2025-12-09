// src/pages/admin/inscritos/List.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminShell from "../../../components/AdminShell";
import { api } from "../../../api"; // Instancia Axios con token
import { createInscrito, updateInscrito, deleteInscrito, type CreateInscritoPayload } from "../../../services/inscritos";
import { fetchAreas, fetchNiveles, type Area, type Nivel } from "../../../services/catalogos";
import { getFaseInscripcion, type FaseInscripcion } from "../../../services/fases";

// 🧩 Tipo de datos de cada inscrito
interface Inscrito {
  id: number;
  documento: string;
  nombres: string;
  apellidos: string;
  unidad: string;
  area: string;
  nivel: string;
}

export default function AdminInscritosList() {
  const [inscritos, setInscritos] = useState<Inscrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const [faseInscripcion, setFaseInscripcion] = useState<FaseInscripcion | null>(null);
  const [loadingFase, setLoadingFase] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Formulario
  const [formData, setFormData] = useState<CreateInscritoPayload>({
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
  const [deleting, setDeleting] = useState<number | null>(null);

  // 🔍 Filtrado en frontend
  const filteredInscritos = useMemo(() => {
    if (!search.trim()) return inscritos;
    const s = search.toLowerCase();
    return inscritos.filter(
      (i) =>
        i.nombres.toLowerCase().includes(s) ||
        i.apellidos.toLowerCase().includes(s) ||
        i.documento.toLowerCase().includes(s)
    );
  }, [inscritos, search]);

  // 📦 Cargar inscritos y catálogos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadingFase(true);
      try {
        // Cargar estado de fase de inscripción
        const faseData = await getFaseInscripcion();
        setFaseInscripcion(faseData);

        // Cargar inscritos
        const { data } = await api.get<Inscrito[]>("/inscritos");
        const lista = Array.isArray(data)
          ? data.map((i) => ({
              id: i.id,
              documento: i.documento || "-",
              nombres: i.nombres || "",
              apellidos: i.apellidos || "",
              unidad: i.unidad || "",
              area: i.area || "",
              nivel: i.nivel || "",
            }))
          : [];
        setInscritos(lista);

        // Cargar catálogos
        const [areasData, nivelesData] = await Promise.all([
          fetchAreas(),
          fetchNiveles(),
        ]);
        setAreas(areasData);
        setNiveles(nivelesData);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error al cargar los datos:", error.message);
        } else if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          console.error("Error de API:", (error as { response?: unknown }).response);
        } else {
          console.error("Error desconocido:", error);
        }
      } finally {
        setLoading(false);
        setLoadingFase(false);
      }
    };

    fetchData();
  }, []);


  // 🧹 Limpiar búsqueda
  const limpiar = () => setSearch("");

  // 📝 Abrir modal de creación
  const abrirModal = () => {
    // Verificar si la fase está activa
    if (!faseInscripcion?.activa) {
      alert(faseInscripcion?.mensaje || "La fase de inscripción no está activa en este momento.");
      return;
    }
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
    setShowModal(true);
  };

  // 📝 Abrir modal de edición
  const abrirModalEditar = (inscrito: Inscrito) => {
    setEditingId(inscrito.id);
    setFormData({
      documento: inscrito.documento,
      nombres: inscrito.nombres,
      apellidos: inscrito.apellidos,
      unidad: inscrito.unidad,
      area: inscrito.area,
      nivel: inscrito.nivel,
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

  // 💾 Guardar inscrito (crear o editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar si la fase está activa antes de guardar (solo para creación)
    if (!editingId && !faseInscripcion?.activa) {
      alert(faseInscripcion?.mensaje || "La fase de inscripción no está activa en este momento.");
      return;
    }

    setFormErrors({});
    setSaving(true);

    try {
      // Validación básica
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
        // Actualizar inscrito existente
        await updateInscrito(editingId, formData);
      } else {
        // Crear nuevo inscrito
        await createInscrito(formData);
      }
      
      // Recargar lista
      const { data } = await api.get<Inscrito[]>("/inscritos");
      const lista = Array.isArray(data)
        ? data.map((i) => ({
            id: i.id,
            documento: i.documento || "-",
            nombres: i.nombres || "",
            apellidos: i.apellidos || "",
            unidad: i.unidad || "",
            area: i.area || "",
            nivel: i.nivel || "",
          }))
        : [];
      setInscritos(lista);

      cerrarModal();
      alert(editingId ? "Inscrito actualizado exitosamente" : "Inscrito creado exitosamente");
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
        const errorData = axiosError.response?.data;
        if (errorData?.errors) {
          const normalizedErrors: Record<string, string> = {};
          Object.entries(errorData.errors).forEach(([key, messages]) => {
            normalizedErrors[key] = Array.isArray(messages) ? messages[0] : String(messages);
          });
          setFormErrors(normalizedErrors);
        } else {
          alert(errorData?.message || (editingId ? "Error al actualizar el inscrito" : "Error al crear el inscrito"));
        }
      } else {
        alert(editingId ? "Error al actualizar el inscrito" : "Error al crear el inscrito");
      }
    } finally {
      setSaving(false);
    }
  };

  // 🔄 Manejar cambio de área (si selecciona de catálogo)
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target instanceof HTMLSelectElement && value) {
      const area = areas.find((a) => a.id === Number(value));
      setFormData({
        ...formData,
        area: area?.nombre || value,
        area_id: area ? area.id : null,
      });
    } else {
      setFormData({ ...formData, area: value, area_id: null });
    }
  };

  // 🔄 Manejar cambio de nivel (si selecciona de catálogo)
  const handleNivelChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target instanceof HTMLSelectElement && value) {
      const nivel = niveles.find((n) => n.id === Number(value));
      setFormData({
        ...formData,
        nivel: nivel?.nombre || value,
        nivel_id: nivel ? nivel.id : null,
      });
    } else {
      setFormData({ ...formData, nivel: value, nivel_id: null });
    }
  };

  // 🗑️ Eliminar inscrito
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este inscrito? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeleting(id);
    try {
      await deleteInscrito(id);
      
      // Recargar lista
      const { data } = await api.get<Inscrito[]>("/inscritos");
      const lista = Array.isArray(data)
        ? data.map((i) => ({
            id: i.id,
            documento: i.documento || "-",
            nombres: i.nombres || "",
            apellidos: i.apellidos || "",
            unidad: i.unidad || "",
            area: i.area || "",
            nivel: i.nivel || "",
          }))
        : [];
      setInscritos(lista);
      
      alert("Inscrito eliminado exitosamente");
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        alert(axiosError.response?.data?.message || "Error al eliminar el inscrito");
      } else {
        alert("Error al eliminar el inscrito");
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminShell
      title="Gestión de Inscritos"
      subtitle="Listado general de inscritos registrados en el sistema"
      backTo="/admin"
      actions={
        <div className="flex gap-2">
          <button
            onClick={abrirModal}
            disabled={!faseInscripcion?.activa || loadingFase}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={!faseInscripcion?.activa ? (faseInscripcion?.mensaje || "La fase de inscripción no está activa") : ""}
          >
            + Nuevo Inscrito
          </button>
          <Link
            to="/admin/importar-inscritos"
            className={`px-4 py-2 rounded-lg transition-colors ${
              !faseInscripcion?.activa || loadingFase
                ? "bg-slate-400 cursor-not-allowed opacity-50 pointer-events-none"
                : "bg-cyan-600 hover:bg-cyan-700 text-white"
            }`}
            title={!faseInscripcion?.activa ? (faseInscripcion?.mensaje || "La fase de inscripción no está activa") : ""}
          >
            Importar CSV
          </Link>
        </div>
      }
    >
      {/* Alerta si la fase no está activa */}
      {!loadingFase && !faseInscripcion?.activa && (
        <div className="mb-4 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-amber-200">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
            </svg>
            <p className="font-semibold">Fase de inscripción cerrada</p>
          </div>
          <p className="mt-2 text-sm text-amber-300/80">
            {faseInscripcion?.mensaje || "La funcionalidad de subir inscritos está bloqueada porque no estamos en el período de inscripción."}
          </p>
          {faseInscripcion?.fecha_inicio && faseInscripcion?.fecha_fin && (
            <p className="mt-1 text-xs text-amber-300/60">
              Período: {new Date(faseInscripcion.fecha_inicio).toLocaleDateString()} - {new Date(faseInscripcion.fecha_fin).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <div className="rounded-3xl bg-white p-4 md:p-6 space-y-4 text-slate-900 shadow-sm border border-slate-200">
        {/* 🔎 Filtros */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o documento"
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-300 transition-colors"
            onClick={limpiar}
          >
            Limpiar
          </button>
        </div>

        {/* 🧾 Tabla */}
        {loading ? (
          <div className="py-8 text-center text-slate-500">Cargando inscritos…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-slate-200 rounded-xl">
              <thead className="bg-slate-100 text-slate-700">
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
                {filteredInscritos.length ? (
                  filteredInscritos.map((inscrito) => (
                    <tr
                      key={inscrito.id}
                      className="border-t border-slate-200 hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-2">{inscrito.documento}</td>
                      <td className="px-4 py-2">{inscrito.nombres}</td>
                      <td className="px-4 py-2">{inscrito.apellidos}</td>
                      <td className="px-4 py-2">{inscrito.unidad}</td>
                      <td className="px-4 py-2">{inscrito.area}</td>
                      <td className="px-4 py-2">{inscrito.nivel}</td>
                      <td className="px-4 py-2 text-center flex gap-2 justify-center">
                        <button
                          onClick={() => abrirModalEditar(inscrito)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                          title="Editar inscrito"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(inscrito.id)}
                          disabled={deleting === inscrito.id}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          title="Eliminar inscrito"
                        >
                          {deleting === inscrito.id ? "Eliminando..." : "🗑️ Eliminar"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-slate-400 italic"
                    >
                      No hay inscritos con los filtros actuales
                    </td>
                  </tr>
                )}
              </tbody>
              
              <tfoot>
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400 italic">
                    Total de inscritos: {filteredInscritos.length}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Modal de creación/edición */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Editar Inscrito" : "Nuevo Inscrito"}
              </h2>
              <button
                onClick={cerrarModal}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Documento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.documento}
                    onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      formErrors.documento ? "border-red-500" : "border-slate-300"
                    } focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
                    placeholder="Ej: 12345678"
                  />
                  {formErrors.documento && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.documento}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Unidad
                  </label>
                  <input
                    type="text"
                    value={formData.unidad}
                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    placeholder="Ej: Unidad Educativa X"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nombres <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombres}
                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      formErrors.nombres ? "border-red-500" : "border-slate-300"
                    } focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
                    placeholder="Ej: Juan"
                  />
                  {formErrors.nombres && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.nombres}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      formErrors.apellidos ? "border-red-500" : "border-slate-300"
                    } focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
                    placeholder="Ej: Pérez"
                  />
                  {formErrors.apellidos && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.apellidos}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Área <span className="text-red-500">*</span>
                  </label>
                  {areas.length > 0 ? (
                    <select
                      required
                      value={formData.area_id || ""}
                      onChange={handleAreaChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        formErrors.area ? "border-red-500" : "border-slate-300"
                      } focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
                    >
                      <option value="">Seleccione un área</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.nombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={formData.area}
                      onChange={handleAreaChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        formErrors.area ? "border-red-500" : "border-slate-300"
                      } focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
                      placeholder="Ej: Ingeniería de Sistemas"
                    />
                  )}
                  {formErrors.area && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.area}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nivel <span className="text-red-500">*</span>
                  </label>
                  {niveles.length > 0 ? (
                    <select
                      required
                      value={formData.nivel_id || ""}
                      onChange={handleNivelChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        formErrors.nivel ? "border-red-500" : "border-slate-300"
                      } focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
                    >
                      <option value="">Seleccione un nivel</option>
                      {niveles.map((nivel) => (
                        <option key={nivel.id} value={nivel.id}>
                          {nivel.nombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={formData.nivel}
                      onChange={handleNivelChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        formErrors.nivel ? "border-red-500" : "border-slate-300"
                      } focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
                      placeholder="Ej: Nivel 1"
                    />
                  )}
                  {formErrors.nivel && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.nivel}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
