<!--
  CrystalBall.vue - 水晶球组件（游戏核心）

  简化的水晶球设计 - 完美圆形，柔和紫色主题
  参考合成界面设计风格

  主要功能：
  1. 显示水晶球视觉效果（紫色魔法球体）
  2. 接收拖拽的物品（从背包来的食物）
  3. 接收拖拽的宠物（从户外召回）
  4. 显示旋涡特效（当有东西被拖入时）
  5. 显示宠物互动区域
-->

<template>
  <div
    class="crystal-ball"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- 水晶球主体 - 完美圆形 -->
    <div class="crystal-ball-body">
      <!-- 内部空间 -->
      <div class="crystal-ball-inner">
        <!-- 液态魔法门特效 -->
        <MagicDoor :is-open="showVortex || isDragOver" />

        <!-- 宠物显示（可拖拽） -->
        <div
          v-if="gameStore.pet.isAtHome"
          class="pet-simple-display"
          draggable="true"
          @dragstart="handlePetDragStart"
          @dragend="handlePetDragEnd"
        >
          <div class="simple-avatar" :style="avatarStyle">
            <span class="simple-emoji">{{ petEmoji }}</span>
          </div>
          <div class="simple-name">{{ gameStore.pet.name }}</div>
          <div class="simple-hint">拖拽我到右侧玩耍</div>
        </div>

        <!-- 宠物不在家时的提示 -->
        <div v-else class="empty-hint">
          <span class="empty-icon">🏠</span>
          <span class="empty-text">宠物外出中</span>
        </div>
      </div>

      <!-- 光泽效果 -->
      <div class="crystal-ball-shine"></div>
    </div>

    <!-- 合成入口按钮 -->
    <button
      v-if="showSynthesisHint && gameStore.pet.isAtHome"
      class="synthesis-btn"
      @click.stop="openSynthesis"
    >
      <span class="btn-icon">🔮</span>
      <span class="btn-text">{{ $t('synthesis.clickToSynthesize') }}</span>
    </button>

  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useGameStore } from '../stores/game.js'
import { useNotificationStore } from '../stores/notification.js'
import { usePetCollectionStore } from '../stores/petCollection.js'
import { getPetType } from '../config/petTypes.js'
import MagicDoor from './MagicDoor.vue'

export default {
  name: 'CrystalBall',

  components: {
    MagicDoor
  },

  data() {
    return {
      showVortex: false,
      isDragOver: false,
      dragEnterCounter: 0,
      showSynthesisHint: true
    }
  },

  computed: {
    ...mapStores(useGameStore, usePetCollectionStore),

    petConfig() {
      const petType = this.petCollectionStore.activePet?.petType || 'cat'
      return getPetType(petType)
    },

    petEmoji() {
      return this.petConfig?.emoji || '🐌'
    },

    avatarStyle() {
      const colors = {
        cat: 'radial-gradient(ellipse at 40% 30%, #c8f0d8 0%, #a8e6cf 30%, #88d8b0 60%, #6b9b7a 100%)',
        bird: 'radial-gradient(ellipse at 40% 30%, #a8e6f0 0%, #88d8e6 30%, #68c8d8 60%, #4a9ba8 100%)',
        fox: 'radial-gradient(ellipse at 40% 30%, #ffd4a8 0%, #ffb888 30%, #e89868 60%, #b87848 100%)',
        dragon: 'radial-gradient(ellipse at 40% 30%, #e8d8f0 0%, #d8c0e8 30%, #c8a8e0 60%, #9878b8 100%)'
      }
      return {
        background: colors[this.petConfig?.type] || colors.cat
      }
    },

    petDragData() {
      return {
        type: 'pet',
        action: 'recall',
        pet: this.gameStore.pet
      }
    }
  },

  methods: {
    /**
     * 处理宠物拖拽开始
     */
    handlePetDragStart(event) {
      // 只有在家时才能拖拽
      if (!this.gameStore.pet.isAtHome) {
        event.preventDefault()
        return
      }

      // 设置拖拽效果
      event.dataTransfer.effectAllowed = 'move'

      // 存储宠物拖拽数据
      const dragData = {
        type: 'pet',
        action: 'send',
        pet: this.gameStore.pet
      }
      const dataString = JSON.stringify(dragData)
      event.dataTransfer.setData('application/json', dataString)
      event.dataTransfer.setData('text/plain', dataString)

      console.log('宠物开始拖拽:', this.gameStore.pet.name)
    },

    /**
     * 处理宠物拖拽结束
     */
    handlePetDragEnd(event) {
      console.log('宠物拖拽结束')
    },

    /**
     * 处理点击水晶球
     * 打开合成界面
     */
    handleClick() {
      // 只有宠物在家时才显示合成界面
      if (this.gameStore.pet.isAtHome) {
        this.$emit('open-synthesis')
      } else {
        // 宠物不在家时显示提示
        const notificationStore = useNotificationStore()
        notificationStore.info('宠物外出中，等它回家后再来合成吧！')
      }
    },

    /**
     * 打开合成界面
     */
    openSynthesis() {
      this.$emit('open-synthesis')
    },

    /**
     * 处理拖拽经过
     */
    handleDragOver(event) {
      // 阻止默认行为，允许放置
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },

    /**
     * 处理拖拽进入
     */
    handleDragEnter(event) {
      event.preventDefault()
      this.dragEnterCounter++
      this.isDragOver = true
      this.showVortex = true
      console.log('拖拽进入水晶球')
    },

    /**
     * 处理拖拽离开
     */
    handleDragLeave(event) {
      this.dragEnterCounter--
      if (this.dragEnterCounter <= 0) {
        this.isDragOver = false
        this.showVortex = false
        this.dragEnterCounter = 0
      }
      console.log('拖拽离开水晶球')
    },

    /**
     * 处理放置（核心方法！）
     */
    handleDrop(event) {
      event.preventDefault()
      this.isDragOver = false
      this.showVortex = false
      this.dragEnterCounter = 0

      // 获取拖拽数据
      let data
      try {
        const jsonData = event.dataTransfer.getData('application/json')
        data = JSON.parse(jsonData)
      } catch (e) {
        console.error('解析拖拽数据失败:', e)
        return
      }

      console.log('水晶球接收到拖拽数据：', data)

      // 情况1：放下的是物品（从背包来的食物）
      if (data.type === 'item') {
        this.gameStore.feedPet(data.item)
        return
      }

      // 情况2：放下的是宠物（从户外召回）
      if (data.type === 'pet' && data.action === 'recall') {
        this.gameStore.recallPet()
        // 显示宠物回家通知
        const notificationStore = useNotificationStore()
        notificationStore.info('🏠 宠物回家了！')
        return
      }

      console.log('未知的拖拽类型：', data.type)
    }
  }
}
</script>

