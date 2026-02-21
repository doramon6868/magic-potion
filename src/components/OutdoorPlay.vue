<!--
  OutdoorPlay.vue - 户外玩耍区（森林）

  这是游戏左侧的区域，代表低风险的户外探索区域
  宠物可以拖拽到这里进行玩耍，不会受伤

  主要功能：
  1. 显示森林场景
  2. 接收拖拽的宠物（从水晶球来的）
  3. 开始玩耍计时
  4. 显示在这里的宠物状态

  玩法：
  - 将宠物从水晶球拖拽到这里
  - 宠物开始玩耍，增加心情
  - 一段时间后自动回家或需要手动召回
-->

<template>
  <!--
    户外玩耍区容器
    使用原生 HTML5 拖拽 API
  -->
  <div
    class="outdoor-play"
    :class="{ 'drop-target': isDropTarget }"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- ==================== 区域标题 ==================== -->
    <div class="zone-header">
      <!-- 森林图标 -->
      <span class="zone-icon">🌲</span>
      <!-- 区域名称 -->
      <span class="zone-name">{{ $t('areas.forest.name') }}</span>
      <!-- 安全等级 -->
      <span class="zone-safety safe">{{ $t('areas.forest.tag') }}</span>
    </div>

    <!-- ==================== 区域说明 ==================== -->
    <div class="zone-description">
      {{ $t('areas.forest.description') }}
    </div>

    <!-- ==================== 宠物显示区 ==================== -->
    <div class="pet-area">
      <!--
        当宠物在这里时显示
        outdoorStore.playingPet 存储在玩耍区的宠物
      -->
      <Pet
        v-if="outdoorStore.playingPet"
        :pet="outdoorStore.playingPet"
        draggable="true"
        @dragstart="handlePetDragStart"
        @dragend="handlePetDragEnd"
      />

      <!-- 没有宠物时的提示 -->
      <div v-else class="empty-hint">
        <span class="hint-icon">👆</span>
        <span class="hint-text">{{ $t('areas.forest.hint') }}</span>
      </div>
    </div>

    <!-- ==================== 收益显示 ==================== -->
    <div v-if="outdoorStore.playingPet" class="reward-preview">
      <div class="reward-item">
        <span class="reward-icon">😊</span>
        <span class="reward-text">{{ $t('areas.forest.reward') }}</span>
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
  name: 'OutdoorPlay',

  // 注册子组件
  components: {
    Pet
  },

  // 组件内部状态
  data() {
    return {
      /**
       * isDropTarget: 是否是高亮的放置目标
       * 当用户拖拽宠物到这里时设为 true
       */
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
    // 映射 stores
    ...mapStores(useGameStore, useOutdoorStore),

    /**
     * dragData: 拖拽时传递的数据
     * 当用户拖拽宠物回去时使用
     */
    dragData() {
      return {
        type: 'pet',
        action: 'recall',
        pet: this.outdoorStore.playingPet,
        source: 'play' // 标记来自玩耍区
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
      console.log('拖拽进入森林')
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
      console.log('拖拽离开森林')
    },

    /**
     * handleDrop: 处理拖拽放下
     * 当宠物被拖拽到玩耍区时调用
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

      console.log('玩耍区接收到拖拽数据：', data)

      // 检查是否是宠物
      if (data.type !== 'pet') {
        console.log('玩耍区只接受宠物')
        return
      }

      // 调用 store 方法让宠物开始玩耍
      this.outdoorStore.sendToPlay(data.pet)

      // 同时更新游戏主状态
      this.gameStore.sendPetOutdoor('play')
    },

    /**
     * handlePetDragStart: 宠物开始拖拽（从森林召回）
     */
    handlePetDragStart(event) {
      event.dataTransfer.effectAllowed = 'move'
      const dataString = JSON.stringify(this.dragData)
      event.dataTransfer.setData('application/json', dataString)
      event.dataTransfer.setData('text/plain', dataString)
      console.log('宠物开始从森林拖拽:', this.outdoorStore.playingPet?.name)
    },

    /**
     * handlePetDragEnd: 宠物拖拽结束
     */
    handlePetDragEnd(event) {
      console.log('宠物从森林拖拽结束')
    }
  }
}
</script>

<style scoped>
/**
 * 户外玩耍区样式
 */

/* 区域容器 */
.outdoor-play {
  /* 相对定位 */
  position: relative;
  /* 使用 flex 垂直排列 */
  display: flex;
  flex-direction: column;
  /* 尺寸 */
  width: 100%;
  height: 100%;
  /* 内边距 */
  padding: 15px;
  /* 圆角 */
  border-radius: 20px;
  /**
   * 背景 - pastel 薄荷绿色渐变
   */
  background: linear-gradient(
    180deg,
    rgba(168, 230, 207, 0.6) 0%,
    rgba(184, 224, 210, 0.7) 50%,
    rgba(127, 205, 187, 0.8) 100%
  );
  /* 边框 */
  border: 2px solid rgba(168, 230, 207, 0.5);
  /* 过渡动画 */
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(168, 230, 207, 0.3);
}

/* 拖拽高亮状态 */
.outdoor-play.drop-target {
  /* 边框变亮 */
  border-color: rgba(168, 230, 207, 0.9);
  /* 阴影 */
  box-shadow:
    0 0 30px rgba(168, 230, 207, 0.6),
    inset 0 0 20px rgba(168, 230, 207, 0.3);
  /* 放大一点 */
  transform: scale(1.02);
}

/* ==================== 区域标题 ==================== */

.zone-header {
  /* 使用 flex */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 下边距 */
  margin-bottom: 10px;
}

/* 区域图标 */
.zone-icon {
  font-size: 24px;
  margin-right: 8px;
}

/* 区域名称 */
.zone-name {
  font-size: 18px;
  font-weight: bold;
  color: #5a9a8a;
}

/* 安全等级标签 */
.zone-safety {
  /* 左边距 */
  margin-left: 8px;
  /* 内边距 */
  padding: 2px 8px;
  /* 圆角 */
  border-radius: 10px;
  /* 文字大小 */
  font-size: 12px;
  font-weight: bold;
}

/* 安全 - pastel 薄荷绿 */
.zone-safety.safe {
  background: rgba(168, 230, 207, 0.5);
  color: #5a9a8a;
  border: 1px solid rgba(168, 230, 207, 0.7);
}

/* ==================== 区域说明 ==================== */

.zone-description {
  /* 文字居中 */
  text-align: center;
  /* 文字大小 */
  font-size: 12px;
  /* 颜色 */
  color: rgba(90, 120, 110, 0.9);
  /* 下边距 */
  margin-bottom: 15px;
}

/* ==================== 宠物区域 ==================== */

.pet-area {
  /* 占据剩余空间 */
  flex: 1;
  /* 相对定位，让宠物可以定位 */
  position: relative;
  /* 使用 flex 居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 最小高度 */
  min-height: 150px;
}

/* 空状态提示 */
.empty-hint {
  /* 使用 flex 垂直排列 */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 颜色 */
  color: rgba(90, 120, 110, 0.6);
}

/* 提示图标 */
.hint-icon {
  font-size: 32px;
  margin-bottom: 8px;
  /* 动画 - 上下移动 */
  animation: point-down 1s ease-in-out infinite;
}

/* 提示文字 */
.hint-text {
  font-size: 14px;
}

/* ==================== 收益预览 ==================== */

.reward-preview {
  /* 上边距 */
  margin-top: 10px;
  /* 内边距 */
  padding: 10px;
  /* 背景 */
  background: rgba(255, 255, 255, 0.4);
  /* 圆角 */
  border-radius: 10px;
}

/* 收益项 */
.reward-item {
  /* 使用 flex */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 收益图标 */
.reward-icon {
  font-size: 20px;
  margin-right: 8px;
}

/* 收益文字 */
.reward-text {
  font-size: 14px;
  color: #5a9a8a;
}

/* ==================== 森林主题装饰 ==================== */

/* 森林装饰容器 */
.forest-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

/* 太阳 */
.sun {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 40px;
  animation: sunPulse 3s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(255, 200, 0, 0.8));
}

@keyframes sunPulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 20px rgba(255, 200, 0, 0.8));
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 30px rgba(255, 200, 0, 1));
  }
}

