function formatDuration(ms) {
   const totalMinutes = Math.floor(ms / 60000);
   const hours = Math.floor(totalMinutes / 60);
   const minutes = totalMinutes % 60;

   if (hours === 0) return `${minutes}min`;
   if (minutes === 0) return `${hours}hrs`;
   return `${hours}hrs ${minutes}min`;
}

module.exports = formatDuration;