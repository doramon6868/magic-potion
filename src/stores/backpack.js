/**
 * backpack.js - 背包状态管理
 *
 * 这个 store 管理玩家的物品背包
 * 包括：添加物品、移除物品、使用物品
 */

import { defineStore } from 'pinia'

/**
 * 创建 backpack store
 */
export const useBackpackStore = defineStore('backpack', {

  /**
   * state: 背包数据
   */
  state: () => ({
    /**
     * items: 背包中的物品列表
     * 每个物品是一个对象，包含 id, name, icon, foodValue, moodValue, category, buff, quantity
     */
    items: [
      // 初始给玩家一些物品用于测试
      {
        id: 1,
        key: 'magic_cookie',
        icon: '🍪',
        category: 'food',
        rarity: 'common',
        foodValue: 20,
        moodValue: 0,
        quantity: 3
      },
      {
        id: 2,
        key: 'rainbow_candy',
        icon: '🍬',
        category: 'food',
        rarity: 'common',
        foodValue: 15,
        moodValue: 15,
        quantity: 2
      },
      // 给玩家一些新道具试用
      {
        id: 8,
        key: 'combat_ration',
        icon: '⚔️',
        category: 'combat',
        rarity: 'uncommon',
        foodValue: 15,
        moodValue: 0,
        useCondition: 'before_hunt',
        buff: { type: 'hunt_reward_boost', value: 0.3, duration: 1 },
        quantity: 1
      },
      {
        id: 10,
        key: 'amulet',
        icon: '🛡️',
        category: 'charm',
        rarity: 'rare',
        foodValue: 0,
        moodValue: 0,
        useCondition: 'passive',
        buff: { type: 'death_money_protect', value: 1, duration: 1 },
        quantity: 1
      },
      // 初始给一些测试用的碎片
      {
        id: 101,
        key: 'cat_fragment',
        name: '猫之碎片',
        icon: '🐱',
        category: 'fragment',
        fragmentType: 'cat',
        rarity: 'common',
        quantity: 5
      },
      {
        id: 102,
        key: 'bird_fragment',
        name: '鸟之碎片',
        icon: '🐦',
        category: 'fragment',
        fragmentType: 'bird',
        rarity: 'rare',
        quantity: 3
      }
    ]
  }),

  /**
   * getters: 计算属性
   */
  getters: {
    /**
     * totalItems: 背包中物品的总数量（考虑堆叠）
     * @returns {number}
     */
    totalItems: (state) => {
      // 使用 reduce 累加所有物品的数量
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    /**
     * getItemById: 根据 ID 获取物品
     * 返回一个函数，可以传入 id 查询
     * @returns {Function}
     */
    getItemById: (state) => {
      return (id) => state.items.find(item => item.id === id)
    },

    /**
     * hasItem: 检查是否有某个物品
     * @returns {Function}
     */
    hasItem: (state) => {
      return (id) => state.items.some(item => item.id === id)
    }
  },

  /**
   * actions: 背包操作方法
   */
  actions: {
    /**
     * addItem: 添加物品到背包
     *
     * @param {Object} item - 要添加的物品
     * @param {number} quantity - 数量（默认1）
     */
    addItem(item, quantity = 1) {
      // ====== 步骤 1: 检查是否已有相同物品 ======
      const existingItem = this.items.find(i => i.id === item.id)

      if (existingItem) {
        // ====== 步骤 2a: 已有相同物品，增加数量 ======
        existingItem.quantity += quantity
        console.log(`${item.name} 数量增加到 ${existingItem.quantity}`)
      } else {
        // ====== 步骤 2b: 新物品，添加到列表 ======
        this.items.push({
          ...item,        // 复制物品的所有属性
          quantity: quantity  // 设置数量
        })
        console.log(`添加了新物品 ${item.name} x${quantity}`)
      }
    },

    /**
     * removeItem: 从背包移除物品
     *
     * @param {number} itemId - 物品 ID
     * @param {number} quantity - 数量（默认1）
     * @returns {boolean} 是否成功移除
     */
    removeItem(itemId, quantity = 1) {
      // ====== 步骤 1: 查找物品 ======
      const index = this.items.findIndex(item => item.id === itemId)

      // 如果没找到，返回失败
      if (index === -1) {
        console.log('物品不存在')
        return false
      }

      const item = this.items[index]

      // ====== 步骤 2: 检查数量是否足够 ======
      if (item.quantity < quantity) {
        console.log('物品数量不足')
        return false
      }

      // ====== 步骤 3: 减少数量 ======
      item.quantity -= quantity

      // ====== 步骤 4: 如果数量为0，从列表移除 ======
      if (item.quantity === 0) {
        this.items.splice(index, 1)
      }

      console.log(`移除了 ${item.name} x${quantity}`)
      return true
    },

    /**
     * useItem: 使用物品
     * 使用后会减少数量
     *
     * @param {number} itemId - 物品 ID
     * @returns {Object|null} 使用的物品，如果失败返回 null
     */
    useItem(itemId) {
      // ====== 步骤 1: 查找物品 ======
      const item = this.items.find(i => i.id === itemId)

      if (!item || item.quantity <= 0) {
        console.log('物品不存在或数量不足')
        return null
      }

      // ====== 步骤 2: 减少数量 ======
      item.quantity--

      // ====== 步骤 3: 如果数量为0，从列表移除 ======
      if (item.quantity === 0) {
        const index = this.items.findIndex(i => i.id === itemId)
        this.items.splice(index, 1)
      }

      console.log(`使用了 ${item.name}`)

      // ====== 步骤 4: 返回物品的副本 ======
      // 使用解构创建副本，移除 quantity 属性
      const { quantity, ...itemWithoutQuantity } = item
      return itemWithoutQuantity
    },

    /**
     * clearBackpack: 清空背包
     * 谨慎使用！
     */
    clearBackpack() {
      this.items = []
      console.log('背包已清空')
    }
  }
})
