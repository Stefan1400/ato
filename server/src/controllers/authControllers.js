const User = require('../models/authModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokens');
const { saveRefreshToken } = require('../models/refreshTokenModel');

const registerController = async (req, res, next) => {
   
   const { email, password } = req.body;

   try {

      if (!email || !password) {
         return res.status(401).json({ message: 'Email and password are required'});
      };

      const normalizedEmail = email.toLowerCase().trim();

      const userExists = await User.checkEmailExists(normalizedEmail);

      if (userExists) {
         return res.status(409).json({ message: 'Invalid credentials' });
      };

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = await User.registerUser(normalizedEmail, hashedPassword);

      if (!createdUser) {
         return res.status(409).json({ message: 'There was a problem creating an account' });
      };

      const accessToken = generateAccessToken(createdUser);
      const refreshToken = generateRefreshToken();

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await saveRefreshToken(createdUser.id, refreshToken, expiresAt);

      res.cookie('refreshToken', refreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'Strict',
         maxAge: 7 * 24 * 60 * 60 * 1000
      });

      const { password_hash, ...userData } = createdUser;

      return res.status(201).json({
         message: 'user successfully created',
         user: userData,
         accessToken
      });

   } catch (err) {
      next(err);
   };
};

const loginController = async (req, res, next) => {
   const { email, password } = req.body;

   try {

      if (!email || !password) {
         return res.status(400).json({ message: 'Email and password are required'});
      };

      const normalizedEmail = email.toLowerCase().trim();

      const emailExists = await User.checkEmailExists(normalizedEmail);

      if (!emailExists) {
         return res.status(404).json({ message: 'Invalid credentials' });
      };

      const isMatch = await bcrypt.compare(password, emailExists.password_hash);

      if (!isMatch) {
         return res.status(400).json({ message: 'Invalid credentials'});
      };

      const accessToken = generateAccessToken(emailExists);
      const refreshToken = generateRefreshToken();

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await saveRefreshToken(emailExists.id, refreshToken, expiresAt);

      res.cookie('refreshToken', refreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'Strict',
         maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      const { password_hash, ...userData } = emailExists;

      return res.status(200).json({
         message: 'user successfully logged in',
         user: userData,
         accessToken
      });

   } catch (err) {
      next(err);
   };
};

module.exports = {
   registerController,
   loginController,
};