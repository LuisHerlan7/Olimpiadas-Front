import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Shield, 
  Activity, 
  UserPlus, 
  Edit, 
  Trash2, 
  Save,
  Eye,
  Lock,
  Unlock
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Table from '../components/ui/Table';
import Card from '../components/ui/Card';

const Administracion = () => {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: '',
    estado: 'activo',
    telefono: ''
  });

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: 'Admin Principal',
      email: 'admin@umss.edu.bo',
      rol: 'Administrador',
      estado: 'activo',
      telefono: '70123456',
      ultimoAcceso: '2024-01-15 10:30',
      fechaCreacion: '2024-01-01'
    },
    {
      id: 2,
      nombre: 'Dr. María González',
      email: 'maria.gonzalez@umss.edu.bo',
      rol: 'Evaluador',
      estado: 'activo',
      telefono: '71234567',
      ultimoAcceso: '2024-01-15 09:15',
      fechaCreacion: '2024-01-05'
    }
  ]);

  const [logActividad, setLogActividad] = useState([
    {
      id: 1,
      usuario: 'Admin Principal',
      accion: 'Registró nuevo participante',
      detalle: 'Ana García López - Matemáticas',
      fecha: '2024-01-15 10:30:25',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      usuario: 'Dr. María González',
      accion: 'Evaluó participante',
      detalle: 'Carlos Mendoza Ruiz - Nota: 92.0',
      fecha: '2024-01-15 09:15:42',
      ip: '192.168.1.101'
    }
  ]);

  const roles = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'evaluador', label: 'Evaluador' },
    { value: 'responsable', label: 'Responsable Académico' },
    { value: 'consulta', label: 'Solo Consulta' }
  ];

  const estados = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'suspendido', label: 'Suspendido' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newUser = {
      id: editingUser ? editingUser.id : Date.now(),
      ...formData,
      ultimoAcceso: new Date().toLocaleString('es-ES'),
      fechaCreacion: editingUser ? editingUser.fechaCreacion : new Date().toLocaleDateString('es-ES')
    };

    if (editingUser) {
      setUsuarios(prev => prev.map(user => 
        user.id === editingUser.id ? newUser : user
      ));
    } else {
      setUsuarios(prev => [...prev, newUser]);
    }

    setFormData({
      nombre: '',
      email: '',
      rol: '',
      estado: 'activo',
      telefono: ''
    });
    setEditingUser(null);
    setShowModal(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      rol: user.rol.toLowerCase().replace(' ', '_'),
      estado: user.estado,
      telefono: user.telefono
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setUsuarios(prev => prev.filter(user => user.id !== id));
  };

  const handleToggleEstado = (id) => {
    setUsuarios(prev => prev.map(user => 
      user.id === id 
        ? { ...user, estado: user.estado === 'activo' ? 'inactivo' : 'activo' }
        : user
    ));
  };

  const openModal = () => {
    setEditingUser(null);
    setFormData({
      nombre: '',
      email: '',
      rol: '',
      estado: 'activo',
      telefono: ''
    });
    setShowModal(true);
  };

  const usuariosHeaders = ['Nombre', 'Email', 'Rol', 'Estado', 'Teléfono', 'Último Acceso', 'Acciones'];
  const usuariosData = usuarios.map(user => [
    user.nombre,
    user.email,
    user.rol,
    <span className={`badge ${
      user.estado === 'activo' ? 'badge-success' :
      user.estado === 'inactivo' ? 'badge-gray' :
      'badge-error'
    }`}>
      {user.estado}
    </span>,
    user.telefono,
    user.ultimoAcceso,
    <div className="flex gap-2">
      <Button size="sm" variant="ghost" onClick={() => handleEdit(user)} icon={Edit} />
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={() => handleToggleEstado(user.id)}
        icon={user.estado === 'activo' ? Lock : Unlock}
      />
      <Button size="sm" variant="error" onClick={() => handleDelete(user.id)} icon={Trash2} />
    </div>
  ]);

  const logHeaders = ['Usuario', 'Acción', 'Detalle', 'Fecha', 'IP', 'Acciones'];
  const logData = logActividad.map(log => [
    log.usuario,
    log.accion,
    log.detalle,
    log.fecha,
    log.ip,
    <Button size="sm" variant="ghost" icon={Eye} />
  ]);

  const estadisticas = {
    totalUsuarios: usuarios.length,
    usuariosActivos: usuarios.filter(u => u.estado === 'activo').length,
    evaluadores: usuarios.filter(u => u.rol === 'Evaluador').length,
    administradores: usuarios.filter(u => u.rol === 'Administrador').length
  };

  return (
    <div className="container-custom py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-600">
              Gestiona usuarios, configuración del sistema y monitorea la actividad
            </p>
          </div>
          <Button onClick={openModal} icon={UserPlus}>
            Agregar Usuario
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'usuarios'
                  ? 'border-secondary-blue text-secondary-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users size={20} className="inline mr-2" />
              Gestión de Usuarios
            </button>
            <button
              onClick={() => setActiveTab('log')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'log'
                  ? 'border-secondary-blue text-secondary-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Activity size={20} className="inline mr-2" />
              Log de Actividad
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'config'
                  ? 'border-secondary-blue text-secondary-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings size={20} className="inline mr-2" />
              Configuración del Sistema
            </button>
          </nav>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="hover" className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-secondary-blue mb-2">
              {estadisticas.totalUsuarios}
            </div>
            <div className="text-gray-600">Total Usuarios</div>
          </Card>
          <Card variant="hover" className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <Shield className="text-green-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {estadisticas.usuariosActivos}
            </div>
            <div className="text-gray-600">Usuarios Activos</div>
          </Card>
          <Card variant="hover" className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Users className="text-purple-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-secondary-red mb-2">
              {estadisticas.evaluadores}
            </div>
            <div className="text-gray-600">Evaluadores</div>
          </Card>
          <Card variant="hover" className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
              <Settings className="text-yellow-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {estadisticas.administradores}
            </div>
            <div className="text-gray-600">Administradores</div>
          </Card>
        </div>

        {/* Contenido de las tabs */}
        {activeTab === 'usuarios' && (
          <Card variant="elevated">
            <Card.Header>
              <Card.Title className="flex items-center gap-3">
                <Users className="text-secondary-blue" size={24} />
                Gestión de Usuarios y Roles
              </Card.Title>
              <Card.Description>
                Administra usuarios del sistema y sus permisos
              </Card.Description>
            </Card.Header>
            
            <Card.Content>
              <Table
                headers={usuariosHeaders}
                data={usuariosData}
                emptyMessage="No hay usuarios registrados"
              />
            </Card.Content>
          </Card>
        )}

        {activeTab === 'log' && (
          <Card variant="elevated">
            <Card.Header>
              <Card.Title className="flex items-center gap-3">
                <Activity className="text-secondary-blue" size={24} />
                Log de Actividad del Sistema
              </Card.Title>
              <Card.Description>
                Registro de todas las actividades realizadas en el sistema
              </Card.Description>
            </Card.Header>
            
            <Card.Content>
              <Table
                headers={logHeaders}
                data={logData}
                emptyMessage="No hay registros de actividad"
              />
            </Card.Content>
          </Card>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            <Card variant="elevated">
              <Card.Header>
                <Card.Title className="flex items-center gap-3">
                  <Settings className="text-secondary-blue" size={24} />
                  Configuración del Sistema
                </Card.Title>
                <Card.Description>
                  Configuración general del sistema de olimpiadas
                </Card.Description>
              </Card.Header>
              
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Configuración General</h3>
                    <Input
                      label="Nombre del Sistema"
                      value="Sistema de Olimpiadas Académicas Oh! SanSi"
                      disabled
                    />
                    <Input
                      label="Versión"
                      value="1.0.0"
                      disabled
                    />
                    <Input
                      label="Fecha de Inicio de Registros"
                      type="date"
                      value="2024-01-01"
                    />
                    <Input
                      label="Fecha de Cierre de Registros"
                      type="date"
                      value="2024-11-15"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Configuración de Evaluación</h3>
                    <Input
                      label="Nota Mínima para Clasificar"
                      type="number"
                      value="70"
                    />
                    <Input
                      label="Nota Mínima para Medalla de Bronce"
                      type="number"
                      value="80"
                    />
                    <Input
                      label="Nota Mínima para Medalla de Plata"
                      type="number"
                      value="85"
                    />
                    <Input
                      label="Nota Mínima para Medalla de Oro"
                      type="number"
                      value="90"
                    />
                  </div>
                </div>
                
                <Card.Footer>
                  <div className="flex gap-3">
                    <Button icon={Save} className="flex-1">
                      Guardar Configuración
                    </Button>
                    <Button variant="outline">
                      Restaurar Valores por Defecto
                    </Button>
                  </div>
                </Card.Footer>
              </Card.Content>
            </Card>

            <Card variant="elevated">
              <Card.Header>
                <Card.Title className="flex items-center gap-3">
                  <Shield className="text-secondary-blue" size={24} />
                  Permisos y Roles
                </Card.Title>
                <Card.Description>
                  Matriz de permisos por rol de usuario
                </Card.Description>
              </Card.Header>
              
              <Card.Content>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="table-header">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Registrar Participantes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Evaluar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Ver Resultados
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Administrar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Administrador
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Evaluador
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">✗</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">✗</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Responsable Académico
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">✗</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">✗</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Solo Consulta
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">✗</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">✗</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">✓</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">✗</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {/* Modal para agregar/editar usuario */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre Completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              required
            />
            
            <Select
              label="Rol"
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              options={roles}
              required
            />
            
            <Select
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              options={estados}
              required
            />
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" icon={Save} className="flex-1">
                {editingUser ? 'Actualizar' : 'Crear'} Usuario
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Administracion;


