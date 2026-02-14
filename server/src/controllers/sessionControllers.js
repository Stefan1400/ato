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

module.exports = {
   addSessionController,
}