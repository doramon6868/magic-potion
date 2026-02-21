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
        <!-- 图标 -->
        <div class="notification-icon">
          {{ getIcon(notification.type) }}
        </div>

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

/**
 * getIcon: 根据通知类型返回对应的图标
 *
 * @param {string} type - 通知类型
 * @returns {string} 图标字符
 */
function getIcon(type) {
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  }
  return icons[type] || 'ℹ️'
}
</script>

<style scoped>
/**
 * 通知栏样式
 * 紫色主题，底部居中
 */

/* 通知容器 - 固定在底部 */
.notification-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  /* 不阻挡下方点击 */
  pointer-events: none;
}

/* 通知列表 */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

/* 单个通知项 */
.notification-item {
  pointer-events: auto;
  min-width: 280px;
  max-width: 400px;
  padding: 12px 16px;
  border-radius: 12px;
  /* pastel 紫色渐变背景 */
  background: linear-gradient(135deg, rgba(197, 179, 224, 0.95), rgba(168, 160, 200, 0.95));
  /* 毛玻璃效果 */
  backdrop-filter: blur(10px);
  /* pastel 阴影 */
  box-shadow: 0 4px 20px rgba(197, 179, 224, 0.4);
  display: flex;
  align-items: center;
  gap: 12px;
  /* 边框 */
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* 不同类型通知的颜色变体 */
.notification-item.type-success {
  background: linear-gradient(135deg, rgba(39, 174, 96, 0.95), rgba(30, 132, 73, 0.95));
  box-shadow: 0 4px 20px rgba(39, 174, 96, 0.4);
}

.notification-item.type-warning {
  background: linear-gradient(135deg, rgba(243, 156, 18, 0.95), rgba(211, 84, 0, 0.95));
  box-shadow: 0 4px 20px rgba(243, 156, 18, 0.4);
}

.notification-item.type-error {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.95), rgba(169, 50, 38, 0.95));
  box-shadow: 0 4px 20px rgba(231, 76, 60, 0.4);
}

.notification-item.type-info {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.95), rgba(41, 128, 185, 0.95));
  box-shadow: 0 4px 20px rgba(52, 152, 219, 0.4);
}

/* 通知图标 */
.notification-icon {
  font-size: 20px;
  flex-shrink: 0;
}

/* 通知消息 */
.notification-message {
  flex: 1;
  color: white;
  font-size: 14px;
  line-height: 1.4;
  /* 文字阴影增加可读性 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 关闭按钮 */
.notification-close {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* ==================== 过渡动画 ==================== */

/* 进入动画 */
.notification-enter-active {
  animation: slide-up 0.3s ease-out;
}

/* 离开动画 */
.notification-leave-active {
  animation: fade-out 0.2s ease-in;
  position: absolute;
}

/* 列表移动动画 */
.notification-move {
  transition: transform 0.3s ease;
}

/* 从下方滑入 */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
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
