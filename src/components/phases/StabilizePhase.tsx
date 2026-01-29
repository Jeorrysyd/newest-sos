import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StabilizePhaseProps {
  onComplete: () => void;
  className?: string;
}

type BreathStep = "inhale" | "hold" | "exhale";

const breathingSteps: { step: BreathStep; label: string; duration: number }[] = [
  { step: "inhale", label: "吸气", duration: 4000 },
  { step: "hold", label: "屏住呼吸", duration: 2000 },
  { step: "exhale", label: "呼气", duration: 6000 },
];

const StabilizePhase = ({ onComplete, className }: StabilizePhaseProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const totalCycles = 3;

  const currentStep = breathingSteps[currentStepIndex];

  const advanceStep = useCallback(() => {
    if (!isActive) return;

    const nextIndex = (currentStepIndex + 1) % breathingSteps.length;
    
    if (nextIndex === 0) {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      
      if (newCycles >= totalCycles) {
        setIsActive(false);
        setTimeout(onComplete, 1000);
        return;
      }
    }
    
    setCurrentStepIndex(nextIndex);
  }, [currentStepIndex, cycles, isActive, onComplete]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(advanceStep, currentStep.duration);
    return () => clearTimeout(timer);
  }, [currentStepIndex, isActive, advanceStep, currentStep.duration]);

  // Calculate circle scale based on breathing step
  const getCircleScale = () => {
    switch (currentStep.step) {
      case "inhale": return 1.2;
      case "hold": return 1.2;
      case "exhale": return 1;
      default: return 1;
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen",
        "bg-background",
        className
      )}
    >
      {/* Wave pattern background */}
      <div className="absolute inset-0 wave-pattern wave-pattern-animated opacity-60" />

      {/* Breathing step indicators at top */}
      <div className="absolute top-24 flex items-center gap-8">
        {breathingSteps.map((step, index) => (
          <span
            key={step.step}
            className={cn(
              "text-lg font-light transition-all duration-500",
              currentStepIndex === index
                ? "text-primary glow-text scale-110"
                : "text-foreground/30"
            )}
          >
            {step.label}
          </span>
        ))}
      </div>

      {/* Breathing circle */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow */}
        <div 
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 50%,
              hsl(180 20% 25% / 0.5) 0%,
              hsl(180 15% 15% / 0.2) 50%,
              transparent 70%
            )`,
          }}
        />

        {/* Main breathing circle */}
        <motion.div
          className="relative w-72 h-72 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 50% 50%,
              hsl(180 15% 20%) 0%,
              hsl(180 12% 15%) 100%
            )`,
            boxShadow: `
              0 0 100px hsl(180 35% 45% / 0.3),
              inset 0 0 80px hsl(180 20% 10% / 0.6)
            `,
            border: '1px solid hsl(180 45% 55% / 0.25)',
          }}
          animate={{
            scale: getCircleScale(),
          }}
          transition={{
            duration: currentStep.step === "exhale" ? 6 : 4,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Progress indicator at bottom */}
      <div className="absolute bottom-32 flex items-center gap-4">
        {Array.from({ length: totalCycles }).map((_, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className={cn(
                "relative flex items-center justify-center",
                "transition-all duration-500"
              )}
            >
              {i < cycles ? (
                // Completed cycle - checkmark
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                  <svg 
                    className="w-3 h-3 text-primary" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : i === cycles ? (
                // Current cycle - progress bar
                <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: `${((currentStepIndex + 1) / breathingSteps.length) * 100}%` 
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              ) : (
                // Future cycle - empty bar
                <div className="w-16 h-1 bg-muted rounded-full" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StabilizePhase;