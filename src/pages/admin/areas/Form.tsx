
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminShell from "../../../components/AdminShell";
import type { Area } from "../../../services/areas";
import { getArea, createArea, updateArea } from "../../../services/areas";

interface ErrorAlert {
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  details?: Record<string, string[]>;
}

export default function AdminAreaForm() {
  const { id } = useParams();
  const isEdit = !!id && id !== "nuevo";
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(!!isEdit);
  const [saving, setSaving] = useState<boolean>(false);
  const [form, setForm] = useState<Area>({ nombre: "", codigo: "", descripcion: "", activo: true });
  const [error, setError] = useState<ErrorAlert | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isEdit) {
        setLoading(false);
        return;
      }
      try {
        const data = await getArea(id!);
        if (!mounted) return;
        setForm({
          id: data.id,
          nombre: data.nombre || "",
          codigo: data.codigo || "",
          descripcion: data.descripcion ?? "",
          activo: data.activo ?? true,
        });
      } catch (err) {
        alert("No se pudo cargar el área");
        navigate("/admin/areas");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, isEdit, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload: Area = {
        nombre: form.nombre.trim(),
        codigo: form.codigo?.trim(),
        descripcion: form.descripcion?.trim() || null,
        activo: !!form.activo,
      };

      if (isEdit && form.id != null) {
        await updateArea(form.id, payload);
      } else {
        await createArea(payload);
      }
      
      setError({
        type: "success",
        title: isEdit ? "Área actualizada" : "Área creada",
        message: isEdit ? "Los cambios se han guardado correctamente." : "El área se ha creado exitosamente.",
      });
      
      setTimeout(() => {
        navigate("/admin/areas?refresh=" + Date.now());
      }, 1500);
    } catch (err: any) {
      console.error(err);
      
      // Manejo de errores de validación (422)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const fieldErrors = err.response.data.errors;
        
        // Mensajes personalizados por campo
        let customTitle = "Error de validación";
        let customMessage = "Por favor revisa los datos ingresados.";
        
        if (fieldErrors.codigo) {
          customTitle = "Código duplicado";
          customMessage = "No puedes usar ese código porque ya está en uso. Intenta con otro.";
        } else if (fieldErrors.nombre) {
          customTitle = "Error en el nombre";
          customMessage = fieldErrors.nombre[0];
        }
        
        setError({
          type: "warning",
          title: customTitle,
          message: customMessage,
          details: fieldErrors,
        });
      } else {
        setError({
          type: "error",
          title: "Error al guardar",
          message: err.response?.data?.message || "Ocurrió un error al guardar el área. Intenta nuevamente.",
        });
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminShell title={`${isEdit ? "Editar" : "Nueva"} Área`} backTo="/admin/areas">
        <div className="p-6">Cargando…</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={`${isEdit ? "Editar" : "Nueva"} Área`} backTo="/admin/areas">
      {error && (
        <div className="mb-4 rounded-2xl p-4 md:p-6 border-l-4 animate-in fade-in slide-in-from-top-2" 
          style={{
            borderColor: error.type === "success" ? "#10b981" : error.type === "warning" ? "#f59e0b" : error.type === "info" ? "#3b82f6" : "#ef4444",
            backgroundColor: error.type === "success" ? "#ecfdf5" : error.type === "warning" ? "#fffbeb" : error.type === "info" ? "#eff6ff" : "#fef2f2",
          }}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {error.type === "success" && (
                <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {error.type === "warning" && (
                <svg className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {error.type === "error" && (
                <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {error.type === "info" && (
                <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold" style={{
                color: error.type === "success" ? "#065f46" : error.type === "warning" ? "#92400e" : error.type === "info" ? "#1e40af" : "#7f1d1d",
              }}>
                {error.title}
              </h3>
              <p className="text-sm mt-1" style={{
                color: error.type === "success" ? "#047857" : error.type === "warning" ? "#b45309" : error.type === "info" ? "#2563eb" : "#991b1b",
              }}>
                {error.message}
              </p>
              {error.details && Object.keys(error.details).length > 0 && (
                <div className="mt-3 space-y-1 text-sm">
                  {Object.entries(error.details).map(([field, messages]) => (
                    <div key={field}>
                      <p className="font-medium capitalize">{field}:</p>
                      <ul className="list-disc list-inside">
                        {(messages as string[]).map((msg, i) => (
                          <li key={i} className="ml-1">{msg}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setError(null)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl bg-white p-4 md:p-6">
        <section className="max-w-3xl mx-auto">
          <div className="mockup-card">
            <h2 className="mockup-title">{isEdit ? "Editar área" : "Registrar nueva área"}</h2>
            <p className="mockup-subtitle">Nombre, código único y estado.</p>

            <form onSubmit={onSubmit} className="mt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mockup-label">Nombre</label>
                  <input
                    className="mockup-input"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    placeholder="Ej. Matemáticas"
                  />
                </div>

                <div>
                  <label className="mockup-label">Código</label>
                  <input
                    className="mockup-input"
                    required
                    value={form.codigo}
                    onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value.toUpperCase() }))}
                    placeholder="Ej. MAT"
                    maxLength={10}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mockup-label">Descripción (opcional)</label>
                  <textarea
                    className="mockup-input h-28 resize-none"
                    value={form.descripcion ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                    placeholder="Breve descripción de la área"
                  />
                </div>

                <div className="flex items-center gap-3 md:col-span-2">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!form.activo}
                      onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
                      className="rounded border-slate-700 bg-slate-800 form-checkbox h-4 w-4"
                    />
                    <span className="text-sm text-white">Activo</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/areas")}
                  className="rounded-xl border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-cyan-500 disabled:opacity-60"
                >
                  {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear área"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}