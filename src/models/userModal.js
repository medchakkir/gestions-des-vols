import pool from "../config/db.js";

const createUser = async ({ name, email, hashedPassword }) => {
  const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, password;
    `;
  const values = [name, email, hashedPassword];
  const result = await pool.query(query, values);
  // console.log(result.rows[0]);
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

const getUserById = async (id) => {
  const query = `
        SELECT * FROM users WHERE id = $1;
    `;
  const result = await pool.query(query, [id]);
  console.log("getUserById: ", result.rows[0]);
  return result.rows[0];
};

const updateUserVerificationStatus = async (userId, status) => {
  const query = `
        UPDATE users SET verified = $1 WHERE id = $2;
    `;
  await pool.query(query, [status, userId]);
};

const deleteUser = async (userId) => {
  const query = `
        DELETE FROM users WHERE id = $1;
    `;
  await pool.query(query, [userId]);
};

const modifyUser = async (userId, { name, email, password }) => {
  const query = `
        UPDATE users
        SET name = $1, email = $2, password = $3
        WHERE id = $4
        RETURNING id, name, email, password;
    `;
  const values = [name, email, password, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserVerificationStatus,
  deleteUser,
  modifyUser,
};
