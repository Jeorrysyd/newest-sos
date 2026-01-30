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
        "bg-background-light",
        className
      )}
    >
      {/* Title */}
      <div className="text-center mb-6 space-y-2">
        <h1 className="text-3xl font-medium text-foreground-light leading-tight">
          您是否此刻
        </h1>
        <h1 className="text-3xl font-medium text-foreground-light leading-tight">
          正在遭受到创伤？
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-foreground-light/60 text-base mb-16">
        按下按钮 寻求帮助
      </p>

      {/* SOS Button */}
      <SOSButton onClick={onEnter} />
    </div>
  );
};

export default EntryPhase;