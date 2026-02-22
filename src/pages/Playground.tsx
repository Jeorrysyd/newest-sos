import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { twilight } from "@/lib/design-tokens";

// ── Palette definitions ──────────────────────────────────────────────

interface PaletteDef {
  id: string;
  name: string;
  subtitle: string;
  /** 6 gradient stops, one per phase (Entry → Comfort → Stabilize → Cognitive → Exit-early → Exit-late) */
  stops: [string, string][];
  accent: string;
  orb: { inner: string; outer: string; glow: string };
  /** Index at which text flips from light→dark */
  darkTextFrom: number;
  particle: string;
}

const palettes: PaletteDef[] = [
  {
    id: "morning-mist",
    name: "晨雾",
    subtitle: "Morning Mist — 森林清晨的疗愈感",
    stops: [
      ["#0f1a16", "#162420"],
      ["#162420", "#1e3a2e"],
      ["#1e3a2e", "#3a6050"],
      ["#3a6050", "#6a9a78"],
      ["#6a9a78", "#a8cca0"],
      ["#a8cca0", "#e8f0d8"],
    ],
    accent: "#8abf8a",
    orb: {
      inner: "rgba(138, 191, 138, 0.25)",
      outer: "rgba(106, 154, 120, 0.12)",
      glow: "rgba(168, 204, 160, 0.18)",
    },
    darkTextFrom: 4,
    particle: "rgba(168, 204, 160, 0.12)",
  },
  {
    id: "warm-sand",
    name: "暖沙",
    subtitle: "Warm Sand — 大地般温暖、安稳",
    stops: [
      ["#1a1410", "#241c16"],
      ["#241c16", "#3a2e22"],
      ["#3a2e22", "#6a5040"],
      ["#6a5040", "#a08060"],
      ["#a08060", "#d0b898"],
      ["#d0b898", "#f0e4d0"],
    ],
    accent: "#c8a070",
    orb: {
      inner: "rgba(200, 160, 112, 0.25)",
      outer: "rgba(160, 128, 96, 0.12)",
      glow: "rgba(208, 184, 152, 0.18)",
    },
    darkTextFrom: 4,
    particle: "rgba(208, 184, 152, 0.12)",
  },
  {
    id: "soft-clouds",
    name: "柔云",
    subtitle: "Soft Clouds — 破晓时分的柔和天空",
    stops: [
      ["#141418", "#1c1c28"],
      ["#1c1c28", "#2e2a3e"],
      ["#2e2a3e", "#5a4a68"],
      ["#5a4a68", "#9a8098"],
      ["#9a8098", "#c8b0b8"],
      ["#c8b0b8", "#f0e0e0"],
    ],
    accent: "#c0a0b0",
    orb: {
      inner: "rgba(192, 160, 176, 0.25)",
      outer: "rgba(154, 128, 152, 0.12)",
      glow: "rgba(200, 176, 184, 0.18)",
    },
    darkTextFrom: 4,
    particle: "rgba(200, 176, 184, 0.12)",
  },
  {
    id: "still-sea",
    name: "静海",
    subtitle: "Still Sea — 平静海面的治愈蓝",
    stops: [
      ["#0c1418", "#122028"],
      ["#122028", "#1a3040"],
      ["#1a3040", "#3a5868"],
      ["#3a5868", "#6a9098"],
      ["#6a9098", "#a0c4c8"],
      ["#a0c4c8", "#e0f0f0"],
    ],
    accent: "#7ab8b8",
    orb: {
      inner: "rgba(122, 184, 184, 0.25)",
      outer: "rgba(106, 144, 152, 0.12)",
      glow: "rgba(160, 196, 200, 0.18)",
    },
    darkTextFrom: 4,
    particle: "rgba(160, 196, 200, 0.12)",
  },
];

const phaseLabels = ["入口", "安慰", "呼吸", "认知", "退出前", "退出"];

// ── Playground page ──────────────────────────────────────────────────

