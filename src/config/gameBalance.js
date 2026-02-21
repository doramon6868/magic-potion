/**
 * gameBalance.js - 游戏平衡配置文件
 *
 * 集中管理所有游戏数值参数，便于调整平衡
 * 修改此文件即可调整游戏难度和节奏
 */

/**
 * 宠物状态相关配置
 */
export const PET_STATUS = {
  /**
   * 状态持续时间（毫秒）
   */
  DURATION: {
    /** 进食后恢复到 idle 的时间 */
    EATING: 3000,
    /** 开心状态持续时间 */
    HAPPY: 3000
  }
}

/**
 * 属性衰减配置
 */
export const DECAY = {
  /**
   * 心情衰减值（每次调用 decreaseStats）
   */
  MOOD_DECREASE: 5,

  /**
   * 饱食度衰减 - 在家
   */
  HUNGER_AT_HOME: 1,

  /**
   * 饱食度衰减 - 户外
   */
  HUNGER_OUTDOOR: 2,

  /**
   * 触发疲惫状态的饱食度阈值
   */
  TIRED_THRESHOLD: 20,

  /**
   * 触发难过状态的心情阈值
   */
  SAD_THRESHOLD: 20
}

/**
 * 经验值系统配置
 */
export const EXPERIENCE = {
  /**
   * 每级所需经验值
   */
  PER_LEVEL: 100
}

/**
 * 默认值配置
 */
export const DEFAULTS = {
  /**
   * 默认心情增加值（喂食时未指定 moodValue）
   */
  MOOD_INCREASE: 5
}

/**
 * 初始数值配置
 */
export const INITIAL = {
  /**
   * 初始金币
   */
  MONEY: 100,

  /**
   * 初始饱食度
   */
  HUNGER: 80,

  /**
   * 初始心情
   */
  MOOD: 70,

  /**
   * 初始健康值
   */
  HEALTH: 100,

  /**
   * 初始等级
   */
  LEVEL: 1
}

/**
 * 阈值配置
 */
export const THRESHOLDS = {
  /**
   * 饥饿阈值（低于此值视为饿了）
   */
  HUNGRY: 30,

  /**
   * 开心阈值（高于此值视为开心）
   */
  HAPPY: 70
}
