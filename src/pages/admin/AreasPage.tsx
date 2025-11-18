import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { listAreas, type Area } from "../../services/areas";

export default function AdminAreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const a = await listAreas({ per_page: 1000 });
        if (!mounted) return;
        setAreas(a || []);
      } catch (err) {
        // Silencioso: si no hay endpoint, mostramos vacío
        if (!mounted) return;
        setAreas([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-slate-100">
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
              <table className="w-full min-w-[640px] table-auto text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Nombre</th>
                    <th className="pb-2">Código</th>
                    <th className="pb-2">Estado</th>
                    <th className="pb-2">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {/** Dinámico: listar áreas desde el backend */}
                  {/** Usamos estado local para evitar romper si el endpoint no existe aún */}
                  {areas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No hay áreas registradas.
                      </td>
                    </tr>
                  ) : (
                    areas.map((a: Area) => (
                      <tr key={a.id}>
                        <td className="py-3 text-slate-300">{a.id}</td>
                        <td className="py-3 text-slate-300">{a.nombre}</td>
                        <td className="py-3 text-slate-300">{(a as any).codigo ?? "—"}</td>
                        <td className={`py-3 ${a.activo ? "text-emerald-400 font-medium" : "text-slate-300"}`}>
                          {a.activo ? "Activo" : "Inactivo"}
                        </td>
                        <td className="py-3">
                          <Link to={`/admin/areas/${a.id}`} className="text-cyan-300 font-semibold">
                            Editar
                          </Link>
                        </td>
                      </tr>
                    ))
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
