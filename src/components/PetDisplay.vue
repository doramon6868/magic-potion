<!--
  PetDisplay.vue - 宠物显示组件

  这个组件显示在左侧，包含：
  1. 大头像
  2. 宠物名字
  3. 属性条（饱食度、心情、健康）
  4. 等级和经验

  风格参考合成界面设计
-->

<template>
  <div class="pet-display-panel">
    <!-- 宠物头像区域 -->
    <div class="pet-avatar-section">
      <!-- 宠物切换按钮 -->
      <button
        v-if="hasMultiplePets"
        class="switch-pet-btn"
        @click="openPetSwitcher"
        title="切换宠物"
      >
        <span class="switch-icon">🔄</span>
      </button>

      <!-- 大头像 -->
      <div class="pet-avatar-large" :style="avatarStyle">
        <span v-if="petConfig?.passiveSkill" class="skill-icon">{{ petConfig.passiveSkill.icon }}</span>
        <SlugcatAvatar :status="gameStore.pet.status" :pet-type="petConfig?.type" :size="100" />
      </div>

      <!-- 宠物名字 -->
      <div class="pet-name">{{ gameStore.pet.name }}</div>

      <!-- 等级信息 -->
      <div class="pet-level">
        <span class="level-badge">Lv.{{ gameStore.pet.level }}</span>
        <span class="exp-text">{{ gameStore.pet.experience }}/100 XP</span>
      </div>
    </div>

    <!-- 切换按钮 -->
    <div class="toggle-buttons">
      <button
        class="toggle-btn"
        :class="{ 'active': !showBackpack }"
        @click="showBackpack = false"
      >
        📊 属性
      </button>
      <button
        class="toggle-btn"
        :class="{ 'active': showBackpack }"
        @click="showBackpack = true"
      >
        🎒 背包 ({{ backpackStore.totalItems }})
      </button>
    </div>

    <!-- 属性条区域 -->
    <div v-if="!showBackpack" class="pet-stats-section">
      <!-- 饱食度条 -->
      <div class="stat-bar">
        <div class="stat-icon">🍖</div>
        <div class="stat-info">
          <div class="stat-header">
            <span class="stat-label">{{ $t('pet.stats.hunger') }}</span>
            <span class="stat-value">{{ gameStore.pet.hunger }}%</span>
          </div>
          <div class="stat-track">
            <div class="stat-fill hunger-fill" :style="{ width: gameStore.pet.hunger + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- 心情条 -->
      <div class="stat-bar">
        <div class="stat-icon">💖</div>
        <div class="stat-info">
          <div class="stat-header">
            <span class="stat-label">{{ $t('pet.stats.mood') }}</span>
            <span class="stat-value">{{ gameStore.pet.mood }}%</span>
          </div>
          <div class="stat-track">
            <div class="stat-fill mood-fill" :style="{ width: gameStore.pet.mood + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- 健康条 -->
      <div class="stat-bar">
        <div class="stat-icon">❤️</div>
        <div class="stat-info">
          <div class="stat-header">
            <span class="stat-label">{{ $t('pet.stats.health') }}</span>
            <span class="stat-value">{{ gameStore.pet.health }}%</span>
          </div>
          <div class="stat-track">
            <div class="stat-fill health-fill" :style="{ width: gameStore.pet.health + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 背包区域 -->
    <div v-else class="backpack-section">
      <div v-if="backpackStore.items.length === 0" class="empty-backpack">
        <span class="empty-icon">📭</span>
        <span class="empty-text">背包是空的</span>
        <span class="empty-hint">去商店购买物品吧</span>
      </div>
      <div v-else class="items-grid">
        <Item
          v-for="item in backpackStore.items"
          :key="item.id"
          :item="item"
          show-quantity
          :is-draggable="true"
          :class="item.rarity || 'common'"
        />
      </div>
    </div>

    <!-- 状态指示 -->
    <div class="pet-status" :class="gameStore.pet.status">
      <span class="status-dot"></span>
      <span class="status-text">{{ statusText }}</span>
    </div>

    <!-- 宠物选择弹窗 -->
    <Teleport to="body">
      <n-modal
        v-model:show="showPetSwitcher"
        preset="card"
        class="pet-switcher-modal"
        :title="$t('pet.switchBtn')"
      >
        <div class="owned-pets-list">
          <div
            v-for="ownedPet in ownedPets"
            :key="ownedPet.instanceId"
            class="owned-pet-item"
            :class="{ 'active': ownedPet.instanceId === activePetId }"
            @click="switchToPet(ownedPet.instanceId)"
          >
            <div class="pet-preview-avatar">{{ getPetEmoji(ownedPet.petType) }}</div>
            <div class="pet-preview-info">
              <div class="pet-preview-name">{{ ownedPet.name }}</div>
              <div v-if="getPetPassiveSkill(ownedPet.petType)" class="pet-preview-skill">
                {{ getPetPassiveSkill(ownedPet.petType).icon }} {{ getPetPassiveSkill(ownedPet.petType).name }}
              </div>
            </div>
            <div v-if="ownedPet.instanceId === activePetId" class="active-badge">
              ✓ {{ $t('synthesis.current') || '当前' }}
            </div>
          </div>
        </div>
      </n-modal>
    </Teleport>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useGameStore } from '../stores/game.js'
import { usePetCollectionStore } from '../stores/petCollection.js'
import { useBackpackStore } from '../stores/backpack.js'
import { useNotificationStore } from '../stores/notification.js'
import { getPetType } from '../config/petTypes.js'
import Item from './Item.vue'
import SlugcatAvatar from './icons/SlugcatAvatar.vue'

