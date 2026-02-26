const formatDuration = require("../utils/formatDuration");
const Session = require('../models/sessionModels');
const analyzeSessions = require('../utils/analyzeSessions');

const feedbackService = async (userId) => {

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

   const yesterdayAnalytics = analyzeSessions(yesterdaySessions);
   const todayAnalytics = analyzeSessions(todaySessions);
   

   
   // CONVERTING ALL ANALYTICS TO MINUTES

   //yesterday
   const yesterdayTotalMinutes = formatDuration(yesterdayAnalytics.total);
   const yesterdayLongestMinutes = formatDuration(yesterdayAnalytics.longest);
   const yesterdayAverageMinutes = formatDuration(yesterdayAnalytics.average);

   //today
   const todayTotalMinutes = formatDuration(todayAnalytics.total);
   const todayLongestMinutes = formatDuration(todayAnalytics.longest);
   const todayAverageMinutes = formatDuration(todayAnalytics.average);
   

   let response;
   
   // both sessions from Y & T
   if (yesterdayAnalytics.count > 0 && todayAnalytics.count > 0) {
      if (todayAnalytics.total > yesterdayAnalytics.total) {
         response = `Your total study time today is ${todayTotalMinutes} compared to yesterday's study time (${yesterdayTotalMinutes}). Heck yeah!`
      } else if (todayAnalytics.longest > yesterdayAnalytics.longest) {
         response = `Your longest session today is ${todayLongestMinutes} compared to yesterday's longest session (${yesterdayLongestMinutes}). Awesome job!`
      } else if (todayAnalytics.average > yesterdayAnalytics.average) {
         response = `Your average session time today is ${todayAverageMinutes} compared to yesterday's average session time (${yesterdayAverageMinutes}). Great work!`
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

   return response;

};

module.exports = feedbackService;