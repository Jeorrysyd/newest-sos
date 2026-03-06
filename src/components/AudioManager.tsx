import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { twilight } from "@/lib/design-tokens";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playBgm: () => void;
  stopBgm: () => void;
  playNarration: (src: string, onEnd?: () => void) => void;
  stopNarration: () => void;
  unlockAudio: () => void;
}

const AudioCtx = createContext<AudioContextType>({
  isMuted: false,
  toggleMute: () => {},
  playBgm: () => {},
  stopBgm: () => {},
  playNarration: () => {},
  stopNarration: () => {},
  unlockAudio: () => {},
});

export const useAudio = () => useContext(AudioCtx);

interface AudioProviderProps {
  children: React.ReactNode;
  bgmSrc?: string;
}

export const AudioProvider = ({ children, bgmSrc }: AudioProviderProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const narrationRef = useRef<HTMLAudioElement | null>(null);
  // Generation counter — invalidates stale callbacks from previous calls
  const genRef = useRef(0);
  // RAF handle — debounces rapid duplicate calls into one
  const rafRef = useRef<number>(0);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      isMutedRef.current = next;
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

  const playNarration = useCallback((src: string, onEnd?: () => void) => {
    if (!narrationRef.current) return;
    const el = narrationRef.current;
    const gen = ++genRef.current;

    console.log(`[audio] playNarration called: ${src.split('/').pop()} gen=${gen}`);

    // Cancel any pending RAF from a previous rapid call
    cancelAnimationFrame(rafRef.current);

    // Pause immediately so old audio stops
    el.pause();
    el.onended = null;
    el.onerror = null;

    // Defer play to next frame — avoids "interrupted by pause()" when called twice rapidly
    rafRef.current = requestAnimationFrame(() => {
      // If a newer call arrived since we were scheduled, bail out
      if (gen !== genRef.current) {
        console.log(`[audio] skipping stale gen=${gen} (current=${genRef.current})`);
        return;
      }

      let fired = false;
      const safeEnd = onEnd ? () => {
        if (!fired && gen === genRef.current) {
          fired = true;
          console.log(`[audio] safeEnd: ${src.split('/').pop()} gen=${gen} (time=${el.currentTime.toFixed(1)}/${el.duration?.toFixed(1)})`);
          onEnd();
        }
      } : undefined;

      el.onended = safeEnd ?? null;
      el.onerror = safeEnd ? () => {
        console.log(`[audio] onerror: ${src.split('/').pop()} gen=${gen} error=${el.error?.code}`);
        setTimeout(safeEnd, 2000);
      } : null;
      el.currentTime = 0;
      el.src = src;
      el.muted = isMutedRef.current;
      el.play().catch(() => {
        console.log(`[audio] play() failed: ${src.split('/').pop()} gen=${gen}`);
        if (gen === genRef.current && safeEnd) setTimeout(safeEnd, 2000);
      });
    });
  }, []);

  const stopNarration = useCallback(() => {
    if (!narrationRef.current) return;
    ++genRef.current; // Invalidate any pending callbacks
    cancelAnimationFrame(rafRef.current);
    narrationRef.current.onended = null;
    narrationRef.current.pause();
    narrationRef.current.currentTime = 0;
  }, []);

  // Unlock audio on iOS Safari — must be called inside a user gesture handler
  const unlockAudio = useCallback(() => {
    const el = narrationRef.current;
    if (el) {
      // Play a tiny silent WAV to "unlock" the audio element
      const prevSrc = el.src;
      el.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
      el.play().then(() => {
        el.pause();
        el.currentTime = 0;
        if (prevSrc) el.src = prevSrc;
      }).catch(() => {});
    }
  }, []);

  // Set BGM to a soft background volume
  useEffect(() => {
    if (bgmRef.current) bgmRef.current.volume = 0.15;
  }, []);

  useEffect(() => {
    return () => {
      bgmRef.current?.pause();
      narrationRef.current?.pause();
    };
  }, []);

  return (
    <AudioCtx.Provider value={{ isMuted, toggleMute, playBgm, stopBgm, playNarration, stopNarration, unlockAudio }}>
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
