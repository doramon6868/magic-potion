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
        <PotionIcon
          v-if="type === 'potion'"
          class="slot-placeholder-icon"
          rarity="common"
        />
        <FragmentIcon
          v-else
          class="slot-placeholder-icon"
          :type="requiredFragmentType || 'cat'"
        />
        <span class="slot-label">{{ placeholderLabel }}</span>
        <span v-if="requiredCount > 1" class="slot-requirement">
          需要 {{ requiredCount }} 个
        </span>
      </div>
    </template>

    <!-- 已放置物品 -->
    <template v-else>
      <PotionIcon
        v-if="type === 'potion'"
        class="slot-item-icon"
        :rarity="item.rarity || 'common'"
      />
      <FragmentIcon
        v-else
        class="slot-item-icon"
        :type="getFragmentType(item.type || item.fragmentType)"
      />
      <span v-if="itemCount > 1" class="item-count">×{{ itemCount }}</span>
      <button
        v-if="!isSynthesizing"
        class="remove-btn"
        @click.stop="removeItem"
        title="移除"
      >
        X
      </button>
    </template>

    <!-- 高亮遮罩 -->
    <div v-if="isHighlighted" class="drop-highlight"></div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useSynthesisStore } from '../../stores/synthesis.js'
import PotionIcon from '../icons/items/PotionIcon.vue'
import FragmentIcon from '../icons/items/FragmentIcon.vue'

export default {
  name: 'SynthesisSlot',

  components: {
    PotionIcon,
    FragmentIcon
  },

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

    itemCount() {
      if (!this.item) return 0
      return this.item.quantity || 1
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
    },

    /**
     * getFragmentType: 根据碎片类型获取对应的宠物类型
     * @param {string} keyOrType - 碎片 key 或类型
     * @returns {string} 宠物类型
     */
    getFragmentType(keyOrType) {
      const map = {
        cat: 'cat',
        bird: 'bird',
        fox: 'fox',
        dragon: 'dragon',
        cat_fragment: 'cat',
        bird_fragment: 'bird',
        fox_fragment: 'fox',
        dragon_fragment: 'dragon'
      }
      return map[keyOrType] || 'cat'
    }
  }
}
</script>

<style scoped>
.synthesis-slot {
  width: 80px;
  height: 80px;
  border-radius: var(--mp-radius-md);
  border: 3px dashed color-mix(in srgb, var(--mp-purple) 50%, transparent);
  background: color-mix(in srgb, var(--mp-white) 50%, transparent);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all var(--mp-duration-fast) ease;
}

.synthesis-slot.highlight {
  border-color: var(--mp-purple);
  background: color-mix(in srgb, var(--mp-purple) 15%, transparent);
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--mp-purple) 40%, transparent);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 0 15px color-mix(in srgb, var(--mp-purple) 30%, transparent);
  }
}

.synthesis-slot.filled {
  border-style: solid;
  border-color: var(--mp-purple);
  background: var(--mp-purple-soft);
}

.slot-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.slot-placeholder-icon,
.slot-item-icon {
  width: 36px;
  height: 36px;
}

.slot-label {
  font-size: 11px;
  color: var(--mp-purple);
  font-weight: 600;
}

.slot-requirement {
  font-size: 9px;
  color: var(--mp-text-muted);
}

.item-count {
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--mp-purple-dark);
  background: color-mix(in srgb, var(--mp-white) 90%, transparent);
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
  background: var(--mp-red);
  color: var(--mp-white);
  border: 2px solid var(--mp-white);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--mp-shadow);
  transition: all var(--mp-duration-fast) ease;
}

.remove-btn:hover {
  filter: brightness(0.9);
  transform: scale(1.1);
}

.drop-highlight {
  position: absolute;
  inset: 0;
  border-radius: var(--mp-radius-md);
  background: linear-gradient(135deg, color-mix(in srgb, var(--mp-purple) 10%, transparent) 0%, color-mix(in srgb, var(--mp-purple-light) 10%, transparent) 100%);
  pointer-events: none;
}
</style>
