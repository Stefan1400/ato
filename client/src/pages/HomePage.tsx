import SessionTimer from '../features/tracker/SessionTimer';
import WelcomeMessage from '../components/WelcomeMessage';
import DayAnalytics from '../components/DayAnalytics';

function HomePage() {
  return (
    <div className="w-screen min-h-screen bg-[#090909]/95 backdrop-blur-sm px-6 pt-24 lg:grid place-items-center">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-5 lg:gap-40 lg:grid-cols-2 lg:items-center lg:justify-center">

        <div className="flex flex-col gap-8">
          <WelcomeMessage />
          <SessionTimer />
        </div>

        <div>
          <DayAnalytics />
        </div>

    </div>
  </div>
  );
};

export default HomePage;