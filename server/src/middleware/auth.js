const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
   const token = req.cookies?.jwt;

   console.log('token:', token);

   if (!token) return res.status(401).json({ message: 'Unauthorized' });
   
   console.log('made it past token check');
   

   try {

      console.log('JWT_SECRET:', process.env.JWT_SECRET);
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      console.log('payload: ', payload);
      
      req.user = payload;
      next();
   } catch (err) {
   console.log('JWT VERIFY ERROR:', err);
   return res.status(401).json({ message: 'Invalid token' });
}
}

module.exports = authMiddleware;