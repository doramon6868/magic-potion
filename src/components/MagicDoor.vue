<!--
  MagicDoor.vue - 液态涟漪魔法门组件

  实现梦幻液态门效果——像水滴落入水面、涟漪扩散般的魔法开门动画
  营造更加梦幻、流动的魔法感

  功能：
  1. 液态表面纹理（紫色半透明液体质感）
  2. 涟漪扩散开门动画
  3. 液态溶解/汇聚效果
  4. 水滴飞溅粒子
  5. 柔和的魔法漩涡内部
-->

<template>
  <div class="liquid-door-container">
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

    <!-- 液态表面层 -->
    <div class="liquid-surface" :class="{ 'is-opening': isOpen }">
      <!-- 液态纹理 -->
      <div class="liquid-texture"></div>
      <!-- 液态高光反射 -->
      <div class="liquid-highlight"></div>
      <!-- 流动波纹 -->
      <div class="flow-ripple ripple-1"></div>
      <div class="flow-ripple ripple-2"></div>
      <div class="flow-ripple ripple-3"></div>
    </div>

    <!-- 涟漪效果层 -->
    <div class="ripple-layer">
      <div
        v-for="i in 4"
        :key="i"
        class="ripple-ring"
        :class="{ 'is-active': isOpen }"
        :style="getRippleStyle(i)"
      ></div>
    </div>

    <!-- 水滴粒子效果 -->
    <div class="droplets-container" v-if="showDroplets">
      <div
        v-for="i in 8"
        :key="i"
        class="droplet"
        :style="getDropletStyle(i)"
      ></div>
    </div>

    <!-- 液态边缘装饰 -->
    <div class="liquid-edge" :class="{ 'is-opening': isOpen }"></div>
  </div>
</template>

<script>
/**
 * 液态涟漪魔法门组件
 * 模拟水滴落入水面的涟漪扩散效果
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
      showDroplets: false
    }
  },

  watch: {
    isOpen(newVal, oldVal) {
      // 当门从关闭变为打开时，触发水滴飞溅
      if (newVal && !oldVal) {
        this.triggerDroplets()
      }
    }
  },

  methods: {
    /**
     * 获取涟漪样式
     * 每个涟漪有不同的延迟和大小
     */
    getRippleStyle(index) {
      const delays = [0, 0.12, 0.24, 0.36]
      const sizes = [1, 1.2, 1.4, 1.6]
      return {
        animationDelay: `${delays[index - 1]}s`,
        '--scale-multiplier': sizes[index - 1]
      }
    },

    /**
     * 获取水滴样式
     * 每个水滴有不同的飞行方向和延迟
     */
    getDropletStyle(index) {
      const angle = (index - 1) * 45 // 每45度一个水滴
      const radian = (angle * Math.PI) / 180
      const distance = 60 + Math.random() * 30
      const x = Math.cos(radian) * distance
      const y = Math.sin(radian) * distance
      const delay = Math.random() * 0.1
      const size = 6 + Math.random() * 4

      return {
        '--fly-x': `${x}px`,
        '--fly-y': `${y}px`,
        '--delay': `${delay}s`,
        '--size': `${size}px`,
        width: `${size}px`,
        height: `${size}px`
      }
    },

    /**
     * 触发水滴飞溅效果
     */
    triggerDroplets() {
      this.showDroplets = true
      setTimeout(() => {
        this.showDroplets = false
      }, 800)
    }
  }
}
</script>

<style scoped>
/**
 * 液态门容器
 * 覆盖整个水晶球内部区域
 */
.liquid-door-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: visible;
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
  transform: scale(0.8);
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

/* ==================== 液态表面 ==================== */

.liquid-surface {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  clip-path: circle(50% at 50% 50%);
  transition: clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.liquid-surface.is-opening {
  /* 从中心向外溶解，开口更大 */
  clip-path: circle(0% at 50% 50%);
}

/* 液态纹理 */
.liquid-texture {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    /* 基础紫色渐变 */
    radial-gradient(ellipse at 30% 30%,
      rgba(168, 85, 247, 0.85) 0%,
      rgba(139, 92, 246, 0.75) 35%,
      rgba(124, 58, 237, 0.85) 70%,
      rgba(109, 40, 217, 0.9) 100%
    ),
    /* 液体流动纹理 */
    repeating-radial-gradient(
      circle at 50% 50%,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 3%,
      transparent 6%
    );
  animation: liquid-shimmer 3s ease-in-out infinite;
}

/* 液态高光反射 */
.liquid-highlight {
  position: absolute;
  top: 10%;
  left: 15%;
  width: 40%;
  height: 35%;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.2) 40%,
    transparent 70%
  );
  animation: highlight-shift 4s ease-in-out infinite;
  filter: blur(2px);
}

/* 流动波纹 */
.flow-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transform: translate(-50%, -50%) scale(0);
  animation: flow-expand 2s ease-out infinite;
}

.flow-ripple.ripple-1 { animation-delay: 0s; }
.flow-ripple.ripple-2 { animation-delay: 0.7s; }
.flow-ripple.ripple-3 { animation-delay: 1.4s; }

/* ==================== 涟漪效果 ==================== */

.ripple-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.ripple-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
}

.ripple-ring.is-active {
  animation: ripple-expand 0.7s ease-out forwards;
}

/* ==================== 水滴粒子 ==================== */

.droplets-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
}

.droplet {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: calc(var(--size) / -2);
  margin-left: calc(var(--size) / -2);
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(168, 85, 247, 0.8) 30%,
    rgba(139, 92, 246, 0.6) 60%,
    transparent 100%
  );
  box-shadow:
    inset -2px -2px 4px rgba(0, 0, 0, 0.2),
    0 0 10px rgba(168, 85, 247, 0.5);
  animation: droplet-fly 0.6s ease-out forwards;
  animation-delay: var(--delay);
}

/* ==================== 液态边缘 ==================== */

.liquid-edge {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  border: 2px solid rgba(168, 85, 247, 0.5);
  box-shadow:
    0 0 15px rgba(168, 85, 247, 0.3),
    inset 0 0 15px rgba(168, 85, 247, 0.2);
  transition: all 0.5s ease;
}

.liquid-edge.is-opening {
  border-color: rgba(251, 191, 36, 0.6);
  box-shadow:
    0 0 30px rgba(251, 191, 36, 0.5),
    0 0 50px rgba(168, 85, 247, 0.3);
}

/* ==================== 动画定义 ==================== */

/* 液态微光动画 */
@keyframes liquid-shimmer {
  0%, 100% {
    filter: blur(0.5px) brightness(1);
    transform: scale(1);
  }
  50% {
    filter: blur(0.8px) brightness(1.1);
    transform: scale(1.02);
  }
}

/* 高光偏移动画 */
@keyframes highlight-shift {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(5%, 3%) scale(1.1);
    opacity: 0.8;
  }
}

/* 流动扩展动画 */
@keyframes flow-expand {
  0% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0.6;
    border-width: 2px;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
    border-width: 0;
  }
}

/* 涟漪扩散动画 */
@keyframes ripple-expand {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0.7;
    border-width: 3px;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    transform: translate(-50%, -50%) scale(calc(2.5 * var(--scale-multiplier, 1)));
    opacity: 0;
    border-width: 0;
  }
}

/* 水滴飞溅动画 */
@keyframes droplet-fly {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  70% {
    opacity: 0.8;
  }
  100% {
    transform: translate(var(--fly-x), var(--fly-y)) scale(0.3);
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