const Playground = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [previewPalette, setPreviewPalette] = useState<string | null>(null);

  const activePalette = palettes.find((p) => p.id === (previewPalette ?? selected));

  return (
    <div
      className="min-h-screen px-4 py-12 md:px-8"
      style={{
        background: "linear-gradient(180deg, #0e0e14 0%, #1a1a24 100%)",
        fontFamily: twilight.font.family,
        fontWeight: twilight.font.weight,
      }}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-14 text-center">
        <h1
          className="text-3xl mb-3"
          style={{ color: "rgba(255,255,255,0.9)", fontWeight: 300 }}
        >
          配色方案
        </h1>
        <p className="text-base" style={{ color: "rgba(255,255,255,0.4)" }}>
          选择一个让你感到安心的色彩
        </p>
      </div>

      {/* Palette cards */}
      <div className="max-w-3xl mx-auto space-y-6">
        {palettes.map((palette) => {
          const isSelected = selected === palette.id;
          return (
            <motion.button
              key={palette.id}
              onClick={() => setSelected(palette.id)}
              onMouseEnter={() => setPreviewPalette(palette.id)}
              onMouseLeave={() => setPreviewPalette(null)}
              className="w-full text-left rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: isSelected
                  ? `1.5px solid ${palette.accent}`
                  : "1.5px solid rgba(255,255,255,0.06)",
                boxShadow: isSelected
                  ? `0 0 30px ${palette.accent}22`
                  : "none",
              }}
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.998 }}
            >
              {/* Gradient bar — all 6 phases */}
              <div className="flex h-16 rounded-t-2xl overflow-hidden">
                {palette.stops.map(([from, to], i) => (
                  <div
                    key={i}
                    className="flex-1 relative flex items-end justify-center pb-1.5"
                    style={{
                      background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
                    }}
                  >
                    <span
                      className="text-[10px] leading-none"
                      style={{
                        color:
                          i >= palette.darkTextFrom
                            ? "rgba(0,0,0,0.35)"
                            : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {phaseLabels[i]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Info row */}
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Orb preview */}
                <div className="relative flex-shrink-0 w-14 h-14 flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${palette.orb.inner} 0%, ${palette.orb.outer} 60%, transparent 80%)`,
                      filter: "blur(6px)",
                    }}
                  />
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 32,
                      height: 32,
                      background: `radial-gradient(circle at 40% 35%, ${palette.orb.inner} 0%, ${palette.orb.glow} 60%, transparent 90%)`,
                      boxShadow: `0 0 20px ${palette.orb.glow}`,
                    }}
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3
                      className="text-xl"
                      style={{ color: palette.accent, fontWeight: 300 }}
                    >
                      {palette.name}
                    </h3>
                    {isSelected && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: `${palette.accent}20`,
                          color: palette.accent,
                        }}
                      >
                        已选择
                      </motion.span>
                    )}
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {palette.subtitle}
                  </p>
                </div>

                {/* Accent dot */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    background: palette.accent,
                    boxShadow: `0 0 12px ${palette.accent}44`,
                  }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Live preview ────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activePalette && (
          <motion.div
            key={activePalette.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto mt-14"
          >
            <p
              className="text-sm mb-5 text-center"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              预览 — {activePalette.name}
            </p>

            {/* Phase cards preview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {activePalette.stops.map(([from, to], i) => {
                const isDark = i < activePalette.darkTextFrom;
                return (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden p-5 min-h-[140px] flex flex-col justify-between"
                    style={{
                      background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
                    }}
                  >
                    {/* Floating particle hint */}
                    {[0, 1, 2].map((j) => (
                      <div
                        key={j}
                        className="absolute rounded-full animate-float"
                        style={{
                          width: 3 + j,
                          height: 3 + j,
                          left: `${20 + j * 25}%`,
                          top: `${20 + j * 20}%`,
                          background: activePalette.particle,
                          filter: "blur(1px)",
                          animationDelay: `${j * 0.8}s`,
                          animationDuration: `${4 + j}s`,
                        }}
                      />
                    ))}

                    {/* Mini orb */}
                    <div className="flex justify-center mb-3">
                      <div
                        className="w-10 h-10 rounded-full"
                        style={{
                          background: `radial-gradient(circle at 40% 35%, ${activePalette.orb.inner} 0%, ${activePalette.orb.glow} 50%, transparent 80%)`,
                          boxShadow: `0 0 16px ${activePalette.orb.glow}`,
                          filter: "blur(2px)",
                        }}
                      />
                    </div>

                    {/* Sample text */}
                    <div className="relative z-10">
                      <p
                        className="text-base mb-1"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.85)"
                            : "rgba(42,21,53,0.85)",
                          fontWeight: 300,
                        }}
                      >
                        你还好吗
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color: isDark
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(42,21,53,0.4)",
                        }}
                      >
                        {phaseLabels[i]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Apply button ────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 left-0 right-0 flex justify-center z-50"
          >
            <div
              className="text-center px-8 py-3 rounded-full text-base"
              style={{
                background: palettes.find((p) => p.id === selected)!.accent,
                color: "#1a1a1a",
                fontWeight: 300,
                boxShadow: `0 4px 30px ${palettes.find((p) => p.id === selected)!.accent}44`,
              }}
            >
              已选择「{palettes.find((p) => p.id === selected)!.name}」— 告诉我来应用
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Playground;
