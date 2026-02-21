<!--
  Backpack.vue - 背包组件（内联版本）

  这个组件显示玩家拥有的物品，现在改为内联显示而不是弹窗
  这样可以直接拖拽物品到水晶球，不会被弹窗容器拦截事件

  主要功能：
  1. 显示背包物品列表
  2. 物品可拖拽到水晶球
  3. 显示物品数量和信息
-->

<template>
  <!--
    背包内联容器
    直接显示在页面左侧，不是弹窗
  -->
  <div class="backpack-panel">
    <!-- 背包标题 -->
    <div class="backpack-header">
      <span class="backpack-icon">🎒</span>
      <span class="backpack-title">{{ $t('backpack.title') }}</span>
      <span class="item-count">({{ backpackStore.totalItems }})</span>
    </div>

    <!-- 背包描述 -->
    <div class="backpack-description">
      {{ $t('backpack.hint') }}
    </div>

    <!-- 物品网格 -->
    <div class="items-grid">
      <!--
        遍历背包中的物品
        v-for: 循环渲染列表
        :key: 每个元素的唯一标识，帮助 Vue 优化更新
        :class: 根据稀有度添加不同的样式类
      -->
      <Item
        v-for="item in backpackStore.items"
        :key="item.id"
        :item="item"
        show-quantity
        :is-draggable="true"
        :class="item.rarity || 'common'"
      />
    </div>

    <!-- 空背包提示 -->
    <div
      v-if="backpackStore.items.length === 0"
      class="empty-backpack"
    >
      <span class="empty-icon">📭</span>
      <span class="empty-text">{{ $t('backpack.empty') }}</span>
      <span class="empty-hint">{{ $t('backpack.goShop') }}</span>
    </div>

    <!-- 增益效果显示 -->
    <BuffStatus />
  </div>
</template>

<script>
// ==================== 导入依赖 ====================
import { mapStores } from 'pinia'
import { useBackpackStore } from '../stores/backpack.js'
import Item from './Item.vue'
import BuffStatus from './BuffStatus.vue'

export default {
  // 组件名称
  name: 'Backpack',

  // 注册子组件
  components: {
    Item,
    BuffStatus
  },

  /**
   * computed: 计算属性
   */
  computed: {
    ...mapStores(useBackpackStore)
  }
}
</script>

<style scoped>
/**
 * 背包面板样式
 */

/* 背包面板容器 */
.backpack-panel {
  width: 220px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 2px solid rgba(197, 179, 224, 0.5);
  padding: 15px;
  display: flex;
  flex-direction: column;
  max-height: 400px;
  box-shadow: 0 4px 20px rgba(197, 179, 224, 0.2);
}

/* 背包头部 */
.backpack-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(197, 179, 224, 0.4);
}

.backpack-icon {
  font-size: 24px;
  margin-right: 8px;
}

.backpack-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-dark);
}

.item-count {
  font-size: 14px;
  color: rgba(74, 74, 106, 0.6);
  margin-left: 5px;
}

/* 背包描述 */
.backpack-description {
  text-align: center;
  color: rgba(74, 74, 106, 0.8);
  font-size: 12px;
  margin-bottom: 15px;
  padding: 8px;
  background: rgba(197, 179, 224, 0.3);
  border-radius: 8px;
}

/* 物品网格 */
.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  overflow-y: auto;
  max-height: 250px;
  padding: 5px;
}

/* 空背包提示 */
.empty-backpack {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 10px;
  color: rgba(74, 74, 106, 0.5);
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.empty-text {
  font-size: 14px;
  margin-bottom: 5px;
}

.empty-hint {
  font-size: 12px;
}
</style>
