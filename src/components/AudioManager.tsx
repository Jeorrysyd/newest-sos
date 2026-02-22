import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { twilight } from "@/lib/design-tokens";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playBgm: () => void;
  stopBgm: () => void;
  playNarration: (src: string) => void;
  stopNarration: () => void;
}

const AudioCtx = createContext<AudioContextType>({
  isMuted: false,
  toggleMute: () => {},
  playBgm: () => {},
  stopBgm: () => {},
  playNarration: () => {},
  stopNarration: () => {},
});

export const useAudio = () => useContext(AudioCtx);

interface AudioProviderProps {
  children: React.ReactNode;
  bgmSrc?: string;
}

export const AudioProvider = ({ children, bgmSrc }: AudioProviderProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (bgmRef.current) bgmRef.current.muted = next;
      if (narrationRef.current) narrationRef.current.muted = next;
      return next;
    });
  }, []);

  const playBgm = useCallback(() => {
    if (!bgmSrc || !bgmRef.current) return;
    bgmRef.current.play().catch(() => {});
  }, [bgmSrc]);

  const stopBgm = useCallback(() => {
    if (!bgmRef.current) return;
    bgmRef.current.pause();
    bgmRef.current.currentTime = 0;
  }, []);

  const playNarration = useCallback((src: string) => {
    if (!narrationRef.current) return;
    narrationRef.current.src = src;
    narrationRef.current.muted = isMuted;
    narrationRef.current.play().catch(() => {});
  }, [isMuted]);

  const stopNarration = useCallback(() => {
    if (!narrationRef.current) return;
    narrationRef.current.pause();
    narrationRef.current.currentTime = 0;
  }, []);

  useEffect(() => {
    return () => {
      bgmRef.current?.pause();
      narrationRef.current?.pause();
    };
  }, []);

  return (
    <AudioCtx.Provider value={{ isMuted, toggleMute, playBgm, stopBgm, playNarration, stopNarration }}>
      {bgmSrc && (
        <audio ref={bgmRef} src={bgmSrc} loop preload="auto" muted={isMuted} />
      )}
      <audio ref={narrationRef} preload="none" muted={isMuted} />
      {children}
    </AudioCtx.Provider>
  );
};

// Mute toggle button — positioned top-right
export const MuteButton = () => {
  const { isMuted, toggleMute } = useAudio();

  return (
    <motion.button
      onClick={toggleMute}
      className={cn(
        "fixed top-6 right-6 z-[70]",
        "w-10 h-10 rounded-full",
        "flex items-center justify-center",
        "backdrop-blur-sm",
        "transition-all duration-300",
        "hover:scale-110 active:scale-95"
      )}
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      aria-label={isMuted ? "取消静音" : "静音"}
    >
      {isMuted ? (
        // Muted icon
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={twilight.text.light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // Sound on icon
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={twilight.text.light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 010 14.14" opacity="0.3" />
          <path d="M15.54 8.46a5 5 0 010 7.07" />
        </svg>
      )}
    </motion.button>
  );
};
