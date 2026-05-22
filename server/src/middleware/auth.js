const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
   const token = req.cookies.token;
   
   if (!token) return res.status(401).json({ message: 'Unauthorized' });
   
   try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
         return res.status(500).json({ message: 'JWT secret is not configured' });
      }
      const payload = jwt.verify(token, secret);
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