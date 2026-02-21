<!--
  CrystalBall.vue - 水晶球组件（游戏核心）

  这是游戏中最重要的组件！水晶球是宠物居住的地方，
  也是所有交互的中心。

  主要功能：
  1. 显示水晶球视觉效果（紫色魔法球体）
  2. 接收拖拽的物品（从背包来的食物）- 使用原生 HTML5 拖拽 API
  3. 接收拖拽的宠物（从户外召回）- 使用原生 HTML5 拖拽 API
  4. 显示旋涡特效（当有东西被拖入时）
  5. 显示宠物（当宠物在家时）

  拖拽交互：
  - 拖拽物品到水晶球 = 喂养宠物
  - 拖拽宠物到水晶球 = 召回宠物回家
-->

<template>
  <!--
    水晶球容器
    使用原生 HTML5 拖拽 API
    @dragover: 拖拽经过时触发
    @dragenter: 拖拽进入时触发
    @dragleave: 拖拽离开时触发
    @drop: 放下时触发
  -->
  <div
    class="crystal-ball"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- ==================== 水晶球外壳 ==================== -->
    <div class="crystal-ball-outer">
      <!-- 内层球体 - 宠物生活的地方 -->
      <div class="crystal-ball-inner">

        <!-- 魔法旋涡特效 -->
        <MagicVortex v-if="showVortex || isDragOver" />

        <!-- 宠物组件 -->
        <div v-if="gameStore.pet.isAtHome" class="pet-wrapper">
          <Pet
            :pet="gameStore.pet"
            draggable="true"
            @dragstart="handlePetDragStart"
            @dragend="handlePetDragEnd"
          />
        </div>

        <!-- 地毯装饰 -->
        <div class="carpet"></div>

      </div>
    </div>

    <!-- ==================== 水晶球底座 ==================== -->
    <div class="crystal-ball-base"></div>

    <!-- ==================== 合成入口提示 ==================== -->
    <div
      v-if="showSynthesisHint"
      class="synthesis-hint"
      @click.stop="openSynthesis"
    >
      <span class="hint-icon">🔮</span>
      <span class="hint-text">{{ $t('synthesis.clickToSynthesize') }}</span>
    </div>

  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useGameStore } from '../stores/game.js'
import { useNotificationStore } from '../stores/notification.js'
import MagicVortex from './MagicVortex.vue'
import Pet from './Pet.vue'

export default {
  name: 'CrystalBall',

  components: {
    MagicVortex,
    Pet
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
    ...mapStores(useGameStore),

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
      // 设置拖拽效果
      event.dataTransfer.effectAllowed = 'move'

      // 存储宠物拖拽数据
      const dataString = JSON.stringify(this.petDragData)
      event.dataTransfer.setData('application/json', dataString)
      event.dataTransfer.setData('text/plain', dataString)

      console.log('宠物开始拖拽:', this.gameStore.pet.name)
    },

    /**
     * 处理宠物拖拽结束
     */
    handlePetDragEnd(event) {
      console.log('宠物拖拽结束')
      this.showVortex = false
      this.isDragOver = false
      this.dragEnterCounter = 0
      this.showSynthesisHint = true
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
 * 水晶球样式
 */

/* 水晶球容器 - 完美圆形 */
.crystal-ball {
  position: relative;
  border-radius: 50%;
  width: 320px;
  height: 320px;
  flex-shrink: 0;
  flex-grow: 0;
  cursor: pointer;
  z-index: 1;
  overflow: visible;
  transition: all 0.3s ease;
}

/* 拖拽经过时的高亮效果 */
.crystal-ball.drag-over {
  box-shadow: 0 0 50px rgba(197, 179, 224, 0.8);
  transform: scale(1.02);
}

/* 水晶球外壳 - 玻璃效果 - pastel 薰衣草色 */
.crystal-ball-outer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  box-shadow:
    inset -10px -10px 20px rgba(0, 0, 0, 0.15),
    inset 10px 10px 20px rgba(255, 255, 255, 0.4),
    0 0 30px var(--glow-color),
    0 0 60px rgba(197, 179, 224, 0.3),
    0 20px 40px rgba(0, 0, 0, 0.15);
  background: radial-gradient(
    ellipse at 30% 30%,
    rgba(230, 224, 245, 0.9) 0%,
    rgba(197, 179, 224, 0.7) 30%,
    rgba(155, 142, 199, 0.8) 70%,
    rgba(120, 110, 160, 0.95) 100%
  );
  overflow: hidden;
}

/* 水晶球内部 - 宠物生活的空间 - pastel 天空蓝 */
.crystal-ball-inner {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 40% 40%,
    rgba(168, 216, 234, 0.4) 0%,
    rgba(197, 179, 224, 0.3) 40%,
    rgba(100, 90, 140, 0.5) 100%
  );
}

/* 宠物包装器 - 确保宠物正确显示在水晶球中央 */
.pet-wrapper {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  /* 高度自适应，容纳头像+名字+状态条 */
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  pointer-events: none;
  z-index: 10;
}

.pet-wrapper :deep(.pet-container) {
  pointer-events: auto;
  cursor: move;
}

/* 地毯 - 宠物站立的地方 - pastel 粉 */
.carpet {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 70px;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    #f8c3cd 0%,
    #e8a8b5 70%,
    #d895a3 100%
  );
  box-shadow:
    inset 0 -5px 10px rgba(0, 0, 0, 0.2),
    0 5px 15px rgba(0, 0, 0, 0.15);
  z-index: 5;
}

/* 水晶球底座 - pastel 紫灰木色 */
.crystal-ball-base {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(
    to bottom,
    #b8a9c9 0%,
    #9b8ec7 40%,
    #7a6fa3 100%
  );
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.2),
    inset 0 -5px 10px rgba(0, 0, 0, 0.2);
}

/* 合成入口提示 */
.synthesis-hint {
  position: absolute;
  bottom: -70px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: hint-float 2s ease-in-out infinite;
}

.synthesis-hint:hover {
  transform: translateX(-50%) translateY(-3px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
}

@keyframes hint-float {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-5px);
  }
}

.hint-icon {
  font-size: 18px;
}

.hint-text {
  font-size: 14px;
  font-weight: 600;
  color: white;
}
</style>
