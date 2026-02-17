const handleError = (err, req, res, next) => {
   console.error('GLOBAL ERROR', err);

   if (err.code === '23514' && err.constraint === 'check_session_time') {
      return res.status(400).json({ message: 'Session end time must be after start time' });
   };

   res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal Server Error'
   });   
};

module.exports = handleError;