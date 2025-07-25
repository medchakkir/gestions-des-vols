import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page non trouvée
          </h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Page précédente
          </Button>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Si vous pensez qu'il s'agit d'une erreur, veuillez{' '}
            <Link to="/contact" className="text-primary hover:underline">
              nous contacter
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

