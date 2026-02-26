import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { phaseGradient, twilight } from "@/lib/design-tokens";

// ── Phase definitions ─────────────────────────────────────────────────
const phases = [
  { label: "Entry", sub: "入口 / 安慰", idx: 1 },
  { label: "Stabilize", sub: "呼吸稳定", idx: 3 },
  { label: "Cognitive", sub: "认知陪伴", idx: 4 },
  { label: "Exit", sub: "离开", idx: 5 },
];

const isDark = (phaseIdx: number) => phaseIdx < 4;

// ── Effect definitions ────────────────────────────────────────────────
type Effect = "fade" | "diffuse" | "sweep" | "bloom";

const effects: { key: Effect; name: string; desc: string }[] = [
  {
    key: "fade",
    name: "淡化",
    desc: "旧背景缓缓消隐，新色悄然浮现",
  },
  {
    key: "diffuse",
    name: "弥散",
    desc: "新色从屏幕中心向外柔和渗透，边缘模糊如雾",
  },
  {
    key: "sweep",
    name: "流光",
    desc: "新色以光晕形式从左至右缓缓漫过",
  },
  {
    key: "bloom",
    name: "晕开",
    desc: "光晕从中心悄悄扩大，如墨入水般自然",
  },
];

// ── Speed config ──────────────────────────────────────────────────────
const speeds: { key: string; label: string; dur: number }[] = [
  { key: "slow", label: "慢", dur: 3.2 },
  { key: "normal", label: "正常", dur: 2.0 },
  { key: "fast", label: "快", dur: 1.1 },
];

