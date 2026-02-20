/**
 * Vite 配置文件
 *
 * Vite 是一个前端构建工具，它让开发 Vue 项目变得很快
 * 这个文件告诉 Vite 如何构建我们的项目
 */

// 导入 Vite 的 Vue 插件
// 这个插件让 Vite 知道如何处理 .vue 文件
import vue from '@vitejs/plugin-vue'

// 导入 Vite 的配置函数
import { defineConfig } from 'vite'

// 导出配置对象
// Vite 会使用这个配置来启动开发服务器和构建项目
export default defineConfig({
  // 使用 Vue 插件
  // 这样 Vite 就能理解和编译 Vue 的单文件组件(.vue文件)
  plugins: [vue()],

  // 开发服务器配置
  server: {
    // 在 5173 端口运行（Vite 默认端口）
    port: 5173,
    // 自动打开浏览器
    open: true
  },

  // 路径别名
  // 让我们可以用 @/ 代替 src/ 来导入文件
  // 例如：import Pet from '@/components/Pet.vue'
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
