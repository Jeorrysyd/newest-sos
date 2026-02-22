import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EntryPhase from "@/components/phases/EntryPhase";
import ComfortPhase from "@/components/phases/ComfortPhase";
import StabilizePhase from "@/components/phases/StabilizePhase";
import CognitivePhase from "@/components/phases/CognitivePhase";
import ExitPhase from "@/components/phases/ExitPhase";
import HaloEffect from "@/components/HaloEffect";
import PhoneFrame from "@/components/PhoneFrame";
import { AudioProvider, MuteButton } from "@/components/AudioManager";

type Phase = "entry" | "comfort" | "stabilize" | "cognitive" | "exit";

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>("entry");

  const transitionTo = (phase: Phase) => setCurrentPhase(phase);

  const handleRestart = () => transitionTo("entry");

  // Simple opacity-only transition — no blur, no scale, no window-switching feel
  const pageVariants = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    }),
    []
  );

  const phaseTransition = useMemo(
    () => ({
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1] as const,
    }),
    []
  );

  const renderPhase = (phase: Phase) => {
    switch (phase) {
      case "entry":
        return <EntryPhase onEnter={() => transitionTo("comfort")} />;
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

  const content = (
    <div className="relative min-h-screen overflow-hidden">
      <HaloEffect />
      <MuteButton />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentPhase}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={phaseTransition}
          style={{ willChange: "opacity" }}
        >
          {renderPhase(currentPhase)}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <AudioProvider>
      <PhoneFrame>{content}</PhoneFrame>
    </AudioProvider>
  );
};

export default Index;
