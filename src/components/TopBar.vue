<!--
  TopBar.vue - 顶部功能栏组件

  这个组件显示在屏幕顶部，包含游戏的主要功能入口：
  1. 背包按钮 - 打开背包弹窗
  2. 金钱显示 - 显示当前拥有的金币
  3. 商店按钮 - 打开商店弹窗

  这个组件还负责触发弹窗的打开事件
-->

<template>
  <!--
    顶部栏容器
    使用 flex 布局让三个元素水平排列
  -->
  <div class="top-bar">

    <!-- ==================== 左侧：游戏标题 ==================== -->
    <div class="game-title">
      <span class="title-icon">✨</span>
      <span class="title-text">Magic Potion</span>
    </div>

    <!-- ==================== 中间：金钱显示 ==================== -->
    <div class="money-display">
      <!-- 金币图标 -->
      <span class="money-icon">💰</span>
      <!-- 金额数字 -->
      <span class="money-amount">{{ gameStore.money }}</span>
    </div>

    <!-- ==================== 右侧：商店按钮 ==================== -->
    <div
      class="top-button shop-button"
      @click="$emit('open-shop')"
    >
      <!-- 商店图标 -->
      <span class="button-icon">🏪</span>
      <!-- 按钮文字 -->
      <span class="button-text">商店</span>
    </div>

  </div>
</template>

<script>
// ==================== 导入依赖 ====================
import { mapStores } from 'pinia'
import { useGameStore } from '../stores/game.js'

export default {
  // 组件名称
  name: 'TopBar',

  /**
   * emits: 声明组件会触发的事件
   * 这是 Vue 3 的最佳实践，让代码更清晰
   */
  emits: [
    /**
     * open-shop: 打开商店
     * 当用户点击商店按钮时触发
     */
    'open-shop'
  ],

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
/**
 * 顶部栏样式
 */

/* 顶部栏容器 */
.top-bar {
  /* 使用 flex 布局 */
  display: flex;
  /* 子元素垂直居中 */
  align-items: center;
  /* 子元素均匀分布，首尾对齐 */
  justify-content: space-between;
  /* 内边距 */
  padding: 15px 30px;
  /**
   * 背景 - 半透明黑色
   * 让顶部栏在背景上更突出
   */
  background: rgba(0, 0, 0, 0.4);
  /* 圆角 */
  border-radius: 15px;
  /* 底部边距 */
  margin-bottom: 20px;
  /* 内阴影 */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* ==================== 按钮样式 ==================== */

/* 按钮基础样式 */
.top-button {
  /* 使用 flex 垂直排列图标和文字 */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 鼠标手型 */
  cursor: pointer;
  /* 内边距 */
  padding: 10px 20px;
  /* 圆角 */
  border-radius: 10px;
  /* 过渡动画 */
  transition: all 0.3s ease;
}

/* 按钮悬停效果 */
.top-button:hover {
  /* 背景变亮 */
  background: rgba(155, 89, 182, 0.3);
  /* 向上移动一点 */
  transform: translateY(-2px);
  /* 阴影 */
  box-shadow: 0 5px 15px rgba(155, 89, 182, 0.4);
}

/* 按钮点击效果 */
.top-button:active {
  /* 向下移动 */
  transform: translateY(0);
}

/* 按钮图标 */
.button-icon {
  /* 图标大小 */
  font-size: 28px;
  /* 下边距 */
  margin-bottom: 5px;
  /* 阴影 */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* 按钮文字 */
.button-text {
  /* 文字大小 */
  font-size: 14px;
  /* 颜色 */
  color: white;
  /* 字重 */
  font-weight: 500;
  /* 阴影 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* ==================== 金钱显示样式 ==================== */

/* 金钱显示容器 */
.money-display {
  /* 使用 flex 水平排列 */
  display: flex;
  align-items: center;
  /* 背景 */
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 193, 7, 0.2));
  /* 边框 */
  border: 2px solid rgba(255, 215, 0, 0.5);
  /* 圆角 */
  border-radius: 25px;
  /* 内边距 */
  padding: 10px 25px;
  /* 阴影 */
  box-shadow:
    0 4px 15px rgba(255, 215, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* 金币图标 */
.money-icon {
  /* 图标大小 */
  font-size: 24px;
  /* 右边距 */
  margin-right: 8px;
  /* 动画 - 轻微旋转 */
  animation: coin-shine 2s ease-in-out infinite;
}

/* 金额数字 */
.money-amount {
  /* 文字大小 */
  font-size: 20px;
  /* 颜色 - 金色 */
  color: #ffd700;
  /* 字重 */
  font-weight: bold;
  /* 阴影 */
  text-shadow:
    0 0 10px rgba(255, 215, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.3);
  /* 等宽字体，数字不会跳动 */
  font-family: 'Courier New', monospace;
}

/* ==================== 游戏标题样式 ==================== */

.game-title {
  display: flex;
  align-items: center;
  padding: 10px 20px;
}

.title-icon {
  font-size: 28px;
  margin-right: 10px;
  animation: sparkle 2s ease-in-out infinite;
}

.title-text {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(135deg, #bb8fce, #e91e63);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(155, 89, 182, 0.5);
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
    filter: brightness(1.3);
  }
}

/* ==================== 动画定义 ==================== */

/* 金币闪光动画 */
@keyframes coin-shine {
  0%, 100% {
    transform: rotate(0deg) scale(1);
    filter: brightness(1);
  }
  50% {
    transform: rotate(10deg) scale(1.1);
    filter: brightness(1.3);
  }
}
</style>
