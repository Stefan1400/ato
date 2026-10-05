import SessionTimer from '../features/tracker/SessionTimer';
import WelcomeMessage from '../components/WelcomeMessage';
import DayAnalytics from '../components/DayAnalytics';

function HomePage() {
  return (
    <div className="relative w-screen min-h-screen bg-[#090909]/95 backdrop-blur-sm px-6 pt-24 lg:pt-10 lg:grid place-items-center justify-items-center">
      <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-5 lg:max-w-fit lg:grid-cols-[24rem_24rem] lg:gap-40 mt-10">

        <div className="page-background-gradient"></div>

        
        <div className="flex flex-col h-full">
          <WelcomeMessage />

          <div className="mt-auto">
            <SessionTimer />
          </div>
        </div>

        <DayAnalytics />

    </div>
  </div>
  );
};

export default HomePage;