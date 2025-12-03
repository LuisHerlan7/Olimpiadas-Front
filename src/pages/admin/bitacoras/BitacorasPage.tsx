import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBitacoras } from "../../../services/bitacoras";
import type { BitacoraEntry } from "../../../services/bitacoras";

type State = {
  loading: boolean;
  error: string | null;
  data: BitacoraEntry[];
  page: number;
  lastPage: number;
  total: number;
};

export default function BitacorasPage() {
  const [state, setState] = useState<State>({
    loading: true,
    error: null,
    data: [],
    page: 1,
    lastPage: 1,
    total: 0,
  });

  const load = async (page: number) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetchBitacoras({ page, per_page: 50 });
      // Asegurar que los datos estén ordenados del más reciente al más antiguo
      // El backend ya los ordena, pero por si acaso los ordenamos también aquí
      const sortedData = [...res.data].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA; // Más reciente primero
      });
      setState({
        loading: false,
        error: null,
        data: sortedData,
        page: res.current_page,
        lastPage: res.last_page,
        total: res.total,
      });
    } catch (e) {
      console.error(e);
      setState((s) => ({
        ...s,
        loading: false,
        error: "No se pudo cargar la bitácora.",
      }));
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error, data, page, lastPage, total } = state;

  const prevPage = () => {
    if (page > 1) load(page - 1);
  };

  const nextPage = () => {
    if (page < lastPage) load(page + 1);
  };

  const formatFecha = (fecha?: string, hora?: string) => {
    if (!fecha && !hora) return "—";
    try {
      // Si tenemos fecha y hora, combinarlas
      let dateStr = fecha || "";
      if (fecha && hora) {
        dateStr = `${fecha}T${hora}`;
      } else if (fecha && !hora) {
        dateStr = fecha;
      } else if (!fecha && hora) {
        // Si solo tenemos hora, usar fecha de hoy
        const hoy = new Date().toISOString().split("T")[0];
        dateStr = `${hoy}T${hora}`;
      }

      // Parsear como UTC y convertir a hora local de Bolivia (UTC-4)
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        // Formatear en zona horaria de Bolivia
        return d.toLocaleString("es-BO", {
          timeZone: "America/La_Paz",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }
    } catch {}
    return fecha || hora || "—";
  };

  const getTipoColor = (tipo: string) => {
    const t = tipo.toUpperCase();
    if (t === "ADMIN" || t === "ADMINISTRADOR") return "text-purple-300 bg-purple-500/15";
    if (t === "EVALUADOR") return "text-cyan-300 bg-cyan-500/15";
    if (t === "RESPONSABLE") return "text-emerald-300 bg-emerald-500/15";
    return "text-slate-300 bg-slate-500/15";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      {/* Topbar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div>
            <h1 className="text-lg font-bold text-white">Bitácoras del sistema</h1>
            <p className="text-xs text-slate-400">
              Registro de conexiones, acciones y movimientos de usuarios
            </p>
          </div>
          <Link
            to="/admin"
            className="rounded-xl bg-cyan-600/80 px-3 py-1.5 text-xs md:text-sm font-semibold text-white shadow hover:bg-cyan-500"
          >
            ← Volver al panel
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        {/* Encabezado */}
        <section className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Historial de actividad
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Total registros: <span className="font-semibold text-slate-200">{total}</span>
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs text-slate-300 border border-white/10">
            <span>Página</span>
            <span className="font-semibold text-white">
              {page} / {lastPage || 1}
            </span>
          </div>
        </section>

        {/* Contenedor tipo chat */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl">
          {loading && (
            <div className="p-6 text-sm text-slate-300 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
              Cargando eventos…
            </div>
          )}

          {error && !loading && (
            <div className="p-6 text-sm text-red-300 bg-red-950/40 border-b border-red-500/30">
              {error}
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div className="p-6 text-sm text-slate-300">
              No hay eventos registrados aún. Los eventos aparecerán aquí cuando los usuarios se conecten o realicen acciones.
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            <div className="overflow-auto max-h-[70vh] p-4 space-y-3">
              {/* Mostrar del más reciente al más antiguo (ordenado por backend) */}
              {data.map((entry) => {
                const fechaHora = formatFecha(entry.fecha, entry.hora);
                const tipoColor = getTipoColor(entry.actor_tipo);

                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:bg-slate-900/60 transition"
                  >
                    {/* Indicador de tipo */}
                    <div className={`flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${tipoColor}`}>
                      {entry.actor_tipo}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-cyan-300">
                          {entry.actor_email}
                        </span>
                        <span className="text-sm text-slate-300">{entry.mensaje}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400">{fechaHora}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Paginación */}
          {!loading && !error && data.length > 0 && (
            <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-slate-950/60 px-4 py-3 text-xs text-slate-300">
              <div>
                Mostrando página{" "}
                <span className="font-semibold text-white">
                  {page} de {lastPage || 1}
                </span>
              </div>
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevPage}
                  disabled={page <= 1 || loading}
                  className="rounded-full border border-white/15 bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-100 disabled:cursor-not-allowed disabled:opacity-40 hover:border-cyan-400/50 hover:text-cyan-200"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={nextPage}
                  disabled={page >= lastPage || loading}
                  className="rounded-full border border-cyan-500/60 bg-cyan-600/80 px-3 py-1 text-xs font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-cyan-500"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
