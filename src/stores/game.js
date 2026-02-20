/**
 * game.js - 游戏主状态管理
 *
 * 这个文件使用 Pinia 管理游戏的核心状态
 * 包括：宠物属性、金钱、游戏逻辑
 *
 * 什么是 Pinia？
 * Pinia 是 Vue 的官方状态管理库，比 Vuex 更简单
 * - 不需要 mutations，直接修改 state
 * - 更好的 TypeScript 支持
 * - 更清晰的代码结构
 *
 * Store 的组成部分：
 * 1. state: 存储数据（类似组件的 data）
 * 2. getters: 计算属性（类似组件的 computed）
 * 3. actions: 方法（类似组件的 methods）
 */

// 从 pinia 导入 defineStore 函数
// defineStore 用于创建一个新的 store
import { defineStore } from 'pinia'
import { useBackpackStore } from './backpack.js'

/**
 * 创建 game store
 * 'game' 是这个 store 的唯一标识符
 * 其他组件可以通过 useGameStore() 来使用这个 store
 */
export const useGameStore = defineStore('game', {

  /**
   * state: 定义 store 的数据
   * 必须是一个函数，返回一个对象
   * 这样每个使用 store 的组件都有自己的独立状态
   */
  state: () => ({
    /**
     * money: 玩家拥有的金币数量
     * 用于在商店购买物品
     */
    money: 100,

    /**
     * pet: 宠物对象
     * 存储宠物的所有属性
     */
    pet: {
      /**
       * name: 宠物的名字
       */
      name: '小紫',

      /**
       * hunger: 饱食度 (0-100)
       * 0 = 非常饥饿，100 = 饱饱的
       * 会随时间下降，需要通过喂食补充
       */
      hunger: 80,

      /**
       * mood: 心情 (0-100)
       * 0 = 非常难过，100 = 非常开心
       * 通过玩耍增加，会随时间下降
       */
      mood: 70,

      /**
       * health: 健康值 (0-100)
       * 0 = 濒死，100 = 非常健康
       * 战斗可能减少健康值
       */
      health: 100,

      /**
       * status: 当前状态
       * 可选值：
       * - 'sleeping': 睡觉中
       * - 'idle': 发呆/无所事事
       * - 'happy': 开心
       * - 'playing': 玩耍中（在森林）
       * - 'hunting': 战斗中（在游猎区）
       * - 'tired': 疲惫（饱食度低）
       * - 'sad': 难过（心情差）
       * - 'eating': 进食中
       */
      status: 'idle',

      /**
       * isAtHome: 是否在家（水晶球里）
       * true = 在家，false = 在户外
       */
      isAtHome: true,

      /**
       * level: 宠物等级
       * 可以通过积累经验值升级
       */
      level: 1,

      /**
       * experience: 当前经验值
       */
      experience: 0
    },

    /**
     * gameTime: 游戏时间（分钟）
     * 用于追踪游戏进度
     */
    gameTime: 0
  }),

  /**
   * getters: 计算属性
   * 基于 state 计算出的值，会缓存
   * 当依赖的 state 变化时，getter 会自动重新计算
   */
  getters: {
    /**
     * petStatusText: 宠物状态的文本描述
     * @param {Object} state - store 的 state
     * @returns {string} 状态文本
     */
    petStatusText: (state) => {
      // 状态文本映射表
      const statusMap = {
        'sleeping': '睡觉中',
        'idle': '发呆中',
        'happy': '很开心',
        'playing': '玩耍中',
        'hunting': '战斗中',
        'tired': '很疲惫',
        'sad': '很难过',
        'eating': '进食中'
      }
      // 返回对应的状态文本，如果没有就返回 '未知'
      return statusMap[state.pet.status] || '未知'
    },

    /**
     * isPetHungry: 宠物是否饿了
     * 饱食度低于 30 算饿
     * @returns {boolean}
     */
    isPetHungry: (state) => state.pet.hunger < 30,

    /**
     * isPetHappy: 宠物是否开心
     * 心情大于 70 算开心
     * @returns {boolean}
     */
    isPetHappy: (state) => state.pet.mood > 70,

    /**
     * petLevelProgress: 宠物升级进度（百分比）
     * 假设每级需要 100 经验
     * @returns {number} 0-100
     */
    petLevelProgress: (state) => {
      return state.pet.experience % 100
    }
  },

  /**
   * actions: 方法
   * 定义可以修改 state 的操作
   * 可以是同步的也可以是异步的
   */
  actions: {
    /**
     * feedPet: 喂养宠物
     * 这是核心游戏逻辑之一！
     *
     * @param {Object} item - 食物物品
     *   - id: 物品ID
     *   - foodValue: 增加多少饱食度
     *   - name: 食物名称
     */
    feedPet(item) {
      // ====== 步骤 1: 检查是否在家 ======
      // 只有在家才能喂食
      if (!this.pet.isAtHome) {
        alert('宠物不在家，无法喂食！')
        return false
      }

      // ====== 步骤 2: 检查是否满饱食度 ======
      if (this.pet.hunger >= 100) {
        alert('宠物已经吃饱了！')
        return false
      }

      // ====== 步骤 3: 从背包中移除物品 ======
      const backpackStore = useBackpackStore()
      const removed = backpackStore.removeItem(item.id, 1)

      // 如果移除失败（物品不存在或数量不足），返回失败
      if (!removed) {
        alert('背包中没有这个物品！')
        return false
      }

      // ====== 步骤 4: 修改状态为进食中 ======
      this.pet.status = 'eating'

      // ====== 步骤 5: 增加饱食度 ======
      // 使用 Math.min 确保不超过 100
      const oldHunger = this.pet.hunger
      this.pet.hunger = Math.min(100, this.pet.hunger + item.foodValue)

      // 实际增加的数值（考虑满值限制）
      const actualIncrease = this.pet.hunger - oldHunger

      console.log(`喂食 ${item.name}，饱食度从 ${oldHunger} 增加到 ${this.pet.hunger}`)

      // ====== 步骤 6: 增加心情 ======
      // 吃东西会让宠物开心
      this.pet.mood = Math.min(100, this.pet.mood + 5)

      // 显示喂养成功提示
      alert(`喂食成功！${item.name}让宠物很开心~ 饱食度 +${actualIncrease}，心情 +5`)

      // ====== 步骤 7: 3秒后恢复 idle 状态 ======
      setTimeout(() => {
        this.pet.status = 'idle'
      }, 3000)

      // ====== 步骤 8: 返回成功 ======
      return true
    },

    /**
     * sendPetOutdoor: 送宠物外出
     * 当宠物被拖拽到户外区域时调用
     *
     * @param {string} destination - 目的地
     *   - 'play': 去森林玩耍
     *   - 'hunt': 去游猎区战斗
     */
    sendPetOutdoor(destination) {
      // ====== 步骤 1: 设置状态 ======
      if (destination === 'play') {
        this.pet.status = 'playing'
      } else if (destination === 'hunt') {
        this.pet.status = 'hunting'
      }

      // ====== 步骤 2: 设置不在家 ======
      this.pet.isAtHome = false

      console.log(`宠物外出${destination === 'play' ? '玩耍' : '战斗'}了`)
    },

    /**
     * recallPet: 召回宠物
     * 当宠物被从户外区拖回水晶球时调用
     */
    recallPet() {
      // ====== 步骤 1: 设置在家 ======
      this.pet.isAtHome = true

      // ====== 步骤 2: 恢复状态 ======
      this.pet.status = 'idle'

      console.log('宠物回家了')
    },

    /**
     * spendMoney: 花费金币
     * 在商店购买物品时调用
     *
     * @param {number} amount - 花费金额
     */
    spendMoney(amount) {
      // 检查金币是否足够
      if (this.money < amount) {
        console.log('金币不足！')
        return false
      }

      // 扣除金币
      this.money -= amount
      console.log(`花费 ${amount} 金币，剩余 ${this.money}`)
      return true
    },

    /**
     * earnMoney: 赚取金币
     * 宠物战斗胜利或完成任务时调用
     *
     * @param {number} amount - 赚取金额
     */
    earnMoney(amount) {
      this.money += amount
      console.log(`获得 ${amount} 金币，现在有 ${this.money}`)
    },

    /**
     * decreaseStats: 随时间降低属性
     * 模拟宠物的生理需求
     * 应该在游戏的时间循环中定期调用
     */
    decreaseStats() {
      // 饱食度慢慢下降（在家降得慢，户外降得快）
      const hungerDecay = this.pet.isAtHome ? 1 : 2
      this.pet.hunger = Math.max(0, this.pet.hunger - hungerDecay)

      // 心情慢慢下降
      const moodDecay = this.pet.isAtHome ? 0.5 : 1
      this.pet.mood = Math.max(0, this.pet.mood - moodDecay)

      // 如果饱食度很低，宠物会疲惫
      if (this.pet.hunger < 20) {
        this.pet.status = 'tired'
      }

      // 如果心情很低，宠物会难过
      if (this.pet.mood < 20 && this.pet.status !== 'tired') {
        this.pet.status = 'sad'
      }
    },

    /**
     * increaseMood: 增加心情
     * 玩耍或互动时调用
     *
     * @param {number} amount - 增加量
     */
    increaseMood(amount) {
      this.pet.mood = Math.min(100, this.pet.mood + amount)
      console.log(`心情增加到 ${this.pet.mood}`)
    },

    /**
     * addExperience: 增加经验值
     * 完成任务或战斗胜利时调用
     *
     * @param {number} amount - 经验值
     */
    addExperience(amount) {
      this.pet.experience += amount

      // 检查是否升级（每100经验升一级）
      const newLevel = Math.floor(this.pet.experience / 100) + 1
      if (newLevel > this.pet.level) {
        this.pet.level = newLevel
        console.log(`宠物升级到 ${newLevel} 级！`)
        // 可以在这里触发升级特效
      }
    }
  }
})
