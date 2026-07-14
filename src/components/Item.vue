<!--
  Item.vue - 物品组件

  这个组件显示单个物品
  可以在背包中显示，也可以在商店中显示

  主要功能：
  1. 显示物品图标和名称
  2. 可拖拽（在背包中使用时）- 使用原生 HTML5 拖拽 API
  3. 显示数量（可选）
  4. 显示物品效果

  拖拽数据格式：
  {
    type: 'item',
    item: { id, name, icon, foodValue, ... }
  }
-->

<template>
  <!--
    物品容器
    使用原生 HTML5 拖拽 API
    draggable: HTML5 原生属性，控制是否可拖拽
    @dragstart: 开始拖拽时触发，设置拖拽数据
  -->
  <div
    class="item-container"
    :class="{ 'in-backpack': isDraggable, 'dragging': isDragging }"
    v-bind="draggableAttrs"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- 物品图标 -->
    <div class="item-icon-wrapper">
      <!-- SVG 图标：根据 item.key 动态渲染 -->
      <component
        :is="iconComponent"
        v-if="iconComponent"
        class="item-icon-svg"
        :rarity="item.rarity"
        :type="fragmentType"
      />
      <!-- 没有对应 SVG 时回退到 emoji -->
      <span v-else class="item-icon">{{ item.icon }}</span>

      <!-- 数量徽章（当 showQuantity 为 true 且数量大于1时显示） -->
      <span
        v-if="showQuantity && item.quantity > 1"
        class="quantity-badge"
      >
        {{ item.quantity }}
      </span>
    </div>

    <!-- 物品名称 -->
    <div class="item-name">{{ itemName }}</div>

    <!-- 稀有度标签 -->
    <div v-if="item.rarity" class="rarity-tag" :class="item.rarity">
      {{ $t(`items.rarity.${item.rarity}`) }}
    </div>

    <!-- 物品效果（只在背包中显示） -->
    <div v-if="isDraggable" class="item-effect">
      <!-- 显示饱食度效果 -->
      <span v-if="item.foodValue > 0">{{ $t('item.hungerValue', { value: item.foodValue }) }}</span>
      <!-- 显示心情效果 -->
      <span v-if="item.moodValue > 0" class="mood-effect">{{ $t('item.moodValue', { value: item.moodValue }) }}</span>
      <!-- 显示buff效果 -->
      <span v-if="item.buff" class="buff-effect">{{ getBuffShortDesc(item) }}</span>
      <!-- 纯心情道具 -->
      <span v-if="item.category === 'mood' && item.foodValue === 0" class="mood-effect">{{ $t('item.moodValue', { value: item.moodValue }) }}</span>
    </div>

    <!-- 风味文本提示（只在背包中显示） -->
    <div v-if="isDraggable && item.key" class="item-flavor-text">
      💫 {{ $t(`items.list.${item.key}.flavor`) }}
    </div>

  </div>
</template>

<script>
import { itemIconMap, fragmentTypes } from './icons/itemIconMap.js'

