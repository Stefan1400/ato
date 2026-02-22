const SALT_ROUNDS = 10;
const bcrypt = require('bcrypt');

const hashValue = async (value) => {
   return await bcrypt.hash(value, SALT_ROUNDS);
};

const compareValue = async (value, hashedValue) => {
   return await bcrypt.compare(value, hashedValue);
};

module.exports = {
   hashValue, 
   compareValue
};