const db = require('../config/db');

const addSession = async (userId, sessionStarted, sessionEnded) => {
   const result = await db.query(
      `
      INSERT INTO sessions (user_id, session_started, session_ended)
      VALUES($1, $2, $3)
      RETURNING *
      `,
      [userId, sessionStarted, sessionEnded]
   );

   return result.rows[0] || null;
};

module.exports = {
   addSession,

}