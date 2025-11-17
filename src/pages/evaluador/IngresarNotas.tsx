// src/pages/evaluador/IngresarNotas.tsx
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  getAsignadas,
  guardarEvaluacion,
  finalizarEvaluacion,
  type Concepto,
  type InscritoAsignado,
  toDecimal2,
} from "../../services/evaluaciones";
import { getFaseAsignacion, type FaseInscripcion } from "../../services/fases";

// ====== Configurables ======
const APROBADO_DESDE = 70; // Nota mínima para "APROBADO"

// ====== Tipos de estado por fila ======
type RowState = {
  nota_final: string;                 // como string (permitir coma)
  concepto: Concepto | "";            // valor del select
  conceptoManual: boolean;            // true si el usuario lo cambió manualmente
  desclasificar: boolean;             // toggle
  observaciones: string;              // motivo si desclasifica
  estado: "borrador" | "finalizado" | "";
  saving?: boolean;
  error?: string | null;
};

const CONCEPTOS: Concepto[] = ["APROBADO", "DESAPROBADO", "DESCLASIFICADO"];

// Helpers UI
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function nombreCompleto(i: InscritoAsignado) {
  return `${i.apellidos ?? ""} ${i.nombres ?? ""}`.trim();
}
// Acepta relación {id,nombre} o string llano
function getAreaNombre(i: InscritoAsignado): string {
  if (i.area && typeof i.area === "object") return i.area.nombre;
  if (typeof i.area === "string") return i.area;
  return "—";
}
function getNivelNombre(i: InscritoAsignado): string {
  if (i.nivel && typeof i.nivel === "object") return i.nivel.nombre;
  if (typeof i.nivel === "string") return i.nivel;
  return "—";
}

