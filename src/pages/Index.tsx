import { useMachine } from "@xstate/react";
import { motion, AnimatePresence } from "framer-motion";
import { sosMachine } from "@/machines/sosMachine";
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

const FADE_DURATION = 0.5;

/** Extract top-level phase name from XState nested state value */
function getPhase(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) return Object.keys(value)[0];
  return "idle";
}

const Index = () => {
  const [state, send] = useMachine(sosMachine);
  const phase = getPhase(state.value);

  const renderPhase = () => {
    switch (phase) {
      case "idle":
        return <EntryPhase state={state} send={send} mode="idle" />;
      case "entry":
        return <EntryPhase state={state} send={send} mode="entry" />;
      case "comfort":
        return <ComfortPhase state={state} send={send} />;
      case "stabilize":
        return <StabilizePhase state={state} send={send} />;
      case "cognitive":
        return <CognitivePhase state={state} send={send} />;
      case "somatic":
        return <SomaticPhase state={state} send={send} />;
      case "exit":
        return <ExitPhase state={state} send={send} />;
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
          key={phase}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
        >
          {renderPhase()}
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
