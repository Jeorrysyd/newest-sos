import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseGradient, phaseText, twilight } from "@/lib/design-tokens";
import SoftOrb from "@/components/SoftOrb";

interface ComfortPhaseProps {
  onComplete: () => void;
  className?: string;
}

const comfortMessages = [
  {
    text: "你受到了惊吓，\n这不是你的错。",
  },
  {
    text: "你的身体在保护你，\n一切都会好的。",
  },
];

const ComfortPhase = ({ onComplete, className }: ComfortPhaseProps) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const text = phaseText(2);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentMessage(1);
    }, 3500);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen",
        className
      )}
      style={{ background: phaseGradient(2) }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: 3 + i * 2,
              height: 3 + i * 2,
              left: `${10 + i * 18}%`,
              top: `${25 + (i % 3) * 20}%`,
              background: `rgba(160, 196, 200, ${0.1 + i * 0.02})`,
              filter: 'blur(1px)',
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${6 + i}s`,
            }}
          />
        ))}
      </div>

      {/* SoftOrb with message */}
      <SoftOrb size="lg">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            className="text-lg text-center leading-relaxed whitespace-pre-line px-8"
            style={{
              color: text.soft,
              fontFamily: twilight.font.family,
              fontWeight: twilight.font.weight,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            {comfortMessages[currentMessage].text}
          </motion.p>
        </AnimatePresence>
      </SoftOrb>
    </div>
  );
};

export default ComfortPhase;
