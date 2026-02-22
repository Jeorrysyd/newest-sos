import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseGradient, phaseText, twilight } from "@/lib/design-tokens";

interface ExitPhaseProps {
  onRestart: () => void;
  className?: string;
}

type ExitStage = "ground" | "butterfly" | "affirm" | "farewell";

const affirmations = [
  "我很安全",
  "我是被爱的",
  "我已经做得很好了",
];

const ExitPhase = ({ onRestart, className }: ExitPhaseProps) => {
  const [stage, setStage] = useState<ExitStage>("ground");
  const [affirmIndex, setAffirmIndex] = useState(0);
  const text = phaseText(5);

  useEffect(() => {
    if (stage === "ground") {
      const t = setTimeout(() => setStage("butterfly"), 5000);
      return () => clearTimeout(t);
    }
    if (stage === "butterfly") {
      const t = setTimeout(() => setStage("affirm"), 8000);
      return () => clearTimeout(t);
    }
    if (stage === "affirm") {
      // Cycle through affirmations
      if (affirmIndex < affirmations.length - 1) {
        const t = setTimeout(() => setAffirmIndex(prev => prev + 1), 3000);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setStage("farewell"), 3000);
        return () => clearTimeout(t);
      }
    }
  }, [stage, affirmIndex]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen px-6",
        className
      )}
      style={{ background: phaseGradient(5) }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: 3 + i * 1.5,
              height: 3 + i * 1.5,
              left: `${8 + i * 11}%`,
              top: `${15 + (i % 4) * 20}%`,
              background: `rgba(160, 196, 200, ${0.15 + i * 0.02})`,
              filter: 'blur(1px)',
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Halo atmosphere */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          background: `radial-gradient(circle at 50% 50%,
            rgba(160, 196, 200, 0.12) 0%,
            rgba(122, 184, 184, 0.08) 30%,
            rgba(106, 144, 152, 0.04) 60%,
            transparent 80%
          )`,
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: twilight.rhythm.cycleDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 280,
          height: 280,
          background: `radial-gradient(circle at 45% 40%,
            rgba(160, 196, 200, 0.2) 0%,
            rgba(122, 184, 184, 0.12) 40%,
            transparent 70%
          )`,
          filter: 'blur(25px)',
        }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{
          duration: twilight.rhythm.cycleDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Content area */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Stage 1: Grounding question */}
          {stage === "ground" && (
            <motion.div
              key="ground"
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-2xl mb-6"
                style={{ color: text.primary, fontFamily: twilight.font.family, fontWeight: 300 }}
              >
                现在
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: text.soft, fontFamily: twilight.font.family, fontWeight: twilight.font.weight }}
              >
                试着找一找，
                <br />
                现在的房间里有几种颜色？
              </p>
            </motion.div>
          )}

          {/* Stage 2: Butterfly Hug guidance */}
          {stage === "butterfly" && (
            <motion.div
              key="butterfly"
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-xl mb-8"
                style={{ color: text.primary, fontFamily: twilight.font.family, fontWeight: 300 }}
              >
                蝴蝶拍
              </h2>
              <p
                className="text-base leading-loose mb-6"
                style={{ color: text.soft, fontFamily: twilight.font.family, fontWeight: twilight.font.weight }}
              >
                双臂交叉放在胸前
                <br />
                左手放在右肩，右手放在左肩
                <br />
                像蝴蝶振翅一样
                <br />
                轻轻交替拍打肩膀
              </p>

              {/* Butterfly animation hint */}
              <motion.div
                className="flex gap-1 mt-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [0, -15, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  style={{ display: 'inline-block', color: text.muted }}
                >
                  &#x1F98B;
                </motion.span>
              </motion.div>

              <p
                className="text-sm mt-6"
                style={{ color: text.muted, fontFamily: twilight.font.family, fontWeight: twilight.font.weight }}
              >
                慢慢地，跟随你的呼吸
              </p>
            </motion.div>
          )}

          {/* Stage 3: Affirmations */}
          {stage === "affirm" && (
            <motion.div
              key={`affirm-${affirmIndex}`}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
            >
              <p
                className="text-2xl leading-relaxed"
                style={{
                  color: text.primary,
                  fontFamily: twilight.font.family,
                  fontWeight: 300,
                }}
              >
                {affirmations[affirmIndex]}
              </p>
            </motion.div>
          )}

          {/* Stage 4: Farewell + exit */}
          {stage === "farewell" && (
            <motion.div
              key="farewell"
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p
                className="text-lg leading-relaxed mb-10"
                style={{ color: text.soft, fontFamily: twilight.font.family, fontWeight: twilight.font.weight }}
              >
                你已经做得很好了
                <br />
                随时可以回来
              </p>

              <motion.button
                onClick={onRestart}
                className={cn(
                  "px-12 py-3.5 rounded-lg",
                  "text-lg",
                  "transition-all duration-300",
                  "hover:opacity-90",
                  "focus:outline-none focus:ring-2",
                  "active:scale-95"
                )}
                style={{
                  background: twilight.palette.deepIndigo,
                  color: twilight.palette.gold,
                  fontFamily: twilight.font.family,
                  fontWeight: 300,
                  boxShadow: `0 4px 24px rgba(14, 8, 32, 0.3)`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                离开
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExitPhase;
