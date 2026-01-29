import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ExitPhaseProps {
  onRestart: () => void;
  className?: string;
}

const ExitPhase = ({ onRestart, className }: ExitPhaseProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen px-6",
        "bg-background-light",
        "animate-fade-in-up",
        className
      )}
    >
      {/* Large light blue circle with shadow/glow effect */}
      <div className="relative flex items-center justify-center mb-12">
        {/* Outer glow/shadow */}
        <div 
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 50%,
              hsl(190 30% 85% / 0.8) 0%,
              hsl(190 25% 80% / 0.4) 50%,
              transparent 70%
            )`,
          }}
        />

        {/* Main circle */}
        <motion.div
          className="relative w-72 h-72 rounded-full flex flex-col items-center justify-center"
          style={{
            background: `linear-gradient(180deg,
              hsl(195 40% 92%) 0%,
              hsl(190 35% 88%) 100%
            )`,
            boxShadow: `
              0 0 60px hsl(190 40% 80% / 0.5),
              inset 0 0 40px hsl(190 30% 95% / 0.5)
            `,
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Content inside circle */}
          <h2 className="text-foreground-light text-2xl font-medium mb-6">
            现在
          </h2>
          <p className="text-foreground-light/80 text-center text-base leading-relaxed px-6">
            试着找一找，
            <br />
            现在的房间里有几种颜色？
          </p>
        </motion.div>
      </div>

      {/* Exit button */}
      <motion.button
        onClick={onRestart}
        className={cn(
          "px-12 py-3.5 rounded-lg",
          "bg-success text-success-foreground",
          "text-lg font-medium",
          "transition-all duration-300",
          "hover:opacity-90",
          "focus:outline-none focus:ring-2 focus:ring-success/50",
          "active:scale-95"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        离开
      </motion.button>
    </div>
  );
};

export default ExitPhase;