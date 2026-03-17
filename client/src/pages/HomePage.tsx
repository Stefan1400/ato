import SessionTimer from '../features/tracker/SessionTimer';
import WelcomeMessage from '../components/WelcomeMessage';

function HomePage() {
  return (
    <div className='w-screen h-screen bg-[#151515] flex flex-col items-center px-6 pt-21'>
      <WelcomeMessage />
      <SessionTimer />
    </div>
  );
};

export default HomePage;