const feedbackService = require('../services/feedbackService');

const getFeedbackController = async (req, res, next) => {
   const userId = req.user.id;
   
   try {

      const message = await feedbackService(userId);

      return res.status(200).json({ message: message });

   } catch (err) {
      next(err);
   };
};

module.exports = {
   getFeedbackController
}