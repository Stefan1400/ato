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

module.exports = {
   checkEmailExists,
   registerUser,
   deleteUser,
};