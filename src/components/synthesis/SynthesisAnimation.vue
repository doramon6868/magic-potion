<!--
  SynthesisAnimation.vue - 合成动画组件

  合成过程中的视觉效果
  包括：旋涡旋转、粒子效果、爆发闪光
-->

<template>
  <div class="synthesis-animation" :class="phase">
    <!-- 旋涡特效 -->
    <div class="vortex-container" :style="vortexStyle">
      <div class="vortex-ring ring-1"></div>
      <div class="vortex-ring ring-2"></div>
      <div class="vortex-ring ring-3"></div>
      <div class="vortex-center"></div>
    </div>

    <!-- 粒子效果 -->
    <div v-if="phase === 'fusing'" class="particle-container">
      <div
        v-for="i in particleCount"
        :key="i"
        class="particle"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <!-- 爆发特效 -->
    <div v-if="phase === 'burst'" class="burst-container">
      <div class="flash"></div>
      <div class="shockwave"></div>
    </div>

    <!-- 结果展示 -->
    <div v-if="phase === 'result'" class="result-container">
      <transition name="pop">
        <div v-if="result" class="result-display">
          <div v-if="result.success" class="success-reveal">
            <PetAvatar :type="result.pet.type" status="happy" :size="80" />
            <div class="success-text">✨ 合成成功！ ✨</div>
          </div>
          <div v-else class="fail-display">
            <div class="fail-emoji">💨</div>
            <div class="fail-text">合成失败...</div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 阶段文字提示 -->
    <div class="phase-text">{{ phaseText }}</div>
  </div>
</template>

<script>
import PetAvatar from '../icons/PetAvatar.vue'

export default {
  name: 'SynthesisAnimation',

  components: {
    PetAvatar
  },

  props: {
    /**
     * 合成阶段
     */
    phase: {
      type: String,
      default: 'idle'
    },

    /**
     * 旋涡颜色
     */
    vortexColor: {
      type: String,
      default: '#8b5cf6'
    },

    /**
     * 合成结果
     */
    result: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      particleCount: 12
    }
  },

  computed: {
    /**
     * 旋涡样式
     */
    vortexStyle() {
      const styles = {}

      switch (this.phase) {
        case 'preparing':
          styles.transform = 'scale(1.1)'
          styles.animationDuration = '0.5s'
          break
        case 'fusing':
          styles.transform = 'scale(1.2)'
          styles.animationDuration = '0.3s'
          break
        case 'burst':
          styles.transform = 'scale(1.5)'
          styles.opacity = '0'
          break
        case 'result':
          styles.transform = 'scale(0.8)'
          styles.opacity = '0'
          break
        default:
          styles.transform = 'scale(1)'
          styles.animationDuration = '2s'
      }

      return styles
    },

    /**
     * 阶段文字
     */
    phaseText() {
      switch (this.phase) {
        case 'preparing':
          return '准备中...'
        case 'fusing':
          return '融合中...'
        case 'burst':
          return '爆发！'
        case 'result':
          return this.result?.success ? '成功！' : '失败...'
        default:
          return ''
      }
    }
  },

  methods: {
    /**
     * 获取粒子样式
     */
    getParticleStyle(index) {
      const angle = (360 / this.particleCount) * index
      const delay = index * 0.1
      const distance = 60 + Math.random() * 40

      return {
        '--angle': `${angle}deg`,
        '--distance': `${distance}px`,
        '--delay': `${delay}s`,
        background: this.vortexColor
      }
    }
  }
}
</script>

<style scoped>
/* 动画容器 */
.synthesis-animation {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 旋涡容器 */
.vortex-container {
  position: relative;
  width: 100%;
  height: 100%;
  transition: all 0.5s ease;
}

/* 旋涡环 */
.vortex-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 3px solid transparent;
  transform: translate(-50%, -50%);
}

.ring-1 {
  width: 180px;
  height: 180px;
  border-top-color: #8b5cf6;
  border-right-color: rgba(139, 92, 246, 0.5);
  animation: spin 2s linear infinite;
}

.ring-2 {
  width: 140px;
  height: 140px;
  border-bottom-color: #a78bfa;
  border-left-color: rgba(167, 139, 250, 0.5);
  animation: spin-reverse 1.5s linear infinite;
}

.ring-3 {
  width: 100px;
  height: 100px;
  border-top-color: #c4b5fd;
  border-bottom-color: rgba(196, 181, 253, 0.5);
  animation: spin 1s linear infinite;
}

/* 旋涡中心 */
.vortex-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse-glow 1s ease-in-out infinite;
}

/* 粒子容器 */
.particle-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* 粒子 */
.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: particle-orbit 2s ease-out infinite;
  animation-delay: var(--delay);
  opacity: 0;
}

/* 爆发容器 */
.burst-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* 闪光效果 */
.flash {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, white 0%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: flash 0.5s ease-out;
  border-radius: 50%;
}

/* 冲击波 */
.shockwave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: 4px solid #8b5cf6;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: shockwave 0.5s ease-out;
}

/* 结果容器 */
.result-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 结果展示 */
.result-display {
  text-align: center;
}

/* 成功展示 */
.success-reveal {
  animation: pop-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.success-text {
  font-size: 18px;
  font-weight: 700;
  color: #22c55e;
  text-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
}

/* 失败展示 */
.fail-display {
  animation: fade-in 0.5s ease-out;
}

.fail-emoji {
  font-size: 60px;
  line-height: 1;
  margin-bottom: 12px;
  opacity: 0.6;
  animation: dissipate 1s ease-out forwards;
}

.fail-text {
  font-size: 16px;
  font-weight: 600;
  color: #9ca3af;
}

/* 阶段文字 */
.phase-text {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: 600;
  color: #7c3aed;
  white-space: nowrap;
}

/* 动画定义 */
@keyframes spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes spin-reverse {
  from { transform: translate(-50%, -50%) rotate(360deg); }
  to { transform: translate(-50%, -50%) rotate(0deg); }
}

@keyframes pulse-glow {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
}

@keyframes particle-orbit {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance));
    opacity: 0;
  }
}

@keyframes flash {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
}

@keyframes shockwave {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
    border-width: 4px;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
    border-width: 0;
  }
}

@keyframes pop-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes dissipate {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}

/* 过渡动画 */
.pop-enter-active,
.pop-leave-active {
  transition: all 0.5s ease;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
