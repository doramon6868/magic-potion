<!--
  NotificationBar.vue - 底部通知栏组件

  这个组件显示游戏中的通知消息
  替代 alert() 弹窗，从底部滑入显示

  特性：
  - 紫色主题渐变背景
  - 支持多种类型：success/warning/error/info
  - 自动消失（3秒）
  - 点击关闭按钮立即关闭
  - 最多同时显示3条
  - 堆叠显示
-->

<template>
  <!--
    通知容器
    固定在底部居中
    pointer-events: none 确保不阻挡下方点击
  -->
  <div class="notification-container">
    <div class="notification-list">
      <!--
        遍历显示所有通知
        :key: 必须唯一，用于 Vue 识别每个通知
      -->
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
        :class="`type-${notification.type}`"
      >
        <!-- 消息内容 -->
        <div class="notification-message">
          {{ notification.message }}
        </div>

        <!-- 关闭按钮 -->
        <button
          class="notification-close"
          @click="removeNotification(notification.id)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// ==================== 使用 Composition API ====================
import { useNotificationStore } from '../stores/notification.js'
import { storeToRefs } from 'pinia'

// 获取 notification store
const notificationStore = useNotificationStore()

// 使用 storeToRefs 保持响应式
const { notifications } = storeToRefs(notificationStore)

// 解构方法
const { removeNotification } = notificationStore
</script>

<style scoped>
/**
 * 通知栏样式
 * 手绘魔法气泡风格，使用设计 token
 */

/* 通知容器 - 固定在底部 */
.notification-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: none;
}

/* 通知列表 */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

/* 单个通知项 - 魔法气泡 */
.notification-item {
  pointer-events: auto;
  min-width: 280px;
  max-width: 400px;
  padding: 12px 16px;
  border-radius: var(--mp-radius-lg);
  background: linear-gradient(135deg, var(--mp-purple) 0%, var(--mp-purple-light) 100%);
  border: 3px solid var(--mp-ink);
  box-shadow: var(--mp-shadow);
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--mp-white);
  animation: bubble-in 0.4s var(--mp-ease-bounce);
}

.notification-item.type-success {
  background: linear-gradient(135deg, var(--mp-mint) 0%, var(--mp-mint-light) 100%);
  color: var(--mp-ink);
}

.notification-item.type-warning {
  background: linear-gradient(135deg, var(--mp-gold) 0%, var(--mp-gold-light) 100%);
  color: var(--mp-ink);
}

.notification-item.type-error {
  background: linear-gradient(135deg, var(--mp-red) 0%, color-mix(in srgb, var(--mp-red) 60%, var(--mp-white)) 100%);
  color: var(--mp-white);
}

.notification-item.type-info {
  background: linear-gradient(135deg, var(--mp-blue) 0%, color-mix(in srgb, var(--mp-blue) 60%, var(--mp-white)) 100%);
  color: var(--mp-white);
}

.notification-item.type-info .notification-close:hover {
  color: var(--mp-blue);
}

/* 通知消息 */
.notification-message {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}

/* 关闭按钮 */
.notification-close {
  width: 24px;
  height: 24px;
  border: 2px solid var(--mp-white);
  border-radius: 50%;
  background: transparent;
  color: var(--mp-white);
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--mp-duration-fast) ease;
  flex-shrink: 0;
}

.notification-close:hover {
  background: var(--mp-white);
  color: var(--mp-purple);
  transform: scale(1.1);
}

.notification-item.type-success .notification-close:hover {
  color: var(--mp-mint);
}

.notification-item.type-warning .notification-close:hover {
  color: var(--mp-gold);
}

.notification-item.type-error .notification-close:hover {
  color: var(--mp-red);
}

/* ==================== 过渡动画 ==================== */

/* 进入动画 */
.notification-enter-active {
  animation: bubble-in 0.4s var(--mp-ease-bounce);
}

/* 离开动画 */
.notification-leave-active {
  animation: fade-out 0.2s ease-in;
  position: absolute;
}

/* 列表移动动画 */
.notification-move {
  transition: transform var(--mp-duration-normal) ease;
}

/* 气泡弹入 */
@keyframes bubble-in {
  from {
    transform: translateY(30px) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* 淡出 */
@keyframes fade-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
