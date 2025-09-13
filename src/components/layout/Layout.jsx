import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  // Mock user data - en producción vendría del contexto de autenticación
  const user = {
    name: 'Dr. María González',
    email: 'maria.gonzalez@umss.edu.bo',
    role: 'Administrador'
  };

  const handleLogout = () => {
    // Lógica de logout
    console.log('Cerrando sesión...');
  };

  return (
    <div className="min-h-screen bg-primary-light flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;


