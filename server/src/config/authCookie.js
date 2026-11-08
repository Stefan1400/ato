const getAuthCookieOptions = () => {
   const isProduction = process.env.NODE_ENV === 'production';

   return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
   };
};

const setAuthCookie = (res, token) => {
   res.cookie('token', token, {
      ...getAuthCookieOptions(),
      maxAge: 1000 * 60 * 60 * 24 * 7,
   });
};

const clearAuthCookie = (res) => {
   res.clearCookie('token', getAuthCookieOptions());
};

module.exports = {
   getAuthCookieOptions,
   setAuthCookie,
   clearAuthCookie,
};
