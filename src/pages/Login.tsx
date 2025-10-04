import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('Iniciando login...');
      const result = await authService.login(email, password);
      console.log('Resultado del login:', result);
      
      if (result.success && result.data?.user && result.data?.token) {
        // Guardar datos del usuario
        authService.storeUser(result.data.user, result.data.token);
        
        console.log('Usuario logueado:', result.data.user);
        console.log('Rol del usuario:', result.data.user.role);
        
        // Redirigir según el rol
        switch (result.data.user.role) {
          case 'administrador':
            console.log('Redirigiendo a administrador');
            navigate('/administrador');
            break;
          case 'encargado':
            console.log('Redirigiendo a encargado');
            navigate('/encargado');
            break;
          case 'olimpista':
            console.log('Redirigiendo a olimpista');
            navigate('/olimpista');
            break;
          default:
            console.log('Rol no reconocido, redirigiendo a home');
            navigate('/');
        }
      } else {
        setError(result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-red-900 flex">
      {/* LADO IZQUIERDO: Imagen y texto */}
      <div className="w-1/2 min-h-screen flex flex-col justify-center items-center p-12 text-white">
        {/* Logo/Imagen */}
        <div className="mb-8">
          <img
            src="/Imagenes/logoumss.png"
            alt="Olimpiadas Académicas"
            className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
          />
        </div>

        {/* Texto */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            ¡Oh Sansi!
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Plataforma oficial de las Olimpiadas Académicas para colegios de Bolivia
          </p>
        </div>
      </div>

      {/* LADO DERECHO: Formulario de login */}
      <div className="w-1/2 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Icono usuario */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
              <FaUser className="text-white text-3xl" />
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-white/80">
              Accede a tu cuenta de Olimpiadas Académicas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Campo Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-white/60" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese su correo institucional"
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            {/* Campo Contraseña */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-white/60" />
              </div>
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-3 text-white/60 hover:text-white transition-colors"
                disabled={loading}
              >
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>

            {/* Enlaces */}
            <div className="text-center space-y-3">
              <p className="text-white/80 text-sm">
                ¿Aún no tienes una cuenta?{" "}
                <Link to="/registro" className="text-blue-300 hover:text-blue-200 underline">
                  Regístrate
                </Link>
              </p>
              <p className="text-white/80 text-sm">
                <a href="#" className="text-blue-300 hover:text-blue-200 underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </p>
              <p className="text-white/80 text-sm">
                <Link to="/" className="text-red-300 hover:text-red-200 underline">
                  Volver al inicio
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
