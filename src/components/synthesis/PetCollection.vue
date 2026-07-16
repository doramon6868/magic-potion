<!--
  PetCollection.vue - 宠物图鉴组件

  展示玩家收集的所有宠物
  可以切换当前使用的宠物
-->

<template>
  <n-modal
    v-model:show="showModal"
    preset="card"
    class="collection-modal"
  >
    <template #header>
      <div class="modal-header">
        <span class="header-icon">📖</span>
        <span class="header-title">宠物图鉴</span>
        <div class="collection-progress">
          <span class="progress-text">
            {{ collectionProgress.owned }}/{{ collectionProgress.total }}
          </span>
        </div>
      </div>
    </template>

    <div class="collection-grid">
      <div
        v-for="pet in allPets"
        :key="pet.id"
        class="collection-card"
        :class="{
          'owned': isPetOwned(pet.type),
          'active': isPetActive(pet.type),
          'locked': !isPetOwned(pet.type)
        }"
        @click="selectPet(pet.type)"
      >
        <!-- 宠物头像 -->
        <div class="card-avatar">
          <PetAvatar :type="pet.type" status="idle" :size="40" />
          <div v-if="isPetActive(pet.type)" class="active-badge">✓</div>
        </div>

        <!-- 宠物信息 -->
        <div class="card-info">
          <div class="info-name">{{ pet.name }}</div>          <div
            class="info-rarity"
            :style="{ background: getRarityColor(pet.rarity) }"
          >
            {{ getRarityText(pet.rarity) }}
          </div>

          <div v-if="isPetOwned(pet.type) && pet.passiveSkill" class="info-skill">
            <span class="skill-icon">{{ pet.passiveSkill.icon }}</span>
            <span class="skill-name">{{ pet.passiveSkill.name }}</span>
          </div>

          <div v-else-if="!isPetOwned(pet.type)" class="info-locked">
            🔒 未获得
          </div>
        </div>
      </div>
    </div>

    <!-- 底部说明 -->
    <div class="collection-footer">
      <p v-if="hasMultiplePets">
        💡 点击宠物卡片可以切换当前使用的宠物
      </p>
      <p v-else">
        💡 收集更多宠物可以解锁切换功能
      </p>
    </div>
  </n-modal>
</template>

<script>
import { mapStores } from 'pinia'
import { usePetCollectionStore } from '../../stores/petCollection.js'
import { getAllPetTypes, getRarityText, getRarityColor } from '../../config/petTypes.js'
import PetAvatar from '../icons/PetAvatar.vue'

export default {
  name: 'PetCollection',

  components: {
    PetAvatar
  },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:show'],

  data() {
    return {
      allPets: getAllPetTypes()
    }
  },

  computed: {
    ...mapStores(usePetCollectionStore),

    showModal: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update:show', value)
      }
    },

    collectionProgress() {
      return this.petCollectionStore.collectionProgress
    },

    hasMultiplePets() {
      return this.petCollectionStore.hasMultiplePets
    }
  },

  methods: {
    getRarityText,
    getRarityColor,

    isPetOwned(petType) {
      return this.petCollectionStore.isPetOwned(petType)
    },

    isPetActive(petType) {
      const activePet = this.petCollectionStore.activePet
      return activePet?.petType === petType
    },

    selectPet(petType) {
      if (!this.isPetOwned(petType)) {
        this.$message?.info('该宠物尚未获得，快去合成吧！')
        return
      }

      if (this.isPetActive(petType)) {
        this.$message?.info(`${this.getPetName(petType)} 已经在使用了`)
        return
      }

      const pet = this.petCollectionStore.getOwnedPetByType(petType)
      if (pet) {
        this.petCollectionStore.setActivePet(pet.instanceId)
        this.$message?.success(`已切换到 ${pet.name}`)
      }
    },

    getPetName(petType) {
      const pet = this.allPets.find(p => p.type === petType)
      return pet?.name || '未知宠物'
    }
  }
}
</script>

<style scoped>
/* 模态框样式 */
.collection-modal {
  width: 600px;
  max-width: 95vw;
}

.collection-modal :deep(.n-card) {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border-radius: 24px;
}

/* 头部 */
.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.header-icon {
  font-size: 28px;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: #6b21a8;
  flex: 1;
}

.collection-progress {
  padding: 6px 14px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 16px;
}

.progress-text {
  font-size: 14px;
  font-weight: 700;
  color: white;
}

/* 宠物网格 */
.collection-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px 0;
}

/* 宠物卡片 */
.collection-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.collection-card:hover:not(.locked) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.collection-card.owned {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #86efac;
}

.collection-card.active {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-color: #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
}

.collection-card.locked {
  background: #f3f4f6;
  opacity: 0.6;
  cursor: not-allowed;
}

/* 头像 */
.card-avatar {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
}

.active-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 24px;
  height: 24px;
  background: #22c55e;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* 信息区 */
.card-info {
  flex: 1;
}

.info-name {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.info-rarity {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.info-skill {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.skill-icon {
  font-size: 14px;
}

.skill-name {
  font-weight: 500;
}

.info-locked {
  font-size: 12px;
  color: #9ca3af;
}

/* 底部 */
.collection-footer {
  text-align: center;
  padding: 16px;
  background: #fef3c7;
  border-radius: 12px;
  font-size: 13px;
  color: #92400e;
}

/* 响应式 */
@media (max-width: 500px) {
  .collection-grid {
    grid-template-columns: 1fr;
  }
}
</style>
