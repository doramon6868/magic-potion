<!--
  SynthesisUI.vue - 合成主界面

  宠物合成的核心界面，整合所有合成相关组件
  布局：左侧宠物列表 | 中间动画区 | 右侧材料槽
-->

<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="!isSynthesizing"
    :closable="!isSynthesizing"
    preset="card"
    class="synthesis-modal"
    :class="{ 'synthesizing': isSynthesizing }"
  >
    <template #header>
      <div class="modal-header">
        <PotionIcon class="header-icon" rarity="epic" />
        <span class="header-title">{{ $t('synthesis.title') || '宠物合成' }}</span>
      </div>
    </template>

    <div class="synthesis-container">
      <!-- 左侧：宠物列表 -->
      <div class="pet-list-section">
        <h3 class="section-title">
          <PetAvatar class="section-icon" type="cat" status="idle" :size="24" />
          可合成宠物
        </h3>
        <div class="pet-list">
          <PetPreview
            v-for="pet in allPets"
            :key="pet.id"
            :pet="pet"
            @select="onPetSelect"
            @showUnlockRequirement="showUnlockTip"
          />
        </div>
      </div>

      <!-- 中间：合成动画区 -->
      <div class="animation-section">
        <SynthesisAnimation
          :phase="synthesisPhase"
          :vortex-color="currentVortexColor"
          :result="synthesisResult"
        />

        <!-- 成功率显示 -->
        <div v-if="selectedRecipe && !isSynthesizing && !synthesisResult" class="success-rate">
          <div class="rate-label">成功率</div>
          <div class="rate-value" :class="{ 'high': successRate >= 0.7, 'medium': successRate >= 0.5 && successRate < 0.7, 'low': successRate < 0.5 }">
            {{ Math.round(successRate * 100) }}%
          </div>
          <div v-if="isPityActive" class="pity-badge">
            保底激活 +10%
          </div>
        </div>

        <!-- 合成按钮 -->
        <button
          v-if="!isSynthesizing && !synthesisResult"
          class="synthesis-btn"
          :class="{ 'can-synthesize': canSynthesize, 'disabled': !canSynthesize }"
          :disabled="!canSynthesize"
          @click="startSynthesis"
        >
          <PotionIcon v-if="canSynthesize" class="btn-icon" rarity="epic" />
          <span v-if="canSynthesize">开始合成</span>
          <span v-else>材料不足</span>
        </button>
      </div>

      <!-- 右侧：材料槽和背包 -->
      <div class="materials-section">
        <h3 class="section-title">
          <FragmentIcon class="section-icon" :type="requiredFragmentType" />
          材料槽
        </h3>

        <!-- 碎片槽 -->
        <div class="fragment-slots">
          <div class="slots-label">碎片 ({{ placedFragmentCount }}/{{ neededFragmentCount }})</div>
          <div class="slots-row">
            <SynthesisSlot
              v-for="i in fragmentSlotCount"
              :key="i"
              type="fragment"
              :index="i - 1"
              :required-fragment-type="requiredFragmentType"
              :required-count="1"
              :is-synthesizing="isSynthesizing"
            />
          </div>
        </div>

        <!-- 药水槽 -->
        <div class="potion-slot">
          <div class="slots-label">药水</div>
          <SynthesisSlot
            type="potion"
            :is-synthesizing="isSynthesizing"
          />
        </div>

        <!-- 自动填充按钮 -->
        <button
          v-if="!isSynthesizing && selectedRecipe"
          class="auto-fill-btn"
          @click="autoFill"
        >
          <PotionIcon class="btn-icon" rarity="epic" />
          自动填充材料
        </button>

        <!-- 配方信息 -->
        <div v-if="selectedRecipe" class="recipe-info">
          <div class="info-item">
            <span class="info-label">配方：</span>
            <span class="info-value">{{ selectedRecipe.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">需求：</span>
            <span class="info-value">
              {{ fragmentTypeName }}×{{ selectedRecipe.fragmentCount }}
              + {{ potionName }}×1
            </span>
          </div>
        </div>

        <!-- 碎片背包 - 可以拖拽到槽位 -->
        <div class="fragment-inventory">
          <h4 class="inventory-title">
            <FragmentIcon class="inventory-icon" :type="requiredFragmentType" />
            碎片背包
          </h4>
          <div class="inventory-items">
            <Item
              v-for="item in fragmentItems"
              :key="item.id"
              :item="item"
              show-quantity
              :is-draggable="true"
              :class="item.rarity || 'common'"
            />
            <div v-if="fragmentItems.length === 0" class="empty-inventory">
              <FragmentIcon class="empty-icon" :type="requiredFragmentType" />
              <span class="empty-text">暂无碎片</span>
              <span class="empty-hint">去商店购买或探索获得</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="synthesis-hint">
      <StarDecoration class="hint-icon" />
      <span>提示：从右下角碎片背包拖拽碎片到上方槽位，或点击“自动填充材料”</span>
    </div>

    <!-- 结果弹窗 -->
    <SynthesisResult
      v-if="synthesisResult"
      :result="synthesisResult"
      :pity-threshold="selectedRecipe?.pityThreshold || 3"
      @close="closeResult"
      @retry="retrySynthesis"
      @viewCollection="viewCollection"
    />

    <!-- 弹窗底部关闭按钮 -->
    <template #footer>
      <div class="modal-footer">
        <button class="close-btn" @click="showModal = false">
          {{ $t('ui.close') || '关闭' }}
        </button>
      </div>
    </template>
  </n-modal>
</template>

<script>
import { mapStores } from 'pinia'
import { useSynthesisStore } from '../../stores/synthesis.js'
import { usePetCollectionStore } from '../../stores/petCollection.js'
import { useBackpackStore } from '../../stores/backpack.js'
import { getAllPetTypes } from '../../config/petTypes.js'
import { getFragmentType } from '../../config/fragmentTypes.js'
import { getPotionNameByRarity } from '../../config/synthesisRecipes.js'
import PetAvatar from '../icons/PetAvatar.vue'
import PotionIcon from '../icons/items/PotionIcon.vue'
import FragmentIcon from '../icons/items/FragmentIcon.vue'
import StarDecoration from '../icons/decorations/StarDecoration.vue'
import PetPreview from './PetPreview.vue'
import SynthesisSlot from './SynthesisSlot.vue'
import SynthesisAnimation from './SynthesisAnimation.vue'
import SynthesisResult from './SynthesisResult.vue'
import Item from '../Item.vue'

export default {
  name: 'SynthesisUI',

  components: {
    PetAvatar,
    PotionIcon,
    FragmentIcon,
    StarDecoration,
    PetPreview,
    SynthesisSlot,
    SynthesisAnimation,
    SynthesisResult,
    Item
  },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:show', 'viewCollection'],

  data() {
    return {
      allPets: getAllPetTypes()
    }
  },

  computed: {
    ...mapStores(useSynthesisStore, usePetCollectionStore, useBackpackStore),

    showModal: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update:show', value)
      }
    },

    selectedRecipe() {
      return this.synthesisStore.selectedRecipe
    },

    isSynthesizing() {
      return this.synthesisStore.isSynthesizing
    },

    synthesisPhase() {
      return this.synthesisStore.synthesisPhase
    },

    synthesisResult() {
      return this.synthesisStore.synthesisResult
    },

    canSynthesize() {
      return this.synthesisStore.canSynthesize
    },

    successRate() {
      return this.synthesisStore.currentSuccessRate
    },

    isPityActive() {
      return this.synthesisStore.isPityActive
    },

    currentVortexColor() {
      return this.selectedRecipe?.vortexColor || '#8b5cf6'
    },

    fragmentSlotCount() {
      return this.selectedRecipe?.fragmentCount || 3
    },

    placedFragmentCount() {
      return this.synthesisStore.placedFragmentCount
    },

    neededFragmentCount() {
      return this.selectedRecipe?.fragmentCount || 0
    },

    requiredFragmentType() {
      return this.selectedRecipe?.fragmentType || 'cat'
    },

    fragmentTypeName() {
      const fragment = getFragmentType(this.requiredFragmentType)
      return fragment?.name || '碎片'
    },

    potionName() {
      if (!this.selectedRecipe) return '药水'
      return getPotionNameByRarity(this.selectedRecipe.requiredPotion.rarity)
    },

    /**
     * fragmentItems: 从背包中筛选出碎片物品
     * @returns {Array}
     */
    fragmentItems() {
      return this.backpackStore.items.filter(item => item.category === 'fragment')
    }
  },

  watch: {
    show(newVal) {
      if (newVal) {
        // 打开时自动选择第一个可合成的配方
        this.selectFirstAvailableRecipe()
      }
    }
  },

  methods: {
    selectFirstAvailableRecipe() {
      // 找到第一个未拥有的可合成宠物
      const targetPet = this.allPets.find(pet => {
        if (pet.isStarter) return false // 跳过初始宠物
        return !this.petCollectionStore.isPetOwned(pet.type) &&
               this.synthesisStore.isRecipeUnlocked(pet.id)
      })

      if (targetPet) {
        this.synthesisStore.selectRecipe(targetPet.id)
      } else {
        // 如果没有未拥有的，选择第一个非初始宠物
        const nonStarter = this.allPets.find(p => !p.isStarter)
        if (nonStarter) {
          this.synthesisStore.selectRecipe(nonStarter.id)
        }
      }
    },

    onPetSelect(petType) {
      // 宠物选择已由 selectRecipe 处理，此处保留扩展入口
    },

    showUnlockTip(petType) {
      // 显示解锁条件提示
      const pet = this.allPets.find(p => p.type === petType)
      if (pet && pet.unlockCondition) {
        this.$message?.info(`解锁条件: ${pet.unlockCondition}`)
      }
    },

    async startSynthesis() {
      await this.synthesisStore.startSynthesis()
    },

    autoFill() {
      this.synthesisStore.autoFillSlots()
    },

    closeResult() {
      this.synthesisStore.closeResult()
    },

    retrySynthesis() {
      this.synthesisStore.resetSynthesis()
      this.autoFill()
    },

    viewCollection() {
      this.$emit('viewCollection')
    }
  }
}
</script>

