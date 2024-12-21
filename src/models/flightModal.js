import pool from "../config/db.js";

const createFlight = async ({
  user_id,

  flight_id,
  price,
  departureDate,
  departureTime,
  arrivalTime,
  departureAirport,
  arrivalAirport,
  duration,

  returnDepartureDate,
  returnDepartureTime,
  returnArrivalTime,
  returnDuration,
}) => {
  const query = `
        INSERT INTO flights (
        user_id,
        
        flight_id,
        price,
        departureAirport,
        arrivalAirport,
        departureDate,
        departureTime,
        arrivalTime,
        duration,

        returnDepartureDate,
        returnDepartureTime,
        returnArrivalTime, 
        returnDuration)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING user_id, flight_id, price;
    `;
  const values = [
    user_id,

    flight_id,
    price,
    departureAirport,
    arrivalAirport,
    departureDate,
    departureTime,
    arrivalTime,
    duration,

    returnDepartureDate,
    returnDepartureTime,
    returnArrivalTime,
    returnDuration,
  ];
  const result = await pool.query(query, values);
  console.log(result.rows[0]);
  return result.rows[0];
};

const getFlightByUserId = async (userId) => {
  const query = `
        SELECT * FROM flights
        WHERE user_id = $1;
    `;
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows;
};

export { createFlight, getFlightByUserId };
