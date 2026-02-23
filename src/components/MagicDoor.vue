<!--
  MagicDoor.vue - 水膜魔法门组件

  实现可爱的水膜分开闭合效果——像水做的窗帘从中间向两边拉开
  两侧形成波浪翻滚，关门时波浪向中间汇聚
  营造更加可爱、活泼的魔法感

  功能：
  1. 左右两半水膜结构
  2. 水膜从中间向两侧分开（开门）
  3. 水膜从两侧向中间闭合（关门）
  4. 两侧波浪边缘滚动动画
  5. 水花飞溅效果（💧 emoji）
  6. 弹性回弹动画
-->

<template>
  <div class="water-membrane-container">
    <!-- 内部魔法空间（开门后显示） -->
    <div class="inner-magic-space" :class="{ 'is-visible': isOpen }">
      <!-- 柔和漩涡层 -->
      <div class="soft-vortex vortex-1"></div>
      <div class="soft-vortex vortex-2"></div>
      <div class="soft-vortex vortex-3"></div>
      <!-- 发光核心 -->
      <div class="glow-core"></div>
      <!-- 漂浮粒子 -->
      <div class="float-particles">
        <div v-for="i in 8" :key="i" class="float-particle" :class="`particle-${i}`"></div>
      </div>
    </div>

    <!-- 左侧水膜 -->
    <div class="water-half left-half" :class="{ 'is-open': isOpen }">
      <div class="water-texture"></div>
      <div class="water-highlight"></div>
      <!-- 波浪边缘 -->
      <div class="wave-edge left-wave">
        <div class="wave-blob blob-1"></div>
        <div class="wave-blob blob-2"></div>
        <div class="wave-blob blob-3"></div>
      </div>
    </div>

    <!-- 右侧水膜 -->
    <div class="water-half right-half" :class="{ 'is-open': isOpen }">
      <div class="water-texture"></div>
      <div class="water-highlight"></div>
      <!-- 波浪边缘 -->
      <div class="wave-edge right-wave">
        <div class="wave-blob blob-1"></div>
        <div class="wave-blob blob-2"></div>
        <div class="wave-blob blob-3"></div>
      </div>
    </div>

    <!-- 水花飞溅效果 -->
    <div class="splash-drops" v-if="showDrops">
      <span
        v-for="i in 8"
        :key="i"
        class="drop-emoji"
        :style="getDropStyle(i)"
      >💧</span>
    </div>

    <!-- 水膜边缘光晕 -->
    <div class="membrane-glow" :class="{ 'is-open': isOpen }"></div>
  </div>
</template>

<script>
/**
 * 水膜魔法门组件
 * 模拟水膜从中间向两侧分开/闭合的效果
 */
