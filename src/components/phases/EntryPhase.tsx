import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseText, twilight } from "@/lib/design-tokens";
import SOSButton from "@/components/SOSButton";
import { useAudio } from "@/components/AudioManager";
import type { SOSContext, SOSEvent } from "@/machines/sosMachine";

interface EntryPhaseProps {
  state: { context: SOSContext; value: unknown };
  send: (event: SOSEvent) => void;
  mode: "idle" | "entry";
  className?: string;
}

const EntryPhase = ({ send, mode, className }: EntryPhaseProps) => {
  const text = phaseText(0);
  const { playBgm, unlockAudio } = useAudio();
  const timerRef = useRef<number>();

  const handleClick = () => {
    // Unlock audio on iOS Safari while inside the user-gesture handler
    unlockAudio();
    playBgm();
    send({ type: "SOS_PRESSED" });
  };

  // In entry mode, show "我接住你了" for 3s then advance
  useEffect(() => {
    if (mode === "entry") {
      timerRef.current = window.setTimeout(() => {
        send({ type: "ENTRY_MESSAGE_DONE" });
      }, 3000);
      return () => clearTimeout(timerRef.current);
    }
  }, [mode, send]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[100dvh]",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {mode === "idle" && (
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

        {mode === "entry" && (
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
