/**
 * settings.js - 设置状态管理
 *
 * 管理游戏设置，包括语言偏好
 */

import { defineStore } from 'pinia'
import { setLocale } from '../i18n'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // 从 localStorage 初始化语言设置
    language: localStorage.getItem('game-language') || 'zh-CN'
  }),

  getters: {
    currentLanguage: (state) => state.language,
    isChinese: (state) => state.language === 'zh-CN',
    isEnglish: (state) => state.language === 'en-US'
  },

  actions: {
    // 切换语言
    changeLanguage(locale) {
      if (this.language === locale) return

      this.language = locale
      setLocale(locale)
    },

    // 初始化语言（在 App 启动时调用）
    initLanguage() {
      setLocale(this.language)
    }
  }
})
