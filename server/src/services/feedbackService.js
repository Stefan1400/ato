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
         return {
            feedbackType: "TODAY_TOTAL_GREATER",
            todayValue: today.total,
            yesterdayValue: yesterday.total
         }
      } else if (today.totalMs === yesterday.totalMs) {
         return {
            feedbackType: "TODAY_TOTAL_MATCH",
            todayValue: today.total,
            yesterdayValue: yesterday.total
         }
      } else if (today.longestMs > yesterday.longestMs) {
         return {
            feedbackType: "TODAY_LONGEST_GREATER",
            todayValue: today.longest,
            yesterdayValue: yesterday.longest
         }
      } else if (today.averageMs > yesterday.averageMs) {
        return {
            feedbackType: "TODAY_AVERAGE_GREATER",
            todayValue: today.average,
            yesterdayValue: yesterday.average
         }
      } else {
         return {
            feedbackType: "TODAY_TOTAL_ONLY",
            todayValue: today.total,
            yesterdayValue: null
         }
      }
   } 
   
   // sessions from T but none from Y
   else if (yesterday.count === 0 && today.count > 0) {
      return {
         feedbackType: "TODAY_TOTAL_ONLY",
         todayValue: today.total,
         yesterdayValue: null
      }
   }
   
   // sessions from Y but none from T
   else if (yesterday.count > 0 && today.count === 0) {
      return {
         feedbackType: "YESTERDAY_TOTAL_ONLY",
         todayValue: null,
         yesterdayValue: yesterday.total
      }
   } 
   
   // no sessions from either Y or T
   else {
      return {
         feedbackType: "NO_SESSIONS_YET",
         todayValue: null,
         yesterdayValue: null
      }
   };
};

module.exports = feedbackService;