<style scoped>
/* 模态框样式 */
.synthesis-modal {
  width: 800px;
  max-width: 95vw;
}

.synthesis-modal :deep(.n-card) {
  background: linear-gradient(135deg, var(--mp-purple-soft) 0%, var(--mp-bg) 100%);
  border: 4px solid var(--mp-purple);
  border-radius: var(--mp-radius-lg);
  box-shadow: var(--mp-shadow-hover);
}

.synthesis-modal :deep(.n-card-header) {
  border-bottom: 2px solid color-mix(in srgb, var(--mp-purple) 30%, transparent);
  padding: 20px 24px;
}

/* 头部 */
.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 32px;
  height: 32px;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--mp-purple-dark);
}

/* 主容器 */
.synthesis-container {
  display: grid;
  grid-template-columns: 160px 1fr 200px;
  gap: 24px;
  padding: 20px 0;
  min-height: 400px;
}

/* 区域标题 */
.section-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--mp-white);
  border: 3px solid var(--mp-ink);
  border-radius: var(--mp-radius-full);
  color: var(--mp-ink);
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 16px;
  text-align: center;
}

.section-icon {
  width: 24px;
  height: 24px;
}

/* 左侧宠物列表 */
.pet-list-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pet-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

/* 中间动画区 */
.animation-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

