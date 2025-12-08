// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Conn = "checking" | "ok" | "error";

type Area = {
  name: string;
  subject: string;
  color: string;
};

type Activity = {
  title: string;
  date: string;
  days: string;
  color: string;
};

export default function HomePage() {
  const [conn, setConn] = useState<Conn>("checking");

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await fetch("/api/ping");
        if (!mounted) return;
        setConn(res.status === 200 ? "ok" : "error");
      } catch {
        if (!mounted) return;
        setConn("error");
      }
    };
    check();
    const id = setInterval(check, 10000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  // Definición de areas con tipos
  const areas: Area[] = [
    { name: "Matemáticas", subject: "Físico", color: "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30" },
    { name: "Química", subject: "Ciencias", color: "bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/30" },
    { name: "Biología", subject: "Ciencias", color: "bg-gradient-to-br from-lime-500/20 to-green-500/20 border-lime-500/30" },
    { name: "Historia", subject: "Sociales", color: "bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-500/30" },
    { name: "Geografía", subject: "Sociales", color: "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30" },
    { name: "Lógica", subject: "Básicas", color: "bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/30" }
  ];

  // Definición de activities con tipos
  const activities: Activity[] = [
    {
      title: "Cierre de Registros",
      date: "1 de Noviembre a las 23:30",
      days: "3 días",
      color: "border-rose-500/30 bg-rose-500/10"
    },
    {
      title: "Inicio de Evaluaciones",
      date: "20 de Noviembre a las 08:00",
      days: "9 días",
      color: "border-emerald-500/30 bg-emerald-500/10"
    },
    {
      title: "Ceremonia de Premiación",
      date: "5 de Diciembre a las 19:00",
      days: "23 días",
      color: "border-amber-500/30 bg-amber-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                {/* Aquí podrías poner tu logo en svg o imagen */}
                <span className="text-cyan-400 font-bold text-xl">Logo</span>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Oh! SanS
                </h1>
                <p className="text-xs text-slate-400 font-medium">UMSS - Sistema de Evaluación</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-12 md:py-20">
        <div className="relative container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm font-medium text-cyan-300">Sistema Oficial</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                Oh! SanS
              </span>
            </h1>

            <h2 className="text-xl md:text-2xl font-bold text-slate-300 mb-4">
              Sistema de Gestión y Evaluación de Olimpiadas Académicas
            </h2>

            <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-10">
              Plataforma integral para la gestión, evaluación y remitencia de olimpiadas académicas de la Universidad Mayor de San Simón
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/resultados"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-cyan-500/25 transition-all hover:-translate-y-0.5"
              >
                {/* Aquí ícono de ojo o similar (puedes usar una imagen o SVG simple) */}
                <span>Ver Resultados</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Próximas Actividades */}
      <section className="px-4 py-16 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Próximas Actividades
            </h2>
            <p className="text-slate-400 mt-2">Cronograma de eventos importantes de las olimpiadas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {activities.map((activity, index) => (
              <div
                key={index}
                className={`rounded-2xl border ${activity.color} p-6 backdrop-blur-sm hover:border-opacity-50 transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{activity.title}</h3>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/5 border border-white/10 text-white">
                    {activity.days}
                  </span>
                </div>
                <p className="text-slate-300">{activity.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Áreas de Competencia */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
              Áreas de Competencia
            </h2>
            <p className="text-slate-400 mt-2">Disciplinas académicas disponibles para las olimpiadas</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {areas.map((area, index) => (
              <div
                key={index}
                className={`rounded-xl ${area.color} p-4 text-center border backdrop-blur-sm hover:border-opacity-60 transition-all group`}
              >
                <div className="text-2xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                  {area.name.charAt(0)}
                </div>
                <h4 className="font-bold text-white mb-1">{area.name}</h4>
                <p className="text-xs text-slate-300">{area.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Badge de conexión */}
      <div
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-3.5 py-2 text-white shadow-2xl border border-white/10 backdrop-blur-sm
          ${conn === "ok" ? "bg-emerald-600/90" : conn === "error" ? "bg-rose-600/90" : "bg-amber-500/90"}`}
      >
        <span className={`h-2.5 w-2.5 rounded-full ${conn === "checking" ? "animate-pulse" : ""}`} />
        <span className="text-xs font-semibold">
          {conn === "ok" ? "Conectado" : conn === "error" ? "Sin conexión" : "Verificando..."}
        </span>
      </div>
    </div>
  );
}