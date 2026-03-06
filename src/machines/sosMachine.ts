import { setup, assign } from 'xstate';
import {
  comfortPool,
  cognitivePool,
  somaticPool,
  pickRandom,
  type ComfortMessage,
  type CognitiveCard,
  type SomaticIntervention,
} from '@/lib/content-library';

// ============================================
// Types
// ============================================

export interface SOSContext {
  /** Current sub-step index within a phase */
  stepIndex: number;
  /** Breathing: current round (0-based) */
  breathRound: number;
  /** Breathing: current step */
  breathStep: 'inhale' | 'hold' | 'exhale';
  /** Randomly selected comfort messages for this session */
  comfortMessages: ComfortMessage[];
  /** Randomly selected cognitive cards for this session */
  cognitiveCards: CognitiveCard[];
  /** Randomly selected somatic intervention for this session */
  somaticIntervention: SomaticIntervention | null;
  /** Whether we're in the cognitive bridge screen */
  cognitiveBridging: boolean;
  /** Exit phase: current affirm index */
  affirmIndex: number;
}

export type SOSEvent =
  | { type: 'SOS_PRESSED' }
  | { type: 'ANIMATION_DONE' }
  | { type: 'AUDIO_ENDED' }
  | { type: 'GAP_ELAPSED' }
  | { type: 'BREATH_TICK' }
  | { type: 'TIMER_DONE' }
  | { type: 'ENTRY_MESSAGE_DONE' }
  | { type: 'RESTART' };

// ============================================
// Audio map — centralized, matches actual file paths in public/
// ============================================

export const AUDIO_MAP = {
  stabilize: {
    intro:  '/stabilize-intro.m4a',
    inhale: '/stabilize-inhale.m4a',
    hold:   '/stabilize-hold.m4a',
    exhale: '/stabilize-exhale.m4a',
    done:   '/stabilize-done.m4a',
  },
  exit: {
    intro:         '/exit-intro.m4a',
    butterflyPrep: '/exit-butterfly-prep.m4a',
    butterfly:     '/exit-butterfly.m4a',
    affirm: ['/exit-affirm-1.m4a', '/exit-affirm-2.m4a', '/exit-affirm-3.m4a'],
  },
  cognitiveBridge: '/cognitive-bridge.m4a',
} as const;

// ============================================
// Breathing config
// ============================================

export const BREATH_CONFIG = {
  inhale: { durationMs: 4000, label: '吸气' },
  hold:   { durationMs: 4000, label: '屏住呼吸' },
  exhale: { durationMs: 6000, label: '呼气' },
  totalRounds: 3,
} as const;

// ============================================
// Exit phase affirmations (fixed order)
// ============================================

export const EXIT_AFFIRMATIONS = [
  '我很安全',
  '我是被爱的',
  '我已经做得很好了',
];

// ============================================
// State machine
// ============================================

