import { cn } from "@/lib/utils";

interface SOSButtonProps {
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

const SOSButton = ({ onClick, isActive = false, className }: SOSButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center",
        "w-36 h-36 rounded-full",
        "bg-destructive text-destructive-foreground",
        "text-2xl font-medium tracking-wider",
        "transition-all duration-500 ease-out",
        "glow-sos glow-sos-pulse",
        "hover:scale-105 active:scale-95",
        "focus:outline-none focus:ring-4 focus:ring-destructive/30",
        isActive && "scale-95 opacity-80",
        className
      )}
    >
      {/* Outer pulse ring */}
      <span className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
      
      {/* Inner gradient overlay */}
      <span className="absolute inset-2 rounded-full bg-gradient-to-br from-destructive to-destructive-soft opacity-50" />
      
      {/* Text */}
      <span className="relative z-10 font-medium">紧急求助</span>
    </button>
  );
};

export default SOSButton;
