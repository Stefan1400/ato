import SessionTimer from '../features/tracker/SessionTimer';
import WelcomeMessage from '../components/WelcomeMessage';
import DayAnalytics from '../components/DayAnalytics';

function HomePage() {
  return (
    <div className='w-screen min-h-screen bg-[#151515] flex flex-col px-6 pt-24 items-center justify-center'>
      <div className='flex flex-col lg:flex-row gap-8 justify-start items-center w-full max-w-7xl mx-auto'>
        {/* Left Column */}
        <div className='flex flex-col items-start w-full lg:w-auto gap-8'>
          <WelcomeMessage />
          <div className='flex justify-start w-full'>
            <SessionTimer />
          </div>
        </div>

        {/* Right Column */}
        <div className='flex justify-center lg:justify-center w-full lg:w-auto'>
          <DayAnalytics />
        </div>
      </div>
    </div>
  );
};

export default HomePage;