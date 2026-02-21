const db = require('../config/db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const saveRefreshToken = async (userId, token, expiresAt) => {
   const hashedToken = await bcrypt.hash(token, SALT_ROUNDS);
   const result = await db.query(
      `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, hashedToken, expiresAt]
   );

   return result.rows[0];
};

const findRefreshToken = async (token) => {
   const result = await db.query(
      `
      SELECT * FROM refresh_tokens 
      WHERE revoked = false
      `
   );

   for (const row of result.rows) {
      const match = await bcrypt.compare(token, row.token);
      if (match) return row;
   };

   return null;
};

const revokeRefreshToken = async (token) => {
   const tokenRow = await findRefreshToken(token);
   if (!tokenRow) return null;

   const result = await db.query(
      `
      UPDATE refresh_tokens
      SET revoked = true
      WHERE id = $1 
      RETURNING *
      `,
      [tokenRow.id]
   );

   return result.rows[0];
};

const revokeAllRefreshTokens = async (userId) => {
   const result = await db.query(
      `
      UPDATE refresh_tokens
      SET revoked = true
      WHERE user_id = $1
      RETURNING *
      `,
      [userId]
   );

   return result.rowCount || null;
};

module.exports = {
   saveRefreshToken,
   findRefreshToken,
   revokeRefreshToken,
   revokeAllRefreshTokens
};