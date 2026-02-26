import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EntryPhase from "@/components/phases/EntryPhase";
import ComfortPhase from "@/components/phases/ComfortPhase";
import StabilizePhase from "@/components/phases/StabilizePhase";
import SomaticPhase from "@/components/phases/SomaticPhase";
import CognitivePhase from "@/components/phases/CognitivePhase";
import ExitPhase from "@/components/phases/ExitPhase";
import HaloEffect from "@/components/HaloEffect";
import PhoneFrame from "@/components/PhoneFrame";
import { AudioProvider, MuteButton } from "@/components/AudioManager";
import { phaseGradient } from "@/lib/design-tokens";

type Phase = "entry" | "comfort" | "stabilize" | "cognitive" | "somatic" | "exit";

// 单次淡出/淡入时长 — 顺序切换，任何时刻只有一个 phase 可见
const FADE_DURATION = 0.5;

const Index = () => {
  const [activePhase, setActivePhase] = useState<Phase>("entry");
  const isTransitioningRef = useRef(false);

  const transitionTo = useCallback((phase: Phase) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setActivePhase(phase);
  }, []);

  const handleRestart = useCallback(() => transitionTo("entry"), [transitionTo]);

  const renderPhase = (phase: Phase) => {
    switch (phase) {
      case "entry":
        return <EntryPhase onEnter={() => transitionTo("comfort")} />;
      case "comfort":
        return <ComfortPhase onComplete={() => transitionTo("stabilize")} />;
      case "stabilize":
        return <StabilizePhase onComplete={() => transitionTo("cognitive")} />;
      case "cognitive":
        return <CognitivePhase onComplete={() => transitionTo("somatic")} />;
      case "somatic":
        return <SomaticPhase onComplete={() => transitionTo("exit")} />;
      case "exit":
        return <ExitPhase onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  const content = (
    <div
      className="relative min-h-[100dvh] overflow-hidden"
      style={{ background: phaseGradient(1) }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          className="absolute inset-0"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit:    { opacity: 0 },
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
          onAnimationComplete={(definition) => {
            // "animate" fires when the ENTER animation finishes (named variant)
            if (definition === "animate") {
              isTransitioningRef.current = false;
            }
          }}
        >
          {renderPhase(activePhase)}
        </motion.div>
      </AnimatePresence>

      {/* Always-on-top persistent UI */}
      <HaloEffect />
      <MuteButton />
    </div>
  );

  return (
    <AudioProvider bgmSrc="/bgm.mp3">
      <PhoneFrame>{content}</PhoneFrame>
    </AudioProvider>
  );
};

export default Index;