export default {
  name: 'MagicDoor',

  props: {
    /**
     * 是否打开门
     */
    isOpen: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      showDrops: false
    }
  },

  watch: {
    isOpen(newVal, oldVal) {
      // 当门状态改变时，触发水花飞溅
      if (newVal !== oldVal) {
        this.triggerSplash()
      }
    }
  },

  methods: {
    /**
     * 获取水花样式
     * 每个水花有不同的飞行方向和延迟
     */
    getDropStyle(index) {
      // 左侧水花（1-4）向右上方飞溅，右侧水花（5-8）向左上方飞溅
      const isLeft = index <= 4
      const baseAngle = isLeft ? -45 : -135 // 右侧向上或左侧向上
      const angleVariation = (Math.random() - 0.5) * 60 // ±30度随机
      const angle = baseAngle + angleVariation
      const radian = (angle * Math.PI) / 180
      const distance = 50 + Math.random() * 40
      const x = Math.cos(radian) * distance
      const y = Math.sin(radian) * distance
      const delay = Math.random() * 0.15
      const scale = 0.8 + Math.random() * 0.6

      return {
        '--fly-x': `${x}px`,
        '--fly-y': `${y}px`,
        '--delay': `${delay}s`,
        '--scale': scale,
        left: isLeft ? '30%' : '70%',
        top: '50%'
      }
    },

    /**
     * 触发水花飞溅效果
     */
    triggerSplash() {
      this.showDrops = true
      setTimeout(() => {
        this.showDrops = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
/**
 * 水膜容器
 * 覆盖整个水晶球内部区域
 */
.water-membrane-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

/* ==================== 内部魔法空间 ==================== */

.inner-magic-space {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.85);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  background: radial-gradient(
    circle at center,
    rgba(168, 85, 247, 0.3) 0%,
    rgba(139, 92, 246, 0.2) 50%,
    transparent 100%
  );
}

.inner-magic-space.is-visible {
  opacity: 1;
  transform: scale(1);
}

/* 柔和漩涡层 */
.soft-vortex {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.vortex-1 {
  width: 200%;
  height: 200%;
  background: repeating-conic-gradient(
    from 0deg,
    rgba(168, 85, 247, 0.3) 0deg,
    rgba(168, 85, 247, 0.3) 10deg,
    transparent 10deg,
    transparent 20deg
  );
  animation: gentle-rotate 4s linear infinite;
  filter: blur(1px);
}

.vortex-2 {
  width: 150%;
  height: 150%;
  background: repeating-conic-gradient(
    from 0deg,
    rgba(216, 180, 254, 0.4) 0deg,
    rgba(216, 180, 254, 0.4) 15deg,
    transparent 15deg,
    transparent 30deg
  );
  animation: gentle-rotate-reverse 3s linear infinite;
  filter: blur(0.5px);
}

.vortex-3 {
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(
    from 0deg,
    rgba(251, 191, 36, 0.3) 0deg,
    rgba(251, 191, 36, 0.3) 20deg,
    transparent 20deg,
    transparent 40deg
  );
  animation: gentle-rotate 2s linear infinite;
}

/* 发光核心 */
.glow-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin-top: -20px;
  margin-left: -20px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(251, 191, 36, 0.7) 30%,
    rgba(168, 85, 247, 0.5) 60%,
    transparent 100%
  );
  box-shadow:
    0 0 20px rgba(251, 191, 36, 0.6),
    0 0 40px rgba(168, 85, 247, 0.4);
  animation: gentle-pulse 2s ease-in-out infinite alternate;
}

/* 漂浮粒子 */
.float-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.float-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  margin-top: -3px;
  margin-left: -3px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: float 3s ease-in-out infinite;
}

.particle-1 { transform: translate(0, -45px); animation-delay: 0s; }
.particle-2 { transform: translate(32px, -32px); animation-delay: 0.4s; width: 4px; height: 4px; }
.particle-3 { transform: translate(45px, 0); animation-delay: 0.8s; width: 5px; height: 5px; }
.particle-4 { transform: translate(32px, 32px); animation-delay: 1.2s; width: 4px; height: 4px; }
.particle-5 { transform: translate(0, 45px); animation-delay: 1.6s; }
.particle-6 { transform: translate(-32px, 32px); animation-delay: 2s; width: 4px; height: 4px; }
.particle-7 { transform: translate(-45px, 0); animation-delay: 2.4s; width: 5px; height: 5px; }
.particle-8 { transform: translate(-32px, -32px); animation-delay: 2.8s; width: 4px; height: 4px; }

/* ==================== 水膜结构 ==================== */

.water-half {
  position: absolute;
  top: 0;
  width: 55%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 左侧水膜 */
.left-half {
  left: 0;
  border-radius: 100px 0 0 100px;
  transform: translateX(0);
}

.left-half.is-open {
  transform: translateX(-55%);
}

/* 右侧水膜 */
.right-half {
  right: 0;
  border-radius: 0 100px 100px 0;
  transform: translateX(0);
}

.right-half.is-open {
  transform: translateX(55%);
}

/* ==================== 水膜纹理 ==================== */

.water-texture {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background:
    /* 基础紫色渐变 */
    radial-gradient(ellipse at 30% 30%,
      rgba(200, 160, 255, 0.85) 0%,
      rgba(168, 85, 247, 0.75) 35%,
      rgba(139, 92, 246, 0.8) 70%,
      rgba(124, 58, 237, 0.9) 100%
    ),
    /* 液体流动纹理 */
    repeating-radial-gradient(
      circle at 50% 50%,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 3%,
      transparent 6%
    );
  animation: water-shimmer 2.5s ease-in-out infinite;
  backdrop-filter: blur(2px);
}

.left-half .water-texture {
  left: 0;
  border-radius: 100px 0 0 100px;
}

.right-half .water-texture {
  right: 0;
  border-radius: 0 100px 100px 0;
}

/* 水膜高光 */
.water-highlight {
  position: absolute;
  width: 50%;
  height: 40%;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.2) 40%,
    transparent 70%
  );
  animation: highlight-move 3s ease-in-out infinite;
  filter: blur(3px);
}

.left-half .water-highlight {
  top: 15%;
  left: 20%;
}

.right-half .water-highlight {
  top: 25%;
  right: 20%;
  animation-delay: 1.5s;
}

/* ==================== 波浪边缘 ==================== */

.wave-edge {
  position: absolute;
  top: 0;
  width: 30px;
  height: 100%;
  overflow: visible;
}

.left-wave {
  right: -15px;
}

.right-wave {
  left: -15px;
}

/* 波浪 Blob */
.wave-blob {
  position: absolute;
  border-radius: 50%;
  background:
    radial-gradient(ellipse at center,
      rgba(200, 160, 255, 0.9) 0%,
      rgba(168, 85, 247, 0.7) 50%,
      rgba(139, 92, 246, 0.5) 100%
    );
  filter: blur(2px);
}

/* 左侧波浪 */
.left-wave .wave-blob {
  right: 0;
}

