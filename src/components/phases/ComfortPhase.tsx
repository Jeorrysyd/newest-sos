import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ComfortPhaseProps {
  onComplete: () => void;
  className?: string;
}

const comfortMessages = [
  {
    text: "你现在的反应，\n是被突然的压力吓到了。",
  },
  {
    text: "这是正常的身体\n应激反应",
  },
];

const ComfortPhase = ({ onComplete, className }: ComfortPhaseProps) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentMessage(1);
    }, 3500);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen",
        "bg-background",
        className
      )}
    >
      {/* Wave pattern background */}
      <div className="absolute inset-0 wave-pattern wave-pattern-animated opacity-60" />

      {/* Glowing circle container */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow */}
        <div 
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 50%,
              hsl(180 20% 30% / 0.6) 0%,
              hsl(180 15% 20% / 0.3) 50%,
              transparent 70%
            )`,
          }}
        />

        {/* Main circle with glow border */}
        <motion.div
          className="relative w-64 h-64 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 50% 50%,
              hsl(180 15% 18%) 0%,
              hsl(180 12% 14%) 100%
            )`,
            boxShadow: `
              0 0 80px hsl(180 30% 40% / 0.25),
              inset 0 0 60px hsl(180 20% 10% / 0.5)
            `,
            border: '1px solid hsl(180 40% 50% / 0.2)',
          }}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              className="text-foreground/80 text-lg font-light text-center leading-relaxed whitespace-pre-line px-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
            >
              {comfortMessages[currentMessage].text}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ComfortPhase;