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
     * - category: 分类（food/potion/charm/combat）
     * - rarity: 稀有度（common/uncommon/rare/epic）
     * - foodValue: 增加的饱食度
     * - moodValue: 增加的心情值
     * - description: 商品描述
     * - flavorText: 风味文本（增强魔法世界观）
     * - useCondition: 使用时机（always/before_hunt）
     * - buff: 临时增益效果（可选）
     */
    items: [
      // ========== 普通（common）- 白色/灰色 ==========
      {
        id: 1,
        key: 'magic_cookie',
        icon: '🍪',
        category: 'food',
        rarity: 'common',
        price: 10,
        foodValue: 20,
        moodValue: 0
      },
      {
        id: 2,
        key: 'rainbow_candy',
        icon: '🍬',
        category: 'food',
        rarity: 'common',
        price: 12,
        foodValue: 15,
        moodValue: 15
      },
      {
        id: 3,
        key: 'magic_cake',
        icon: '🍰',
        category: 'food',
        rarity: 'common',
        price: 25,
        foodValue: 40,
        moodValue: 0
      },
      {
        id: 9,
        key: 'stamina_potion',
        icon: '💪',
        category: 'combat',
        rarity: 'common',
        price: 22,
        foodValue: 20,
        moodValue: 0,
        useCondition: 'before_hunt',
        buff: { type: 'hunger_cost_reduce', value: 0.5, duration: 1 }
      },

      // ========== 优秀（uncommon）- 绿色 ==========
      {
        id: 7,
        key: 'joy_toy',
        icon: '🎾',
        category: 'mood',
        rarity: 'uncommon',
        price: 28,
        foodValue: 0,
        moodValue: 40
      },
      {
        id: 8,
        key: 'combat_ration',
        icon: '⚔️',
        category: 'combat',
        rarity: 'uncommon',
        price: 18,
        foodValue: 15,
        moodValue: 0,
        useCondition: 'before_hunt',
        buff: { type: 'hunt_reward_boost', value: 0.3, duration: 1 }
      },
      {
        id: 5,
        key: 'rainbow_potion',
        icon: '🧪',
        category: 'food',
        rarity: 'uncommon',
        price: 35,
        foodValue: 40,
        moodValue: 20
      },

      // ========== 稀有（rare）- 蓝色 ==========
      {
        id: 10,
        key: 'amulet',
        icon: '🛡️',
        category: 'charm',
        rarity: 'rare',
        price: 15,
        foodValue: 0,
        moodValue: 0,
        useCondition: 'passive',
        buff: { type: 'death_money_protect', value: 1, duration: 1 }
      },
      {
        id: 11,
        key: 'first_aid_kit',
        icon: '🏥',
        category: 'charm',
        rarity: 'rare',
        price: 20,
        foodValue: 0,
        moodValue: 0,
        useCondition: 'passive',
        buff: { type: 'auto_heal', value: 50, threshold: 30, duration: 1 }
      },

      // ========== 史诗（epic）- 紫色 ==========
      {
        id: 6,
        key: 'revive_potion',
        icon: '💖',
        category: 'special',
        rarity: 'epic',
        price: 60,
        foodValue: 0,
        moodValue: 0
      },

      // ========== 新增道具 ==========
      {
        id: 12,
        key: 'water',
        icon: '💧',
        category: 'food',
        rarity: 'common',
        price: 5,
        foodValue: 10,
        moodValue: 0
      },
      {
        id: 13,
        key: 'exp_scroll',
        icon: '📜',
        category: 'combat',
        rarity: 'rare',
        price: 45,
        foodValue: 0,
        moodValue: 0,
        useCondition: 'before_hunt',
        buff: { type: 'exp_boost', value: 2, duration: 1 }
      },
      {
        id: 14,
        key: 'lucky_charm',
        icon: '🍀',
        category: 'charm',
        rarity: 'epic',
        price: 80,
        foodValue: 0,
        moodValue: 0,
        useCondition: 'passive',
        buff: { type: 'death_chance_reduce', value: 0.05, duration: 1 }
      },
      {
        id: 15,
        key: 'time_hourglass',
        icon: '⏳',
        category: 'special',
        rarity: 'epic',
        price: 100,
        foodValue: 0,
        moodValue: 0,
        useCondition: 'special',
        buff: { type: 'reset_decay', value: 1, duration: 1 }
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
