const Session = require('../models/sessionModels');

const getFeedbackController = async (req, res, next) => {
   const userId = req.user.id;
   
   try {
      if (!userId) {
         return res.status(401).json({ message: 'UserId is required' });
      };

      const now = new Date();

      const startOfYesterdayUTC = new Date(Date.UTC(
         now.getUTCFullYear(),
         now.getUTCMonth(),
         now.getUTCDate() - 1,
         0, 0, 0, 0
      ));

      const endOfYesterdayUTC = new Date(Date.UTC(
         now.getUTCFullYear(),
         now.getUTCMonth(),
         now.getUTCDate() - 1,
         23, 59, 59, 999
      ));

      const startOfTodayUTC = new Date(Date.UTC(
         now.getUTCFullYear(),
         now.getUTCMonth(),
         now.getUTCDate(),
         0, 0, 0, 0
      ));

      const endOfTodayUTC = new Date(Date.UTC(
         now.getUTCFullYear(),
         now.getUTCMonth(),
         now.getUTCDate(),
         23, 59, 59, 999
      ));

      const yesterdaySessions = await Session.getSessionsFromYesterday(
         userId, 
         startOfYesterdayUTC, 
         endOfYesterdayUTC
      );

      const todaySessions = await Session.getSessionsFromToday(
         userId,
         startOfTodayUTC,
         endOfTodayUTC
      );


      //CALCULATING ANALYTICS


      function analyzeSessions(sessions) {
         let total = 0;
         let longest = 0;
         let count = 0;

         for (let i = 0; i < sessions.length; i++) {
            const duration = sessions[i].session_ended - sessions[i].session_started;

            if (duration > longest) {
               longest = duration;
            };

            total += duration;

            count++;
         };

         const average = count === 0 ? 0 : total / count;

         return {
            total,
            longest,
            average,
            count
         };
      };

      function calculateTotalTime(dayTotalTime) {
         const totalMinutes = dayTotalTime / 60000;
         const totalHours = Math.floor(totalMinutes / 60);
         const minutes = Math.floor(totalMinutes % 60);
         
         if (totalHours === 0) return `${minutes}min`
         if (minutes === 0) return `${totalHours}hrs`
         return `${totalHours}hrs, ${minutes}min`;
      };

      const yesterdayAnalytics = analyzeSessions(yesterdaySessions);
      const todayAnalytics = analyzeSessions(todaySessions);
      

      
      // CONVERTING ALL ANALYTICS TO MINUTES

      //yesterday
      const yesterdayTotalMinutes = calculateTotalTime(yesterdayAnalytics.total);
      const yesterdayLongestMinutes = calculateTotalTime(yesterdayAnalytics.longest);
      const yesterdayAverageMinutes = calculateTotalTime(yesterdayAnalytics.average);

      //today
      const todayTotalMinutes = calculateTotalTime(todayAnalytics.total);
      const todayLongestMinutes = calculateTotalTime(todayAnalytics.longest);
      const todayAverageMinutes = calculateTotalTime(todayAnalytics.average);

      console.log(yesterdayAnalytics.count);
      

      let response;
      
      // both sessions from Y & T
      if (yesterdayAnalytics.count > 0 && todayAnalytics.count > 0) {
         if (todayAnalytics.total > yesterdayAnalytics.total) {
            response = `Your total study time today is ${todayTotalMinutes} compared to yesterday's study time (${yesterdayTotalMinutes})`
         } else if (todayAnalytics.longest > yesterdayAnalytics.longest) {
            response = `Your longest session today is ${todayLongestMinutes} compared to yesterday's longest session (${yesterdayLongestMinutes})`
         } else if (todayAnalytics.average > yesterdayAnalytics.average) {
            response = `Your average session time is ${todayAverageMinutes} compared to yesterday's average session time (${yesterdayAverageMinutes})`
         } else {
            response = `Your total study time today is ${todayTotalMinutes}. Keep it up!`;
         }
      } 
      
      // sessions from T but none from Y
      else if (yesterdayAnalytics.count === 0 && todayAnalytics.count > 0) {
         response = `Your total study time today is ${todayTotalMinutes}. Let's keep it up!`;
      } 
      
      // sessions from Y but none from T
      else if (yesterdayAnalytics.count > 0 && todayAnalytics.count === 0) {
         response = `Your total study time yesterday was ${yesterdayTotalMinutes}. Let's hit it even harder today!`;
      } 
      
      // no sessions from either Y or T
      else {
         response = `Let's hit it hard today!`;
      };

      return res.status(200).json({
         message: response
      });

   } catch (err) {
      next(err);
   };
};

module.exports = {
   getFeedbackController
}