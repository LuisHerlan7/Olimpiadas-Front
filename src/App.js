import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Importar páginas
import Home from './pages/Home';
import Registro from './pages/Registro';
import GestionAcademica from './pages/GestionAcademica';
import Evaluaciones from './pages/Evaluaciones';
import Resultados from './pages/Resultados';
import Medallero from './pages/Medallero';
import Administracion from './pages/Administracion';
import ConsultaPublica from './pages/ConsultaPublica';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="registro" element={<Registro />} />
          <Route path="gestion" element={<GestionAcademica />} />
          <Route path="evaluaciones" element={<Evaluaciones />} />
          <Route path="resultados" element={<Resultados />} />
          <Route path="medallero" element={<Medallero />} />
          <Route path="admin" element={<Administracion />} />
          <Route path="consulta" element={<ConsultaPublica />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


