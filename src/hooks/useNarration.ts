import { useCallback, useEffect, useRef } from "react";
import { useAudio } from "@/components/AudioManager";

// ── Voice cache (module-level, shared across all instances) ───────────────────
// Chrome loads voices asynchronously; we cache on first load.
let cachedVoice: SpeechSynthesisVoice | null | undefined = undefined;

function resolveVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (!voices.length) return null; // not loaded yet — will retry on voiceschanged
  cachedVoice =
    voices.find((v) => v.lang === "zh-CN") ??
    voices.find((v) => v.lang === "zh-TW") ??
    voices.find((v) => v.lang.startsWith("zh")) ??
    null;
  return cachedVoice;
}

// Register the voiceschanged listener once at module load
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    cachedVoice = undefined; // reset so resolveVoice() re-scans
    resolveVoice();
  });
  resolveVoice(); // attempt immediate load (works in Firefox/Safari)
}

// ── Unlock helper (call this inside a user-gesture handler) ──────────────────
// iOS blocks speechSynthesis calls from setTimeout unless the engine has been
// "unlocked" by at least one synchronous speak() inside a touch/click handler.
export function unlockSpeech() {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(" ");
  utter.volume = 0;
  utter.rate = 10; // finish in <50ms so it's imperceptible
  window.speechSynthesis.speak(utter);
  // Do NOT call cancel() — the utterance must complete to properly unlock iOS/Safari
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useNarration = (isFading = false) => {
  const { isMuted } = useAudio();
  const isMutedRef = useRef(isMuted);
  const isFadingRef = useRef(isFading);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  // Keep mute ref current; cancel immediately if muted
  useEffect(() => {
    isMutedRef.current = isMuted;
    if (isMuted) {
      clearTimeout(timerRef.current);
      window.speechSynthesis?.cancel();
    }
  }, [isMuted]);

  // Keep fading ref current; cancel while fading in
  useEffect(() => {
    isFadingRef.current = isFading;
    if (isFading) {
      clearTimeout(timerRef.current);
      window.speechSynthesis?.cancel();
    }
  }, [isFading]);

  const speak = useCallback((text: string, delayMs = 600) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (isMutedRef.current || isFadingRef.current) return;
      const synth = window.speechSynthesis;
      if (!synth) return;

      const doSpeak = () => {
        if (synth.paused) synth.resume();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "zh-CN";
        utter.rate = 0.82;
        utter.pitch = 0.95;
        utter.volume = 1;
        const voice = resolveVoice();
        if (voice) utter.voice = voice;
        synth.speak(utter);
      };

      if (synth.speaking || synth.pending) {
        // Give the engine a moment to settle after cancelling previous speech
        synth.cancel();
        setTimeout(doSpeak, 50);
      } else {
        doSpeak();
      }
    }, delayMs);
  }, []);

  const stop = useCallback(() => {
    clearTimeout(timerRef.current);
    window.speechSynthesis?.cancel();
  }, []);

  // Cleanup on unmount
  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
      window.speechSynthesis?.cancel();
    },
    []
  );

  return { speak, stop };
};
