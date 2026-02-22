import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseGradient, phaseText, twilight } from "@/lib/design-tokens";
import SOSButton from "@/components/SOSButton";

interface EntryPhaseProps {
  onEnter: () => void;
  className?: string;
}

const EntryPhase = ({ onEnter, className }: EntryPhaseProps) => {
  const [stage, setStage] = useState<"idle" | "holding" | "message">("idle");
  const text = phaseText(0);

  const handleClick = () => {
    setStage("holding");
    // Button fades, then show message
    setTimeout(() => setStage("message"), 1200);
    // Advance to next phase
    setTimeout(() => onEnter(), 4000);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen px-6",
        className
      )}
      style={{ background: phaseGradient(0) }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: 4 + i * 2,
              height: 4 + i * 2,
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: `rgba(160, 196, 200, ${0.08 + i * 0.02})`,
              filter: 'blur(1px)',
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${5 + i}s`,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.div
            key="idle"
            className="flex flex-col items-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-6 space-y-2">
              <h1
                className="text-3xl leading-tight"
                style={{ color: text.primary, fontFamily: twilight.font.family, fontWeight: twilight.font.weight }}
              >
                你还好吗？
              </h1>
            </div>
            <p
              className="text-base mb-16"
              style={{ color: text.muted, fontFamily: twilight.font.family, fontWeight: twilight.font.weight }}
            >
              如果你需要，我在这里
            </p>
            <SOSButton onClick={handleClick} />
          </motion.div>
        )}

        {stage === "holding" && (
          <motion.div
            key="holding"
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}

        {stage === "message" && (
          <motion.p
            key="message"
            className="text-xl tracking-wide text-center"
            style={{ color: text.primary, fontFamily: twilight.font.family, fontWeight: twilight.font.weight }}
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