.left-wave .blob-1 {
  width: 45px;
  height: 65px;
  top: 8%;
  animation: wave-flow-1 1.8s ease-in-out infinite;
}

.left-wave .blob-2 {
  width: 50px;
  height: 75px;
  top: 33%;
  animation: wave-flow-2 2s ease-in-out infinite;
  animation-delay: 0.3s;
}

.left-wave .blob-3 {
  width: 45px;
  height: 65px;
  top: 62%;
  animation: wave-flow-1 1.9s ease-in-out infinite;
  animation-delay: 0.6s;
}

/* 右侧波浪 */
.right-wave .wave-blob {
  left: 0;
}

.right-wave .blob-1 {
  width: 45px;
  height: 65px;
  top: 12%;
  animation: wave-flow-1 1.9s ease-in-out infinite;
  animation-delay: 0.4s;
}

.right-wave .blob-2 {
  width: 50px;
  height: 75px;
  top: 38%;
  animation: wave-flow-2 2.1s ease-in-out infinite;
  animation-delay: 0.7s;
}

.right-wave .blob-3 {
  width: 45px;
  height: 65px;
  top: 67%;
  animation: wave-flow-1 1.8s ease-in-out infinite;
  animation-delay: 0.2s;
}

/* ==================== 水花飞溅 ==================== */

.splash-drops {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.drop-emoji {
  position: absolute;
  font-size: 18px;
  opacity: 0;
  transform: scale(0);
  animation: splash-fly 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  animation-delay: var(--delay);
  filter: drop-shadow(0 2px 4px rgba(168, 85, 247, 0.5));
}

/* ==================== 边缘光晕 ==================== */

.membrane-glow {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  border: 2px solid rgba(168, 85, 247, 0.4);
  box-shadow:
    0 0 15px rgba(168, 85, 247, 0.3),
    inset 0 0 15px rgba(168, 85, 247, 0.2);
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: none;
}

.membrane-glow.is-open {
  border-color: rgba(251, 191, 36, 0.5);
  box-shadow:
    0 0 25px rgba(251, 191, 36, 0.4),
    0 0 40px rgba(168, 85, 247, 0.3);
}

/* ==================== 动画定义 ==================== */

/* 水膜微光动画 */
@keyframes water-shimmer {
  0%, 100% {
    filter: brightness(1) saturate(1);
    transform: scale(1);
  }
  50% {
    filter: brightness(1.1) saturate(1.05);
    transform: scale(1.01);
  }
}

/* 高光移动动画 */
@keyframes highlight-move {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(5%, 5%) scale(1.1);
    opacity: 0.9;
  }
}

/* 波浪流动动画 1 */
@keyframes wave-flow-1 {
  0%, 100% {
    transform: scaleX(1) scaleY(1) translateX(0);
    opacity: 0.8;
  }
  50% {
    transform: scaleX(1.6) scaleY(1.25) translateX(8px);
    opacity: 1;
  }
}

/* 波浪流动动画 2 */
@keyframes wave-flow-2 {
  0%, 100% {
    transform: scaleX(1) scaleY(1) translateX(0);
    opacity: 0.7;
  }
  50% {
    transform: scaleX(1.5) scaleY(1.3) translateX(-8px);
    opacity: 0.95;
  }
}

/* 水花飞溅动画 */
@keyframes splash-fly {
  0% {
    transform: translate(0, 0) scale(0) rotate(0deg);
    opacity: 1;
  }
  30% {
    transform: translate(calc(var(--fly-x) * 0.5), calc(var(--fly-y) * 0.5)) scale(var(--scale)) rotate(180deg);
    opacity: 1;
  }
  70% {
    transform: translate(var(--fly-x), var(--fly-y)) scale(calc(var(--scale) * 0.9)) rotate(360deg);
    opacity: 0.7;
  }
  100% {
    transform: translate(var(--fly-x), calc(var(--fly-y) + 30px)) scale(0.5) rotate(450deg);
    opacity: 0;
  }
}

/* 柔和旋转 */
@keyframes gentle-rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes gentle-rotate-reverse {
  from { transform: translate(-50%, -50%) rotate(360deg); }
  to { transform: translate(-50%, -50%) rotate(0deg); }
}

/* 柔和脉动 */
@keyframes gentle-pulse {
  from {
    transform: scale(0.9);
    opacity: 0.7;
  }
  to {
    transform: scale(1.1);
    opacity: 1;
  }
}

/* 漂浮动画 */
@keyframes float {
  0%, 100% {
    transform: translate(var(--twinkle-x, 0), var(--twinkle-y, -45px)) scale(0.8);
    opacity: 0.4;
  }
  50% {
    transform: translate(var(--twinkle-x, 0), calc(var(--twinkle-y, -45px) - 5px)) scale(1.2);
    opacity: 1;
  }
}
</style>
