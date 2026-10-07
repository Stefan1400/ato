const feedbackService = require('../services/feedbackService');
const parseIsoTimestamp = require('../utils/parseIsoTimestamp');

const getFeedbackController = async (req, res, next) => {
   const userId = req.user.id;
   const { todayStart, todayEnd, yesterdayStart, yesterdayEnd } = req.query;
   
   try {
      const ranges = {
         today: {
            start: parseIsoTimestamp(todayStart),
            end: parseIsoTimestamp(todayEnd),
         },
         yesterday: {
            start: parseIsoTimestamp(yesterdayStart),
            end: parseIsoTimestamp(yesterdayEnd),
         },
      };

      if (
         !ranges.today.start || !ranges.today.end ||
         !ranges.yesterday.start || !ranges.yesterday.end ||
         ranges.today.start >= ranges.today.end ||
         ranges.yesterday.start >= ranges.yesterday.end
      ) {
         return res.status(400).json({ message: 'Valid today and yesterday date boundaries are required.' });
      }

      const message = await feedbackService(userId, ranges);

      return res.status(200).json({ message: message });

   } catch (err) {
      next(err);
   };
};

module.exports = {
   getFeedbackController
}