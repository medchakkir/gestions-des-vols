import pool from "../config/db.js";

const createUser = async ({ name, email, hashedPassword }) => {
  const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, password;
    `;
  const values = [name, email, hashedPassword];
  const result = await pool.query(query, values);
  console.log(result.rows[0]);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = `
        SELECT * FROM users WHERE email = $1;
    `;
  const result = await pool.query(query, [email]);
  // console.log(result.rows[0]);
  return result.rows[0];
};

export { createUser, getUserByEmail };
