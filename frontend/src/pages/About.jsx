import React from 'react';
import { Users, Award, Globe, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const About = () => {
  const stats = [
    { icon: Users, label: 'Clients satisfaits', value: '50,000+' },
    { icon: Globe, label: 'Destinations', value: '200+' },
    { icon: Award, label: 'Années d\'expérience', value: '15+' },
    { icon: Heart, label: 'Avis positifs', value: '98%' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              À propos de Travel.com
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Votre partenaire de confiance pour découvrir le monde depuis plus de 15 ans
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Histoire
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Fondée en 2009, Travel.com est née de la passion de rendre les voyages 
                  accessibles à tous. Nous avons commencé comme une petite agence de voyage 
                  avec un grand rêve : connecter les gens aux destinations de leurs rêves.
                </p>
                <p>
                  Au fil des années, nous avons évolué pour devenir l'une des plateformes 
                  de réservation de vols les plus fiables, servant des milliers de clients 
                  satisfaits dans le monde entier.
                </p>
                <p>
                  Notre engagement envers l'excellence du service client et notre technologie 
                  de pointe nous permettent d'offrir les meilleures expériences de voyage 
                  à nos clients.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop&crop=center"
                alt="Notre équipe"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Mission & Nos Valeurs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Notre Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Rendre les voyages accessibles, abordables et inoubliables pour chacun. 
                  Nous nous efforçons de simplifier le processus de réservation tout en 
                  offrant un service client exceptionnel et des prix compétitifs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Nos Valeurs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Transparence :</strong> Prix clairs, sans frais cachés</li>
                  <li>• <strong>Fiabilité :</strong> Service disponible 24h/24, 7j/7</li>
                  <li>• <strong>Innovation :</strong> Technologie de pointe pour votre confort</li>
                  <li>• <strong>Excellence :</strong> Satisfaction client au cœur de nos priorités</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une équipe passionnée et expérimentée, dédiée à vous offrir 
              la meilleure expérience de voyage possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Martin', role: 'Directrice Générale', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face' },
              { name: 'Ahmed Ben Ali', role: 'Directeur Technique', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face' },
              { name: 'Marie Dubois', role: 'Responsable Service Client', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face' }
            ].map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-gray-600">
                    {member.role}
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

export default About;

