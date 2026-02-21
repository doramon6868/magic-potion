/**
 * petCollection.js - 宠物收集状态管理
 *
 * 这个 store 管理玩家的宠物收集和切换
 * 包括：已拥有的宠物列表、当前激活的宠物
 */

import { defineStore } from 'pinia'
import { PET_TYPES, getPetType } from '../config/petTypes.js'

export const usePetCollectionStore = defineStore('petCollection', {
  state: () => ({
    /**
     * ownedPets: 已拥有的宠物列表
     * 每个宠物是一个对象，包含：
     * - instanceId: 唯一实例ID
     * - petType: 宠物类型 (cat, bird, fox, dragon)
     * - hunger, mood, health: 当前属性
     * - level, experience: 等级和经验
     * - status, isAtHome, isDead: 状态
     */
    ownedPets: [],

    /**
     * activePetId: 当前激活的宠物实例ID
     * 只有激活的宠物会在水晶球中显示和参与活动
     */
    activePetId: null
  }),

  getters: {
    /**
     * activePet: 当前激活的宠物对象
     * @returns {Object|null}
     */
    activePet: (state) => {
      if (!state.activePetId) return null
      return state.ownedPets.find(p => p.instanceId === state.activePetId) || null
    },

    /**
     * activePetConfig: 当前激活宠物的配置信息
     * @returns {Object|null}
     */
    activePetConfig: (state) => {
      const pet = state.ownedPets.find(p => p.instanceId === state.activePetId)
      if (!pet) return null
      return getPetType(pet.petType)
    },

    /**
     * ownedPetTypes: 已拥有的宠物类型列表
     * @returns {Array<string>}
     */
    ownedPetTypes: (state) => {
      return state.ownedPets.map(p => p.petType)
    },

    /**
     * isPetOwned: 检查是否拥有某类型宠物
     * @returns {Function}
     */
    isPetOwned: (state) => (petType) => {
      return state.ownedPets.some(p => p.petType === petType)
    },

    /**
     * getOwnedPetByType: 根据类型获取已拥有的宠物
     * @returns {Function}
     */
    getOwnedPetByType: (state) => (petType) => {
      return state.ownedPets.find(p => p.petType === petType) || null
    },

    /**
     * collectionProgress: 收集进度
     * @returns {Object} { owned, total, percentage }
     */
    collectionProgress: (state) => {
      const total = Object.keys(PET_TYPES).length
      const owned = state.ownedPets.length
      return {
        owned,
        total,
        percentage: Math.round((owned / total) * 100)
      }
    },

    /**
     * hasMultiplePets: 是否拥有多只宠物
     * @returns {boolean}
     */
    hasMultiplePets: (state) => {
      return state.ownedPets.length > 1
    }
  },

  actions: {
    /**
     * initWithStarterPet: 初始化初始宠物
     * 在游戏开始或存档迁移时调用
     * @param {Object} existingStats - 已有的宠物属性（用于存档迁移）
     */
    initWithStarterPet(existingStats = null) {
      // 如果已经有初始宠物，不再创建
      if (this.ownedPets.some(p => p.petType === 'cat')) {
        console.log('初始宠物已存在，跳过初始化')
        return
      }

      const catConfig = PET_TYPES.cat
      const starterPet = {
        instanceId: `pet_starter_${Date.now()}`,
        petType: 'cat',
        name: catConfig.name,
        hunger: existingStats?.hunger ?? catConfig.baseStats.hunger,
        mood: existingStats?.mood ?? catConfig.baseStats.mood,
        health: existingStats?.health ?? catConfig.baseStats.health,
        maxHunger: catConfig.baseStats.maxHunger,
        maxMood: catConfig.baseStats.maxMood,
        maxHealth: catConfig.baseStats.maxHealth,
        level: existingStats?.level ?? 1,
        experience: existingStats?.experience ?? 0,
        status: existingStats?.status ?? 'idle',
        isAtHome: existingStats?.isAtHome ?? true,
        isDead: existingStats?.isDead ?? false
      }

      this.ownedPets.push(starterPet)
      this.activePetId = starterPet.instanceId

      console.log('初始宠物创建成功:', starterPet.name)
    },

    /**
     * addPet: 添加新宠物
     * 合成成功时调用
     * @param {string} petType - 宠物类型标识
     * @returns {string} 新宠物的instanceId
     */
    addPet(petType) {
      const petConfig = getPetType(petType)
      if (!petConfig) {
        console.error('未知的宠物类型:', petType)
        return null
      }

      // 检查是否已拥有该类型宠物
      if (this.isPetOwned(petType)) {
        console.log(`已拥有 ${petConfig.name}，不再重复添加`)
        return this.getOwnedPetByType(petType)?.instanceId
      }

      const newPet = {
        instanceId: `pet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        petType: petType,
        name: petConfig.name,
        hunger: petConfig.baseStats.hunger,
        mood: petConfig.baseStats.mood,
        health: petConfig.baseStats.health,
        maxHunger: petConfig.baseStats.maxHunger,
        maxMood: petConfig.baseStats.maxMood,
        maxHealth: petConfig.baseStats.maxHealth,
        level: 1,
        experience: 0,
        status: 'idle',
        isAtHome: true,
        isDead: false
      }

      this.ownedPets.push(newPet)

      console.log(`新宠物加入: ${newPet.name}`, newPet)
      return newPet.instanceId
    },

    /**
     * setActivePet: 设置当前激活的宠物
     * @param {string} instanceId - 宠物实例ID
     * @returns {boolean}
     */
    setActivePet(instanceId) {
      const pet = this.ownedPets.find(p => p.instanceId === instanceId)
      if (!pet) {
        console.error('未找到宠物:', instanceId)
        return false
      }

      this.activePetId = instanceId
      console.log(`切换激活宠物: ${pet.name}`)
      return true
    },

    /**
     * getPetPassiveSkill: 获取宠物的被动技能
     * @param {string} petType - 宠物类型标识
     * @returns {Object|null}
     */
    getPetPassiveSkill(petType) {
      const petConfig = getPetType(petType)
      return petConfig?.passiveSkill || null
    },

    /**
     * updateActivePetStats: 更新激活宠物的属性
     * 从 game store 同步宠物状态
     * @param {Object} stats - 新的属性值
     */
    updateActivePetStats(stats) {
      const pet = this.activePet
      if (!pet) return

      Object.assign(pet, stats)
    },

    /**
     * syncFromGameStore: 从 game store 同步宠物数据
     * 用于保持 petCollection 和 game store 中 pet 的一致性
     * @param {Object} gamePet - game store 中的 pet 对象
     */
    syncFromGameStore(gamePet) {
      if (!this.activePetId || !gamePet) return

      const pet = this.ownedPets.find(p => p.instanceId === this.activePetId)
      if (!pet) return

      // 同步属性
      pet.hunger = gamePet.hunger
      pet.mood = gamePet.mood
      pet.health = gamePet.health
      pet.level = gamePet.level
      pet.experience = gamePet.experience
      pet.status = gamePet.status
      pet.isAtHome = gamePet.isAtHome
      pet.isDead = gamePet.isDead
    },

    /**
     * applyPassiveSkillEffect: 应用被动技能效果
     * @param {string} effectType - 效果类型
     * @param {any} baseValue - 基础值
     * @returns {any} 应用效果后的值
     */
    applyPassiveSkillEffect(effectType, baseValue) {
      const skill = this.activePetConfig?.passiveSkill
      if (!skill || skill.effect !== effectType) {
        return baseValue
      }

      switch (effectType) {
        case 'explore_time_reduce':
          // 减少探险时间
          return baseValue * (1 - skill.value)
        case 'hunt_reward_boost':
          // 增加战斗奖励
          return baseValue * (1 + skill.value)
        case 'death_chance_reduce':
          // 降低死亡概率
          return Math.max(0, baseValue - skill.value)
        default:
          return baseValue
      }
    },

    /**
     * clearAll: 清空所有宠物数据
     * 重置游戏时使用
     */
    clearAll() {
      this.ownedPets = []
      this.activePetId = null
    }
  }
})
