import SOSButton from "@/components/SOSButton";
import { cn } from "@/lib/utils";

interface EntryPhaseProps {
  onEnter: () => void;
  className?: string;
}

const EntryPhase = ({ onEnter, className }: EntryPhaseProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen px-6",
        "animate-fade-in-up",
        className
      )}
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-muted/20 via-transparent to-transparent" />

      {/* Question text */}
      <div className="relative z-10 text-center mb-12 space-y-3">
        <p className="text-lg text-muted-foreground font-light">您是否此刻</p>
        <h1 className="text-2xl font-normal tracking-wide">
          正在感受到痛苦？
        </h1>
      </div>

      {/* SOS Button */}
      <div className="relative z-10">
        <SOSButton onClick={onEnter} />
      </div>

      {/* Helper text */}
      <p className="relative z-10 mt-12 text-sm text-muted-foreground/60 text-center max-w-xs">
        点击上方按钮，进入稳定流程
        <br />
        <span className="text-xs">无需解释，无需判断</span>
      </p>
    </div>
  );
};

export default EntryPhase;
