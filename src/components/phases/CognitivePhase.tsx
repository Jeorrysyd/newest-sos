import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface CognitivePhaseProps {
  onComplete: () => void;
  className?: string;
}

const cognitiveCards = [
  {
    title: "这是一个错误，\n不是一场灾难",
    description: "你的大脑在误报火警。\n你只是在处理一件棘手的工作，\n你的安全没有受到威胁。\n失误不等于无能，\n它只是概率的一部分。",
  },
  {
    title: "你的感受是真实的，\n但不一定是事实",
    description: "情绪是信号，不是真相。\n焦虑让一切看起来更糟，\n但它不能预测未来。\n你可以感受到恐惧，\n同时做出理性的选择。",
  },
  {
    title: "此刻的痛苦，\n是暂时的",
    description: "没有任何情绪会永远持续。\n就像暴风雨总会过去，\n这一刻也会成为过去。\n你只需要度过这一刻，\n然后是下一刻。",
  },
];

const CognitivePhase = ({ onComplete, className }: CognitivePhaseProps) => {
  const [currentCard, setCurrentCard] = useState(0);

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
        "bg-background",
        className
      )}
    >
      {/* Wave pattern background */}
      <div className="absolute inset-0 wave-pattern wave-pattern-animated opacity-60" />

      {/* Header text */}
      <div className="absolute top-20 text-center px-8">
        <p className="text-foreground/60 text-sm leading-relaxed">
          这些真相会一直在这里。
          <br />
          当你感到不安时，
          <br />
          请记得回来再次阅读。
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
            {/* Title */}
            <h2 className="text-2xl font-light text-primary leading-relaxed mb-8 whitespace-pre-line">
              {cognitiveCards[currentCard].title}
            </h2>

            {/* Description */}
            <p className="text-foreground/70 text-base leading-relaxed whitespace-pre-line">
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
            "text-foreground/50 hover:text-foreground/80",
            "transition-all duration-300",
            "hover:bg-foreground/5"
          )}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-24 flex items-center gap-2">
        {cognitiveCards.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              i === currentCard ? "bg-primary w-4" : "bg-foreground/20"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default CognitivePhase;