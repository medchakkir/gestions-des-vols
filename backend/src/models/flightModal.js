import pool from "../config/db.js";

const createFlight = async (flightData) => {
  const query = `
    INSERT INTO flights (
      price,
      departureAirport,
      departureDate,
      departureTime,
      arrivalAirport,
      arrivalDate,
      arrivalTime,
      duration,
      returnDepartureDate,
      returnDepartureTime,
      returnArrivalDate,
      returnArrivalTime,
      returnDuration
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *;
  `;
  const values = Object.values(flightData);
  const result = await pool.query(query, values);
  return result.rows[0];
};

const bookFlight = async (userId, flightId) => {
  const query = `
    INSERT INTO bookings (user_id, flight_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [userId, flightId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getFlightByUserId = async (userId) => {
  const query = `
    SELECT flights.* FROM flights
    JOIN bookings on bookings.flight_id = flights.id
    WHERE user_id = $1;
  `;
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows;
};

export { createFlight, bookFlight, getFlightByUserId };
