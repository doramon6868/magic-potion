<!--
  OutdoorPlay.vue - 户外玩耍区（森林）

  这是游戏左侧的区域，代表低风险的户外探索区域
  宠物可以拖拽到这里进行玩耍，不会受伤

  主要功能：
  1. 显示手绘森林场景
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
    <!-- 森林装饰 -->
    <div class="forest-decoration">
      <TreeDecoration class="tree tree-1" />
      <TreeDecoration class="tree tree-2" />
    </div>

    <!-- 近景地面 -->
    <div class="ground-strip" />

    <!-- ==================== 动态小生物 ==================== -->
    <div class="creatures">
      <span class="creature firefly firefly-1">✨</span>
      <span class="creature firefly firefly-2">🌟</span>
      <span class="creature firefly firefly-3">✨</span>
      <span v-if="outdoorStore.playingPet" class="creature butterfly">🦋</span>
      <span class="creature ladybug">🐞</span>
      <span class="creature petal petal-1">🌸</span>
      <span class="creature petal petal-2">🍃</span>
    </div>

    <!-- ==================== 区域标题 ==================== -->
    <!-- 树冠顶部装饰 -->
    <CanopyTop class="forest-canopy" />

    <div class="zone-header">
      <div class="title-group">
        <!-- 区域图标 -->
        <TreeDecoration class="zone-icon" />
        <!-- 区域名称 -->
        <span class="zone-name">{{ $t('areas.forest.name') }}</span>
      </div>
      <span v-if="outdoorStore.playingPet" class="reward-badge">
        {{ $t('areas.forest.reward') }}
      </span>
      <!-- 安全等级 -->
      <span class="zone-safety safe">{{ $t('areas.forest.tag') }}</span>
    </div>

    <!-- ==================== 区域说明 ==================== -->
    <div v-if="!outdoorStore.playingPet" class="zone-description">
      {{ $t('areas.forest.description') }}
    </div>

    <!-- ==================== 宠物显示区 ==================== -->
    <div class="pet-area">
      <!--
        当宠物在这里时显示
        outdoorStore.playingPet 存储在玩耍区的宠物
      -->
      <template v-if="outdoorStore.playingPet">
        <!-- 收益冒泡容器 -->
        <div class="bubbles-container">
          <div
            v-for="bubble in bubbles"
            :key="bubble.id"
            class="reward-bubble"
            :style="{ '--bubble-x': bubble.xOffset + 'px' }"
          >
            <span class="bubble-icon">+{{ bubble.icon }}</span>
            <span class="bubble-text">{{ bubble.text }}</span>
          </div>
        </div>
        <Pet
          :pet="outdoorStore.playingPet"
          draggable="true"
          @dragstart="handlePetDragStart"
          @dragend="handlePetDragEnd"
        />
      </template>

      <!-- 没有宠物时的提示 -->
      <div v-else class="empty-hint">
        <span class="empty-leaf">🍃</span>
        <span class="hint-text">{{ $t('areas.forest.hint') }}</span>
        <div class="drop-circle"></div>
      </div>

      <!-- 宠物落下时的花瓣爆发特效 -->
      <div class="burst-container">
        <span
          v-for="petal in burstPetals"
          :key="petal.id"
          class="burst-petal"
          :class="{ fly: petal.active }"
          :style="{
            '--rotation': `${petal.rotation}deg`,
            '--tx': `${petal.x}px`,
            '--ty': `${petal.y}px`
          }"
        >🌸</span>
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
import TreeDecoration from './icons/decorations/TreeDecoration.vue'
import CanopyTop from './icons/decorations/CanopyTop.vue'

