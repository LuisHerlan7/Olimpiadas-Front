import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegistroEstudiante from './pages/RegistroEstudiante';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<RegistroEstudiante />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
