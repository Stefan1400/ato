export default function formatElapsedTime(totalSeconds: number) {
   const seconds = totalSeconds % 60;
   const minutes = Math.floor(totalSeconds / 60) % 60;
   const hours = Math.floor(totalSeconds / 3600);
   const pad = (num: number) => String(num).padStart(2, '0');

   return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};