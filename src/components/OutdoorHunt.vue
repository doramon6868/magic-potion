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
    <!-- ==================== 区域标题 ==================== -->
    <div class="zone-header">
      <!-- 危险图标 -->
      <span class="zone-icon">⚔️</span>
      <!-- 区域名称 -->
      <span class="zone-name">游猎区</span>
      <!-- 危险等级 -->
      <span class="zone-safety danger">危险</span>
    </div>

    <!-- ==================== 区域说明 ==================== -->
    <div class="zone-description">
      带宠物来这里战斗，获得金币奖励
      <br>
      <span class="warning-text">⚠️ 有 10% 几率死亡</span>
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
        <span class="hint-icon">⚔️</span>
        <span class="hint-text">拖拽宠物来战斗</span>
      </div>
    </div>

    <!-- ==================== 收益/风险显示 ==================== -->
    <div v-if="outdoorStore.huntingPet" class="reward-preview">
      <div class="reward-item">
        <span class="reward-icon">💰</span>
        <span class="reward-text">金币 +50~100</span>
      </div>
      <div class="risk-item">
        <span class="risk-icon">💀</span>
        <span class="risk-text">死亡几率 10%</span>
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

export default {
  // 组件名称
  name: 'OutdoorHunt',

  // 注册子组件
  components: {
    Pet
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
  border-radius: 20px;
  /**
   * 背景 - pastel 柔和珊瑚色渐变
   */
  background: linear-gradient(
    180deg,
    rgba(255, 179, 186, 0.6) 0%,
    rgba(255, 194, 199, 0.7) 50%,
    rgba(255, 138, 149, 0.8) 100%
  );
  border: 2px solid rgba(255, 179, 186, 0.5);
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(255, 179, 186, 0.3);
}

/* 拖拽高亮状态 - pastel 珊瑚 */
.outdoor-hunt.drop-target {
  border-color: rgba(255, 179, 186, 0.9);
  box-shadow:
    0 0 30px rgba(255, 179, 186, 0.6),
    inset 0 0 20px rgba(255, 179, 186, 0.3);
  transform: scale(1.02);
}

/* ==================== 区域标题 ==================== */

.zone-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.zone-icon {
  font-size: 24px;
  margin-right: 8px;
}

.zone-name {
  font-size: 18px;
  font-weight: bold;
  color: #d66a75;
}

/* 危险等级标签 - pastel 珊瑚 */
.zone-safety.danger {
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
  background: rgba(255, 179, 186, 0.5);
  color: #d66a75;
  border: 1px solid rgba(255, 179, 186, 0.7);
}

/* ==================== 区域说明 ==================== */

.zone-description {
  text-align: center;
  font-size: 12px;
  color: rgba(140, 80, 90, 0.9);
  margin-bottom: 15px;
}

/* 警告文字 */
.warning-text {
  color: #d66a75;
  font-weight: bold;
}

/* ==================== 宠物区域 ==================== */

.pet-area {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
}

.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(140, 80, 90, 0.6);
}

.hint-icon {
  font-size: 32px;
  margin-bottom: 8px;
  animation: pulse 1s ease-in-out infinite;
}

.hint-text {
  font-size: 14px;
}

/* ==================== 收益预览 ==================== */

.reward-preview {
  margin-top: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
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

.reward-icon,
.risk-icon {
  font-size: 16px;
  margin-right: 8px;
}

.reward-text {
  font-size: 12px;
  color: #e6a700;
}

.risk-text {
  font-size: 12px;
  color: #d66a75;
  font-weight: bold;
}

/* ==================== 战斗主题装饰 ==================== */

/* 战斗装饰容器 */
.battle-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

/* 月亮 */
.moon {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 40px;
  animation: moonGlow 3s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(200, 200, 255, 0.6));
}

@keyframes moonGlow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(200, 200, 255, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(200, 200, 255, 0.9));
  }
}

/* 火焰 */
.fire {
  position: absolute;
  font-size: 24px;
  animation: flicker 0.5s ease-in-out infinite;
}

.fire-1 {
  bottom: 10px;
  left: 15px;
  animation-delay: 0s;
}

.fire-2 {
  bottom: 15px;
  right: 20px;
  font-size: 30px;
  animation-delay: 0.2s;
}

.fire-3 {
  bottom: 5px;
  left: 45%;
  font-size: 20px;
  animation-delay: 0.4s;
}

@keyframes flicker {
  0%, 100% {
    transform: scale(1) rotate(-2deg);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.1) rotate(2deg);
    opacity: 1;
  }
}

/* 武器装饰 */
.weapon {
  position: absolute;
  font-size: 28px;
  animation: weaponShine 2s ease-in-out infinite;
}

.weapon-1 {
  top: 30%;
  left: 10px;
  transform: rotate(-45deg);
  animation-delay: 0s;
}

.weapon-2 {
  top: 50%;
  right: 10px;
  transform: rotate(30deg);
  animation-delay: 0.5s;
}

.weapon-3 {
  bottom: 20%;
  left: 20%;
  font-size: 32px;
  animation-delay: 1s;
}

@keyframes weaponShine {
  0%, 100% {
    filter: brightness(1);
    transform: rotate(var(--rotation, 0deg)) scale(1);
  }
  50% {
    filter: brightness(1.3);
    transform: rotate(var(--rotation, 0deg)) scale(1.1);
  }
}

/* 骷髅装饰 */
.skull {
  position: absolute;
  font-size: 20px;
  opacity: 0.6;
  animation: skullFloat 4s ease-in-out infinite;
}

.skull-1 {
  top: 60%;
  left: 15%;
  animation-delay: 0s;
}

.skull-2 {
  top: 40%;
  right: 15%;
  font-size: 24px;
  animation-delay: 2s;
}

@keyframes skullFloat {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
    opacity: 0.8;
  }
}

/* 蝙蝠 */
.bat {
  position: absolute;
  font-size: 18px;
  animation: fly 6s ease-in-out infinite;
}

.bat-1 {
  top: 20%;
  left: 30%;
  animation-delay: 0s;
}

.bat-2 {
  top: 35%;
  left: 60%;
  font-size: 22px;
  animation-delay: 2s;
}

.bat-3 {
  top: 15%;
  left: 50%;
  font-size: 16px;
  animation-delay: 4s;
}

@keyframes fly {
  0%, 100% {
    transform: translate(0, 0) scaleX(1);
  }
  25% {
    transform: translate(20px, -10px) scaleX(-1);
  }
  50% {
    transform: translate(40px, 5px) scaleX(-1);
  }
  75% {
    transform: translate(10px, 10px) scaleX(1);
  }
}

/* ==================== 动画定义 ==================== */

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}
</style>
