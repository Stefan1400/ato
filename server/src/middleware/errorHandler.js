const handleError = (err, req, res, next) => {
   console.error('GLOBAL ERROR', err);

   res.status(req.error || 500).json({
      success: false,
      error: err.message || '500 server error'
   });   
};

module.exports = handleError;