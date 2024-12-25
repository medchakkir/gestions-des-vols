import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const createTableQuery = `
DROP TABLE IF EXISTS flights CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flights (
  id SERIAL PRIMARY KEY,
  price DECIMAL(10, 2),
  departureAirport VARCHAR(5),
  departureDate VARCHAR(20),
  departureTime VARCHAR(20),
  arrivalAirport VARCHAR(5),
  arrivalDate VARCHAR(20),
  arrivalTime VARCHAR(20),
  duration VARCHAR(20),
  returnDepartureDate VARCHAR(20),
  returnDepartureTime VARCHAR(20),
  returnArrivalDate VARCHAR(20),
  returnArrivalTime VARCHAR(20),
  returnDuration VARCHAR(20),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  flight_id INT REFERENCES flights(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function initializeDB() {
  console.log("Initializing DB...");
  try {
    await pool.query(createTableQuery);
    console.log("Tables re-created successfully");
  } catch (error) {
    console.error("Error:", error.message || error);
  } finally {
    await pool.end(); // Close the pool after execution
  }
}

initializeDB();