export default {
  // 组件名称
  name: 'OutdoorPlay',

  // 注册子组件
  components: {
    Pet,
    TreeDecoration,
    CanopyTop
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
      dragEnterCounter: 0,
      /**
       * bubbles: 当前显示的收益冒泡
       * 每个冒泡包含 id、文字、图标和水平偏移
       */
      bubbles: [],
      /**
       * burstPetals: 宠物落下时的花瓣爆发特效列表
       * 每个花瓣包含 id、旋转角度和位移量
       */
      burstPetals: [],
      /**
       * bubbleTimer: 冒泡定时器
       * 用于每 6 秒生成一个新的收益冒泡
       */
      bubbleTimer: null,
      /**
       * burstTimer: 花瓣爆发清理定时器
       * 用于组件卸载前清理未完成的爆发动画
       */
      burstTimer: null,
      /**
       * bubbleRemoveTimers: 单个冒泡移除定时器集合
       * 用于在组件卸载前清理未触发的移除定时器，避免内存泄漏
       */
      bubbleRemoveTimers: []
    }
  },

  // 监听器
  watch: {
    /**
     * 监听正在玩耍的宠物
     * 宠物在场时开始冒泡，离开时清理冒泡
     */
    'outdoorStore.playingPet'(pet) {
      if (pet) {
        this.startRewardBubbles()
      } else {
        this.stopRewardBubbles()
      }
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
     * startRewardBubbles: 开始生成收益冒泡
     * 立即生成一个，然后每 6 秒生成一个
     */
    startRewardBubbles() {
      if (this.bubbleTimer) return
      this.spawnBubble()
      this.bubbleTimer = setInterval(() => {
        this.spawnBubble()
      }, 6000)
    },

    /**
     * stopRewardBubbles: 停止生成收益冒泡
     * 清除定时器并清空当前冒泡
     */
    stopRewardBubbles() {
      if (this.bubbleTimer) {
        clearInterval(this.bubbleTimer)
        this.bubbleTimer = null
      }
      this.bubbles = []
    },

    /**
     * spawnBubble: 生成一个收益冒泡
     * 随机选择心情、快乐或成长奖励，1.5 秒后自动移除
     */
    spawnBubble() {
      const rewards = [
        { text: this.$t('areas.forest.rewards.mood'), icon: '❤️' },
        { text: this.$t('areas.forest.rewards.joy'), icon: '✨' },
        { text: this.$t('areas.forest.rewards.growth'), icon: '🌱' }
      ]
      const reward = rewards[Math.floor(Math.random() * rewards.length)]
      const id = Date.now() + Math.random()
      const xOffset = (Math.random() - 0.5) * 20 // ±10px
      this.bubbles.push({ id, ...reward, xOffset })
      const timerId = setTimeout(() => {
        this.bubbles = this.bubbles.filter(b => b.id !== id)
        this.bubbleRemoveTimers = this.bubbleRemoveTimers.filter(t => t !== timerId)
      }, 1500)
      this.bubbleRemoveTimers.push(timerId)
    },

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
      const success = this.outdoorStore.sendToPlay(data.pet)

      if (success) {
        // 同时更新游戏主状态
        this.gameStore.sendPetOutdoor('play')

        // 触发花瓣爆发特效
        this.triggerBurst()
      }
    },

    /**
     * triggerBurst: 触发花瓣爆发特效
     * 生成 5 片随机方向飞散的花瓣，1 秒后自动清理
     */
    triggerBurst() {
      const petals = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        rotation: Math.random() * 360,
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 40
      }))
      this.burstPetals = petals
      requestAnimationFrame(() => {
        this.$nextTick(() => {
          this.burstPetals = this.burstPetals.map(p => ({ ...p, active: true }))
        })
      })
      this.burstTimer = setTimeout(() => { this.burstPetals = [] }, 1000)
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
  },

  // 生命周期钩子
  beforeUnmount() {
    /**
     * 组件卸载前停止冒泡并清理所有定时器，避免内存泄漏
     */
    this.stopRewardBubbles()
    if (this.bubbleTimer) {
      clearInterval(this.bubbleTimer)
      this.bubbleTimer = null
    }
    this.bubbleRemoveTimers.forEach(timerId => clearTimeout(timerId))
    this.bubbleRemoveTimers = []
    if (this.burstTimer) {
      clearTimeout(this.burstTimer)
      this.burstTimer = null
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
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 15px 15px; /* top padding removed; canopy is absolute */
  border-radius: var(--mp-radius-lg);
  background:
    radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.35) 0%, transparent 55%),
    linear-gradient(180deg, #a7e6cf 0%, #88d8b0 45%, #6b9b7a 100%);
  border: 3px solid var(--mp-ink);
  box-shadow: var(--mp-shadow);
  transition: all 0.3s ease;
  overflow: hidden;
}

