import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseGradient, phaseText, twilight } from "@/lib/design-tokens";
import { somaticPool, pickRandom } from "@/lib/content-library";

interface SomaticPhaseProps {
  onComplete: () => void;
  className?: string;
}

const SomaticPhase = ({ onComplete, className }: SomaticPhaseProps) => {
  const intervention = useMemo(() => pickRandom(somaticPool, 1)[0], []);
  const [stepIndex, setStepIndex] = useState<number>(-1); // -1 = title screen
  const text = phaseText(4);

  // Show title for 3s, then walk through each step
  useEffect(() => {
    const titleTimer = setTimeout(() => setStepIndex(0), 3000);
    return () => clearTimeout(titleTimer);
  }, []);

  useEffect(() => {
    if (stepIndex < 0) return;
    const duration = intervention.durations[stepIndex];
    const next = stepIndex + 1;

    const timer = setTimeout(() => {
      if (next < intervention.steps.length) {
        setStepIndex(next);
      } else {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [stepIndex, intervention, onComplete]);

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
          {stepIndex === -1 ? (
            // Title screen
            <motion.h2
              key="title"
              className="text-2xl leading-relaxed"
              style={{
                color: text.primary,
                fontFamily: twilight.font.family,
                fontWeight: 300,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {intervention.title}
            </motion.h2>
          ) : (
            // Step text
            <motion.p
              key={stepIndex}
              className="text-xl leading-relaxed whitespace-pre-line"
              style={{
                color: text.soft,
                fontFamily: twilight.font.family,
                fontWeight: twilight.font.weight,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {intervention.steps[stepIndex]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Step progress dots */}
      {stepIndex >= 0 && (
        <div className="absolute bottom-20 flex items-center gap-2">
          {intervention.steps.map((_, i) => (
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
