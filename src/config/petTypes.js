/**
 * petTypes.js - 宠物类型配置
 *
 * 这个文件定义了游戏中所有可收集的宠物类型
 * 包括：小紫（蛞蝓猫）、青鸟（风羽鸟）、赤狐（焰尾狐）、晶晶（晶石龙）
 */

/**
 * 宠物类型定义
 * 每种宠物都有独特的属性、被动技能和外观
 */
export const PET_TYPES = {
  /**
   * 小紫 - 蛞蝓猫（Slugcat）
   * 初始宠物，平衡型，无特殊技能
   */
  cat: {
    id: 1,
    name: '小紫',
    type: 'cat',
    emoji: '🐌',
    emojiSecondary: '🐱',
    rarity: 'common',
    description: '一只可爱的蛞蝓猫，有着蜗牛的壳和猫的灵活',
    lore: '小紫是你在魔法水晶球中发现的第一只宠物，它温柔而忠诚，是你冒险旅程的最佳伙伴',
    baseStats: {
      hunger: 80,
      mood: 70,
      health: 100,
      maxHunger: 100,
      maxMood: 100,
      maxHealth: 100
    },
    passiveSkill: null, // 初始宠物无被动技能
    isStarter: true, // 初始宠物标记
    unlockCondition: '初始获得',
    specialAnimations: {
      idle: 'earWiggle',
      happy: 'jump',
      eating: 'bounce'
    }
  },

  /**
   * 青鸟 - 风羽鸟（Wind Feather）
   * 稀有宠物，速度型，探险专家
   * 被动技能：迅捷之风（探险时间-20%）
   */
  bird: {
    id: 2,
    name: '青鸟',
    type: 'bird',
    emoji: '🐦',
    emojiSecondary: '💨',
    rarity: 'rare',
    description: '一只拥有风之力量的神鸟，飞行速度极快',
    lore: '风羽鸟来自云端的魔法山脉，它们的羽毛能够切割空气，带来清爽的风',
    baseStats: {
      hunger: 75,
      mood: 75,
      health: 90,
      maxHunger: 100,
      maxMood: 100,
      maxHealth: 100
    },
    passiveSkill: {
      name: '迅捷之风',
      description: '探险时间减少20%',
      effect: 'explore_time_reduce',
      value: 0.2, // 减少20%
      icon: '💨'
    },
    isStarter: false,
    unlockCondition: '合成获得',
    specialAnimations: {
      idle: 'float', // 轻微漂浮
      happy: 'flyCircle', // 绕圈飞行
      eating: 'peck' // 啄食动作
    }
  },

  /**
   * 赤狐 - 焰尾狐（Flame Tail）
   * 稀有宠物，攻击型，战斗专家
   * 被动技能：战斗狂热（战斗奖励+15%）
   */
  fox: {
    id: 3,
    name: '赤狐',
    type: 'fox',
    emoji: '🦊',
    emojiSecondary: '🔥',
    rarity: 'rare',
    description: '尾巴燃烧着永恒火焰的妖狐，性格高傲但忠诚',
    lore: '焰尾狐生活在火山深处的魔法洞穴中，它们的火焰不会灼伤朋友，只会温暖他们',
    baseStats: {
      hunger: 85,
      mood: 65,
      health: 95,
      maxHunger: 100,
      maxMood: 100,
      maxHealth: 100
    },
    passiveSkill: {
      name: '战斗狂热',
      description: '战斗奖励增加15%',
      effect: 'hunt_reward_boost',
      value: 0.15, // 增加15%
      icon: '🔥'
    },
    isStarter: false,
    unlockCondition: '合成获得',
    specialAnimations: {
      idle: 'tailFlame', // 尾巴火焰摇曳
      happy: 'fireJump', // 带火焰的跳跃
      eating: 'quickBite' // 快速咬食
    }
  },

  /**
   * 晶晶 - 晶石龙（Crystal Dragon）
   * 史诗宠物，防御型，生存专家
   * 被动技能：晶石护盾（死亡概率-5%）
   */
  dragon: {
    id: 4,
    name: '晶晶',
    type: 'dragon',
    emoji: '🐉',
    emojiSecondary: '💎',
    rarity: 'epic',
    description: '由纯净水晶构成的幼龙，拥有最强的防御力',
    lore: '晶石龙是远古龙族的后裔，它们的身体由魔法水晶构成，能够抵御大多数伤害',
    baseStats: {
      hunger: 90,
      mood: 60,
      health: 120, // 额外生命值
      maxHunger: 100,
      maxMood: 100,
      maxHealth: 120 // 更高上限
    },
    passiveSkill: {
      name: '晶石护盾',
      description: '游猎死亡概率降低5%',
      effect: 'death_chance_reduce',
      value: 0.05, // 降低5%
      icon: '💎'
    },
    isStarter: false,
    unlockCondition: '合成获得',
    specialAnimations: {
      idle: 'crystalShine', // 水晶闪光
      happy: 'wingFlap', // 翅膀拍打
      eating: 'crystalGlow' // 进食时全身发光
    }
  }
}

/**
 * 获取宠物类型配置
 * @param {string} type - 宠物类型标识 (cat, bird, fox, dragon)
 * @returns {Object|null} 宠物类型配置
 */
export function getPetType(type) {
  return PET_TYPES[type] || null
}

/**
 * 获取所有宠物类型
 * @returns {Array} 所有宠物类型配置数组
 */
export function getAllPetTypes() {
  return Object.values(PET_TYPES)
}

/**
 * 根据ID获取宠物类型
 * @param {number} id - 宠物ID
 * @returns {Object|null} 宠物类型配置
 */
export function getPetTypeById(id) {
  return Object.values(PET_TYPES).find(pet => pet.id === id) || null
}

/**
 * 获取宠物稀有度文本
 * @param {string} rarity - 稀有度标识
 * @returns {string} 稀有度显示文本
 */
export function getRarityText(rarity) {
  const rarityMap = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  }
  return rarityMap[rarity] || '未知'
}

/**
 * 获取宠物稀有度颜色
 * @param {string} rarity - 稀有度标识
 * @returns {string} 颜色代码
 */
export function getRarityColor(rarity) {
  const colorMap = {
    common: '#9ca3af', // 灰色
    rare: '#3b82f6', // 蓝色
    epic: '#a855f7', // 紫色
    legendary: '#f59e0b' // 金色
  }
  return colorMap[rarity] || '#9ca3af'
}
