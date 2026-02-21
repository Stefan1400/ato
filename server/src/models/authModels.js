const db = require('../config/db');

const checkEmailExists = async (email) => {
   const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
   );

   return result.rows[0] || null;
};

const registerUser = async (email, hashedPassword) => {
   try {
      const result = await db.query(
         `
         INSERT INTO users (email, password_hash)
         VALUES ($1, $2)
         RETURNING *
         `,
         [email, hashedPassword]
      );

      return result.rows[0] || 409;
   } catch (err) {
      console.error(err);
   }
};

const deleteUser = async (userId) => {
   const result = await db.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING *
      `,
      [userId]
   );

   return result.rows;
};

const changePassword = async (userId, newPassword) => {
   const result = await db.query(
      `
      UPDATE users
      SET password_hash = $2
      WHERE id = $1
      RETURNING *
      `,
      [userId, newPassword]
   );

   return result.rows[0];
};

const findUserById = async (userId) => {
   const result = await db.query(
      `
      SELECT * FROM users
      WHERE id = $1
      `,
      [userId]
   );

   return result.rows[0] || null; 
};

module.exports = {
   checkEmailExists,
   registerUser,
   deleteUser,
   changePassword,
   findUserById,
};