import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import OlimpistaHome from './pages/olimpista/OlimpistaHome';
import EncargadoHome from './pages/encargado/EncargadoHome';
import AdministradorHome from './pages/administrador/AdministradorHome';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/olimpista" element={<OlimpistaHome />} />
          <Route path="/encargado" element={<EncargadoHome />} />
          <Route path="/administrador" element={<AdministradorHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;