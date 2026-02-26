import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseText, twilight } from "@/lib/design-tokens";
import SOSButton from "@/components/SOSButton";
import { unlockSpeech } from "@/hooks/useNarration";
import { useAudio } from "@/components/AudioManager";

interface EntryPhaseProps {
  onEnter: () => void;
  className?: string;
}

const EntryPhase = ({ onEnter, className }: EntryPhaseProps) => {
  const [stage, setStage] = useState<"idle" | "holding" | "message">("idle");
  const text = phaseText(0);
  const { playBgm } = useAudio();

  const handleClick = () => {
    unlockSpeech(); // unlock iOS/Safari TTS while inside the user-gesture handler
    playBgm();      // start BGM under the same user gesture to satisfy autoplay policy
    setStage("holding");
    setTimeout(() => setStage("message"), 1500);
    setTimeout(() => onEnter(), 3000);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[100dvh]",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.div
            key="idle"
            className="flex flex-col items-center gap-10"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-2">
              <h1
                className="text-2xl"
                style={{
                  color: text.primary,
                  fontFamily: twilight.font.family,
                  fontWeight: 300,
                }}
              >
                你还好吗？
              </h1>
              <p
                className="text-sm"
                style={{
                  color: text.muted,
                  fontFamily: twilight.font.family,
                  fontWeight: twilight.font.weight,
                }}
              >
                如果你需要，我在这里
              </p>
            </div>
            <SOSButton onClick={handleClick} />
          </motion.div>
        )}

        {(stage === "holding" || stage === "message") && (
          <motion.p
            key="message"
            className="text-xl tracking-wide text-center"
            style={{
              color: text.primary,
              fontFamily: twilight.font.family,
              fontWeight: twilight.font.weight,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            我接住你了
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntryPhase;
