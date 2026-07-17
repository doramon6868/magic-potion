/**
 * outdoor.js - 户外状态管理
 *
 * 这个 store 管理宠物在户外区域的状态
 * 包括：森林玩耍区和游猎战斗区
 */

import { defineStore } from 'pinia'
import { useGameStore } from './game.js'
import { useNotificationStore } from './notification.js'
import { useFragmentStore } from './fragments.js'
import { usePetCollectionStore } from './petCollection.js'
import { getFragmentType } from '../config/fragmentTypes.js'
import i18n from '../i18n'

/**
 * 创建 outdoor store
 */
export const useOutdoorStore = defineStore('outdoor', {

  /**
   * state: 户外区域数据
   */
  state: () => ({
    /**
     * playingPet: 在玩耍区的宠物
     * 如果没有宠物在这里，为 null
     */
    playingPet: null,

    /**
     * huntingPet: 在游猎区的宠物
     * 如果没有宠物在这里，为 null
     */
    huntingPet: null,

    /**
     * playStartTime: 玩耍开始时间
     * 用于计算玩耍时长
     */
    playStartTime: null,

    /**
     * huntStartTime: 战斗开始时间
     */
    huntStartTime: null,

    /**
     * huntTimer: 战斗计时器 ID
     * 用于取消计时器
     */
    huntTimer: null
  }),

  /**
   * getters: 计算属性
   */
  getters: {
    /**
     * isPetPlaying: 是否有宠物在玩耍
     * @returns {boolean}
     */
    isPetPlaying: (state) => state.playingPet !== null,

    /**
     * isPetHunting: 是否有宠物在战斗
     * @returns {boolean}
     */
    isPetHunting: (state) => state.huntingPet !== null,

    /**
     * playDuration: 玩耍时长（秒）
     * @returns {number}
     */
    playDuration: (state) => {
      if (!state.playStartTime) return 0
      return Math.floor((Date.now() - state.playStartTime) / 1000)
    },

    /**
     * huntDuration: 战斗时长（秒）
     * @returns {number}
     */
    huntDuration: (state) => {
      if (!state.huntStartTime) return 0
      return Math.floor((Date.now() - state.huntStartTime) / 1000)
    }
  },

  /**
   * actions: 户外操作方法
   */
  actions: {
    /**
     * sendToPlay: 送宠物去玩耍
     *
     * @param {Object} pet - 宠物对象
     */
    sendToPlay(pet) {
      const gameStore = useGameStore()
      const notificationStore = useNotificationStore()
      const petCollectionStore = usePetCollectionStore()

      // 检查宠物是否死亡
      if (gameStore.pet.isDead) {
        notificationStore.error(i18n.global.t('notifications.pet.dead'))
        return false
      }

      // ====== 步骤 1: 保存宠物到玩耍区 ======
      // 创建宠物副本，避免直接修改原对象
      this.playingPet = { ...pet, status: 'playing', isAtHome: false }

      // ====== 步骤 2: 记录开始时间 ======
      this.playStartTime = Date.now()

      // ====== 步骤 3: 应用被动技能 - 探险时间减少 ======
      const playDuration = petCollectionStore.applyPassiveSkillEffect('explore_time_reduce', 3000)

      console.log('宠物开始玩耍了！', playDuration < 3000 ? `(迅捷之风生效: ${playDuration}ms)` : '')

      // ====== 步骤 4: 自动结束玩耍 ======
      // 实际游戏中可能需要更长时间，这里为了演示用3秒（被动技能可能减少）
      setTimeout(() => {
        this.finishPlay()
      }, playDuration)

      return true
    },

    /**
     * finishPlay: 结束玩耍
     * 增加宠物的心情，并有几率掉落碎片
     */
    finishPlay() {
      // 如果没有宠物在玩耍，直接返回
      if (!this.playingPet) return

      console.log('玩耍结束！')

      // 获取 store
      const gameStore = useGameStore()
      const notificationStore = useNotificationStore()
      const fragmentStore = useFragmentStore()
      const petCollectionStore = usePetCollectionStore()

      // 增加心情（玩耍让宠物开心）
      gameStore.increaseMood(10)

      // 增加经验
      gameStore.addExperience(10)

      // 碎片掉落判定
      const currentPetType = petCollectionStore.activePet?.petType || 'cat'
      const droppedFragment = fragmentStore.rollFragmentDrop('forest', currentPetType)

      if (droppedFragment) {
        fragmentStore.addFragment(droppedFragment, 1)
        const fragmentConfig = getFragmentType(droppedFragment)
        notificationStore.success(`🎉 获得碎片！${fragmentConfig?.icon} ${fragmentConfig?.name}`)
      }

      // 显示收益通知
      notificationStore.success(i18n.global.t('notifications.play.complete'))

      // 清空玩耍区
      this.playingPet = null
      this.playStartTime = null

      // 宠物自动回家
      gameStore.recallPet()
    },

    /**
     * sendToHunt: 送宠物去战斗
     *
     * @param {Object} pet - 宠物对象
     */
    sendToHunt(pet) {
      const gameStore = useGameStore()
      const notificationStore = useNotificationStore()

      // 检查宠物是否死亡
      if (gameStore.pet.isDead) {
        notificationStore.error(i18n.global.t('notifications.pet.dead'))
        return false
      }

      // ====== 步骤 1: 保存宠物到游猎区 ======
      this.huntingPet = { ...pet, status: 'hunting', isAtHome: false }

      // ====== 步骤 2: 记录开始时间 ======
      this.huntStartTime = Date.now()

      console.log('宠物开始战斗了！')

      // ====== 步骤 3: 战斗过程中每秒减少健康2点（总共10点）和饱食度 ======
      let battleTick = 0
      const battleInterval = setInterval(() => {
        battleTick++
        // 每秒减少健康2点，总共5秒减少10点
        gameStore.pet.health = Math.max(0, gameStore.pet.health - 2)
        // 同时减少饱食度（战斗消耗体力）
        gameStore.pet.hunger = Math.max(0, gameStore.pet.hunger - 3)

        // 5秒后结束战斗
        if (battleTick >= 5) {
          clearInterval(battleInterval)
        }
      }, 1000)

      // 保存定时器ID以便可以取消
      this.huntBattleInterval = battleInterval

      // ====== 步骤 4: 设置战斗结束计时器 ======
      // 5秒后战斗结束
      this.huntTimer = setTimeout(() => {
        this.finishHunt()
      }, 5000)

      return true
    },

    /**
     * finishHunt: 结束战斗
     * 计算战斗结果：胜利（获得金币）或死亡
     */
    finishHunt() {
      // 如果没有宠物在战斗，直接返回
      if (!this.huntingPet) return

      console.log('战斗结束！')

      // 获取 stores
      const gameStore = useGameStore()
      const notificationStore = useNotificationStore()

      // ====== 步骤 1: 计算死亡概率 ======
      // 基础死亡概率 10%，幸运护符和宠物被动技能可降低
      let deathChance = 0.1

      // 应用宠物被动技能 - 死亡概率降低
      const petCollectionStore = usePetCollectionStore()
      deathChance = petCollectionStore.applyPassiveSkillEffect('death_chance_reduce', deathChance)

      const deathReduceBuff = gameStore.consumeBuff('death_chance_reduce')
      if (deathReduceBuff) {
        deathChance -= deathReduceBuff.value
        console.log(`幸运护符生效，死亡概率降低至 ${Math.round(deathChance * 100)}%`)
      }

      // 计算战斗结果
      const isDead = Math.random() < deathChance

      if (isDead) {
        // ====== 情况 1: 宠物死亡 ======
        console.log('宠物在战斗中阵亡了...')

        // 检查是否有死亡保护buff
        const moneyProtectBuff = gameStore.consumeBuff('death_money_protect')

        if (moneyProtectBuff) {
          notificationStore.warning(i18n.global.t('notifications.battle.deathWithProtection'))
        } else {
          notificationStore.error(i18n.global.t('notifications.battle.deathNoProtection'))
        }

        // 设置死亡状态
        gameStore.pet.isDead = true
        gameStore.pet.health = 0
        gameStore.pet.status = 'dead'

      } else {
        // ====== 情况 2: 战斗胜利 ======
        console.log('战斗胜利！')

        // 计算基础奖励（随机 50-100 金币）
        let reward = Math.floor(Math.random() * 51) + 50

        // 应用宠物被动技能 - 战斗奖励加成
        reward = petCollectionStore.applyPassiveSkillEffect('hunt_reward_boost', reward)

        // 检查是否有战斗奖励加成buff
        const rewardBuff = gameStore.consumeBuff('hunt_reward_boost')
        let bonusReward = 0
        if (rewardBuff) {
          bonusReward = Math.floor(reward * rewardBuff.value)
          reward += bonusReward
        }

        gameStore.earnMoney(reward)

        // 增加经验（支持经验加成buff）
        const expAmount = gameStore.addExperience(25)

        // 构建胜利通知
        let successMsg = i18n.global.t('notifications.battle.victory')
        if (rewardBuff) {
          successMsg += ' ' + i18n.global.t('notifications.battle.baseReward', { amount: reward - bonusReward }) +
            i18n.global.t('notifications.battle.bonusReward', { amount: bonusReward }) +
            i18n.global.t('notifications.battle.totalReward', { amount: reward })
        } else {
          successMsg += ' ' + i18n.global.t('notifications.battle.totalReward', { amount: reward })
        }
        if (expAmount > 25) {
          successMsg += ' ' + i18n.global.t('notifications.battle.expBonus', { amount: expAmount })
        }
        notificationStore.success(successMsg)

        // 检查是否需要触发自动治疗buff
        if (gameStore.pet.health < 30) {
          const autoHealBuff = gameStore.consumeBuff('auto_heal')
          if (autoHealBuff) {
            const oldHealth = gameStore.pet.health
            gameStore.pet.health = Math.min(100, gameStore.pet.health + autoHealBuff.value)
            const healedAmount = gameStore.pet.health - oldHealth
            notificationStore.success(i18n.global.t('notifications.battle.autoHeal', { amount: healedAmount }))
          }
        }
      }

      // ====== 步骤 2: 清空游猎区 ======
      this.huntingPet = null
      this.huntStartTime = null
      this.huntTimer = null

      // 清除战斗过程定时器
      if (this.huntBattleInterval) {
        clearInterval(this.huntBattleInterval)
        this.huntBattleInterval = null
      }

      // ====== 步骤 3: 碎片掉落判定 ======
      const fragmentStore = useFragmentStore()

      const currentPetType = petCollectionStore.activePet?.petType || 'cat'
      const droppedFragment = fragmentStore.rollFragmentDrop('hunt', currentPetType)

      if (droppedFragment) {
        fragmentStore.addFragment(droppedFragment, 1)
        const fragmentConfig = getFragmentType(droppedFragment)
        notificationStore.success(`🎉 战斗奖励！获得 ${fragmentConfig?.icon} ${fragmentConfig?.name}`)
      }

      // ====== 步骤 4: 宠物回家 ======
      gameStore.recallPet()
    },

    /**
     * recallFromOutdoor: 从户外召回宠物
     * 当宠物被拖拽回水晶球时调用
     *
     * @param {string} from - 从哪个区域召回 ('play' 或 'hunt')
     */
    recallFromOutdoor(from) {
      if (from === 'play') {
        // 从玩耍区召回
        this.playingPet = null
        this.playStartTime = null
      } else if (from === 'hunt') {
        // 从游猎区召回
        // 取消战斗计时器
        if (this.huntTimer) {
          clearTimeout(this.huntTimer)
          this.huntTimer = null
        }
        // 取消战斗过程定时器
        if (this.huntBattleInterval) {
          clearInterval(this.huntBattleInterval)
          this.huntBattleInterval = null
        }
        this.huntingPet = null
        this.huntStartTime = null
      }

      console.log(`宠物从 ${from === 'play' ? '玩耍区' : '游猎区'} 被召回`)
    },

    /**
     * clearAll: 清空所有户外状态
     * 用于重置游戏等场景
     */
    clearAll() {
      // 取消计时器
      if (this.huntTimer) {
        clearTimeout(this.huntTimer)
      }
      if (this.huntBattleInterval) {
        clearInterval(this.huntBattleInterval)
      }

      // 清空数据
      this.playingPet = null
      this.huntingPet = null
      this.playStartTime = null
      this.huntStartTime = null
      this.huntTimer = null
      this.huntBattleInterval = null
    }
  }
})
