const db = require('../config/db');
const { hashValue } = require('../utils/hash');

const ensureAccountTypeColumn = async () => {
   await db.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS account_type VARCHAR(20) DEFAULT 'user' NOT NULL
   `);
};

const checkEmailExists = async (email) => {
   const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
   );

   return result.rows[0] || null;
};

const registerUser = async (email, hashedPassword, accountType = 'user') => {
   try {
      await ensureAccountTypeColumn();

      const result = await db.query(
         `
         INSERT INTO users (email, password_hash, account_type)
         VALUES ($1, $2, $3)
         RETURNING *
         `,
         [email, hashedPassword, accountType]
      );

      return result.rows[0] || 409;
   } catch (err) {
      console.error(err);
   }
};

const createGuestUser = async () => {
   try {
      await ensureAccountTypeColumn();

      const guestEmail = `guest+${Date.now()}-${Math.random().toString(36).slice(2, 8)}@guest.local`;
      const guestPasswordHash = await hashValue(`guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

      const result = await db.query(
         `
         INSERT INTO users (email, password_hash, account_type)
         VALUES ($1, $2, $3)
         RETURNING *
         `,
         [guestEmail, guestPasswordHash, 'guest']
      );

      return result.rows[0] || null;
   } catch (err) {
      console.error(err);
      return null;
   }
};

const convertGuestToUser = async (userId, email, hashedPassword) => {
   try {
      await ensureAccountTypeColumn();

      const result = await db.query(
         `
         UPDATE users
         SET email = $2, password_hash = $3, account_type = 'user'
         WHERE id = $1
         RETURNING *
         `,
         [userId, email, hashedPassword]
      );

      return result.rows[0] || null;
   } catch (err) {
      console.error(err);
      return null;
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

   return result.rows[0] || null;
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
   createGuestUser,
   convertGuestToUser,
   deleteUser,
   changePassword,
   findUserById,
};