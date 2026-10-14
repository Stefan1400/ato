import { Link } from "react-router-dom";
import { Calendar, Play, Square } from "lucide-react";

const sectionClassName =
  "flex w-full flex-col justify-start bg-[#090909] px-6 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-10 lg:pt-[16vh]";

const containerClassName = "mx-auto w-full max-w-6xl";

const sectionHeadingClassName = "text-4xl font-semibold tracking-tight text-[#A8A8A8] sm:text-5xl";

const sectionTextClassName = "text-base leading-7 text-[#A8A8A8] sm:text-lg";

const cardClassName =
  "rounded-lg border border-[#1F1F1F] bg-[#1A1A1A] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2A2A2A] hover:bg-[#202020] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]";

const timerButtonClassName =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#090909] text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A7BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]";

const primaryButtonClassName =
  "inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-[#090909] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E5E5E5] hover:cursor-pointer hover:shadow-[0_10px_30px_rgba(255,255,255,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A7BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] active:translate-y-0";

const secondaryButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-md border border-[#2A2A2A] bg-[#121212] px-4 py-2 text-sm font-medium text-[#F5F5F5] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A7BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]";

const greetings = [
  { title: "Good morning, John", subtitle: "Ready to get started? 😊" },
  { title: "Good afternoon, John", subtitle: "You've focused", highlight: "25min", suffix: "💪 today." },
  { title: "Good evening, John", subtitle: "You've focused", highlight: "2hr 15min", suffix: "💪 today." },
];

const sessionHistory = [
  { duration: "14min", time: "10:52 - 11:06" },
  { duration: "0min", time: "09:51 - 09:51" },
  { duration: "1min", time: "09:02 - 09:03" },
];

type TimerCardProps = {
  variant: "ready" | "focus" | "saved";
  label: string;
  time: string;
  caption: string;
  showButton?: boolean;
};

const steps: { title: string; description: string; highlight: string; timer: TimerCardProps }[] = [
  {
    title: "Start your session",
    description: "When you're ready to study, start the timer.",
    highlight: "Ato does the rest",
    timer: { variant: "ready", label: "Ready", time: "00:00:00", caption: "Session Timer" },
  },
  {
    title: "Focus on your work",
    description: "Let the timer run while you study.",
    highlight: "Ato tracks your time automatically.",
    timer: { variant: "focus", label: "Focus Session", time: "00:51:44", caption: "Stay Focused" },
  },
  {
    title: "Save your session",
    description: "Done studying? Stop the timer.",
    highlight: "Ato will save it for you.",
    timer: {
      variant: "saved",
      label: "Session Added",
      time: "00:51:44",
      caption: "Session Saved to Analytics",
      showButton: false,
    },
  },
];

const timerVariantClassNames = {
  ready: "bg-[#222222] text-white hover:bg-[#2A2A2A]",
  focus: "bg-[#FFA31A] text-[#090909] hover:bg-[#FFAE33]",
  saved: "bg-[#04784F] text-white hover:bg-[#058A5B]",
};

function TimerCard({ variant, label, time, caption, showButton = true }: TimerCardProps) {
  return (
    <div
      className={`flex w-full items-center justify-between gap-4 rounded-lg px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${timerVariantClassNames[variant]}`}
    >
      <div className="flex flex-col">
        <span className="text-xs font-medium">{label}</span>
        <span className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{time}</span>
        <span className="mt-1 text-[10px] opacity-80">{caption}</span>
      </div>

      {showButton && (
        <button
          type="button"
          className={timerButtonClassName}
          aria-label={variant === "ready" ? "Start timer" : "Stop timer"}
        >
          {variant === "ready" ? (
            <Play className="h-5 w-5 fill-white" />
          ) : (
            <Square className="h-4 w-4 fill-white" />
          )}
        </button>
      )}
    </div>
  );
}

export default function LandingPage() {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <section className="flex w-full flex-col bg-[#090909]">
        <div className="flex min-h-[110vh] items-start px-6 pb-20 pt-[60vh] sm:px-8 lg:px-10">
          <div className={`${containerClassName} flex flex-col items-start justify-between gap-12 md:flex-row md:items-center`}>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Track your study.
              <br />
              See your progress.
            </h1>

            <div className="flex w-full max-w-xs flex-col gap-3 md:max-w-sm" aria-hidden="true">
              <div className="h-2.5 w-full rounded-full bg-[#1A1A1A]">
                <div className="h-full w-1/3 rounded-full bg-white" />
              </div>
              <div className="ml-6 h-2.5 w-[90%] rounded-full bg-[#1A1A1A]" />
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-8 lg:px-10 lg:pb-32">
          <div className={containerClassName}>
            <p className="text-center text-sm text-[#A8A8A8] sm:text-left sm:text-base">
              Ato gives real-time feedback to help motivate you in your studies.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {greetings.map((greeting) => (
                <div
                  key={greeting.title}
                  className="rounded-lg p-2 text-center sm:text-left"
                >
                  <h2 className="text-2xl font-semibold tracking-tight">{greeting.title}</h2>
                  <p className="mt-2 text-xs text-[#F5F5F5]">
                    {greeting.subtitle}{" "}
                    {greeting.highlight && <span className="font-bold">{greeting.highlight}</span>}{" "}
                    {greeting.suffix}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${sectionClassName} lg:min-h-screen`}>
        <div className={containerClassName}>
          <div className="grid grid-cols-1 divide-y divide-[#1F1F1F] lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {steps.map((step) => (
              <div
                key={step.title}
                className="flex flex-col gap-10 py-10 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0 lg:last:pr-0"
              >
                <div className="w-full max-w-100 lg:max-w-none">
                  <TimerCard {...step.timer} />
                </div>

                <div>
                  <h2 className="text-xl font-medium tracking-tight text-white">{step.title}</h2>
                  <p className="mt-3 text-xs leading-6 text-[#A8A8A8] sm:text-base">
                    {step.description} <span className="font-semibold text-white">{step.highlight}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${sectionClassName} lg:min-h-[125vh]`}>
        <div className={containerClassName}>
          <h2 className={sectionHeadingClassName}>
            <span className="text-white">Review</span> your progress
          </h2>
          <p className={`${sectionTextClassName} mt-6 max-w-xs`}>Track your progress, no matter the day, month, or year.</p>

          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col justify-center">
              <p className="text-xs font-medium text-[#5A5A5A]">Tue Oct 06 2026</p>
              <p className="mt-2 text-4xl font-medium tracking-tight">15min</p>
              <p className="mt-2 text-xs text-[#8A8A8A]">
                Nice work - <span className="font-semibold text-white">15min</span> today
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-medium text-[#5A5A5A]">Session History - Tue Oct 06 2026</p>
                <button type="button" className={secondaryButtonClassName}>
                  <Calendar className="h-3.5 w-3.5" />
                  <span>View by Date</span>
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {sessionHistory.map((session) => (
                  <div key={session.time} className={`${cardClassName} flex items-center justify-between`}>
                    <span className="text-sm font-semibold">{session.duration}</span>
                    <span className="text-xs text-[#A8A8A8]">{session.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-[95vh] w-full flex-col bg-[#090909]">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:px-8 lg:px-10">
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Start tracking your progress now
          </h2>
          <Link to="/" className={`${primaryButtonClassName} mt-12`}>
            Get Started
          </Link>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-[#1A1A1A] px-6 py-6 sm:px-8 lg:px-10">
          <p className="text-xs text-[#F5F5F5]">© {new Date().getFullYear()} Ato. All rights reserved.</p>
          <button type="button" onClick={handleBackToTop} className={secondaryButtonClassName}>
            Back to top
          </button>
        </footer>
      </section>
    </div>
  );
}
