/**
 * outdoor.js - 户外状态管理
 *
 * 这个 store 管理宠物在户外区域的状态
 * 包括：森林玩耍区和游猎战斗区
 */

import { defineStore } from 'pinia'
import { useGameStore } from './game.js'

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
      // ====== 步骤 1: 保存宠物到玩耍区 ======
      // 创建宠物副本，避免直接修改原对象
      this.playingPet = { ...pet }

      // ====== 步骤 2: 记录开始时间 ======
      this.playStartTime = Date.now()

      console.log('宠物开始玩耍了！')

      // ====== 步骤 3: 3秒后自动结束玩耍 ======
      // 实际游戏中可能需要更长时间，这里为了演示用3秒
      setTimeout(() => {
        this.finishPlay()
      }, 3000)
    },

    /**
     * finishPlay: 结束玩耍
     * 增加宠物的心情
     */
    finishPlay() {
      // 如果没有宠物在玩耍，直接返回
      if (!this.playingPet) return

      console.log('玩耍结束！')

      // 获取 game store 来修改宠物状态
      const gameStore = useGameStore()

      // 增加心情（玩耍让宠物开心）
      gameStore.increaseMood(10)

      // 增加经验
      gameStore.addExperience(10)

      // 显示收益提示
      alert('🌲 玩耍结束！心情 +10，经验 +10！')

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
      // ====== 步骤 1: 保存宠物到游猎区 ======
      this.huntingPet = { ...pet }

      // ====== 步骤 2: 记录开始时间 ======
      this.huntStartTime = Date.now()

      console.log('宠物开始战斗了！')

      // ====== 步骤 3: 设置战斗计时器 ======
      // 5秒后战斗结束
      this.huntTimer = setTimeout(() => {
        this.finishHunt()
      }, 5000)
    },

    /**
     * finishHunt: 结束战斗
     * 计算战斗结果：胜利（获得金币）或死亡
     */
    finishHunt() {
      // 如果没有宠物在战斗，直接返回
      if (!this.huntingPet) return

      console.log('战斗结束！')

      // 获取 game store
      const gameStore = useGameStore()

      // ====== 步骤 1: 计算战斗结果 ======
      // 10% 几率死亡
      const isDead = Math.random() < 0.1

      if (isDead) {
        // ====== 情况 1: 宠物死亡 ======
        console.log('宠物在战斗中阵亡了...')
        alert('💀 宠物在战斗中阵亡了！需要复活药水才能复活。')

        // 减少健康值
        gameStore.pet.health = 0
        gameStore.pet.status = 'tired'

      } else {
        // ====== 情况 2: 战斗胜利 ======
        console.log('战斗胜利！')

        // 计算奖励（随机 50-100 金币）
        const reward = Math.floor(Math.random() * 51) + 50
        gameStore.earnMoney(reward)

        // 增加经验
        gameStore.addExperience(25)

        // 显示胜利提示
        alert(`🎉 战斗胜利！获得 ${reward} 金币！`)
      }

      // ====== 步骤 2: 清空游猎区 ======
      this.huntingPet = null
      this.huntStartTime = null
      this.huntTimer = null

      // ====== 步骤 3: 宠物回家 ======
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

      // 清空数据
      this.playingPet = null
      this.huntingPet = null
      this.playStartTime = null
      this.huntStartTime = null
      this.huntTimer = null
    }
  }
})
