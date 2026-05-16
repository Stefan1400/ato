import { useState } from "react";
import FeedbackMessage from "../feedback/feedbackMessage";
import SessionHistory from "./sessions/SessionHistory";
import ViewByDate from "./selectByDate/ViewByDate";
import DateSelector from "./selectByDate/DateSelector";

function AnalyticsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);

  const handleOpenDateSelector = () => setIsDateSelectorOpen(true);
  const handleCloseDateSelector = () => setIsDateSelectorOpen(false);
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsDateSelectorOpen(false);
  };

  return (
    <div className="w-screen h-auto bg-[#151515] flex flex-col items-center px-6 pt-21">
      <FeedbackMessage selectedDate={selectedDate} />
      <ViewByDate onOpen={handleOpenDateSelector} />
      {isDateSelectorOpen && (
        <DateSelector
          selectedDate={selectedDate}
          onSelect={handleSelectDate}
          onClose={handleCloseDateSelector}
        />
      )}
      <SessionHistory selectedDate={selectedDate} />
    </div>
  );
}

export default AnalyticsPage;