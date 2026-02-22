import { cn } from "@/lib/utils";
import { twilight } from "@/lib/design-tokens";

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
        "text-2xl tracking-wider",
        "transition-all duration-500 ease-out",
        "hover:scale-105 active:scale-95",
        "focus:outline-none",
        isActive && "scale-95 opacity-80",
        className
      )}
      style={{
        background: `radial-gradient(circle at 40% 35%, ${twilight.palette.coral}, ${twilight.palette.plum})`,
        boxShadow: `0 8px 32px rgba(106, 144, 152, 0.4)`,
        fontFamily: twilight.font.family,
        fontWeight: 300,
        color: twilight.text.light,
      }}
    >
      {/* Outer ring 2 - lightest */}
      <span
        className="absolute rounded-full"
        style={{
          width: '280px',
          height: '280px',
          opacity: 0.5,
          background: `radial-gradient(circle, rgba(106, 144, 152, 0.2) 60%, transparent 70%)`,
        }}
      />

      {/* Outer ring 1 */}
      <span
        className="absolute rounded-full"
        style={{
          width: '240px',
          height: '240px',
          opacity: 0.6,
          background: `radial-gradient(circle, rgba(106, 144, 152, 0.3) 70%, transparent 85%)`,
        }}
      />

      {/* Main button circle */}
      <span
        className="absolute w-48 h-48 rounded-full"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${twilight.palette.coral}, ${twilight.palette.plum})`,
        }}
      />

      {/* Text */}
      <span className="relative z-10" style={{ color: twilight.text.light }}>
        我需要帮助
      </span>
    </button>
  );
};

export default SOSButton;