export default {
  name: 'PetDisplay',

  components: {
    Item,
    SlugcatAvatar
  },

  data() {
    return {
      showPetSwitcher: false,
      showBackpack: false
    }
  },

  computed: {
    ...mapStores(useGameStore, usePetCollectionStore, useBackpackStore),

    petConfig() {
      const petType = this.petCollectionStore.activePet?.petType || 'cat'
      return getPetType(petType)
    },

    avatarStyle() {
      const type = this.petConfig?.type || 'cat'
      return {
        background: `var(--mp-pet-${type}-gradient, var(--mp-pet-cat-gradient))`
      }
    },

    hasMultiplePets() {
      return this.petCollectionStore.hasMultiplePets
    },

    ownedPets() {
      return this.petCollectionStore.ownedPets
    },

    activePetId() {
      return this.petCollectionStore.activePetId
    },

    statusText() {
      const statusMap = {
        'sleeping': '睡觉中',
        'idle': '发呆中',
        'happy': '很开心',
        'playing': '玩耍中',
        'hunting': '战斗中',
        'tired': '疲惫中',
        'sad': '难过中',
        'eating': '进食中'
      }
      return statusMap[this.gameStore.pet.status] || '休息中'
    }
  },

  methods: {
    openPetSwitcher() {
      this.showPetSwitcher = true
    },

    getPetEmoji(petType) {
      const pet = getPetType(petType)
      return pet?.emoji || '🐌'
    },

    getPetPassiveSkill(petType) {
      const pet = getPetType(petType)
      return pet?.passiveSkill || null
    },

    switchToPet(instanceId) {
      const notificationStore = useNotificationStore()

      const success = this.petCollectionStore.setActivePet(instanceId)

      if (success) {
        const newPet = this.petCollectionStore.activePet
        if (newPet) {
          this.gameStore.pet.name = newPet.name
          this.gameStore.pet.hunger = newPet.hunger
          this.gameStore.pet.mood = newPet.mood
          this.gameStore.pet.health = newPet.health
          this.gameStore.pet.level = newPet.level
          this.gameStore.pet.experience = newPet.experience
          this.gameStore.pet.status = newPet.status
          this.gameStore.pet.isAtHome = newPet.isAtHome
          this.gameStore.pet.isDead = newPet.isDead
        }

        notificationStore.success(`已切换到 ${this.petCollectionStore.activePet?.name}`)
        this.showPetSwitcher = false
      }
    }
  }
}
</script>

<style scoped>
/* 宠物显示面板 - 参考合成界面风格 */
.pet-display-panel {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border-radius: 20px;
  border: 2px solid rgba(197, 179, 224, 0.5);
  padding: 20px;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.15);
}

/* 宠物头像区域 */
.pet-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

/* 宠物切换按钮 */
.switch-pet-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
}

.switch-pet-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
}

.switch-icon {
  font-size: 18px;
}

/* 大头像 */
.pet-avatar-large {
  width: 120px;
  height: 110px;
  border-radius: 50% 50% 45% 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow:
    0 6px 20px rgba(107, 155, 122, 0.4),
    0 0 30px rgba(136, 216, 176, 0.5),
    inset -3px -3px 10px rgba(0, 0, 0, 0.2),
    inset 3px 3px 10px rgba(255, 255, 255, 0.4);
  margin-bottom: 12px;
}

/* 技能图标 */
.skill-icon {
  position: absolute;
  top: -8px;
  left: -8px;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

/* 宠物名字 */
.pet-name {
  font-size: 18px;
  font-weight: 700;
  color: #6b21a8;
  margin-bottom: 6px;
}

/* 等级信息 */
.pet-level {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-badge {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.exp-text {
  font-size: 12px;
  color: #7c3aed;
}

/* 切换按钮区域 */
.toggle-buttons {
  display: flex;
  gap: 8px;
  margin: 16px 0;
}

.toggle-btn {
  flex: 1;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.4);
}

.toggle-btn.active {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

/* 属性条区域 */
.pet-stats-section {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 单个属性条 */
.stat-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 13px;
  color: #374151;
  font-weight: 600;
}

.stat-track {
  height: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s ease;
}

/* 饱食度 - 橙色 */
.hunger-fill {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

/* 心情 - 粉色 */
.mood-fill {
  background: linear-gradient(90deg, #ec4899, #f472b6);
}

/* 健康 - 绿色 */
.health-fill {
  background: linear-gradient(90deg, #10b981, #34d399);
}

/* 状态指示 */
.pet-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  font-size: 13px;
  color: #6b7280;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s ease-in-out infinite;
}

.pet-status.sleeping .status-dot {
  background: #6b7280;
}

.pet-status.playing .status-dot {
  background: #3b82f6;
}

.pet-status.hunting .status-dot {
  background: #ef4444;
}

.pet-status.tired .status-dot {
  background: #f59e0b;
}

.pet-status.sad .status-dot {
  background: #8b5cf6;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 背包区域 */
.backpack-section {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 12px;
  min-height: 180px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

/* 背包空状态 */
.empty-backpack {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: rgba(74, 74, 106, 0.5);
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 14px;
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 12px;
}

/* 宠物切换弹窗样式 */
.owned-pets-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
}

.owned-pet-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.owned-pet-item:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateX(4px);
}

.owned-pet-item.active {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border-color: #8b5cf6;
}

.pet-preview-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.pet-preview-info {
  flex: 1;
}

.pet-preview-name {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.pet-preview-skill {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.active-badge {
  padding: 4px 10px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
}
</style>