// ── Easing helpers ────────────────────────────────────────────────────
const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ── Main component ────────────────────────────────────────────────────
export default function Playground() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [effect, setEffect] = useState<Effect>("diffuse");
  const [speedKey, setSpeedKey] = useState("normal");
  const [autoPlay, setAutoPlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dur = speeds.find((s) => s.key === speedKey)!.dur;
  const current = phases[currentIdx];
  const next = nextIdx !== null ? phases[nextIdx] : null;

  // ── Finish transition ────────────────────────────────────────────
  const onDone = useCallback(() => {
    if (nextIdx === null) return;
    setCurrentIdx(nextIdx);
    setNextIdx(null);
    setTransitioning(false);
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "1";
      overlayRef.current.style.webkitMaskImage = "";
      overlayRef.current.style.maskImage = "";
    }
  }, [nextIdx]);

  // ── Trigger transition ───────────────────────────────────────────
  const goTo = useCallback(
    (idx: number) => {
      if (transitioning || idx === currentIdx) return;
      setNextIdx(idx);
      setTransitioning(true);
    },
    [transitioning, currentIdx]
  );

  // ── Run animation based on effect ───────────────────────────────
  useEffect(() => {
    if (!transitioning || nextIdx === null) return;
    cancelAnimationFrame(rafRef.current);

    const durMs = dur * 1000;
    const start = performance.now();

    if (effect === "fade") {
      // Framer Motion handles this — nothing to do here
      return;
    }

    const animate = (now: number) => {
      const t = Math.min((now - start) / durMs, 1);

      if (effect === "diffuse") {
        // Soft-edge radial mask expanding from center
        const eased = easeOutCubic(t);
        const pct = eased * 145; // expand to 145% to cover corners
        const feather = 20; // wide feather for soft edge
        if (overlayRef.current) {
          const mask = `radial-gradient(circle at 50% 50%, black ${Math.max(0, pct - feather)}%, transparent ${pct}%)`;
          overlayRef.current.style.webkitMaskImage = mask;
          overlayRef.current.style.maskImage = mask;
        }
      } else if (effect === "sweep") {
        // Left-to-right gradient wipe with wide soft leading edge
        const eased = easeInOutCubic(t);
        const pct = eased * 120;
        const feather = 25;
        if (overlayRef.current) {
          const mask = `linear-gradient(to right, black ${Math.max(0, pct - feather)}%, transparent ${pct}%)`;
          overlayRef.current.style.webkitMaskImage = mask;
          overlayRef.current.style.maskImage = mask;
        }
      } else if (effect === "bloom") {
        // Soft orb that grows: starts small with high blur, ends full with no blur
        const eased = easeInOutQuad(t);
        const pct = eased * 145;
        const feather = 12 + (1 - eased) * 25; // feather narrows as it grows
        if (overlayRef.current) {
          const mask = `radial-gradient(circle at 50% 50%, black ${Math.max(0, pct - feather)}%, transparent ${pct}%)`;
          overlayRef.current.style.webkitMaskImage = mask;
          overlayRef.current.style.maskImage = mask;
        }
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        onDone();
      }
    };

    // Small delay so the overlay div is mounted before we animate it
    const timeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, 16);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [transitioning, nextIdx, effect, dur, onDone]);

  // ── Auto-play ────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay) {
      if (autoRef.current) clearTimeout(autoRef.current);
      return;
    }
    if (transitioning) return;
    const waitMs = (dur + 1.2) * 1000;
    autoRef.current = setTimeout(() => {
      goTo((currentIdx + 1) % phases.length);
    }, waitMs);
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [autoPlay, currentIdx, transitioning, dur, goTo]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      if (autoRef.current) clearTimeout(autoRef.current);
    },
    []
  );

  return (
    <div
      className="min-h-screen flex flex-col select-none"
      style={{ background: "#080e12", fontFamily: twilight.font.family }}
    >
      {/* ── Preview area ─────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden flex flex-col items-center justify-center"
        style={{
          minHeight: "60vh",
          background: phaseGradient(current.idx),
        }}
      >
        {/* Overlay: the incoming background */}
        {transitioning && next && (
          <>
            {effect === "fade" ? (
              // Fade: Framer Motion opacity
              <motion.div
                className="absolute inset-0"
                style={{ background: phaseGradient(next.idx) }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: dur,
                  ease: [0.4, 0, 0.3, 1],
                }}
                onAnimationComplete={onDone}
              />
            ) : (
              // Mask-driven effects (diffuse / sweep / bloom)
              <div
                ref={overlayRef}
                className="absolute inset-0"
                style={{
                  background: phaseGradient(next.idx),
                  WebkitMaskImage:
                    "radial-gradient(circle at 50% 50%, black 0%, transparent 0%)",
                  maskImage:
                    "radial-gradient(circle at 50% 50%, black 0%, transparent 0%)",
                }}
              />
            )}
          </>
        )}

        {/* Phase label */}
        <div className="relative z-10 text-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={transitioning ? `n-${nextIdx}` : `c-${currentIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: transitioning ? dur * 0.6 : 0 }}
            >
              <p
                className="text-3xl mb-2"
                style={{
                  color: isDark(
                    (transitioning && next ? next : current).idx
                  )
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(12,32,40,0.85)",
                  fontWeight: 300,
                }}
              >
                {(transitioning && next ? next : current).label}
              </p>
              <p
                className="text-sm"
                style={{
                  color: isDark(
                    (transitioning && next ? next : current).idx
                  )
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(12,32,40,0.35)",
                }}
              >
                {(transitioning && next ? next : current).sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Controls ─────────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-5 px-5 py-6"
        style={{ background: "#0a1318" }}
      >
        {/* Effect selector */}
        <div>
          <p
            className="text-xs mb-3"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            过渡方式
          </p>
          <div className="grid grid-cols-2 gap-2">
            {effects.map((e) => (
              <button
                key={e.key}
                onClick={() => setEffect(e.key)}
                className="text-left rounded-xl px-4 py-3 transition-all"
                style={{
                  background:
                    effect === e.key
                      ? "rgba(122,184,184,0.12)"
                      : "rgba(255,255,255,0.04)",
                  border:
                    effect === e.key
                      ? "1px solid rgba(122,184,184,0.35)"
                      : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p
                  className="text-base mb-0.5"
                  style={{
                    color:
                      effect === e.key
                        ? "#7ab8b8"
                        : "rgba(255,255,255,0.65)",
                    fontWeight: 300,
                  }}
                >
                  {e.name}
                </p>
                <p
                  className="text-xs leading-snug"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {e.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Phase swatches */}
        <div>
          <p
            className="text-xs mb-3"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            点击切换阶段
          </p>
          <div className="flex gap-2">
            {phases.map((ph, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                disabled={transitioning}
                className="flex-1 rounded-lg overflow-hidden flex flex-col items-center pb-2 transition-opacity"
                style={{
                  background: phaseGradient(ph.idx),
                  opacity: transitioning ? 0.45 : 1,
                  outline:
                    currentIdx === i
                      ? "2px solid rgba(255,255,255,0.75)"
                      : nextIdx === i
                      ? "2px solid rgba(255,255,255,0.3)"
                      : "2px solid transparent",
                  outlineOffset: "2px",
                }}
              >
                <div className="h-9 w-full" />
                <span
                  className="text-[9px] leading-tight text-center px-1"
                  style={{
                    color: isDark(ph.idx)
                      ? "rgba(255,255,255,0.55)"
                      : "rgba(12,32,40,0.55)",
                  }}
                >
                  {ph.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Speed + autoplay */}
        <div className="flex items-center gap-2">
          <p
            className="text-xs mr-1"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            速度
          </p>
          {speeds.map((s) => (
            <button
              key={s.key}
              onClick={() => setSpeedKey(s.key)}
              className="px-3 py-1.5 rounded-full text-sm transition-all"
              style={{
                background:
                  speedKey === s.key
                    ? "rgba(122,184,184,0.18)"
                    : "rgba(255,255,255,0.05)",
                color:
                  speedKey === s.key
                    ? "#7ab8b8"
                    : "rgba(255,255,255,0.4)",
                border:
                  speedKey === s.key
                    ? "1px solid rgba(122,184,184,0.35)"
                    : "1px solid transparent",
              }}
            >
              {s.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => setAutoPlay((v) => !v)}
            className="px-4 py-1.5 rounded-full text-sm transition-all"
            style={{
              background: autoPlay
                ? "rgba(122,184,184,0.15)"
                : "rgba(255,255,255,0.05)",
              color: autoPlay ? "#7ab8b8" : "rgba(255,255,255,0.4)",
              border: autoPlay
                ? "1px solid rgba(122,184,184,0.3)"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {autoPlay ? "⏹ 停止" : "▶ 连播"}
          </button>
        </div>

        <p
          className="text-xs text-center"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          选择让你感觉「润无声息」的方式 · 确认后告诉我应用到主流程
        </p>
      </div>
    </div>
  );
}
