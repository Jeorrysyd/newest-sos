import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { phaseGradient, phaseText, twilight } from "@/lib/design-tokens";

interface ExitPhaseProps {
  onRestart: () => void;

  className?: string;
}

type ExitStage = "intro" | "butterfly_prep" | "butterfly" | "affirm" | "farewell";

const affirmations = [
  { text: "我很安全" },
  { text: "我是被爱的" },
  { text: "我已经做得很好了" },
];

const ExitPhase = ({ onRestart, className }: ExitPhaseProps) => {
  const [stage, setStage] = useState<ExitStage>("intro");
  const [affirmIndex, setAffirmIndex] = useState(0);
  const text = phaseText(5);

  // intro → butterfly_prep (4s)
  useEffect(() => {
    if (stage !== "intro") return;
    const timer = setTimeout(() => setStage("butterfly_prep"), 4000);
    return () => clearTimeout(timer);
  }, [stage]);

  // butterfly_prep → butterfly (5s)
  useEffect(() => {
    if (stage !== "butterfly_prep") return;
    const timer = setTimeout(() => setStage("butterfly"), 5000);
    return () => clearTimeout(timer);
  }, [stage]);

  // butterfly → affirm (6s)
  useEffect(() => {
    if (stage !== "butterfly") return;
    const timer = setTimeout(() => setStage("affirm"), 6000);
    return () => clearTimeout(timer);
  }, [stage]);

  // affirm — show each affirmation for 3s, then next or farewell
  useEffect(() => {
    if (stage !== "affirm") return;
    const isLast = affirmIndex === affirmations.length - 1;
    const timer = setTimeout(
      isLast ? () => setStage("farewell") : () => setAffirmIndex(prev => prev + 1),
      3000
    );
    return () => clearTimeout(timer);
  }, [stage, affirmIndex]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[100dvh] px-6",
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
        animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: twilight.rhythm.cycleDuration, repeat: Infinity, ease: "easeInOut" }}
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
        transition={{ duration: twilight.rhythm.cycleDuration, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Content area */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">

          {/* Stage 0: Bridge intro */}
          {stage === "intro" && (
            <motion.p
              key="intro"
              className="text-xl text-center leading-relaxed"
              style={{ color: text.soft, fontFamily: twilight.font.family, fontWeight: twilight.font.weight }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              很好
              <br />
              你刚才照顾了自己的身体
              <br />
              现在，让心也跟上来
            </motion.p>
          )}

          {/* Stage 1: Butterfly prep — get into position */}
          {stage === "butterfly_prep" && (
            <motion.div
              key="butterfly_prep"
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
                className="text-base leading-loose"
                style={{ color: text.soft, fontFamily: twilight.font.family, fontWeight: twilight.font.weight }}
              >
                把双臂交叉放在胸前
                <br />
                左手放在右肩，右手放在左肩
              </p>
            </motion.div>
          )}

          {/* Stage 2: Butterfly — in motion */}
          {stage === "butterfly" && (
            <motion.div
              key="butterfly"
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
            >
              <p
                className="text-base leading-loose mb-6"
                style={{ color: text.soft, fontFamily: twilight.font.family, fontWeight: twilight.font.weight }}
              >
                像蝴蝶振翅一样
                <br />
                轻轻交替拍打肩膀
              </p>

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

          {/* Stage 3: Affirmations — say-along */}
          {stage === "affirm" && (
            <motion.div
              key={`affirm-${affirmIndex}`}
              className="flex flex-col items-center text-center gap-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
            >
              <p
                className="text-sm tracking-widest"
                style={{ color: text.muted, fontFamily: twilight.font.family, fontWeight: twilight.font.weight }}
              >
                轻声跟着说
              </p>
              <p
                className="text-2xl leading-relaxed"
                style={{ color: text.primary, fontFamily: twilight.font.family, fontWeight: 300 }}
              >
                {affirmations[affirmIndex].text}
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
