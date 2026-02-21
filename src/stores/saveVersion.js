/**
 * saveVersion.js - 存档版本控制
 *
 * 这个文件管理存档的版本号和数据迁移
 * 当游戏数据结构变化时，需要在这里添加迁移逻辑
 */

/**
 * 版本历史记录
 * 每个版本包含：版本号、创建时间、描述、迁移函数
 */
export const SAVE_VERSION_HISTORY = {
  1: {
    version: 1,
    createdAt: '2026-02-20',
    description: '初始版本',
    migrations: null  // 第一个版本不需要迁移
  }
  // 未来版本在这里添加
  // 2: {
  //   version: 2,
  //   createdAt: '2026-03-01',
  //   description: '添加宠物外观系统',
  //   migrations: migrateV1ToV2
  // }
}

/**
 * 当前最新版本
 * 这是游戏当前支持的存档格式版本
 */
export const CURRENT_SAVE_VERSION = 1

/**
 * 迁移函数示例（未来使用）
 * 用于将旧版本存档升级到新版本
 *
 * @param {Object} oldData - 旧版本存档数据
 * @returns {Object} 新版本存档数据
 */
// eslint-disable-next-line no-unused-vars
function migrateV1ToV2(oldData) {
  // 创建新数据结构的副本
  return {
    ...oldData,
    meta: {
      ...oldData.meta,
      version: 2
    },
    game: {
      ...oldData.game,
      pet: {
        ...oldData.game.pet,
        appearance: 'default'  // 新增字段
      }
    }
  }
}

/**
 * 验证存档数据的基本结构
 * 确保存档包含必要的字段
 *
 * @param {Object} data - 要验证的存档数据
 * @returns {boolean} 是否有效
 */
export function validateSaveData(data) {
  // 检查必要字段
  if (!data || typeof data !== 'object') {
    console.error('存档数据无效：不是对象')
    return false
  }

  // 检查元数据
  if (!data.meta || typeof data.meta !== 'object') {
    console.error('存档数据无效：缺少 meta')
    return false
  }

  // 检查游戏数据
  if (!data.game || typeof data.game !== 'object') {
    console.error('存档数据无效：缺少 game')
    return false
  }

  // 检查宠物数据
  if (!data.game.pet || typeof data.game.pet !== 'object') {
    console.error('存档数据无效：缺少 pet')
    return false
  }

  // 检查必要属性
  const requiredPetFields = ['name', 'hunger', 'mood', 'health', 'status']
  for (const field of requiredPetFields) {
    if (data.game.pet[field] === undefined) {
      console.error(`存档数据无效：pet 缺少 ${field}`)
      return false
    }
  }

  // 检查背包数据
  if (!data.backpack || !Array.isArray(data.backpack.items)) {
    console.error('存档数据无效：缺少 backpack.items')
    return false
  }

  return true
}

/**
 * 执行存档版本迁移
 * 将存档数据逐步迁移到最新版本
 *
 * @param {Object} saveData - 原始存档数据
 * @returns {Object} 迁移后的存档数据
 * @throws {Error} 如果迁移失败
 */
export function migrateSaveIfNeeded(saveData) {
  // 获取当前存档版本（默认为1）
  const currentVersion = saveData.meta?.version || 1

  // 如果版本相同，无需迁移
  if (currentVersion === CURRENT_SAVE_VERSION) {
    return saveData
  }

  // 如果存档版本高于当前游戏版本，无法加载
  if (currentVersion > CURRENT_SAVE_VERSION) {
    throw new Error('存档版本高于当前游戏版本，请更新游戏')
  }

  // 逐步迁移到最新版本
  let migratedData = { ...saveData }

  for (let v = currentVersion; v < CURRENT_SAVE_VERSION; v++) {
    const versionInfo = SAVE_VERSION_HISTORY[v + 1]

    if (!versionInfo) {
      console.warn(`版本 ${v + 1} 的信息不存在，跳过迁移`)
      continue
    }

    if (versionInfo.migrations) {
      console.log(`执行迁移: 版本 ${v} -> ${v + 1}`)
      migratedData = versionInfo.migrations(migratedData)
    } else {
      // 如果没有迁移函数，只更新版本号
      migratedData.meta.version = v + 1
    }
  }

  console.log(`存档迁移完成: 版本 ${currentVersion} -> ${CURRENT_SAVE_VERSION}`)
  return migratedData
}
