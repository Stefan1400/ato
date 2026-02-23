const SALT_ROUNDS = 10;
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const hashValue = async (value) => {
   return await bcrypt.hash(value, SALT_ROUNDS);
};

const compareValue = async (value, hashedValue) => {
   return await bcrypt.compare(value, hashedValue);
};

const hashToken = (token) => {
   return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
};

module.exports = {
   hashValue, 
   compareValue,
   hashToken
};