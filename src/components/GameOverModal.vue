<!--
  GameOverModal.vue - 游戏结束弹窗

  当宠物死亡时弹出的全屏面板
  提供重新开始功能，若背包有复活药水也可直接复活
-->

<template>
  <!-- 全屏遮罩 -->
  <div
    v-if="showModel"
    class="game-over-overlay"
    @click.self="handleOverlayClick"
  >
    <!-- 游戏结束面板 -->
    <div class="game-over-board">
      <!-- 标题 -->
      <div class="game-over-header">
        <span class="skull">💀</span>
        <h2 class="game-over-title">{{ $t('gameOver.title') }}</h2>
        <span class="skull">💀</span>
      </div>

      <!-- 宠物展示 -->
      <div class="pet-reveal">
        <div class="pet-avatar-container">
          <PetAvatar
            :type="petConfig?.type || 'cat'"
            status="dead"
            :size="80"
          />
          <div class="pet-glow"></div>
        </div>
        <div class="pet-name">{{ gameStore.pet.name }}</div>
      </div>

      <!-- 说明文字 -->
      <p class="game-over-message">{{ $t('gameOver.message') }}</p>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <!-- 使用复活药水（仅当背包有时显示） -->
        <button
          v-if="revivePotion"
          class="btn-revive"
          @click="handleRevive"
        >
          <span class="btn-icon">🧪</span>
          {{ $t('gameOver.revive') }}
        </button>

        <!-- 重新开始 -->
        <button
          class="btn-restart"
          @click="handleRestart"
        >
          <span class="btn-icon">🔄</span>
          {{ $t('gameOver.restart') }}
        </button>
      </div>

      <!-- 无复活药水提示 -->
      <p v-if="!revivePotion" class="no-revive-hint">
        {{ $t('gameOver.noReviveHint') }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useGameStore } from '../stores/game.js'
import { useBackpackStore } from '../stores/backpack.js'
import { useSaveStore } from '../stores/save.js'
import { usePetCollectionStore } from '../stores/petCollection.js'
import PetAvatar from './icons/PetAvatar.vue'

export default {
  name: 'GameOverModal',

  components: {
    PetAvatar
  },

  props: {
    /**
     * show: 是否显示弹窗
     */
    show: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:show'],

  computed: {
    ...mapStores(useGameStore, useBackpackStore, useSaveStore, usePetCollectionStore),

    /**
     * showModel: 双向绑定显示状态
     */
    showModel: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update:show', value)
      }
    },

    /**
     * petConfig: 当前宠物配置
     */
    petConfig() {
      const petType = this.petCollectionStore.activePet?.petType || 'cat'
      return this.petCollectionStore.activePetConfig || { type: petType }
    },

    /**
     * revivePotion: 背包中的复活药水
     */
    revivePotion() {
      return this.backpackStore.items.find(item => item.key === 'revive_potion') || null
    }
  },

  methods: {
    /**
     * handleOverlayClick: 点击遮罩时不关闭
     * 游戏结束必须让玩家做出选择
     */
    handleOverlayClick() {
      // 什么都不做，强制玩家点击按钮
    },

    /**
     * handleRestart: 重新开始游戏
     */
    handleRestart() {
      this.saveStore.restartGame()
      this.showModel = false
    },

    /**
     * handleRevive: 使用复活药水
     */
    handleRevive() {
      if (!this.revivePotion) return

      const success = this.gameStore.useRevivePotion(this.revivePotion)
      if (success) {
        this.showModel = false
      }
    }
  }
}
</script>

<style scoped>
/* 全屏遮罩 */
.game-over-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: fade-in 0.3s ease;
  backdrop-filter: blur(6px);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 游戏结束面板 */
.game-over-board {
  position: relative;
  width: min(480px, 90vw);
  padding: 36px 28px;
  border-radius: var(--mp-radius-lg);
  background: linear-gradient(
    135deg,
    var(--mp-purple-soft) 0%,
    var(--mp-white) 100%
  );
  border: 4px solid var(--mp-purple);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.35),
    6px 6px 0 var(--mp-shadow-color);
  text-align: center;
  animation: slide-up 0.4s var(--mp-ease-bounce);
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

/* 标题区域 */
.game-over-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.skull {
  font-size: 28px;
  animation: pulse 1.5s ease-in-out infinite;
}

.game-over-title {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  color: var(--mp-red);
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
  letter-spacing: 2px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

/* 宠物展示 */
.pet-reveal {
  margin-bottom: 20px;
}

.pet-avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}

.pet-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 140px;
  height: 140px;
  background: radial-gradient(
    circle,
    rgba(139, 92, 246, 0.25) 0%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  border-radius: 50%;
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.15); }
}

.pet-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--mp-purple-dark);
}

/* 说明文字 */
.game-over-message {
  font-size: 16px;
  color: var(--mp-text);
  margin-bottom: 28px;
  line-height: 1.6;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.btn-restart,
.btn-revive {
  width: 100%;
  max-width: 280px;
  padding: 14px 24px;
  border: none;
  border-radius: var(--mp-radius-md);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: var(--mp-shadow);
}

.btn-restart {
  background: linear-gradient(
    135deg,
    var(--mp-purple) 0%,
    var(--mp-purple-dark) 100%
  );
  color: var(--mp-white);
}

.btn-restart:hover {
  transform: translateY(-2px);
  box-shadow: var(--mp-shadow-hover);
}

.btn-revive {
  background: linear-gradient(
    135deg,
    var(--mp-mint) 0%,
    var(--mp-mint-light) 100%
  );
  color: var(--mp-ink);
}

.btn-revive:hover {
  transform: translateY(-2px);
  box-shadow: var(--mp-shadow-hover);
}

.btn-icon {
  font-size: 18px;
}

/* 无复活药水提示 */
.no-revive-hint {
  margin-top: 16px;
  font-size: 13px;
  color: var(--mp-text-muted);
}

/* 响应式 */
@media (max-width: 480px) {
  .game-over-board {
    padding: 28px 20px;
  }

  .game-over-title {
    font-size: 26px;
  }

  .game-over-message {
    font-size: 14px;
  }
}
</style>
