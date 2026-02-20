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
      <!-- 图标 -->
      <span class="item-icon">{{ item.icon }}</span>

      <!-- 数量徽章（当 showQuantity 为 true 且数量大于1时显示） -->
      <span
        v-if="showQuantity && item.quantity > 1"
        class="quantity-badge"
      >
        {{ item.quantity }}
      </span>
    </div>

    <!-- 物品名称 -->
    <div class="item-name">{{ item.name }}</div>

    <!-- 物品效果（只在背包中显示） -->
    <div v-if="isDraggable" class="item-effect">
      +{{ item.foodValue }} 饱食度
    </div>

  </div>
</template>

<script>
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
    }
  },

  /**
   * methods: 组件方法
   */
  methods: {
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

      console.log('开始拖拽物品:', this.item.name)

      // 触发自定义事件，让父组件知道开始拖拽
      this.$emit('drag-start', this.dragData)
    },

    /**
     * handleDragEnd: 拖拽结束时的处理
     */
    handleDragEnd(event) {
      // 重置拖拽状态
      this.isDragging = false

      console.log('拖拽结束:', this.item.name)

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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 2px solid rgba(155, 89, 182, 0.3);
  transition: all 0.3s ease;
}

/* 背包中的物品样式 */
.item-container.in-backpack {
  cursor: grab;
}

.item-container.in-backpack:hover {
  border-color: rgba(155, 89, 182, 0.6);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(155, 89, 182, 0.3);
}

/* 拖拽时的样式 */
.item-container.in-backpack:active {
  cursor: grabbing;
}

/* 正在拖拽的样式 */
.item-container.dragging {
  opacity: 0.5;
  transform: scale(0.95);
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
  color: white;
  text-align: center;
  margin-bottom: 4px;
}

/* 物品效果 */
.item-effect {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
