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

const getSessionsByDate = async (userId, dayStart, dayEnd) => {
   const result = await db.query(
      `
      SELECT * FROM sessions 
      WHERE user_id = $1 
         AND session_started < $2
         AND session_ended > $3
      `,
      [userId, dayEnd, dayStart]
   );

   return result.rows || null;
};

const checkSessionExists = async (userId, sessionStarted, sessionEnded) => {
   const result = await db.query(
      `
      SELECT * FROM sessions
      WHERE user_id = $1 
         AND session_started < $2
         AND session_ended > $3
      `,
      [userId, sessionEnded, sessionStarted]
   );

   return result.rows[0];
};

const getSessionById = async (userId, sessionId) => {
   const result = await db.query(
      `
      SELECT * FROM sessions
      WHERE user_id = $1 AND id = $2
      `,
      [userId, sessionId]
   );

   return result.rows[0];
};

const getSessionsFromYesterday = async (userId, yesterdayStart, yesterdayEnd) => {
   const result = await db.query(
      `
      SELECT * FROM sessions
      WHERE user_id = $1
         AND session_started < $2 AND session_ended > $3
      `,
      [userId, yesterdayEnd, yesterdayStart]
   );

   return result.rows || null;
};

const getSessionsFromToday = async (userId, todayStart, todayEnd) => {
   const result = await db.query(
      `
      SELECT * FROM sessions
      WHERE user_id = $1
         AND session_started < $2 AND session_ended > $3
      `,
      [userId, todayEnd, todayStart]
   );

   return result.rows || null;
};

module.exports = {
   addSession,
   getSessionsByDate,
   checkSessionExists,
   getSessionById,
   getSessionsFromYesterday,
   getSessionsFromToday,
};