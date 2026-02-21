/**
 * main.js - 应用程序入口文件
 *
 * 这个文件是整个 Vue 应用的起点
 * 它的任务是：
 * 1. 创建 Vue 应用实例
 * 2. 安装必要的插件
 * 3. 将应用挂载到 HTML 页面上
 */

// ==================== 导入依赖 ====================

/**
 * createApp - Vue 3 的核心函数，用于创建应用实例
 * 在 Vue 2 中是 new Vue()，Vue 3 改成了 createApp()
 * 这样可以让多个 Vue 应用共存于一个页面
 */
import { createApp } from 'vue'

/**
 * createPinia - Pinia 状态管理库的初始化函数
 * Pinia 是 Vue 官方推荐的状态管理方案
 * 它可以让我们在多个组件之间共享数据（如宠物状态、背包物品）
 */
import { createPinia } from 'pinia'

/**
 * naive - UI 组件库
 * 提供了按钮、弹窗、进度条等现成的组件
 * 样式美观，而且支持自定义主题
 */
import naive from 'naive-ui'

/**
 * App.vue - 根组件
 * 这是应用的第一个组件，所有其他组件都是它的子组件
 */
import App from './App.vue'

/**
 * i18n - 国际化配置
 * 支持中英文切换
 */
import i18n from './i18n'
import { useSettingsStore } from './stores/settings'

// ==================== 创建应用 ====================

/**
 * 创建 Vue 应用实例
 * App 是根组件，它会渲染到 index.html 中的 #app 元素里
 */
const app = createApp(App)

// ==================== 安装插件 ====================

/**
 * use() 方法用于安装插件
 * 安装后，所有组件都可以使用这些插件提供的功能
 */

// 安装 Pinia，让我们可以在组件中使用状态管理
// 之后可以用 import { useGameStore } from '@/stores/game.js' 来获取状态
app.use(createPinia())

// 安装 Naive UI，让我们可以使用它的组件
// 例如：
// - n-button: 按钮
// - n-modal: 弹窗
// - n-progress: 进度条
// - n-card: 卡片
app.use(naive)

// 安装 i18n，支持中英文切换
app.use(i18n)

// 初始化语言设置
const settingsStore = useSettingsStore()
settingsStore.initLanguage()

// ==================== 挂载应用 ====================

/**
 * mount() 将 Vue 应用挂载到 DOM 元素上
 * '#app' 是一个 CSS 选择器，对应 index.html 中的 <div id="app">
 * 挂载后，App.vue 的内容会替换掉这个 div
 */
app.mount('#app')

/**
 * 关于 ES 模块 (ESM):
 * 这个文件使用了 ES 模块语法 (import/export)
 * 这是现代 JavaScript 的标准模块系统
 * Vite 会自动处理这些导入，找到对应的文件
 */
