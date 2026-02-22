import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { twilight } from "@/lib/design-tokens";

interface SoftOrbProps {
  size?: "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { outer: 160, inner: 120 },
  md: { outer: 240, inner: 192 },
  lg: { outer: 320, inner: 256 },
  xl: { outer: 400, inner: 320 },
};

const SoftOrb = ({ size = "lg", children, animated = true, className }: SoftOrbProps) => {
  const { outer, inner } = sizeMap[size];

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: outer,
          height: outer,
          background: `radial-gradient(circle at 50% 50%,
            ${twilight.orb.innerColor} 0%,
            ${twilight.orb.outerColor} 50%,
            transparent 70%
          )`,
          filter: `blur(${twilight.orb.blur}px)`,
        }}
      />

      {/* Main orb body */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: inner,
          height: inner,
          background: `radial-gradient(circle at 40% 35%,
            rgba(122, 184, 184, 0.15) 0%,
            rgba(106, 144, 152, 0.1) 40%,
            rgba(26, 48, 64, 0.18) 100%
          )`,
          boxShadow: `
            0 0 60px ${twilight.orb.glowColor},
            0 0 120px rgba(122, 184, 184, 0.06),
            inset 0 0 40px rgba(122, 184, 184, 0.04)
          `,
          border: '1px solid rgba(122, 184, 184, 0.1)',
        }}
        animate={animated ? {
          scale: [1, 1.04, 1],
        } : undefined}
        transition={animated ? {
          duration: twilight.rhythm.cycleDuration,
          repeat: Infinity,
          ease: "easeInOut",
        } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SoftOrb;
