import { cn } from "@/lib/utils";
import { twilight } from "@/lib/design-tokens";

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

const PhoneFrame = ({ children, className }: PhoneFrameProps) => {
  return (
    <>
      {/* Mobile: full screen, no frame */}
      <div className={cn("md:hidden w-full min-h-screen", className)}>
        {children}
      </div>

      {/* Desktop: phone frame wrapper */}
      <div className="hidden md:flex items-center justify-center min-h-screen"
        style={{ background: twilight.palette.deepIndigo }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            width: 390,
            height: 844,
            borderRadius: 48,
            border: `6px solid #0e1c22`,
            boxShadow: `
              0 0 0 2px rgba(122, 184, 184, 0.08),
              0 20px 60px rgba(0, 0, 0, 0.5),
              inset 0 0 0 1px rgba(255, 255, 255, 0.05)
            `,
          }}
        >
          {/* Notch / Dynamic Island */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-[60]"
            style={{
              width: 126,
              height: 36,
              borderRadius: '0 0 20px 20px',
              background: '#0e1c22',
            }}
          />

          {/* Home indicator */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[60]"
            style={{
              width: 134,
              height: 5,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.15)',
            }}
          />

          {/* Content area */}
          <div className="w-full h-full overflow-hidden" style={{ borderRadius: 42 }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default PhoneFrame;
