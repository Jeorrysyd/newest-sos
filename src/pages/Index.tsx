import { useState } from "react";
import EntryPhase from "@/components/phases/EntryPhase";
import StabilizePhase from "@/components/phases/StabilizePhase";
import OrientPhase from "@/components/phases/OrientPhase";
import ConnectPhase from "@/components/phases/ConnectPhase";
import ExitPhase from "@/components/phases/ExitPhase";
import PhaseIndicator, { type Phase } from "@/components/PhaseIndicator";
import { cn } from "@/lib/utils";

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>("entry");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTo = (phase: Phase) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPhase(phase);
      setIsTransitioning(false);
    }, 600);
  };

  const handleRestart = () => {
    transitionTo("entry");
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-glow-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Phase indicator */}
      <div className="fixed top-8 left-0 right-0 z-50 flex justify-center">
        <PhaseIndicator currentPhase={currentPhase} />
      </div>

      {/* Phase content */}
      <div
        className={cn(
          "transition-all duration-600 ease-out",
          isTransitioning && "opacity-0 scale-95"
        )}
      >
        {currentPhase === "entry" && (
          <EntryPhase onEnter={() => transitionTo("stabilize")} />
        )}
        
        {currentPhase === "stabilize" && (
          <StabilizePhase onComplete={() => transitionTo("orient")} />
        )}
        
        {currentPhase === "orient" && (
          <OrientPhase onComplete={() => transitionTo("connect")} />
        )}
        
        {currentPhase === "connect" && (
          <ConnectPhase onComplete={() => transitionTo("exit")} />
        )}
        
        {currentPhase === "exit" && (
          <ExitPhase onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
};

export default Index;
