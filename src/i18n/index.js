/**
 * i18n/index.js - 国际化配置
 *
 * 这个文件配置 Vue I18n，支持中英文切换
 */

import { createI18n } from 'vue-i18n'
import messages from './locales'

// 从 localStorage 读取语言偏好，默认中文
const savedLocale = localStorage.getItem('game-language') || 'zh-CN'

const i18n = createI18n({
  legacy: false,           // 使用 Composition API 模式
  locale: savedLocale,     // 当前语言
  fallbackLocale: 'zh-CN', // 回退语言
  messages,                // 语言包
  // 全局注入 $t 方法（兼容 Options API）
  globalInjection: true,
})

export default i18n

// 导出语言列表供选择器使用
export const availableLocales = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' }
]

// 切换语言函数
export function setLocale(locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('game-language', locale)
  // 更新 HTML lang 属性
  document.documentElement.lang = locale
}
