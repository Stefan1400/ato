import SessionTimer from '../features/tracker/SessionTimer';

function HomePage() {
  return (
    <div className='w-screen h-screen bg-[#151515] flex flex-col items-center px-6 pt-21'>
      <SessionTimer />
    </div>
  );
};

export default HomePage;