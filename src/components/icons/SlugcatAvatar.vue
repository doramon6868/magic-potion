<template>
  <div class="slugcat-avatar" :class="[status, `type-${petType}`]" :style="avatarStyle">
    <svg viewBox="0 0 100 90" class="slugcat-svg" role="img" aria-label="Pet avatar">
      <!-- 身体 -->
      <ellipse cx="50" cy="55" rx="42" ry="32" class="body" />

      <!-- 蜗牛壳 -->
      <g class="shell">
        <circle cx="35" cy="48" r="18" />
        <path d="M25 48 Q35 38 45 48 Q35 58 25 48" fill="none" stroke-width="2" />
        <path d="M28 42 Q35 35 42 42" fill="none" stroke-width="2" />
      </g>

      <!-- 猫耳朵 -->
      <path d="M28 28 L22 12 L38 22 Z" class="ear left" />
      <path d="M72 28 L78 12 L62 22 Z" class="ear right" />

      <!-- 眼睛 -->
      <g class="eyes">
        <circle cx="38" cy="42" r="5" class="eye" />
        <circle cx="62" cy="42" r="5" class="eye" />
        <!-- 状态表情覆盖 -->
        <g v-if="status === 'sleeping' || status === 'happy'" class="closed-eyes">
          <path d="M33 42 Q38 47 43 42" fill="none" stroke-width="3" stroke-linecap="round" />
          <path d="M57 42 Q62 47 67 42" fill="none" stroke-width="3" stroke-linecap="round" />
        </g>
        <g v-if="status === 'sad'">
          <circle cx="38" cy="50" r="2" class="tear" />
          <circle cx="62" cy="50" r="2" class="tear" />
        </g>
      </g>

      <!-- 嘴巴 -->
      <path v-if="status === 'happy' || status === 'playing'" d="M42 58 Q50 66 58 58" fill="none" stroke-width="3" stroke-linecap="round" class="mouth smile" />
      <path v-else-if="status === 'sad' || status === 'tired'" d="M44 62 Q50 56 56 62" fill="none" stroke-width="3" stroke-linecap="round" class="mouth frown" />
      <ellipse v-else cx="50" cy="60" rx="4" ry="3" class="mouth neutral" />

      <!-- 腮红 -->
      <circle v-if="status === 'happy' || status === 'playing'" cx="28" cy="52" r="4" class="blush" />
      <circle v-if="status === 'happy' || status === 'playing'" cx="72" cy="52" r="4" class="blush" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'SlugcatAvatar',

  props: {
    status: {
      type: String,
      default: 'idle'
    },
    petType: {
      type: String,
      default: 'cat'
    },
    size: {
      type: Number,
      default: 100
    }
  },

  computed: {
    avatarStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size * 0.9}px`
      }
    }
  }
}
</script>

<style scoped>
.slugcat-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;

  /* 宠物类型配色变量，避免硬编码散落在选择器中 */
  --pet-cat-color: var(--mp-mint-light, #c8f0d8);
  --pet-bird-color: var(--mp-blue, #a8e6f0);
  --pet-fox-color: #ffd4a8;
  --pet-dragon-color: #e8d8f0;
  --pet-shell-fill: rgba(255, 255, 255, 0.4);
}

.slugcat-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 身体描边 */
.body {
  fill: var(--body-color, var(--pet-cat-color));
  stroke: var(--mp-ink);
  stroke-width: 3;
}

/* 壳 */
.shell circle {
  fill: var(--pet-shell-fill);
  stroke: var(--mp-ink);
  stroke-width: 2.5;
}

.shell path {
  stroke: var(--mp-ink);
}

/* 耳朵 */
.ear {
  fill: var(--body-color, var(--pet-cat-color));
  stroke: var(--mp-ink);
  stroke-width: 3;
  transform-origin: bottom center;
}

/* 眼睛 */
.eye {
  fill: var(--mp-ink);
}

.closed-eyes path {
  stroke: var(--mp-ink);
}

.tear {
  fill: var(--mp-blue);
}

/* 嘴巴 */
.mouth {
  stroke: var(--mp-ink);
}

.mouth.neutral {
  fill: var(--mp-ink);
}

.blush {
  fill: var(--mp-pink);
  opacity: 0.5;
}

/* 类型配色 */
.type-cat { --body-color: var(--pet-cat-color); }
.type-bird { --body-color: var(--pet-bird-color); }
.type-fox { --body-color: var(--pet-fox-color); }
.type-dragon { --body-color: var(--pet-dragon-color); }

/* 状态动画 */
.sleeping .slugcat-svg {
  animation: sway 3s ease-in-out infinite;
}

.happy .slugcat-svg {
  animation: happy-bounce 0.6s ease-in-out infinite;
}

.playing .slugcat-svg {
  animation: wiggle 0.3s ease-in-out infinite;
}

.hunting .slugcat-svg {
  animation: shake 0.2s ease-in-out infinite;
}

.tired .slugcat-svg {
  animation: breathe 2.5s ease-in-out infinite;
}

.sad .slugcat-svg {
  animation: shiver 2s ease-in-out infinite;
}

.dead .slugcat-svg {
  animation: none;
  transform: rotate(90deg);
  opacity: 0.6;
}

@keyframes sway {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

@keyframes happy-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.95) translateY(3px); }
}

@keyframes shiver {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}
</style>
