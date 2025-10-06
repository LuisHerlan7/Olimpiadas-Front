import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import RegistroEstudiante from './pages/RegistroEstudiante';
import RegistroEncargado from './pages/encargado/RegistroEncargado';
import OlimpistaHome from './pages/olimpista/OlimpistaHome';
import EncargadoHome from './pages/encargado/EncargadoHome';
import AdministradorHome from './pages/administrador/AdministradorHome';
import VisualizarEstudiantes from './pages/administrador/Estudiantesvista';
import RegistroDocente from './pages/RegistroDocente';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroEstudiante />} />
          <Route path="/registro-encargado" element={<RegistroEncargado />} />
          <Route path="/olimpista" element={<OlimpistaHome />} />
          <Route path="/encargado" element={<EncargadoHome />} />
          <Route path="/administrador" element={<AdministradorHome />} />
          <Route path="/visualizar-estudiantes" element={<VisualizarEstudiantes />} />
          <Route path="/registro-docentes" element={<RegistroDocente />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;