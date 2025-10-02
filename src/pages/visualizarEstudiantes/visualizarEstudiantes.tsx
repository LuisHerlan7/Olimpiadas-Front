import { useState } from "react";
import { Search, UserPlus } from "lucide-react";

type StudentStatus = "Activo" | "Pendiente" | "Inactivo";

interface Student {
  id: string;
  name: string;
  school: string;
  subject: string;
  course: string;
  status: StudentStatus;
}

const studentsData: Student[] = [
  {
    id: "EST-2024-001",
    name: "Ana María Gutierrez",
    school: "UE: San Simón",
    subject: "Matemáticas",
    course: "5° Secundaria",
    status: "Activo",
  },
  {
    id: "EST-2024-002",
    name: "Carlos Mendoza López",
    school: "Colegio Nacional Bolívar",
    subject: "Física",
    course: "5° Secundaria",
    status: "Activo",
  },
  {
    id: "EST-2024-003",
    name: "María Elena Vargas",
    school: "UE: Adventista",
    subject: "Química",
    course: "4° Secundaria",
    status: "Pendiente",
  },
  {
    id: "EST-2024-004",
    name: "Diego Fernández",
    school: "Colegio La Salle",
    subject: "Informática",
    course: "5° Secundaria",
    status: "Activo",
  },
  {
    id: "EST-2024-005",
    name: "Lucía Morales Paz",
    school: "UE: Sagrado Corazón",
    subject: "Biología",
    course: "3° Secundaria",
    status: "Activo",
  },
  {
    id: "EST-2024-006",
    name: "Roberto Silva Cruz",
    school: "Colegio Alemán",
    subject: "Matemáticas",
    course: "5° Secundaria",
    status: "Inactivo",
  },
];

export default function Students() {
  const [students] = useState(studentsData);

  const statusColors: Record<StudentStatus, string> = {
    Activo: "bg-green-100 text-green-700",
    Pendiente: "bg-yellow-100 text-yellow-700",
    Inactivo: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">O!Sansi</h1>
        <nav className="space-x-6 text-gray-600 font-medium">
          <a href="#">Dashboard</a>
          <a href="#" className="text-blue-600 font-semibold">Estudiantes</a>
          <a href="#">Competencias</a>
          <a href="#">Resultados</a>
        </nav>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Admin
        </button>
      </header>

      {/* BANNER */}
      <section className="bg-white shadow-sm mx-6 mt-6 p-6 rounded-xl">
        <h2 className="text-xl font-bold text-red-600">Registro de Estudiantes</h2>
        <p className="text-gray-500">
          Gestión completa de participantes en las Olimpiadas Académicas de Bolivia
        </p>

        <div className="mt-4 flex flex-wrap gap-4 items-center">
          <div className="relative w-72">
            <Search className="absolute top-2.5 left-2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              className="pl-8 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <select className="border rounded-lg px-3 py-2">
            <option>Todas las áreas</option>
          </select>
          <select className="border rounded-lg px-3 py-2">
            <option>Todos los cursos</option>
          </select>

          <select className="border rounded-lg px-3 py-2">
            <option>Nombre (A-Z)</option>
          </select>

          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
            <UserPlus size={18} /> Nuevo Estudiante
          </button>
        </div>
      </section>

      {/* STUDENT CARDS */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{student.name}</h3>
              <span
                className={`text-xs px-3 py-1 rounded-full ${statusColors[student.status]}`}
              >
                {student.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">ID: {student.id}</p>
            <p className="text-sm text-gray-600">{student.school}</p>
            <p className="text-sm text-gray-600">{student.subject}</p>
            <p className="text-sm text-gray-600">{student.course}</p>
            <button className="mt-2 bg-blue-600 text-white py-2 rounded-lg text-sm">
              Ver Detalles
            </button>
          </div>
        ))}
      </main>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 my-6">
        <button className="px-3 py-1 rounded-lg border">{"<"}</button>
        <button className="px-3 py-1 rounded-lg bg-blue-600 text-white">1</button>
        <button className="px-3 py-1 rounded-lg border">2</button>
        <button className="px-3 py-1 rounded-lg border">...</button>
        <button className="px-3 py-1 rounded-lg border">25</button>
        <button className="px-3 py-1 rounded-lg border">{">"}</button>
      </div>

      {/* FOOTER */}
      <footer className="bg-white shadow-inner p-6 mt-auto text-gray-600 text-sm">
        <div className="flex flex-wrap justify-between gap-6">
          <div>
            <h3 className="font-bold text-blue-600">O!Sansi</h3>
            <p>
              Plataforma oficial de las Olimpiadas Académicas para colegios de
              Bolivia, desarrollada por la Universidad Mayor de San Simón.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Enlaces Rápidos</h4>
            <ul className="space-y-1">
              <li>Registro Estudiantes</li>
              <li>Registro Docentes</li>
              <li>Encargados de Área</li>
              <li>Requisitos</li>
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
            <p>+591 4 4524563</p>
            <p>UMSS, Cochabamba, Bolivia</p>
          </div>
        </div>
        <p className="mt-6 text-center text-gray-400 text-xs">
          © 2024 O!Sansi – Universidad Mayor de San Simón. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
