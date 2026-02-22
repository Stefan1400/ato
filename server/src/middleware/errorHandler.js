const handleError = (err, req, res, next) => {

   if (process.env.NODE_ENV !== 'production') {
      console.error('GLOBAL ERROR:', err);
   } else {
      console.error('GLOBAL ERROR:', err.message);
   }

   if (err.code === '23514' && err.constraint === 'check_session_time') {
      return res.status(400).json({ message: 'Session end time must be after start time' });
   };

   return res.status(500).json({
      message: 'Internal Server Error'
   });
};

module.exports = handleError;