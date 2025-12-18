import { Link } from "react-router-dom";

export default function CompetenciasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      {/* Topbar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div>
            <h1 className="text-lg font-bold text-white">Gestión de Competencias</h1>
            <p className="text-xs text-slate-400">OH SanSi — Administración de competencias</p>
          </div>
          <Link
            to="/admin"
            className="rounded-xl bg-cyan-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-cyan-500"
          >
            ← Volver al Admin
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        {/* Encabezado */}
        <section className="mb-8">
          <h2 className="text-2xl font-extrabold text-white mb-1">Competencias del Sistema</h2>
          <p className="text-slate-400 text-sm">
            Gestiona las competencias disponibles en el sistema.
          </p>
        </section>

        {/* Contenido - Placeholder */}
        <section>
          <p className="text-white">Aquí irá la gestión de competencias.</p>
        </section>
      </main>
    </div>
  );
}