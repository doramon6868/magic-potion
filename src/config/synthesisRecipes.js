/**
 * synthesisRecipes.js - 合成配方配置
 *
 * 这个文件定义了宠物合成的配方
 * 包括：材料需求、成功率、保底机制等
 */

/**
 * 合成配方列表
 * 按难度从低到高排序
 */
export const SYNTHESIS_RECIPES = [
  {
    id: 1,
    name: '初级召唤',
    nameEn: 'Basic Summon',
    description: '使用猫之碎片召唤蛞蝓猫',
    targetPetId: 1, // 小紫
    targetPetType: 'cat',
    fragmentType: 'cat',
    fragmentCount: 3,
    requiredPotion: {
      rarity: 'common', // 普通药水
      count: 1
    },
    baseSuccessRate: 0.7, // 70%成功率
    pityThreshold: 3, // 3次失败后触发保底
    pityBonus: 0.1, // 保底加成10%
    minPlayerLevel: 1, // 最低玩家等级
    unlockRequirement: null, // 无解锁要求（初始可用）
    vortexColor: '#8b5cf6' // 紫色旋涡
  },
  {
    id: 2,
    name: '风之召唤',
    nameEn: 'Wind Summon',
    description: '使用鸟之碎片召唤风羽鸟',
    targetPetId: 2, // 青鸟
    targetPetType: 'bird',
    fragmentType: 'bird',
    fragmentCount: 5,
    requiredPotion: {
      rarity: 'common',
      count: 1
    },
    baseSuccessRate: 0.6, // 60%成功率
    pityThreshold: 3,
    pityBonus: 0.1,
    minPlayerLevel: 2,
    unlockRequirement: {
      type: 'pet_owned',
      petId: 1, // 需要先拥有小紫
      petType: 'cat'
    },
    vortexColor: '#06b6d4' // 青色旋涡
  },
  {
    id: 3,
    name: '焰之召唤',
    nameEn: 'Flame Summon',
    description: '使用狐之碎片召唤焰尾狐',
    targetPetId: 3, // 赤狐
    targetPetType: 'fox',
    fragmentType: 'fox',
    fragmentCount: 5,
    requiredPotion: {
      rarity: 'uncommon', // 高级药水
      count: 1
    },
    baseSuccessRate: 0.55, // 55%成功率
    pityThreshold: 3,
    pityBonus: 0.1,
    minPlayerLevel: 3,
    unlockRequirement: {
      type: 'pet_owned',
      petId: 2, // 需要先拥有青鸟
      petType: 'bird'
    },
    vortexColor: '#f97316' // 橙红色旋涡
  },
  {
    id: 4,
    name: '龙晶召唤',
    nameEn: 'Crystal Summon',
    description: '使用龙之碎片召唤晶石龙',
    targetPetId: 4, // 晶晶
    targetPetType: 'dragon',
    fragmentType: 'dragon',
    fragmentCount: 10,
    requiredPotion: {
      rarity: 'rare', // 稀有药水
      count: 1
    },
    baseSuccessRate: 0.4, // 40%成功率
    pityThreshold: 5, // 更多失败才触发保底
    pityBonus: 0.1,
    minPlayerLevel: 5,
    unlockRequirement: {
      type: 'pet_owned',
      petId: 3, // 需要先拥有赤狐
      petType: 'fox'
    },
    vortexColor: '#ec4899' // 彩虹粉色旋涡
  }
]

/**
 * 根据ID获取配方
 * @param {number} id - 配方ID
 * @returns {Object|null} 配方配置
 */
export function getRecipeById(id) {
  return SYNTHESIS_RECIPES.find(r => r.id === id) || null
}

/**
 * 根据目标宠物ID获取配方
 * @param {number} petId - 宠物ID
 * @returns {Object|null} 配方配置
 */
export function getRecipeForPet(petId) {
  return SYNTHESIS_RECIPES.find(r => r.targetPetId === petId) || null
}

/**
 * 根据宠物类型获取配方
 * @param {string} petType - 宠物类型标识
 * @returns {Object|null} 配方配置
 */
export function getRecipeForPetType(petType) {
  return SYNTHESIS_RECIPES.find(r => r.targetPetType === petType) || null
}

/**
 * 获取所有配方
 * @returns {Array} 所有配方配置数组
 */
export function getAllRecipes() {
  return [...SYNTHESIS_RECIPES]
}

/**
 * 计算合成成功率
 * @param {Object} recipe - 配方配置
 * @param {number} failCount - 当前失败次数
 * @param {number} playerLevel - 玩家等级
 * @returns {number} 最终成功率 (0-0.95)
 */
export function calculateSuccessRate(recipe, failCount = 0, playerLevel = 1) {
  let rate = recipe.baseSuccessRate

  // 1. 保底加成
  if (failCount >= recipe.pityThreshold) {
    const pityMultiplier = Math.floor(failCount / recipe.pityThreshold)
    rate += recipe.pityBonus * pityMultiplier
  }

  // 2. 等级加成（每高1级+2%，最高10%）
  const levelDiff = playerLevel - recipe.minPlayerLevel
  if (levelDiff > 0) {
    rate += Math.min(levelDiff * 0.02, 0.1)
  }

  // 3. 上限限制（最高95%）
  return Math.min(rate, 0.95)
}

/**
 * 检查配方是否已解锁
 * @param {Object} recipe - 配方配置
 * @param {Array} ownedPetTypes - 已拥有的宠物类型列表
 * @returns {boolean} 是否已解锁
 */
export function checkUnlockRequirement(recipe, ownedPetTypes = []) {
  // 没有解锁要求，默认解锁
  if (!recipe.unlockRequirement) {
    return true
  }

  const req = recipe.unlockRequirement

  switch (req.type) {
    case 'pet_owned':
      // 检查是否拥有指定宠物
      return ownedPetTypes.includes(req.petType)
    default:
      return true
  }
}

/**
 * 获取药水名称
 * @param {string} rarity - 药水稀有度
 * @returns {string} 药水名称
 */
export function getPotionNameByRarity(rarity) {
  const potionNames = {
    common: '普通药水',
    uncommon: '高级药水',
    rare: '稀有药水',
    epic: '史诗药水'
  }
  return potionNames[rarity] || '未知药水'
}

/**
 * 获取药水图标
 * @param {string} rarity - 药水稀有度
 * @returns {string} 药水图标
 */
export function getPotionIconByRarity(rarity) {
  const potionIcons = {
    common: '🧪',
    uncommon: '⚗️',
    rare: '🔮',
    epic: '✨'
  }
  return potionIcons[rarity] || '🧪'
}
