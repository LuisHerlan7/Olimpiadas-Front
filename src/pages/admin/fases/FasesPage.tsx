import { useState } from "react";
import AdminShell from "../../../components/AdminShell";
import { 
  getFaseInscripcion, 
  updateFaseInscripcion, 
  cancelarFaseInscripcion,
  getFaseAsignacion,
  updateFaseAsignacion,
  cancelarFaseAsignacion,
  type FaseInscripcion 
} from "../../../services/fases";

export default function FasesPage() {
  const [activeFase, setActiveFase] = useState<"inscripcion" | "asignacion" | "clasificados" | null>(null);
  const [faseInscripcion, setFaseInscripcion] = useState<FaseInscripcion | null>(null);
  const [faseAsignacion, setFaseAsignacion] = useState<FaseInscripcion | null>(null);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cargarFaseInscripcion = async () => {
    setLoading(true);
    try {
      const data = await getFaseInscripcion();
      setFaseInscripcion(data);
      setFechaInicio(data.fecha_inicio ? data.fecha_inicio.split('T')[0] : "");
      setFechaFin(data.fecha_fin ? data.fecha_fin.split('T')[0] : "");
    } catch (error) {
      console.error("Error al cargar fase de inscripción:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarFaseAsignacion = async () => {
    setLoading(true);
    try {
      const data = await getFaseAsignacion();
      setFaseAsignacion(data);
      setFechaInicio(data.fecha_inicio ? data.fecha_inicio.split('T')[0] : "");
      setFechaFin(data.fecha_fin ? data.fecha_fin.split('T')[0] : "");
    } catch (error) {
      console.error("Error al cargar fase de asignación:", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirFase = async (fase: "inscripcion" | "asignacion" | "clasificados") => {
    setActiveFase(fase);
    if (fase === "inscripcion") {
      await cargarFaseInscripcion();
    } else if (fase === "asignacion") {
      await cargarFaseAsignacion();
    }
  };

  const cerrarFase = () => {
    setActiveFase(null);
    setEditando(false);
  };

  const handleGuardar = async () => {
    if (!fechaInicio || !fechaFin) {
      alert("Por favor, completa ambas fechas");
      return;
    }

    setGuardando(true);
    try {
      const fechaInicioISO = new Date(fechaInicio + "T00:00:00").toISOString();
      const fechaFinISO = new Date(fechaFin + "T23:59:59").toISOString();
      
      if (activeFase === "inscripcion") {
        const updated = await updateFaseInscripcion({
          fecha_inicio: fechaInicioISO,
          fecha_fin: fechaFinISO,
          activa: true,
        });
        setFaseInscripcion(updated);
      } else if (activeFase === "asignacion") {
        const updated = await updateFaseAsignacion({
          fecha_inicio: fechaInicioISO,
          fecha_fin: fechaFinISO,
          activa: true,
        });
        setFaseAsignacion(updated);
      }
      
      setEditando(false);
      alert("Fechas guardadas exitosamente");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Error al guardar las fechas");
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelarFase = async () => {
    const mensaje = activeFase === "inscripcion" 
      ? "¿Estás seguro de cancelar la fase de inscripción? Esto bloqueará la subida de inscritos."
      : "¿Estás seguro de cancelar la fase de asignación? Esto bloqueará la subida de notas.";
    
    if (!confirm(mensaje)) {
      return;
    }

    setGuardando(true);
    try {
      if (activeFase === "inscripcion") {
        const updated = await cancelarFaseInscripcion();
        setFaseInscripcion(updated);
        alert("Fase de inscripción cancelada exitosamente");
      } else if (activeFase === "asignacion") {
        const updated = await cancelarFaseAsignacion();
        setFaseAsignacion(updated);
        alert("Fase de asignación cancelada exitosamente");
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Error al cancelar la fase");
    } finally {
      setGuardando(false);
    }
  };

  const verificarSiEstaEnFecha = (fase: FaseInscripcion | null): boolean => {
    if (!fase?.fecha_inicio || !fase?.fecha_fin) {
      return false;
    }
    const ahora = new Date();
    const inicio = new Date(fase.fecha_inicio);
    const fin = new Date(fase.fecha_fin);
    return ahora >= inicio && ahora <= fin;
  };

  const getFaseActual = (): FaseInscripcion | null => {
    if (activeFase === "inscripcion") return faseInscripcion;
    if (activeFase === "asignacion") return faseAsignacion;
    return null;
  };

  return (
    <AdminShell
      title="Fases del Proceso"
      subtitle="Gestiona las diferentes fases del proceso de olimpiadas"
      backTo="/admin"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Inscripción */}
        <button
          onClick={() => abrirFase("inscripcion")}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl transition hover:border-cyan-400/40 hover:bg-slate-900/80 text-left"
        >
          <div className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-tr from-cyan-400/20 to-indigo-500/20 opacity-50 blur-2xl group-hover:opacity-80" />
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 4v16m8-8H4" stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white">Fase De Inscripción</h3>
          <p className="mt-1 text-sm text-slate-300">Gestiona el proceso de inscripción de participantes.</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-300">
            Abrir
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </button>

        {/* Asignación */}
        <button
          onClick={() => abrirFase("asignacion")}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl transition hover:border-cyan-400/40 hover:bg-slate-900/80 text-left"
        >
          <div className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-tr from-cyan-400/20 to-indigo-500/20 opacity-50 blur-2xl group-hover:opacity-80" />
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white">Fase De Asignación</h3>
          <p className="mt-1 text-sm text-slate-300">Asigna evaluadores y responsables a los participantes.</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-300">
            Abrir
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </button>

        {/* Clasificados */}
        <button
          onClick={() => abrirFase("clasificados")}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl transition hover:border-cyan-400/40 hover:bg-slate-900/80 text-left"
        >
          <div className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-tr from-cyan-400/20 to-indigo-500/20 opacity-50 blur-2xl group-hover:opacity-80" />
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 3.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 3.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-3.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-3.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z" stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white">Fase De Clasificados</h3>
          <p className="mt-1 text-sm text-slate-300">Visualiza y gestiona los participantes clasificados.</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-300">
            Abrir
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </div>

      {/* Modal de Inscripción */}
      {activeFase === "inscripcion" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Fase: Inscripción</h2>
              <button
                onClick={cerrarFase}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            {loading ? (
              <div className="rounded-xl border border-white/10 bg-slate-800/50 p-6 text-center">
                <p className="text-slate-300">Cargando información...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const faseActual = getFaseActual();
                  const estaEnFecha = verificarSiEstaEnFecha(faseActual);
                  
                  return (
                    <>
                      {/* Estado de la fase */}
                      <div className={`rounded-xl border p-4 ${
                        faseActual?.cancelada 
                          ? "border-red-500/50 bg-red-500/10" 
                          : estaEnFecha
                          ? "border-emerald-500/50 bg-emerald-500/10"
                          : "border-amber-500/50 bg-amber-500/10"
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {faseActual?.cancelada ? (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                                <path d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                              <p className="font-semibold text-red-300">Fase Cancelada</p>
                            </>
                          ) : estaEnFecha ? (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                              </svg>
                              <p className="font-semibold text-emerald-300">Fase Activa</p>
                            </>
                          ) : (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                                <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                              </svg>
                              <p className="font-semibold text-amber-300">Fase Inactiva</p>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-slate-300">
                          {faseActual?.mensaje || (estaEnFecha 
                            ? (activeFase === "inscripcion" 
                              ? "La fase está activa y se pueden subir inscritos" 
                              : "La fase está activa y se pueden subir notas")
                            : (activeFase === "inscripcion"
                              ? "La fase no está activa, no se pueden subir inscritos"
                              : "La fase no está activa, no se pueden subir notas"))}
                        </p>
                      </div>

                      {/* Fechas */}
                      <div className="rounded-xl border border-white/10 bg-slate-800/50 p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-white">Configuración de Fechas</h3>
                        
                        {editando ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Fecha de Inicio
                              </label>
                              <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-white/20 bg-slate-700/50 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Fecha de Fin
                              </label>
                              <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                min={fechaInicio}
                                className="w-full px-3 py-2 rounded-lg border border-white/20 bg-slate-700/50 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-slate-400">Fecha de Inicio</p>
                              <p className="text-lg font-semibold text-white">
                                {faseActual?.fecha_inicio 
                                  ? new Date(faseActual.fecha_inicio).toLocaleDateString('es-BO', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })
                                  : "No configurada"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400">Fecha de Fin</p>
                              <p className="text-lg font-semibold text-white">
                                {faseActual?.fecha_fin 
                                  ? new Date(faseActual.fecha_fin).toLocaleDateString('es-BO', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })
                                  : "No configurada"}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Botones */}
                        <div className="flex gap-3 pt-4 border-t border-white/10">
                          {editando ? (
                            <>
                              <button
                                onClick={handleGuardar}
                                disabled={guardando}
                                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {guardando ? "Guardando..." : "Guardar Cambios"}
                              </button>
                              <button
                                onClick={() => {
                                  setEditando(false);
                                  if (activeFase === "inscripcion") {
                                    cargarFaseInscripcion();
                                  } else if (activeFase === "asignacion") {
                                    cargarFaseAsignacion();
                                  }
                                }}
                                disabled={guardando}
                                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditando(true)}
                                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                              >
                                Editar
                              </button>
                              <button
                                onClick={handleCancelarFase}
                                disabled={guardando || faseActual?.cancelada}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {guardando ? "Cancelando..." : "Cancelar Fase"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Asignación */}
      {activeFase === "asignacion" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Fase: Asignación (Subida de Notas)</h2>
              <button
                onClick={cerrarFase}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            {loading ? (
              <div className="rounded-xl border border-white/10 bg-slate-800/50 p-6 text-center">
                <p className="text-slate-300">Cargando información...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const faseActual = getFaseActual();
                  const estaEnFecha = verificarSiEstaEnFecha(faseActual);
                  
                  return (
                    <>
                      {/* Estado de la fase */}
                      <div className={`rounded-xl border p-4 ${
                        faseActual?.cancelada 
                          ? "border-red-500/50 bg-red-500/10" 
                          : estaEnFecha
                          ? "border-emerald-500/50 bg-emerald-500/10"
                          : "border-amber-500/50 bg-amber-500/10"
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {faseActual?.cancelada ? (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                                <path d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                              <p className="font-semibold text-red-300">Fase Cancelada</p>
                            </>
                          ) : estaEnFecha ? (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                              </svg>
                              <p className="font-semibold text-emerald-300">Fase Activa</p>
                            </>
                          ) : (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                                <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                              </svg>
                              <p className="font-semibold text-amber-300">Fase Inactiva</p>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-slate-300">
                          {faseActual?.mensaje || (estaEnFecha 
                            ? "La fase está activa y se pueden subir notas" 
                            : "La fase no está activa, no se pueden subir notas")}
                        </p>
                      </div>

                      {/* Fechas */}
                      <div className="rounded-xl border border-white/10 bg-slate-800/50 p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-white">Configuración de Fechas</h3>
                        
                        {editando ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Fecha de Inicio
                              </label>
                              <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-white/20 bg-slate-700/50 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Fecha de Fin
                              </label>
                              <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                min={fechaInicio}
                                className="w-full px-3 py-2 rounded-lg border border-white/20 bg-slate-700/50 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-slate-400">Fecha de Inicio</p>
                              <p className="text-lg font-semibold text-white">
                                {faseActual?.fecha_inicio 
                                  ? new Date(faseActual.fecha_inicio).toLocaleDateString('es-BO', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })
                                  : "No configurada"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-400">Fecha de Fin</p>
                              <p className="text-lg font-semibold text-white">
                                {faseActual?.fecha_fin 
                                  ? new Date(faseActual.fecha_fin).toLocaleDateString('es-BO', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })
                                  : "No configurada"}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Botones */}
                        <div className="flex gap-3 pt-4 border-t border-white/10">
                          {editando ? (
                            <>
                              <button
                                onClick={handleGuardar}
                                disabled={guardando}
                                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {guardando ? "Guardando..." : "Guardar Cambios"}
                              </button>
                              <button
                                onClick={() => {
                                  setEditando(false);
                                  cargarFaseAsignacion();
                                }}
                                disabled={guardando}
                                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditando(true)}
                                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                              >
                                Editar
                              </button>
                              <button
                                onClick={handleCancelarFase}
                                disabled={guardando || faseActual?.cancelada}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {guardando ? "Cancelando..." : "Cancelar Fase"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Clasificados */}
      {activeFase === "clasificados" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Fase: Clasificados</h2>
              <button
                onClick={cerrarFase}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-800/50 p-6">
              <p className="text-slate-300">Contenido de la fase de Clasificados.</p>
              <p className="text-sm text-slate-400 mt-2">Aquí puedes visualizar y gestionar los participantes clasificados.</p>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

