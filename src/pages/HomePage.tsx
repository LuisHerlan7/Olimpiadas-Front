import React from "react";
import { Link } from "react-router-dom";
import { FaTrophy, FaUserPlus, FaChalkboardTeacher } from 'react-icons/fa';

// Componente HeaderSection responsive
const HeaderSection = (): JSX.Element => {
  const navigationItems = [
    { label: "Inicio", href: "#" },
    { label: "Noticias", href: "#" },
    { label: "Registro", href: "#" },
    { label: "Competencias", href: "#" },
    { label: "Resultados", href: "#" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <FaTrophy className="text-red-500 text-2xl" />
            <div className="flex flex-col">
              <div className="font-bold text-lg text-white leading-tight">
                O!Sansi
              </div>
              <div className="text-xs text-red-400 leading-tight">
                Olimpiadas Académicas
              </div>
            </div>
          </div>

          {/* Navegación - Oculto en móviles */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="font-medium text-white text-sm lg:text-base hover:text-red-400 transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Botón de login */}
          <Link 
            to="/login"
            className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg font-medium text-sm lg:text-base transition-colors duration-200"
          >
            Iniciar Sesión
          </Link>
        </div>

        {/* Navegación móvil */}
        <nav className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="font-medium text-white text-sm hover:text-red-400 transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

// Componente MainContentSection responsive
const MainContentSection = () => {
  return (
    <section className="w-full bg-gradient-to-b from-blue-900 via-black to-red-900 text-white py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Contenido izquierdo */}
          <div className="space-y-6 lg:space-y-8">
            <header>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6">
                Olimpiadas Académicas{' '}
                <span className="bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
                  Bolivia
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-12 max-w-3xl leading-relaxed">
                Plataforma oficial de las Olimpiadas Académicas para colegios de Bolivia. 
                Desarrollado por la Universidad Mayor de San Simón (UMSS).
              </p>
            </header>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/registro"
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 shadow-lg hover:shadow-xl"
              >
                <FaUserPlus className="text-xl" />
                <span>Registrar Estudiante</span>
              </Link>

              {/* reemplaza el botón existente por un Link alrededor */}
              <Link to="/registro-docentes" className="inline-block">
                <button className="group bg-red-800 border-2 border-white hover:bg-red-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 shadow-lg hover:shadow-xl">
                  <FaChalkboardTeacher className="text-xl" />
                  <span>Registro Docentes</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Ilustración derecha */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md lg:max-w-lg h-64 lg:h-96 rounded-2xl shadow-2xl overflow-hidden">
              <img 
                src="/Imagenes/estudianteshome.png" 
                alt="Estudiantes en las Olimpiadas Académicas" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente ParticipantRegistrationSection responsive
const ParticipantRegistrationSection = (): JSX.Element => {
  const registrationCards = [
    {
      id: "students",
      title: "Estudiantes",
      subtitle: "Regístrate para participar en las olimpiadas académicas",
      gradient: "bg-gradient-to-br from-green-600 to-green-700",
      textColor: "text-green-100",
      buttonText: "Registrarse Ahora",
      buttonTextColor: "text-green-600",
      features: ["Matemáticas", "Física", "Química", "Biología"],
    },
    {
      id: "teachers",
      title: "Docentes",
      subtitle: "Registra a tus estudiantes y supervisa su participación",
      gradient: "bg-gradient-to-br from-blue-600 to-blue-700",
      textColor: "text-blue-100",
      buttonText: "Registro Docente",
      buttonTextColor: "text-blue-600",
      features: ["Gestión de equipos", "Seguimiento", "Resultados", "Certificados"],
    },
    {
      id: "coordinators",
      title: "Encargados de Área",
      subtitle: "Administra y coordina las olimpiadas por área académica",
      gradient: "bg-gradient-to-br from-red-600 to-red-700",
      textColor: "text-red-100",
      buttonText: "Acceso Encargados",
      buttonTextColor: "text-red-600",
      features: ["Coordinación", "Evaluación", "Planificación", "Reportes"],
    },
  ];

  const handleRegistration = (cardType: string) => {
    console.log(`Registration clicked for: ${cardType}`);
  };

  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Registro de Participantes
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Únete a las Olimpiadas Académicas de Bolivia
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {registrationCards.map((card) => (
            <article
              key={card.id}
              className={`${card.gradient} rounded-2xl p-6 lg:p-8 text-white`}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icono */}
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-sm" />
                </div>

                {/* Título */}
                <h3 className="text-2xl font-bold text-white">
                  {card.title}
                </h3>

                {/* Subtítulo */}
                <p className={`${card.textColor} text-base leading-relaxed`}>
                  {card.subtitle}
                </p>

                {/* Características */}
                <ul className="space-y-2 w-full">
                  {card.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white rounded-sm flex-shrink-0" />
                      <span className={`${card.textColor} text-sm`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Botón */}
                {card.id === 'coordinators' ? (
                  <Link
                    to="/registro-encargado"
                    className="w-full bg-white hover:bg-gray-50 rounded-lg py-3 font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    <span className={card.buttonTextColor}>{card.buttonText}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleRegistration(card.id)}
                    className="w-full bg-white hover:bg-gray-50 rounded-lg py-3 font-semibold transition-colors duration-200"
                  >
                    <span className={card.buttonTextColor}>{card.buttonText}</span>
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente NewsSection responsive
const NewsSection = (): JSX.Element => {
  const newsData = [
    {
      id: 1,
      image: "/Imagenes/aperturarinscripciones.png",
      category: "Convocatoria",
      categoryColor: "bg-blue-800",
      categoryTextColor: "text-white",
      date: "15 Dic 2024",
      title: "Apertura de Inscripciones 2025",
      description: "Las inscripciones para las Olimpiadas Académicas 2025 están oficialmente abiertas para todos los colegios de Bolivia.",
    },
    {
      id: 2,
      image: "/Imagenes/ganadoresolimpiadas.png",
      category: "Resultados",
      categoryColor: "bg-amber-500",
      categoryTextColor: "text-gray-900",
      date: "10 Dic 2024",
      title: "Ganadores Olimpiada 2024",
      description: "Conoce a los estudiantes destacados que obtuvieron los primeros lugares en las diferentes categorías.",
    },
    {
      id: 3,
      image: "/Imagenes/nuevasmodalidades.png",
      category: "UMSS",
      categoryColor: "bg-emerald-600",
      categoryTextColor: "text-white",
      date: "5 Dic 2024",
      title: "Nuevas Modalidades 2025",
      description: "La UMSS anuncia nuevas modalidades y categorías para las próximas olimpiadas académicas.",
    },
  ];

  return (
    <section className="w-full bg-gray-100 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Últimas Noticias
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Mantente informado sobre las olimpiadas académicas
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {newsData.map((news) => (
            <article
              key={news.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${news.image})` }}
              />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${news.categoryColor} ${news.categoryTextColor}`}
                  >
                    {news.category}
                  </span>
                  <time className="text-sm text-gray-500">
                    {news.date}
                  </time>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {news.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {news.description}
                </p>

                <div className="flex items-center justify-between">
                  <a
                    href="#"
                    className="font-semibold text-blue-800 hover:text-blue-600 transition-colors duration-200"
                  >
                    Leer más
                  </a>
                  <div className="w-4 h-4 bg-blue-600 rounded-sm" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            Ver Todas las Noticias
          </button>
        </div>
      </div>
    </section>
  );
};

// Componente StatisticsSection responsive
const StatisticsSection = (): JSX.Element => {
  const statisticsData = [
    {
      icon: "📚",
      number: "15,000+",
      description: "Estudiantes Registrados",
    },
    {
      icon: "🏫",
      number: "500+",
      description: "Colegios Participantes",
    },
    {
      icon: "🗺️",
      number: "9",
      description: "Departamentos",
    },
    {
      icon: "📅",
      number: "8",
      description: "Años de Trayectoria",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-red-900 via-black to-blue-900 text-white py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Olimpiadas en Números
          </h2>
          <p className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto">
            El impacto de las olimpiadas académicas en Bolivia
          </p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statisticsData.map((stat, index) => (
            <div
              key={index}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/30 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl lg:text-3xl">{stat.icon}</span>
              </div>

              <div className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
                {stat.number}
              </div>

              <div className="text-sm lg:text-base text-blue-100">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente FooterSection responsive
const FooterSection = (): JSX.Element => {
  const participationLinks = [
    "Registro Estudiantes",
    "Registro Docentes",
    "Encargados de Área",
    "Requisitos",
  ];

  const competitionSubjects = [
    "Matemáticas",
    "Física",
    "Química",
    "Biología",
  ];

  const contactInfo = [
    "info@osansi.umss.edu.bo",
    "+591 4 4542563",
    "UMSS, Cochabamba, Bolivia",
  ];

  return (
    <footer className="w-full bg-[#090d15] text-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo y descripción */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">O!Sansi</div>
                <div className="text-sm text-gray-400">UMSS</div>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              Plataforma oficial de las Olimpiadas Académicas para colegios de
              Bolivia, desarrollada por la Universidad Mayor de San Simón.
            </p>

            <div className="w-full h-10 bg-gray-700 rounded" />
          </div>

          {/* Participación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Participación
            </h3>
            <ul className="space-y-2">
              {participationLinks.map((link, index) => (
                <li key={index}>
                  <span className="text-gray-400 text-sm hover:text-white transition-colors duration-200 cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Competencias */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Competencias
            </h3>
            <ul className="space-y-2">
              {competitionSubjects.map((subject, index) => (
                <li key={index}>
                  <span className="text-gray-400 text-sm hover:text-white transition-colors duration-200 cursor-pointer">
                    {subject}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Contacto
            </h3>
            <ul className="space-y-2">
              {contactInfo.map((contact, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded-sm flex-shrink-0" />
                  <span className="text-gray-400 text-sm">
                    {contact}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <p className="text-gray-400 text-sm text-center">
            © 2024 O!Sansi - Universidad Mayor de San Simón. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Componente principal Home
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSection />
      <MainContentSection />
      <ParticipantRegistrationSection />
      <NewsSection />
      <StatisticsSection />
      <FooterSection />
    </div>
  );
};

export default HomePage;
