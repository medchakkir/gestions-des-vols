// Need to customize your config?:
import { createPool } from "@vercel/postgres";
import dotenv from "dotenv";
dotenv.config();

const pool = createPool({
  connectionString: process.env.DB_STRING,
});

export default pool;
