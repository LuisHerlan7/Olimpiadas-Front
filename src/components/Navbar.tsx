import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-blue-600 rounded" />
            <Link to="/" className="font-bold text-lg text-gray-800">O!Sansi</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/registro" className="text-sm text-gray-700 hover:text-blue-700">Registrar Estudiante</Link>
            <Link to="/registro-encargado" className="text-sm text-gray-700 hover:text-blue-700">Registro Encargado</Link>
            <Link to="/login" className="text-sm text-white bg-blue-600 px-3 py-1 rounded">Iniciar Sesión</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
