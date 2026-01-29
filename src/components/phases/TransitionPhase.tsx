import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TransitionPhaseProps {
  onComplete: () => void;
  className?: string;
}

const TransitionPhase = ({ onComplete, className }: TransitionPhaseProps) => {
  const [stage, setStage] = useState<"expand" | "ellipse" | "message">("expand");

  useEffect(() => {
    // Stage 1: Button expansion animation (1.5s)
    const timer1 = setTimeout(() => {
      setStage("ellipse");
    }, 1500);

    // Stage 2: Show message (after 2s)
    const timer2 = setTimeout(() => {
      setStage("message");
    }, 2500);

    // Complete transition (after 5s)
    const timer3 = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen",
        "transition-colors duration-1000",
        stage === "expand" ? "bg-background-light" : "bg-background-light",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {stage === "expand" && (
          <motion.div
            key="expand"
            className="relative flex items-center justify-center"
            initial={{ scale: 1 }}
            animate={{ scale: 1.2 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Expanding rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-destructive"
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 2 + i * 0.5, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
                style={{
                  width: 192,
                  height: 192,
                }}
              />
            ))}
            
            {/* Center button */}
            <div className="w-48 h-48 rounded-full bg-destructive flex items-center justify-center">
              <span className="text-white text-2xl font-medium">紧急求助</span>
            </div>
          </motion.div>
        )}

        {(stage === "ellipse" || stage === "message") && (
          <motion.div
            key="ellipse"
            className="relative flex items-center justify-center w-full h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Elliptical gradient backdrop */}
            <div 
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 70% 90% at 50% 50%, 
                  hsl(200 20% 45% / 0.95) 0%,
                  hsl(200 18% 35% / 0.8) 30%,
                  hsl(200 15% 25% / 0.5) 60%,
                  transparent 100%
                )`,
              }}
            />

            {/* Inner glowing circle */}
            <motion.div
              className="relative w-64 h-64 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 50% 50%,
                  hsl(180 25% 50% / 0.3) 0%,
                  hsl(180 20% 45% / 0.4) 50%,
                  hsl(180 15% 40% / 0.5) 100%
                )`,
                boxShadow: `
                  0 0 60px hsl(180 30% 50% / 0.3),
                  inset 0 0 40px hsl(180 40% 60% / 0.2)
                `,
                border: '1px solid hsl(180 40% 60% / 0.3)',
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <AnimatePresence>
                {stage === "message" && (
                  <motion.p
                    className="text-white text-xl font-light tracking-wide"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    我接住你了
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransitionPhase;