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
      <SlugcatAvatar :status="petStatus" :pet-type="pet.type || 'cat'" :size="56" />
    </div>

    <!-- 宠物名称 -->
    <div class="pet-name">{{ pet.name }}</div>

    <!-- 状态标签 -->
    <div class="pet-status-badge" :class="statusClass">
      <span v-if="isOwned" class="status-icon">✓</span>
      <span v-else-if="isLocked" class="status-icon">!</span>
      <span v-else class="status-icon">✦</span>
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
import SlugcatAvatar from '../icons/SlugcatAvatar.vue'

export default {
  name: 'PetPreview',

  components: {
    SlugcatAvatar
  },

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
     * 宠物状态（用于 SlugcatAvatar 表情）
     */
    petStatus() {
      return this.isOwned ? 'happy' : (this.isLocked ? 'sad' : 'idle')
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
  border-radius: var(--mp-radius-md);
  background: linear-gradient(135deg, var(--mp-purple-soft) 0%, var(--mp-bg) 100%);
  border: 3px solid transparent;
  cursor: pointer;
  position: relative;
  transition: all var(--mp-duration-normal) ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

/* 悬停效果 */
.pet-preview-card:hover:not(.locked) {
  transform: scale(1.05);
  box-shadow: var(--mp-shadow-hover);
}

/* 选中状态 */
.pet-preview-card.selected {
  border-color: var(--mp-purple);
  box-shadow: 0 0 20px color-mix(in srgb, var(--mp-purple) 50%, transparent);
  background: linear-gradient(135deg, var(--mp-purple-soft) 0%, var(--mp-bg) 100%);
}

/* 已拥有状态 */
.pet-preview-card.owned {
  background: color-mix(in srgb, var(--mp-mint) 30%, var(--mp-white));
}

.pet-preview-card.owned.selected {
  border-color: var(--mp-mint);
  box-shadow: 0 0 20px color-mix(in srgb, var(--mp-mint) 50%, transparent);
}

/* 锁定状态 */
.pet-preview-card.locked {
  background: color-mix(in srgb, var(--mp-ink) 10%, var(--mp-white));
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

/* 宠物名称 */
.pet-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--mp-ink);
  text-align: center;
}

/* 状态标签 */
.pet-status-badge {
  padding: 4px 10px;
  border-radius: var(--mp-radius-full);
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
  background: var(--mp-mint);
  color: var(--mp-ink);
}

.status-available {
  background: var(--mp-blue);
  color: var(--mp-white);
}

.status-locked {
  background: color-mix(in srgb, var(--mp-ink) 20%, transparent);
  color: var(--mp-ink);
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
  color: var(--mp-white);
  box-shadow: var(--mp-shadow);
}
</style>
