const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
   const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
   
   if (!token) return res.status(401).json({ message: 'Unauthorized' });
   
   try {
      
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = payload;
      next();

   } catch (err) {
      if (err.name === 'TokenExpiredError') {
         return res.status(401).json({ message: 'Access token expired' });
      }

      if (err.name === 'JsonWebTokenError') {
         return res.status(401).json({ message: 'Invalid token' });
      }

      next(err);
   };
};

module.exports = authMiddleware;