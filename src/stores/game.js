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
import { useNotificationStore } from './notification.js'

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
      experience: 0,

      /**
       * isDead: 是否死亡
       * true = 死亡，false = 存活
       * 死亡的宠物不能战斗或玩耍，需要复活药水
       */
      isDead: false
    },

    /**
     * gameTime: 游戏时间（分钟）
     * 用于追踪游戏进度
     */
    gameTime: 0,

    /**
     * activeBuffs: 当前激活的道具增益效果
     * 每个buff包含：type, value, duration（剩余次数）
     */
    activeBuffs: []
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
     *   - moodValue: 增加多少心情
     *   - name: 食物名称
     *   - category: 物品分类
     *   - buff: 增益效果
     */
    feedPet(item) {
      // 获取通知 store
      const notificationStore = useNotificationStore()

      // ====== 步骤 1: 检查是否在家 ======
      // 只有在家才能喂食
      if (!this.pet.isAtHome) {
        notificationStore.warning('⚠️ 宠物不在家，无法喂食！')
        return false
      }

      // ====== 步骤 2: 检查物品类型 ======
      // 如果是纯增益类道具（无食物效果），使用激活buff方式
      if (item.category === 'combat' || item.category === 'charm') {
        return this.activateBuff(item)
      }

      // 心情类道具（只加心情不加饱食度）
      if (item.category === 'mood' && item.foodValue === 0) {
        return this.useMoodItem(item)
      }

      // 特殊处理：复活药水
      if (item.category === 'special' && item.name === '复活药水') {
        return this.useRevivePotion(item)
      }

      // ====== 步骤 3: 检查是否满饱食度 ======
      if (this.pet.hunger >= 100 && item.foodValue > 0) {
        notificationStore.warning('⚠️ 宠物已经吃饱了！')
        return false
      }

      // ====== 步骤 4: 从背包中移除物品 ======
      const backpackStore = useBackpackStore()
      const removed = backpackStore.removeItem(item.id, 1)

      // 如果移除失败（物品不存在或数量不足），返回失败
      if (!removed) {
        notificationStore.error('❌ 背包中没有这个物品！')
        return false
      }

      // ====== 步骤 5: 修改状态为进食中 ======
      this.pet.status = 'eating'

      // ====== 步骤 6: 增加饱食度 ======
      // 使用 Math.min 确保不超过 100
      const oldHunger = this.pet.hunger
      const hungerIncrease = item.foodValue || 0
      this.pet.hunger = Math.min(100, this.pet.hunger + hungerIncrease)

      // 实际增加的数值（考虑满值限制）
      const actualHungerIncrease = this.pet.hunger - oldHunger

      console.log(`喂食 ${item.name}，饱食度从 ${oldHunger} 增加到 ${this.pet.hunger}`)

      // ====== 步骤 7: 增加心情 ======
      // 根据物品的moodValue增加心情，如果没有则默认+5
      const oldMood = this.pet.mood
      const moodIncrease = item.moodValue !== undefined ? item.moodValue : 5
      this.pet.mood = Math.min(100, this.pet.mood + moodIncrease)

      // 构建效果描述
      let effectText = ''
      if (actualHungerIncrease > 0) {
        effectText += `饱食度 +${actualHungerIncrease}`
      }
      if (moodIncrease > 0) {
        effectText += (effectText ? '，' : '') + `心情 +${moodIncrease}`
      }

      // 显示喂养成功通知
      notificationStore.success(`✅ 喂食成功！${item.name}让宠物很开心~ ${effectText}`)

      // ====== 步骤 8: 3秒后恢复 idle 状态 ======
      setTimeout(() => {
        this.pet.status = 'idle'
      }, 3000)

      // ====== 步骤 9: 返回成功 ======
      return true
    },

    /**
     * activateBuff: 激活道具增益效果
     * 用于战斗准备类、风险管控类道具
     *
     * @param {Object} item - 道具物品
     */
    activateBuff(item) {
      const notificationStore = useNotificationStore()
      const backpackStore = useBackpackStore()

      // 检查是否有buff
      if (!item.buff) {
        notificationStore.error('❌ 这个道具没有效果！')
        return false
      }

      // 特殊处理：时间沙漏立即生效，不加入buff列表
      if (item.buff.type === 'reset_decay') {
        // 从背包移除
        const removed = backpackStore.removeItem(item.id, 1)
        if (!removed) {
          notificationStore.error('❌ 背包中没有这个物品！')
          return false
        }
        // 直接触发效果
        this.resetAllDecay()
        notificationStore.success(`⏳ ${item.name}生效！时间倒流，所有属性已恢复！`)
        return true
      }

      // 从背包移除
      const removed = backpackStore.removeItem(item.id, 1)
      if (!removed) {
        notificationStore.error('❌ 背包中没有这个物品！')
        return false
      }

      // 添加buff到激活列表
      this.activeBuffs.push({
        type: item.buff.type,
        value: item.buff.value,
        duration: item.buff.duration,
        name: item.name,
        icon: item.icon
      })

      // 显示激活通知
      let buffDesc = ''
      switch (item.buff.type) {
        case 'hunt_reward_boost':
          buffDesc = `下次战斗奖励+${Math.round(item.buff.value * 100)}%`
          break
        case 'hunger_cost_reduce':
          buffDesc = `下次探险饱食度消耗-${Math.round(item.buff.value * 100)}%`
          break
        case 'death_money_protect':
          buffDesc = '下次死亡保留全部金币'
          break
        case 'auto_heal':
          buffDesc = `健康低于${item.buff.threshold}时自动恢复${item.buff.value}点`
          break
        case 'exp_boost':
          buffDesc = `下次获得经验×${item.buff.value}`
          break
        case 'death_chance_reduce':
          buffDesc = `死亡概率-${Math.round(item.buff.value * 100)}%`
          break
        case 'reset_decay':
          buffDesc = '重置所有属性衰减'
          this.resetAllDecay()
          break
        default:
          buffDesc = '增益效果已激活'
      }

      notificationStore.success(`🛡️ ${item.name}已激活！${buffDesc}`)
      console.log(`激活buff: ${item.name}`, item.buff)

      return true
    },

    /**
     * useMoodItem: 使用纯心情类道具
     *
     * @param {Object} item - 心情道具
     */
    useMoodItem(item) {
      const notificationStore = useNotificationStore()
      const backpackStore = useBackpackStore()

      // 检查是否满心情
      if (this.pet.mood >= 100) {
        notificationStore.warning('⚠️ 宠物心情已经很好了！')
        return false
      }

      // 从背包移除
      const removed = backpackStore.removeItem(item.id, 1)
      if (!removed) {
        notificationStore.error('❌ 背包中没有这个物品！')
        return false
      }

      // 增加心情
      const oldMood = this.pet.mood
      const moodIncrease = item.moodValue || 0
      this.pet.mood = Math.min(100, this.pet.mood + moodIncrease)
      const actualIncrease = this.pet.mood - oldMood

      // 设置开心状态
      this.pet.status = 'happy'

      notificationStore.success(`🎾 和宠物玩耍了${item.name}！心情 +${actualIncrease}`)
      console.log(`使用${item.name}，心情从 ${oldMood} 增加到 ${this.pet.mood}`)

      // 3秒后恢复状态
      setTimeout(() => {
        if (this.pet.status === 'happy') {
          this.pet.status = 'idle'
        }
      }, 3000)

      return true
    },

    /**
     * useRevivePotion: 使用复活药水
     * 复活死亡的宠物，恢复50-100点健康值
     *
     * @param {Object} item - 复活药水物品
     */
    useRevivePotion(item) {
      const notificationStore = useNotificationStore()
      const backpackStore = useBackpackStore()

      // 检查宠物是否死亡
      if (!this.pet.isDead) {
        notificationStore.warning('⚠️ 宠物还活着，不需要复活药水！')
        return false
      }

      // 从背包移除
      const removed = backpackStore.removeItem(item.id, 1)
      if (!removed) {
        notificationStore.error('❌ 背包中没有这个物品！')
        return false
      }

      // 复活宠物
      this.pet.isDead = false
      // 健康值恢复到50-100之间
      this.pet.health = Math.floor(Math.random() * 51) + 50
      // 饱食度设为中等
      this.pet.hunger = 50
      // 心情设为中等
      this.pet.mood = 50
      // 恢复状态
      this.pet.status = 'idle'

      notificationStore.success(`💖 复活成功！${this.pet.name}重获新生！健康值恢复到${this.pet.health}`)
      console.log(`使用复活药水，宠物复活，健康值: ${this.pet.health}`)

      return true
    },

    /**
     * consumeBuff: 消耗一个指定类型的buff
     * 在战斗/探险结束时调用
     *
     * @param {string} buffType - buff类型
     * @returns {Object|null} 被消耗的buff
     */
    consumeBuff(buffType) {
      const index = this.activeBuffs.findIndex(buff => buff.type === buffType)
      if (index !== -1) {
        const buff = this.activeBuffs[index]
        buff.duration--
        if (buff.duration <= 0) {
          this.activeBuffs.splice(index, 1)
        }
        return buff
      }
      return null
    },

    /**
     * checkBuff: 检查是否有指定类型的buff
     *
     * @param {string} buffType - buff类型
     * @returns {boolean}
     */
    hasBuff(buffType) {
      return this.activeBuffs.some(buff => buff.type === buffType)
    },

    /**
     * getBuffValue: 获取指定类型buff的数值
     *
     * @param {string} buffType - buff类型
     * @returns {number|null}
     */
    getBuffValue(buffType) {
      const buff = this.activeBuffs.find(buff => buff.type === buffType)
      return buff ? buff.value : null
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

      // 心情每分钟减少5
      this.pet.mood = Math.max(0, this.pet.mood - 5)

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
     * resetAllDecay: 重置所有属性衰减
     * 时间沙漏的效果
     */
    resetAllDecay() {
      const notificationStore = useNotificationStore()

      // 恢复所有属性到满值
      const oldHunger = this.pet.hunger
      const oldMood = this.pet.mood
      const oldHealth = this.pet.health

      this.pet.hunger = 100
      this.pet.mood = 100
      this.pet.health = 100

      notificationStore.success(`⏳ 时间倒流！饱食度、心情、健康全部恢复！`)
      console.log(`时间沙漏生效: 饱食 ${oldHunger}->100, 心情 ${oldMood}->100, 健康 ${oldHealth}->100`)
    },

    /**
     * addExperience: 增加经验值
     * 完成任务或战斗胜利时调用
     *
     * @param {number} amount - 经验值
     */
    addExperience(amount) {
      // 检查是否有经验加成buff
      const expBuff = this.consumeBuff('exp_boost')
      let finalAmount = amount

      if (expBuff) {
        finalAmount = Math.floor(amount * expBuff.value)
        console.log(`经验加成触发: ${amount} -> ${finalAmount}`)
      }

      this.pet.experience += finalAmount

      // 检查是否升级（每100经验升一级）
      const newLevel = Math.floor(this.pet.experience / 100) + 1
      if (newLevel > this.pet.level) {
        this.pet.level = newLevel
        console.log(`宠物升级到 ${newLevel} 级！`)
        // 可以在这里触发升级特效
      }

      return finalAmount
    }
  }
})
