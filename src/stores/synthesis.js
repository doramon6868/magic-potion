/**
 * synthesis.js - 合成状态管理
 *
 * 这个 store 管理宠物合成的整个过程
 * 包括：配方选择、材料放置、合成执行、结果判定
 */

import { defineStore } from 'pinia'
import {
  SYNTHESIS_RECIPES,
  getRecipeById,
  calculateSuccessRate,
  checkUnlockRequirement,
  getPotionNameByRarity,
  getPotionIconByRarity
} from '../config/synthesisRecipes.js'
import { getPetType } from '../config/petTypes.js'
import { useFragmentStore } from './fragments.js'
import { useBackpackStore } from './backpack.js'
import { usePetCollectionStore } from './petCollection.js'
import { useNotificationStore } from './notification.js'

export const useSynthesisStore = defineStore('synthesis', {
  state: () => ({
    /**
     * selectedRecipeId: 当前选中的配方ID
     */
    selectedRecipeId: null,

    /**
     * synthesisSlots: 合成槽位状态
     * - fragments: 已放置的碎片数组
     * - potion: 已放置的药水
     */
    synthesisSlots: {
      fragments: [], // [{ type, itemId, quantity }, ...]
      potion: null // { rarity, itemId } 或 null
    },

    /**
     * isSynthesizing: 是否正在合成中
     */
    isSynthesizing: false,

    /**
     * synthesisPhase: 合成阶段
     * 可选值：'idle', 'preparing', 'fusing', 'burst', 'result'
     */
    synthesisPhase: 'idle',

    /**
     * synthesisResult: 合成结果
     * { success: boolean, pet: object, message: string } 或 null
     */
    synthesisResult: null,

    /**
     * failCount: 各配方的失败次数记录
     * { [recipeId]: count }
     */
    failCount: {}
  }),

  getters: {
    /**
     * selectedRecipe: 当前选中的配方配置
     * @returns {Object|null}
     */
    selectedRecipe: (state) => {
      if (!state.selectedRecipeId) return null
      return getRecipeById(state.selectedRecipeId)
    },

    /**
     * currentSuccessRate: 当前成功率
     * @returns {number} 0-0.95
     */
    currentSuccessRate: (state) => {
      const recipe = getRecipeById(state.selectedRecipeId)
      if (!recipe) return 0

      const failCount = state.failCount[state.selectedRecipeId] || 0
      // 简化计算，暂不考虑玩家等级
      return calculateSuccessRate(recipe, failCount, 1)
    },

    /**
     * canSynthesize: 是否可以开始合成
     * 检查材料是否充足
     * @returns {boolean}
     */
    canSynthesize: (state) => {
      const recipe = getRecipeById(state.selectedRecipeId)
      if (!recipe || state.isSynthesizing) return false

      const fragmentStore = useFragmentStore()
      const backpackStore = useBackpackStore()

      // 检查碎片数量
      const totalFragments = state.synthesisSlots.fragments.reduce(
        (sum, f) => sum + f.quantity, 0
      )
      const hasEnoughFragments = totalFragments >= recipe.fragmentCount &&
        fragmentStore.hasEnoughFragments(recipe.fragmentType, recipe.fragmentCount)

      // 检查药水
      const hasPotion = state.synthesisSlots.potion !== null

      return hasEnoughFragments && hasPotion
    },

    /**
     * isRecipeUnlocked: 配方是否已解锁
     * @returns {Function}
     */
    isRecipeUnlocked: (state) => (recipeId) => {
      const recipe = getRecipeById(recipeId)
      if (!recipe) return false

      const petCollectionStore = usePetCollectionStore()
      return checkUnlockRequirement(recipe, petCollectionStore.ownedPetTypes)
    },

    /**
     * isPetOwned: 是否已拥有目标宠物
     * @returns {Function}
     */
    isPetOwned: () => (recipeId) => {
      const recipe = getRecipeById(recipeId)
      if (!recipe) return false

      const petCollectionStore = usePetCollectionStore()
      return petCollectionStore.isPetOwned(recipe.targetPetType)
    },

    /**
     * placedFragmentCount: 已放置的碎片数量
     * @returns {number}
     */
    placedFragmentCount: (state) => {
      return state.synthesisSlots.fragments.reduce((sum, f) => sum + f.quantity, 0)
    },

    /**
     * neededFragmentCount: 还需要的碎片数量
     * @returns {number}
     */
    neededFragmentCount: (state) => {
      const recipe = getRecipeById(state.selectedRecipeId)
      if (!recipe) return 0
      return Math.max(0, recipe.fragmentCount - state.placedFragmentCount)
    },

    /**
     * pityProgress: 保底进度
     * @returns {string}
     */
    pityProgress: (state) => {
      const recipe = getRecipeById(state.selectedRecipeId)
      if (!recipe) return '0/0'

      const failCount = state.failCount[state.selectedRecipeId] || 0
      return `${failCount % recipe.pityThreshold}/${recipe.pityThreshold}`
    },

    /**
     * isPityActive: 保底是否已激活
     * @returns {boolean}
     */
    isPityActive: (state) => {
      const recipe = getRecipeById(state.selectedRecipeId)
      if (!recipe) return false

      const failCount = state.failCount[state.selectedRecipeId] || 0
      return failCount >= recipe.pityThreshold
    }
  },

  actions: {
    /**
     * selectRecipe: 选择配方
     * @param {number} recipeId - 配方ID
     */
    selectRecipe(recipeId) {
      // 检查配方是否解锁
      if (!this.isRecipeUnlocked(recipeId)) {
        console.log('配方未解锁:', recipeId)
        return false
      }

      this.selectedRecipeId = recipeId
      this.clearSlots()
      this.synthesisResult = null

      const recipe = getRecipeById(recipeId)
      console.log('选择配方:', recipe?.name)
      return true
    },

    /**
     * addFragmentToSlot: 添加碎片到槽位
     * @param {string} fragmentType - 碎片类型
     * @param {number} quantity - 数量
     * @returns {boolean}
     */
    addFragmentToSlot(fragmentType, quantity = 1) {
      const recipe = this.selectedRecipe
      if (!recipe) return false

      // 检查碎片类型是否匹配
      if (fragmentType !== recipe.fragmentType) {
        const notificationStore = useNotificationStore()
        notificationStore.warning('碎片类型不匹配！')
        return false
      }

      // 检查是否已满
      if (this.placedFragmentCount >= recipe.fragmentCount) {
        return false
      }

      // 计算实际可添加的数量
      const canAdd = Math.min(quantity, this.neededFragmentCount)

      // 添加到槽位
      const existingSlot = this.synthesisSlots.fragments.find(f => f.type === fragmentType)
      if (existingSlot) {
        existingSlot.quantity += canAdd
      } else {
        this.synthesisSlots.fragments.push({
          type: fragmentType,
          quantity: canAdd
        })
      }

      console.log(`添加碎片: ${fragmentType} x${canAdd}`)
      return true
    },

    /**
     * removeFragmentFromSlot: 从槽位移除碎片
     * @param {number} index - 槽位索引
     * @param {number} quantity - 数量（默认全部）
     */
    removeFragmentFromSlot(index, quantity = null) {
      const slot = this.synthesisSlots.fragments[index]
      if (!slot) return

      if (quantity === null || quantity >= slot.quantity) {
        // 移除整个槽位
        this.synthesisSlots.fragments.splice(index, 1)
      } else {
        // 减少数量
        slot.quantity -= quantity
      }
    },

    /**
     * setPotionSlot: 设置药水槽位
     * @param {string} rarity - 药水稀有度
     * @returns {boolean}
     */
    setPotionSlot(rarity) {
      const recipe = this.selectedRecipe
      if (!recipe) return false

      // 检查药水稀有度是否匹配
      if (rarity !== recipe.requiredPotion.rarity) {
        const notificationStore = useNotificationStore()
        notificationStore.warning(`需要${getPotionNameByRarity(recipe.requiredPotion.rarity)}！`)
        return false
      }

      this.synthesisSlots.potion = {
        rarity: rarity,
        icon: getPotionIconByRarity(rarity)
      }

      console.log('设置药水:', rarity)
      return true
    },

    /**
     * removePotionFromSlot: 移除药水槽位
     */
    removePotionFromSlot() {
      this.synthesisSlots.potion = null
    },

    /**
     * autoFillSlots: 自动填充槽位
     * 从背包自动选择所需材料
     * @returns {boolean}
     */
    autoFillSlots() {
      const recipe = this.selectedRecipe
      if (!recipe) return false

      const fragmentStore = useFragmentStore()
      const backpackStore = useBackpackStore()

      // 清空当前槽位
      this.clearSlots()

      // 自动填充碎片
      const fragmentCount = recipe.fragmentCount
      const hasEnough = fragmentStore.hasEnoughFragments(recipe.fragmentType, fragmentCount)

      if (hasEnough) {
        this.synthesisSlots.fragments.push({
          type: recipe.fragmentType,
          quantity: fragmentCount
        })
      } else {
        const notificationStore = useNotificationStore()
        notificationStore.warning('碎片数量不足！')
        return false
      }

      // 自动填充药水
      // 查找背包中符合要求的药水
      const requiredRarity = recipe.requiredPotion.rarity
      const potionItem = backpackStore.items.find(item => {
        // 这里简化处理，实际应该根据药水配置判断
        return item.category === 'special' || item.category === 'food'
      })

      if (potionItem) {
        this.synthesisSlots.potion = {
          rarity: requiredRarity,
          icon: getPotionIconByRarity(requiredRarity)
        }
      } else {
        // 药水不是必须的，可以先不填
        console.log('未找到药水，但继续合成')
      }

      const notificationStore = useNotificationStore()
      notificationStore.success('材料已自动填充！')
      return true
    },

    /**
     * clearSlots: 清空所有槽位
     */
    clearSlots() {
      this.synthesisSlots = {
        fragments: [],
        potion: null
      }
    },

    /**
     * startSynthesis: 开始合成
     * 执行合成动画和结果判定
     */
    async startSynthesis() {
      if (!this.canSynthesize) {
        const notificationStore = useNotificationStore()
        notificationStore.warning('材料不足，无法合成！')
        return false
      }

      const recipe = this.selectedRecipe

      // 开始合成
      this.isSynthesizing = true
      this.synthesisPhase = 'preparing'
      this.synthesisResult = null

      console.log('开始合成:', recipe.name)

      // 阶段1: 准备 (0.5s)
      await this.wait(500)
      this.synthesisPhase = 'fusing'

      // 阶段2: 融合 (2s)
      await this.wait(2000)
      this.synthesisPhase = 'burst'

      // 阶段3: 爆发 - 判定结果
      const successRate = this.currentSuccessRate
      const isSuccess = Math.random() < successRate

      await this.wait(500)
      this.synthesisPhase = 'result'

      if (isSuccess) {
        // 合成成功
        await this.handleSuccess(recipe)
      } else {
        // 合成失败
        await this.handleFailure(recipe)
      }

      this.isSynthesizing = false
      return true
    },

    /**
     * handleSuccess: 处理合成成功
     * @param {Object} recipe - 配方配置
     */
    async handleSuccess(recipe) {
      const petCollectionStore = usePetCollectionStore()
      const fragmentStore = useFragmentStore()
      const notificationStore = useNotificationStore()

      // 消耗材料
      this.consumeMaterials(recipe)

      // 添加新宠物
      const newPetId = petCollectionStore.addPet(recipe.targetPetType)
      const petConfig = getPetType(recipe.targetPetType)

      // 重置失败计数
      this.failCount[recipe.id] = 0

      // 设置结果
      this.synthesisResult = {
        success: true,
        pet: {
          id: newPetId,
          type: recipe.targetPetType,
          name: petConfig.name,
          emoji: petConfig.emoji,
          passiveSkill: petConfig.passiveSkill
        },
        message: `恭喜！成功召唤了 ${petConfig.name}！`
      }

      notificationStore.success(this.synthesisResult.message)
      console.log('合成成功！获得:', petConfig.name)
    },

    /**
     * handleFailure: 处理合成失败
     * @param {Object} recipe - 配方配置
     */
    async handleFailure(recipe) {
      const fragmentStore = useFragmentStore()
      const notificationStore = useNotificationStore()

      // 失败时只消耗药水，保留碎片
      this.consumePotionOnly(recipe)

      // 增加失败计数
      this.failCount[recipe.id] = (this.failCount[recipe.id] || 0) + 1

      // 设置结果
      const currentFailCount = this.failCount[recipe.id]
      const pityThreshold = recipe.pityThreshold
      const pityMessage = currentFailCount >= pityThreshold
        ? '保底已激活，下次成功率提升！'
        : `保底进度: ${currentFailCount % pityThreshold}/${pityThreshold}`

      this.synthesisResult = {
        success: false,
        message: '合成失败，魔法能量不足...',
        pityMessage: pityMessage,
        failCount: currentFailCount
      }

      notificationStore.warning(`合成失败... ${pityMessage}`)
      console.log('合成失败，当前失败次数:', currentFailCount)
    },

    /**
     * consumeMaterials: 消耗材料（成功时）
     * @param {Object} recipe - 配方配置
     */
    consumeMaterials(recipe) {
      const fragmentStore = useFragmentStore()
      const backpackStore = useBackpackStore()

      // 消耗碎片
      fragmentStore.removeFragments(recipe.fragmentType, recipe.fragmentCount)

      // 消耗药水（简化处理，实际应该移除背包中的药水）
      // TODO: 实现药水消耗逻辑

      console.log('消耗材料: 碎片x' + recipe.fragmentCount + ', 药水x1')
    },

    /**
     * consumePotionOnly: 只消耗药水（失败时）
     * @param {Object} recipe - 配方配置
     */
    consumePotionOnly(recipe) {
      // 失败时只消耗药水，碎片保留
      // TODO: 实现药水消耗逻辑
      console.log('消耗药水x1（失败保留碎片）')
    },

    /**
     * resetSynthesis: 重置合成状态
     */
    resetSynthesis() {
      this.isSynthesizing = false
      this.synthesisPhase = 'idle'
      this.synthesisResult = null
      this.clearSlots()
    },

    /**
     * closeResult: 关闭结果界面
     */
    closeResult() {
      this.synthesisPhase = 'idle'
      this.synthesisResult = null

      // 如果成功，保持配方选择但清空槽位
      if (this.synthesisResult?.success) {
        this.clearSlots()
      }
    },

    /**
     * wait: 等待指定时间
     * @param {number} ms - 毫秒
     * @returns {Promise}
     */
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    /**
     * clearAll: 清空所有数据
     */
    clearAll() {
      this.selectedRecipeId = null
      this.clearSlots()
      this.isSynthesizing = false
      this.synthesisPhase = 'idle'
      this.synthesisResult = null
      this.failCount = {}
    }
  }
})