/* 成功率 */
.success-rate {
  text-align: center;
  padding: 16px 32px;
  background: color-mix(in srgb, var(--mp-white) 80%, transparent);
  border-radius: var(--mp-radius-md);
  box-shadow: var(--mp-shadow);
}

.rate-label {
  font-size: 13px;
  color: var(--mp-text-muted);
  margin-bottom: 4px;
}

.rate-value {
  font-size: 36px;
  font-weight: 700;
}

.rate-value.high {
  color: var(--mp-mint);
}

.rate-value.medium {
  color: var(--mp-gold);
}

.rate-value.low {
  color: var(--mp-red);
}

.pity-badge {
  margin-top: 8px;
  padding: 4px 12px;
  background: linear-gradient(135deg, var(--mp-gold) 0%, var(--mp-gold-light) 100%);
  color: var(--mp-ink);
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--mp-radius-full);
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* 合成按钮 */
.synthesis-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  border: 3px solid var(--mp-ink);
  border-radius: var(--mp-radius-full);
  background: linear-gradient(135deg, var(--mp-purple), var(--mp-purple-dark));
  color: var(--mp-white);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--mp-shadow);
  transition: all var(--mp-duration-fast) ease;
}

.synthesis-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--mp-shadow-hover);
}

.synthesis-btn:disabled {
  background: color-mix(in srgb, var(--mp-ink) 30%, transparent);
  color: var(--mp-white);
  cursor: not-allowed;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* 右侧材料区 */
.materials-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.slots-label {
  font-size: 12px;
  color: var(--mp-text-muted);
  margin-bottom: 8px;
}

.fragment-slots {
  display: flex;
  flex-direction: column;
}

.slots-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.potion-slot {
  display: flex;
  flex-direction: column;
}

/* 自动填充按钮 */
.auto-fill-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: var(--mp-white);
  color: var(--mp-purple-dark);
  border: 3px solid var(--mp-ink);
  border-radius: var(--mp-radius-full);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--mp-shadow);
  transition: all var(--mp-duration-fast) ease;
}

