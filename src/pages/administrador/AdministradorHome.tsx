import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function AdministradorHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // ejemplo si usas token
    navigate("/"); // redirige al homepage
  };

  const cards = [
    {
      title: "Registrar Evaluadores",
      description:
        "Agregar nuevos evaluadores al sistema y gestionar sus datos.",
      button: "Gestionar",
      color: "bg-red-100 text-red-600 hover:bg-red-200",
    },
    {
      title: "Asignar Evaluadores",
      description:
        "Asignar evaluadores a las áreas de competencia correspondientes.",
      button: "Gestionar",
      color: "bg-red-100 text-red-600 hover:bg-red-200",
    },
    {
      title: "Competencias",
      description:
        "Crear, modificar y eliminar áreas de competencia y sus niveles.",
      button: "Gestionar",
      color: "bg-red-100 text-red-600 hover:bg-red-200",
    },
    {
      title: "Informes",
      description: "Revisar y recibir informes académicos y de resultados.",
      button: "Ver Informes",
      color: "bg-red-100 text-red-600 hover:bg-red-200",
    },
    {
      title: "Resultados",
      description:
        "Administrar los resultados de las competencias en el sistema.",
      button: "Gestionar",
      color: "bg-red-100 text-red-600 hover:bg-red-200",
    },
    {
      title: "Estudiantes",
      description:
        "Gestionar los participantes inscritos en las olimpiadas.",
      button: "Gestionar",
      color: "bg-red-100 text-red-600 hover:bg-red-200",
      path: "/visualizar-estudiantes",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-blue-600">Oh!Sansi</h1>
          <span className="text-sm text-gray-500">
            Olimpiadas Académicas
          </span>
        </div>

        <nav className="space-x-6 text-gray-600 font-medium">
          <Link to="/" className="text-red-600 font-semibold">
            Inicio
          </Link>
          <Link to="/visualizar-estudiantes">Estudiantes</Link>
          <Link to="/competencias">Competencias</Link>
          <Link to="/resultados">Resultados</Link>
        </nav>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Hola, Adriana
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999]">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-600 transition"
              >
                <LogOut size={18} className="mr-2" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* HERO / PANEL */}
      <section className="relative bg-white shadow-sm mx-6 mt-6 p-8 rounded-xl text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Panel de Administrador
        </h2>
        <p className="text-gray-500 mt-2">
          Desde aquí puedes gestionar el sistema de Olimpiadas: evaluadores,
          áreas, niveles, unidades educativas y participantes.
        </p>
      </section>

      {/* CARDS GRID */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition"
          >
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{card.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{card.description}</p>
            </div>
            {"path" in card && card.path ? (
              <Link
                to={card.path}
                className={`mt-6 inline-block ${card.color} font-semibold px-4 py-2 rounded-lg transition`}
              >
                {card.button}
              </Link>
            ) : (
              <button
                className={`mt-6 ${card.color} font-semibold px-4 py-2 rounded-lg transition`}
              >
                {card.button}
              </button>
            )}
          </div>
        ))}
      </main>

      {/* FOOTER */}
      <footer className="bg-white shadow-inner p-6 mt-auto text-gray-600 text-sm">
        <div className="flex flex-wrap justify-between gap-6">
          <div>
            <h3 className="font-bold text-blue-600">Oh!Sansi</h3>
            <p>
              Plataforma oficial de las Olimpiadas Académicas para colegios de
              Bolivia, desarrollada por la Universidad Mayor de San Simón.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Enlaces Rápidos</h4>
            <ul className="space-y-1">
              <li>Registro Evaluadores</li>
              <li>Asignar Evaluadores</li>
              <li>Competencias</li>
              <li>Informes</li>
              <li>Resultados</li>
              <li>Estudiantes</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Competencias</h4>
            <ul className="space-y-1">
              <li>Matemáticas</li>
              <li>Física</li>
              <li>Química</li>
              <li>Biología</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Contacto</h4>
            <p>info@osansi.umss.edu.bo</p>
            <p>+591 4 4542563</p>
            <p>UMSS, Cochabamba, Bolivia</p>
          </div>
        </div>
        <p className="mt-6 text-center text-gray-400 text-xs">
          © 2024 Oh!Sansi – Universidad Mayor de San Simón. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}
