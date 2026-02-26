import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseText, twilight } from "@/lib/design-tokens";
import { comfortPool, pickRandom } from "@/lib/content-library";

interface ComfortPhaseProps {
  onComplete: () => void;
  className?: string;
}

const MESSAGE_DURATION = 4000;

const ComfortPhase = ({ onComplete, className }: ComfortPhaseProps) => {
  const messages = useMemo(() => pickRandom(comfortPool, 2), []);
  const [currentMessage, setCurrentMessage] = useState(0);
  const text = phaseText(0);

  // Show first message for 4s, then switch to second
  useEffect(() => {
    const timer = setTimeout(() => setCurrentMessage(1), MESSAGE_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // Show second message for 4s, then advance
  useEffect(() => {
    if (currentMessage !== 1) return;
    const timer = setTimeout(onComplete, MESSAGE_DURATION);
    return () => clearTimeout(timer);
  }, [currentMessage, onComplete]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[100dvh]",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={currentMessage}
          className="text-lg text-center leading-relaxed whitespace-pre-line px-10"
          style={{
            color: text.soft,
            fontFamily: twilight.font.family,
            fontWeight: twilight.font.weight,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {messages[currentMessage].text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default ComfortPhase;
