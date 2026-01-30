
## 目标
把当前“整页 opacity 淡入淡出”（Index.tsx 里 `transition-opacity` + `isTransitioning`）替换成更自然的“柔和缩放”过渡：轻微缩放 + 透明度 + 轻微模糊（可选），让各阶段衔接更顺滑、少突兀。

你已选择：**柔和缩放**。

---

## 现状诊断（为什么不自然）
- `src/pages/Index.tsx` 通过 `isTransitioning` 先把整页 `opacity-0`，300ms 后硬切换 phase，再恢复 `opacity`。
- 这种方式会产生：
  1) “先黑一下/空一下再出现”的断层感（尤其背景从浅色到深色时更明显）
  2) 与各 Phase 内部自己用 framer-motion 的动画叠加时，容易出现双重淡入淡出，显得“飘”或“闪”。

---

## 方案概述（将怎么改）
### A. 用 Framer Motion 做“跨阶段的页面过渡”（主改动）
在 `Index.tsx` 用 `AnimatePresence` + `motion.div` 包裹当前阶段页面，让阶段切换时：
- 旧页面：轻微放大一点点 + 透明度降低（可带轻微模糊）
- 新页面：从轻微缩小 + 模糊进入，到清晰稳定

这会形成“连贯的呼吸感”而不是“突然变暗再切”。

### B. 移除旧的 `isTransitioning`/`transition-opacity` 机制（避免冲突）
- 删除 `isTransitioning` state
- 删除 `transitionTo` 中的 `setTimeout(300)`
- 直接 `setCurrentPhase(nextPhase)`，交由 `AnimatePresence` 的 exit/enter 动画接管过渡时序

### C. 清理与全局过渡冲突的局部淡入淡出（必要的微调）
- 目前 `EntryPhase` / `ExitPhase` 使用了 `animate-fade-in-up`（CSS keyframe）。
- 当我们有统一的“页面切换动效”后，这类“页面级”淡入建议移除或降级，否则会出现“双重入场”，显得不自然。
- 保留“组件内部”动效（例如 Cognitive 卡片切换、TransitionPhase 内部扩散等），只处理“整页级”的入场类动画。

---

## 具体实现步骤（文件级）
### 1) `src/pages/Index.tsx`
- 用以下结构替换当前包裹层：
  - `AnimatePresence mode="wait"`（保证先退出再进入，避免两页同时叠加造成脏感；如果你更想要“交叉叠加”的丝滑感，可改 `mode="sync"`，我会在实现时留成可配置常量）
  - `motion.div key={currentPhase}` 包住实际 phase 组件
- 定义统一的 transition variants（柔和缩放）：
  - `initial`: `{ opacity: 0, scale: 0.985, filter: "blur(6px)" }`
  - `animate`: `{ opacity: 1, scale: 1, filter: "blur(0px)" }`
  - `exit`: `{ opacity: 0, scale: 1.015, filter: "blur(6px)" }`
- transition 参数（更“柔”）：
  - `duration: 0.55~0.75`
  - `ease: [0.22, 1, 0.36, 1]`（类似 easeOutCubic 的体感）
- 为性能与稳定性：
  - 给 motion 容器加 `style={{ willChange: "opacity, transform, filter" }}`
  - 保持 `min-h-screen`、`overflow-hidden` 的布局不变

### 2) `src/components/phases/EntryPhase.tsx` 与 `src/components/phases/ExitPhase.tsx`
- 移除或替换 `animate-fade-in-up`（因为全局过渡已经负责“进场”）
- 保留页面内容布局不变（文字、按钮、圆形卡片等不动）

### 3)（可选）统一“切换时长”参数
- 把“阶段过渡时长”抽成常量，例如 `const PHASE_TRANSITION_MS = 650`
- 之后如果你觉得“还快/还慢”，只改一处就能影响全局

---

## 视觉/交互验收标准（你怎么判断改对了）
1) 从 Entry 点击 SOS 进入 Transition：不再出现“突然淡黑/突然消失”，而是柔和缩放过渡
2) Transition 自动进入 Comfort：Transition 的内部扩散动画结束后，页面切换仍保持顺滑（不突兀）
3) Comfort → Stabilize → Cognitive → Exit：每次切换都像“镜头轻推/轻收”，无闪烁
4) 移动端（390x844）检查：切换时不卡顿、不掉帧（模糊 filter 在低端机如果吃性能，我们会在后续迭代里提供“弱化 blur / 关闭 blur”的降级开关）

---

## 风险与备选
- 风险：`filter: blur()` 在部分移动设备上可能更耗性能。
  - 备选：保留 scale + opacity，blur 降为 0~3px，或完全去掉 blur。
- `AnimatePresence mode="wait"` 会让切换更“干净”，但会有极短的“先退出再进入”的感觉。
  - 备选：改 `mode="sync"` 实现轻微交叉叠加，更丝滑但可能有两页同时存在的视觉叠影（尤其背景差异大时）。

---

## 我将修改的文件清单
- `src/pages/Index.tsx`（核心：替换淡入淡出机制为 Framer Motion 过渡）
- `src/components/phases/EntryPhase.tsx`（移除整页级 animate-fade-in-up）
- `src/components/phases/ExitPhase.tsx`（移除整页级 animate-fade-in-up）
（通常不需要动 `src/index.css`；CSS 的 fade keyframes 可以保留给局部组件使用，但不会再作为“页面切换”的主方式。）

---

## 完成后你需要做的测试（端到端）
- 从 `/` 开始完整走一遍：Entry → Transition → Comfort → Stabilize → Cognitive → Exit → Restart
- 重点看每一次 phase 切换边界是否还有“闪一下/断一下”的感觉，尤其是浅色↔深色的切换边界
