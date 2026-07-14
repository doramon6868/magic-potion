<!--
  OutdoorHunt.vue - 户外游猎区（危险区域）

  这是游戏右侧的区域，代表高风险的战斗区域
  宠物可以拖拽到这里进行战斗，获得奖励但也有风险

  主要功能：
  1. 显示危险场景
  2. 接收拖拽的宠物
  3. 开始战斗计时
  4. 计算战斗结果（10%死亡几率）

  玩法：
  - 将宠物从水晶球拖拽到这里
  - 宠物开始战斗
  - 战斗结束后可能获得奖励，也可能死亡
  - 死亡的宠物可以用药水复活
-->

<template>
  <!--
    游猎区容器
    使用原生 HTML5 拖拽 API
  -->
  <div
    class="outdoor-hunt"
    :class="{ 'drop-target': isDropTarget }"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- ==================== 危险装饰 ==================== -->
    <div class="hunt-decoration">
      <FireDecoration class="fire fire-1" />
      <FireDecoration class="fire fire-2" />
      <BatDecoration class="bat bat-1" />
      <BatDecoration class="bat bat-2" />
    </div>

    <!-- ==================== 区域标题 ==================== -->
    <div class="zone-header">
      <FireDecoration class="zone-icon" />
      <span class="zone-name">{{ $t('areas.hunt.name') }}</span>
      <span class="zone-safety danger">{{ $t('areas.hunt.tag') }}</span>
    </div>

    <!-- ==================== 区域说明 ==================== -->
    <div class="zone-description">
      {{ $t('areas.hunt.description') }}
      <br>
      <span class="warning-text">{{ $t('areas.hunt.warning') }}</span>
    </div>

    <!-- ==================== 宠物显示区 ==================== -->
    <div class="pet-area">
      <Pet
        v-if="outdoorStore.huntingPet"
        :pet="outdoorStore.huntingPet"
        draggable="true"
        @dragstart="handlePetDragStart"
        @dragend="handlePetDragEnd"
      />

      <div v-else class="empty-hint">
        <span class="hint-text">{{ $t('areas.hunt.hint') }}</span>
      </div>
    </div>

    <!-- ==================== 收益/风险显示 ==================== -->
    <div v-if="outdoorStore.huntingPet" class="reward-preview">
      <div class="reward-item">
        <CoinBagIcon class="reward-icon" />
        <span class="reward-text">{{ $t('areas.hunt.reward') }}</span>
      </div>
      <div class="risk-item">
        <span class="risk-marker">!</span>
        <span class="risk-text">{{ $t('areas.hunt.deathChance') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// ==================== 导入依赖 ====================
import { mapStores } from 'pinia'
import { useGameStore } from '../stores/game.js'
import { useOutdoorStore } from '../stores/outdoor.js'
import Pet from './Pet.vue'
import FireDecoration from './icons/decorations/FireDecoration.vue'
import BatDecoration from './icons/decorations/BatDecoration.vue'
import CoinBagIcon from './icons/ui/CoinBagIcon.vue'

export default {
  // 组件名称
  name: 'OutdoorHunt',

  // 注册子组件
  components: {
    Pet,
    FireDecoration,
    BatDecoration,
    CoinBagIcon
  },

  // 组件内部状态
  data() {
    return {
      isDropTarget: false,
      /**
       * dragEnterCounter: 拖拽进入计数器
       * 用于处理嵌套元素的 dragenter/dragleave 问题
       */
      dragEnterCounter: 0
    }
  },

  // 计算属性
  computed: {
    ...mapStores(useGameStore, useOutdoorStore),

    dragData() {
      return {
        type: 'pet',
        action: 'recall',
        pet: this.outdoorStore.huntingPet,
        source: 'hunt'
      }
    }
  },

  // 方法
  methods: {
    /**
     * handleDragOver: 拖拽经过时
     */
    handleDragOver(event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },

    /**
     * handleDragEnter: 拖拽进入时的处理
     */
    handleDragEnter(event) {
      event.preventDefault()
      this.dragEnterCounter++
      this.isDropTarget = true
      console.log('拖拽进入游猎区')
    },

    /**
     * handleDragLeave: 拖拽离开时的处理
     */
    handleDragLeave(event) {
      this.dragEnterCounter--
      if (this.dragEnterCounter <= 0) {
        this.isDropTarget = false
        this.dragEnterCounter = 0
      }
      console.log('拖拽离开游猎区')
    },

    /**
     * handleDrop: 处理拖拽放下
     * 当宠物被拖拽到游猎区时调用
     */
    handleDrop(event) {
      // 重置状态
      this.isDropTarget = false
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

      console.log('游猎区接收到拖拽数据：', data)

      if (data.type !== 'pet') {
        console.log('游猎区只接受宠物')
        return
      }

      // 调用 store 方法让宠物开始战斗
      this.outdoorStore.sendToHunt(data.pet)

      // 更新游戏主状态
      this.gameStore.sendPetOutdoor('hunt')
    },

    /**
     * handlePetDragStart: 宠物开始拖拽（从游猎区召回）
     */
    handlePetDragStart(event) {
      event.dataTransfer.effectAllowed = 'move'
      const dataString = JSON.stringify(this.dragData)
      event.dataTransfer.setData('application/json', dataString)
      event.dataTransfer.setData('text/plain', dataString)
      console.log('宠物开始从游猎区拖拽:', this.outdoorStore.huntingPet?.name)
    },

    /**
     * handlePetDragEnd: 宠物拖拽结束
     */
    handlePetDragEnd(event) {
      console.log('宠物从游猎区拖拽结束')
    }
  }
}
</script>

<style scoped>
/**
 * 游猎区样式
 * 使用红色调表示危险
 */

/* 区域容器 */
.outdoor-hunt {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 15px;
  border-radius: var(--mp-radius-lg);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--mp-red) 30%, var(--mp-white)) 0%,
    color-mix(in srgb, var(--mp-red) 20%, var(--mp-white)) 50%,
    color-mix(in srgb, var(--mp-red) 40%, var(--mp-white)) 100%
  );
  border: 4px solid var(--mp-red);
  box-shadow: var(--mp-shadow);
  transition: all 0.3s ease;
  overflow: hidden;
}

