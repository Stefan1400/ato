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

module.exports = analyzeSessions;