import pool from "../config/db.js";

const createUser = async ({ name, email, hash }) => {
  const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, password;
    `;
  const values = [name, email, hash];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = `
        SELECT * FROM users WHERE email = $1;
    `;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const getUserById = async (id) => {
  const query = `
        SELECT * FROM users WHERE id = $1;
    `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const updateUserPassword = async (email, newPassword) => {
  const query = `
        UPDATE users
        SET password = $1
        WHERE email = $2
        RETURNING id, name, email, password;
    `;
  const values = [newPassword, email];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export { createUser, getUserByEmail, getUserById, updateUserPassword };
