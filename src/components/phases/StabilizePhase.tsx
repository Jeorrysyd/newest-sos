import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseGradient, phaseText, twilight } from "@/lib/design-tokens";

interface StabilizePhaseProps {
  onComplete: () => void;

  className?: string;
}

type BreathStep = "inhale" | "hold" | "exhale";

const breathingSteps: { step: BreathStep; label: string; duration: number }[] = [
  { step: "inhale", label: "吸气",   duration: 4000 },
  { step: "hold",   label: "屏住呼吸", duration: 4000 },
  { step: "exhale", label: "呼气",   duration: 6000 },
];

const StabilizePhase = ({ onComplete, className }: StabilizePhaseProps) => {
  const [started, setStarted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [done, setDone] = useState(false);
  const totalCycles = 3;
  const text = phaseText(3);

  const currentStep = breathingSteps[currentStepIndex];

  // Show intro text for 3s, then start breathing
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const advanceStep = useCallback(() => {
    if (!isActive) return;
    const nextIndex = (currentStepIndex + 1) % breathingSteps.length;
    if (nextIndex === 0) {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      if (newCycles >= totalCycles) {
        setIsActive(false);
        setDone(true);
        return;
      }
    }
    setCurrentStepIndex(nextIndex);
  }, [currentStepIndex, cycles, isActive]);

  // Breathing loop — fixed physiological durations
  useEffect(() => {
    if (!started || !isActive) return;
    const timer = setTimeout(advanceStep, currentStep.duration);
    return () => clearTimeout(timer);
  }, [started, currentStepIndex, isActive, advanceStep, currentStep.duration]);

  // Show bridge text for 4s after breathing done, then advance
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [done, onComplete]);

  const getCircleScale = () => {
    switch (currentStep.step) {
      case "inhale": return 1.2;
      case "hold":   return 1.2;
      case "exhale": return 1;
      default:       return 1;
    }
  };

  return (
    <div className={cn("relative min-h-[100dvh] flex flex-col items-center justify-center", className)}>
      {/* Background layer — fades in when breathing starts */}
      <div
        className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
        style={{
          background: phaseGradient(3),
        }}
      />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-[100dvh]">
        <AnimatePresence mode="wait">
          {/* Intro bridge text */}
          {!started && (
            <motion.p
              key="intro"
              className="text-xl text-center"
              style={{
                color: phaseText(0).soft,
                fontFamily: twilight.font.family,
                fontWeight: twilight.font.weight,
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              现在，来跟我一起呼吸
            </motion.p>
          )}

          {/* Bridge after breathing */}
          {done && (
            <motion.p
              key="done"
              className="text-xl text-center leading-relaxed px-10"
              style={{
                color: phaseText(0).soft,
                fontFamily: twilight.font.family,
                fontWeight: twilight.font.weight,
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              呼吸，帮了你
              <br />
              接下来，有几句话
              <br />
              想来陪着你
            </motion.p>
          )}

          {/* Breathing UI */}
          {started && !done && (
            <motion.div
              key="breathing"
              className="flex flex-col items-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full animate-float"
                    style={{
                      width: 4 + i * 2,
                      height: 4 + i * 2,
                      left: `${20 + i * 18}%`,
                      top: `${30 + (i % 2) * 30}%`,
                      background: `rgba(160, 196, 200, ${0.1 + i * 0.03})`,
                      filter: 'blur(1px)',
                      animationDelay: `${i * 1.5}s`,
                      animationDuration: `${5 + i * 1.5}s`,
                    }}
                  />
                ))}
              </div>

              {/* Breathing step indicators */}
              <div className="absolute top-24 flex items-center gap-8">
                {breathingSteps.map((step, index) => (
                  <span
                    key={step.step}
                    className={cn(
                      "text-lg transition-all duration-500",
                      currentStepIndex === index ? "scale-110 glow-text" : ""
                    )}
                    style={{
                      color: currentStepIndex === index ? twilight.accent : text.muted,
                      fontFamily: twilight.font.family,
                      fontWeight: twilight.font.weight,
                    }}
                  >
                    {step.label}
                  </span>
                ))}
              </div>

              {/* Breathing circle */}
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 384,
                    height: 384,
                    background: `radial-gradient(circle at 45% 42%,
                      rgba(180, 130, 220, 0.18) 0%,
                      rgba(100, 180, 220, 0.14) 40%,
                      rgba(58, 88, 104, 0.08) 65%,
                      transparent 80%
                    )`,
                    filter: 'blur(20px)',
                  }}
                />
                <motion.div
                  className="relative w-72 h-72 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 40% 35%,
                      rgba(190, 140, 230, 0.14) 0%,
                      rgba(122, 184, 184, 0.14) 40%,
                      rgba(26, 48, 64, 0.2) 100%
                    )`,
                    boxShadow: `
                      0 0 80px rgba(180, 130, 220, 0.14),
                      0 0 160px rgba(100, 180, 220, 0.06),
                      inset 0 0 60px rgba(190, 140, 230, 0.04)
                    `,
                    border: '1px solid rgba(190, 140, 230, 0.12)',
                  }}
                  animate={{ scale: getCircleScale() }}
                  transition={{
                    duration: currentStep.step === "exhale" ? 6 : 4,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Progress indicator */}
              <div className="absolute bottom-32 flex items-center gap-4">
                {Array.from({ length: totalCycles }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="relative flex items-center justify-center transition-all duration-500">
                      {i < cycles ? (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            background: `rgba(122, 184, 184, 0.15)`,
                            border: `1px solid ${twilight.accent}`,
                          }}
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke={twilight.accent}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : i === cycles ? (
                        <div
                          className="w-16 h-1 rounded-full overflow-hidden"
                          style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: twilight.accent }}
                            initial={{ width: "0%" }}
                            animate={{
                              width: `${((currentStepIndex + 1) / breathingSteps.length) * 100}%`
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      ) : (
                        <div
                          className="w-16 h-1 rounded-full"
                          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StabilizePhase;
