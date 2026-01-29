import BreathingRing from "@/components/BreathingRing";
import { cn } from "@/lib/utils";

interface ExitPhaseProps {
  onRestart: () => void;
  className?: string;
}

const ExitPhase = ({ onRestart, className }: ExitPhaseProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen px-6",
        "animate-fade-in-up",
        className
      )}
    >
      {/* Phase title */}
      <div className="absolute top-20 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
          Exit
        </p>
        <h2 className="text-lg font-light text-foreground/80">结束</h2>
      </div>

      {/* Completion message */}
      <BreathingRing size="lg" intensity="soft">
        <div className="text-center max-w-xs">
          <p className="text-2xl font-light mb-4 glow-text">稳定</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            你已经完成了稳定流程
            <br />
            现在可以继续你的事情
          </p>
        </div>
      </BreathingRing>

      {/* Affirmation */}
      <div className="absolute bottom-48 text-center max-w-xs">
        <p className="text-foreground/70 font-light leading-relaxed">
          记住：
          <br />
          <span className="text-primary/80">
            你刚才的感受是正常的反应
          </span>
        </p>
      </div>

      {/* Return button */}
      <button
        onClick={onRestart}
        className={cn(
          "absolute bottom-24 px-8 py-3 rounded-full",
          "bg-primary text-primary-foreground",
          "font-light tracking-wide",
          "transition-all duration-500",
          "hover:opacity-90",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          "active:scale-95"
        )}
      >
        返回
      </button>

      {/* Note */}
      <p className="absolute bottom-10 text-xs text-muted-foreground/40 text-center">
        如需要进一步帮助，请联系专业人士
      </p>
    </div>
  );
};

export default ExitPhase;
