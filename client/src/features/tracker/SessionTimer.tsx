function SessionTimer() {
  return (
    <div className='w-full h-auto bg-[#1F1F1F] rouned-2xl border-2 border-[#2A2A2A] text-white flex flex-row justify-between items-center p-3 rounded-md'>
      <div className='flex flex-col items-start justify-between gap-2'>
         <h2 className="font-normal">Start your session</h2>
         <span className="text-3xl font-semibold">00:00</span>
         <h3 className="font-normal text-[#7E7E7E]">current session</h3>
      </div>

      <button className="p-3.5">
         <div className='p-6 bg-[#161616] rounded-full border-3 border-[#2A2A2A]'>
            <svg width="20" height="21" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M2.41923 0.197138C1.9125 -0.076068 1.29952 -0.0640149 0.800961 0.225262C0.302404 0.514539 0 1.04086 0 1.60736V16.3926C0 16.9591 0.30649 17.4855 0.800961 17.7747C1.29543 18.064 1.9125 18.0761 2.41923 17.8029L16.15 10.4102C16.6731 10.129 17 9.58659 17 9C17 8.41341 16.6731 7.87102 16.15 7.58977L2.41923 0.197138Z" fill="white"/>
            </svg>
         </div>
      </button>
    </div>
  )
}

export default SessionTimer;