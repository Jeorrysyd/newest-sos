import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { phaseGradient, phaseText, twilight } from "@/lib/design-tokens";

interface CognitivePhaseProps {
  onComplete: () => void;
  className?: string;
}

const cognitiveCards = [
  {
    title: "你只是遇到了\n一个小坎",
    description: "不是灾难，不是终点。\n你比你想象的更坚强，\n你一直都是。\n每一次跌倒，\n都是你勇敢走过的证明。",
  },
  {
    title: "你的感受，\n值得被温柔对待",
    description: "此刻的害怕和不安，\n都是真实的，也是被允许的。\n你不需要假装坚强，\n允许自己脆弱，\n本身就是一种力量。",
  },
  {
    title: "这一刻会过去，\n而你会留下",
    description: "就像黎明总会到来，\n这份痛苦也会渐渐消散。\n你只需要陪伴自己，\n度过这一刻，\n然后迎接下一刻的光。",
  },
];

const CognitivePhase = ({ onComplete, className }: CognitivePhaseProps) => {
  const [currentCard, setCurrentCard] = useState(0);
  const text = phaseText(4); // Bright background → dark text

  const handleNext = () => {
    if (currentCard >= cognitiveCards.length - 1) {
      onComplete();
    } else {
      setCurrentCard((prev) => prev + 1);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen px-6",
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
              filter: 'blur(1px)',
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${5 + i * 1.2}s`,
            }}
          />
        ))}
      </div>

      {/* Header text */}
      <div className="absolute top-20 text-center px-8">
        <p
          className="text-sm leading-relaxed"
          style={{
            color: text.muted,
            fontFamily: twilight.font.family,
            fontWeight: twilight.font.weight,
          }}
        >
          这些话会一直陪着你。
          <br />
          任何时候需要温暖，
          <br />
          都可以回来看看。
        </p>
      </div>

      {/* Card content */}
      <div className="relative w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            {/* Title — soft coral accent */}
            <h2
              className="text-2xl leading-relaxed mb-8 whitespace-pre-line"
              style={{
                color: text.primary,
                fontFamily: twilight.font.family,
                fontWeight: 300,
              }}
            >
              {cognitiveCards[currentCard].title}
            </h2>

            {/* Description */}
            <p
              className="text-base leading-relaxed whitespace-pre-line"
              style={{
                color: text.soft,
                fontFamily: twilight.font.family,
                fontWeight: twilight.font.weight,
              }}
            >
              {cognitiveCards[currentCard].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        <button
          onClick={handleNext}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 translate-x-8",
            "w-10 h-10 rounded-full",
            "flex items-center justify-center",
            "transition-all duration-300",
            "hover:bg-black/10"
          )}
          style={{ color: text.soft }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-24 flex items-center gap-2">
        {cognitiveCards.map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === currentCard ? 16 : 8,
              background: i === currentCard
                ? text.primary
                : `${text.primary}33`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CognitivePhase;
