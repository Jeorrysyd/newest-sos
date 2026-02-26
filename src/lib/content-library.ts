// SOS Content Library — randomized pools for each phase
// Every session draws fresh content, keeping repeat visits feeling different.

// ─── Comfort Phase ────────────────────────────────────────────────────────────

export interface ComfortMessage {
  text: string;
  audio: string;
}

export const comfortPool: ComfortMessage[] = [
  { text: "你受到了惊吓\n这不是你的错",                                          audio: "/comfort-1.m4a" },
  { text: "这种反应是你的身体在保护你\n它曾经帮过你——现在也一样",                  audio: "/comfort-2.m4a" },
  { text: "你不需要立刻明白发生了什么\n先在这里待一会儿",                          audio: "/comfort-3.m4a" },
  { text: "你现在是安全的\n这一刻是安全的",                                        audio: "/comfort-4.m4a" },
  { text: "慢慢来\n没有人在催你",                                                  audio: "/comfort-5.m4a" },
  { text: "你已经做了很难的事情\n能感受到它，本身就是勇气",                        audio: "/comfort-6.m4a" },
];

// ─── Somatic Phase ────────────────────────────────────────────────────────────

export interface SomaticIntervention {
  title: string;
  steps: string[];
  durations: number[]; // ms per step
}

export const somaticPool: SomaticIntervention[] = [
  {
    title: "温度，带你回来",
    steps: [
      "找一杯冷饮或热水，握在手心",
      "感受温度从手掌慢慢蔓延……",
      "闭上眼，专注这个感受\n你在这里",
    ],
    durations: [4000, 6000, 8000],
  },
  {
    title: "把紧张送出身体",
    steps: [
      "双肩用力往上耸，耸到最高……",
      "保持住……然后猛地放下",
      "脚趾用力抓紧地面\n感受踏实感……再慢慢松开",
    ],
    durations: [3000, 3000, 6000],
  },
  {
    title: "用眼睛，触碰当下",
    steps: [
      "找找你周围，\n有什么是蓝色的？",
      "再找找，\n有什么是圆的？",
      "你刚刚做到了\n你在这里",
    ],
    durations: [6000, 6000, 5000],
  },
];

// ─── Cognitive Phase ──────────────────────────────────────────────────────────

export interface CognitiveCard {
  title: string;
  description: string;
  audio: string;
}

export const cognitivePool: CognitiveCard[] = [
  {
    title: "你只是遇到了\n一个小坎",
    description: "不是灾难，不是终点\n你的身体带你走过了这一刻\n这本身已经很了不起了",
    audio: "/cognitive-1.m4a",
  },
  {
    title: "你的感受\n值得被温柔对待",
    description: "此刻的害怕和不安\n都是真实的，也是被允许的\n允许自己脆弱\n本身就是一种力量",
    audio: "/cognitive-2.m4a",
  },
  {
    title: "这一刻会过去\n而你会留下",
    description: "就像黎明总会到来\n这份感受也会渐渐消散\n你只需要陪伴自己\n度过这一刻",
    audio: "/cognitive-3.m4a",
  },
  {
    title: "你不是在\n小题大做",
    description: "你的神经系统检测到了威胁\n它只是在尽职地保护你\n这不是脆弱\n这是你的身体在爱你",
    audio: "/cognitive-4.m4a",
  },
  {
    title: "没有「应该」\n这回事",
    description: "你不需要「应该坚强」\n不需要「应该没事」\n你现在的感受\n就是你此刻唯一需要的真相",
    audio: "/cognitive-5.m4a",
  },
  {
    title: "你已经\n很努力了",
    description: "仅仅是打开这里\n就是你在照顾自己\n这很重要\n你值得被这样对待",
    audio: "/cognitive-6.m4a",
  },
];

// ─── Exit Phase ───────────────────────────────────────────────────────────────

export const affirmationPool: string[] = [
  "我很安全",
  "我是被爱的",
  "我已经做得很好了",
  "我的感受是真实的",
  "我值得被温柔对待",
  "我可以慢慢来",
];

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Pick `count` unique random items from an array */
export function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}
