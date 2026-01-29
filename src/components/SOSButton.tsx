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
        "w-48 h-48 rounded-full",
        "bg-destructive text-destructive-foreground",
        "text-2xl font-medium tracking-wider",
        "transition-all duration-500 ease-out",
        "hover:scale-105 active:scale-95",
        "focus:outline-none",
        isActive && "scale-95 opacity-80",
        className
      )}
      style={{
        boxShadow: '0 8px 32px hsl(5 65% 60% / 0.4)',
      }}
    >
      {/* Outer ring 2 - lightest */}
      <span 
        className="absolute rounded-full bg-destructive-ring-2"
        style={{
          width: '280px',
          height: '280px',
          opacity: 0.6,
        }}
      />
      
      {/* Outer ring 1 */}
      <span 
        className="absolute rounded-full bg-destructive-ring-1"
        style={{
          width: '240px',
          height: '240px',
          opacity: 0.7,
        }}
      />
      
      {/* Main button circle */}
      <span className="absolute w-48 h-48 rounded-full bg-destructive" />
      
      {/* Text */}
      <span className="relative z-10 font-medium text-white">紧急求助</span>
    </button>
  );
};

export default SOSButton;