/* 拖拽高亮状态 - 火焰发光 */
.outdoor-hunt.drop-target {
  border-color: var(--mp-gold);
  box-shadow: 0 0 30px var(--mp-crystal-gold-glow);
  animation: hunt-fire 0.8s ease-in-out infinite;
}

@keyframes hunt-fire {
  0%, 100% { box-shadow: 0 0 20px color-mix(in srgb, var(--mp-red) 40%, transparent); }
  50% { box-shadow: 0 0 40px color-mix(in srgb, var(--mp-red) 70%, transparent); }
}

/* 危险装饰容器 */
.hunt-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

/* 火焰装饰 */
.fire {
  position: absolute;
  bottom: 10px;
  width: 30px;
  animation: flicker 0.5s ease-in-out infinite;
}

.fire-1 { left: 15px; }
.fire-2 { right: 20px; animation-delay: 0.2s; }

@keyframes flicker {
  0%, 100% { transform: scale(1) rotate(-2deg); opacity: 0.9; }
  50% { transform: scale(1.1) rotate(2deg); opacity: 1; }
}

/* 蝙蝠装饰 */
.bat {
  position: absolute;
  width: 30px;
  animation: bat-fly 5s ease-in-out infinite;
}

.bat-1 { top: 20%; left: 20%; }
.bat-2 { top: 35%; right: 15%; animation-delay: -2s; }

@keyframes bat-fly {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(20px, -10px); }
  50% { transform: translate(40px, 5px); }
  75% { transform: translate(10px, 10px); }
}

/* ==================== 区域标题 ==================== */

.zone-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.zone-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.zone-name {
  font-size: 18px;
  font-weight: bold;
  color: var(--mp-ink);
}

.zone-safety {
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
}

.zone-safety.danger {
  background: color-mix(in srgb, var(--mp-red) 50%, transparent);
  color: var(--mp-ink);
  border: 1px solid var(--mp-red);
}

/* ==================== 区域说明 ==================== */

.zone-description {
  position: relative;
  z-index: 1;
  text-align: center;
  font-size: 12px;
  color: var(--mp-text-muted);
  margin-bottom: 15px;
}

/* 警告文字 */
.warning-text {
  color: var(--mp-red);
  font-weight: bold;
}

/* ==================== 宠物区域 ==================== */

.pet-area {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
}

.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--mp-text-muted);
}

.hint-text {
  font-size: 14px;
}

/* ==================== 收益预览 ==================== */

.reward-preview {
  position: relative;
  z-index: 1;
  margin-top: 10px;
  padding: 10px;
  background: color-mix(in srgb, var(--mp-white) 40%, transparent);
  border-radius: var(--mp-radius-md);
}

.reward-item,
.risk-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
}

.risk-item {
  margin-bottom: 0;
}

.reward-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.reward-text {
  font-size: 12px;
  color: var(--mp-gold);
  font-weight: 600;
}

.risk-marker {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  background: var(--mp-red);
  color: var(--mp-white);
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
}

.risk-text {
  font-size: 12px;
  color: var(--mp-red);
  font-weight: bold;
}
</style>
