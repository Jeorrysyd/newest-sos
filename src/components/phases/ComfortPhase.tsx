import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseText, twilight } from "@/lib/design-tokens";
import { useAudio } from "@/components/AudioManager";
import type { SOSContext, SOSEvent } from "@/machines/sosMachine";

interface ComfortPhaseProps {
  state: { context: SOSContext; value: unknown };
  send: (event: SOSEvent) => void;
  className?: string;
}

const ComfortPhase = ({ state, send, className }: ComfortPhaseProps) => {
  const { playNarration } = useAudio();
  const { stepIndex, comfortMessages } = state.context;
  const subState = (state.value as Record<string, string>)?.comfort;
  const gapTimerRef = useRef<number>();
  const text = phaseText(0);
  const currentMessage = comfortMessages[stepIndex];

  // Play audio when entering "playing" sub-state
  useEffect(() => {
    if (subState === "playing" && currentMessage) {
      playNarration(currentMessage.audio, () => {
        send({ type: "AUDIO_ENDED" });
      });
    }
  }, [subState, stepIndex]);

  // Gap timer: 1500ms after audio ends
  useEffect(() => {
    if (subState === "gap") {
      gapTimerRef.current = window.setTimeout(() => {
        send({ type: "GAP_ELAPSED" });
      }, 1500);
      return () => clearTimeout(gapTimerRef.current);
    }
  }, [subState, stepIndex]);

  // Animation complete handler for entering/nextMessage sub-states
  const handleAnimationComplete = (definition: string) => {
    if (definition !== "animate") return;
    if (subState === "entering" || subState === "nextMessage") {
      send({ type: "ANIMATION_DONE" });
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[100dvh]",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={`comfort-${stepIndex}`}
          className="text-lg text-center leading-relaxed whitespace-pre-line px-10"
          style={{
            color: text.soft,
            fontFamily: twilight.font.family,
            fontWeight: twilight.font.weight,
          }}
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
          onAnimationComplete={handleAnimationComplete}
        >
          {currentMessage?.text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default ComfortPhase;
