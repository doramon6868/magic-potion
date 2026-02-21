<!--
  PetPreview.vue - 宠物预览卡片组件

  用于合成界面左侧的宠物列表展示
  特点：
  - 大图标，适合儿童点击
  - 清晰的状态标识
  - 悬停放大效果
  - 选中状态高亮
-->

<template>
  <div
    class="pet-preview-card"
    :class="{
      'owned': isOwned,
      'locked': isLocked,
      'selected': isSelected,
      'available': !isOwned && !isLocked
    }"
    @click="handleClick"
  >
    <!-- 宠物图标 -->
    <div class="pet-avatar">
      <span class="pet-emoji">{{ pet.emoji }}</span>
      <span v-if="pet.emojiSecondary" class="pet-emoji-secondary">
        {{ pet.emojiSecondary }}
      </span>
    </div>

    <!-- 宠物名称 -->
    <div class="pet-name">{{ pet.name }}</div>

    <!-- 状态标签 -->
    <div class="pet-status-badge" :class="statusClass">
      <span v-if="isOwned" class="status-icon">✓</span>
      <span v-else-if="isLocked" class="status-icon">🔒</span>
      <span v-else class="status-icon">✨</span>
      {{ statusText }}
    </div>

    <!-- 稀有度标识 -->
    <div class="rarity-badge" :style="{ background: rarityColor }">
      {{ rarityText }}
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useSynthesisStore } from '../../stores/synthesis.js'
import { usePetCollectionStore } from '../../stores/petCollection.js'
import { getRarityText, getRarityColor } from '../../config/petTypes.js'

export default {
  name: 'PetPreview',

  props: {
    /**
     * 宠物配置对象
     */
    pet: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapStores(useSynthesisStore, usePetCollectionStore),

    /**
     * 是否已拥有
     */
    isOwned() {
      return this.petCollectionStore.isPetOwned(this.pet.type)
    },

    /**
     * 是否锁定（未解锁配方）
     */
    isLocked() {
      const recipe = this.synthesisStore.selectedRecipe
      if (!recipe) return false

      return !this.synthesisStore.isRecipeUnlocked(recipe.id)
    },

    /**
     * 是否选中
     */
    isSelected() {
      const recipe = this.synthesisStore.selectedRecipe
      if (!recipe) return false
      return recipe.targetPetType === this.pet.type
    },

    /**
     * 状态文本
     */
    statusText() {
      if (this.isOwned) return '已拥有'
      if (this.isLocked) return '未解锁'
      return '可合成'
    },

    /**
     * 状态样式类
     */
    statusClass() {
      if (this.isOwned) return 'status-owned'
      if (this.isLocked) return 'status-locked'
      return 'status-available'
    },

    /**
     * 稀有度文本
     */
    rarityText() {
      return getRarityText(this.pet.rarity)
    },

    /**
     * 稀有度颜色
     */
    rarityColor() {
      return getRarityColor(this.pet.rarity)
    }
  },

  methods: {
    /**
     * 处理点击
     */
    handleClick() {
      if (this.isLocked) {
        // 显示解锁条件提示
        this.$emit('showUnlockRequirement', this.pet.type)
        return
      }

      // 选择配方
      const recipeId = this.pet.id
      const success = this.synthesisStore.selectRecipe(recipeId)

      if (success) {
        this.$emit('select', this.pet.type)
      }
    }
  }
}
</script>

<style scoped>
/* 卡片容器 */
.pet-preview-card {
  width: 110px;
  padding: 14px 10px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f5f3ff 0%, #e9d5ff 100%);
  border: 3px solid transparent;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

/* 悬停效果 */
.pet-preview-card:hover:not(.locked) {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
}

/* 选中状态 */
.pet-preview-card.selected {
  border-color: #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
}

/* 已拥有状态 */
.pet-preview-card.owned {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
}

.pet-preview-card.owned.selected {
  border-color: #22c55e;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
}

/* 锁定状态 */
.pet-preview-card.locked {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  cursor: not-allowed;
  opacity: 0.7;
}

/* 宠物头像区域 */
.pet-avatar {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 宠物主表情 */
.pet-emoji {
  font-size: 42px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* 宠物副表情 */
.pet-emoji-secondary {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 20px;
  background: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* 宠物名称 */
.pet-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
}

/* 状态标签 */
.pet-status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-icon {
  font-size: 10px;
}

.status-owned {
  background: #86efac;
  color: #166534;
}

.status-available {
  background: #93c5fd;
  color: #1e40af;
}

.status-locked {
  background: #d1d5db;
  color: #4b5563;
}

/* 稀有度标识 */
.rarity-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
