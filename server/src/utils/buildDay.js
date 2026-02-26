const formatDuration = require('./formatDuration');

const buildDay = (analytics) => ({
   totalMs: analytics.total,
   longestMs: analytics.longest,
   averageMs: analytics.average,
   
   total: formatDuration(analytics.total),
   longest: formatDuration(analytics.longest),
   average: formatDuration(analytics.average),

   count: analytics.count
});

module.exports = buildDay;