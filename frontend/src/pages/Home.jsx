import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plane, Wallet, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Home = () => {
  const destinations = [
    {
      name: 'Paris',
      description: 'La ville de l\'amour avec des monuments emblématiques.',
      image: '/img/paris.jpg'
    },
    {
      name: 'Dubaï',
      description: 'Une architecture moderne et des expériences inoubliables.',
      image: '/img/dubai.jpg'
    },
    {
      name: 'Tokyo',
      description: 'Un mélange de tradition et de technologie futuriste.',
      image: '/img/tokyo.jpg'
    }
  ];

  const features = [
    {
      icon: Plane,
      title: 'Large choix de vols',
      description: 'Des milliers de destinations à portée de main.'
    },
    {
      icon: Wallet,
      title: 'Prix compétitifs',
      description: 'Obtenez les meilleurs tarifs grâce à nos offres exclusives.'
    },
    {
      icon: Clock,
      title: 'Service client 24/7',
      description: 'Nous sommes disponibles à tout moment pour vous aider.'
    }
  ];

  const reviews = [
    {
      text: 'Une expérience incroyable ! Les prix étaient compétitifs et le service était parfait.',
      author: 'Moustaphe Aden'
    },
    {
      text: 'Rapide, facile, et fiable. Je réserverai à nouveau sans hésiter.',
      author: 'Mahad Amin'
    },
    {
      text: 'J\'adore la simplicité d\'utilisation et le large choix de destinations.',
      author: 'Abdirahman Warsama'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Offres pour toutes les saisons
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Des offres de vols incroyables pour toutes les destinations
            </p>
            <Link to="/about">
              <Button size="lg" variant="secondary" className="group">
                En savoir plus
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Destinations Populaires
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=400&h=300&fit=crop&crop=center`;
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle>{destination.name}</CardTitle>
                  <CardDescription>{destination.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi nous choisir ?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-gray-600 italic mb-4">
                    "{review.text}"
                  </p>
                  <p className="font-semibold text-gray-900">
                    - {review.author}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

