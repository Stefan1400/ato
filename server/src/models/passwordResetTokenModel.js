const db = require('../config/db');

const savePasswordResetToken = async (userId, tokenHash, expiresAt) => {
   await db.query(
      `
      DELETE FROM password_reset_tokens 
      WHERE user_id = $1
      `,
      [userId]
   );

   const result = await db.query(
      `
      INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, tokenHash, expiresAt]
   );

   return result.rows[0] || null;
};

const findPasswordResetTokenByHash = async (tokenHash) => {
   const result = await db.query(
      `
      SELECT * FROM password_reset_tokens 
      WHERE token_hash = $1
      `,
      [tokenHash]
   );

   return result.rows[0] || null;
};

const deletePasswordResetTokens = async (userId) => {
   const result = await db.query(
      `
      DELETE FROM password_reset_tokens
      WHERE user_id = $1
      RETURNING *
      `,
      [userId]
   );

   return result.rows[0] || null;
};

module.exports = {
   savePasswordResetToken,
   findPasswordResetTokenByHash,
   deletePasswordResetTokens
};