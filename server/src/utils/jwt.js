const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
   const secret = process.env.JWT_SECRET;
   if (!secret) {
      throw new Error('JWT secret is not defined');
   }
   return secret;
};

const createToken = (user) => {
   const secret = getJwtSecret();
   return jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: '7d' }
   );
};

module.exports = {
   getJwtSecret,
   createToken
};