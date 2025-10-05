import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface EncargadoForm {
  nombre: string;
  apellido: string;
  ci: string;
  departamento: string;
  municipio: string;
  area: string;
  curso: string; // curso que supervisa / encargado del curso
  email: string;
  password: string;
  confirmPassword: string;
  aceptaTerminos: boolean;
}

const departamentos = [
  'Chuquisaca',
  'La Paz',
  'Cochabamba',
  'Oruro',
  'Potosí',
  'Tarija',
  'Santa Cruz',
  'Beni',
  'Pando',
];

const areas = [
  'Física',
  'Química',
  'Matemáticas',
  'Robótica',
  'Informática',
  'Biología',
  'Astronomía y Astrofísica',
];

// removed nivel (per request)
const cursos = [
  '5to Primaria',
  '6to Primaria',
  '7mo Primaria',
  '8vo Primaria',
  '9no Primaria',
  '1ro Secundaria',
  '2do Secundaria',
  '3ro Secundaria',
  '4to Secundaria',
  '5to Secundaria',
  '6to Secundaria',
];

const RegistroEncargado: React.FC = () => {
  const [form, setForm] = useState<EncargadoForm>({
    nombre: '',
    apellido: '',
    ci: '',
    departamento: '',
    municipio: '',
    area: '',
    curso: '',
    email: '',
    password: '',
    confirmPassword: '',
    aceptaTerminos: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EncargadoForm, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    let nextValue: any = value;

    // force-only digits for CI
    if (name === 'ci') {
      nextValue = value.replace(/\D/g, '');
    }

    // only letters and spaces for nombre/apellido (allow accents)
    if (name === 'nombre' || name === 'apellido') {
      nextValue = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, '');
    }

    // checkbox
    const final = type === 'checkbox' ? (e.target as HTMLInputElement).checked : nextValue;

    setForm(prev => ({ ...prev, [name]: final }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof EncargadoForm, string>> = {};
    // nombre/apellido: required and letters only
    if (!form.nombre.trim()) next.nombre = 'El nombre es requerido';
    else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(form.nombre)) next.nombre = 'El nombre solo debe contener letras';

    if (!form.apellido.trim()) next.apellido = 'El apellido es requerido';
    else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(form.apellido)) next.apellido = 'El apellido solo debe contener letras';

    // CI numeric
    if (!form.ci.trim()) next.ci = 'La cédula es requerida';
    else if (!/^\d+$/.test(form.ci)) next.ci = 'La cédula solo debe contener números';

    if (!form.departamento) next.departamento = 'Seleccione un departamento';
    if (!form.area) next.area = 'Seleccione un área';
    if (!form.curso) next.curso = 'Seleccione un curso';

    // email basic check
    if (!form.email.trim()) next.email = 'El correo es requerido';
    else if (!form.email.includes('@')) next.email = 'El correo debe contener @';

    // password
    if (!form.password) next.password = 'La contraseña es requerida';
    else if (form.password.length < 8) next.password = 'La contraseña debe tener al menos 8 caracteres';

    if (!form.confirmPassword) next.confirmPassword = 'Confirme la contraseña';
    else if (form.password !== form.confirmPassword) next.confirmPassword = 'Las contraseñas no coinciden';

    if (!form.aceptaTerminos) next.aceptaTerminos = 'Debe aceptar los términos';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log('Registro Encargado payload:', form);

    // Simulate saving the encargado to server and set session
    const encargadoSession = {
      role: 'encargado',
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      area: form.area,
    };
    try {
      localStorage.setItem('usuario', JSON.stringify(encargadoSession));
    } catch (err) {
      console.error('No se pudo guardar la sesión en localStorage', err);
    }

    // Redirect to EncargadoHome
    navigate('/encargado');
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Encargado de Área</h1>
            <p className="text-gray-600">Completa los datos para participar en las Olimpiadas Académicas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Nombre</span>
                  </label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ingrese nombre" className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Apellido</span>
                  </label>
                  <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Ingrese apellido" className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.apellido ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Cédula de Identidad</span>
                  </label>
                  <input name="ci" value={form.ci} onChange={handleChange} placeholder="Ingresa tu CI" className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.ci ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.ci && <p className="text-red-500 text-xs mt-1">{errors.ci}</p>}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                    <span>Departamento</span>
                  </label>
                  <select name="departamento" value={form.departamento} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.departamento ? 'border-red-500' : 'border-gray-300'}`}>
                    <option value="">Seleccione departamento</option>
                    {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.departamento && <p className="text-red-500 text-xs mt-1">{errors.departamento}</p>}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                    <span>Área de Participación</span>
                  </label>
                  <select name="area" value={form.area} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.area ? 'border-red-500' : 'border-gray-300'}`}>
                    <option value="">Seleccione un área</option>
                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8" />
                    </svg>
                    <span>Municipio</span>
                  </label>
                  <input name="municipio" value={form.municipio} onChange={handleChange} placeholder="Ingresa tu municipio" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border-gray-300" />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Correo Electrónico</span>
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <span>Contraseña</span>
                  </label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mínimo 8 caracteres" className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <span>Confirmar Contraseña</span>
                  </label>
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repite la contraseña" className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                    <span>Encargado del curso</span>
                  </label>
                  <select name="curso" value={form.curso} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.curso ? 'border-red-500' : 'border-gray-300'}`}>
                    <option value="">Seleccione curso</option>
                    {cursos.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.curso && <p className="text-red-500 text-xs mt-1">{errors.curso}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input type="checkbox" name="aceptaTerminos" checked={form.aceptaTerminos} onChange={handleChange} className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <label className="text-sm text-gray-700">
                Acepto los <a href="/terminos" className="text-red-600 underline">términos y condiciones</a> de participación en las Olimpiadas Académicas O!Sansi.
              </label>
            </div>
            {errors.aceptaTerminos && <p className="text-red-500 text-xs">{errors.aceptaTerminos}</p>}

            <div className="text-center">
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => window.history.back()} className="px-6 py-2 bg-gray-200 rounded-md text-gray-700">Cancelar</button>
                <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-md font-medium">Registrarse</button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">¿Ya tienes una cuenta? <Link to="/login" className="text-red-600 font-medium">Inicia sesión aquí</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroEncargado;
