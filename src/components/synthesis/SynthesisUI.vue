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
        <span class="header-icon">🔮</span>
        <span class="header-title">{{ $t('synthesis.title') || '宠物合成' }}</span>
      </div>
    </template>

    <div class="synthesis-container">
      <!-- 左侧：宠物列表 -->
      <div class="pet-list-section">
        <h3 class="section-title">🐾 可合成宠物</h3>
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
          <span v-if="canSynthesize">✨ 开始合成</span>
          <span v-else>材料不足</span>
        </button>
      </div>

      <!-- 右侧：材料槽 -->
      <div class="materials-section">
        <h3 class="section-title">🎒 材料槽</h3>

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
          🔄 自动填充材料
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
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="synthesis-hint">
      💡 提示：从背包拖拽碎片到右侧槽位，然后点击合成按钮
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
  </n-modal>
</template>

<script>
import { mapStores } from 'pinia'
import { useSynthesisStore } from '../../stores/synthesis.js'
import { usePetCollectionStore } from '../../stores/petCollection.js'
import { getAllPetTypes } from '../../config/petTypes.js'
import { getFragmentType } from '../../config/fragmentTypes.js'
import { getPotionNameByRarity } from '../../config/synthesisRecipes.js'
import PetPreview from './PetPreview.vue'
import SynthesisSlot from './SynthesisSlot.vue'
import SynthesisAnimation from './SynthesisAnimation.vue'
import SynthesisResult from './SynthesisResult.vue'

export default {
  name: 'SynthesisUI',

  components: {
    PetPreview,
    SynthesisSlot,
    SynthesisAnimation,
    SynthesisResult
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
    ...mapStores(useSynthesisStore, usePetCollectionStore),

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
      console.log('选择宠物:', petType)
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
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border-radius: 24px;
}

.synthesis-modal :deep(.n-card-header) {
  border-bottom: 2px solid #e9d5ff;
  padding: 20px 24px;
}

/* 头部 */
.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 28px;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: #6b21a8;
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
  font-size: 15px;
  font-weight: 600;
  color: #7c3aed;
  margin-bottom: 16px;
  text-align: center;
}

/* 左侧宠物列表 */
.pet-list-section {
  display: flex;
  flex-direction: column;
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
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.rate-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

.rate-value {
  font-size: 36px;
  font-weight: 700;
}

.rate-value.high {
  color: #16a34a;
}

.rate-value.medium {
  color: #d97706;
}

.rate-value.low {
  color: #dc2626;
}

.pity-badge {
  margin-top: 8px;
  padding: 4px 12px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* 合成按钮 */
.synthesis-btn {
  padding: 16px 48px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.synthesis-btn.can-synthesize {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.synthesis-btn.can-synthesize:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.5);
}

.synthesis-btn.disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

/* 右侧材料区 */
.materials-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.slots-label {
  font-size: 12px;
  color: #6b7280;
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
  padding: 10px 16px;
  background: #e0e7ff;
  color: #4f46e5;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.auto-fill-btn:hover {
  background: #c7d2fe;
  transform: translateY(-1px);
}

/* 配方信息 */
.recipe-info {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
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
  color: #6b7280;
}

.info-value {
  color: #374151;
  font-weight: 500;
}

/* 底部提示 */
.synthesis-hint {
  text-align: center;
  padding: 16px;
  background: #fef3c7;
  border-radius: 12px;
  font-size: 13px;
  color: #92400e;
  margin-top: 16px;
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
</style>
