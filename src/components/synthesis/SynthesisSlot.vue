<!--
  SynthesisSlot.vue - 材料放置槽组件

  用于合成界面的碎片和药水放置
  特点：
  - 大放置区域，适合拖拽
  - 拖拽高亮效果
  - 脉动动画提示
-->

<template>
  <div
    class="synthesis-slot"
    :class="{
      'empty': !hasItem,
      'filled': hasItem,
      'highlight': isHighlighted,
      'fragment-slot': type === 'fragment',
      'potion-slot': type === 'potion'
    }"
    @dragover.prevent="handleDragOver"
    @drop.prevent="handleDrop"
    @dragenter.prevent="handleDragEnter"
    @dragleave="handleDragLeave"
  >
    <!-- 空槽显示 -->
    <template v-if="!hasItem">
      <div class="slot-placeholder">
        <span class="slot-icon">{{ placeholderIcon }}</span>
        <span class="slot-label">{{ placeholderLabel }}</span>
        <span v-if="requiredCount > 1" class="slot-requirement">
          需要 {{ requiredCount }} 个
        </span>
      </div>
    </template>

    <!-- 已放置物品 -->
    <template v-else>
      <span class="item-icon">{{ itemIcon }}</span>
      <span v-if="itemCount > 1" class="item-count">×{{ itemCount }}</span>
      <button
        v-if="!isSynthesizing"
        class="remove-btn"
        @click.stop="removeItem"
        title="移除"
      >
        ×
      </button>
    </template>

    <!-- 高亮遮罩 -->
    <div v-if="isHighlighted" class="drop-highlight"></div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useSynthesisStore } from '../../stores/synthesis.js'
import { getFragmentType } from '../../config/fragmentTypes.js'
import { getPotionIconByRarity } from '../../config/synthesisRecipes.js'

export default {
  name: 'SynthesisSlot',

  props: {
    type: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    requiredFragmentType: {
      type: String,
      default: null
    },
    requiredCount: {
      type: Number,
      default: 1
    },
    isSynthesizing: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isHighlighted: false,
      dragCounter: 0
    }
  },

  computed: {
    ...mapStores(useSynthesisStore),

    hasItem() {
      if (this.type === 'potion') {
        return this.synthesisStore.synthesisSlots.potion !== null
      }
      return this.index < this.synthesisStore.synthesisSlots.fragments.length
    },

    item() {
      if (this.type === 'potion') {
        return this.synthesisStore.synthesisSlots.potion
      }
      return this.synthesisStore.synthesisSlots.fragments[this.index] || null
    },

    itemIcon() {
      if (!this.item) return ''

      if (this.type === 'potion') {
        return this.item.icon || getPotionIconByRarity(this.item.rarity)
      }

      const fragmentConfig = getFragmentType(this.item.type)
      return fragmentConfig?.icon || '🐱'
    },

    itemCount() {
      if (!this.item) return 0
      return this.item.quantity || 1
    },

    placeholderIcon() {
      if (this.type === 'potion') {
        return '🧪'
      }
      if (this.requiredFragmentType) {
        const fragmentConfig = getFragmentType(this.requiredFragmentType)
        return fragmentConfig?.icon || '🐱'
      }
      return '🐱'
    },

    placeholderLabel() {
      if (this.type === 'potion') {
        return '药水'
      }
      return '碎片'
    }
  },

  methods: {
    handleDragEnter(event) {
      this.dragCounter++
      this.isHighlighted = true
    },

    handleDragLeave(event) {
      this.dragCounter--
      if (this.dragCounter <= 0) {
        this.isHighlighted = false
        this.dragCounter = 0
      }
    },

    handleDragOver(event) {
      event.dataTransfer.dropEffect = 'move'
    },

    handleDrop(event) {
      this.isHighlighted = false
      this.dragCounter = 0

      let data
      try {
        const jsonData = event.dataTransfer.getData('application/json')
        data = JSON.parse(jsonData)
      } catch (e) {
        console.error('解析拖拽数据失败:', e)
        return
      }

      if (!data || !data.type) {
        return
      }

      if (data.type === 'item') {
        const item = data.item

        if (this.type === 'fragment' && item.category === 'fragment') {
          this.synthesisStore.addFragmentToSlot(item.fragmentType, 1)
        } else if (this.type === 'potion') {
          this.synthesisStore.setPotionSlot('common')
        }
      }
    },

    removeItem() {
      if (this.isSynthesizing) return

      if (this.type === 'potion') {
        this.synthesisStore.removePotionFromSlot()
      } else {
        this.synthesisStore.removeFragmentFromSlot(this.index)
      }
    }
  }
}
</script>

<style scoped>
.synthesis-slot {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  border: 3px dashed #c4b5fd;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.synthesis-slot.highlight {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.15);
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
  }
}

.synthesis-slot.filled {
  border-style: solid;
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #f5f3ff 0%, #e9d5ff 100%);
}

.slot-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.slot-icon {
  font-size: 28px;
  opacity: 0.5;
}

.slot-label {
  font-size: 11px;
  color: #8b5cf6;
  font-weight: 500;
}

.slot-requirement {
  font-size: 9px;
  color: #a78bfa;
}

.item-icon {
  font-size: 36px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.item-count {
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #7c3aed;
  background: rgba(255, 255, 255, 0.9);
  padding: 1px 6px;
  border-radius: 8px;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.drop-highlight {
  position: absolute;
  inset: 0;
  border-radius: 13px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  pointer-events: none;
}
</style>
