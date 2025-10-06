import React, { useState } from "react";
import { FaChalkboardTeacher, FaCheckCircle } from "react-icons/fa";

function RegistroDocente() {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    ci: "",
    email: "",
    telefono: "",
    colegio: "",
    departamento: "",
    especialidad: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      console.log("Datos del docente:", form);
      setMensaje("¡Registro enviado! (demo sin base de datos)");
      setForm({
        nombres: "",
        apellidos: "",
        ci: "",
        email: "",
        telefono: "",
        colegio: "",
        departamento: "",
        especialidad: "",
      });
      setLoading(false);
      setTimeout(() => setMensaje(""), 2500);
    }, 900);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-900 via-black to-red-900">
      {/* Fondos difuminados (azul/rojo/blanco) */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-red-500/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-white/20 blur-3xl" />

      {/* Imagen decorativa superior (cambia la ruta si quieres) */}
      <div className="absolute inset-x-0 top-0 flex justify-center opacity-20">
        <img
          src="/Imagenes/estudianteshome.png"
          alt="Fondo Olimpiadas"
          className="h-52 object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 shadow-xl backdrop-blur">
            <FaChalkboardTeacher className="text-white text-2xl" />
            <span className="text-white font-semibold">Registro de Docentes</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-red-300 drop-shadow">
            Olimpiadas Académicas Bolivia – UMSS
          </h1>
          <p className="mt-3 text-blue-100/90">
            Completa tus datos para participar como docente responsable.
          </p>
        </header>

        {/* Tarjeta principal con glassmorphism */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel ilustración */}
          <aside className="order-2 lg:order-1">
            <div className="h-full rounded-2xl p-4 sm:p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="relative overflow-hidden rounded-xl h-64 sm:h-80">
                <img
                  src="/Imagenes/docentes.png" /* coloca una imagen de docentes aquí */
                  alt="Docentes"
                  className="h-full w-full object-cover opacity-90"
                  onError={(e) => {
                    // fallback si no existe la imagen
                    (e.target as HTMLImageElement).src = "/Imagenes/estudianteshome.png";
                  }}
                />
                {/* Overlay degradé */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-white font-bold text-lg">Docentes UMSS</h3>
                  <p className="text-blue-100 text-sm">
                    Acompaña, registra y potencia la participación estudiantil.
                  </p>
                </div>
              </div>

              {/* Puntos/ventajas */}
              <ul className="mt-5 space-y-3 text-blue-100">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-300" />
                  Gestión de equipos y seguimiento
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-300" />
                  Resultados y certificados
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-white/80" />
                  Coordinación con encargados de área
                </li>
              </ul>
            </div>
          </aside>

          {/* Formulario */}
          <section className="order-1 lg:order-2">
            <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="p-5 sm:p-7">
                {mensaje && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-100/90 px-4 py-3 text-emerald-800 shadow">
                    <FaCheckCircle className="text-xl" />
                    <p className="font-medium">{mensaje}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm text-blue-100 mb-1">Nombres *</label>
                    <input
                      className="w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                      name="nombres"
                      placeholder="Ej. María Fernanda"
                      value={form.nombres}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm text-blue-100 mb-1">Apellidos *</label>
                    <input
                      className="w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                      name="apellidos"
                      placeholder="Ej. López Rojas"
                      value={form.apellidos}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm text-blue-100 mb-1">CI *</label>
                    <input
                      className="w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                      name="ci"
                      placeholder="Ej. 12345678 CB"
                      value={form.ci}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm text-blue-100 mb-1">Correo electrónico *</label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                      name="email"
                      placeholder="docente@colegio.edu.bo"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm text-blue-100 mb-1">Teléfono</label>
                    <input
                      className="w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                      name="telefono"
                      placeholder="+591 7xxxxxxx"
                      value={form.telefono}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm text-blue-100 mb-1">Unidad educativa</label>
                    <input
                      className="w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                      name="colegio"
                      placeholder="Ej. Colegio Nacional Avaroa"
                      value={form.colegio}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm text-blue-100 mb-1">Departamento</label>
                    <input
                      className="w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                      name="departamento"
                      placeholder="Ej. Cochabamba"
                      value={form.departamento}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm text-blue-100 mb-1">Especialidad</label>
                    <input
                      className="w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-red-400 placeholder-gray-500"
                      name="especialidad"
                      placeholder="Matemática, Física, Química…"
                      value={form.especialidad}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2 mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-gradient-to-r from-blue-700 via-white/80 to-red-700 text-black font-extrabold py-3 shadow-xl hover:brightness-110 transition disabled:opacity-60"
                    >
                      {loading ? "Enviando..." : "Registrar Docente"}
                    </button>
                  </div>
                </form>

                {/* Nota demo */}
                <p className="mt-3 text-xs text-blue-100/70">
                  * Demostración frontend (no guarda en base de datos).
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer mini */}
        <div className="mt-10 text-center text-xs text-blue-100/70">
          © {new Date().getFullYear()} O!Sansi — UMSS
        </div>
      </div>
    </div>
  );
}

export default RegistroDocente;
