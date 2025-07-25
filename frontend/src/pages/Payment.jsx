import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Plane, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { flightService } from '../services/flightService';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, searchData } = location.state || {};

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    }
  });

  const [passengerData, setPassengerData] = useState(
    Array.from({ length: searchData?.passengers || 1 }, () => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      passportNumber: ''
    }))
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('billing.')) {
      const field = name.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePassengerChange = (index, field, value) => {
    setPassengerData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const bookingData = {
        flight,
        searchData,
        passengers: passengerData,
        payment: paymentData
      };

      const result = await flightService.bookFlight(bookingData);
      
      if (result.success) {
        navigate('/dashboard', { 
          state: { 
            message: 'Réservation confirmée ! Vous recevrez un email de confirmation.' 
          } 
        });
      } else {
        setError(result.error || 'Erreur lors de la réservation');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError('Une erreur est survenue lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  if (!flight || !searchData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Aucune information de vol trouvée
          </h2>
          <Button onClick={() => navigate('/booking')}>
            Retour à la recherche
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = flight.price * (searchData.passengers || 1);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finaliser votre réservation
          </h1>
          <p className="text-gray-600">
            Complétez vos informations pour confirmer votre vol
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flight Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plane className="h-5 w-5 mr-2" />
                  Récapitulatif du vol
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-semibold text-lg mb-2">
                    {flight.airline} - {flight.flightNumber}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-bold">{flight.departureTime}</div>
                      <div className="text-sm text-gray-600">{flight.from}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">{flight.duration}</div>
                      <Plane className="h-4 w-4 text-gray-400 mx-auto" />
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{flight.arrivalTime}</div>
                      <div className="text-sm text-gray-600">{flight.to}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Passagers</span>
                    </div>
                    <span>{searchData.passengers}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Prix par personne</span>
                    <span>{flight.price}€</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary">{totalPrice}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Passenger Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations des passagers</CardTitle>
                  <CardDescription>
                    Veuillez remplir les informations pour tous les passagers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {passengerData.map((passenger, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <h4 className="font-semibold mb-4">
                        Passager {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prénom *
                          </label>
                          <Input
                            value={passenger.firstName}
                            onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom *
                          </label>
                          <Input
                            value={passenger.lastName}
                            onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <Input
                            type="email"
                            value={passenger.email}
                            onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Téléphone
                          </label>
                          <Input
                            value={passenger.phone}
                            onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date de naissance *
                          </label>
                          <Input
                            type="date"
                            value={passenger.dateOfBirth}
                            onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Numéro de passeport
                          </label>
                          <Input
                            value={passenger.passportNumber}
                            onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                          />
                        </div>
                      </div>
                      {index < passengerData.length - 1 && (
                        <hr className="mt-6" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Informations de paiement
                  </CardTitle>
                  <CardDescription>
                    Vos informations de paiement sont sécurisées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du titulaire *
                      </label>
                      <Input
                        name="cardholderName"
                        value={paymentData.cardholderName}
                        onChange={handlePaymentChange}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de carte *
                      </label>
                      <Input
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date d'expiration *
                      </label>
                      <Input
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/AA"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <Input
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Adresse de facturation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse *
                        </label>
                        <Input
                          name="billing.street"
                          value={paymentData.billingAddress.street}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ville *
                        </label>
                        <Input
                          name="billing.city"
                          value={paymentData.billingAddress.city}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Code postal *
                        </label>
                        <Input
                          name="billing.postalCode"
                          value={paymentData.billingAddress.postalCode}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/booking')}
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {loading ? 'Traitement...' : `Payer ${totalPrice}€`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

