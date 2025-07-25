import api from './api';

export const flightService = {
  async searchFlights(searchParams) {
    const response = await api.post('/flight/search', searchParams);
    return response.data;
  },

  async getAirports(query) {
    const response = await api.get(`/flight/airports?query=${query}`);
    return response.data;
  },

  async bookFlight(bookingData) {
    const response = await api.post('/flight/book', bookingData);
    return response.data;
  },

  async getUserFlights() {
    const response = await api.get('/flight/user-flights');
    return response.data;
  },

  async cancelBooking(bookingId) {
    const response = await api.delete(`/flight/booking/${bookingId}`);
    return response.data;
  }
};

