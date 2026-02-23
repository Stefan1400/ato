const User = require('../models/authModels');
const crypto = require('crypto');
const { hashToken, hashValue } = require('../utils/hash');
const { savePasswordResetToken, deletePasswordResetTokens, findPasswordResetTokenByHash } = require('../models/passwordResetTokenModel');
const { findRefreshToken, revokeAllRefreshTokens } = require('../models/refreshTokenModel');

const forgotPasswordController = async (req, res, next) => {
   const { email } = req.body;

   try {

      const normalizedEmail = email.toLowerCase().trim();

      const userExists = await User.checkEmailExists(normalizedEmail);

      if (!userExists) {
         return res.status(204).send();
      };

      const rawToken = crypto.randomBytes(32).toString('hex');

      const tokenHash = hashToken(rawToken);

      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await savePasswordResetToken(userExists.id, tokenHash, expiresAt);

      console.log('PASSWORD RESET TOKEN:', rawToken);
      
      return res.status(204).send();

   } catch (err) {
      next(err);
   };
};

const resetPasswordController = async (req, res, next) => {
   
   const token = req.body.token;
   const newPassword = req.body.new_password;
   
   try {

      if (!token || !newPassword) {
         return res.status(400).json({ message: 'Token or new password are required' });
      };

      const tokenHash = hashToken(token);

      const tokenRow = await findPasswordResetTokenByHash(tokenHash);

      if (!tokenRow) {
         return res.status(404).json({ message: 'Invalid token' });
      };

      if (tokenRow.expires_at < Date.now()) {
         return res.status(400).json({ message: 'Expired token' });
      };

      const newHashedPassword = await hashValue(newPassword);

      const passwordChanged = await User.changePassword(tokenRow.user_id, newHashedPassword);

      if (!passwordChanged) {
         return res.status(400).json({ message: 'Invalid request' });
      };

      await revokeAllRefreshTokens(tokenRow.user_id);

      await deletePasswordResetTokens(tokenRow.user_id);

      return res.status(200).json({
         message: 'Successfully reset password'
      });

   } catch (err) {
      next(err);
   };
};

module.exports = {
   forgotPasswordController,
   resetPasswordController
};