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
    <div className="fixed z-10 h-screen w-screen bg-[#090909] px-6 pt-21 lg:overflow-hidden lg:px-8 lg:pt-55 lg:flex lg:items-center lg:justify-center">
      <div className="page-background-gradient"></div>

      <div className="relative z-10 flex w-full max-w-7xl flex-1 flex-col lg:h-full lg:max-h-full lg:min-h-0 lg:flex-row lg:items-start lg:gap-8">
        <div className="w-full lg:min-h-0 lg:flex lg:items-start">
          <FeedbackMessage selectedDate={selectedDate} />
        </div>

        <div className="w-full lg:flex lg:min-h-0 lg:flex-col">
          <div className="w-full lg:hidden">
            <ViewByDate onOpen={handleOpenDateSelector} />
          </div>
          <SessionHistory
            selectedDate={selectedDate}
            onOpenDateSelector={handleOpenDateSelector}
          />
        </div>
      </div>

      {isDateSelectorOpen && (
        <DateSelector
          selectedDate={selectedDate}
          onSelect={handleSelectDate}
          onClose={handleCloseDateSelector}
        />
      )}
    </div>
  );
}

export default AnalyticsPage;