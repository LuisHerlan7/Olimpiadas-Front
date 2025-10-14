import React from 'react';

// Estilos en línea para mantener el código en un solo bloque
const containerStyles: React.CSSProperties = {
  backgroundColor: '#F5F5F5',
  padding: '30px',
  fontFamily: 'system-ui, sans-serif',
  minHeight: '100vh',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 30px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
};

const navStyles: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
};

const navItemStyles: React.CSSProperties = {
  color: '#4A5568',
  fontWeight: '500',
  textDecoration: 'none',
};

const activeNavItemStyles: React.CSSProperties = {
  ...navItemStyles,
  color: '#4C51BF',
  borderBottom: '2px solid #4C51BF',
  paddingBottom: '5px',
};

const mainContentStyles: React.CSSProperties = {
  padding: '20px',
};

const headingStyles: React.CSSProperties = {
  fontSize: '1.8rem',
  color: '#1A202C',
  marginBottom: '5px',
};

const subHeadingStyles: React.CSSProperties = {
  color: '#6A7D9B',
  marginBottom: '20px',
};

const filterBarStyles: React.CSSProperties = {
  display: 'flex',
  gap: '15px',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
};

const statCardContainerStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '30px',
};

const statCardStyles: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
};

const listCardStyles: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  padding: '20px',
};

const tableStyles: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const tableHeaderCellStyles: React.CSSProperties = {
  textAlign: 'left',
  padding: '15px',
  color: '#6A7D9B',
  fontWeight: '600',
  borderBottom: '1px solid #E2E8F0',
};

const tableCellStyles: React.CSSProperties = {
  padding: '15px',
  borderBottom: '1px solid #E2E8F0',
  verticalAlign: 'middle',
};

const profilePicStyles: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  marginRight: '10px',
};

// Datos de ejemplo para la tabla
const students = [
  { id: 1, name: 'Carlos Mendoza', ci: '12345678', school: 'Colegio San Agustín', area: 'Matemáticas', course: '5to Secundaria', department: 'Cochabamba', avatar: 'https://via.placeholder.com/150/0000FF/808080?text=CM' },
  { id: 2, name: 'Ana Rodríguez', ci: '87654321', school: 'Unidad Educativa Simón Bolívar', area: 'Física', course: '6to Secundaria', department: 'La Paz', avatar: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=AR' },
  { id: 3, name: 'Miguel Torres', ci: '11223344', school: 'Colegio Alemán', area: 'Química', course: '5to Secundaria', department: 'Santa Cruz', avatar: 'https://via.placeholder.com/150/008000/FFFFFF?text=MT' },
  { id: 4, name: 'Sofía Vargas', ci: '355667788', school: 'Liceo La Salle', area: 'Biología', course: '6to Secundaria', department: 'Tarija', avatar: 'https://via.placeholder.com/150/FFFF00/000000?text=SV' },
  { id: 5, name: 'Diego Morales', ci: '99887766', school: 'Colegio Don Bosco', area: 'Informática', course: '5to Secundaria', department: 'Oruro', avatar: 'https://via.placeholder.com/150/800080/FFFFFF?text=DM' },
];

const DocenteDashboard: React.FC = () => {
  return (
    <div style={containerStyles}>
      {/* Encabezado */}
      <header style={headerStyles}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="https://via.placeholder.com/40" alt="Logo" style={{ marginRight: '10px' }} />
          <h2 style={{ color: '#4C51BF' }}>Oh! Sansi</h2>
        </div>
        <nav style={navStyles}>
          <a href="#" style={navItemStyles}>Inicio</a>
          <a href="#" style={activeNavItemStyles}>Estudiantes</a>
          <a href="#" style={navItemStyles}>Competencias</a>
          <a href="#" style={navItemStyles}>Resultados</a>
        </nav>
        {/* Aquí irían los íconos de notificación y perfil del usuario */}
        <div>Iconos de usuario</div>
      </header>

      {/* Contenido principal */}
      <div style={mainContentStyles}>
        <h1 style={headingStyles}>Estudiantes Registrados</h1>
        <p style={subHeadingStyles}>
          Lista completa de estudiantes participantes en las olimpiadas académicas de Bolivia
        </p>

        {/* Barra de Filtros */}
        <div style={filterBarStyles}>
          <div style={{ flexGrow: 1 }}>
            <label>Ordenar por:</label>
            <select style={{ padding: '8px', marginLeft: '5px' }}>
              <option>Nombre (A-Z)</option>
            </select>
            <label style={{ marginLeft: '15px' }}>Área:</label>
            <select style={{ padding: '8px', marginLeft: '5px' }}>
              <option>Todas las áreas</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input type="text" placeholder="Buscar estudiante..." style={{ padding: '8px', borderRadius: '4px', border: '1px solid #E2E8F0' }} />
            <button style={{ padding: '8px 15px', backgroundColor: '#4C51BF', color: '#FFFFFF', border: 'none', borderRadius: '4px', marginLeft: '10px', cursor: 'pointer' }}>
              Filtrar
            </button>
          </div>
        </div>

        {/* Indicadores de estadísticas */}
        <div style={statCardContainerStyles}>
          <div style={statCardStyles}>
            <h3>Total Estudiantes</h3>
            <p style={{ fontSize: '2rem', margin: '0', color: '#1A202C' }}>1,247</p>
          </div>
          <div style={statCardStyles}>
            <h3>Unidades Educativas</h3>
            <p style={{ fontSize: '2rem', margin: '0', color: '#1A202C' }}>89</p>
          </div>
          <div style={statCardStyles}>
            <h3>Áreas Académicas</h3>
            <p style={{ fontSize: '2rem', margin: '0', color: '#1A202C' }}>5</p>
          </div>
          <div style={statCardStyles}>
            <h3>Departamentos</h3>
            <p style={{ fontSize: '2rem', margin: '0', color: '#1A202C' }}>9</p>
          </div>
        </div>

        {/* Lista de Estudiantes */}
        <div style={listCardStyles}>
          <h2 style={{ fontSize: '1.5rem', color: '#1A202C' }}>Lista de Estudiantes</h2>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={tableHeaderCellStyles}>Estudiante</th>
                <th style={tableHeaderCellStyles}>Unidad Educativa</th>
                <th style={tableHeaderCellStyles}>Área Académica</th>
                <th style={tableHeaderCellStyles}>Curso</th>
                <th style={tableHeaderCellStyles}>Departamento</th>
                <th style={tableHeaderCellStyles}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td style={tableCellStyles}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={student.avatar} alt={student.name} style={profilePicStyles} />
                      <div>
                        <strong>{student.name}</strong>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#6A7D9B' }}>CI {student.ci}</p>
                      </div>
                    </div>
                  </td>
                  <td style={tableCellStyles}>{student.school}</td>
                  <td style={tableCellStyles}>{student.area}</td>
                  <td style={tableCellStyles}>{student.course}</td>
                  <td style={tableCellStyles}>{student.department}</td>
                  <td style={tableCellStyles}>
                    <button style={{
                      padding: '8px 12px',
                      backgroundColor: '#4C51BF',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}>
                      Ver más
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>          
        </div>
      </div>
    </div>
  );
};

export default DocenteDashboard;