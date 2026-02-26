import { useCallback, useEffect, useRef } from "react";
import { useAudio } from "@/components/AudioManager";

/**
 * Audio narration hook for a phase.
 *
 * Phases are shown sequentially (no overlap), so there is no isFading complexity.
 * play(src, gapMs, fn) — plays audio, then after gapMs calls fn.
 * Phase transitions are driven by actual audio duration, not hardcoded timers.
 * Narration is stopped on unmount so audio doesn't bleed into the next phase.
 */
export const usePhaseAudio = () => {
  const { playNarration, stopNarration } = useAudio();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Stop narration and clear any pending timer when phase unmounts
  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
      stopNarration();
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  /**
   * Play a narration audio file.
   * @param src    public path, e.g. "/comfort-1.m4a"
   * @param gapMs  ms to wait after audio ends before calling thenFn (default 1200)
   * @param thenFn callback to run after audio + gap (optional)
   */
  const play = useCallback(
    (src: string, gapMs = 1200, thenFn?: () => void) => {
      clearTimeout(timerRef.current);

      const onEnd = thenFn
        ? () => {
            timerRef.current = setTimeout(thenFn, gapMs);
          }
        : undefined;

      playNarration(src, onEnd);
    },
    [playNarration]
  );

  return { play, stop: stopNarration };
};
