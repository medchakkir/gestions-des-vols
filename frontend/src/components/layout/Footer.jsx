import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Travel.com</span>
            </div>
            <p className="text-gray-300 mb-4">
              Votre partenaire de confiance pour tous vos voyages. 
              Découvrez le monde avec nos offres de vols exceptionnelles 
              et notre service client de qualité.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-300">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-300">contact@travel.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/booking" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Réservation
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Centre d'aide
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 Travel.com. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm text-gray-300">
                Paris, France
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

