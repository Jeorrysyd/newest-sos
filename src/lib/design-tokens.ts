// 静海 Design System — Still Sea
// Palette: #0c1418 → #1a3040 → #3a5868 → #6a9098 → #a0c4c8 → #e0f0f0

export const twilight = {
  // Core palette stops — deep teal → pearl
  palette: {
    deepIndigo: '#0c1418',
    darkPurple: '#122028',
    midPurple: '#1a3040',
    plum: '#3a5868',
    coral: '#6a9098',
    amber: '#a0c4c8',
    gold: '#e0f0f0',
    // Accent
    softCoral: '#7ab8b8',
  },

  // Text colors — adaptive per phase brightness
  text: {
    // For dark backgrounds (phases 0–3): bright white
    light: '#ffffff',
    lightMuted: 'rgba(255, 255, 255, 0.45)',
    lightSoft: 'rgba(255, 255, 255, 0.7)',
    // For bright backgrounds (phases 4–5): dark text
    dark: '#0c2028',
    darkMuted: 'rgba(12, 32, 40, 0.45)',
    darkSoft: 'rgba(12, 32, 40, 0.7)',
  },

  // Accent / emphasis color
  accent: '#7ab8b8',

  // Orb config — 静海 (Still Sea) with aurora multicolor
  orb: {
    blur: 30,
    // Multicolor aurora tones (紫 / 粉 / 蓝)
    colorPurple: 'rgba(180, 130, 220, 0.35)',
    colorPink:   'rgba(230, 150, 180, 0.28)',
    colorBlue:   'rgba(100, 180, 220, 0.30)',
    glowMulti:   'rgba(180, 130, 220, 0.15)',
    // Original teal (kept for breathing ring center)
    innerColor: 'rgba(122, 184, 184, 0.25)',
    outerColor: 'rgba(106, 144, 152, 0.12)',
    glowColor: 'rgba(160, 196, 200, 0.18)',
  },

  // Rhythm — 微风 (Breeze) 5s cycle
  rhythm: {
    cycleDuration: 5,
  },

  // Transition
  transition: {
    duration: 0.8,
    ease: [0.4, 0, 0.2, 1] as readonly number[],
  },

  // Font — 思源宋体 (Noto Serif SC)
  font: {
    family: "'Noto Serif SC', serif",
    weight: 200,
  },
} as const;

// Phase gradient stops — deep teal → pearl white
const phaseStops: [string, string][] = [
  ['#0c1418', '#122028'], // 0: Entry — darkest
  ['#122028', '#1a3040'], // 1: (unused, kept for index compat)
  ['#1a3040', '#3a5868'], // 2: Comfort
  ['#3a5868', '#6a9098'], // 3: Stabilize
  ['#6a9098', '#a0c4c8'], // 4: Cognitive — bright
  ['#a0c4c8', '#e0f0f0'], // 5: Exit — brightest
];

export function phaseGradient(index: number): string {
  const [from, to] = phaseStops[Math.min(index, phaseStops.length - 1)];
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}

export function phaseColors(index: number) {
  const [from, to] = phaseStops[Math.min(index, phaseStops.length - 1)];
  return { from, to };
}

// Helper: get text colors based on phase index
// Phases 0-3 = dark bg → light text; Phases 4-5 = bright bg → dark text
export function phaseText(index: number) {
  if (index <= 3) {
    return {
      primary: twilight.text.light,
      muted: twilight.text.lightMuted,
      soft: twilight.text.lightSoft,
    };
  }
  return {
    primary: twilight.text.dark,
    muted: twilight.text.darkMuted,
    soft: twilight.text.darkSoft,
  };
}
