const { generateAccessToken, generateRefreshToken } = require('../utils/tokens');
const { saveRefreshToken, findRefreshToken, revokeRefreshToken } = require('../models/refreshTokenModel');

const sendNewAccessToken = async (req, res, next) => {
   try {
      const oldRefreshToken = req.cookies?.refreshToken;

      if (!oldRefreshToken) {
         return res.status(401).json({ message: 'No refresh token provided' });
      };

      const tokenRow = await findRefreshToken(oldRefreshToken);
      if (!tokenRow) {
         return res.status(401).json({ message: 'Invalid refresh token' });
      };

      await revokeRefreshToken(oldRefreshToken);

      const user = { id: tokenRow.user_id };
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken();

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await saveRefreshToken(user.id, newRefreshToken, expiresAt);

      res.cookie('refreshToken', newRefreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'Strict',
         maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
         accessToken: newAccessToken
      });

   } catch (err) {
      next(err);
   };
};

module.exports = {
   sendNewAccessToken
};