/* 拖拽高亮状态 */
.outdoor-play.drop-target {
  border-color: var(--mp-gold);
  box-shadow: 0 0 30px var(--mp-crystal-gold-glow);
  animation: forest-glow 1s ease-in-out infinite;
}

.outdoor-play.drop-target .firefly {
  animation-duration: 1.5s; /* speed up gathering */
}

.outdoor-play.drop-target .ground-strip {
  animation: grass-sway 0.6s ease-in-out infinite;
}

@keyframes forest-glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.08); }
}

@keyframes grass-sway {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px); }
}

/* 近景地面 */
.ground-strip {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 36px;
  background: linear-gradient(180deg, rgba(75,130,100,0) 0%, rgba(75,130,100,0.5) 100%);
  pointer-events: none;
  z-index: 0;
}

/* ==================== 森林装饰 ==================== */

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

/* 树木 */
.tree {
  position: absolute;
  bottom: -6px;
  width: 56px;
  animation: tree-sway 3s ease-in-out infinite;
  z-index: 2;
}

.tree-1 { left: 6px; }
.tree-2 {
  right: 8px;
  width: 44px;
  opacity: 0.85;
  animation-delay: -1.5s;
}

@keyframes tree-sway {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

/* ==================== 区域标题 ==================== */

.zone-header {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* 留出足够上边距避开 48px 树冠 */
  margin-top: 42px;
  margin-bottom: 6px;
}

.title-group {
  display: flex;
  align-items: center;
}

/* 区域图标 */
.zone-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

/* 区域名称 */
.zone-name {
  font-size: 18px;
  font-weight: bold;
  color: var(--mp-ink);
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
  background: color-mix(in srgb, var(--mp-mint) 50%, transparent);
  color: var(--mp-ink);
  border: 1px solid var(--mp-mint);
}

/* 收益徽章 */
.reward-badge {
  padding: 2px 8px;
  background: rgba(255,255,255,0.7);
  border: 1px solid var(--mp-gold);
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
  color: var(--mp-ink);
}

/* ==================== 区域说明 ==================== */

.zone-description {
  position: relative;
  z-index: 3;
  text-align: center;
  font-size: 11px;
  color: var(--mp-text-muted);
  margin-bottom: 10px;
}

/* ==================== 宠物区域 ==================== */

.pet-area {
  /* 相对定位，确保在装饰层之上 */
  position: relative;
  z-index: 1;
  /* 占据剩余空间 */
  flex: 1;
  /* 使用 flex 居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 最小高度 */
  min-height: 150px;
}

/* 空状态提示 */
.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--mp-text-muted);
}

/* 空状态叶子图标 */
.empty-leaf {
  font-size: 28px;
  margin-bottom: 8px;
  animation: leaf-sway 3s ease-in-out infinite;
  opacity: 0.7;
}

/* 提示文字 */
.hint-text {
  font-size: 14px;
}

/* 放置提示圆圈 */
.drop-circle {
  width: 56px;
  height: 56px;
  margin-top: 8px;
  border: 2px dashed rgba(97,35,21,0.3);
  border-radius: 50%;
  animation: drop-circle-pulse 2s ease-in-out infinite;
}

@keyframes leaf-sway {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}

@keyframes drop-circle-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 1; }
}

/* ==================== 落下花瓣爆发特效 ==================== */

.burst-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  pointer-events: none;
}

.burst-petal {
  position: absolute;
  font-size: 14px;
  opacity: 1;
  transition: transform 1s ease-out, opacity 1s ease-out;
  transform: translate(0, 0) rotate(var(--rotation, 0deg));
}

.burst-petal.fly {
  transform: translate(var(--tx, 0), var(--ty, 0)) rotate(var(--rotation, 0deg));
  opacity: 0;
}

/* ==================== 收益冒泡 ==================== */

/* 冒泡容器：覆盖在宠物上方 */
.bubbles-container {
  /* 绝对定位，居中于宠物区域 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  pointer-events: none;
  width: 100px;
  height: 0;
  display: flex;
  justify-content: center;
}

/* 单个收益冒泡 */
.reward-bubble {
  /* 绝对定位，从容器底部向上飘 */
  position: absolute;
  bottom: 40px;
  left: calc(50% + var(--bubble-x, 0px));
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--mp-ink);
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: var(--mp-ink);
  box-shadow: 0 2px 0 rgba(97, 35, 21, 0.1);
  white-space: nowrap;
  animation: bubble-rise 1.5s ease-out forwards;
}

