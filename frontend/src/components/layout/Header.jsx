import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Plane } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">Travel.com</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Accueil
              </Link>
              <Link
                to="/about"
                className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/booking"
                    className="text-gray-900 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Réservation
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    Bonjour, {user?.firstName || 'Utilisateur'}
                  </span>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Se connecter
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className="text-gray-900 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/about"
                className="text-gray-900 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className="text-gray-900 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-900 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/booking"
                    className="text-gray-900 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Réservation
                  </Link>
                </>
              )}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="flex items-center px-3">
                    <div className="flex-shrink-0">
                      <span className="text-sm text-gray-700">
                        Bonjour, {user?.firstName || 'Utilisateur'}
                      </span>
                    </div>
                    <div className="ml-auto">
                      <Button onClick={handleLogout} variant="outline" size="sm">
                        Déconnexion
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center px-3 space-x-3">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm">
                        Se connecter
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm">
                        S'inscrire
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

