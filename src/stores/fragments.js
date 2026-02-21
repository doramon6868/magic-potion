/**
 * fragments.js - 碎片状态管理
 *
 * 这个 store 管理碎片的获取和消耗
 * 碎片实际存储在背包中，这里提供操作接口
 */

import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useBackpackStore } from './backpack.js'
import { FRAGMENT_TYPES, FRAGMENT_DROP_WEIGHTS, getFragmentType } from '../config/fragmentTypes.js'

export const useFragmentStore = defineStore('fragments', {
  state: () => ({
    // 碎片数据实际存储在 backpack store 中
    // 这里只存储运行时状态
  }),

  getters: {
    /**
     * fragments: 获取背包中的所有碎片
     * @returns {Array}
     */
    fragments: () => {
      const backpackStore = useBackpackStore()
      return backpackStore.items.filter(item => item.category === 'fragment')
    },

    /**
     * fragmentCounts: 各类型碎片的数量
     * @returns {Object} { cat: 5, bird: 3, ... }
     */
    fragmentCounts() {
      const counts = {}
      this.fragments.forEach(item => {
        const type = item.fragmentType
        counts[type] = (counts[type] || 0) + item.quantity
      })
      return counts
    },

    /**
     * getFragmentCount: 获取指定类型碎片的数量
     * @returns {Function}
     */
    getFragmentCount() {
      return (fragmentType) => {
        return this.fragmentCounts[fragmentType] || 0
      }
    },

    /**
     * hasEnoughFragments: 检查是否有足够碎片
     * @returns {Function}
     */
    hasEnoughFragments() {
      return (fragmentType, count) => {
        return (this.fragmentCounts[fragmentType] || 0) >= count
      }
    },

    /**
     * totalFragments: 碎片总数
     * @returns {number}
     */
    totalFragments() {
      return Object.values(this.fragmentCounts).reduce((a, b) => a + b, 0)
    }
  },

  actions: {
    /**
     * addFragment: 添加碎片到背包
     * @param {string} fragmentType - 碎片类型 (cat, bird, fox, dragon)
     * @param {number} count - 数量（默认1）
     */
    addFragment(fragmentType, count = 1) {
      const backpackStore = useBackpackStore()
      const fragmentConfig = getFragmentType(fragmentType)

      if (!fragmentConfig) {
        console.error('未知的碎片类型:', fragmentType)
        return false
      }

      // 检查背包中是否已有同类型碎片
      const existingItem = backpackStore.items.find(
        item => item.category === 'fragment' && item.fragmentType === fragmentType
      )

      if (existingItem) {
        // 增加数量
        existingItem.quantity += count
      } else {
        // 添加新碎片
        backpackStore.items.push({
          ...fragmentConfig,
          quantity: count
        })
      }

      console.log(`获得 ${fragmentConfig.name} x${count}`)
      return true
    },

    /**
     * removeFragments: 从背包移除碎片
     * @param {string} fragmentType - 碎片类型
     * @param {number} count - 数量
     * @returns {boolean} 是否成功移除
     */
    removeFragments(fragmentType, count) {
      const backpackStore = useBackpackStore()

      const fragmentItem = backpackStore.items.find(
        item => item.category === 'fragment' && item.fragmentType === fragmentType
      )

      if (!fragmentItem || fragmentItem.quantity < count) {
        console.error('碎片数量不足:', fragmentType)
        return false
      }

      fragmentItem.quantity -= count

      // 如果数量为0，从背包移除
      if (fragmentItem.quantity === 0) {
        const index = backpackStore.items.indexOf(fragmentItem)
        backpackStore.items.splice(index, 1)
      }

      const fragmentConfig = getFragmentType(fragmentType)
      console.log(`消耗 ${fragmentConfig?.name} x${count}`)
      return true
    },

    /**
     * rollFragmentDrop: 判定碎片掉落
     * 根据场景和当前宠物类型计算掉落
     * @param {string} source - 来源 ('forest', 'hunt', 'happiness')
     * @param {string} currentPetType - 当前宠物类型（开心度奖励使用）
     * @returns {string|null} 掉落的碎片类型，未掉落返回null
     */
    rollFragmentDrop(source, currentPetType = 'cat') {
      // 掉落概率配置
      const dropChances = {
        forest: 0.1, // 10%
        hunt: 0.1, // 10%
        happiness: 0.05 // 5%
      }

      const chance = dropChances[source]
      if (chance === undefined) {
        console.error('未知的碎片来源:', source)
        return null
      }

      // 判定是否掉落
      if (Math.random() >= chance) {
        return null // 未掉落
      }

      // 开心度奖励：必定获得当前宠物对应的碎片
      if (source === 'happiness') {
        return currentPetType
      }

      // 根据场景选择权重表
      const weights = FRAGMENT_DROP_WEIGHTS[source]
      if (!weights) {
        return null
      }

      // 按权重随机选择碎片类型
      const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
      let random = Math.random() * totalWeight

      for (const [type, weight] of Object.entries(weights)) {
        random -= weight
        if (random <= 0) {
          return type
        }
      }

      return 'cat' // 默认返回猫之碎片
    },

    /**
     * getFragmentItemsForRecipe: 获取配方所需的碎片物品列表
     * 用于合成界面显示
     * @param {string} fragmentType - 碎片类型
     * @param {number} count - 需要数量
     * @returns {Array} 碎片物品列表
     */
    getFragmentItemsForRecipe(fragmentType, count) {
      const backpackStore = useBackpackStore()
      const items = []
      let remaining = count

      // 查找背包中所有该类型的碎片
      const fragmentItems = backpackStore.items.filter(
        item => item.category === 'fragment' && item.fragmentType === fragmentType
      )

      for (const item of fragmentItems) {
        if (remaining <= 0) break
        const take = Math.min(item.quantity, remaining)
        items.push({
          ...item,
          takeCount: take
        })
        remaining -= take
      }

      return items
    }
  }
})