/* 冒泡图标 */
.bubble-icon {
  font-size: 12px;
}

/* 冒泡文字 */
.bubble-text {
  font-size: 12px;
}

/* 冒泡上升动画 */
@keyframes bubble-rise {
  0% { transform: translate(-50%, 0) scale(0.8); opacity: 0; }
  20% { transform: translate(-50%, -10px) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -45px) scale(1); opacity: 0; }
}

/* ==================== 树冠顶部装饰 ==================== */
.forest-canopy {
  /* 绝对定位，覆盖在卡片顶部，不占用文档流高度 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 48px;
  z-index: 2;
  pointer-events: none;
}

/* ==================== 动态小生物 ==================== */

/* 小生物容器 */
.creatures {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

/* 小生物基础样式 */
.creature {
  position: absolute;
  font-size: 14px;
  line-height: 1;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
}

/* 萤火虫 */
.firefly {
  opacity: 0.8;
  animation: firefly-float 5s ease-in-out infinite, firefly-glow 3s ease-in-out infinite;
}

.firefly-1 { top: 55px; left: 25px; animation-delay: 0s, 0s; }
.firefly-2 { top: 85px; right: 40px; animation-delay: -2s, -1s; }
.firefly-3 { top: 115px; left: 70px; animation-delay: -4s, -2s; }

/* 蝴蝶：仅当宠物在场时出现 */
.butterfly {
  top: 60px;
  left: 50%;
  font-size: 18px;
  animation: butterfly-flight 10s ease-in-out infinite;
}

/* 瓢虫 */
.ladybug {
  bottom: 8px;
  left: 20%;
  font-size: 12px;
  animation: ladybug-crawl 12s linear infinite;
}

/* 飘落的花瓣 */
.petal {
  top: -20px;
  font-size: 12px;
  opacity: 0.7;
  animation: petal-fall 7s linear infinite;
}

.petal-1 { left: 20%; animation-delay: 0s; }
.petal-2 { left: 70%; animation-delay: -3.5s; }

/* 萤火虫漂浮动画 */
@keyframes firefly-float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(6px, -10px); }
}

/* 萤火虫发光动画 */
@keyframes firefly-glow {
  0%, 100% { opacity: 0.5; filter: drop-shadow(0 0 2px #ffd93d); }
  50% { opacity: 1; filter: drop-shadow(0 0 6px #ffd93d); }
}

/* 蝴蝶飞舞动画 */
@keyframes butterfly-flight {
  0% { transform: translate(-40px, 10px) scaleX(1); }
  25% { transform: translate(10px, -15px) scaleX(-1); }
  50% { transform: translate(50px, 5px) scaleX(1); }
  75% { transform: translate(20px, 20px) scaleX(-1); }
  100% { transform: translate(-40px, 10px) scaleX(1); }
}

/* 瓢虫爬行动画 */
@keyframes ladybug-crawl {
  0% { transform: translateX(0) rotate(0deg); }
  20% { transform: translateX(30px) rotate(5deg); }
  40% { transform: translateX(30px) rotate(0deg); }
  60% { transform: translateX(60px) rotate(-3deg); }
  80% { transform: translateX(60px) rotate(0deg); }
  100% { transform: translateX(0) rotate(0deg); }
}

/* 花瓣飘落动画 */
@keyframes petal-fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.7; }
  100% { transform: translateY(220px) rotate(360deg); opacity: 0; }
}

/* 减少动态效果偏好：禁用森林区所有动画和过渡 */
@media (prefers-reduced-motion: reduce) {
  .outdoor-play,
  .outdoor-play.drop-target,
  .tree,
  .creature,
  .empty-leaf,
  .drop-circle {
    animation: none !important;
    transition: none !important;
  }

  .burst-petal {
    transition: none !important;
  }

  .reward-bubble {
    animation: none;
    opacity: 0.9;
  }
}
</style>
