import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flight (
  id SERIAL PRIMARY KEY,
  plane_code VARCHAR(255),
  price DECIMAL(10, 2),
  departure_city VARCHAR(255),
  arrival_city VARCHAR(255),
  departure_date DATE,
  arrival_date DATE,
  departure_time TIME,
  arrival_time TIME,
  class VARCHAR(20) CHECK (class IN ('Economy', 'Business', 'First')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flight_reservation (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  flight_id INT REFERENCES flight(id),
  reservation_date DATE,
  number_of_people INT,
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function createTable() {
  try {
    await pool.query(createTableQuery);
    return;
  } catch (error) {
    console.log(error);
  }
}

createTable();

export default pool;
