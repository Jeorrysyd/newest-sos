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
        "transition-transform duration-200 ease-out",
        "hover:scale-[1.03] active:scale-95",
        "focus:outline-none",
        isActive && "scale-95",
        className
      )}
      style={{
        background: "rgba(180, 130, 220, 0.06)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(180, 130, 220, 0.45)",
        boxShadow: `
          0 0 60px rgba(180, 130, 220, 0.18),
          0 0 120px rgba(100, 180, 220, 0.07),
          inset 0 0 30px rgba(180, 130, 220, 0.04)
        `,
      }}
    >
      {/* Decorative ring 1 */}
      <span
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 260,
          height: 260,
          border: "1px solid rgba(180, 130, 220, 0.18)",
        }}
      />
      {/* Decorative ring 2 */}
      <span
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 320,
          height: 320,
          border: "1px solid rgba(180, 130, 220, 0.09)",
        }}
      />

      {/* Label */}
      <span
        className="relative z-10"
        style={{
          color: "rgba(255, 255, 255, 0.85)",
          fontSize: 16,
          fontWeight: 300,
          letterSpacing: "0.04em",
          fontFamily: twilight.font.family,
        }}
      >
        我需要帮助
      </span>
    </button>
  );
};

export default SOSButton;
