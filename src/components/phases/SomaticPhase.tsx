import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseGradient, phaseText, twilight } from "@/lib/design-tokens";
import type { SOSContext, SOSEvent } from "@/machines/sosMachine";

interface SomaticPhaseProps {
  state: { context: SOSContext; value: unknown };
  send: (event: SOSEvent) => void;
  className?: string;
}

const SomaticPhase = ({ state, send, className }: SomaticPhaseProps) => {
  const { stepIndex, somaticIntervention } = state.context;
  const subState = (state.value as Record<string, string>)?.somatic;
  const text = phaseText(4);
  const timerRef = useRef<number>();

  // Send ANIMATION_DONE when entering animation completes
  const handleAnimationComplete = (definition: string) => {
    if (definition !== "animate") return;
    if (subState === "entering") {
      send({ type: "ANIMATION_DONE" });
    }
  };

  // Title screen: 3s timer
  useEffect(() => {
    if (subState === "title") {
      timerRef.current = window.setTimeout(() => {
        send({ type: "TIMER_DONE" });
      }, 3000);
      return () => clearTimeout(timerRef.current);
    }
  }, [subState]);

  // Active steps: use duration from intervention
  useEffect(() => {
    if (subState === "active" && somaticIntervention) {
      const duration = somaticIntervention.durations[stepIndex];
      timerRef.current = window.setTimeout(() => {
        send({ type: "TIMER_DONE" });
      }, duration);
      return () => clearTimeout(timerRef.current);
    }
  }, [subState, stepIndex]);

  if (!somaticIntervention) return null;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center min-h-[100dvh]",
        className
      )}
      style={{ background: phaseGradient(4) }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: 3 + i * 2,
              height: 3 + i * 2,
              left: `${15 + i * 20}%`,
              top: `${25 + (i % 2) * 35}%`,
              background: `rgba(180, 130, 220, ${0.08 + i * 0.02})`,
              filter: "blur(1px)",
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${6 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Aurora orb background */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 320,
          height: 320,
          background: `radial-gradient(circle at 40% 40%,
            rgba(180, 130, 220, 0.18) 0%,
            rgba(100, 180, 220, 0.12) 50%,
            transparent 70%
          )`,
          filter: "blur(40px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        <AnimatePresence mode="wait">
          {(subState === "entering" || subState === "title") ? (
            <motion.h2
              key="title"
              className="text-2xl leading-relaxed"
              style={{
                color: text.primary,
                fontFamily: twilight.font.family,
                fontWeight: 300,
              }}
              variants={{
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -8 },
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.9, ease: "easeOut" }}
              onAnimationComplete={handleAnimationComplete}
            >
              {somaticIntervention.title}
            </motion.h2>
          ) : subState === "active" ? (
            <motion.p
              key={`step-${stepIndex}`}
              className="text-xl leading-relaxed whitespace-pre-line"
              style={{
                color: text.soft,
                fontFamily: twilight.font.family,
                fontWeight: twilight.font.weight,
              }}
              variants={{
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -8 },
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {somaticIntervention.steps[stepIndex]}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Step progress dots */}
      {subState === "active" && (
        <div className="absolute bottom-20 flex items-center gap-2">
          {somaticIntervention.steps.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === stepIndex ? 20 : 6,
                background: i <= stepIndex
                  ? `rgba(180, 130, 220, 0.7)`
                  : `rgba(255, 255, 255, 0.15)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SomaticPhase;
