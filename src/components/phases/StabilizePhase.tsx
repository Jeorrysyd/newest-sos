import { useState, useEffect } from "react";
import BreathingRing from "@/components/BreathingRing";
import { cn } from "@/lib/utils";

interface StabilizePhaseProps {
  onComplete: () => void;
  className?: string;
}

const breathingSteps = [
  { text: "慢慢吸气", duration: 4000 },
  { text: "屏住呼吸", duration: 2000 },
  { text: "慢慢呼气", duration: 6000 },
  { text: "保持", duration: 2000 },
];

const StabilizePhase = ({ onComplete, className }: StabilizePhaseProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const totalCycles = 3;

  useEffect(() => {
    if (cycles >= totalCycles) {
      setIsAnimating(false);
      setTimeout(onComplete, 1500);
      return;
    }

    const timer = setTimeout(() => {
      const nextStep = (currentStep + 1) % breathingSteps.length;
      setCurrentStep(nextStep);
      
      if (nextStep === 0) {
        setCycles((c) => c + 1);
      }
    }, breathingSteps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, cycles, onComplete]);

  const step = breathingSteps[currentStep];

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
          Stabilize
        </p>
        <h2 className="text-lg font-light text-foreground/80">稳定</h2>
      </div>

      {/* Breathing ring with instruction */}
      <BreathingRing size="xl" intensity={isAnimating ? "intense" : "soft"}>
        <div className="text-center">
          <p
            className={cn(
              "text-2xl font-light glow-text transition-all duration-700",
              !isAnimating && "opacity-50"
            )}
          >
            {isAnimating ? step.text : "很好"}
          </p>
        </div>
      </BreathingRing>

      {/* Progress indicator */}
      <div className="absolute bottom-32 flex items-center gap-3">
        {Array.from({ length: totalCycles }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-500",
              i < cycles ? "bg-primary" : "bg-muted-foreground/30",
              i === cycles && "animate-pulse bg-primary/70"
            )}
          />
        ))}
      </div>

      {/* Helper text */}
      <p className="absolute bottom-16 text-sm text-muted-foreground/50 text-center">
        跟随光环的节奏呼吸
      </p>
    </div>
  );
};

export default StabilizePhase;