export default {
  // 组件名称
  name: 'Item',

  /**
   * props: 从父组件接收的数据
   */
  props: {
    /**
     * item: 物品数据
     */
    item: {
      type: Object,
      required: true,
    },

    /**
     * showQuantity: 是否显示数量
     * 在背包中显示为 true，商店中显示为 false
     */
    showQuantity: {
      type: Boolean,
      default: false
    },

    /**
     * isDraggable: 是否可拖拽
     * 背包中的物品可以拖拽，商店中的物品不能拖拽
     */
    isDraggable: {
      type: Boolean,
      default: true
    }
  },

  /**
   * data: 组件内部状态
   */
  data() {
    return {
      /**
       * isDragging: 是否正在拖拽
       */
      isDragging: false
    }
  },

  /**
   * computed: 计算属性
   */
  computed: {
    /**
     * dragData: 拖拽时传递的数据
     */
    dragData() {
      return {
        type: 'item',
        item: this.item
      }
    },

    /**
     * draggableAttrs: 动态绑定 draggable 属性
     * 只有当可拖拽时才添加 draggable 属性
     */
    draggableAttrs() {
      if (this.isDraggable) {
        return { draggable: true }
      }
      return {}
    },

    /**
     * itemName: 物品显示名称
     * 如果 item.key 存在，使用 i18n 翻译
     * 如果 item.key 不存在，使用 item.name 作为 fallback
     */
    itemName() {
      // 防御性检查：确保 item 存在
      if (!this.item) {
        return 'Unknown Item'
      }

      // 如果 key 存在，尝试使用 i18n 翻译
      if (this.item.key) {
        const translated = this.$t(`items.list.${this.item.key}.name`)
        // 如果翻译结果不是键名本身（说明找到了翻译），返回翻译
        if (translated !== `items.list.${this.item.key}.name`) {
          return translated
        }
        // 如果 i18n 返回键名本身，说明没有找到翻译，使用 item.name 作为 fallback
        console.warn(`[Item] 未找到物品的 i18n 翻译: key=${this.item.key}, 使用 item.name=${this.item.name}`)
      }

      // Fallback：使用 item.name 或直接显示 "Unknown"
      return this.item.name || 'Unknown Item'
    },

    /**
     * iconComponent: 根据 item.key 获取对应的 SVG 图标组件
     */
    iconComponent() {
      if (!this.item || !this.item.key) return null
      return itemIconMap[this.item.key] || null
    },

    /**
     * fragmentType: 碎片对应的宠物类型
     * 非碎片物品返回默认 'cat'
     */
    fragmentType() {
      if (!this.item || !this.item.key) return 'cat'
      return fragmentTypes[this.item.key] || 'cat'
    }
  },

  /**
   * methods: 组件方法
   */
  methods: {
    /**
     * getBuffShortDesc: 获取buff简短描述
     * @param {Object} item - 道具
     * @returns {string}
     */
    getBuffShortDesc(item) {
      if (!item.buff) return ''

      const buffType = item.buff.type
      switch (buffType) {
        case 'hunt_reward_boost':
          return this.$t('item.buff.combatBonus', { percent: Math.round(item.buff.value * 100) })
        case 'hunger_cost_reduce':
          return this.$t('item.buff.consumptionReduction', { percent: Math.round(item.buff.value * 100) })
        case 'death_money_protect':
          return this.$t('item.buff.keepGold')
        case 'auto_heal':
          return this.$t('item.buff.autoHeal')
        case 'exp_boost':
          return this.$t('item.buff.expMultiplier', { multiplier: item.buff.value })
        case 'death_chance_reduce':
          return this.$t('item.buff.deathReduction')
        case 'reset_decay':
          return this.$t('item.buff.timeRewind')
        default:
          return this.$t('item.buff.generic')
      }
    },

    /**
     * getRarityLabel: 获取稀有度标签
     * @param {string} rarity - 稀有度代码
     * @returns {string} 稀有度名称
     */
    getRarityLabel(rarity) {
      return this.$t(`items.rarity.${rarity}`) || ''
    },

    /**
     * handleDragStart: 开始拖拽时的处理
     * 使用 HTML5 DataTransfer API 存储数据
     */
    handleDragStart(event) {
      // 如果不是可拖拽的，不处理
      if (!this.isDraggable) {
        event.preventDefault()
        return
      }

      // 设置拖拽效果
      event.dataTransfer.effectAllowed = 'move'

      // 将数据序列化为 JSON 字符串存储
      // 必须使用 dataTransfer.setData 来存储数据
      const dataString = JSON.stringify(this.dragData)
      event.dataTransfer.setData('application/json', dataString)
      event.dataTransfer.setData('text/plain', dataString)

      // 设置正在拖拽状态（用于样式）
      this.isDragging = true

      console.log('开始拖拽物品:', this.$t(`items.list.${this.item.key}.name`))

      // 触发自定义事件，让父组件知道开始拖拽
      this.$emit('drag-start', this.dragData)
    },

    /**
     * handleDragEnd: 拖拽结束时的处理
     */
    handleDragEnd(event) {
      // 重置拖拽状态
      this.isDragging = false

      console.log('拖拽结束:', this.$t(`items.list.${this.item.key}.name`))

      // 触发自定义事件
      this.$emit('drag-end', this.dragData)
    }
  }
}
</script>

