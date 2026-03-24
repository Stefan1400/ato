const session = { session_started: new Date(), session_ended: new Date(Date.now() + 2 * 60 * 60 * 1000) };

function Timeline() {

   const times = [];

   for (let i = 0; i < 24; i++) {
      let convertedTime = `${i.toString().padStart(2,'0')}:00`;
      times.push(convertedTime);
   };

   const sessionStart = session.session_started;
   const sessionEnd = session.session_ended;

   const durationMinutes = (sessionEnd.getTime() - sessionStart.getTime()) / (60 * 1000);
   
   const timelinePercentage = (durationMinutes / 1440) * 100;
   const roundedTimelinePercentage = Math.round(timelinePercentage * 100) / 100;

   const midnight = new Date(
      sessionStart.getFullYear(), 
      sessionStart.getMonth(), 
      sessionStart.getDate()
   );

   const topPlacement = (sessionStart.getTime() - midnight.getTime()) / (1000 * 60);
   const topPlacementPercent = (topPlacement / 1440) * 100;
   const roundedTopPlacement = Math.round(topPlacementPercent * 100) / 100;

   return (
    <div className="w-screen h-auto text-white flex flex-col items-center mt-30 relative">
      <ul className="flex flex-col items-start w-full">
         {times.map(t => (
            <li key={t} className="relative">
               <div className="w-screen h-0.5 bg-[#2E2E2E] absolute left-0 top-3 opacity-40 z-10"></div>
               <p className="relative z-40 ml-3">{t}</p>
            </li>
         ))}
      </ul>

      <div style={{ top: `${roundedTopPlacement}%`, height: `${roundedTimelinePercentage}%` }} className="w-3 bg-[#CC0000] absolute left-20 rounded-full z-40"></div>
    </div>
  )
};

export default Timeline;