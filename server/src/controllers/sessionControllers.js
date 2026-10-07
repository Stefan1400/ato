const Session = require('../models/sessionModels');
const parseIsoTimestamp = require('../utils/parseIsoTimestamp');

const addSessionController = async (req, res, next) => {
   
   const sessionStarted = new Date(req.body.session_started);
   const sessionEnded = new Date(req.body.session_ended);
   
   const userId = req.user.id;

   try {

      if (!userId || !sessionStarted || !sessionEnded) {
         return res.status(400).json({ message: 'Invalid data. Please try again' });
      };

      const sessionStartedLocal = new Date(req.body.session_started);
      const sessionEndedLocal   = new Date(req.body.session_ended);

      if (isNaN(sessionStartedLocal.getTime()) || isNaN(sessionEndedLocal.getTime())) {
         return res.status(400).json({ message: 'Invalid date format' });
      };

      const sessionAlreadyExists = await Session.checkSessionExists(userId, sessionStartedLocal, sessionEndedLocal);

      if (sessionAlreadyExists) {
         return res.status(400).json({ message: 'Session already exists.' });
      };

      const addedSession = await Session.addSession(userId, sessionStartedLocal, sessionEndedLocal);

      if (!addedSession) {
         return res.status(409).json({ message: 'There was a problem adding session. Please try again. '});
      };

      return res.status(200).json({
         message: 'session successfully added',
         addedSession: addedSession
      });

   } catch (err) {
      next(err);
   };
};

const getSessionsController = async (req, res, next) => {
   const { start, end } = req.query;
  const userId = req.user.id;

  try {
      const dayStart = parseIsoTimestamp(start);
      const dayEnd = parseIsoTimestamp(end);

      if (!dayStart || !dayEnd || dayStart >= dayEnd) {
         return res.status(400).json({ message: 'Valid start and end timestamps are required.' });
      }

      const fetchedSessions = await Session.getSessionsByDate(userId, dayStart, dayEnd);

    return res.status(200).json({
      message: 'sessions successfully fetched',
      fetchedSessions: fetchedSessions || [],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
   addSessionController,
   getSessionsController,
};