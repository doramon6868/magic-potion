/**
 * fragmentTypes.js - 碎片类型配置
 *
 * 这个文件定义了用于合成宠物的碎片类型
 * 每种碎片对应一种宠物类型
 */

/**
 * 碎片类型定义
 * 碎片ID从101开始，与物品ID区分
 */
export const FRAGMENT_TYPES = {
  /**
   * 猫之碎片 - 用于合成小紫
   */
  cat: {
    id: 101,
    name: '猫之碎片',
    icon: '🐱',
    fragmentType: 'cat',
    rarity: 'common',
    category: 'fragment',
    description: '蛞蝓猫的魔力残片，散发着温柔的紫色光芒',
    flavorText: '据说收集足够多的碎片，就能呼唤来新的伙伴',
    stackable: true,
    maxStack: 999
  },

  /**
   * 鸟之碎片 - 用于合成青鸟
   */
  bird: {
    id: 102,
    name: '鸟之碎片',
    icon: '🐦',
    fragmentType: 'bird',
    rarity: 'rare',
    category: 'fragment',
    description: '风羽鸟脱落的羽毛结晶，轻盈如空气',
    flavorText: '轻盈如空气，散发着自由的气息',
    stackable: true,
    maxStack: 999
  },

  /**
   * 狐之碎片 - 用于合成赤狐
   */
  fox: {
    id: 103,
    name: '狐之碎片',
    icon: '🦊',
    fragmentType: 'fox',
    rarity: 'rare',
    category: 'fragment',
    description: '焰尾狐尾巴上掉落的火星凝结而成',
    flavorText: '蕴含着火焰的温度，但触摸起来却是温暖的',
    stackable: true,
    maxStack: 999
  },

  /**
   * 龙之碎片 - 用于合成晶晶
   */
  dragon: {
    id: 104,
    name: '龙之碎片',
    icon: '🐉',
    fragmentType: 'dragon',
    rarity: 'epic',
    category: 'fragment',
    description: '晶石龙鳞片上的微小结晶，蕴含古老魔力',
    flavorText: '远古龙族的力量在其中沉睡',
    stackable: true,
    maxStack: 999
  }
}

/**
 * 碎片掉落权重配置
 * 定义不同场景下各种碎片的掉落概率权重
 */
export const FRAGMENT_DROP_WEIGHTS = {
  /**
   * 森林玩耍掉落权重（10%总概率）
   * 偏向基础碎片
   */
  forest: {
    cat: 50, // 50% 猫之碎片
    bird: 30, // 30% 鸟之碎片
    fox: 15, // 15% 狐之碎片
    dragon: 5 // 5% 龙之碎片
  },

  /**
   * 游猎战斗掉落权重（10%总概率）
   * 稀有碎片概率更高
   */
  hunt: {
    cat: 30, // 30% 猫之碎片
    bird: 35, // 35% 鸟之碎片
    fox: 25, // 25% 狐之碎片
    dragon: 10 // 10% 龙之碎片
  }
}

/**
 * 获取碎片类型配置
 * @param {string} type - 碎片类型标识 (cat, bird, fox, dragon)
 * @returns {Object|null} 碎片类型配置
 */
export function getFragmentType(type) {
  return FRAGMENT_TYPES[type] || null
}

/**
 * 获取所有碎片类型
 * @returns {Array} 所有碎片类型配置数组
 */
export function getAllFragmentTypes() {
  return Object.values(FRAGMENT_TYPES)
}

/**
 * 根据宠物类型获取对应碎片类型
 * @param {string} petType - 宠物类型标识
 * @returns {Object|null} 碎片类型配置
 */
export function getFragmentForPetType(petType) {
  return FRAGMENT_TYPES[petType] || null
}
