import { useState } from "react";
import BreathingRing from "@/components/BreathingRing";
import { cn } from "@/lib/utils";

interface OrientPhaseProps {
  onComplete: () => void;
  className?: string;
}

const orientSteps = [
  {
    question: "现在是什么时间？",
    hint: "大概的时间就好",
  },
  {
    question: "你现在在哪里？",
    hint: "办公室、家里、或其他地方",
  },
  {
    question: "你能看到什么？",
    hint: "看看周围，说出一个你能看到的东西",
  },
  {
    question: "你能听到什么？",
    hint: "任何声音都可以",
  },
];

const OrientPhase = ({ onComplete, className }: OrientPhaseProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    if (currentStep >= orientSteps.length - 1) {
      setIsTransitioning(true);
      setTimeout(onComplete, 800);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((s) => s + 1);
      setIsTransitioning(false);
    }, 500);
  };

  const step = orientSteps[currentStep];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen px-6",
        "animate-fade-in-up",
        className
      )}
    >
      {/* Phase title */}
      <div className="absolute top-20 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
          Orient
        </p>
        <h2 className="text-lg font-light text-foreground/80">定向</h2>
      </div>

      {/* Content with ring background */}
      <BreathingRing size="xl" intensity="soft">
        <div
          className={cn(
            "text-center max-w-xs transition-all duration-500",
            isTransitioning && "opacity-0 transform scale-95"
          )}
        >
          <p className="text-xl font-light mb-4 glow-text">{step.question}</p>
          <p className="text-sm text-muted-foreground">{step.hint}</p>
        </div>
      </BreathingRing>

      {/* Next button */}
      <button
        onClick={handleNext}
        className={cn(
          "absolute bottom-32 px-8 py-3 rounded-full",
          "bg-primary/10 border border-primary/30",
          "text-primary font-light",
          "transition-all duration-500",
          "hover:bg-primary/20 hover:border-primary/50",
          "focus:outline-none focus:ring-2 focus:ring-primary/30",
          "active:scale-95"
        )}
      >
        继续
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-16 flex items-center gap-2">
        {orientSteps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-300",
              i === currentStep ? "bg-primary w-4" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default OrientPhase;
