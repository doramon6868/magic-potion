<!--
  App.vue - 根组件

  这是整个应用的容器组件
  它负责：
  1. 布局整个游戏界面（顶部栏、左侧背包、中间水晶球、右侧户外区）
  2. 引入所有子组件
  3. 控制商店弹窗的显示/隐藏

  Vue 单文件组件(.vue)的结构：
  1. <template> - HTML 模板，定义组件的结构
  2. <script> - JavaScript 逻辑，定义组件的行为
  3. <style scoped> - CSS 样式，scoped 表示只影响当前组件
-->

<template>
  <!--
    主容器
    使用 flex 布局让整个游戏界面垂直排列
    min-height: 100vh 确保背景填满整个屏幕
  -->
  <div class="game-container">

    <!-- ==================== 顶部功能栏 ==================== -->
    <!--
      TopBar 组件显示：
      - 左侧：背包按钮（现在直接显示背包，不需要按钮）
      - 中间：金钱数量
      - 右侧：商店按钮
    -->
    <TopBar
      @open-shop="showShop = true"
    />

    <!-- ==================== 中间游戏区域 ==================== -->
    <div class="game-area">
      <!--
        左侧：背包
        物品可以直接拖拽到中间的水晶球
      -->
      <Backpack class="backpack-wrapper" />

      <!--
        中间：水晶球（游戏核心区域）
        这是宠物居住的地方，也是主要交互区域
        可以接收：
        - 从背包拖拽来的物品（喂养）
        - 从户外区拖拽回来的宠物（召回）
      -->
      <CrystalBall class="crystal-ball-wrapper" />

      <!--
        右侧：户外区域（森林 + 游猎区）
        宠物可以拖拽到这里进行探索或战斗
      -->
      <div class="outdoor-wrapper">
        <OutdoorPlay class="outdoor-zone" />
        <OutdoorHunt class="outdoor-zone" />
      </div>
    </div>

    <!-- ==================== 商店弹窗 ==================== -->
    <Shop v-model:show="showShop" />

  </div>
</template>

<script>
/**
 * 使用 Options API 风格编写组件
 * 这是 Vue 的经典写法，data、methods、computed 分开定义
 * 对初学者来说结构清晰，容易理解
 */

// ==================== 导入子组件 ====================
import TopBar from './components/TopBar.vue'
import CrystalBall from './components/CrystalBall.vue'
import OutdoorPlay from './components/OutdoorPlay.vue'
import OutdoorHunt from './components/OutdoorHunt.vue'
import Backpack from './components/Backpack.vue'
import Shop from './components/Shop.vue'

export default {
  /**
   * name: 组件的名称
   * 在调试工具中会显示这个名称
   */
  name: 'App',

  /**
   * components: 注册子组件
   * 只有在这里注册的组件才能在 template 中使用
   */
  components: {
    TopBar,
    CrystalBall,
    OutdoorPlay,
    OutdoorHunt,
    Backpack,
    Shop
  },

  /**
   * data: 定义组件的响应式数据
   * 必须是一个函数，返回一个对象
   * 为什么是函数？这样每个组件实例都有自己的独立数据
   *
   * 这里的数据变化会自动触发界面更新
   * 这就是 Vue 的响应式系统
   */
  data() {
    return {
      /**
       * showShop: 控制商店弹窗的显示
       * true = 显示，false = 隐藏
       */
      showShop: false
    }
  }
}
</script>

<style scoped>
/**
 * scoped 属性表示这些样式只作用于当前组件
 * 不会影响其他组件，即使类名相同
 * Vue 会自动给这些样式加上唯一属性选择器
 */

/* 游戏主容器 */
.game-container {
  /* 使用 flex 布局，让子元素垂直排列 */
  display: flex;
  flex-direction: column;
  /* 最小高度为视口高度，确保占满整个屏幕 */
  min-height: 100vh;
  /* 内边距，让内容不贴边 */
  padding: 20px;
}

/* 中间游戏区域 - 包含背包、水晶球、户外区 */
.game-area {
  /* flex: 1 表示占据所有剩余空间 */
  flex: 1;
  /* 使用 flex 布局让三个区域水平排列 */
  display: flex;
  /* 子元素在顶部对齐 */
  align-items: flex-start;
  /* 子元素间距 */
  gap: 20px;
  /* 上边距，和顶部栏保持距离 */
  margin-top: 20px;
  /* 最小高度确保有足够空间 */
  min-height: 400px;
}

/* 背包容器 */
.backpack-wrapper {
  /* 固定宽度 */
  width: 250px;
  /* 弹性不收缩 */
  flex-shrink: 0;
}

/* 水晶球容器 */
.crystal-ball-wrapper {
  /* 占据更多空间 */
  flex: 1;
  /* 居中显示 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 确保有足够高度显示完整的水晶球 */
  min-height: 400px;
  padding-top: 40px;
}

/* 户外区域容器 */
.outdoor-wrapper {
  /* 固定宽度 */
  width: 220px;
  /* 弹性不收缩 */
  flex-shrink: 0;
  /* 垂直排列 */
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 户外区域 */
.outdoor-zone {
  /* 高度 */
  height: 190px;
}
</style>
