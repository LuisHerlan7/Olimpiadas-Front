import React, { useState, useEffect } from 'react';

interface Noticia {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  categoria: string;
  imagen: string;
  contenidoCompleto?: string;
  autor?: string;
}

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  roles: string[];
}

const OlimpiadasHome: React.FC = () => {
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState<Noticia | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);

  const noticias: Noticia[] = [
    {
      id: 1,
      titulo: "Matemáticas: Estudiante de secundaria resuelve problema avanzado",
      descripcion: "Juan Pérez de 3ro de secundaria logró resolver un problema de cálculo integral en tiempo récord, impresionando al jurado.",
      fecha: "5 de Diciembre, 2025",
      categoria: "Matemáticas",
      imagen: "🔢",
      autor: "Prof. María González",
      contenidoCompleto: `
        <h2>Un logro excepcional en las Olimpiadas Académicas</h2>
        
        <p>En una jornada memorable para las Olimpiadas Académicas OH SANSI! 2025, Juan Pérez, estudiante de tercer año de secundaria del Colegio San Agustín, demostró habilidades excepcionales al resolver un complejo problema de cálculo integral en tiempo récord.</p>
        
        <h3>El Desafío</h3>
        <p>El problema planteado requería el uso de técnicas avanzadas de integración, incluyendo sustitución trigonométrica y la aplicación del teorema fundamental del cálculo. Los participantes tenían 45 minutos para completar el desafío, pero Juan logró presentar su solución correcta en apenas 28 minutos.</p>
        
        <h3>Reacción del Jurado</h3>
        <p>"Es extraordinario ver a un estudiante tan joven dominar conceptos que normalmente se enseñan en niveles universitarios", comentó la Dra. Ana Martínez, miembro del jurado y profesora de la Facultad de Ciencias y Tecnología de la UMSS. "Juan no solo resolvió el problema correctamente, sino que demostró una comprensión profunda de los principios matemáticos involucrados."</p>
        
        <h3>Palabras del Ganador</h3>
        <p>Juan, visiblemente emocionado tras conocer el resultado, compartió: "He estado preparándome durante meses con mi profesor de matemáticas. Esta competencia me ha motivado a seguir estudiando y considerar una carrera en matemáticas o ingeniería en la UMSS."</p>
        
        <h3>Próximas Etapas</h3>
        <p>Con este logro, Juan se clasifica automáticamente para la fase final de las olimpiadas, que se llevará a cabo el 15 de diciembre. Allí competirá con los mejores estudiantes de las 15 instituciones participantes por el título de Campeón Nacional de Matemáticas OH SANSI! 2025.</p>
        
        <p>La comunidad educativa del Colegio San Agustín celebra este logro y espera ver a Juan brillar en la gran final. ¡Felicitaciones a todos los participantes que hicieron posible esta jornada académica memorable!</p>
      `
    },
    {
      id: 2,
      titulo: "Inauguración Exitosa de OH SANSI! 2025",
      descripcion: "Con gran entusiasmo dieron inicio las olimpiadas académicas con más de 500 estudiantes de primaria y secundaria de 15 colegios.",
      fecha: "1 de Diciembre, 2025",
      categoria: "General",
      imagen: "🎉",
      autor: "Comité Organizador FCYT-UMSS",
      contenidoCompleto: `
        <h2>Un Inicio Espectacular</h2>
        
        <p>El pasado 1 de diciembre, con una ceremonia llena de entusiasmo y expectativa, dieron inicio las Olimpiadas Académicas OH SANSI! 2025, el evento educativo más importante del año organizado por la Facultad de Ciencias y Tecnología de la Universidad Mayor de San Simón.</p>
        
        <h3>Números Récord</h3>
        <p>Este año contamos con la participación de más de 500 estudiantes talentosos provenientes de 15 instituciones educativas de nivel primario y secundario de Cochabamba. Las competencias abarcan 15 materias diferentes, desde Matemáticas y Física hasta Lengua y Literatura, pasando por Química, Biología y más.</p>
        
        <h3>Palabras de Bienvenida</h3>
        <p>El Decano de la Facultad de Ciencias y Tecnología, Dr. Roberto Fernández, inauguró el evento destacando: "Estas olimpiadas representan el compromiso de la UMSS con la excelencia académica y el desarrollo del talento joven. Cada estudiante aquí presente es un futuro profesional que contribuirá al desarrollo de nuestro país."</p>
        
        <p>La ceremonia contó con la presencia de autoridades universitarias, directores de los colegios participantes, docentes evaluadores y familiares de los estudiantes que llenaron el auditorio principal de la FCYT con sus aplausos y vítores de aliento.</p>
        
        <h3>Cronograma de Actividades</h3>
        <p>Las competencias se extenderán hasta el 15 de diciembre, con evaluaciones diarias en diferentes áreas del conocimiento. Los estudiantes participarán en pruebas escritas, presentaciones orales, experimentos prácticos y proyectos de investigación según la materia correspondiente.</p>
        
        <h3>Reconocimiento y Premios</h3>
        <p>Los ganadores de cada categoría recibirán medallas, certificados de reconocimiento y becas parciales para cursos de verano en la UMSS. Además, los tres primeros lugares de cada materia representarán a Cochabamba en las olimpiadas nacionales el próximo año.</p>
        
        <p>¡Les deseamos mucho éxito a todos los participantes y que disfruten esta experiencia académica única que recordarán por siempre!</p>
      `
    },
    {
      id: 3,
      titulo: "Química: Experimentos sorprendentes en la competencia",
      descripcion: "Los estudiantes demostraron sus conocimientos en reacciones químicas con presentaciones creativas y seguras.",
      fecha: "4 de Diciembre, 2025",
      categoria: "Química",
      imagen: "🧪",
      autor: "Dr. Carlos Mendoza",
      contenidoCompleto: `
        <h2>Ciencia en Acción</h2>
        
        <p>La competencia de Química de OH SANSI! 2025 se convirtió en un verdadero espectáculo científico donde los estudiantes demostraron no solo conocimientos teóricos, sino también habilidades prácticas excepcionales en el manejo de reactivos y procedimientos experimentales.</p>
        
        <h3>Desafíos Prácticos</h3>
        <p>Los participantes enfrentaron tres estaciones de trabajo diferentes. En la primera, debían identificar sustancias desconocidas mediante pruebas cualitativas. La segunda estación requería realizar una titulación ácido-base con precisión milimétrica. Finalmente, en la tercera estación, los estudiantes diseñaron un experimento demostrativo de una reacción química de su elección.</p>
        
        <h3>Experimentos Destacados</h3>
        <p>María Luz Torrico del Colegio San José sorprendió al jurado con una demostración de la reacción del reloj de yodo, explicando detalladamente la cinética química involucrada. Por su parte, Pedro Gonzales del Instituto Americano presentó una espectacular reacción de luminiscencia química que dejó al público maravillado.</p>
        
        <h3>Seguridad Primero</h3>
        <p>"Todos los estudiantes demostraron un excelente manejo de las normas de seguridad en el laboratorio", comentó el Dr. Carlos Mendoza, coordinador del área de Química. "Utilizaron correctamente los equipos de protección personal y siguieron los protocolos establecidos, lo cual es fundamental en la formación científica."</p>
        
        <h3>Resultados Preliminares</h3>
        <p>Los puntajes finales se publicarán el viernes, pero el jurado adelantó que el nivel de competencia fue extraordinariamente alto, con varios estudiantes logrando puntajes perfectos en la prueba teórica y excelentes desempeños en la práctica experimental.</p>
        
        <p>La próxima semana continuarán las competencias con las áreas de Física y Biología. ¡La ciencia está más viva que nunca en OH SANSI!</p>
      `
    },
    {
      id: 4,
      titulo: "Lengua y Literatura: Final de debate este viernes",
      descripcion: "Los mejores oradores se enfrentarán en la gran final de debate literario. Un evento que no te puedes perder.",
      fecha: "3 de Diciembre, 2025",
      categoria: "Lengua",
      imagen: "📚",
      autor: "Lic. Patricia Rojas",
      contenidoCompleto: `
        <h2>El Arte de la Palabra en su Máxima Expresión</h2>
        
        <p>Este viernes 6 de diciembre se llevará a cabo la gran final del torneo de debate literario de OH SANSI! 2025, donde los ocho mejores oradores de las rondas eliminatorias se disputarán el título de Campeón de Lengua y Literatura.</p>
        
        <h3>Los Finalistas</h3>
        <p>Tras intensas rondas clasificatorias que evaluaron comprensión lectora, análisis literario, gramática y oratoria, los estudiantes que llegaron a la final son: Ana Belén Quiroz (Colegio La Salle), Roberto Paz (San Agustín), Valentina Sánchez (Americano), Diego Morales (Don Bosco), Lucía Fernández (San José), Javier Torres (Calvert), Sofía Gutiérrez (Santa Ana) y Mateo Silva (Marista).</p>
        
        <h3>Formato de la Final</h3>
        <p>La competencia final constará de tres etapas. Primero, cada participante realizará un análisis oral de 5 minutos sobre un fragmento literario sorpresa de un autor latinoamericano. Luego, participarán en un debate moderado sobre el tema "La literatura como herramienta de transformación social". Finalmente, deberán improvisar un texto creativo basado en tres palabras clave que se revelarán en el momento.</p>
        
        <h3>Un Jurado de Lujo</h3>
        <p>El panel de jueces estará conformado por reconocidos profesores universitarios de la carrera de Lingüística de la UMSS, así como por escritores cochabambinos invitados. "Buscamos evaluar no solo el dominio técnico del lenguaje, sino también la capacidad de los estudiantes para expresar ideas complejas de manera clara y convincente", explicó la Lic. Patricia Rojas, coordinadora del área.</p>
        
        <h3>Información del Evento</h3>
        <p>La final se realizará el viernes 6 de diciembre a las 15:00 horas en el Aula Magna de la FCYT. La entrada es libre para todo el público. Se espera una alta asistencia, por lo que se recomienda llegar con anticipación para asegurar un lugar.</p>
        
        <p>¡No te pierdas este evento donde el poder de las palabras será protagonista!</p>
      `
    },
    {
      id: 5,
      titulo: "Física: Construcción de prototipos mecánicos destaca",
      descripcion: "Estudiantes de secundaria presentaron máquinas simples funcionales demostrando creatividad e ingenio.",
      fecha: "2 de Diciembre, 2025",
      categoria: "Física",
      imagen: "⚛️",
      autor: "Ing. Alberto Vargas",
      contenidoCompleto: `
        <h2>Ingeniería Juvenil en Acción</h2>
        
        <p>La competencia de Física de OH SANSI! 2025 sorprendió gratamente al incluir un desafío práctico donde los estudiantes debían construir prototipos funcionales de máquinas simples utilizando materiales reciclados y de bajo costo, demostrando que la física no es solo teoría, sino aplicación práctica.</p>
        
        <h3>El Desafío de Construcción</h3>
        <p>Los equipos, formados por tres estudiantes cada uno, recibieron un kit básico de materiales: palos de helado, ligas, cartón, pegamento, poleas de madera y algunos componentes electrónicos simples. El reto era construir en 3 horas una máquina que pudiera levantar un peso de 500 gramos a una altura de al menos 30 centímetros, utilizando la menor fuerza posible.</p>
        
        <h3>Proyectos Innovadores</h3>
        <p>El equipo del Colegio Americano diseñó un ingenioso sistema de poleas compuestas que logró una ventaja mecánica de 4:1, levantando el peso con notable facilidad. Por su parte, el grupo del Instituto Marista incorporó un pequeño motor reciclado de un juguete, creando un sistema semiautomático que impresionó por su creatividad.</p>
        
        <h3>Conceptos Aplicados</h3>
        <p>"Lo más valioso de este ejercicio es ver cómo los estudiantes aplican conceptos como momento de fuerza, trabajo mecánico, energía potencial y conservación de la energía en un proyecto tangible", explicó el Ing. Alberto Vargas, coordinador del área de Física. "No se trata solo de memorizar fórmulas, sino de entender cómo funcionan las cosas a nuestro alrededor."</p>
        
        <h3>Premiación Especial</h3>
        <p>Además de los puntos para la clasificación general, los tres mejores proyectos recibirán un kit de Arduino y sensores para que puedan seguir experimentando y desarrollando proyectos de robótica educativa. "Queremos fomentar la curiosidad científica y proporcionar herramientas para que continúen explorando", agregó el Ing. Vargas.</p>
        
        <p>La competencia de Física continuará la próxima semana con pruebas de óptica y electricidad. ¡La creatividad y el ingenio siguen brillando en OH SANSI!</p>
      `
    },
    {
      id: 6,
      titulo: "Biología: Identificación de especies en tiempo récord",
      descripcion: "Competidores de primaria sorprendieron con sus conocimientos sobre flora y fauna local.",
      fecha: "4 de Diciembre, 2025",
      categoria: "Biología",
      imagen: "🔬",
      autor: "Biól. Sandra Ortiz",
      contenidoCompleto: `
        <h2>Pequeños Grandes Científicos</h2>
        
        <p>En una de las competencias más emotivas de OH SANSI! 2025, los estudiantes de nivel primario demostraron un conocimiento sorprendente sobre la biodiversidad local, identificando especies de plantas, insectos y aves nativas de Cochabamba con una precisión que dejó impresionados a los evaluadores.</p>
        
        <h3>La Prueba de Campo</h3>
        <p>La competencia se realizó en dos partes. Primero, los estudiantes recorrieron el jardín botánico de la UMSS donde debían identificar 20 especies de plantas nativas, registrando sus nombres científicos y comunes, además de al menos dos características distintivas de cada una. La segunda parte consistió en la identificación de especímenes preservados de insectos y el reconocimiento de cantos de aves reproducidos en audio.</p>
        
        <h3>Resultados Excepcionales</h3>
        <p>Camila Roca, de 11 años del Colegio Santa Ana, logró identificar correctamente 18 de las 20 especies de plantas, incluyendo nombres científicos completos. "Mi papá es biólogo y salimos mucho al campo. Me enseñó a observar las hojas, las flores y la corteza de los árboles", explicó la pequeña científica con una sonrisa.</p>
        
        <h3>Educación Ambiental</h3>
        <p>"Esta competencia tiene un objetivo que va más allá de ganar puntos", comentó la Biól. Sandra Ortiz, coordinadora del área. "Queremos que los niños desarrollen un amor por la naturaleza y comprendan la importancia de conservar nuestra biodiversidad. Cada especie que aprenden a identificar es una especie que aprenderán a proteger."</p>
        
        <h3>Actividades Complementarias</h3>
        <p>Durante la jornada, los participantes también asistieron a una charla corta sobre especies endémicas de Bolivia y la importancia de los ecosistemas andinos. Además, cada estudiante recibió un póster educativo con las principales especies de flora y fauna de Cochabamba para que puedan seguir aprendiendo en casa.</p>
        
        <h3>Próximas Competencias</h3>
        <p>La semana que viene continuarán las evaluaciones de Biología con temas de anatomía humana y microbiología para los estudiantes de secundaria. También se realizará una competencia de proyectos de investigación donde los participantes presentarán sus propios estudios sobre temas ambientales locales.</p>
        
        <p>¡El futuro de la ciencia boliviana está en buenas manos!</p>
      `
    }
  ];

  const abrirModalLogin = () => {
    // Redirigir a la página de login existente
    window.location.href = '/login';
  };

  const abrirNoticia = (noticia: Noticia) => {
    setNoticiaSeleccionada(noticia);
    window.scrollTo(0, 0);
  };

  const cerrarNoticia = () => {
    setNoticiaSeleccionada(null);
  };

  const volverAlHome = () => {
    setNoticiaSeleccionada(null);
    window.history.pushState({}, '', '/olimpiadas');
  };

  const irAlPanel = () => {
    if (!usuario) return;
    
    const roles = usuario.roles;
    if (roles.includes('administrador')) {
      window.location.href = '/admin';
    } else if (roles.includes('responsable')) {
      window.location.href = '/responsable';
    } else if (roles.includes('evaluador')) {
      window.location.href = '/evaluador';
    } else {
      window.location.href = '/dashboard';
    }
  };

  const cerrarSesion = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setMenuUsuarioAbierto(false);
    
    // Recargar la página para limpiar todo el estado
    window.location.href = '/';
  };

  const obtenerIniciales = (nombres: string, apellidos: string) => {
    const inicial1 = nombres?.charAt(0) || '';
    const inicial2 = apellidos?.charAt(0) || '';
    return (inicial1 + inicial2).toUpperCase();
  };

  const obtenerRolPrincipal = (roles: string[]) => {
    if (roles.includes('administrador')) return 'Administrador';
    if (roles.includes('responsable')) return 'Responsable';
    if (roles.includes('evaluador')) return 'Evaluador';
    return 'Usuario';
  };

  // Verificar si hay usuario logueado al cargar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado);
        setUsuario(usuarioData);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      }
    }
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (menuUsuarioAbierto) {
        setMenuUsuarioAbierto(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuUsuarioAbierto]);

  // Si hay una noticia seleccionada, mostrar su detalle
  if (noticiaSeleccionada) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Navbar */}
        <nav className="bg-slate-800/50 backdrop-blur-sm shadow-lg border-b border-cyan-500/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div 
                onClick={volverAlHome}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  U
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  OH SANSI!
                </span>
              </div>
              <button
                onClick={cerrarNoticia}
                className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
              >
                ← Volver
              </button>
            </div>
          </div>
        </nav>

        {/* Contenido de la Noticia */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Encabezado */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-5xl">{noticiaSeleccionada.imagen}</span>
              <span className="bg-cyan-500/20 text-cyan-400 text-sm font-semibold px-4 py-2 rounded-full border border-cyan-500/30">
                {noticiaSeleccionada.categoria}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {noticiaSeleccionada.titulo}
            </h1>
            
            <div className="flex items-center space-x-4 text-gray-400">
              <span>📅 {noticiaSeleccionada.fecha}</span>
              {noticiaSeleccionada.autor && (
                <>
                  <span>•</span>
                  <span>✍️ {noticiaSeleccionada.autor}</span>
                </>
              )}
            </div>
          </div>

          {/* Descripción destacada */}
          <div className="bg-cyan-500/10 border-l-4 border-cyan-500 p-6 mb-8 rounded-r-lg">
            <p className="text-xl text-gray-200 leading-relaxed">
              {noticiaSeleccionada.descripcion}
            </p>
          </div>

          {/* Contenido principal */}
          {noticiaSeleccionada.contenidoCompleto ? (
            <article className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-cyan-500/20">
              <div 
                className="prose-custom"
                dangerouslySetInnerHTML={{ __html: noticiaSeleccionada.contenidoCompleto }}
              />
            </article>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-cyan-500/20 text-center">
              <p className="text-gray-300 text-lg">Contenido completo próximamente...</p>
            </div>
          )}

          {/* Botón de regreso */}
          <div className="mt-12 text-center">
            <button
              onClick={cerrarNoticia}
              className="bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-all duration-300 inline-flex items-center space-x-2"
            >
              <span>←</span>
              <span>Volver a las noticias</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8 mt-16 border-t border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg font-semibold mb-2 text-cyan-400">OH SANSI! 2025</p>
            <p className="text-gray-400">Unidos por el conocimiento, unidos por la excelencia</p>
          </div>
        </footer>

        <style>{`
          .prose-custom h2 {
            color: #22d3ee;
            font-size: 1.875rem;
            font-weight: bold;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          .prose-custom h3 {
            color: #67e8f9;
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          .prose-custom p {
            color: #e5e7eb;
            line-height: 1.75;
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-800/50 backdrop-blur-sm shadow-lg border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - clickeable para volver al home */}
            <div 
              onClick={volverAlHome}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                U
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                OH SANSI!
              </span>
            </div>

            {/* Usuario o Login Button */}
            {usuario ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuUsuarioAbierto(!menuUsuarioAbierto);
                  }}
                  className="flex items-center space-x-3 bg-slate-700/50 hover:bg-slate-700 px-4 py-2 rounded-full transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {obtenerIniciales(usuario.nombres, usuario.apellidos)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-white text-sm font-semibold">
                      {usuario.nombres} {usuario.apellidos}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {obtenerRolPrincipal(usuario.roles)}
                    </p>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform ${menuUsuarioAbierto ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menú desplegable */}
                {menuUsuarioAbierto && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-2xl border border-cyan-500/20 py-2 z-50">
                    <button
                      onClick={irAlPanel}
                      className="w-full text-left px-4 py-3 text-white hover:bg-slate-700 transition-colors flex items-center space-x-3"
                    >
                      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span>Ver panel</span>
                    </button>
                    <hr className="border-slate-700 my-1" />
                    <button
                      onClick={cerrarSesion}
                      className="w-full text-left px-4 py-3 text-red-400 hover:bg-slate-700 transition-colors flex items-center space-x-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={abrirModalLogin}
                className="bg-cyan-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white py-16 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">¡Bienvenidos a OH SANSI! 2025</h1>
          <p className="text-xl mb-8">Las olimpiadas académicas más importantes del año</p>
          <div className="flex justify-center space-x-8 flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👥</span>
              <span className="text-lg">500+ Estudiantes</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🥇</span>
              <span className="text-lg">15 Materias</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📅</span>
              <span className="text-lg">Del 1 al 25 de Diciembre</span>
            </div>
          </div>
        </div>
      </div>

      {/* Noticias Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-4xl font-bold text-cyan-400 mb-8 text-center">
          Últimas Noticias
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticias.map((noticia) => (
            <div
              key={noticia.id}
              className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-cyan-500/20"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{noticia.imagen}</span>
                  <span className="bg-cyan-500/20 text-cyan-400 text-sm font-semibold px-3 py-1 rounded-full border border-cyan-500/30">
                    {noticia.categoria}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {noticia.titulo}
                </h3>
                <p className="text-gray-300 mb-4">
                  {noticia.descripcion}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{noticia.fecha}</span>
                  <button 
                    onClick={() => abrirNoticia(noticia)}
                    className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
                  >
                    Leer más →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16 border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold mb-2 text-cyan-400">OH SANSI! 2025</p>
          <p className="text-gray-400">Unidos por el conocimiento, unidos por la excelencia</p>
        </div>
      </footer>
    </div>
  );
};

export default OlimpiadasHome;