.auto-fill-btn:hover {
  background: var(--mp-purple-soft);
  transform: translateY(-1px);
  box-shadow: var(--mp-shadow-hover);
}

/* 配方信息 */
.recipe-info {
  background: color-mix(in srgb, var(--mp-white) 60%, transparent);
  border-radius: var(--mp-radius-md);
  border: 2px solid color-mix(in srgb, var(--mp-purple) 30%, transparent);
  padding: 12px;
  font-size: 12px;
}

.info-item {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: var(--mp-text-muted);
}

.info-value {
  color: var(--mp-ink);
  font-weight: 500;
}

/* 底部提示 */
.synthesis-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  padding: 16px;
  background: color-mix(in srgb, var(--mp-gold) 15%, transparent);
  border: 2px solid color-mix(in srgb, var(--mp-gold) 40%, transparent);
  border-radius: var(--mp-radius-md);
  font-size: 13px;
  color: var(--mp-ink);
  margin-top: 16px;
}

.hint-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .synthesis-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .pet-list {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* 碎片背包 */
.fragment-inventory {
  margin-top: 16px;
  padding: 12px;
  background: color-mix(in srgb, var(--mp-white) 60%, transparent);
  border-radius: var(--mp-radius-md);
  border: 2px dashed color-mix(in srgb, var(--mp-purple) 40%, transparent);
}

.inventory-title {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--mp-ink);
  margin-bottom: 10px;
  text-align: center;
}

.inventory-icon {
  width: 18px;
  height: 18px;
}

.inventory-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.inventory-items :deep(.item-container) {
  padding: 8px;
}

.inventory-items :deep(.item-icon-svg) {
  width: 28px;
  height: 28px;
}

.inventory-items :deep(.item-name) {
  font-size: 11px;
}

.empty-inventory {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  color: var(--mp-text-muted);
}

.empty-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 6px;
  opacity: 0.6;
}

.empty-text {
  font-size: 12px;
  margin-bottom: 2px;
}

.empty-hint {
  font-size: 10px;
}

/* 弹窗底部 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
}

/* 关闭按钮 - 胶囊贴纸风格 */
.close-btn {
  padding: 8px 20px;
  border: 3px solid var(--mp-ink);
  border-radius: var(--mp-radius-full);
  background: var(--mp-white);
  color: var(--mp-ink);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--mp-shadow);
  transition: all var(--mp-duration-fast) ease;
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--mp-shadow-hover);
}
</style>