<style scoped>
/**
 * 物品样式
 */

/* 物品容器 */
.item-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 2px solid rgba(197, 179, 224, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

/* 背包中的物品样式 */
.item-container.in-backpack {
  cursor: grab;
}

.item-container.in-backpack:hover {
  border-color: rgba(197, 179, 224, 0.8);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(197, 179, 224, 0.4);
}

/* 拖拽时的样式 */
.item-container.in-backpack:active {
  cursor: grabbing;
}

/* 正在拖拽的样式 */
.item-container.dragging {
  opacity: 0.7;
  transform: scale(1.08) rotate(3deg);
  box-shadow: 0 0 20px color-mix(in srgb, var(--mp-purple) 50%, transparent);
}

/* 图标包装器 */
.item-icon-wrapper {
  position: relative;
  margin-bottom: 8px;
}

/* 物品图标 */
.item-icon {
  font-size: 36px;
  display: block;
}

/* SVG 图标尺寸 */
.item-icon-svg {
  width: 40px;
  height: 40px;
  display: block;
}

/* 数量徽章 */
.quantity-badge {
  /* 绝对定位 - 右上角 */
  position: absolute;
  top: -5px;
  right: -10px;
  /* 大小 */
  min-width: 20px;
  height: 20px;
  /* 居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 样式 */
  background: linear-gradient(135deg, #e91e63, #c2185b);
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 10px;
  /* 内边距 */
  padding: 0 6px;
  /* 阴影 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* 物品名称 */
.item-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-dark);
  text-align: center;
  margin-bottom: 4px;
}

/* 物品效果 */
.item-effect {
  font-size: 11px;
  color: rgba(74, 74, 106, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

/* 心情效果 */
.mood-effect {
  color: #e88a9a;
  font-weight: 500;
}

/* Buff效果 */
.buff-effect {
  color: #d4a300;
  font-size: 10px;
}

/* ==================== 稀有度样式 ==================== */

/* 物品容器需要相对定位来容纳标签（已在第248-257行定义基础样式） */

/* 稀有度标签 */
.rarity-tag {
  position: absolute;
  top: 5px;
  left: 5px;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 普通 - 灰色 */
.rarity-tag.common {
  background: linear-gradient(135deg, #9e9e9e, #757575);
  color: white;
}

/* 优秀 - 绿色 */
.rarity-tag.uncommon {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
}

/* 稀有 - 蓝色 */
.rarity-tag.rare {
  background: linear-gradient(135deg, #2196f3, #1565c0);
  color: white;
}

/* 史诗 - 紫色 */
.rarity-tag.epic {
  background: linear-gradient(135deg, #9c27b0, #6a1b9a);
  color: white;
}

/* 根据稀有度设置边框颜色 */
.item-container.common {
  border-color: rgba(158, 158, 158, 0.4);
}

.item-container.uncommon {
  border-color: rgba(76, 175, 80, 0.4);
}

.item-container.rare {
  border-color: rgba(33, 150, 243, 0.5);
  box-shadow: 0 0 8px rgba(33, 150, 243, 0.15);
}

.item-container.epic {
  border-color: rgba(156, 39, 176, 0.6);
  box-shadow: 0 0 10px rgba(156, 39, 176, 0.25);
}

/* 风味文本 */
.item-flavor-text {
  font-size: 10px;
  color: rgba(74, 74, 106, 0.5);
  font-style: italic;
  text-align: center;
  margin-top: 4px;
  padding: 0 3px;
  line-height: 1.2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
