import { cn } from "@/lib/utils";

export type Phase = "entry" | "stabilize" | "orient" | "connect" | "exit";

interface PhaseIndicatorProps {
  currentPhase: Phase;
  className?: string;
}

const phases: { id: Phase; label: string }[] = [
  { id: "stabilize", label: "稳定" },
  { id: "orient", label: "定向" },
  { id: "connect", label: "连接" },
  { id: "exit", label: "结束" },
];

const PhaseIndicator = ({ currentPhase, className }: PhaseIndicatorProps) => {
  const currentIndex = phases.findIndex((p) => p.id === currentPhase);

  if (currentPhase === "entry") return null;

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {phases.map((phase, index) => {
        const isActive = phase.id === currentPhase;
        const isPast = index < currentIndex;
        
        return (
          <div key={phase.id} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center justify-center",
                "w-2 h-2 rounded-full transition-all duration-500",
                isActive && "w-3 h-3 bg-primary glow-ring",
                isPast && "bg-primary/50",
                !isActive && !isPast && "bg-muted-foreground/30"
              )}
            />
            {index < phases.length - 1 && (
              <div
                className={cn(
                  "w-8 h-px transition-all duration-500",
                  isPast ? "bg-primary/50" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PhaseIndicator;
