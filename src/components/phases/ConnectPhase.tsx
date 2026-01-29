import { useState } from "react";
import BreathingRing from "@/components/BreathingRing";
import { cn } from "@/lib/utils";

interface ConnectPhaseProps {
  onComplete: () => void;
  className?: string;
}

const connectSteps = [
  {
    instruction: "双脚踩在地上",
    detail: "感受脚底和地面的接触",
  },
  {
    instruction: "双手放在膝盖上",
    detail: "感受手掌的温度",
  },
  {
    instruction: "轻轻按压你的双手",
    detail: "感受这个简单的动作",
  },
];

const ConnectPhase = ({ onComplete, className }: ConnectPhaseProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    if (currentStep >= connectSteps.length - 1) {
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

  const step = connectSteps[currentStep];

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
          Connect
        </p>
        <h2 className="text-lg font-light text-foreground/80">连接</h2>
      </div>

      {/* Content with ring background */}
      <BreathingRing size="xl" intensity="soft">
        <div
          className={cn(
            "text-center max-w-xs transition-all duration-500",
            isTransitioning && "opacity-0 transform scale-95"
          )}
        >
          <p className="text-xl font-light mb-4 glow-text">{step.instruction}</p>
          <p className="text-sm text-muted-foreground">{step.detail}</p>
        </div>
      </BreathingRing>

      {/* Action button */}
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
        做好了
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-16 flex items-center gap-2">
        {connectSteps.map((_, i) => (
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

export default ConnectPhase;
