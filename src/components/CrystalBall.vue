<!--
  CrystalBall.vue - 水晶球组件（游戏核心）

  手绘风水晶球设计 - 完美圆形，柔和紫色主题
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
        <!-- 天文台穹顶特效 - 包含玻璃覆盖层 -->
        <ObservatoryDome :is-open="showVortex || isDragOver" />

        <!-- 宠物显示（可拖拽） - 永远在玻璃层下方 -->
        <div
          v-if="gameStore.pet.isAtHome"
          class="pet-simple-display"
          draggable="true"
          @dragstart="handlePetDragStart"
          @dragend="handlePetDragEnd"
        >
          <div class="simple-avatar" :style="avatarStyle">
            <SlugcatAvatar :status="gameStore.pet.status" :pet-type="petConfig?.type" :size="80" />
          </div>
          <div class="simple-name">{{ gameStore.pet.name }}</div>
          <div class="simple-hint">拖拽我到右侧玩耍</div>
        </div>

        <!-- 宠物不在家时的提示 -->
        <div v-else class="empty-hint">
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
      <PotionIcon class="btn-icon" rarity="epic" />
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
import ObservatoryDome from './ObservatoryDome.vue'
import SlugcatAvatar from './icons/SlugcatAvatar.vue'
import PotionIcon from './icons/items/PotionIcon.vue'

export default {
  name: 'CrystalBall',

  components: {
    ObservatoryDome,
    SlugcatAvatar,
    PotionIcon
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

    avatarStyle() {
      const type = this.petConfig?.type || 'cat'
      return {
        background: `var(--mp-pet-${type}-gradient, var(--mp-pet-cat-gradient))`
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
    },

    /**
     * 处理宠物拖拽结束
     */
    handlePetDragEnd(event) {
      // 拖拽结束，可在此扩展后续反馈
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
        notificationStore.info('宠物回家了！')
        return
      }

      console.log('未知的拖拽类型：', data.type)
    }
  }
}
</script>

<style scoped>
/**
 * 水晶球样式 - 手绘风发光球体
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

/* 水晶球主体 - 完美圆形，带呼吸动画 */
.crystal-ball-body {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 30%,
    color-mix(in srgb, var(--mp-white) 95%, transparent) 0%,
    color-mix(in srgb, color-mix(in srgb, var(--mp-purple) 10%, var(--mp-white)) 80%, transparent) 40%,
    color-mix(in srgb, color-mix(in srgb, var(--mp-purple) 20%, var(--mp-white)) 60%, transparent) 100%
  );
  border: 5px solid var(--mp-purple);
  box-shadow:
    0 0 0 4px var(--mp-crystal-ring),
    0 0 50px var(--mp-crystal-glow),
    8px 8px 0 var(--mp-shadow-color),
    inset 0 0 60px color-mix(in srgb, var(--mp-white) 60%, transparent),
    inset -10px -10px 30px var(--mp-crystal-ring);
  overflow: hidden;
  transition: all 0.3s ease;
  animation: crystal-breathe 3s ease-in-out infinite;
}

@keyframes crystal-breathe {
  0%, 100% {
    transform: scale(1);
    box-shadow:
      0 0 0 4px var(--mp-crystal-ring),
      0 0 50px var(--mp-crystal-glow),
      8px 8px 0 var(--mp-shadow-color),
      inset 0 0 60px color-mix(in srgb, var(--mp-white) 60%, transparent);
  }
  50% {
    transform: scale(1.02);
    box-shadow:
      0 0 0 6px var(--mp-crystal-ring-strong),
      0 0 70px var(--mp-crystal-glow-strong),
      8px 8px 0 var(--mp-shadow-color),
      inset 0 0 70px color-mix(in srgb, var(--mp-white) 70%, transparent);
  }
}

/* 拖拽经过时的高亮效果 - 金色吸入动画 */
.crystal-ball.drag-over .crystal-ball-body {
  border-color: var(--mp-gold);
  box-shadow:
    0 0 0 6px var(--mp-crystal-gold-ring),
    0 0 80px var(--mp-crystal-gold-glow),
    8px 8px 0 var(--mp-shadow-color);
  animation: mp-pulse 0.8s var(--mp-ease-bounce) infinite;
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
    color-mix(in srgb, var(--mp-white) 90%, transparent) 0%,
    color-mix(in srgb, color-mix(in srgb, var(--mp-purple) 10%, var(--mp-white)) 70%, transparent) 40%,
    color-mix(in srgb, color-mix(in srgb, var(--mp-purple) 20%, var(--mp-white)) 50%, transparent) 100%
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
    color-mix(in srgb, var(--mp-white) 80%, transparent) 0%,
    transparent 70%
  );
  transform: rotate(-30deg);
  pointer-events: none;
}

/* 宠物简单显示 - 在玻璃后方 */
.pet-simple-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: grab;
  user-select: none;
  transition: transform 0.2s ease;
  position: relative;
  z-index: 3;  /* 在玻璃覆盖层之下（ObservatoryDome glass-cover 是 z-index: 5） */
  /* 玻璃后方效果 */
  filter: blur(0.5px);
  opacity: 0.9;
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
    0 4px 15px var(--mp-shadow-color),
    inset -2px -2px 6px color-mix(in srgb, var(--mp-ink) 10%, transparent),
    inset 2px 2px 6px color-mix(in srgb, var(--mp-white) 40%, transparent);
}

.simple-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--mp-purple-dark);
}

.simple-hint {
  font-size: 12px;
  color: var(--mp-purple);
  background: color-mix(in srgb, var(--mp-purple) 10%, transparent);
  padding: 4px 12px;
  border-radius: 10px;
}

/* 空状态提示 */
.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--mp-text-muted);
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
  background: linear-gradient(135deg, var(--mp-purple) 0%, var(--mp-purple-dark) 100%);
  border: none;
  border-radius: 24px;
  color: var(--mp-white);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px var(--mp-crystal-glow);
  transition: all 0.3s ease;
  animation: btn-float 2s ease-in-out infinite;
}

.synthesis-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px var(--mp-crystal-glow-strong);
}

.btn-icon {
  width: 20px;
  height: 20px;
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