export const sosMachine = setup({
  types: {
    context: {} as SOSContext,
    events: {} as SOSEvent,
  },
  actions: {
    resetStep: assign({ stepIndex: 0 }),
    nextStep: assign({ stepIndex: ({ context }) => context.stepIndex + 1 }),
    resetBreath: assign({ breathRound: 0, breathStep: 'inhale' as const }),
    nextBreathStep: assign(({ context }) => {
      const order: Array<'inhale' | 'hold' | 'exhale'> = ['inhale', 'hold', 'exhale'];
      const currentIdx = order.indexOf(context.breathStep);
      if (currentIdx < 2) {
        return { breathStep: order[currentIdx + 1] };
      }
      return { breathStep: 'inhale' as const, breathRound: context.breathRound + 1 };
    }),
    enterCognitiveBridge: assign({ cognitiveBridging: true }),
    resetAffirm: assign({ affirmIndex: 0 }),
    nextAffirm: assign({ affirmIndex: ({ context }) => context.affirmIndex + 1 }),
    randomizeContent: assign({
      comfortMessages: () => pickRandom(comfortPool, 2),
      cognitiveCards: () => pickRandom(cognitivePool, 3),
      somaticIntervention: () => pickRandom(somaticPool, 1)[0],
    }),
  },
  guards: {
    hasMoreComfortMessages: ({ context }) => {
      return context.stepIndex < context.comfortMessages.length - 1;
    },
    hasMoreCognitiveCards: ({ context }) => {
      return context.stepIndex < context.cognitiveCards.length - 1;
    },
    hasMoreBreathRounds: ({ context }) => {
      // Check if we still have rounds left after advancing
      const order: Array<'inhale' | 'hold' | 'exhale'> = ['inhale', 'hold', 'exhale'];
      const currentIdx = order.indexOf(context.breathStep);
      if (currentIdx < 2) {
        // Still within a round
        return true;
      }
      // End of a round — check if next round exists
      return context.breathRound + 1 < BREATH_CONFIG.totalRounds;
    },
    hasMoreSomaticSteps: ({ context }) => {
      if (!context.somaticIntervention) return false;
      return context.stepIndex < context.somaticIntervention.steps.length - 1;
    },
    hasMoreAffirmations: ({ context }) => {
      return context.affirmIndex < EXIT_AFFIRMATIONS.length - 1;
    },
  },
}).createMachine({
  id: 'sos',
  initial: 'idle',
  context: {
    stepIndex: 0,
    breathRound: 0,
    breathStep: 'inhale',
    comfortMessages: [],
    cognitiveCards: [],
    somaticIntervention: null,
    cognitiveBridging: false,
    affirmIndex: 0,
  },

  states: {
    // ========================================
    // Idle — waiting for user to press SOS
    // ========================================
    idle: {
      on: {
        SOS_PRESSED: {
          target: 'entry',
          actions: 'randomizeContent',
        },
      },
    },

    // ========================================
    // Entry — "我接住你了" message, then auto-advance
    // ========================================
    entry: {
      initial: 'message',
      states: {
        message: {
          // Component shows "我接住你了", waits 3s, sends ENTRY_MESSAGE_DONE
          on: { ENTRY_MESSAGE_DONE: 'done' },
        },
        done: { type: 'final' as const },
      },
      onDone: '#sos.comfort',
    },

    // ========================================
    // Comfort — audio-driven, 2 random messages
    // ========================================
    comfort: {
      initial: 'entering',
      entry: 'resetStep',
      states: {
        entering: {
          on: { ANIMATION_DONE: 'playing' },
        },
        playing: {
          on: { AUDIO_ENDED: 'gap' },
        },
        gap: {
          on: {
            GAP_ELAPSED: [
              {
                guard: 'hasMoreComfortMessages',
                target: 'nextMessage',
                actions: 'nextStep',
              },
              { target: 'done' },
            ],
          },
        },
        nextMessage: {
          on: { ANIMATION_DONE: 'playing' },
        },
        done: { type: 'final' as const },
      },
      onDone: '#sos.stabilize',
    },

    // ========================================
    // Stabilize — breathing: timer-driven + fire-and-forget audio
    // ========================================
    stabilize: {
      initial: 'entering',
      entry: ['resetStep', 'resetBreath'],
      states: {
        entering: {
          on: { ANIMATION_DONE: 'intro' },
        },
        intro: {
          on: { AUDIO_ENDED: 'breathing' },
        },
        breathing: {
          on: {
            BREATH_TICK: [
              {
                guard: 'hasMoreBreathRounds',
                target: 'breathing',
                actions: 'nextBreathStep',
                reenter: true,
              },
              { target: 'outro', actions: 'nextBreathStep' },
            ],
          },
        },
        outro: {
          // Show "呼吸，帮了你" text, play audio after animation
          on: { AUDIO_ENDED: 'done' },
        },
        done: { type: 'final' as const },
      },
      onDone: '#sos.cognitive',
    },

    // ========================================
    // Cognitive — 3 random cards + bridge text
    // ========================================
    cognitive: {
      initial: 'entering',
      entry: 'resetStep',
      states: {
        entering: {
          on: { ANIMATION_DONE: 'playing' },
        },
        playing: {
          on: { AUDIO_ENDED: 'gap' },
        },
        gap: {
          on: {
            GAP_ELAPSED: [
              {
                guard: 'hasMoreCognitiveCards',
                target: 'nextCard',
                actions: 'nextStep',
              },
              { target: 'bridge', actions: 'enterCognitiveBridge' },
            ],
          },
        },
        nextCard: {
          on: { ANIMATION_DONE: 'playing' },
        },
        bridge: {
          // Bridge text animates in, plays bridge audio
          on: { ANIMATION_DONE: 'bridgePlaying' },
        },
        bridgePlaying: {
          on: { AUDIO_ENDED: 'bridgeGap' },
        },
        bridgeGap: {
          on: { GAP_ELAPSED: 'done' },
        },
        done: { type: 'final' as const },
      },
      onDone: '#sos.somatic',
    },

    // ========================================
    // Somatic — timer-driven, no audio
    // ========================================
    somatic: {
      initial: 'entering',
      entry: 'resetStep',
      states: {
        entering: {
          on: { ANIMATION_DONE: 'title' },
        },
        title: {
          // Show title for 3s
          on: { TIMER_DONE: 'active' },
        },
        active: {
          // Walk through steps with timers
          on: {
            TIMER_DONE: [
              {
                guard: 'hasMoreSomaticSteps',
                target: 'active',
                actions: 'nextStep',
                reenter: true,
              },
              { target: 'done' },
            ],
          },
        },
        done: { type: 'final' as const },
      },
      onDone: '#sos.exit',
    },

    // ========================================
    // Exit — audio-driven, multi-stage
    // ========================================
    exit: {
      initial: 'entering',
      entry: 'resetAffirm',
      states: {
        entering: {
          on: { ANIMATION_DONE: 'intro' },
        },
        intro: {
          // "很好 / 你刚才照顾了自己的身体"
          on: { AUDIO_ENDED: 'butterflyPrep' },
        },
        butterflyPrep: {
          on: { ANIMATION_DONE: 'butterflyPrepPlaying' },
        },
        butterflyPrepPlaying: {
          on: { AUDIO_ENDED: 'butterfly' },
        },
        butterfly: {
          on: { ANIMATION_DONE: 'butterflyPlaying' },
        },
        butterflyPlaying: {
          on: { AUDIO_ENDED: 'affirm' },
        },
        affirm: {
          on: { ANIMATION_DONE: 'affirmPlaying' },
        },
        affirmPlaying: {
          on: { AUDIO_ENDED: 'affirmGap' },
        },
        affirmGap: {
          on: {
            GAP_ELAPSED: [
              {
                guard: 'hasMoreAffirmations',
                target: 'affirm',
                actions: 'nextAffirm',
              },
              { target: 'farewell' },
            ],
          },
        },
        farewell: {
          // Show farewell + restart button
          on: { RESTART: '#sos.idle' },
        },
      },
    },
  },
});
