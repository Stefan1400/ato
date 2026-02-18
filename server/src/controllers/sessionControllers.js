const Session = require('../models/sessionModels');

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
  const { date } = req.query;
  const userId = req.user.id;

  try {
    if (!date) return res.status(400).json({ message: 'Date is required.' });

    const userDate = new Date(date);

    const dayStartUTC = new Date(userDate);
    dayStartUTC.setUTCHours(0, 0, 0, 0);

    const dayEndUTC = new Date(userDate);
    dayEndUTC.setUTCHours(23, 59, 59, 999);

    const fetchedSessions = await Session.getSessionsByDate(userId, dayStartUTC, dayEndUTC);

    if (!fetchedSessions || fetchedSessions.length === 0) {
      return res.status(404).json({ message: `Sessions not found for date: ${date}` });
    }

    return res.status(200).json({
      message: 'sessions successfully fetched',
      fetchedSessions,
    });
  } catch (err) {
    next(err);
  }
};

const editSessionController = async (req, res, next) => {
   const newSessionStart = new Date(req.body.new_session_started);
   const newSessionEnd = new Date(req.body.new_session_ended);
   const userId = req.user.id;
   const { sessionId } = req.params;

   try {

      if (!sessionId) {
         return res.status(400).json({ message: 'Session required to edit' });
      };

      if (
         isNaN(newSessionStart.getTime()) || 
         isNaN(newSessionEnd.getTime())
      ) {
         return res.status(400).json({ message: 'Invalid date format' });
      };

      if (newSessionEnd <= newSessionStart) {
         return res.status(400).json({ message: 'Session end must be after session start' });
      };

      const sessionAlreadyExists = await Session.getSessionById(userId, sessionId);

      if (!sessionAlreadyExists) {
         return res.status(404).json({ message: 'Session does not exist.' });
      };
      
      if (
         sessionAlreadyExists.session_started.getTime() === newSessionStart.getTime() || 
         sessionAlreadyExists.session_ended.getTime() === newSessionEnd.getTime()
      ) {
         return res.status(409).json({ message: 'Cannot edit the same time' });
      };

      const editedSession = await Session.editSession(userId, sessionId, newSessionStart, newSessionEnd);

      if (!editedSession) {
         return res.status(404).json({ message: 'Session not found' });
      };

      return res.status(200).json({
         message: 'Session successfully edited',
         editedSession: editedSession
      });
      
   } catch (err) {
      next(err);
   };
};

const deleteSessionController = async (req, res, next) => {
   const userId = req.user.id;
   const { sessionId } = req.params; 

   try {

      if (!sessionId) {
         return res.status(400).json({ message: 'Session required to delete.'});
      };

      const deletedSession = await Session.deleteSession(userId, sessionId);

      if (!deletedSession) {
         return res.status(404).json({ message: 'Session not found' });
      };

      return res.status(200).json({
         message: 'Session successfully deleted',
         deletedSession: deletedSession
      });

   } catch (err) {
      next(err);
   };
};

module.exports = {
   addSessionController,
   getSessionsController,
   editSessionController,
   deleteSessionController,
};