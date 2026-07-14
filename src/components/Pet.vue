<!--
  Pet.vue - 宠物组件

  这个组件显示游戏中的魔法宠物
  宠物是游戏的主角，玩家需要照顾它

  主要功能：
  1. 显示宠物形象（使用表情符号或图片）
  2. 显示宠物状态（饱食度、心情、当前活动）
  3. 根据状态显示不同表情和动画
  4. 可被拖拽到户外区

  宠物状态：
  - sleeping: 睡觉中（在水晶球里休息）
  - idle: 发呆（无所事事）
  - happy: 开心（被喂食或玩耍后）
  - playing: 玩耍中（在户外）
  - hunting: 战斗中（在游猎区）
  - tired: 疲惫（饱食度低）
  - sad: 难过（心情差）
-->

<template>
  <!--
    宠物容器
    使用绝对定位，可以在水晶球或户外区内定位
    根据宠物状态添加不同的 CSS 类
  -->
  <div
    class="pet-container"
    :class="statusClass"
    v-bind="draggableAttrs"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- ==================== 宠物切换按钮（当有多只宠物且在家时） ==================== -->
    <button
      v-if="pet.isAtHome && hasMultiplePets"
      class="switch-pet-btn"
      @click.stop="openPetSwitcher"
      title="切换宠物"
    >
      <span class="switch-icon">🔄</span>
    </button>

    <!-- ==================== 宠物形象 ==================== -->
    <div class="pet-avatar" :style="avatarStyle">
      <span v-if="petConfig?.passiveSkill" class="skill-icon">{{ petConfig.passiveSkill.icon }}</span>
      <span class="cat-ears">{{ petEmojiSecondary }}</span>
      <span class="pet-emoji">{{ petEmoji }}</span>
    </div>

    <!-- ==================== 宠物名字 ==================== -->
    <div class="pet-name">{{ pet.name }}</div>

    <!-- ==================== 属性条（当在家时显示） ==================== -->
    <div v-if="pet.isAtHome" class="pet-stats">
      <!-- 饱食度条 -->
      <div class="stat-bar">
        <div class="stat-label">{{ $t('pet.stats.hunger') }}</div>
        <div class="stat-progress">
          <!-- 进度条背景 -->
          <div class="stat-track">
            <!-- 进度条填充 -->
            <div
              class="stat-fill hunger-fill"
              :style="{ width: pet.hunger + '%' }"
            ></div>
          </div>
          <!-- 数值显示 -->
          <span class="stat-value">{{ pet.hunger }}</span>
        </div>
      </div>

      <!-- 心情条 -->
      <div class="stat-bar">
        <div class="stat-label">{{ $t('pet.stats.mood') }}</div>
        <div class="stat-progress">
          <div class="stat-track">
            <div
              class="stat-fill mood-fill"
              :style="{ width: pet.mood + '%' }"
            ></div>
          </div>
          <span class="stat-value">{{ pet.mood }}</span>
        </div>
      </div>

      <!-- 健康条 -->
      <div class="stat-bar">
        <div class="stat-label">{{ $t('pet.stats.health') }}</div>
        <div class="stat-progress">
          <div class="stat-track">
            <div
              class="stat-fill health-fill"
              :style="{ width: pet.health + '%' }"
            ></div>
          </div>
          <span class="stat-value">{{ pet.health }}</span>
        </div>
      </div>
    </div>

    <!-- ==================== 状态指示器（当不在家的宠物） ==================== -->
    <div v-if="!pet.isAtHome" class="status-indicator">
      <span class="status-emoji">{{ statusEmoji }}</span>
    </div>

    <!-- ==================== 宠物选择弹窗 ==================== -->
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
import { usePetCollectionStore } from '../stores/petCollection.js'
import { useGameStore } from '../stores/game.js'
import { useNotificationStore } from '../stores/notification.js'
import { getPetType } from '../config/petTypes.js'

