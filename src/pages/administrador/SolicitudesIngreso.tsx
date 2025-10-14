import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, ArrowLeft, CheckCircle, XCircle, Clock, User, Mail, Phone, School } from "lucide-react";

export default function SolicitudesIngreso() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("todas");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Datos de ejemplo para las solicitudes
  const solicitudes = [
    {
      id: 1,
      nombre: "María González",
      email: "maria.gonzalez@colegio.edu.bo",
      telefono: "+591 7 1234-5678",
      colegio: "Colegio San José",
      nivel: "Secundaria",
      competencia: "Matemáticas",
      fecha: "2024-01-15",
      estado: "pendiente",
      documentos: ["Cédula", "Certificado de Nacimiento", "Certificado de Estudios"]
    },
    {
      id: 2,
      nombre: "Carlos Mendoza",
      email: "carlos.mendoza@colegio.edu.bo",
      telefono: "+591 7 2345-6789",
      colegio: "Colegio La Salle",
      nivel: "Secundaria",
      competencia: "Física",
      fecha: "2024-01-14",
      estado: "aprobada",
      documentos: ["Cédula", "Certificado de Nacimiento", "Certificado de Estudios"]
    },
    {
      id: 3,
      nombre: "Ana Rodríguez",
      email: "ana.rodriguez@colegio.edu.bo",
      telefono: "+591 7 3456-7890",
      colegio: "Colegio San Ignacio",
      nivel: "Secundaria",
      competencia: "Química",
      fecha: "2024-01-13",
      estado: "rechazada",
      documentos: ["Cédula", "Certificado de Nacimiento"]
    },
    {
      id: 4,
      nombre: "Luis Fernández",
      email: "luis.fernandez@colegio.edu.bo",
      telefono: "+591 7 4567-8901",
      colegio: "Colegio San Martín",
      nivel: "Secundaria",
      competencia: "Biología",
      fecha: "2024-01-12",
      estado: "pendiente",
      documentos: ["Cédula", "Certificado de Nacimiento", "Certificado de Estudios", "Carta de Recomendación"]
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "aprobada":
        return "bg-green-100 text-green-800";
      case "rechazada":
        return "bg-red-100 text-red-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "aprobada":
        return <CheckCircle className="w-4 h-4" />;
      case "rechazada":
        return <XCircle className="w-4 h-4" />;
      case "pendiente":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    if (filterStatus === "todas") return true;
    return solicitud.estado === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
        <div className="flex items-center gap-4">
          <Link 
            to="/administrador" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al Panel</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-blue-600">Oh!Sansi</h1>
            <span className="text-sm text-gray-500">
              Olimpiadas Académicas
            </span>
          </div>
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
      <section className="relative bg-white shadow-sm mx-6 mt-6 p-8 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Solicitudes de Ingreso
            </h2>
            <p className="text-gray-500 mt-2">
              Revisa y gestiona las solicitudes de ingreso de nuevos participantes.
            </p>
          </div>
          
          {/* FILTROS */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("todas")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === "todas"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterStatus("pendiente")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === "pendiente"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilterStatus("aprobada")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === "aprobada"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Aprobadas
            </button>
            <button
              onClick={() => setFilterStatus("rechazada")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === "rechazada"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Rechazadas
            </button>
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-800">{solicitudes.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {solicitudes.filter(s => s.estado === "pendiente").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Aprobadas</p>
                <p className="text-2xl font-bold text-green-800">
                  {solicitudes.filter(s => s.estado === "aprobada").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Rechazadas</p>
                <p className="text-2xl font-bold text-red-800">
                  {solicitudes.filter(s => s.estado === "rechazada").length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </section>

      {/* LISTA DE SOLICITUDES */}
      <main className="mx-6 mt-6 space-y-4">
        {solicitudesFiltradas.map((solicitud) => (
          <div
            key={solicitud.id}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {solicitud.nombre}
                    </h3>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(solicitud.estado)}`}>
                    {getEstadoIcon(solicitud.estado)}
                    {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{solicitud.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{solicitud.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{solicitud.colegio}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Competencia:</span> {solicitud.competencia}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Documentos adjuntos:</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {solicitud.documentos.map((doc, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <span className="font-medium">Fecha de solicitud:</span> {solicitud.fecha}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                {solicitud.estado === "pendiente" && (
                  <>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium">
                      Aprobar
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium">
                      Rechazar
                    </button>
                  </>
                )}
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}

        {solicitudesFiltradas.length === 0 && (
          <div className="bg-white shadow-md rounded-xl p-12 text-center">
            <div className="text-gray-400 mb-4">
              <User className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No hay solicitudes
            </h3>
            <p className="text-gray-500">
              No se encontraron solicitudes con el filtro seleccionado.
            </p>
          </div>
        )}
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
