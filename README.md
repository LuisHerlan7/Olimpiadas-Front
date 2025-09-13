# Oh! SanSi - Sistema de Gestión y Evaluación de Olimpiadas Académicas

Una aplicación web profesional, moderna y responsive desarrollada en React + TailwindCSS para la gestión integral de competencias académicas de la Universidad Mayor de San Simón.

## 🎯 Características Principales

### 🎨 Diseño Visual
- **Colores Institucionales**: Blanco (#FFFFFF), Rojo (#E63946), Azul (#1D3557)
- **Inspiración UMSS**: Diseño basado en la interfaz de la Facultad de Ciencias y Tecnología
- **Estilo Minimalista**: Sobrio, académico y profesional
- **Tipografía**: Roboto y Open Sans para máxima legibilidad
- **Responsive Design**: 100% adaptable a desktop, tablet y móvil
- **Accesibilidad**: Cumple estándares básicos WCAG

### 🏗️ Estructura de la Web

#### 1. **Inicio** (`/`)
- Banner institucional con logo de la Olimpiada
- Presentación del sistema Oh! SanSi
- Botones principales: Registrarse, Iniciar Sesión, Ver Resultados
- Estadísticas en tiempo real
- Características del sistema
- Próximas actividades y áreas de competencia

#### 2. **Registro de Participantes** (`/registro`)
- Formulario completo con validaciones
- Campos: Nombre, CI, tutor, unidad educativa, departamento, grado, área, nivel, tutor académico
- Validaciones de campos obligatorios
- Lista de participantes registrados
- Carga masiva desde CSV (placeholder)
- Modal de confirmación

#### 3. **Gestión Académica** (`/gestion`)
- **Responsables Académicos**: Registro y gestión por área
- **Evaluadores**: Gestión de evaluadores con especialidades
- Sistema de tabs para navegación
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Estadísticas de personal académico

#### 4. **Evaluaciones** (`/evaluaciones`)
- Interfaz para ingresar calificaciones (0-100)
- Clasificación automática: Clasificado, No Clasificado, Desclasificado
- Filtros por área, nivel, evaluador y estado
- Campo para observaciones conceptuales
- Estadísticas de evaluación
- Modal detallado para cada participante

#### 5. **Resultados** (`/resultados`)
- Listas organizadas por área y nivel
- Exportación a Excel y PDF
- Generación de reportes para:
  - Certificados
  - Ceremonia de premiación
  - Publicación web
- Filtros avanzados
- Estadísticas generales del medallero

#### 6. **Medallero** (`/medallero`)
- Configuración del número de medallas (Oro, Plata, Bronce, Menciones)
- Vista pública atractiva y accesible
- Medallero por área y nivel
- Estadísticas de medallas otorgadas
- Modal de configuración

#### 7. **Administración** (`/admin`)
- **Gestión de Usuarios**: CRUD completo con roles y permisos
- **Log de Actividad**: Registro de todas las acciones del sistema
- **Configuración del Sistema**: Parámetros generales y de evaluación
- **Permisos y Roles**: Matriz de permisos por rol
- Estadísticas de usuarios

#### 8. **Consulta Pública** (`/consulta`)
- Página pública de consulta de ganadores
- Buscador por nombre, unidad educativa, área o nivel
- Vista optimizada para consulta pública
- Información sobre criterios de evaluación
- Exportación de resultados

## ⚙️ Tecnologías Utilizadas

### Frontend
- **React 18.2.0**: Framework principal
- **TailwindCSS 3.1.8**: Framework de estilos
- **React Router 6.3.0**: Navegación entre páginas
- **Lucide React**: Iconografía moderna
- **clsx**: Utilidad para clases CSS condicionales

### Herramientas de Desarrollo
- **Create React App**: Configuración inicial
- **PostCSS**: Procesamiento de CSS
- **Autoprefixer**: Compatibilidad de navegadores

### Dependencias Adicionales
- **jsPDF**: Generación de PDFs
- **XLSX**: Exportación a Excel

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd oh-sansi-olimpiadas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   ```

4. **Construir para producción**
   ```bash
   npm run build
   ```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/                    # Componentes de interfaz reutilizables
│   │   ├── Button.jsx         # Botón con múltiples variantes
│   │   ├── Input.jsx          # Campo de entrada con validación
│   │   ├── Select.jsx         # Selector con opciones
│   │   ├── Table.jsx          # Tabla responsiva
│   │   ├── Modal.jsx          # Modal reutilizable
│   │   └── Card.jsx           # Tarjeta con variantes
│   └── layout/                # Componentes de layout
│       ├── Navbar.jsx         # Barra de navegación
│       ├── Footer.jsx         # Pie de página
│       └── Layout.jsx         # Layout principal
├── pages/                     # Páginas principales
│   ├── Home.jsx              # Página de inicio
│   ├── Registro.jsx          # Registro de participantes
│   ├── GestionAcademica.jsx  # Gestión académica
│   ├── Evaluaciones.jsx      # Sistema de evaluaciones
│   ├── Resultados.jsx        # Resultados y reportes
│   ├── Medallero.jsx         # Medallero público
│   ├── Administracion.jsx    # Panel de administración
│   └── ConsultaPublica.jsx   # Consulta pública
├── services/                  # Servicios y utilidades
│   ├── api.js                # Servicios de API
│   ├── exportService.js      # Servicios de exportación
│   └── storageService.js     # Servicios de almacenamiento
├── App.js                    # Componente principal con rutas
├── index.js                  # Punto de entrada
└── index.css                 # Estilos globales y TailwindCSS
```

## 🎨 Paleta de Colores

- **Primario**: Blanco (#FFFFFF)
- **Secundario Rojo**: #E63946
- **Secundario Azul**: #1D3557
- **Azul Claro**: #457B9D
- **Azul Oscuro**: #0F172A
- **Acento Claro**: #A8DADC
- **Acento Suave**: #F1FAEE
- **Gris Cálido**: #64748B

## 🔧 Configuración de TailwindCSS

El proyecto incluye una configuración personalizada de TailwindCSS con:
- Colores institucionales personalizados
- Fuentes Roboto y Open Sans
- Sombras suaves personalizadas
- Componentes base reutilizables
- Animaciones personalizadas
- Utilidades responsive

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- **Desktop**: Experiencia completa con navegación expandida
- **Tablet**: Adaptación de layouts y componentes
- **Móvil**: Navegación colapsable y componentes optimizados

## 🔐 Sistema de Roles

- **Administrador**: Acceso completo al sistema
- **Evaluador**: Puede evaluar y ver resultados
- **Responsable Académico**: Puede registrar participantes y ver resultados
- **Solo Consulta**: Solo puede ver resultados

## 📊 Funcionalidades Implementadas

### ✅ Completadas
- [x] Estructura inicial del proyecto
- [x] Configuración de TailwindCSS con colores UMSS
- [x] Componentes base reutilizables
- [x] Sistema de rutas
- [x] Página de inicio con banner institucional
- [x] Registro de participantes
- [x] Gestión académica
- [x] Sistema de evaluaciones
- [x] Resultados con exportación
- [x] Medallero público
- [x] Panel de administración
- [x] Consulta pública
- [x] Servicios de API (placeholders)
- [x] Servicios de exportación
- [x] Servicios de almacenamiento

### 🔄 Por Implementar (Backend)
- [ ] API REST con PHP/Laravel o Java
- [ ] Base de datos PostgreSQL/MySQL
- [ ] Autenticación y autorización
- [ ] Carga masiva de datos CSV real
- [ ] Exportación real a Excel/PDF
- [ ] Notificaciones por email
- [ ] Backup y recuperación de datos
- [ ] Sistema de logs avanzado

## 🛠️ Servicios Incluidos

### API Service (`src/services/api.js`)
- Servicios para participantes, evaluaciones, resultados
- Servicios de autenticación y configuración
- Servicios de logs y estadísticas
- Mock data para desarrollo

### Export Service (`src/services/exportService.js`)
- Exportación a Excel y PDF
- Generación de certificados
- Reportes de premiación
- Medallero exportable

### Storage Service (`src/services/storageService.js`)
- Gestión de localStorage y sessionStorage
- Cache de datos
- Preferencias de usuario
- Datos de formularios

## 🚀 Próximos Pasos

1. **Conectar con Backend**: Implementar API REST
2. **Base de Datos**: Diseñar y crear esquema de base de datos
3. **Autenticación**: Sistema de login y sesiones
4. **Funcionalidades Avanzadas**: Notificaciones, reportes automáticos
5. **Testing**: Pruebas unitarias y de integración
6. **Deployment**: Configuración para producción

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para la Universidad Mayor de San Simón**

*Sistema de Gestión y Evaluación de Olimpiadas Académicas "Oh! SanSi"*