<style scoped>
/**
 * 水晶球样式 - 简化版完美圆形
 * 参考合成界面设计风格
 */

/* 水晶球容器 */
.crystal-ball {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 20px;
}

/* 水晶球主体 - 完美圆形 */
.crystal-ball-body {
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%);
  box-shadow:
    0 0 0 4px rgba(139, 92, 246, 0.2),
    0 0 40px rgba(139, 92, 246, 0.3),
    inset 0 0 60px rgba(255, 255, 255, 0.5),
    inset -10px -10px 30px rgba(139, 92, 246, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 拖拽经过时的高亮效果 */
.crystal-ball.drag-over .crystal-ball-body {
  box-shadow:
    0 0 0 4px rgba(139, 92, 246, 0.4),
    0 0 60px rgba(139, 92, 246, 0.5),
    inset 0 0 60px rgba(255, 255, 255, 0.5);
  transform: scale(1.02);
}

/* 内部空间 */
.crystal-ball-inner {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 40%,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(243, 232, 255, 0.7) 40%,
    rgba(233, 213, 255, 0.5) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 光泽效果 */
.crystal-ball-shine {
  position: absolute;
  top: 30px;
  left: 50px;
  width: 60px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.8) 0%,
    transparent 70%
  );
  transform: rotate(-30deg);
  pointer-events: none;
}

/* 宠物简单显示 */
.pet-simple-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: grab;
  user-select: none;
  transition: transform 0.2s ease;
  position: relative;
  z-index: 10;
}

.pet-simple-display:active {
  cursor: grabbing;
}

.pet-simple-display:hover {
  transform: scale(1.05);
}

.simple-avatar {
  width: 100px;
  height: 90px;
  border-radius: 50% 50% 45% 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 15px rgba(107, 155, 122, 0.3),
    inset -2px -2px 6px rgba(0, 0, 0, 0.1),
    inset 2px 2px 6px rgba(255, 255, 255, 0.4);
}

.simple-emoji {
  font-size: 48px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.simple-name {
  font-size: 16px;
  font-weight: 600;
  color: #6b21a8;
}

.simple-hint {
  font-size: 12px;
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
  padding: 4px 12px;
  border-radius: 10px;
}

/* 空状态提示 */
.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
}

/* 合成按钮 */
.synthesis-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border: none;
  border-radius: 24px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  transition: all 0.3s ease;
  animation: btn-float 2s ease-in-out infinite;
}

.synthesis-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
}

.btn-icon {
  font-size: 18px;
}

@keyframes btn-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
</style>
