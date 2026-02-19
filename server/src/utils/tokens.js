const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (user) => {
   return jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15min' }
   );
};

const generateRefreshToken = () => {
   return crypto.randomBytes(64).toString('hex');
};

module.exports = {
   generateAccessToken, 
   generateRefreshToken
};