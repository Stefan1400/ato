const User = require('../models/authModels');
const { hashValue, compareValue } = require('../utils/hash');
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

      const hashedPassword = await hashValue(password);

      const createdUser = await User.registerUser(normalizedEmail, hashedPassword);

      if (!createdUser) {
         return res.status(409).json({ message: 'There was a problem creating an account' });
      };

      const { password_hash, ...userData } = createdUser;
      const token = createToken(userData);

      res.cookie('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'lax',
         path: '/',
         maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      return res.status(201).json({
         message: 'user successfully created',
         user: userData,
         token,
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

      const isMatch = await compareValue(password, emailExists.password_hash);

      if (!isMatch) {
         return res.status(400).json({ message: 'Invalid credentials'});
      };

      console.log('made it past isMatch');
      
      const { password_hash, ...userData } = emailExists;
      const token = createToken(userData);

      res.cookie('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'lax',
         path: '/',
         maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      console.log('made it past token creation: ');
      
      return res.status(200).json({
         message: 'user successfully logged in',
         user: userData,
         token,
      });

   } catch (err) {
      next(err);
   };
};

const logoutController = async (req, res, next) => {
   try {

      res.clearCookie('token', {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'lax',
         path: '/',
      });

      return res.status(200).json({
         message: 'Successfully logged out'
      });

   } catch (err) {
      next(err);
   };
};

const deleteUserController = async (req, res, next) => {
   const userId = req.user.id;

   try {

      const deletedUser = await User.deleteUser(userId);

      if (!deletedUser) {
         return res.status(400).json({ message: 'User deletion unsuccessful' });
      };

      res.clearCookie('token', {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'lax',
      });

      return res.status(200).json({
         message: 'User successfully deleted',
      });

   } catch (err) {
      next(err);
   };
};

const changePasswordController = async (req, res, next) => {
   const userId = req.user.id;
   const currentPassword = req.body.current_password;
   const newPassword = req.body.new_password;
   
   try {

      if (!currentPassword || !newPassword) {
         return res.status(400).json({ message: 'Invalid credentials' });
      };

      if (currentPassword === newPassword) {
         return res.status(400).json({ message: 'Please submit a new password' });
      };

      const userExists = await User.findUserById(userId);

      if (!userExists) {
         return res.status(400).json({ message: 'Invalid request' });
      };

      const passwordMatches = await compareValue(currentPassword, userExists.password_hash);

      if (!passwordMatches) {
         return res.status(400).json({ message: 'Invalid credentials' });
      };

      const newHashedPassword = await hashValue(newPassword, 10);

      const changedPassword = await User.changePassword(userId, newHashedPassword);

      if (!changedPassword) {
         return res.status(409).json({ message: 'Password change unsuccessful' });
      };

      return res.status(200).json({
         message: 'Password Successfully changed'
      });

   } catch (err) {
      next(err);
   };
};

const getUserController = async (req, res, next) => {
   const userId = req.user.id;

   try {

      const fetchedUser = await User.findUserById(userId);

      if (!fetchedUser) {
         return res.status(404).json({ message: 'Invalid request' });
      };

      const { password_hash, ...userData } = fetchedUser;

      return res.status(200).json({
         message: 'Successfully fetched User',
         fetchedUser: userData
      });

   } catch (err) {
      next(err);
   };
};

module.exports = {
   registerController,
   loginController,
   logoutController,
   deleteUserController,
   changePasswordController,
   getUserController
};