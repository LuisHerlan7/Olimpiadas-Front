import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { listAreas, deleteArea, type Area } from "../../../services/areas";
import { api } from "../../../api";

interface AreaWithInscritos extends Area {
  inscritos_count?: number;
}

interface Alert {
  type: "error" | "success" | "warning";
  title: string;
  message: string;
  details?: string;
}

export default function AdminAreasPage() {
<<<<<<< HEAD
  const [areas, setAreas] = useState<AreaWithInscritos[]>([]);
=======
  const [searchParams] = useSearchParams();
  const [areas, setAreas] = useState<Area[]>([]);
>>>>>>> 1ff207e60b3cb443354e7d3185b5620c83095496
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [alert, setAlert] = useState<Alert | null>(null);
  
  const [confirmStep, setConfirmStep] = useState<number | null>(null); // paso 1 o 2
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const a = await listAreas({ per_page: 1000 });
        if (!mounted) return;
        
        // Obtener todos los inscritos una sola vez
        let allInscritos: any[] = [];
        try {
          const response = await api.get(`/inscritos`);
          allInscritos = Array.isArray(response.data) ? response.data : [];
        } catch (err) {
          console.error("Error al cargar inscritos:", err);
        }

        // Obtener conteo de inscritos por área
        const areasConConteo = (a || []).map((area) => {
          // Contar inscritos que coincidan por area_id O por el nombre del área (texto)
          const count = allInscritos.filter((inscrito: any) => {
            // Si tiene area_id, comparar por ID
            if (inscrito.area_id && area.id) {
              if (inscrito.area_id === area.id) return true;
            }
            // Si no, comparar por nombre del área (texto)
            if (inscrito.area && area.nombre) {
              if (inscrito.area.toLowerCase().trim() === area.nombre.toLowerCase().trim()) return true;
            }
            return false;
          }).length;
          
          return { ...area, inscritos_count: count };
        });
        
        setAreas(areasConConteo || []);
      } catch (err) {
        console.error("Error al cargar áreas:", err);
        if (!mounted) return;
        setAreas([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [searchParams]);

  const handleDeleteClick = (id: number, inscritosCount: number = 0) => {
    if (inscritosCount > 0) {
      setErrorMessage(`No se puede eliminar esta área porque tiene ${inscritosCount} estudiante(s) inscrito(s).`);
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }
    // Primer paso: mostrar confirmación
    setConfirmStep(id);
    setDeletingId(null); // asegúrate de que NO esté bloqueado
  };

  const handleCancelDelete = () => {
    setConfirmStep(null);
    setDeletingId(null);
    setErrorMessage(null);
  };

  const handleConfirmDelete = async (id: number) => {
    // 🔥 FIX: evitar solo doble click, NO bloquear siempre
    if (deletingId === id) return;

    setDeletingId(id);
    try {
      await deleteArea(id);
      // Update the state to remove the deleted area
      setAreas(prevAreas => prevAreas.filter((a) => a.id !== id));
      setAlert({
        type: "success",
        title: "Área eliminada",
        message: "El área se ha eliminado correctamente del sistema.",
      });
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error("Error al eliminar área:", error);
      let title = "No se pudo eliminar el área";
      let message = "Ocurrió un error inesperado. Intenta nuevamente.";
      let details = "";
      
      if (error?.response?.data) {
        const { message: serverMessage, dependencias } = error.response.data;
        message = serverMessage || message;
        
        if (dependencias) {
          const deps = [];
          if (dependencias.responsables) deps.push(`${dependencias.responsables} responsable(s)`);
          if (dependencias.evaluadores) deps.push(`${dependencias.evaluadores} evaluador(es)`);
          if (dependencias.inscritos) deps.push(`${dependencias.inscritos} inscrito(s)`);
          
          if (deps.length > 0) {
            title = "No se puede eliminar esta área";
            message = "Existen registros asociados a esta área:";
            details = deps.join("\n");
          }
        }
      }
      
<<<<<<< HEAD
      setErrorMessage(errorMessage);
      setTimeout(() => setErrorMessage(null), 6000);
=======
      setAlert({
        type: "error",
        title,
        message,
        details: details || undefined,
      });
>>>>>>> 1ff207e60b3cb443354e7d3185b5620c83095496
    } finally {
      setConfirmStep(null);
      setDeletingId(null);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-slate-100">
      {/* Alert Banner */}
      {alert && (
        <div className="sticky top-0 z-40 border-b border-white/10 animate-in fade-in slide-in-from-top-2"
          style={{
            backgroundColor: alert.type === "success" ? "#064e3b" : alert.type === "warning" ? "#78350f" : "#7f1d1d",
            borderColor: alert.type === "success" ? "#10b981" : alert.type === "warning" ? "#f59e0b" : "#ef4444",
          }}>
          <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {alert.type === "success" && (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {alert.type === "error" && (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {alert.type === "warning" && (
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">{alert.title}</h3>
                <p className={`text-sm mt-1 ${alert.type === "success" ? "text-green-200" : alert.type === "error" ? "text-red-200" : "text-amber-200"}`}>
                  {alert.message}
                </p>
                {alert.details && (
                  <div className={`mt-2 text-xs space-y-1 ${alert.type === "success" ? "text-green-100" : alert.type === "error" ? "text-red-100" : "text-amber-100"}`}>
                    {alert.details.split("\n").map((line, i) => (
                      <div key={i}>• {line}</div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setAlert(null)}
                className="flex-shrink-0 text-white/60 hover:text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div>
            <h1 className="text-lg font-bold text-white">Gestión de Áreas</h1>
            <p className="text-xs text-slate-400">Crear, editar y organizar las áreas del sistema.</p>
          </div>

          <Link
            to="/admin"
            className="rounded-xl bg-cyan-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-cyan-500"
          >
            ← Volver al panel
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        {errorMessage && (
          <div className="mb-6 rounded-lg border border-amber-700 bg-amber-900/30 px-4 py-3 text-amber-200">
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}
        
        <section className="mb-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl">
            <div className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-tr from-cyan-400 to-indigo-500 opacity-20 blur-2xl" />
            <h2 className="text-xl font-extrabold text-white md:text-2xl">Listado de Áreas</h2>
            <p className="mt-1 text-sm text-slate-300">Administra las áreas que se usan en el sistema.</p>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="text-sm text-slate-300">Filtrar por nombre o estado</div>
              <Link
                to="/admin/areas/nuevo"
                className="rounded-xl bg-cyan-600/80 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-cyan-500"
              >
                + Nueva Área
              </Link>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[500px] table-fixed text-sm">
                <colgroup>
                  <col className="w-12" />
                  <col />
                  <col className="w-20" />
                  <col className="w-24" />
                  <col className="w-20" />
                  <col className="w-40" />
                </colgroup>
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-white/10">
                    <th className="pb-2 px-2">ID</th>
                    <th className="pb-2 px-3">Nombre</th>
                    <th className="pb-2 px-2 text-center">Código</th>
                    <th className="pb-2 px-2 text-center">Inscritos</th>
                    <th className="pb-2 px-2 text-center">Estado</th>
                    <th className="pb-2 px-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        Cargando áreas...
                      </td>
                    </tr>
                  ) : areas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        No hay áreas registradas.
                      </td>
                    </tr>
                  ) : (
<<<<<<< HEAD
                    areas.map((a: AreaWithInscritos) => {
                      const hasInscritos = (a.inscritos_count || 0) > 0;
                      return (
                        <tr key={a.id} className={confirmStep === a.id ? "bg-red-900/20" : "hover:bg-slate-800/30"}>
                          <td className="py-2.5 px-2 text-slate-300 text-xs">{a.id}</td>
                          <td className="py-2.5 px-3 text-slate-300 font-medium">{a.nombre}</td>
                          <td className="py-2.5 px-2 text-slate-300 text-center text-xs">{a.codigo ?? "—"}</td>
                          <td className={`py-2.5 px-2 text-center text-xs font-medium ${hasInscritos ? "text-amber-400" : "text-slate-400"}`}>
                            {a.inscritos_count || 0}
                          </td>
                          <td className={`py-2.5 px-2 text-center text-xs ${a.activo ? "text-emerald-400 font-medium" : "text-slate-300"}`}>
                            {a.activo ? "Activo" : "Inactivo"}
                          </td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link 
                                to={`/admin/areas/${a.id}`} 
                                className="text-cyan-300 text-xs font-semibold hover:text-cyan-200 whitespace-nowrap px-1"
=======
                    areas.map((a: Area) => (
                      <tr key={a.id} className={confirmStep === a.id ? "bg-red-900/20" : "hover:bg-slate-800/30"}>
                        <td className="py-2.5 px-2 text-slate-300 text-xs">{a.id}</td>
                        <td className="py-2.5 px-3 text-slate-300 font-medium">{a.nombre}</td>
                        <td className="py-2.5 px-2 text-slate-300 text-center text-xs">{a.codigo ?? "—"}</td>
                        <td className={`py-2.5 px-2 text-center text-xs ${a.activo ? "text-emerald-400 font-medium" : "text-slate-300"}`}>
                          <span>{a.activo ? "Activo" : "Inactivo"}</span>
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link 
                              to={`/admin/areas/${a.id}`} 
                              className="text-cyan-300 text-xs font-semibold hover:text-cyan-200 whitespace-nowrap px-1"
                            >
                              Editar
                            </Link>
                            {confirmStep === a.id ? (
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-red-300 font-semibold whitespace-nowrap">¿Confirmar?</span>
                                <button
                                  onClick={() => handleConfirmDelete(a.id!)}
                                  disabled={deletingId === a.id}
                                  className="px-1.5 py-0.5 text-[10px] font-semibold text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 whitespace-nowrap"
                                >
                                  Sí
                                </button>
                                <button
                                  onClick={handleCancelDelete}
                                  disabled={deletingId === a.id}
                                  className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-50 whitespace-nowrap"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDeleteClick(a.id!)}
                                disabled={deletingId !== null}
                                className="text-red-400 text-xs font-semibold hover:text-red-300 disabled:opacity-50 whitespace-nowrap px-1"
>>>>>>> 1ff207e60b3cb443354e7d3185b5620c83095496
                              >
                                Editar
                              </Link>
                              {confirmStep === a.id ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-red-300 font-semibold whitespace-nowrap">¿Confirmar?</span>
                                  <button
                                    onClick={() => handleConfirmDelete(a.id!)}
                                    disabled={deletingId === a.id}
                                    className="px-1.5 py-0.5 text-[10px] font-semibold text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 whitespace-nowrap"
                                  >
                                    Sí
                                  </button>
                                  <button
                                    onClick={handleCancelDelete}
                                    disabled={deletingId === a.id}
                                    className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 bg-slate-700 rounded hover:bg-slate-600 disabled:opacity-50 whitespace-nowrap"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleDeleteClick(a.id!, a.inscritos_count || 0)}
                                  disabled={deletingId !== null || hasInscritos}
                                  title={hasInscritos ? `No se puede eliminar: ${a.inscritos_count} estudiante(s) inscrito(s)` : ""}
                                  className={`text-xs font-semibold whitespace-nowrap px-1 rounded transition ${
                                    hasInscritos
                                      ? "text-slate-500 cursor-not-allowed opacity-50"
                                      : "text-red-400 hover:text-red-300"
                                  }`}
                                >
                                  Eliminar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>      
      </main>
    </div>
  );
}
