function Timeline() {

   const times = [];

   for (let i = 0; i < 24; i++) {
      let convertedTime = `${i}:00`;
      times.push(convertedTime);
   };
  
   return (
    <div className="w-screen h-auto text-white flex flex-col items-center mt-30">
      <ul className="flex flex-col items-start w-full">
         {times.map(t => (
            <li key={t} className="relative">
               <div className="w-screen h-0.5 bg-[#2E2E2E] absolute left-0 top-3 opacity-40 z-10"></div>
               <p className="relative z-40 ml-3">{t}</p>
            </li>
         ))}
      </ul>
    </div>
  )
};

export default Timeline;