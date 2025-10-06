import React from "react";
import {
  FaUserCircle,
  FaClipboardList,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";

interface Competencia {
  id: number;
  nombre: string;
  tipo: string;
  estado: string;
}

interface Usuario {
  nombre: string;
  rol: string;
}

const OlimpistaHome: React.FC = () => {
  // Datos simulados (se reemplazarán luego con datos reales)
  const usuario: Usuario = {
    nombre: "",
    rol: "",
  };

  const competencias: Competencia[] = [];

  return (
    <div className="min-h-screen bg-[#f3f7fc] text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md flex justify-between items-center px-8 py-3">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <div className="bg-blue-900 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
              O!
            </div>
            <span className="ml-2 font-semibold text-lg text-gray-800">
              Oh!Sansi
            </span>
          </div>

          <nav className="hidden md:flex gap-6 text-gray-700 font-medium text-sm">
            {["Inicio", "Participantes", "Certificados", "Competencias", "Resultados", "Cronograma"].map(
              (item, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`hover:text-blue-600 ${
                    item === "Participantes"
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : ""
                  }`}
                >
                  {item}
                </a>
              )
            )}
          </nav>
        </div>

        {/* Perfil */}
        <div className="flex items-center gap-3 bg-blue-100 px-3 py-1 rounded-full">
          <FaUserCircle className="text-blue-700 text-xl" />
          <span className="text-blue-800 font-medium text-sm">
            {usuario.nombre || "Usuario"}
          </span>
          <span className="bg-blue-700 text-white text-xs px-2 py-1 rounded-md">
            {usuario.rol || "Rol"}
          </span>
        </div>
      </header>

      {/* Contenido */}
      <main className="px-10 py-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Panel de Participante
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Gestiona tus olimpiadas académicas
        </p>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {/* Inscripción */}
          <Card
            title="Inscribirse a Competición"
            icon={<FaClipboardList className="text-blue-700 text-lg" />}
          >
            {competencias.length > 0 ? (
              <ul className="space-y-3">
                {competencias.map((comp) => (
                  <li
                    key={comp.id}
                    className="border p-3 rounded-lg flex justify-between items-center hover:bg-blue-50 transition"
                  >
                    <div>
                      <p className="font-medium">{comp.nombre}</p>
                      <p className="text-xs text-gray-500">{comp.tipo}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        comp.estado === "Nuevo"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {comp.estado}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyMessage mensaje="No hay competiciones disponibles" />
            )}
          </Card>

          {/* Resultados */}
          <Card
            title="Mis Resultados"
            icon={<MdOutlineLeaderboard className="text-yellow-600 text-lg" />}
          >
            <EmptyMessage mensaje="Aún no tienes resultados disponibles" />
          </Card>

          {/* Certificados */}
          <Card
            title="Mis Certificados"
            icon={<FaTrophy className="text-green-700 text-lg" />}
          >
            <EmptyMessage mensaje="Todavía no has obtenido certificados" />
          </Card>

          {/* Cronograma */}
          <Card
            title="Cronograma"
            icon={<FaCalendarAlt className="text-purple-700 text-lg" />}
          >
            <EmptyMessage mensaje="No hay eventos próximos" />
          </Card>
        </div>
      </main>
    </div>
  );
};

// ─────────────────────────────
// 🔹 COMPONENTES REUTILIZABLES
// ─────────────────────────────
interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, icon, children }) => (
  <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-semibold text-gray-700">{title}</h2>
      {icon}
    </div>
    <div>{children}</div>
  </div>
);

const EmptyMessage: React.FC<{ mensaje: string }> = ({ mensaje }) => (
  <div className="text-gray-400 text-sm italic py-6 text-center border border-dashed rounded-lg">
    {mensaje}
  </div>
);

export default OlimpistaHome;
