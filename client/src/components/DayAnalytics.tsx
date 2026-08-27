import { useNavigate } from "react-router-dom";
import { useGetFeedback } from "../features/feedback/useFeedback";

function DayAnalytics() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetFeedback();

  const today = data?.todayValue || "0min";
  const feedbackType = data?.feedbackType;

  const formattedTime = isLoading ? "0min" : today;

  const comparisonMessage = feedbackType === "TODAY_TOTAL_GREATER"
    ? "Great job — more focus today than yesterday"
    : feedbackType === "TODAY_TOTAL_MATCH"
    ? "Nice — you matched yesterday's focus time"
    : feedbackType === "NO_SESSIONS_YET"
    ? "No sessions yet — start today to track your focus"
    : "Keep it up — stay focused";

  return (
    <div className="w-full min-w-0 max-w-md h-auto bg-[#1F1F1F] border-2 border-[#2A2A2A] rounded-md p-6 flex flex-col gap-6 text-white">
      <div>
        <h2 className="font-semibold text-md mb-4">Analytics</h2>
        <div>
          <p className="text-[#a8a8a8] text-sm mb-2">Today's study time</p>
          <p className="text-4xl font-bold">{isLoading ? "0min" : formattedTime}</p>
        </div>
      </div>

      <div>
        <p className="text-[#a8a8a8] text-sm">{comparisonMessage}</p>
      </div>

      <button
        onClick={() => navigate("/analytics")}
        className="w-full px-4 py-2 bg-[#2A2A2A] hover:bg-[#333333] text-white rounded-md font-medium transition-colors cursor-pointer"
      >
        View Session History
      </button>
    </div>
  );
}

export default DayAnalytics;
