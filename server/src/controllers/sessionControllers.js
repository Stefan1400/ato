const Session = require('../models/sessionModels');

const addSessionController = async (req, res, next) => {
   
   const sessionStarted = new Date(req.body.session_started);
   const sessionEnded = new Date(req.body.session_ended);
   
   const userId = req.user.id;

   try {

      if (!userId || !sessionStarted || !sessionEnded) {
         return res.status(401).json({ message: 'Invalid data. Please try again' });
      };

      const addedSession = await Session.addSession(userId, sessionStarted, sessionEnded);

      if (!addedSession) {
         return res.status(409).json({ message: 'There was a problem adding session. Please try again. '});
      };

      return res.status(200).json({
         message: 'session successfully added',
         addedSession: addedSession
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
      next(err);
   };
};

const getSessionsController = async (req, res, next) => {
   const date = new Date(req.query.date);
   const userId = req.user.id;

   try {

      if (!date) {
         return res.status(400).json({ message: 'Date is required.' });
      };

      const start = new Date(date);
      const end = new Date(date);

      if (isNaN(start.getTime())) {
         return res.status(400).json({ message: "Invalid date format" });
      }

      end.setUTCHours(23, 59, 59, 999);

      const fetchedSessions = await Session.getSessionsByDate(
         userId, 
         start,
         end
      );

      if (fetchedSessions.length === 0) {
         return res.status(404).json({ message: `Sessions not found for date: ${date}` });
      };

      return res.status(200).json({
         message: 'sessions successfully fetched',
         fetchedSessions: fetchedSessions
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
      next(err);
   };
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

      if (isNaN(newSessionStart.getTime() || newSessionEnd.getTime())) {
         return res.status(400).json({ message: "Invalid date format" });
      };

      if (newSessionEnd <= newSessionStart) {
         return res.status(400).json({ message: 'Session end must be after session start' });
      };

      const editedSession = await Session.editSession(userId, sessionId, newSessionStart, newSessionEnd);

      if (editedSession.length === 0) {
         return res.status(404).json({ message: 'Session not found' });
      };

      return res.status(200).json({
         message: 'Session successfully edited',
         editedSession: editedSession
      });
      
      
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
      next(err);
   };
};

module.exports = {
   addSessionController,
   getSessionsController,
   editSessionController,
}