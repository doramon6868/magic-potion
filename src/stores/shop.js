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
        name: '魔法饼干',
        icon: '🍪',
        category: 'food',
        rarity: 'common',
        price: 10,
        foodValue: 20,
        moodValue: 0,
        description: '恢复少量饱食度',
        flavorText: '散发着淡淡的薰衣草香味，是魔法学徒的日常口粮'
      },
      {
        id: 2,
        name: '彩虹糖果',
        icon: '🍬',
        category: 'food',
        rarity: 'common',
        price: 12,
        foodValue: 15,
        moodValue: 15,
        description: '恢复饱食度并提升心情',
        flavorText: '七种颜色的糖果在舌尖跳跃，仿佛能尝到彩虹的味道'
      },
      {
        id: 3,
        name: '魔法蛋糕',
        icon: '🍰',
        category: 'food',
        rarity: 'common',
        price: 25,
        foodValue: 40,
        moodValue: 0,
        description: '恢复大量饱食度',
        flavorText: '用月光奶油和星光面粉烘焙而成，每一口都是甜蜜的魔法'
      },
      {
        id: 9,
        name: '体力药剂',
        icon: '💪',
        category: 'combat',
        rarity: 'common',
        price: 22,
        foodValue: 20,
        moodValue: 0,
        description: '增强体力，下次探险饱食度消耗减半',
        flavorText: '炼金术士的基础配方，红色的液体在瓶中微微发光',
        useCondition: 'before_hunt',
        buff: { type: 'hunger_cost_reduce', value: 0.5, duration: 1 }
      },

      // ========== 优秀（uncommon）- 绿色 ==========
      {
        id: 7,
        name: '快乐玩具',
        icon: '🎾',
        category: 'mood',
        rarity: 'uncommon',
        price: 28,
        foodValue: 0,
        moodValue: 40,
        description: '大幅提升心情（不恢复饱食度）',
        flavorText: '注入欢乐咒语的魔法玩具，宠物见了会忍不住扑上去'
      },
      {
        id: 8,
        name: '战斗口粮',
        icon: '⚔️',
        category: 'combat',
        rarity: 'uncommon',
        price: 18,
        foodValue: 15,
        moodValue: 0,
        description: '战斗前食用，下次战斗奖励+30%',
        flavorText: '由勇气香料和力量草药制成，战士们出征前的必备之物',
        useCondition: 'before_hunt',
        buff: { type: 'hunt_reward_boost', value: 0.3, duration: 1 }
      },
      {
        id: 5,
        name: '彩虹药水',
        icon: '🧪',
        category: 'food',
        rarity: 'uncommon',
        price: 35,
        foodValue: 40,
        moodValue: 20,
        description: '恢复饱食度和心情，综合恢复药水',
        flavorText: '七种魔法元素完美融合的产物，瓶中的液体不断变换着颜色'
      },

      // ========== 稀有（rare）- 蓝色 ==========
      {
        id: 10,
        name: '护身符',
        icon: '🛡️',
        category: 'charm',
        rarity: 'rare',
        price: 15,
        foodValue: 0,
        moodValue: 0,
        description: '下次死亡时保留全部金币（自动触发）',
        flavorText: '古老的守护咒语被封印在这枚符文之中，散发着温暖的光芒',
        useCondition: 'passive',
        buff: { type: 'death_money_protect', value: 1, duration: 1 }
      },
      {
        id: 11,
        name: '急救包',
        icon: '🏥',
        category: 'charm',
        rarity: 'rare',
        price: 20,
        foodValue: 0,
        moodValue: 0,
        description: '战斗中健康低于30时自动恢复50点',
        flavorText: '精灵医者精心调配的医疗包，打开时会飘出治愈的香气',
        useCondition: 'passive',
        buff: { type: 'auto_heal', value: 50, threshold: 30, duration: 1 }
      },

      // ========== 史诗（epic）- 紫色 ==========
      {
        id: 6,
        name: '复活药水',
        icon: '💖',
        category: 'special',
        rarity: 'epic',
        price: 60,
        foodValue: 0,
        moodValue: 0,
        description: '可以让死亡的宠物复活',
        flavorText: '传说中凤凰的眼泪凝结而成，蕴含着重生的魔力，瓶底有微小的火焰在跳动'
      },

      // ========== 新增道具 ==========
      {
        id: 12,
        name: '清水',
        icon: '💧',
        category: 'food',
        rarity: 'common',
        price: 5,
        foodValue: 10,
        moodValue: 0,
        description: '最基础的补给，恢复少量饱食度',
        flavorText: '来自魔法泉眼的清泉，虽然普通但不可或缺'
      },
      {
        id: 13,
        name: '经验卷轴',
        icon: '📜',
        category: 'combat',
        rarity: 'rare',
        price: 45,
        foodValue: 0,
        moodValue: 0,
        description: '下次获得的经验值翻倍',
        flavorText: '记载着古代智者的智慧，阅读时文字会发光并流入脑海',
        useCondition: 'before_hunt',
        buff: { type: 'exp_boost', value: 2, duration: 1 }
      },
      {
        id: 14,
        name: '幸运护符',
        icon: '🍀',
        category: 'charm',
        rarity: 'epic',
        price: 80,
        foodValue: 0,
        moodValue: 0,
        description: '死亡概率从10%降低至5%，持续1天',
        flavorText: '四叶草的精华被封印在水晶中，持有者能感受到命运的眷顾',
        useCondition: 'passive',
        buff: { type: 'death_chance_reduce', value: 0.05, duration: 1 }
      },
      {
        id: 15,
        name: '时间沙漏',
        icon: '⏳',
        category: 'special',
        rarity: 'epic',
        price: 100,
        foodValue: 0,
        moodValue: 0,
        description: '重置今日所有属性衰减（满血复活效果）',
        flavorText: '据说其中流淌的不是沙子，而是凝固的时间碎片，翻转时能听到时光倒流的声音',
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
