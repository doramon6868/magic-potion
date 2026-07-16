<template>
  <div
    class="pet-avatar"
    :class="[statusClass, typeClass]"
    :style="containerStyle"
  >
    <svg
      class="pet-svg"
      viewBox="0 0 120 120"
      role="img"
      :aria-label="ariaLabel"
    >
      <!-- ==================== 身体 + 类型特征 ==================== -->
      <g class="body-features">
        <!-- 小紫 · 蛞蝓猫 -->
        <g v-if="type === 'cat'">
          <ellipse cx="60" cy="75" rx="46" ry="36" class="body-cat" />
          <path d="M28 52 Q24 24 42 42" class="feature-cat" />
          <path d="M92 52 Q96 24 78 42" class="feature-cat" />
          <path d="M102 78 Q118 72 112 88 Q108 96 100 88" class="feature-cat" />
        </g>

        <!-- 青鸟 · 风羽鸟 -->
        <g v-else-if="type === 'bird'">
          <ellipse cx="60" cy="74" rx="40" ry="34" class="body-bird" />
          <path d="M24 68 Q12 48 32 58 Q36 64 28 70" class="feature-bird-wing" />
          <path d="M96 68 Q108 48 88 58 Q84 64 92 70" class="feature-bird-wing" />
          <path d="M50 42 Q52 28 58 40" class="feature-bird" />
          <path d="M60 40 Q62 22 68 40" class="feature-bird" />
          <path d="M70 42 Q72 28 78 44" class="feature-bird" />
        </g>

        <!-- 赤狐 · 焰尾狐 -->
        <g v-else-if="type === 'fox'">
          <ellipse cx="60" cy="74" rx="42" ry="36" class="body-fox" />
          <path d="M28 52 Q22 22 44 42" class="feature-fox" />
          <path d="M92 52 Q98 22 76 42" class="feature-fox" />
          <path d="M30 44 L26 32 L38 40 Z" class="feature-fox-inner" />
          <path d="M90 44 L94 32 L82 40 Z" class="feature-fox-inner" />
          <path
            d="M98 78 Q116 68 110 52 Q118 58 112 72 Q122 78 108 90 Q100 94 98 78"
            class="feature-fox-tail"
          />
        </g>

        <!-- 晶晶 · 晶石龙 -->
        <g v-else-if="type === 'dragon'">
          <ellipse cx="60" cy="74" rx="44" ry="38" class="body-dragon" />
          <path d="M36 48 Q32 22 44 42" class="feature-dragon-horn" />
          <path d="M84 48 Q88 22 76 42" class="feature-dragon-horn" />
          <path d="M20 70 Q8 50 28 60 Q32 66 24 72" class="feature-dragon-wing" />
          <path d="M100 70 Q112 50 92 60 Q88 66 96 72" class="feature-dragon-wing" />
          <path d="M40 42 L48 30 L56 42" class="feature-dragon-crystal" />
          <path d="M54 38 L60 26 L66 38" class="feature-dragon-crystal" />
          <path d="M64 42 L72 30 L80 42" class="feature-dragon-crystal" />
        </g>

        <!-- 安全兜底：未知类型按猫渲染 -->
        <g v-else>
          <ellipse cx="60" cy="75" rx="46" ry="36" class="body-cat" />
          <path d="M28 52 Q24 24 42 42" class="feature-cat" />
          <path d="M92 52 Q96 24 78 42" class="feature-cat" />
        </g>
      </g>

      <!-- ==================== 通用五官 ==================== -->
      <g class="face">
        <!-- 眼睛：开心 / 睡觉 / 进食（享受眯眼） -->
        <g v-if="['happy', 'sleeping', 'eating'].includes(status)">
          <path d="M38 64 Q44 69 50 64" class="face-stroke" />
          <path d="M62 64 Q68 69 74 64" class="face-stroke" />
        </g>

        <!-- 眼睛：难过 -->
        <g v-else-if="status === 'sad'">
          <circle cx="44" cy="64" r="5" class="face-fill" />
          <circle cx="76" cy="64" r="5" class="face-fill" />
          <circle cx="46" cy="62" r="1.5" fill="white" />
          <circle cx="78" cy="62" r="1.5" fill="white" />
          <path d="M40 74 Q44 80 48 74" class="tear" />
          <path d="M72 74 Q76 80 80 74" class="tear" />
        </g>

        <!-- 眼睛：疲惫（半睁） -->
        <g v-else-if="status === 'tired'">
          <circle cx="44" cy="64" r="5" class="face-fill" />
          <circle cx="76" cy="64" r="5" class="face-fill" />
          <circle cx="46" cy="62" r="1.5" fill="white" />
          <circle cx="78" cy="62" r="1.5" fill="white" />
          <path d="M38 64 Q44 60 50 64" class="face-stroke" />
          <path d="M62 64 Q68 60 74 64" class="face-stroke" />
        </g>

        <!-- 眼睛：狩猎（锐利斜眼） -->
        <g v-else-if="status === 'hunting'">
          <path d="M40 62 L48 66" class="face-stroke-thick" />
          <path d="M72 62 L80 66" class="face-stroke-thick" />
        </g>

        <!-- 眼睛：玩耍（睁大圆眼） -->
        <g v-else-if="status === 'playing'">
          <circle cx="44" cy="64" r="6" class="face-fill" />
          <circle cx="76" cy="64" r="6" class="face-fill" />
          <circle cx="47" cy="61" r="2" fill="white" />
          <circle cx="79" cy="61" r="2" fill="white" />
        </g>

        <!-- 眼睛：死亡 / 默认兜底（idle 用下面的正常眼） -->
        <g v-else-if="status === 'dead'">
          <path d="M40 60 L48 68" class="face-stroke-thick" />
          <path d="M48 60 L40 68" class="face-stroke-thick" />
          <path d="M72 60 L80 68" class="face-stroke-thick" />
          <path d="M80 60 L72 68" class="face-stroke-thick" />
        </g>

        <!-- 眼睛：idle / 默认 -->
        <g v-else>
          <circle cx="44" cy="64" r="5" class="face-fill" />
          <circle cx="76" cy="64" r="5" class="face-fill" />
          <circle cx="46" cy="62" r="1.5" fill="white" />
          <circle cx="78" cy="62" r="1.5" fill="white" />
        </g>

        <!-- 嘴巴：鸟喙 -->
        <g v-if="type === 'bird'">
          <path
            v-if="status === 'sleeping' || status === 'tired'"
            d="M58 78 L62 78"
            class="face-stroke"
          />
          <path
            v-else
            d="M58 76 L62 76 L60 80 Z"
            class="beak"
          />
        </g>

        <!-- 嘴巴：猫 / 狐 / 龙 -->
        <g v-else>
          <path
            v-if="status === 'happy' || status === 'playing'"
            d="M52 80 Q60 90 68 80"
            class="face-stroke"
          />
          <path
            v-else-if="status === 'sad' || status === 'tired'"
            d="M54 86 Q60 80 66 86"
            class="face-stroke"
          />
          <path
            v-else-if="status === 'hunting'"
            d="M56 84 L64 84"
            class="face-stroke"
          />
          <path
            v-else-if="status === 'eating'"
            d="M56 82 Q60 86 64 82"
            class="face-stroke"
          />
          <path
            v-else-if="status === 'sleeping'"
            d="M60 84 L60 84"
            class="face-stroke-dot"
          />
          <path
            v-else
            d="M54 82 Q60 86 66 82"
            class="face-stroke"
          />
        </g>

        <!-- 腮红：开心 / 玩耍 / 进食 -->
        <g v-if="['happy', 'playing', 'eating'].includes(status)">
          <circle cx="32" cy="76" r="4" class="blush" />
          <circle cx="88" cy="76" r="4" class="blush" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'PetAvatar',

  props: {
    /**
     * 宠物类型
     */
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['cat', 'bird', 'fox', 'dragon'].includes(value)
      }
    },

    /**
     * 宠物状态
     */
    status: {
      type: String,
      default: 'idle',
      validator(value) {
        return ['idle', 'happy', 'sleeping', 'sad', 'tired', 'hunting', 'playing', 'eating', 'dead'].includes(value)
      }
    },

    /**
     * 渲染尺寸（px）
     */
    size: {
      type: Number,
      default: 64
    }
  },

  computed: {
    /**
     * 外层容器样式
     */
    containerStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      }
    },

    /**
     * 状态 CSS 类
     */
    statusClass() {
      return `status-${this.status}`
    },

    /**
     * 类型 CSS 类
     */
    typeClass() {
      return `type-${this.type}`
    },

    /**
     * 无障碍标签
     */
    ariaLabel() {
      return `${this.type}宠物头像，状态${this.status}`
    }
  },

  data() {
    return {}
  },

  methods: {}
}
</script>

