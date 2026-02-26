const Session = require('../models/sessionModels');
const analyzeSessions = require('../utils/analyzeSessions');
const buildDay = require("../utils/buildDay");

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

   // calculating analytics

   const yesterdayAnalytics = analyzeSessions(yesterdaySessions);
   const todayAnalytics = analyzeSessions(todaySessions);

   // storing analytics into their own object; converting to minutes

   const yesterday = buildDay(yesterdayAnalytics);
   const today = buildDay(todayAnalytics);
   
   
   // both sessions from Y & T
   if (yesterday.count > 0 && today.count > 0) {
      if (today.totalMs > yesterday.totalMs) {
         return `Your total focused time today is ${today.total} compared to yesterday's focused time (${yesterday.total}). Heck yeah!`
      } else if (today.totalMs === yesterday.totalMs) {
         return `That's a first. Your total focused time today (${today.total}) is tied with your total focused time yesterday (${yesterday.total}). Wanna beat it?`;
      } else if (today.longestMs > yesterday.longestMs) {
         return `Your longest session today is ${today.longest} compared to yesterday's longest session (${yesterday.longest}). Awesome job!`
      } else if (today.averageMs > yesterday.averageMs) {
         return `Your average session time today is ${today.average} compared to yesterday's average session time (${yesterday.average}). Great work!`
      } else {
         return `Your total focused time today is ${today.total}. Keep it up!`;
      }
   } 
   
   // sessions from T but none from Y
   else if (yesterday.count === 0 && today.count > 0) {
      return `Your total focused time today is ${today.total}. Let's keep it up!`;
   }
   
   // sessions from Y but none from T
   else if (yesterday.count > 0 && today.count === 0) {
      return `Your total focused time yesterday was ${yesterday.total}. Let's hit it even harder today!`;
   } 
   
   // no sessions from either Y or T
   else {
      return `Let's hit it hard today!`;
   };
};

module.exports = feedbackService;