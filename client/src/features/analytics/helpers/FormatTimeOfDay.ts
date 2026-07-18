export default function formatTimeOfDay(date: Date) {
   return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
   });
}