import { useState } from "react";
import EntryPhase from "@/components/phases/EntryPhase";
import TransitionPhase from "@/components/phases/TransitionPhase";
import ComfortPhase from "@/components/phases/ComfortPhase";
import StabilizePhase from "@/components/phases/StabilizePhase";
import CognitivePhase from "@/components/phases/CognitivePhase";
import ExitPhase from "@/components/phases/ExitPhase";
import { cn } from "@/lib/utils";

type Phase = "entry" | "transition" | "comfort" | "stabilize" | "cognitive" | "exit";

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>("entry");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTo = (phase: Phase) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPhase(phase);
      setIsTransitioning(false);
    }, 300);
  };

  const handleRestart = () => {
    transitionTo("entry");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Phase content */}
      <div
        className={cn(
          "transition-opacity duration-300 ease-out",
          isTransitioning && "opacity-0"
        )}
      >
        {currentPhase === "entry" && (
          <EntryPhase onEnter={() => setCurrentPhase("transition")} />
        )}
        
        {currentPhase === "transition" && (
          <TransitionPhase onComplete={() => transitionTo("comfort")} />
        )}
        
        {currentPhase === "comfort" && (
          <ComfortPhase onComplete={() => transitionTo("stabilize")} />
        )}
        
        {currentPhase === "stabilize" && (
          <StabilizePhase onComplete={() => transitionTo("cognitive")} />
        )}
        
        {currentPhase === "cognitive" && (
          <CognitivePhase onComplete={() => transitionTo("exit")} />
        )}
        
        {currentPhase === "exit" && (
          <ExitPhase onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
};

export default Index;