export default {
  // 组件名称
  name: 'Pet',

  /**
   * props: 从父组件接收的数据
   * 这里是 pet 对象，包含宠物的所有属性
   */
  props: {
    /**
     * pet: 宠物数据对象
     * type: Object 表示这是一个对象
     * required: true 表示这个 prop 是必需的
     */
    pet: {
      type: Object,
      required: true,
      /**
       * pet 对象的预期结构：
       * {
       *   name: string,      // 宠物名字
       *   hunger: number,    // 饱食度 0-100
       *   mood: number,      // 心情 0-100
       *   health: number,    // 健康 0-100
       *   status: string,    // 状态 sleeping/idle/playing等
       *   isAtHome: boolean  // 是否在家
       * }
       */
    },

    /**
     * draggable: 是否可拖拽
     * 由父组件控制
     */
    draggable: {
      type: Boolean,
      default: false
    }
  },

  /**
   * data: 组件内部状态
   */
  data() {
    return {
      /**
       * isDragging: 是否正在拖拽
       */
      isDragging: false,
      /**
       * showPetSwitcher: 是否显示宠物切换弹窗
       */
      showPetSwitcher: false
    }
  },

  /**
   * computed: 计算属性
   * 基于 props 和 data 计算出的值
   */
  computed: {
    ...mapStores(usePetCollectionStore, useGameStore),

    /**
     * statusClass: 根据宠物状态返回 CSS 类名
     * 用于给宠物添加不同的动画效果
     * @returns {string} CSS 类名
     */
    statusClass() {
      // 返回当前状态作为类名
      // 例如：sleeping、happy、playing
      return this.pet.status
    },

    /**
     * isDraggable: 是否可拖拽
     * 只有在家时才能拖拽到户外区
     * @returns {boolean}
     */
    isDraggable() {
      return this.draggable && this.pet.isAtHome
    },

    /**
     * dragData: 拖拽时传递的数据
     * @returns {Object}
     */
    dragData() {
      return {
        type: 'pet',
        action: 'send',
        pet: this.pet
      }
    },

    /**
     * draggableAttrs: 动态绑定 draggable 属性
     * 只有当可拖拽时才添加 draggable 属性
     * @returns {Object}
     */
    draggableAttrs() {
      if (this.isDraggable) {
        return { draggable: true }
      }
      return {}
    },

    /**
     * petConfig: 当前宠物配置
     * @returns {Object|null}
     */
    petConfig() {
      const petType = this.petCollectionStore.activePet?.petType || 'cat'
      return getPetType(petType)
    },

    /**
     * petEmoji: 宠物的主要形象
     * 根据宠物类型返回对应的emoji
     * @returns {string} 表情符号
     */
    petEmoji() {
      return this.petConfig?.emoji || '🐌'
    },

    /**
     * petEmojiSecondary: 宠物的次要形象/装饰
     * @returns {string} 表情符号
     */
    petEmojiSecondary() {
      return this.petConfig?.emojiSecondary || '🐱'
    },

    /**
     * avatarStyle: 宠物头像样式
     * 根据宠物类型返回不同的背景色
     * @returns {Object}
     */
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

    /**
     * hasMultiplePets: 是否有多只宠物
     * @returns {boolean}
     */
    hasMultiplePets() {
      return this.petCollectionStore.hasMultiplePets
    },

    /**
     * ownedPets: 已拥有的宠物列表
     * @returns {Array}
     */
    ownedPets() {
      return this.petCollectionStore.ownedPets
    },

    /**
     * activePetId: 当前激活的宠物ID
     * @returns {string|null}
     */
    activePetId() {
      return this.petCollectionStore.activePetId
    },

    /**
     * statusEmoji: 宠物头顶的状态指示器
     * 显示宠物当前的心情或活动
     * @returns {string} 表情符号
     */
    statusEmoji() {
      // 根据状态返回对应的表情
      const statusEmojis = {
        'sleeping': '💤',  // 睡觉：Zzz
        'idle': '😐',     // 发呆：中性脸
        'happy': '😊',    // 开心：笑脸
        'playing': '🎮',  // 玩耍：游戏手柄
        'hunting': '⚔️',  // 战斗：剑
        'tired': '😴',    // 疲惫：困倦
        'sad': '😢',      // 难过：哭脸
        'eating': '🍔',   // 进食：汉堡
      }

      // 返回对应状态的表情，如果没有就用默认值
      return statusEmojis[this.pet.status] || '✨'
    }
  },

  /**
   * methods: 组件方法
   */
  methods: {
    /**
     * handleDragStart: 开始拖拽时的处理
     * 使用 HTML5 DataTransfer API 存储数据
     */
    handleDragStart(event) {
      // 如果不可拖拽，阻止默认行为
      if (!this.isDraggable) {
        event.preventDefault()
        return
      }

      // 设置拖拽效果
      event.dataTransfer.effectAllowed = 'move'

      // 将数据序列化为 JSON 字符串存储
      const dataString = JSON.stringify(this.dragData)
      event.dataTransfer.setData('application/json', dataString)
      event.dataTransfer.setData('text/plain', dataString)

      // 设置正在拖拽状态
      this.isDragging = true

      console.log('开始拖拽宠物:', this.pet.name)

      // 触发自定义事件，让父组件知道开始拖拽
      this.$emit('dragstart', event)
    },

    /**
     * handleDragEnd: 拖拽结束时的处理
     */
    handleDragEnd(event) {
      // 重置拖拽状态
      this.isDragging = false

      console.log('宠物拖拽结束:', this.pet.name)

      // 触发自定义事件
      this.$emit('dragend', event)
    },

    /**
     * openPetSwitcher: 打开宠物切换弹窗
     */
    openPetSwitcher() {
      this.showPetSwitcher = true
    },

    /**
     * getPetEmoji: 获取宠物emoji
     * @param {string} petType - 宠物类型
     * @returns {string}
     */
    getPetEmoji(petType) {
      const pet = getPetType(petType)
      return pet?.emoji || '🐌'
    },

    /**
     * getPetPassiveSkill: 获取宠物被动技能
     * @param {string} petType - 宠物类型
     * @returns {Object|null}
     */
    getPetPassiveSkill(petType) {
      const pet = getPetType(petType)
      return pet?.passiveSkill || null
    },

    /**
     * switchToPet: 切换到指定宠物
     * @param {string} instanceId - 宠物实例ID
     */
    switchToPet(instanceId) {
      const notificationStore = useNotificationStore()

      // 切换宠物
      const success = this.petCollectionStore.setActivePet(instanceId)

      if (success) {
        // 同步新宠物的数据到 game store
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
/**
 * 宠物样式
 */

/* 宠物容器 - 在水晶球正中间 */
.pet-container {
  /* 使用 flex 垂直排列子元素 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 宽度固定，高度自适应内容 */
  width: 140px;
  /* 禁止选中文字 */
  user-select: none;
  /* 确保宠物在最上层显示 */
  z-index: 100;
  /* 相对定位 */
  position: relative;
  /* 确保内容可见 */
  overflow: visible;
}

/* 宠物头像 */
.pet-avatar {
  /* 圆形头像 - 更可爱的椭圆形 */
  width: 90px;
  height: 80px;
  border-radius: 50% 50% 45% 45%;
  /* 蛞蝓猫的粘液色渐变 - 更柔和的粉绿色 */
  background: radial-gradient(
    ellipse at 40% 30%,
    #c8f0d8 0%,
    #a8e6cf 30%,
    #88d8b0 60%,
    #6b9b7a 100%
  );
  /* 阴影 - 增加立体感 */
  box-shadow:
    0 4px 15px rgba(107, 155, 122, 0.4),
    0 0 25px rgba(136, 216, 176, 0.5),
    inset -3px -3px 8px rgba(0, 0, 0, 0.2),
    inset 3px 3px 8px rgba(255, 255, 255, 0.4);
  /* 居中显示表情 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 动画过渡 */
  transition: transform 0.3s ease;
  /* 相对定位，用于放置猫耳朵 */
  position: relative;
  /* 确保头像可见 */
  flex-shrink: 0;
  margin-top: 5px;
  /* 确保在 flex 容器中居中 */
  align-self: center;
}

/* 可拖拽时的鼠标样式 */
.pet-container[draggable="true"] .pet-avatar {
  cursor: grab;
  transition: all var(--mp-duration-fast) ease;
}

.pet-container[draggable="true"] .pet-avatar:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 10px color-mix(in srgb, var(--mp-purple) 50%, transparent));
}

.pet-container[draggable="true"] .pet-avatar:active {
  cursor: grabbing;
  transform: scale(1.1);
}

/* 猫耳朵装饰 - 放在蛞蝓头顶 */
.cat-ears {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  animation: earWiggle 2s ease-in-out infinite;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
  z-index: 2;
}

/* 小尾巴 */
.pet-tail {
  position: absolute;
  bottom: 10px;
  right: 5px;
  font-size: 20px;
  color: #a8e6cf;
  animation: tailWag 1.5s ease-in-out infinite;
  transform-origin: left center;
}

/* 耳朵摇摆动画 */
@keyframes earWiggle {
  0%, 100% {
    transform: translateX(-50%) rotate(-5deg);
  }
  50% {
    transform: translateX(-50%) rotate(5deg);
  }
}

/* 尾巴摇摆动画 */
@keyframes tailWag {
  0%, 100% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

/* 宠物表情 */
.pet-emoji {
  /* 表情符号大小 */
  font-size: 40px;
  /* 阴影让表情更突出 */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* 状态指示器 */
.status-indicator {
  /* 绝对定位在宠物头顶 */
  position: absolute;
  top: 5px;
  /* 居中 */
  left: 50%;
  transform: translateX(-50%);
  /* 动画效果 */
  animation: bounce 1s ease-in-out infinite;
}

/* 状态表情 */
.status-emoji {
  font-size: 24px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

/* 宠物属性条容器 */
.pet-stats {
  /* 上边距 */
  margin-top: 8px;
  /* 背景 - 半透明白色配合 pastel 紫边框 */
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(197, 179, 224, 0.5);
  /* 圆角 */
  border-radius: 10px;
  /* 内边距 */
  padding: 6px 8px;
  /* 宽度 */
  width: 130px;
  /* 阴影 */
  box-shadow: 0 2px 10px rgba(197, 179, 224, 0.3);
}

/* 单个属性条 */
.stat-bar {
  /* 使用 flex 水平排列 */
  display: flex;
  align-items: center;
  /* 间距 */
  margin-bottom: 4px;
}

.stat-bar:last-child {
  margin-bottom: 0;
}

/* 属性标签 */
.stat-label {
  /* 固定宽度 */
  width: 40px;
  /* 文字大小 */
  font-size: 12px;
  /* 颜色 - 深色文字便于在浅色背景上阅读 */
  color: var(--text-dark);
  /* 文字不换行 */
  white-space: nowrap;
}

/* 进度条容器 */
.stat-progress {
  /* 使用 flex */
  display: flex;
  align-items: center;
  /* 占据剩余空间 */
  flex: 1;
}

/* 进度条轨道 */
.stat-track {
  /* 占据空间 */
  flex: 1;
  /* 高度 */
  height: 8px;
  /* 背景 */
  background: rgba(255, 255, 255, 0.2);
  /* 圆角 */
  border-radius: 4px;
  /* 溢出隐藏 */
  overflow: hidden;
}

/* 进度条填充 */
.stat-fill {
  /* 高度填满 */
  height: 100%;
  /* 过渡动画 */
  transition: width 0.3s ease;
  /* 圆角 */
  border-radius: 4px;
}

/* 饱食度条 - 橙色 */
.hunger-fill {
  background: linear-gradient(90deg, #e67e22, #f39c12);
}

/* 心情条 - 粉色 */
.mood-fill {
  background: linear-gradient(90deg, #e91e63, #f48fb1);
}

/* 健康条 - 绿色 */
.health-fill {
  background: linear-gradient(90deg, #27ae60, #2ecc71);
}

/* 数值显示 */
.stat-value {
  /* 宽度 */
  width: 25px;
  /* 文字右对齐 */
  text-align: right;
  /* 大小 */
  font-size: 10px;
  /* 颜色 - 深色文字 */
  color: var(--text-dark);
  /* 左边距 */
  margin-left: 4px;
}

/* 宠物名字 */
.pet-name {
  /* 上边距 */
  margin-top: 5px;
  /* 下边距 */
  margin-bottom: 5px;
  /* 文字样式 */
  font-size: 13px;
  font-weight: bold;
  color: var(--text-dark);
  /* 不换行 */
  white-space: nowrap;
}

/* ==================== 宠物切换按钮 ==================== */
.switch-pet-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  transition: all 0.3s ease;
}

.switch-pet-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
}

.switch-icon {
  font-size: 16px;
}

/* 技能图标 */
.skill-icon {
  position: absolute;
  top: -5px;
  left: -5px;
  font-size: 18px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

/* ==================== 宠物切换弹窗样式 ==================== */
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

/* ==================== 状态动画 ==================== */

/* 睡觉状态 - 轻微摇摆 */
.sleeping .pet-avatar {
  animation: sway 3s ease-in-out infinite;
}

.sleeping .status-indicator {
  /* 睡觉时不显示状态表情 */
  opacity: 0;
}

/* 开心状态 - 跳跃 */
.happy .pet-avatar {
  animation: jump 0.5s ease-in-out infinite;
}

/* 玩耍状态 - 摇摆 */
.playing .pet-avatar {
  animation: wiggle 0.3s ease-in-out infinite;
}

/* 战斗状态 - 快速抖动 */
.hunting .pet-avatar {
  animation: shake 0.2s ease-in-out infinite;
}

/* 疲惫状态 - 慢速呼吸 */
.tired .pet-avatar {
  animation: breathe 2s ease-in-out infinite;
}

/* ==================== 动画定义 ==================== */

/* 弹跳动画 - 用于状态表情 */
@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* 摇摆动画 - 睡觉 */
@keyframes sway {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

/* 跳跃动画 - 开心 */
@keyframes jump {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.1);
  }
}

/* 摇摆动画 - 玩耍 */
@keyframes wiggle {
  0%, 100% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

/* 抖动动画 - 战斗 */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
}

/* 呼吸动画 - 疲惫 */
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
}
</style>
