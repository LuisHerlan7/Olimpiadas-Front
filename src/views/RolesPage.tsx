import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

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
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingRolId, setDeletingRolId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Usamos promesas individuales para mejor control de errores
      const [rolesRes, usersRes] = await Promise.allSettled([
        api.get<Rol[]>('/roles'),
        api.get<User[]>('/users')
      ]);

      let rolesData: Rol[] = [];
      let usersData: User[] = [];

      if (rolesRes.status === 'fulfilled') {
        rolesData = Array.isArray(rolesRes.value.data) ? rolesRes.value.data : [];
        console.log("✅ Roles cargados:", rolesData.length);
        // Debug: verificar permisos de cada rol
        rolesData.forEach(rol => {
          console.log(`📋 Rol: ${rol.nombre}`, {
            id: rol.id,
            permissions: rol.permissions,
            permissionsType: typeof rol.permissions,
            isArray: Array.isArray(rol.permissions)
          });
        });
      } else {
        console.error("❌ Error cargando roles:", rolesRes.reason);
      }
      
      if (usersRes.status === 'fulfilled') {
        const responseData = usersRes.value.data;
        console.log("📦 Respuesta usuarios completa:", responseData);
        usersData = Array.isArray(responseData) ? responseData : [];
        console.log("✅ Usuarios cargados:", usersData.length, usersData);
      } else {
        console.error("❌ Error cargando usuarios:", usersRes.reason);
        if (usersRes.reason?.response) {
          console.error("   Status:", usersRes.reason.response.status);
          console.error("   Data:", usersRes.reason.response.data);
        }
      }

      setRoles(rolesData);
      setUsers(usersData);
      
    } catch (error) {
      console.error("❌ Error general cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/roles', newRole);
      setNewRole({ nombre: '', permissions: [] });
      fetchData();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "No se pudo crear el rol";
      const errors = error?.response?.data?.errors;
      
      if (errors) {
        const errorDetails = Object.values(errors).flat().join(". ");
        alert(`${errorMessage}. ${errorDetails}`);
      } else {
        alert(errorMessage);
      }
      console.error("Error creando rol:", error);
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
      await api.put(`/users/${editingUser.id}`, { rol_id: newRolId });
      setEditingUser(null);
      setNewRolId(null);
      fetchData();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "No se pudo actualizar el usuario";
      alert(errorMessage);
      console.error("Error actualizando usuario:", error);
    }
  };

  // Helper para renderizar los permisos de forma segura
  const renderPermissions = (perms: any) => {
    if (Array.isArray(perms)) return perms.join(', ');
    if (typeof perms === 'string') return perms;
    return 'Ninguno';
  };

  // Obtener permisos como array para mostrar en el modal
  const getPermissionsArray = (perms: any): string[] => {
    if (Array.isArray(perms) && perms.length > 0) return perms;
    if (typeof perms === 'string' && perms.trim() !== '') {
      // Si es un string JSON, intentar parsearlo
      try {
        const parsed = JSON.parse(perms);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Si no es JSON, dividir por comas
        return perms.split(',').map(p => p.trim()).filter(p => p !== '');
      }
      return perms.split(',').map(p => p.trim()).filter(p => p !== '');
    }
    // Si es null, undefined o vacío, retornar array vacío
    return [];
  };

  // Obtener el label de un permiso por su key
  const getPermissionLabel = (key: string): string => {
    const perm = permissionsList.find(p => p.key === key);
    return perm ? perm.label : key;
  };

  // Manejar click en un rol
  const handleRolClick = (rol: Rol) => {
    setSelectedRol(rol);
    setShowDeleteConfirm(false);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setSelectedRol(null);
    setShowDeleteConfirm(false);
    setDeletingRolId(null);
  };

  // Manejar eliminación de rol
  const handleDeleteRol = async () => {
    if (!selectedRol || deletingRolId) return;
    
    setDeletingRolId(selectedRol.id);
    try {
      await api.delete(`/roles/${selectedRol.id}`);
      setRoles(roles.filter(r => r.id !== selectedRol.id));
      handleCloseModal();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "No se pudo eliminar el rol";
      alert(errorMessage);
      console.error("Error eliminando rol:", error);
    } finally {
      setDeletingRolId(null);
    }
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
                <div 
                  key={rol.id} 
                  onClick={() => handleRolClick(rol)}
                  className="bg-slate-900/70 p-5 rounded-2xl border border-white/10 cursor-pointer hover:bg-slate-800/70 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-cyan-400">{rol.nombre}</h3>
                    <span className="text-xs text-slate-500">Click para ver detalles →</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic">No hay roles definidos.</p>
            )}
          </div>
        </section>

        {/* Modal de Detalles del Rol */}
        {selectedRol && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={handleCloseModal}>
            <div 
              className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-cyan-400">{selectedRol.nombre}</h3>
                  <p className="text-sm text-slate-400 mt-1">ID: #{selectedRol.id}</p>
                </div>
                <button 
                  onClick={handleCloseModal} 
                  className="text-slate-400 hover:text-white transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Permisos */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Permisos Asignados</h4>
                  {getPermissionsArray(selectedRol.permissions).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getPermissionsArray(selectedRol.permissions).map(perm => (
                        <div 
                          key={perm} 
                          className="bg-slate-800/50 border border-slate-700 px-3 py-2 rounded-lg text-sm"
                        >
                          {getPermissionLabel(perm)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">Este rol no tiene permisos asignados.</p>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  {!showDeleteConfirm ? (
                    <>
                      <button
                        onClick={handleCloseModal}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                      >
                        Cerrar
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Eliminar Rol
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleDeleteRol}
                        disabled={deletingRolId !== null}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingRolId !== null ? 'Eliminando...' : 'Confirmar Eliminación'}
                      </button>
                    </>
                  )}
                </div>

                {showDeleteConfirm && (
                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-sm text-red-200">
                    <p className="font-semibold mb-2">⚠️ ¿Estás seguro de eliminar este rol?</p>
                    <p>Esta acción no se puede deshacer. Si hay usuarios asignados a este rol, deberás reasignarlos primero.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <section>
          <h2 className="text-2xl font-extrabold text-white mb-4">
            Gestión de Usuarios
            {users.length > 0 && (
              <span className="ml-3 text-sm font-normal text-slate-400">
                ({users.length} usuario{users.length !== 1 ? 's' : ''})
              </span>
            )}
          </h2>
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