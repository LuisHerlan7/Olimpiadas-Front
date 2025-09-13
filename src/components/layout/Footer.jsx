import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Registro', href: '/registro' },
    { name: 'Resultados', href: '/resultados' },
    { name: 'Medallero', href: '/medallero' },
    { name: 'Consulta Pública', href: '/consulta' }
  ];

  const academicLinks = [
    { name: 'Matemáticas', href: '/areas/matematicas' },
    { name: 'Física', href: '/areas/fisica' },
    { name: 'Química', href: '/areas/quimica' },
    { name: 'Biología', href: '/areas/biologia' },
    { name: 'Historia', href: '/areas/historia' }
  ];

  const supportLinks = [
    { name: 'Ayuda', href: '/ayuda' },
    { name: 'Documentación', href: '/docs' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Términos de Uso', href: '/terminos' },
    { name: 'Política de Privacidad', href: '/privacidad' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/umss' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/umss' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/umss' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/umss' }
  ];

  return (
    <footer className="bg-secondary-blue-dark text-white">
      <div className="container-custom">
        {/* Contenido principal del footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información institucional */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-red to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Oh! SanSi</h3>
                <p className="text-sm text-gray-300">Olimpiadas Académicas</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Sistema de Gestión y Evaluación de Olimpiadas Académicas de la Universidad Mayor de San Simón.
            </p>
            
            {/* Información de contacto */}
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Cochabamba, Bolivia</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+591 4 423 0000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>olimpiadas@umss.edu.bo</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe size={16} />
                <a href="https://www.umss.edu.bo" className="hover:text-white transition-colors">
                  www.umss.edu.bo
                </a>
              </div>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Áreas académicas */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Áreas Académicas</h4>
            <ul className="space-y-2">
              {academicLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte y redes sociales */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2 mb-6">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Redes sociales */}
            <div>
              <h5 className="text-sm font-semibold mb-3">Síguenos</h5>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-gray-700 hover:bg-secondary-red rounded-lg flex items-center justify-center transition-colors"
                      aria-label={social.name}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-600 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-300">
              © {currentYear} Universidad Mayor de San Simón. Todos los derechos reservados.
            </div>

            {/* Información adicional */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-300">
              <span>Desarrollado con ❤️ para la educación</span>
              <span>Versión 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