<style scoped>
.pet-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.pet-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 描边统一用深色 */
.face-stroke,
.face-stroke-thick,
.face-stroke-dot {
  fill: none;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-linecap: round;
}

.face-stroke {
  stroke-width: 3;
}

.face-stroke-thick {
  stroke-width: 3.5;
}

.face-stroke-dot {
  stroke-width: 3;
}

.face-fill {
  fill: var(--mp-ink, #4a4a4a);
}

.tear {
  fill: var(--mp-blue, #60a5fa);
}

.blush {
  fill: var(--mp-pink, #ff9ecd);
  opacity: 0.6;
}

.beak {
  fill: #ffb347;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 2;
  stroke-linejoin: round;
}

/* 身体填充 - 使用全局设计 Token */
.body-cat,
.feature-cat {
  fill: var(--mp-pet-cat, #c8f0d8);
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 3;
  stroke-linejoin: round;
}

.body-bird,
.feature-bird {
  fill: var(--mp-pet-bird, #a8e6f0);
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 3;
  stroke-linecap: round;
}

.feature-bird-wing {
  fill: #b8e8f0;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 3;
  stroke-linejoin: round;
}

.body-fox,
.feature-fox {
  fill: var(--mp-pet-fox, #ffd4a8);
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 3;
  stroke-linejoin: round;
}

.feature-fox-inner {
  fill: #ffe4d6;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 2;
}

.feature-fox-tail {
  fill: #ff6b4a;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 2.5;
  stroke-linejoin: round;
}

.body-dragon,
.feature-dragon-horn {
  fill: var(--mp-pet-dragon, #e8d8f0);
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 3;
  stroke-linejoin: round;
}

.feature-dragon-wing {
  fill: #c8a8e0;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 3;
  stroke-linejoin: round;
}

.feature-dragon-crystal {
  fill: #a855f7;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 2;
  stroke-linejoin: round;
}

/* 状态动画 */
.status-idle .pet-svg {
  animation: breathe 3s ease-in-out infinite;
}

.status-happy .pet-svg {
  animation: happy-bounce 0.6s ease-in-out infinite;
}

.status-sleeping .pet-svg {
  animation: sway 3s ease-in-out infinite;
}

.status-sad .pet-svg {
  animation: shiver 2s ease-in-out infinite;
}

.status-tired .pet-svg {
  animation: breathe 2.5s ease-in-out infinite;
}

.status-hunting .pet-svg {
  animation: shake-fast 0.2s ease-in-out infinite;
}

.status-playing .pet-svg {
  animation: wiggle 0.3s ease-in-out infinite;
}

.status-eating .pet-svg {
  animation: chew 0.25s ease-in-out infinite;
}

.status-dead .pet-svg {
  animation: none;
  transform: rotate(90deg);
  opacity: 0.6;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03) translateY(1px); }
}

@keyframes happy-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-8px) scale(1.06); }
}

@keyframes sway {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

@keyframes shiver {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

@keyframes shake-fast {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}

@keyframes chew {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05) translateY(-2px); }
}
</style>
