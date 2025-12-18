import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

interface Competencia {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function CompetenciasPage() {
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComp, setNewComp] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    fetchCompetencias();
  }, []);

  const fetchCompetencias = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Competencia[]>('/competencias');
      setCompetencias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando competencias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/competencias', newComp);
      setNewComp({ nombre: '', descripcion: '' });
      fetchCompetencias(); // Recarga la lista
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "No se pudo crear la competencia";
      const errors = error?.response?.data?.errors;
      
      if (errors) {
        const errorDetails = Object.values(errors).flat().join(". ");
        alert(`${errorMessage}. ${errorDetails}`);
      } else {
        alert(errorMessage);
      }
      console.error("Error creando competencia:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white text-xl animate-pulse font-bold">Cargando Competencias...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white">
      {/* Header Estilo SanSi */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div>
            <h1 className="text-lg font-bold">Gestión de Competencias</h1>
            <p className="text-xs text-slate-400">Administración de eventos y retos</p>
          </div>
          <Link
            to="/admin"
            className="rounded-xl bg-cyan-600/80 px-4 py-2 text-sm font-semibold shadow hover:bg-cyan-500 transition-all"
          >
            ← Volver al Admin
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        
        {/* Formulario de Creación */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold mb-6">Crear Nueva Competencia</h2>
          <form onSubmit={handleCreate} className="bg-slate-900/70 p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Nombre de la Competencia</label>
                <input
                  type="text"
                  placeholder="Ej: Algoritmos Avanzados"
                  value={newComp.nombre}
                  onChange={(e) => setNewComp({ ...newComp, nombre: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Descripción o Detalles</label>
                <textarea
                  placeholder="Describe de qué trata esta competencia..."
                  value={newComp.descripcion}
                  onChange={(e) => setNewComp({ ...newComp, descripcion: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all h-32"
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="mt-6 w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 px-10 py-4 rounded-2xl font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              Crear Competencia
            </button>
          </form>
        </section>

        {/* Listado de Competencias (El diseño que querías) */}
        <section>
          <h2 className="text-2xl font-extrabold mb-6">Competencias Existentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {competencias.length > 0 ? (
              competencias.map((comp) => (
                <div 
                  key={comp.id} 
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-6 hover:bg-slate-800/60 transition-all hover:-translate-y-1"
                >
                  {/* Decoración visual de la tarjeta */}
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
                  
                  <h3 className="text-xl font-bold text-cyan-400 mb-3">{comp.nombre}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {comp.descripcion}
                  </p>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">ID: #{comp.id}</span>
                    <button className="text-cyan-500 hover:text-cyan-300 text-sm font-semibold transition-colors">
                      Ver detalles →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-slate-500 italic">No hay competencias registradas todavía.</p>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}