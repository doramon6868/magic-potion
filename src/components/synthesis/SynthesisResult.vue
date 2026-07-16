<!--
  SynthesisResult.vue - 合成结果组件

  合成成功后显示新宠物信息
  合成失败后显示安慰信息和保底进度
-->

<template>
  <div class="synthesis-result-overlay" @click.self="close">
    <div class="result-modal" :class="{ success: isSuccess, fail: !isSuccess }">
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="close">×</button>

      <!-- 成功结果 -->
      <template v-if="isSuccess">
        <div class="result-header success-header">
          <div class="sparkle">✨</div>
          <h2 class="result-title">合成成功！</h2>
          <div class="sparkle">✨</div>
        </div>

        <div class="pet-reveal">
          <div class="pet-emoji-container">
            <PetAvatar :type="result.pet.type" status="happy" :size="64" />
            <div class="pet-glow"></div>
          </div>

          <div class="pet-name">{{ result.pet.name }}</div>
          <div class="pet-welcome">欢迎加入魔法世界！</div>
        </div>

        <div v-if="result.pet.passiveSkill" class="passive-skill">
          <div class="skill-title">🌟 被动技能：{{ result.pet.passiveSkill.name }}</div>
          <div class="skill-desc">{{ result.pet.passiveSkill.description }}</div>
        </div>

        <div class="action-buttons">
          <button class="btn-primary" @click="viewCollection">
            📖 查看图鉴
          </button>
          <button class="btn-secondary" @click="close">
            继续游戏
          </button>
        </div>
      </template>

      <!-- 失败结果 -->
      <template v-else>
        <div class="result-header fail-header">
          <div class="fail-icon">💨</div>
          <h2 class="result-title">合成失败（练习中）</h2>
        </div>

        <div class="fail-content">
          <p class="fail-message">魔法能量不足，召唤失败了...</p>
          <p class="fail-hint">但是别气馁！下次一定会成功的！💪</p>

          <div class="materials-return">
            <div class="return-title">📝 材料处理</div>
            <div class="return-item kept">
              <span class="return-icon">🐱</span>
              <span class="return-text">碎片已保留（不消耗）</span>
            </div>
            <div class="return-item consumed">
              <span class="return-icon">🧪</span>
              <span class="return-text">药水已消耗</span>
            </div>
          </div>

          <div v-if="result.pityMessage" class="pity-progress">
            <div class="pity-title">🎯 保底进度</div>
            <div class="pity-bar">
              <div
                class="pity-fill"
                :style="{ width: pityPercentage + '%' }"
              ></div>
            </div>
            <div class="pity-text">{{ result.pityMessage }}</div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-primary" @click="retry">
            🔄 再试一次
          </button>
          <button class="btn-secondary" @click="close">
            稍后再试
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import PetAvatar from '../icons/PetAvatar.vue'

export default {
  name: 'SynthesisResult',

  components: {
    PetAvatar
  },

  props: {
    /**
     * 合成结果数据
     */
    result: {
      type: Object,
      required: true
    },

    /**
     * 当前配方的保底阈值
     */
    pityThreshold: {
      type: Number,
      default: 3
    }
  },

  computed: {
    /**
     * 是否成功
     */
    isSuccess() {
      return this.result?.success === true
    },

    /**
     * 保底百分比
     */
    pityPercentage() {
      if (!this.result?.failCount) return 0
      return Math.min(100, (this.result.failCount % this.pityThreshold) / this.pityThreshold * 100)
    }
  },

  methods: {
    /**
     * 关闭结果
     */
    close() {
      this.$emit('close')
    },

    /**
     * 重试
     */
    retry() {
      this.$emit('retry')
    },

    /**
     * 查看图鉴
     */
    viewCollection() {
      this.$emit('viewCollection')
    }
  }
}
</script>

<style scoped>
/* 遮罩层 */
.synthesis-result-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fade-in 0.3s ease;
  backdrop-filter: blur(4px);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 模态框 */
.result-modal {
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 32px;
  max-width: 380px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-modal.success {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 3px solid #86efac;
}

.result-modal.fail {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 3px solid #fecaca;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  color: #666;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

/* 头部 */
.result-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.success-header {
  color: #16a34a;
}

.fail-header {
  color: #dc2626;
  flex-direction: column;
  gap: 8px;
}

.sparkle {
  font-size: 24px;
  animation: sparkle 1.5s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.fail-icon {
  font-size: 48px;
  opacity: 0.6;
}

.result-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

/* 宠物展示 */
.pet-reveal {
  text-align: center;
  margin-bottom: 24px;
}

.pet-emoji-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.pet-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
}

.pet-name {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.pet-welcome {
  font-size: 14px;
  color: #6b7280;
}

/* 被动技能 */
.passive-skill {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: center;
}

.skill-title {
  font-size: 14px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 4px;
}

.skill-desc {
  font-size: 13px;
  color: #b45309;
}

/* 失败内容 */
.fail-content {
  text-align: center;
  margin-bottom: 24px;
}

.fail-message {
  font-size: 16px;
  color: #7f1d1d;
  margin-bottom: 8px;
}

.fail-hint {
  font-size: 14px;
  color: #991b1b;
  font-weight: 500;
}

/* 材料返还 */
.materials-return {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 16px;
  margin: 20px 0;
}

.return-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.return-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.return-item:last-child {
  margin-bottom: 0;
}

.return-item.kept {
  background: #dcfce7;
}

.return-item.consumed {
  background: #fee2e2;
}

.return-icon {
  font-size: 20px;
}

.return-text {
  font-size: 13px;
  color: #374151;
}

/* 保底进度 */
.pity-progress {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}

.pity-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.pity-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.pity-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.pity-text {
  font-size: 12px;
  color: #6b7280;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
}

.btn-secondary:hover {
  background: #e5e7eb;
}
</style>
