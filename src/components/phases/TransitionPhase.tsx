import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseGradient, phaseText, twilight } from "@/lib/design-tokens";
import SoftOrb from "@/components/SoftOrb";

interface TransitionPhaseProps {
  onComplete: () => void;
  className?: string;
}

const TransitionPhase = ({ onComplete, className }: TransitionPhaseProps) => {
  const [stage, setStage] = useState<"dissolve" | "glow" | "message">("dissolve");
  const text = phaseText(1);

  useEffect(() => {
    // Stage 1: Button dissolves into glow (2s)
    const timer1 = setTimeout(() => {
      setStage("glow");
    }, 2000);

    // Stage 2: Show message inside orb (3.5s)
    const timer2 = setTimeout(() => {
      setStage("message");
    }, 3500);

    // Complete transition (6s)
    const timer3 = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen",
        className
      )}
      style={{ background: phaseGradient(1) }}
    >
      <AnimatePresence mode="wait">
        {stage === "dissolve" && (
          <motion.div
            key="dissolve"
            className="relative flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* Button dissolving into soft glow */}
            <motion.div
              className="w-48 h-48 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 40% 35%, ${twilight.palette.coral}, ${twilight.palette.plum})`,
              }}
              animate={{
                scale: [1, 1.1, 1.3],
                opacity: [1, 0.7, 0],
                filter: ['blur(0px)', 'blur(8px)', 'blur(30px)'],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <motion.span
                className="text-2xl"
                style={{
                  color: text.primary,
                  fontFamily: twilight.font.family,
                  fontWeight: 300,
                }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                我需要帮助
              </motion.span>
            </motion.div>

            {/* Expanding warm glow that fills screen */}
            <motion.div
              className="absolute rounded-full"
              style={{
                background: `radial-gradient(circle, ${twilight.palette.softCoral}40, ${twilight.palette.plum}20, transparent)`,
              }}
              initial={{ width: 192, height: 192, opacity: 0 }}
              animate={{
                width: [192, 600, 1200],
                height: [192, 600, 1200],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}

        {(stage === "glow" || stage === "message") && (
          <motion.div
            key="orb"
            className="relative flex items-center justify-center w-full h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* Soft ambient backdrop */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 70% 90% at 50% 50%,
                  rgba(107, 48, 96, 0.5) 0%,
                  rgba(58, 24, 96, 0.3) 40%,
                  transparent 100%
                )`,
              }}
            />

            {/* SoftOrb with message */}
            <SoftOrb size="lg">
              <AnimatePresence>
                {stage === "message" && (
                  <motion.p
                    className="text-xl tracking-wide"
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
            </SoftOrb>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransitionPhase;
