/**
 * shop.js - 商店状态管理
 *
 * 这个 store 管理商店中的商品
 * 包括商品列表、价格等信息
 */

import { defineStore } from 'pinia'

/**
 * 创建 shop store
 */
export const useShopStore = defineStore('shop', {

  /**
   * state: 商店数据
   */
  state: () => ({
    /**
     * items: 商店中的商品列表
     * 每个商品包含：
     * - id: 商品ID
     * - name: 商品名称
     * - icon: 图标（表情符号）
     * - price: 价格（金币）
     * - foodValue: 增加的饱食度
     * - description: 商品描述
     */
    items: [
      {
        id: 1,
        name: '魔法饼干',
        icon: '🍪',
        price: 10,
        foodValue: 20,
        description: '普通的魔法饼干，恢复少量饱食度'
      },
      {
        id: 2,
        name: '彩虹糖果',
        icon: '🍬',
        price: 15,
        foodValue: 15,
        description: '甜甜的糖果，能增加饱食度和心情'
      },
      {
        id: 3,
        name: '魔法蛋糕',
        icon: '🍰',
        price: 30,
        foodValue: 40,
        description: '美味的蛋糕，恢复大量饱食度'
      },
      {
        id: 4,
        name: '星光果',
        icon: '🍎',
        price: 25,
        foodValue: 30,
        description: '闪着星光的神秘果实'
      },
      {
        id: 5,
        name: '彩虹药水',
        icon: '🧪',
        price: 50,
        foodValue: 50,
        description: '强力恢复药水，恢复大量饱食度'
      },
      {
        id: 6,
        name: '复活药水',
        icon: '💖',
        price: 100,
        foodValue: 0,
        description: '可以让死亡的宠物复活'
      }
    ]
  }),

  /**
   * getters: 计算属性
   */
  getters: {
    /**
     * totalItems: 商品总数
     * @returns {number}
     */
    totalItems: (state) => state.items.length,

    /**
     * getItemById: 根据 ID 获取商品
     * @returns {Function}
     */
    getItemById: (state) => {
      return (id) => state.items.find(item => item.id === id)
    },

    /**
     * affordableItems: 获取能买得起的商品
     * 需要传入当前金币数
     * @returns {Function}
     */
    affordableItems: (state) => {
      return (money) => state.items.filter(item => item.price <= money)
    }
  },

  /**
   * actions: 商店操作方法
   */
  actions: {
    /**
     * addItem: 添加新商品到商店
     * 用于游戏更新添加新物品
     *
     * @param {Object} item - 商品对象
     */
    addItem(item) {
      // 检查是否已有相同 ID 的商品
      const existingIndex = this.items.findIndex(i => i.id === item.id)

      if (existingIndex !== -1) {
        // 更新已有商品
        this.items[existingIndex] = { ...item }
        console.log(`更新商品 ${item.name}`)
      } else {
        // 添加新商品
        this.items.push({ ...item })
        console.log(`添加新商品 ${item.name}`)
      }
    },

    /**
     * removeItem: 从商店移除商品
     *
     * @param {number} itemId - 商品 ID
     */
    removeItem(itemId) {
      const index = this.items.findIndex(item => item.id === itemId)

      if (index !== -1) {
        const itemName = this.items[index].name
        this.items.splice(index, 1)
        console.log(`从商店移除商品 ${itemName}`)
      }
    },

    /**
     * updatePrice: 更新商品价格
     *
     * @param {number} itemId - 商品 ID
     * @param {number} newPrice - 新价格
     */
    updatePrice(itemId, newPrice) {
      const item = this.items.find(i => i.id === itemId)

      if (item) {
        item.price = newPrice
        console.log(`${item.name} 价格更新为 ${newPrice}`)
      }
    },

    /**
     * restock: 重新进货
     * 可以在这里实现限时商品、打折等逻辑
     */
    restock() {
      console.log('商店重新进货！')
      // 这里可以实现：
      // - 随机刷新商品
      // - 添加限时特惠
      // - 增加新商品
    }
  }
})
