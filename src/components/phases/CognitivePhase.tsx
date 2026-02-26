import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseGradient, phaseText, twilight } from "@/lib/design-tokens";
import { cognitivePool, pickRandom } from "@/lib/content-library";

interface CognitivePhaseProps {
  onComplete: () => void;

  className?: string;
}

const CARDS_PER_SESSION = 3;
const CARD_DURATION = 5000;
const BRIDGE_DURATION = 4000;

const CognitivePhase = ({ onComplete, className }: CognitivePhaseProps) => {
  const cards = useMemo(() => pickRandom(cognitivePool, CARDS_PER_SESSION), []);
  const [currentCard, setCurrentCard] = useState(0);
  const [bridging, setBridging] = useState(false);
  const text = phaseText(4);

  // Show each card for 5s, then next card or bridge
  useEffect(() => {
    if (bridging) return;
    const isLast = currentCard === cards.length - 1;
    const timer = setTimeout(
      isLast ? () => setBridging(true) : () => setCurrentCard(prev => prev + 1),
      CARD_DURATION
    );
    return () => clearTimeout(timer);
  }, [currentCard, bridging, cards.length]);

  // Show bridge for 4s, then advance phase
  useEffect(() => {
    if (!bridging) return;
    const timer = setTimeout(onComplete, BRIDGE_DURATION);
    return () => clearTimeout(timer);
  }, [bridging, onComplete]);

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

      {/* Bridge screen after cards */}
      {bridging && (
        <motion.p
          key="bridge"
          className="text-xl text-center leading-relaxed px-10 whitespace-pre-line"
          style={{
            color: text.soft,
            fontFamily: twilight.font.family,
            fontWeight: twilight.font.weight,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {"这些话，会一直在这里\n\n现在，让我们做一件小事\n帮你的身体也回到当下"}
        </motion.p>
      )}

      {/* Card */}
      {!bridging && (
        <div className="relative w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
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
                {cards[currentCard].title}
              </h2>

              <p
                className="text-base leading-relaxed whitespace-pre-line"
                style={{
                  color: text.soft,
                  fontFamily: twilight.font.family,
                  fontWeight: twilight.font.weight,
                }}
              >
                {cards[currentCard].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Progress dots */}
      {!bridging && (
        <div className="absolute bottom-24 flex items-center gap-2">
          {cards.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === currentCard ? 20 : 6,
                background: i === currentCard
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
