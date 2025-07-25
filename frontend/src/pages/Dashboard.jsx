import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Calendar, MapPin, Clock, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { flightService } from '../services/flightService';

const Dashboard = () => {
  const { user } = useAuth();
  const [userFlights, setUserFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserFlights();
  }, []);

  const fetchUserFlights = async () => {
    try {
      const flights = await flightService.getUserFlights();
      setUserFlights(flights);
    } catch (error) {
      console.error('Error fetching user flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour, {user?.firstName || 'Utilisateur'} !
          </h1>
          <p className="text-gray-600">
            Gérez vos réservations et découvrez de nouvelles destinations
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/booking">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Réserver un vol
                </h3>
                <p className="text-gray-600 text-sm">
                  Trouvez et réservez votre prochain voyage
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Mes voyages
              </h3>
              <p className="text-gray-600 text-sm">
                {userFlights.length} réservation{userFlights.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Moyens de paiement
              </h3>
              <p className="text-gray-600 text-sm">
                Gérez vos cartes et factures
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Mes réservations récentes
            </CardTitle>
            <CardDescription>
              Consultez et gérez vos réservations de vols
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userFlights.length === 0 ? (
              <div className="text-center py-12">
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune réservation
                </h3>
                <p className="text-gray-600 mb-4">
                  Vous n'avez pas encore effectué de réservation.
                </p>
                <Link to="/booking">
                  <Button>
                    Réserver maintenant
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userFlights.map((flight, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">
                              {flight.departureAirport} → {flight.arrivalAirport}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {formatDate(flight.departureDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}
                            </span>
                          </div>
                          <span>Durée: {flight.duration}</span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {flight.price}€
                          </div>
                          <div className="text-sm text-gray-600">
                            {flight.isRoundTrip ? 'Aller-retour' : 'Aller simple'}
                          </div>
                        </div>
                      </div>
                    </div>
                    {flight.isRoundTrip && flight.returnDetails && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {flight.arrivalAirport} → {flight.departureAirport}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(flight.returnDetails.returnDepartureDate)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatTime(flight.returnDetails.returnDepartureTime)} - {formatTime(flight.returnDetails.returnArrivalTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

