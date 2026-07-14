<!--
  TopBar.vue - 顶部功能栏组件（手绘卷轴横幅版）

  这个组件显示在屏幕顶部，包含游戏的主要功能入口：
  1. 存档按钮 - 打开存档管理器
  2. 语言切换 - 切换游戏语言
  3. 游戏标题
  4. 金钱显示 - 显示当前拥有的金币
  5. 商店按钮 - 打开商店弹窗
-->

<template>
  <div class="top-bar-scroll">
    <!-- 左侧卷轴端 -->
    <div class="scroll-end left"></div>

    <!-- 中间横幅 -->
    <div class="scroll-banner">
      <div class="left-section">
        <button class="magic-btn save-btn" @click="openSaveManager">
          <span class="btn-icon">💾</span>
          <span class="btn-text">{{ $t('ui.save') }}</span>
        </button>
        <LanguageSwitcher />
        <div class="game-title">
          <span class="title-icon">✨</span>
          <span class="title-text">Magic Potion</span>
        </div>
      </div>

      <div class="money-display">
        <CoinBagIcon class="money-icon" />
        <span class="money-amount">{{ gameStore.money }}</span>
      </div>

      <button class="magic-btn shop-btn" @click="$emit('open-shop')">
        <span class="btn-icon">🏪</span>
        <span class="btn-text">{{ $t('ui.shop') }}</span>
      </button>
    </div>

    <!-- 右侧卷轴端 -->
    <div class="scroll-end right"></div>
  </div>
</template>

<script>
// ==================== 导入依赖 ====================
import { mapStores } from 'pinia'
import { useGameStore } from '../stores/game.js'
import LanguageSwitcher from './LanguageSwitcher.vue'
import CoinBagIcon from './icons/ui/CoinBagIcon.vue'

export default {
  // 组件名称
  name: 'TopBar',

  // 注册子组件
  components: {
    LanguageSwitcher,
    CoinBagIcon
  },

  /**
   * emits: 声明组件会触发的事件
   * 这是 Vue 3 的最佳实践，让代码更清晰
   */
  emits: [
    /**
     * open-shop: 打开商店
     * 当用户点击商店按钮时触发
     */
    'open-shop',
    /**
     * open-save-manager: 打开存档管理器
     * 当用户点击存档按钮时触发
     */
    'open-save-manager'
  ],

  methods: {
    /**
     * openSaveManager: 打开存档管理器
     * 触发父组件的事件
     */
    openSaveManager() {
      this.$emit('open-save-manager')
    }
  },

  /**
   * computed: 计算属性
   */
  computed: {
    /**
     * 将 gameStore 映射到组件
     * 这样就可以用 this.gameStore 访问状态
     */
    ...mapStores(useGameStore)
  }
}
</script>

<style scoped>
.top-bar-scroll {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.scroll-end {
  width: 24px;
  height: 70px;
  background: linear-gradient(180deg, var(--mp-purple-light) 0%, var(--mp-purple) 100%);
  border: 3px solid var(--mp-ink);
  flex-shrink: 0;
}

.scroll-end.left {
  border-radius: 12px 0 0 12px;
  border-right: none;
}

.scroll-end.right {
  border-radius: 0 12px 12px 0;
  border-left: none;
}

.scroll-banner {
  flex: 1;
  max-width: 900px;
  height: 70px;
  background: linear-gradient(180deg, var(--mp-purple-soft) 0%, var(--mp-bg) 100%);
  border-top: 3px solid var(--mp-ink);
  border-bottom: 3px solid var(--mp-ink);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 4px 0 var(--mp-shadow-color);
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.magic-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  background: var(--mp-white);
  border: 3px solid var(--mp-ink);
  border-radius: var(--mp-radius-full);
  cursor: pointer;
  box-shadow: var(--mp-shadow);
  transition: all var(--mp-duration-fast) ease;
}

.magic-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--mp-shadow-hover);
}

.magic-btn:active {
  transform: translateY(0);
  box-shadow: 1px 1px 0 var(--mp-shadow-color);
}

.btn-icon {
  font-size: 20px;
}

.btn-text {
  font-size: 11px;
  font-weight: 700;
  color: var(--mp-ink);
}

.game-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 24px;
  animation: sparkle 2s ease-in-out infinite;
}

.title-text {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--mp-purple), var(--mp-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.money-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: var(--mp-gold-light);
  border: 3px solid var(--mp-ink);
  border-radius: var(--mp-radius-full);
  box-shadow: var(--mp-shadow);
}

.money-icon {
  width: 28px;
  height: 28px;
  animation: coin-shine 2s ease-in-out infinite;
}

.money-amount {
  font-size: 20px;
  font-weight: 800;
  color: var(--mp-ink);
  font-family: 'Courier New', monospace;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(10deg); }
}

@keyframes coin-shine {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(15deg) scale(1.1); }
}
</style>
