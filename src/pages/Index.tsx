import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EntryPhase from "@/components/phases/EntryPhase";
import TransitionPhase from "@/components/phases/TransitionPhase";
import ComfortPhase from "@/components/phases/ComfortPhase";
import StabilizePhase from "@/components/phases/StabilizePhase";
import CognitivePhase from "@/components/phases/CognitivePhase";
import ExitPhase from "@/components/phases/ExitPhase";

type Phase = "entry" | "transition" | "comfort" | "stabilize" | "cognitive" | "exit";

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>("entry");

  const transitionTo = (phase: Phase) => setCurrentPhase(phase);

  const handleRestart = () => {
    transitionTo("entry");
  };

  const phaseTransition = useMemo(
    () => ({
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    }),
    []
  );

  const pageVariants = useMemo(
    () => ({
      initial: { opacity: 0, scale: 0.985, filter: "blur(6px)" },
      animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
      exit: { opacity: 0, scale: 1.015, filter: "blur(6px)" },
    }),
    []
  );

  const renderPhase = (phase: Phase) => {
    switch (phase) {
      case "entry":
        return <EntryPhase onEnter={() => transitionTo("transition")} />;
      case "transition":
        return <TransitionPhase onComplete={() => transitionTo("comfort")} />;
      case "comfort":
        return <ComfortPhase onComplete={() => transitionTo("stabilize")} />;
      case "stabilize":
        return <StabilizePhase onComplete={() => transitionTo("cognitive")} />;
      case "cognitive":
        return <CognitivePhase onComplete={() => transitionTo("exit")} />;
      case "exit":
        return <ExitPhase onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentPhase}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={phaseTransition}
          style={{ willChange: "opacity, transform, filter" }}
        >
          {renderPhase(currentPhase)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Index;