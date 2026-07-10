const User = require('../models/authModels');
const { hashValue, compareValue } = require('../utils/hash');
const { createToken, getJwtSecret } = require('../utils/jwt');

const sendAuthResponse = (res, user, statusCode, message) => {
   const { password_hash, ...userData } = user;
   const token = createToken(userData);

   res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
   });

   return res.status(statusCode).json({
      message,
      user: userData,
      token,
   });
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

      const createdUser = await User.registerUser(normalizedEmail, hashedPassword, 'user');

      if (!createdUser) {
         return res.status(409).json({ message: 'There was a problem creating an account' });
      };

      return sendAuthResponse(res, createdUser, 201, 'user successfully created');

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
      
      return sendAuthResponse(res, emailExists, 200, 'user successfully logged in');

   } catch (err) {
      next(err);
   };
};

const createGuestController = async (req, res, next) => {
   try {
      const createdGuest = await User.createGuestUser();

      if (!createdGuest) {
         return res.status(409).json({ message: 'There was a problem creating a guest account' });
      };

      return sendAuthResponse(res, createdGuest, 201, 'guest account successfully created');
   } catch (err) {
      next(err);
   };
};

const convertGuestToUserController = async (req, res, next) => {
   const userId = req.user.id;
   const { email, password } = req.body;

   try {
      if (!email || !password) {
         return res.status(400).json({ message: 'Email and password are required' });
      };

      const normalizedEmail = email.toLowerCase().trim();
      const existingUser = await User.checkEmailExists(normalizedEmail);

      if (existingUser && existingUser.id !== userId) {
         return res.status(409).json({ message: 'Invalid credentials' });
      };

      const hashedPassword = await hashValue(password);
      const convertedUser = await User.convertGuestToUser(userId, normalizedEmail, hashedPassword);

      if (!convertedUser) {
         return res.status(409).json({ message: 'There was a problem upgrading the account' });
      };

      return sendAuthResponse(res, convertedUser, 200, 'account successfully upgraded');
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
   createGuestController,
   convertGuestToUserController,
   logoutController,
   deleteUserController,
   changePasswordController,
   getUserController
};