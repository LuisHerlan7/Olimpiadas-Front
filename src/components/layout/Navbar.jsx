import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import Button from '../ui/Button';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Inicio', href: '/', current: location.pathname === '/' },
    { name: 'Registro', href: '/registro', current: location.pathname === '/registro' },
    { name: 'Gestión', href: '/gestion', current: location.pathname === '/gestion' },
    { name: 'Evaluaciones', href: '/evaluaciones', current: location.pathname === '/evaluaciones' },
    { name: 'Resultados', href: '/resultados', current: location.pathname === '/resultados' },
    { name: 'Medallero', href: '/medallero', current: location.pathname === '/medallero' },
    { name: 'Admin', href: '/admin', current: location.pathname === '/admin' },
  ];

  return (
    <nav className="bg-white shadow-medium border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-blue to-secondary-blue-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-secondary-blue">
                  Oh! SanSi
                </h1>
                <p className="text-xs text-gray-500">Olimpiadas Académicas</p>
              </div>
            </Link>
          </div>

          {/* Navegación desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${item.current ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-4">
            {/* Búsqueda */}
            <div className="hidden md:block">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue focus:border-transparent text-sm w-64"
                />
              </div>
            </div>

            {/* Notificaciones */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-secondary-red rounded-full"></span>
            </button>

            {/* Perfil del usuario */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-secondary-blue transition-colors"
              >
                <div className="w-8 h-8 bg-secondary-blue rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {user?.name || 'Usuario'}
                </span>
                <ChevronDown size={16} />
              </button>

              {/* Dropdown del perfil */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'usuario@umss.edu.bo'}</p>
                  </div>
                  <Link
                    to="/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    to="/configuracion"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Configuración
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>

            {/* Botón de menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-lg ${
                    item.current
                      ? 'text-secondary-blue bg-accent-soft-blue'
                      : 'text-gray-700 hover:text-secondary-blue hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Búsqueda móvil */}
            <div className="mt-4 px-3">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


