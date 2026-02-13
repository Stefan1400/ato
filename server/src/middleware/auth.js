const authMiddleware = (req, res, next) => {
   const token = req.cookies?.jwt;
   if (!token) return res.status(401).json({ message: 'Unauthorized' });

   try {
      const payload = verifyJWT(token, process.env.JWT_SECRET);
      req.user = payload;
      next();
   } catch {
      return res.status(401).json({ message: 'Invalid token' });
   }
}