/* 云朵 */
.cloud {
  position: absolute;
  font-size: 30px;
  opacity: 0.8;
  animation: float 8s ease-in-out infinite;
}

.cloud-1 {
  top: 20px;
  left: 20px;
  animation-delay: 0s;
}

.cloud-2 {
  top: 40px;
  left: 60%;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(20px);
  }
}

/* 树木装饰 */
.tree {
  position: absolute;
  font-size: 36px;
  bottom: 10px;
  animation: treeSway 4s ease-in-out infinite;
}

.tree-1 {
  left: 10px;
  animation-delay: 0s;
}

.tree-2 {
  left: 35%;
  font-size: 44px;
  animation-delay: 1s;
}

.tree-3 {
  right: 10px;
  animation-delay: 2s;
}

.tree-4 {
  right: 30%;
  font-size: 32px;
  animation-delay: 0.5s;
}

@keyframes treeSway {
  0%, 100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

/* 花朵 */
.flower {
  position: absolute;
  font-size: 20px;
  bottom: 5px;
  animation: bloom 2s ease-in-out infinite;
}

.flower-1 {
  left: 25%;
  animation-delay: 0s;
}

.flower-2 {
  left: 50%;
  animation-delay: 0.7s;
}

.flower-3 {
  right: 25%;
  animation-delay: 1.4s;
}

@keyframes bloom {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* 草地 */
.grass {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 60px;
  opacity: 0.3;
}

/* ==================== 动画定义 ==================== */

/* 手指指向动画 */
@keyframes point-down {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
}
</style>
