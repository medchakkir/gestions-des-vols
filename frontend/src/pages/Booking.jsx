import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plane, Calendar, Users, ArrowLeftRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { flightService } from '../services/flightService';

const Booking = () => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    isRoundTrip: true
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const results = await flightService.searchFlights(searchData);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching flights:', error);
      // Mock data for demonstration
      setSearchResults([
        {
          id: 1,
          airline: 'Air France',
          flightNumber: 'AF1234',
          from: searchData.from || 'Paris (CDG)',
          to: searchData.to || 'New York (JFK)',
          departureTime: '14:30',
          arrivalTime: '18:45',
          duration: '8h 15m',
          price: 450,
          stops: 0
        },
        {
          id: 2,
          airline: 'Emirates',
          flightNumber: 'EK5678',
          from: searchData.from || 'Paris (CDG)',
          to: searchData.to || 'New York (JFK)',
          departureTime: '22:15',
          arrivalTime: '06:30+1',
          duration: '8h 15m',
          price: 520,
          stops: 1
        },
        {
          id: 3,
          airline: 'Delta',
          flightNumber: 'DL9012',
          from: searchData.from || 'Paris (CDG)',
          to: searchData.to || 'New York (JFK)',
          departureTime: '10:00',
          arrivalTime: '14:15',
          duration: '8h 15m',
          price: 380,
          stops: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = (flight) => {
    // Navigate to payment with flight data
    navigate('/payment', { state: { flight, searchData } });
  };

  const swapAirports = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Réservez votre vol
          </h1>
          <p className="text-gray-600">
            Trouvez les meilleures offres pour votre destination
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Rechercher des vols
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Trip Type */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tripType"
                    checked={searchData.isRoundTrip}
                    onChange={() => setSearchData(prev => ({ ...prev, isRoundTrip: true }))}
                    className="mr-2"
                  />
                  Aller-retour
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tripType"
                    checked={!searchData.isRoundTrip}
                    onChange={() => setSearchData(prev => ({ ...prev, isRoundTrip: false }))}
                    className="mr-2"
                  />
                  Aller simple
                </label>
              </div>

              {/* Airports */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Départ
                  </label>
                  <Input
                    name="from"
                    value={searchData.from}
                    onChange={handleInputChange}
                    placeholder="Ville ou aéroport de départ"
                    required
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrivée
                  </label>
                  <div className="relative">
                    <Input
                      name="to"
                      value={searchData.to}
                      onChange={handleInputChange}
                      placeholder="Ville ou aéroport d'arrivée"
                      required
                    />
                    <button
                      type="button"
                      onClick={swapAirports}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                    >
                      <ArrowLeftRight className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de départ
                  </label>
                  <Input
                    type="date"
                    name="departureDate"
                    value={searchData.departureDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                {searchData.isRoundTrip && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de retour
                    </label>
                    <Input
                      type="date"
                      name="returnDate"
                      value={searchData.returnDate}
                      onChange={handleInputChange}
                      min={searchData.departureDate || new Date().toISOString().split('T')[0]}
                      required={searchData.isRoundTrip}
                    />
                  </div>
                )}
              </div>

              {/* Passengers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de passagers
                  </label>
                  <select
                    name="passengers"
                    value={searchData.passengers}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <option key={num} value={num}>
                        {num} passager{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Recherche en cours...' : 'Rechercher des vols'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searched && (
          <Card>
            <CardHeader>
              <CardTitle>
                Résultats de recherche
              </CardTitle>
              <CardDescription>
                {searchResults.length} vol{searchResults.length !== 1 ? 's' : ''} trouvé{searchResults.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600">Recherche en cours...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun vol trouvé pour ces critères.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((flight) => (
                    <div
                      key={flight.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="font-semibold text-lg">
                              {flight.airline}
                            </div>
                            <div className="text-sm text-gray-600">
                              {flight.flightNumber}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 mb-2">
                            <div className="text-center">
                              <div className="font-bold text-xl">
                                {flight.departureTime}
                              </div>
                              <div className="text-sm text-gray-600">
                                {flight.from}
                              </div>
                            </div>
                            
                            <div className="flex-1 text-center">
                              <div className="text-sm text-gray-600 mb-1">
                                {flight.duration}
                              </div>
                              <div className="border-t border-gray-300 relative">
                                <Plane className="h-4 w-4 text-gray-400 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {flight.stops === 0 ? 'Direct' : `${flight.stops} escale${flight.stops > 1 ? 's' : ''}`}
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="font-bold text-xl">
                                {flight.arrivalTime}
                              </div>
                              <div className="text-sm text-gray-600">
                                {flight.to}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 lg:mt-0 lg:ml-6 text-center lg:text-right">
                          <div className="text-2xl font-bold text-primary mb-2">
                            {flight.price}€
                          </div>
                          <Button
                            onClick={() => handleBookFlight(flight)}
                            className="w-full lg:w-auto"
                          >
                            Réserver
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Booking;

