/**
 * notification.js - 通知状态管理
 *
 * 这个 store 管理游戏中的底部通知栏
 * 用于替代 alert() 弹窗，提供更美观的用户体验
 */

import { defineStore } from 'pinia'

/**
 * 创建 notification store
 */
export const useNotificationStore = defineStore('notification', {

  /**
   * state: 通知数据
   */
  state: () => ({
    /**
     * notifications: 当前显示的通知列表
     * 每个通知对象包含：id, type, message, timestamp
     */
    notifications: [],

    /**
     * maxNotifications: 最多同时显示的通知数量
     */
    maxNotifications: 3,

    /**
     * duration: 通知自动消失的默认时间（毫秒）
     */
    duration: 3000
  }),

  /**
   * getters: 计算属性
   */
  getters: {
    /**
     * hasNotifications: 是否有通知在显示
     * @returns {boolean}
     */
    hasNotifications: (state) => state.notifications.length > 0,

    /**
     * notificationCount: 当前通知数量
     * @returns {number}
     */
    notificationCount: (state) => state.notifications.length
  },

  /**
   * actions: 通知操作方法
   */
  actions: {
    /**
     * addNotification: 添加一条通知
     *
     * @param {string} type - 通知类型: 'success' | 'warning' | 'error' | 'info'
     * @param {string} message - 通知消息内容
     * @param {number} duration - 显示时长（毫秒），默认 3000ms
     * @returns {number} 通知的 id
     */
    addNotification(type, message, duration = this.duration) {
      // 生成唯一 id
      const id = Date.now() + Math.random()

      // 创建通知对象
      const notification = {
        id,
        type,
        message,
        timestamp: Date.now()
      }

      // 如果通知数量超过最大值，移除最旧的一条
      if (this.notifications.length >= this.maxNotifications) {
        this.notifications.shift()
      }

      // 添加到通知列表
      this.notifications.push(notification)

      console.log(`[通知] ${type}: ${message}`)

      // 设置自动消失定时器
      setTimeout(() => {
        this.removeNotification(id)
      }, duration)

      return id
    },

    /**
     * removeNotification: 移除指定 id 的通知
     *
     * @param {number} id - 通知 id
     */
    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },

    /**
     * clearAll: 清除所有通知
     */
    clearAll() {
      this.notifications = []
    },

    /**
     * success: 添加成功类型的通知（快捷方法）
     *
     * @param {string} message - 消息内容
     * @param {number} duration - 显示时长
     */
    success(message, duration) {
      return this.addNotification('success', message, duration)
    },

    /**
     * warning: 添加警告类型的通知（快捷方法）
     *
     * @param {string} message - 消息内容
     * @param {number} duration - 显示时长
     */
    warning(message, duration) {
      return this.addNotification('warning', message, duration)
    },

    /**
     * error: 添加错误类型的通知（快捷方法）
     *
     * @param {string} message - 消息内容
     * @param {number} duration - 显示时长
     */
    error(message, duration) {
      return this.addNotification('error', message, duration)
    },

    /**
     * info: 添加信息类型的通知（快捷方法）
     *
     * @param {string} message - 消息内容
     * @param {number} duration - 显示时长
     */
    info(message, duration) {
      return this.addNotification('info', message, duration)
    }
  }
})
