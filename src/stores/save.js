/**
 * save.js - 存档管理
 *
 * 这个 store 管理游戏的存档系统，包括：
 * - 自动保存
 * - 手动存档槽位（3个）
 * - 存档导入导出
 * - 离线时间计算
 * - 版本迁移
 */

import { defineStore } from 'pinia'
import { useGameStore } from './game.js'
import { useBackpackStore } from './backpack.js'
import { useOutdoorStore } from './outdoor.js'
import { useNotificationStore } from './notification.js'
import { usePetCollectionStore } from './petCollection.js'
import { useSynthesisStore } from './synthesis.js'
import i18n from '../i18n'
import {
  CURRENT_SAVE_VERSION,
  validateSaveData,
  migrateSaveIfNeeded
} from './saveVersion.js'

/**
 * localStorage 键名
 */
const STORAGE_KEY = 'magicPotion_saves'

/**
 * 创建 save store
 */
export const useSaveStore = defineStore('save', {
  /**
   * state: 存档管理状态
   */
  state: () => ({
    /**
     * currentSlotIndex: 当前使用的存档槽位
     * -1 = 使用自动存档
     * 0-2 = 手动存档槽位
     */
    currentSlotIndex: -1,

    /**
     * lastSaveTime: 最后一次保存时间戳
     */
    lastSaveTime: null,

    /**
     * isSaving: 是否正在保存中
     * 防止重复保存
     */
    isSaving: false,

    /**
     * saveList: 存档列表（用于UI显示）
     */
    saveList: [],

    /**
     * autoSaveTimer: 自动保存定时器ID
     */
    autoSaveTimer: null
  }),

  /**
   * getters: 计算属性
   */
  getters: {
    /**
     * hasAnySave: 是否有任何存档
     * @returns {boolean}
     */
    hasAnySave: (state) => state.saveList.some(slot => slot !== null),

    /**
     * currentSaveInfo: 获取当前存档信息
     * @returns {Object|null} 存档信息对象
     */
    currentSaveInfo: (state) => {
      if (state.currentSlotIndex === -1) {
        return { name: '自动存档', type: 'auto' }
      }
      const save = state.saveList[state.currentSlotIndex]
      return save ? { name: save.meta.name, type: 'manual' } : null
    },

    /**
     * formattedPlayTime: 格式化游戏时长
     * @returns {Function} 格式化函数
     */
    formattedPlayTime: () => (minutes) => {
      const { t } = i18n.global
      if (!minutes || minutes < 0) return t('saveManager.timeFormat.minutes', { minutes: 0 })

      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60

      if (hours > 0) {
        return t('saveManager.timeFormat.hoursMinutes', { hours, minutes: mins })
      }
      return t('saveManager.timeFormat.minutes', { minutes: mins })
    }
  },

  /**
   * actions: 存档操作方法
   */
  actions: {
    // ========== 核心保存方法 ==========

    /**
     * createSnapshot: 创建游戏状态快照
     * 从各个 store 收集数据，创建完整的存档对象
     *
     * @param {string} customName - 自定义存档名称（可选）
     * @returns {Object} 存档数据对象
     */
    createSnapshot(customName = null) {
      const gameStore = useGameStore()
      const backpackStore = useBackpackStore()
      const outdoorStore = useOutdoorStore()
      const petCollectionStore = usePetCollectionStore()
      const synthesisStore = useSynthesisStore()

      // 获取当前时间戳
      const now = Date.now()

      return {
        meta: {
          id: this.generateSaveId(),
          name: customName || (this.currentSlotIndex >= 0
            ? `存档 ${this.currentSlotIndex + 1}`
            : '自动存档'),
          version: CURRENT_SAVE_VERSION,
          createdAt: now,
          updatedAt: now,
          playTime: gameStore.gameTime || 0
        },
        game: {
          money: gameStore.money,
          gameTime: gameStore.gameTime,
          pet: { ...gameStore.pet },
          activeBuffs: JSON.parse(JSON.stringify(gameStore.activeBuffs))
        },
        backpack: {
          items: JSON.parse(JSON.stringify(backpackStore.items))
        },
        outdoor: {
          playingPet: outdoorStore.playingPet ? { ...outdoorStore.playingPet } : null,
          huntingPet: outdoorStore.huntingPet ? { ...outdoorStore.huntingPet } : null,
          playStartTime: outdoorStore.playStartTime,
          huntStartTime: outdoorStore.huntStartTime
        },
        petCollection: {
          ownedPets: JSON.parse(JSON.stringify(petCollectionStore.ownedPets)),
          activePetId: petCollectionStore.activePetId
        },
        synthesis: {
          failCount: { ...synthesisStore.failCount }
        }
      }
    },

    /**
     * autoSave: 自动保存
     * 保存到自动存档槽位
     */
    async autoSave() {
      if (this.isSaving) return

      this.isSaving = true
      try {
        const snapshot = this.createSnapshot()
        const storage = this.loadStorage()

        storage.autoSave = snapshot
        storage.settings.lastSlotIndex = this.currentSlotIndex

        this.saveStorage(storage)
        this.lastSaveTime = Date.now()

        console.log('💾 自动保存成功')
      } catch (error) {
        console.error(i18n.global.t('notifications.save.saveFailed', { error: error.message }))
      } finally {
        this.isSaving = false
      }
    },

    /**
     * saveToSlot: 保存到指定槽位
     *
     * @param {number} slotIndex - 槽位索引（0-2）
     * @param {string} customName - 自定义存档名称（可选）
     * @returns {boolean} 是否保存成功
     * @throws {Error} 如果槽位无效
     */
    async saveToSlot(slotIndex, customName = null) {
      if (slotIndex < 0 || slotIndex >= 3) {
        throw new Error('无效的存档槽位')
      }

      if (this.isSaving) {
        throw new Error('正在保存中，请稍后再试')
      }

      this.isSaving = true
      try {
        const snapshot = this.createSnapshot(customName)
        const storage = this.loadStorage()

        storage.slots[slotIndex] = snapshot
        storage.settings.lastSlotIndex = slotIndex

        this.saveStorage(storage)

        this.currentSlotIndex = slotIndex
        this.lastSaveTime = Date.now()
        this.refreshSaveList()

        console.log(`💾 已保存到槽位 ${slotIndex + 1}: ${snapshot.meta.name}`)
        return true
      } catch (error) {
        console.error(i18n.global.t('notifications.save.saveFailed', { error: error.message }))
        throw error
      } finally {
        this.isSaving = false
      }
    },

    /**
     * loadFromSlot: 从指定槽位加载
     *
     * @param {number} slotIndex - 槽位索引（-1表示自动存档）
     * @returns {Object} 加载的存档数据
     * @throws {Error} 如果存档不存在或无效
     */
    async loadFromSlot(slotIndex) {
      const storage = this.loadStorage()

      const saveData = slotIndex === -1
        ? storage.autoSave
        : storage.slots[slotIndex]

      if (!saveData) {
        throw new Error('存档不存在')
      }

      // 验证存档数据
      if (!validateSaveData(saveData)) {
        throw new Error('存档数据损坏或无效')
      }

      // 版本检查和迁移
      const migratedData = migrateSaveIfNeeded(saveData)

      // 应用存档数据
      await this.applySaveData(migratedData)

      this.currentSlotIndex = slotIndex
      this.lastSaveTime = Date.now()

      console.log(`📂 已加载存档: ${migratedData.meta.name}`)
      return migratedData
    },

    /**
     * applySaveData: 应用存档数据到游戏状态
     *
     * @param {Object} saveData - 存档数据
     */
    async applySaveData(saveData) {
      const gameStore = useGameStore()
      const backpackStore = useBackpackStore()
      const outdoorStore = useOutdoorStore()
      const petCollectionStore = usePetCollectionStore()
      const synthesisStore = useSynthesisStore()
      const notificationStore = useNotificationStore()

      // 计算离线时间
      const offlineMinutes = Math.floor(
        (Date.now() - saveData.meta.updatedAt) / 60000
      )

      // 恢复游戏状态
      gameStore.money = saveData.game.money
      gameStore.gameTime = saveData.game.gameTime
      gameStore.pet = { ...saveData.game.pet }
      gameStore.activeBuffs = [...saveData.game.activeBuffs]

      // 恢复背包
      backpackStore.items = JSON.parse(JSON.stringify(saveData.backpack.items))

      // 恢复户外状态（如果有）
      outdoorStore.playingPet = saveData.outdoor.playingPet
        ? { ...saveData.outdoor.playingPet }
        : null
      outdoorStore.huntingPet = saveData.outdoor.huntingPet
        ? { ...saveData.outdoor.huntingPet }
        : null
      outdoorStore.playStartTime = saveData.outdoor.playStartTime
      outdoorStore.huntStartTime = saveData.outdoor.huntStartTime

      // 恢复宠物收集数据（如果有，兼容旧存档）
      if (saveData.petCollection) {
        petCollectionStore.ownedPets = JSON.parse(JSON.stringify(saveData.petCollection.ownedPets))
        petCollectionStore.activePetId = saveData.petCollection.activePetId
      } else {
        // 旧存档迁移：初始化宠物收集
        petCollectionStore.initWithStarterPet(saveData.game.pet)
      }

      // 恢复合成数据（如果有）
      if (saveData.synthesis) {
        synthesisStore.failCount = { ...saveData.synthesis.failCount }
      }

      // 应用离线属性衰减
      if (offlineMinutes > 0) {
        this.applyOfflineDecay(offlineMinutes)

        // 显示离线通知
        const { t } = i18n.global
        if (offlineMinutes >= 60) {
          const hours = Math.floor(offlineMinutes / 60)
          const mins = offlineMinutes % 60
          notificationStore.info(
            t('notifications.offline', { hours, minutes: mins })
          )
        } else {
          notificationStore.info(t('notifications.offlineMinutes', { minutes: offlineMinutes }))
        }
      }
    },

    /**
     * applyOfflineDecay: 应用离线期间属性衰减
     *
     * @param {number} minutes - 离线分钟数
     */
    applyOfflineDecay(minutes) {
      const gameStore = useGameStore()
      const notificationStore = useNotificationStore()

      // 计算衰减量（与在线时相同的逻辑）
      // 在家每分钟降1点饱食度，户外每分钟降2点
      const hungerDecay = gameStore.pet.isAtHome
        ? minutes * 1
        : minutes * 2

      // 心情每分钟减少5点
      const moodDecay = minutes * 5

      // 应用衰减
      const oldHunger = gameStore.pet.hunger
      const oldMood = gameStore.pet.mood

      gameStore.pet.hunger = Math.max(0, gameStore.pet.hunger - hungerDecay)
      gameStore.pet.mood = Math.max(0, gameStore.pet.mood - moodDecay)

      // 如果饱食度降得很低，显示警告
      if (gameStore.pet.hunger < 20 && oldHunger >= 20) {
        notificationStore.warning(i18n.global.t('notifications.hungerDrop', { from: oldHunger, to: gameStore.pet.hunger }))
      }

      // 如果心情降得很低，显示警告
      if (gameStore.pet.mood < 20 && oldMood >= 20) {
        notificationStore.warning(i18n.global.t('notifications.moodDrop', { from: oldMood, to: gameStore.pet.mood }))
      }

      console.log(`离线衰减应用: ${minutes}分钟, 饱食度 ${oldHunger}->${gameStore.pet.hunger}, 心情 ${oldMood}->${gameStore.pet.mood}`)
    },

    // ========== 存档管理 ==========

    /**
     * deleteSlot: 删除指定槽位的存档
     *
     * @param {number} slotIndex - 槽位索引
     */
    deleteSlot(slotIndex) {
      if (slotIndex < 0 || slotIndex >= 3) {
        throw new Error('无效的存档槽位')
      }

      const storage = this.loadStorage()
      storage.slots[slotIndex] = null
      this.saveStorage(storage)

      // 如果删除的是当前使用的槽位，切换到自动存档
      if (this.currentSlotIndex === slotIndex) {
        this.currentSlotIndex = -1
      }

      this.refreshSaveList()
      console.log(`🗑️ 已删除槽位 ${slotIndex + 1} 的存档`)
    },

    /**
     * refreshSaveList: 刷新存档列表
     * 从 localStorage 重新加载存档信息
     */
    refreshSaveList() {
      const storage = this.loadStorage()
      this.saveList = storage.slots
    },

    /**
     * getSlotInfo: 获取指定槽位的存档信息
     *
     * @param {number} index - 槽位索引
     * @returns {Object|null} 存档信息或 null
     */
    getSlotInfo(index) {
      return this.saveList[index] || null
    },

    /**
     * exportSave: 导出存档为JSON文件
     *
     * @param {number} slotIndex - 槽位索引（-1表示自动存档）
     */
    exportSave(slotIndex) {
      const storage = this.loadStorage()
      const saveData = slotIndex === -1
        ? storage.autoSave
        : storage.slots[slotIndex]

      if (!saveData) {
        throw new Error('存档不存在')
      }

      // 创建 JSON 文件
      const blob = new Blob([JSON.stringify(saveData, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')

      // 生成文件名
      const timestamp = new Date().toISOString().split('T')[0]
      a.href = url
      a.download = `magic-potion-${saveData.meta.name}-${timestamp}.json`

      // 触发下载
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log(`📤 已导出存档: ${saveData.meta.name}`)
    },

    /**
     * importSave: 从JSON文件导入存档
     *
     * @param {File} file - 文件对象
     * @param {number} targetSlotIndex - 目标槽位索引
     * @returns {Promise<Object>} 导入的存档数据
     */
    async importSave(file, targetSlotIndex) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const saveData = JSON.parse(e.target.result)

            // 验证存档格式
            if (!validateSaveData(saveData)) {
              reject(new Error('无效的存档文件'))
              return
            }

            // 迁移版本
            const migratedData = migrateSaveIfNeeded(saveData)

            // 保存到指定槽位
            const storage = this.loadStorage()
            storage.slots[targetSlotIndex] = migratedData
            this.saveStorage(storage)

            this.refreshSaveList()

            console.log(`📥 已导入存档到槽位 ${targetSlotIndex + 1}`)
            resolve(migratedData)
          } catch (error) {
            reject(error)
          }
        }

        reader.onerror = () => reject(new Error('读取文件失败'))
        reader.readAsText(file)
      })
    },

    // ========== 本地存储操作 ==========

    /**
     * generateSaveId: 生成唯一存档ID
     *
     * @returns {string} 唯一ID
     */
    generateSaveId() {
      return `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },

    /**
     * loadStorage: 从 localStorage 加载存储对象
     *
     * @returns {Object} 存储对象
     */
    loadStorage() {
      try {
        const data = localStorage.getItem(STORAGE_KEY)
        if (data) {
          const parsed = JSON.parse(data)
          // 确保数据结构完整
          return this.ensureStorageStructure(parsed)
        }
      } catch (error) {
        console.error('加载存档失败:', error)
      }

      // 返回默认结构
      return this.getDefaultStorage()
    },

    /**
     * saveStorage: 保存到 localStorage
     *
     * @param {Object} storage - 存储对象
     */
    saveStorage(storage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
      } catch (error) {
        console.error('保存到本地存储失败:', error)
        throw new Error('存档空间不足或浏览器不支持本地存储')
      }
    },

    /**
     * getDefaultStorage: 获取默认存储结构
     *
     * @returns {Object} 默认存储对象
     */
    getDefaultStorage() {
      return {
        version: 1,
        autoSave: null,
        slots: [null, null, null],
        settings: {
          autoSaveInterval: 60,  // 默认60秒
          lastSlotIndex: -1
        }
      }
    },

    /**
     * ensureStorageStructure: 确保存储对象结构完整
     *
     * @param {Object} storage - 存储对象
     * @returns {Object} 修复后的存储对象
     */
    ensureStorageStructure(storage) {
      const defaults = this.getDefaultStorage()

      return {
        version: storage.version || defaults.version,
        autoSave: storage.autoSave || defaults.autoSave,
        slots: Array.isArray(storage.slots) && storage.slots.length === 3
          ? storage.slots
          : defaults.slots,
        settings: {
          autoSaveInterval: storage.settings?.autoSaveInterval || defaults.settings.autoSaveInterval,
          lastSlotIndex: storage.settings?.lastSlotIndex ?? defaults.settings.lastSlotIndex
        }
      }
    },

    // ========== 自动保存控制 ==========

    /**
     * initAutoSave: 初始化自动保存
     * 在应用启动时调用
     */
    initAutoSave() {
      // 停止可能存在的旧定时器
      this.stopAutoSave()

      const storage = this.loadStorage()
      const interval = (storage.settings.autoSaveInterval || 60) * 1000

      // 启动自动保存定时器
      this.autoSaveTimer = setInterval(() => {
        this.autoSave()
      }, interval)

      console.log(i18n.global.t('notifications.save.autoSaveEnabled', { seconds: interval / 1000 }))
    },

    /**
     * stopAutoSave: 停止自动保存
     */
    stopAutoSave() {
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer)
        this.autoSaveTimer = null
        console.log(i18n.global.t('notifications.save.autoSaveDisabled'))
      }
    },

    /**
     * setAutoSaveInterval: 设置自动保存间隔
     *
     * @param {number} seconds - 间隔秒数
     */
    setAutoSaveInterval(seconds) {
      const storage = this.loadStorage()
      storage.settings.autoSaveInterval = Math.max(10, seconds)  // 最少10秒
      this.saveStorage(storage)

      // 重新启动自动保存
      this.initAutoSave()
    },

    // ========== 存档初始化/清理 ==========

    /**
     * loadLastSave: 加载最后使用的存档
     * 在应用启动时调用
     *
     * @returns {boolean} 是否成功加载存档
     */
    async loadLastSave() {
      const storage = this.loadStorage()
      const lastSlot = storage.settings?.lastSlotIndex ?? -1

      try {
        if (lastSlot >= 0 && storage.slots[lastSlot]) {
          await this.loadFromSlot(lastSlot)
          console.log('📂 已加载上次使用的存档')
          return true
        } else if (storage.autoSave) {
          await this.loadFromSlot(-1)
          console.log('📂 已加载自动存档')
          return true
        } else {
          console.log('📂 没有找到存档，开始新游戏')
          return false
        }
      } catch (error) {
        console.error('加载存档失败:', error)
        return false
      }
    },

    /**
     * restartGame: 重新开始游戏
     * 清空存档、重置所有 store、重新初始化初始宠物
     */
    restartGame() {
      // 停止自动保存，避免在重置过程中触发保存
      this.stopAutoSave()

      // 清空本地存档
      this.clearAllSaves()

      // 获取需要重置的 store
      const gameStore = useGameStore()
      const backpackStore = useBackpackStore()
      const outdoorStore = useOutdoorStore()
      const synthesisStore = useSynthesisStore()
      const petCollectionStore = usePetCollectionStore()
      const notificationStore = useNotificationStore()

      // 重置各 store 到初始状态
      gameStore.$reset()
      backpackStore.$reset()
      outdoorStore.clearAll()
      synthesisStore.clearAll()
      notificationStore.clearAll()

      // 清空宠物收集并重新创建初始宠物
      petCollectionStore.clearAll()
      petCollectionStore.initWithStarterPet()

      // 同步初始宠物数据到 game store
      const starterPet = petCollectionStore.activePet
      if (starterPet) {
        gameStore.pet.name = starterPet.name
        gameStore.pet.hunger = starterPet.hunger
        gameStore.pet.mood = starterPet.mood
        gameStore.pet.health = starterPet.health
        gameStore.pet.level = starterPet.level
        gameStore.pet.experience = starterPet.experience
        gameStore.pet.status = starterPet.status
        gameStore.pet.isAtHome = starterPet.isAtHome
        gameStore.pet.isDead = starterPet.isDead
      }

      // 重新启动自动保存
      this.initAutoSave()

      console.log('🔄 游戏已重新开始')
    },

    /**
     * clearAllSaves: 清理所有存档
     * 谨慎使用！
     */
    clearAllSaves() {
      localStorage.removeItem(STORAGE_KEY)
      this.saveList = [null, null, null]
      this.currentSlotIndex = -1
      this.lastSaveTime = null

      console.log('🗑️ 所有存档已清理')
    }
  }
})
