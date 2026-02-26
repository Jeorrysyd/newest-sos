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
      {/* Outer glow — aurora multicolor */}
      <div
        className="absolute rounded-full"
        style={{
          width: outer,
          height: outer,
          background: `radial-gradient(circle at 40% 40%,
            ${twilight.orb.colorPurple} 0%,
            ${twilight.orb.colorPink} 30%,
            ${twilight.orb.colorBlue} 55%,
            transparent 70%
          )`,
          filter: `blur(${twilight.orb.blur}px)`,
        }}
      />

      {/* Main orb body — multicolor aurora */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: inner,
          height: inner,
          background: `radial-gradient(circle at 38% 33%,
            rgba(190, 140, 230, 0.20) 0%,
            rgba(220, 160, 190, 0.14) 30%,
            rgba(100, 175, 215, 0.16) 60%,
            rgba(26, 48, 64, 0.18) 100%
          )`,
          boxShadow: `
            0 0 60px ${twilight.orb.glowMulti},
            0 0 120px rgba(100, 180, 220, 0.08),
            inset 0 0 40px rgba(190, 140, 230, 0.06)
          `,
          border: '1px solid rgba(190, 140, 230, 0.12)',
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
