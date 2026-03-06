# SOS 心理急救 App — Claude Code 操作指南

> 情绪急救移动端 Web App，6 阶段自我调节协议。Last updated: 2026-03-02

## 启动

```bash
cd ~/sos-project
npm run dev
# → http://localhost:8080
```

## 项目概述

一个"恐慌按钮"式的心理急救 App。用户按下 SOS 按钮后，引导完成 6 个阶段的情绪调节：接纳 → 安慰 → 呼吸 → 认知重构 → 身体着陆 → 退出仪式。全程中文语音引导，移动端优先（桌面显示手机框架）。

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 (SWC), port 8080 |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix) |
| Animation | Framer Motion 12 |
| Routing | React Router DOM v6 |
| Backend | Supabase (scaffolded但未使用，无表) |
| Origin | Lovable.dev (AI 生成，同步 git) |

## 架构：阶段状态机

```
entry → comfort → stabilize → cognitive → somatic → exit → (restart)
```

核心文件: `src/pages/Index.tsx` — 线性状态机，`AnimatePresence mode="wait"` 驱动过渡。

### 音频架构（双轨）
- **BGM 轨道**: 循环环境音乐，15% 音量，用户手势启动（iOS autoplay 策略）
- **旁白轨道**: 每次一个 `.m4a`，`usePhaseAudio` hook 管理播放+间隔+回调
- 音频完成驱动阶段推进（非固定计时器）
- `safeEnd` 模式防止 `onended + onerror` 双触发

### 设计系统："静海"
- 6 个阶段渐变：从深色 `#0c1418`（入口/痛苦）到浅色 `#e0f0f0`（退出/平静）
- 阶段 0-3 白色文字，阶段 4-5 深色文字
- 字体: Noto Serif SC, weight 200/300
- 强调色: `#7ab8b8`（青色）

## 项目结构

```
sos-project/
├── src/
│   ├── main.tsx                    # React 入口
│   ├── pages/
│   │   ├── Index.tsx               # 核心：阶段状态机编排器
│   │   └── Playground.tsx          # 开发工具：过渡效果预览
│   ├── components/
│   │   ├── AudioManager.tsx        # AudioProvider context + MuteButton
│   │   ├── PhoneFrame.tsx          # 桌面端手机框架
│   │   ├── SOSButton.tsx           # "我需要帮助" 大按钮
│   │   ├── BreathingRing.tsx       # 呼吸动画环
│   │   ├── HaloEffect.tsx          # 光标跟随极光球
│   │   ├── SoftOrb.tsx             # 柔和光球背景
│   │   └── phases/
│   │       ├── EntryPhase.tsx      # "你还好吗?" → SOS → "我接住你了"
│   │       ├── ComfortPhase.tsx    # 2 条随机安慰语 + 音频
│   │       ├── StabilizePhase.tsx  # 4-4-6 呼吸，3 个循环
│   │       ├── CognitivePhase.tsx  # 3 张随机认知重构卡 + 音频
│   │       ├── SomaticPhase.tsx    # 1 个随机身体干预（⚠️ 无音频）
│   │       └── ExitPhase.tsx       # 蝴蝶拍 + 3 条肯定语 + 告别
│   ├── hooks/
│   │   ├── usePhaseAudio.ts        # 音频播放 hook（核心）
│   │   └── useNarration.ts         # Web Speech TTS（备用）
│   ├── lib/
│   │   ├── content-library.ts      # 所有文案 + 音频文件名池
│   │   ├── design-tokens.ts        # 静海设计系统
│   │   └── utils.ts                # clsx/twMerge
│   └── integrations/supabase/      # 自动生成，空 schema
├── public/                         # 所有 .m4a 音频文件
│   ├── bgm.mp3
│   ├── comfort-1~6.m4a
│   ├── stabilize-*.m4a
│   ├── cognitive-1~6.m4a + cognitive-bridge.m4a
│   └── exit-*.m4a
├── .lovable/plan.md                # 活跃 spec：soft-scale + blur 过渡
├── docs/claude-workflow-lessons.md # 开发经验教训
└── narration-script.md             # 完整旁白脚本
```

## 各阶段详情

| 阶段 | 行为 | 音频 |
|------|------|------|
| Entry | "你还好吗?" → SOSButton → "我接住你了" → 3s 自动推进 | BGM 启动 |
| Comfort | 2 条随机安慰语依次显示+朗读 | comfort-N.m4a |
| Stabilize | 介绍 → 3x (4s 吸气, 4s 屏息, 6s 呼气) → 完成 | stabilize-*.m4a |
| Cognitive | 3 张卡片（右滑入），然后过渡文案 | cognitive-N.m4a |
| Somatic | 1 个随机练习：标题(3s) + 计时步骤 | ⚠️ 无音频（纯计时器） |
| Exit | intro → 蝴蝶拍准备 → 蝴蝶拍 → 3 条肯定语 → 告别+重启 | exit-*.m4a |

## Git 状态

- 分支: `main`
- 远程: 2 commits ahead of `origin/main`（未推送）
- 未暂存修改: `CognitivePhase.tsx`, `ComfortPhase.tsx`, `ExitPhase.tsx`, `StabilizePhase.tsx`
- 未追踪: `.claude/`, `bgm.mp3`, `docs/`

## 已知问题

1. **4 个 phase 文件有未提交修改** — 可能是 `.lovable/plan.md` 中 soft-scale 过渡的进行中工作
2. **SomaticPhase 无音频** — 唯一使用 setTimeout 而非 .m4a 驱动的阶段
3. **TransitionPhase.tsx 未使用** — 存在但未导入
4. **Supabase 空 schema** — 已配置客户端但无表，运行时未使用

## 关键经验教训（来自 docs/claude-workflow-lessons.md）

1. **Framer Motion v12**: `onAnimationComplete` 只在使用 **命名 variants** 时接收 `"animate"` 字符串；内联对象传递对象而非字符串，导致 `=== "animate"` 永远失败
2. **TypeScript 接口同步**: 添加新参数时必须同步更新 `AudioContextType` interface
3. **音频内容验证**: 文件名正确不代表内容正确，需对照旁白脚本逐一验证
4. **safeEnd 模式**: `let fired = false` 守卫防止 `onended + onerror` 双执行
5. **AnimatePresence `mode="wait"`**: 必须设置，防止两个阶段同时可见/可听

## .env

```
VITE_SUPABASE_PROJECT_ID="ostwonzfyqzbgkqbwrot"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJ..."
VITE_SUPABASE_URL="https://ostwonzfyqzbgkqbwrot.supabase.co"
```
