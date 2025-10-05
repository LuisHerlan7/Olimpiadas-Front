import React, { useEffect, useState } from 'react';

interface UsuarioSession {
  role?: string;
  nombre?: string;
  apellido?: string;
}

const EncargadoHome: React.FC = () => {
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('usuario');
      if (raw) setUsuario(JSON.parse(raw));
    } catch (err) {
      console.warn('No se pudo leer usuario de localStorage', err);
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Encargado Home</h1>
      {usuario ? (
        <p className="text-lg">Bienvenido, {usuario.nombre} {usuario.apellido}</p>
      ) : (
        <p className="text-lg">Bienvenido, encargado</p>
      )}
    </div>
  );
};

export default EncargadoHome;
