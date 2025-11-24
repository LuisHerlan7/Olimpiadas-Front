
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminShell from "../../../components/AdminShell";
import type { Area } from "../../../services/areas";
import { getArea, createArea, updateArea } from "../../../services/areas";

export default function AdminAreaForm() {
  const { id } = useParams();
  const isEdit = !!id && id !== "nuevo";
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(!!isEdit);
  const [saving, setSaving] = useState<boolean>(false);
  const [form, setForm] = useState<Area>({ nombre: "", codigo: "", descripcion: "", activo: true });

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
      navigate("/admin/areas");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar el área");
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