export default function IngresarNotas() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<InscritoAsignado[]>([]);
  const [meta, setMeta] = useState<{ current: number; last: number; total: number }>({
    current: 1,
    last: 1,
    total: 0,
  });
  const [local, setLocal] = useState<Record<number, RowState>>({});
  const [loading, setLoading] = useState(true);
  const [faseAsignacion, setFaseAsignacion] = useState<FaseInscripcion | null>(null);
  const [loadingFase, setLoadingFase] = useState(true);

  // Debounce búsqueda
  const debounceRef = useRef<number | null>(null);
  const debouncedSearch = (value: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setPage(1);
      setSearch(value);
    }, 300);
  };

  // Cargar fase de asignación
  useEffect(() => {
    const fetchFase = async () => {
      setLoadingFase(true);
      try {
        const data = await getFaseAsignacion();
        setFaseAsignacion(data);
      } catch (error) {
        console.error("Error al cargar fase de asignación:", error);
      } finally {
        setLoadingFase(false);
      }
    };
    fetchFase();
  }, []);

  const verificarSiEstaEnFecha = (): boolean => {
    if (!faseAsignacion?.fecha_inicio || !faseAsignacion?.fecha_fin || faseAsignacion?.cancelada) {
      return false;
    }
    const ahora = new Date();
    const inicio = new Date(faseAsignacion.fecha_inicio);
    const fin = new Date(faseAsignacion.fecha_fin);
    return ahora >= inicio && ahora <= fin;
  };

  async function load() {
    setLoading(true);
    try {
      const res = await getAsignadas({ page, per_page: perPage, search: search || undefined });

      // Ordenar: finalizados al final, borradores primero
      const sorted = [...res.data].sort((a, b) => {
        const estadoA = a.evaluacion?.estado || "";
        const estadoB = b.evaluacion?.estado || "";
        if (estadoA === "finalizado" && estadoB !== "finalizado") return 1;
        if (estadoA !== "finalizado" && estadoB === "finalizado") return -1;
        return 0;
      });

      setRows(sorted);
      setMeta({ current: res.current_page, last: res.last_page, total: res.total });

      // Hidratar/sincronizar estado local
      setLocal((prev) => {
        const next: Record<number, RowState> = { ...prev };
        for (const i of sorted) {
          const srvEstado = (i.evaluacion?.estado as "borrador" | "finalizado" | null) ?? "";
          const srvNotaStr = i.evaluacion?.nota_final != null ? String(i.evaluacion.nota_final) : "";
          const srvConcepto = (i.evaluacion?.concepto as Concepto | null) ?? "";

          if (!next[i.id]) {
            const nf = toDecimal2(srvNotaStr);
            const conceptAuto: Concepto | "" =
              nf == null ? "" : nf >= APROBADO_DESDE ? "APROBADO" : "DESAPROBADO";

            next[i.id] = {
              nota_final: srvNotaStr,
              concepto: srvConcepto || conceptAuto,
              conceptoManual: !!srvConcepto && srvConcepto !== "APROBADO" && srvConcepto !== "DESAPROBADO",
              desclasificar: srvConcepto === "DESCLASIFICADO",
              observaciones: "",
              estado: srvEstado,
              error: null,
            };
          } else {
            next[i.id] = { ...next[i.id], estado: srvEstado || next[i.id].estado };
          }
        }
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search]);

  function setField(inscritoId: number, patch: Partial<RowState>) {
    setLocal((prev) => ({ ...prev, [inscritoId]: { ...prev[inscritoId], ...patch } }));
  }

  // ====== Validaciones en cliente ======
  function validarFila(r: RowState, esFinalizado: boolean): string | null {
    if (r.desclasificar) {
      if (!r.observaciones || !r.observaciones.trim()) return "Ingrese el motivo si desclasifica.";
      return null; // nota no obligatoria si desclasifica (la enviaremos 0 para cumplir backend)
    }

    const nf = toDecimal2(r.nota_final);
    if (esFinalizado) {
      if (nf === null) return "Ingrese una nota válida.";
      if (nf < 0 || nf > 100) return "La nota debe estar entre 0.00 y 100.00.";
    } else if (r.nota_final) {
      if (nf === null || nf < 0 || nf > 100) return "La nota debe estar entre 0.00 y 100.00.";
    }
    if (!r.concepto) return "Seleccione un concepto.";
    return null;
  }

  // ====== Reacción a cambios de nota (auto concepto) ======
  function onChangeNota(id: number, value: string) {
    setLocal((prev) => {
      const curr = prev[id];
      if (!curr) return prev;

      let next: RowState = { ...curr, nota_final: value };

      if (!curr.conceptoManual && !curr.desclasificar) {
        const nf = toDecimal2(value);
        next = {
          ...next,
          concepto: nf == null ? "" : nf >= APROBADO_DESDE ? "APROBADO" : "DESAPROBADO",
        };
      }
      return { ...prev, [id]: next };
    });
  }

  // ====== Guardar (borrador) ======
  async function handleGuardar(i: InscritoAsignado) {
    // Verificar si la fase está activa
    if (!verificarSiEstaEnFecha()) {
      setField(i.id, { error: faseAsignacion?.mensaje || "La fase de subida de notas no está activa en este momento." });
      return;
    }

    const st = local[i.id];
    const err = validarFila(st, false);
    if (err) return setField(i.id, { error: err });

    const conceptoToSend: Concepto | null = st.desclasificar ? "DESCLASIFICADO" : (st.concepto || null);

    setField(i.id, { saving: true, error: null });
    try {
      await guardarEvaluacion(i.id, {
        nota_final: st.desclasificar ? null : st.nota_final === "" ? null : st.nota_final,
        concepto: conceptoToSend,
        observaciones: st.desclasificar ? st.observaciones : st.observaciones || null,
      });
      
      // Mover al final de la lista
      setRows((prev) => {
        const updated = [...prev];
        const index = updated.findIndex(r => r.id === i.id);
        if (index !== -1) {
          const [item] = updated.splice(index, 1);
          updated.push(item);
        }
        return updated;
      });
      
      // Actualizar estado local
      setField(i.id, { estado: "borrador" });
    } catch {
      setField(i.id, { error: "No se pudo guardar. Intenta nuevamente." });
    } finally {
      setField(i.id, { saving: false });
    }
  }


  // ====== Finalizar ======
  async function handleFinalizar(i: InscritoAsignado) {
    // Verificar si la fase está activa
    if (!verificarSiEstaEnFecha()) {
      setField(i.id, { error: faseAsignacion?.mensaje || "La fase de subida de notas no está activa en este momento." });
      return;
    }

    const st = local[i.id];
    const err = validarFila(st, true);
    if (err) return setField(i.id, { error: err });

    if (!window.confirm("¿Finalizar evaluación? Ya no podrás editar hasta que el responsable la reabra.")) {
      return;
    }

    const conceptoToSend: Concepto = st.desclasificar
      ? "DESCLASIFICADO"
      : (st.concepto || (toDecimal2(st.nota_final) ?? 0) >= APROBADO_DESDE
          ? "APROBADO"
          : "DESAPROBADO");

    // Para cumplir 'required|numeric' cuando desclasifica:
    const notaParaEnviar = st.desclasificar
      ? (st.nota_final === "" ? 0 : st.nota_final)
      : st.nota_final;

    setField(i.id, { saving: true, error: null });

    try {
      await finalizarEvaluacion(i.id, {
        nota_final: notaParaEnviar,
        concepto: conceptoToSend,
        observaciones: st.desclasificar ? st.observaciones : st.observaciones || null,
        notas: [], //  ← **ARRAY vacío**, no {}
      });
      
      // Mover al final de la lista
      setRows((prev) => {
        const updated = [...prev];
        const index = updated.findIndex(r => r.id === i.id);
        if (index !== -1) {
          const [item] = updated.splice(index, 1);
          updated.push(item);
        }
        return updated;
      });
      
      // Actualizar estado local
      setField(i.id, { estado: "finalizado" });
    } catch (err) {
      const v = err as { status?: number; errors?: Record<string, string[]>; message?: string };
      let msg = "No se pudo finalizar. Revisa los campos obligatorios.";
      if (v?.status === 422 && v.errors) {
        const k = Object.keys(v.errors)[0];
        if (k) msg = v.errors[k][0] ?? msg;
      }
      setField(i.id, { error: msg });
    } finally {
      setField(i.id, { saving: false });
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-slate-100">
      {/* Topbar mínima con volver */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/evaluador/panel"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-200 hover:border-cyan-400/40"
              title="Volver al panel del evaluador"
            >
              <span aria-hidden>←</span> Volver
            </Link>
            <div>
              <h1 className="text-base font-bold text-white">Ingresar notas</h1>
              <p className="text-xs text-slate-400">Resultado conceptual y desclasificación</p>
            </div>
          </div>
          <div className="text-xs text-slate-300">
            Aprobado desde <span className="font-semibold text-white">{APROBADO_DESDE}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {/* Alerta si la fase no está activa */}
        {!loadingFase && !verificarSiEstaEnFecha() && (
          <div className="mb-4 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-amber-200">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
              </svg>
              <p className="font-semibold">Fase de subida de notas cerrada</p>
            </div>
            <p className="mt-2 text-sm text-amber-300/80">
              {faseAsignacion?.mensaje || "La funcionalidad de subir notas está bloqueada porque no estamos en el período de subida de notas."}
            </p>
            {faseAsignacion?.fecha_inicio && faseAsignacion?.fecha_fin && (
              <p className="mt-1 text-xs text-amber-300/60">
                Período: {new Date(faseAsignacion.fecha_inicio).toLocaleDateString()} - {new Date(faseAsignacion.fecha_fin).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Toolbar */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <input
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 outline-none placeholder:text-slate-400 focus:border-cyan-400/40"
                  placeholder="Buscar competidor (nombre, apellido o documento)…"
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-2 grid place-items-center text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M21 21l-4.3-4.3m-2.7 1.3a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <select
                className="rounded-xl border border-white/10 bg-slate-900/60 px-2 py-2 text-sm outline-none focus:border-cyan-400/40"
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                title="Filas por página"
              >
                {[10, 15, 20, 30].map((n) => (
                  <option key={n} value={n}>
                    {n}/pág
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end text-sm text-slate-300">
            <span className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2">
              Total: <span className="font-semibold text-white">{meta.total}</span>
            </span>
          </div>
        </div>

        {/* Tabla - Responsive */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 shadow-2xl">
          {/* Desktop: Tabla normal */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-950/80">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">Competidor</th>
                  <th className="px-4 py-3 font-semibold">Área / Nivel</th>
                  <th className="px-4 py-3 font-semibold">Nota</th>
                  <th className="px-4 py-3 font-semibold">Concepto</th>
                  <th className="px-4 py-3 font-semibold">Motivo</th>
                  <th className="px-4 py-3 font-semibold">Estado / Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, idx) => (
                    <tr key={idx} className="border-t border-white/5">
                      <td className="px-4 py-3" colSpan={6}>
                        <div className="h-5 w-full animate-pulse rounded bg-slate-800/60" />
                      </td>
                    </tr>
                  ))
                ) : rows.length ? (
                  rows.map((i, idx) => {
                    const st =
                      local[i.id] ??
                      ({
                        nota_final: "",
                        concepto: "",
                        conceptoManual: false,
                        desclasificar: false,
                        observaciones: "",
                        estado: "",
                        error: null,
                      } as RowState);

                    const disabled = st.saving || st.estado === "finalizado" || !verificarSiEstaEnFecha();

                    return (
                      <tr
                        key={i.id}
                        className={cn("border-t border-white/5", idx % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/10")}
                      >
                        {/* Competidor */}
                        <td className="px-4 py-3 align-top">
                          <div className="font-semibold text-white">{nombreCompleto(i)}</div>
                          <div className="text-xs text-slate-400">
                            Doc: <span className="font-medium text-slate-300">{i.documento ?? "—"}</span>
                          </div>
                        </td>

                        {/* Área / Nivel */}
                        <td className="px-4 py-3 align-top">
                          <div className="text-xs text-slate-300">
                            Área: <span className="font-medium text-white">{getAreaNombre(i)}</span>
                          </div>
                          <div className="text-xs text-slate-300">
                            Nivel: <span className="font-medium text-white">{getNivelNombre(i)}</span>
                          </div>
                        </td>

                        {/* Nota */}
                        <td className="px-4 py-3 align-top">
                          <input
                            className="w-24 min-w-[80px] rounded-lg border border-white/10 bg-slate-900/60 px-2 py-1 outline-none placeholder:text-slate-500 focus:border-cyan-400/40 disabled:opacity-60"
                            placeholder="0.00"
                            value={st.nota_final}
                            onChange={(e) => onChangeNota(i.id, e.target.value)}
                            disabled={disabled || st.desclasificar}
                            inputMode="decimal"
                          />
                        </td>

                        {/* Concepto */}
                        <td className="px-4 py-3 align-top min-w-[200px]">
                          <div className="flex flex-col gap-2">
                            <select
                              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-2 py-1 text-xs outline-none focus:border-cyan-400/40 disabled:opacity-60"
                              value={st.desclasificar ? "DESCLASIFICADO" : st.concepto}
                              onChange={(e) => {
                                const val = e.target.value as "" | Concepto;
                                if (val === "DESCLASIFICADO") {
                                  setField(i.id, {
                                    desclasificar: true,
                                    concepto: "DESCLASIFICADO",
                                    conceptoManual: true,
                                  });
                                } else {
                                  setField(i.id, {
                                    desclasificar: false,
                                    concepto: val,
                                    conceptoManual: true,
                                  });
                                }
                              }}
                              disabled={disabled}
                            >
                              <option value="">Seleccione…</option>
                              {CONCEPTOS.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>

                            <label className="inline-flex select-none items-center gap-2 text-xs text-slate-300">
                              <input
                                type="checkbox"
                                className="h-3 w-3 rounded border-white/20 bg-slate-900/60"
                                checked={st.desclasificar}
                                onChange={(e) =>
                                  setField(i.id, {
                                    desclasificar: e.target.checked,
                                    concepto: e.target.checked ? "DESCLASIFICADO" : st.concepto,
                                  })
                                }
                                disabled={disabled}
                              />
                              Desclasificar
                            </label>
                          </div>
                        </td>

                        {/* Motivo */}
                        <td className="px-4 py-3 align-top min-w-[200px]">
                          <input
                            className={cn(
                              "w-full max-w-[250px] rounded-lg border border-white/10 bg-slate-900/60 px-2 py-1 text-xs outline-none focus:border-cyan-400/40 disabled:opacity-60",
                              st.desclasificar && "placeholder:text-rose-300"
                            )}
                            placeholder={st.desclasificar ? "Obligatorio" : "—"}
                            value={st.observaciones}
                            onChange={(e) => setField(i.id, { observaciones: e.target.value })}
                            disabled={disabled || !st.desclasificar}
                          />
                        </td>

                        {/* Estado / Acciones */}
                        <td className="px-4 py-3 align-top min-w-[180px]">
                          <div className="mb-2">
                            {st.estado ? (
                              st.estado === "finalizado" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-500/30">
                                  Finalizado
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-2 py-0.5 text-xs font-semibold text-yellow-200 ring-1 ring-yellow-500/30">
                                  Borrador
                                </span>
                              )
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              className="flex-1 min-w-[80px] rounded-lg border border-white/10 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-50 whitespace-nowrap"
                              onClick={() => void handleGuardar(i)}
                              disabled={disabled}
                            >
                              {st.saving ? "Guardando…" : "Guardar"}
                            </button>
                            <button
                              className="flex-1 min-w-[80px] rounded-lg bg-cyan-500 px-2 py-1 text-xs font-semibold text-slate-900 hover:bg-cyan-400 disabled:opacity-50 whitespace-nowrap"
                              onClick={() => void handleFinalizar(i)}
                              disabled={disabled}
                            >
                              {st.saving ? "…" : "Finalizar"}
                            </button>
                          </div>

                          {st.error ? <div className="mt-2 text-xs text-rose-300 break-words">{st.error}</div> : null}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="border-t border-white/5">
                    <td className="px-4 py-6 text-center text-slate-300" colSpan={6}>
                      Sin asignaciones
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet: Cards */}
          <div className="lg:hidden">
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <div key={idx} className="p-4 border-b border-white/5">
                  <div className="h-20 w-full animate-pulse rounded bg-slate-800/60" />
                </div>
              ))
            ) : rows.length ? (
              <div className="divide-y divide-white/5">
                {rows.map((i) => {
                  const st =
                    local[i.id] ??
                    ({
                      nota_final: "",
                      concepto: "",
                      conceptoManual: false,
                      desclasificar: false,
                      observaciones: "",
                      estado: "",
                      error: null,
                    } as RowState);

                  const disabled = st.saving || st.estado === "finalizado" || !verificarSiEstaEnFecha();

                  return (
                    <div key={i.id} className="p-4 space-y-4 bg-slate-900/20">
                      {/* Header: Competidor y Estado */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-semibold text-white">{nombreCompleto(i)}</div>
                          <div className="text-xs text-slate-400">
                            Doc: <span className="font-medium text-slate-300">{i.documento ?? "—"}</span>
                          </div>
                          <div className="mt-1 text-xs text-slate-300">
                            <span className="font-medium">{getAreaNombre(i)}</span> / <span className="font-medium">{getNivelNombre(i)}</span>
                          </div>
                        </div>
                        {st.estado && (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 whitespace-nowrap",
                              st.estado === "finalizado"
                                ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/30"
                                : "bg-yellow-500/15 text-yellow-200 ring-yellow-500/30"
                            )}
                          >
                            {st.estado === "finalizado" ? "Finalizado" : "Borrador"}
                          </span>
                        )}
                      </div>

                      {/* Nota y Concepto */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Nota</label>
                          <input
                            className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-2 py-1.5 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400/40 disabled:opacity-60"
                            placeholder="0.00"
                            value={st.nota_final}
                            onChange={(e) => onChangeNota(i.id, e.target.value)}
                            disabled={disabled || st.desclasificar}
                            inputMode="decimal"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Concepto</label>
                          <select
                            className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-2 py-1.5 text-sm outline-none focus:border-cyan-400/40 disabled:opacity-60"
                            value={st.desclasificar ? "DESCLASIFICADO" : st.concepto}
                            onChange={(e) => {
                              const val = e.target.value as "" | Concepto;
                              if (val === "DESCLASIFICADO") {
                                setField(i.id, {
                                  desclasificar: true,
                                  concepto: "DESCLASIFICADO",
                                  conceptoManual: true,
                                });
                              } else {
                                setField(i.id, {
                                  desclasificar: false,
                                  concepto: val,
                                  conceptoManual: true,
                                });
                              }
                            }}
                            disabled={disabled}
                          >
                            <option value="">Seleccione…</option>
                            {CONCEPTOS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Desclasificar */}
                      <label className="flex items-center gap-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-white/20 bg-slate-900/60"
                          checked={st.desclasificar}
                          onChange={(e) =>
                            setField(i.id, {
                              desclasificar: e.target.checked,
                              concepto: e.target.checked ? "DESCLASIFICADO" : st.concepto,
                            })
                          }
                          disabled={disabled}
                        />
                        Marcar como desclasificado
                      </label>

                      {/* Motivo */}
                      {st.desclasificar && (
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Motivo (obligatorio)</label>
                          <input
                            className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-2 py-1.5 text-sm outline-none focus:border-cyan-400/40 disabled:opacity-60 placeholder:text-rose-300"
                            placeholder="Ingrese el motivo"
                            value={st.observaciones}
                            onChange={(e) => setField(i.id, { observaciones: e.target.value })}
                            disabled={disabled}
                          />
                        </div>
                      )}

                      {/* Error */}
                      {st.error && <div className="text-xs text-rose-300">{st.error}</div>}

                      {/* Acciones */}
                      <div className="flex gap-2 pt-2">
                        <button
                          className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
                          onClick={() => void handleGuardar(i)}
                          disabled={disabled}
                        >
                          {st.saving ? "Guardando…" : "Guardar"}
                        </button>
                        <button
                          className="flex-1 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-400 disabled:opacity-50"
                          onClick={() => void handleFinalizar(i)}
                          disabled={disabled}
                        >
                          {st.saving ? "…" : "Finalizar"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-300">Sin asignaciones</div>
            )}
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between border-t border-white/10 bg-slate-900/50 px-4 py-3 text-sm">
            <div>
              Página <span className="font-semibold text-white">{meta.current}</span> de{" "}
              <span className="font-semibold text-white">{meta.last}</span>
            </div>
            <div className="space-x-2">
              <button
                className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-50"
                disabled={meta.current <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <button
                className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-50"
                disabled={meta.current >= meta.last || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
