import { cn } from "@/lib/utils";

interface BreathingRingProps {
  size?: "sm" | "md" | "lg" | "xl";
  intensity?: "soft" | "normal" | "intense";
  className?: string;
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: "w-32 h-32",
  md: "w-48 h-48",
  lg: "w-64 h-64",
  xl: "w-80 h-80",
};

const BreathingRing = ({
  size = "lg",
  intensity = "normal",
  className,
  children,
}: BreathingRingProps) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer glow ring */}
      <div
        className={cn(
          "absolute rounded-full border-2 border-primary/30 animate-breathe-slow",
          sizeClasses[size],
          intensity === "intense" && "glow-ring-intense",
          intensity === "normal" && "glow-ring",
        )}
        style={{
          animationDelay: "0.5s",
        }}
      />
      
      {/* Middle ring */}
      <div
        className={cn(
          "absolute rounded-full border border-primary/50 animate-breathe",
          size === "sm" && "w-24 h-24",
          size === "md" && "w-40 h-40",
          size === "lg" && "w-56 h-56",
          size === "xl" && "w-72 h-72",
        )}
      />
      
      {/* Inner ring */}
      <div
        className={cn(
          "absolute rounded-full border border-primary/70 animate-breathe-reverse",
          size === "sm" && "w-16 h-16",
          size === "md" && "w-32 h-32",
          size === "lg" && "w-44 h-44",
          size === "xl" && "w-60 h-60",
        )}
      />

      {/* Center content */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default BreathingRing;
