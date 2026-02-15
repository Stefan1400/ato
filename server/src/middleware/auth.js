const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
   const token = req.cookies?.jwt;

   if (!token) return res.status(401).json({ message: 'Unauthorized' });
   
   try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = payload;
      next();
   } catch (err) {
      console.log('JWT VERIFY ERROR:', err);
      return res.status(401).json({ message: 'Invalid token' });
   };
};

module.exports = authMiddleware;