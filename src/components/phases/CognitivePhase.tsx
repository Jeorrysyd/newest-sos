import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseGradient, phaseText, twilight } from "@/lib/design-tokens";
import { useAudio } from "@/components/AudioManager";
import { AUDIO_MAP } from "@/machines/sosMachine";
import type { SOSContext, SOSEvent } from "@/machines/sosMachine";

interface CognitivePhaseProps {
  state: { context: SOSContext; value: unknown };
  send: (event: SOSEvent) => void;
  className?: string;
}

const CognitivePhase = ({ state, send, className }: CognitivePhaseProps) => {
  const { playNarration } = useAudio();
  const { stepIndex, cognitiveCards, cognitiveBridging } = state.context;
  const subState = (state.value as Record<string, string>)?.cognitive;
  const gapTimerRef = useRef<number>();
  const text = phaseText(4);
  const currentCard = cognitiveCards[stepIndex];

  // Play card audio when entering "playing" sub-state
  useEffect(() => {
    if (subState === "playing" && currentCard) {
      playNarration(currentCard.audio, () => {
        send({ type: "AUDIO_ENDED" });
      });
    }
  }, [subState, stepIndex]);

  // Play bridge audio when entering "bridgePlaying" sub-state
  useEffect(() => {
    if (subState === "bridgePlaying") {
      playNarration(AUDIO_MAP.cognitiveBridge, () => {
        send({ type: "AUDIO_ENDED" });
      });
    }
  }, [subState]);

  // Gap timer: 1500ms
  useEffect(() => {
    if (subState === "gap" || subState === "bridgeGap") {
      gapTimerRef.current = window.setTimeout(() => {
        send({ type: "GAP_ELAPSED" });
      }, 1500);
      return () => clearTimeout(gapTimerRef.current);
    }
  }, [subState, stepIndex]);

  // Animation complete for entering/nextCard/bridge sub-states
  const handleAnimationComplete = (definition: string) => {
    if (definition !== "animate") return;
    if (subState === "entering" || subState === "nextCard" || subState === "bridge") {
      send({ type: "ANIMATION_DONE" });
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[100dvh] px-6",
        className
      )}
      style={{ background: phaseGradient(4) }}
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
              left: `${12 + i * 17}%`,
              top: `${15 + (i % 3) * 25}%`,
              background: `rgba(160, 196, 200, ${0.12 + i * 0.03})`,
              filter: "blur(1px)",
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${5 + i * 1.2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      {!cognitiveBridging && (
        <div className="absolute top-20 text-center px-8">
          <p
            className="text-sm leading-relaxed"
            style={{
              color: text.muted,
              fontFamily: twilight.font.family,
              fontWeight: twilight.font.weight,
            }}
          >
            这些话会一直陪着你
            <br />
            任何时候需要温暖
            <br />
            都可以回来看看
          </p>
        </div>
      )}

      {/* Bridge screen */}
      {cognitiveBridging && (
        <motion.p
          key="bridge"
          className="text-xl text-center leading-relaxed px-10 whitespace-pre-line"
          style={{
            color: text.soft,
            fontFamily: twilight.font.family,
            fontWeight: twilight.font.weight,
          }}
          variants={{
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
          }}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, ease: "easeOut" }}
          onAnimationComplete={handleAnimationComplete}
        >
          {"这些话，会一直在这里\n\n现在，让我们做一件小事\n帮你的身体也回到当下"}
        </motion.p>
      )}

      {/* Card */}
      {!cognitiveBridging && currentCard && (
        <div className="relative w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              variants={{
                initial: { opacity: 0, x: 40 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -40 },
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onAnimationComplete={handleAnimationComplete}
              className="text-center"
            >
              <h2
                className="text-2xl leading-relaxed mb-8 whitespace-pre-line"
                style={{
                  color: text.primary,
                  fontFamily: twilight.font.family,
                  fontWeight: 300,
                }}
              >
                {currentCard.title}
              </h2>

              <p
                className="text-base leading-relaxed whitespace-pre-line"
                style={{
                  color: text.soft,
                  fontFamily: twilight.font.family,
                  fontWeight: twilight.font.weight,
                }}
              >
                {currentCard.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Progress dots */}
      {!cognitiveBridging && (
        <div className="absolute bottom-24 flex items-center gap-2">
          {cognitiveCards.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === stepIndex ? 20 : 6,
                background: i === stepIndex
                  ? text.primary
                  : `${text.primary}33`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CognitivePhase;
