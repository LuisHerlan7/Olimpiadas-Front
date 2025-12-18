import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Rol {
  id: number;
  nombre: string;
  permissions: string[] | string | null; // Cambiado para ser más flexible
}

interface User {
  id: number;
  name: string;
  email: string;
}

const permissionsList = [
  { key: 'manage_users', label: 'Gestionar Usuarios' },
  { key: 'manage_areas', label: 'Gestionar Áreas' },
  { key: 'manage_roles', label: 'Gestionar Roles' },
  { key: 'manage_competencias', label: 'Gestionar Competencias' },
  { key: 'manage_inscritos', label: 'Gestionar Inscritos' },
  { key: 'manage_fases', label: 'Gestionar Fases' },
  { key: 'view_bitacoras', label: 'Ver Bitácoras' },
  { key: 'classify', label: 'Clasificar' },
  { key: 'enter_notes', label: 'Ingresar Notas' },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState({ nombre: '', permissions: [] as string[] });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRolId, setNewRolId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Usamos promesas individuales para mejor control de errores
      const rolesRes = await fetch('/api/roles').catch(() => null);
      const usersRes = await fetch('/api/users').catch(() => null);

      let rolesData = [];
      let usersData = [];

      if (rolesRes && rolesRes.ok) {
        rolesData = await rolesRes.json();
      }
      
      if (usersRes && usersRes.ok) {
        usersData = await usersRes.json();
      }

      // Validamos que lo recibido sea un array antes de guardar
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole)
      });
      if (!response.ok) throw new Error('Error al crear el rol');
      
      setNewRole({ nombre: '', permissions: [] });
      fetchData();
    } catch (error: any) {
      alert('Error creando rol: ' + (error.message || 'Desconocido'));
    }
  };

  const handlePermissionChange = (perm: string, checked: boolean) => {
    setNewRole(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, perm]
        : prev.permissions.filter(p => p !== perm)
    }));
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewRolId(null);
  };

  const handleSaveUser = async () => {
    if (!editingUser || newRolId === null) return;
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol_id: newRolId })
      });
      if (!response.ok) throw new Error('Error al actualizar');
      
      setEditingUser(null);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Error al guardar usuario");
    }
  };

  // Helper para renderizar los permisos de forma segura
  const renderPermissions = (perms: any) => {
    if (Array.isArray(perms)) return perms.join(', ');
    if (typeof perms === 'string') return perms;
    return 'Ninguno';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Cargando datos del sistema...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div>
            <h1 className="text-lg font-bold text-white">Gestión de Roles</h1>
            <p className="text-xs text-slate-400">OH SanSi — Administración de roles</p>
          </div>
          <Link
            to="/admin"
            className="rounded-xl bg-cyan-600/80 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-cyan-500"
          >
            ← Volver al Admin
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-white mb-4">Crear Nuevo Rol</h2>
          <form onSubmit={handleCreateRole} className="bg-slate-900/70 p-6 rounded-2xl border border-white/10">
            <div className="mb-4">
              <label className="block text-sm text-slate-300 mb-2">Nombre del Rol</label>
              <input
                type="text"
                value={newRole.nombre}
                onChange={(e) => setNewRole(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-slate-300 mb-4">Permisos</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {permissionsList.map(perm => (
                  <label key={perm.key} className="flex items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors text-white">
                    <input
                      type="checkbox"
                      checked={newRole.permissions.includes(perm.key)}
                      onChange={(e) => handlePermissionChange(perm.key, e.target.checked)}
                      className="mr-3 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-sm">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
              Crear Nuevo Rol
            </button>
          </form>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-white mb-4">Roles Existentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.length > 0 ? (
              roles.map(rol => (
                <div key={rol.id} className="bg-slate-900/70 p-5 rounded-2xl border border-white/10">
                  <h3 className="text-lg font-bold text-cyan-400">{rol.nombre}</h3>
                  <div className="mt-2 text-sm text-slate-300">
                    <span className="font-semibold text-slate-400">Permisos:</span> {renderPermissions(rol.permissions)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic">No hay roles definidos.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-white mb-4">Gestión de Usuarios</h2>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white">
                <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4 text-slate-400">{user.email}</td>
                        <td className="p-4">
                          {editingUser?.id === user.id ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <select
                                value={newRolId || ''}
                                onChange={(e) => setNewRolId(e.target.value ? Number(e.target.value) : null)}
                                className="bg-slate-800 text-white p-2 rounded-lg border border-white/20 text-sm"
                              >
                                <option value="">Sin rol</option>
                                {roles.map(rol => (
                                  <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                                ))}
                              </select>
                              <button onClick={handleSaveUser} className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Guardar</button>
                              <button onClick={() => setEditingUser(null)} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Cancelar</button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleEditUser(user)} 
                              className="bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-400 border border-cyan-500/30 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                            >
                              Asignar Rol
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500">No se encontraron usuarios.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}