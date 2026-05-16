import FeedbackMessage from "../feedback/feedbackMessage";
import SessionHistory from "./SessionHistory";
import ViewByDate from "./ViewByDate";

function AnalyticsPage() {
  return (
    <div className='w-screen h-auto bg-[#151515] flex flex-col items-center px-6 pt-21'>
      <FeedbackMessage />
      <ViewByDate />
      <SessionHistory />
    </div>
  )
};

export default AnalyticsPage;