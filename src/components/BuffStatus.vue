<!--
  BuffStatus.vue - 增益状态显示组件

  这个组件显示当前激活的道具增益效果
  现在嵌入在背包组件底部，与背包一起滚动查看
-->

<template>
  <!--
    buff状态栏
    只有在有激活buff时才显示
  -->
  <div v-if="gameStore.activeBuffs.length > 0" class="buff-status-bar">
    <div class="buff-header">
      <span class="buff-icon">🛡️</span>
      <span class="buff-title">{{ $t('buffStatus.title') }}</span>
    </div>

    <div class="buff-list">
      <div
        v-for="(buff, index) in gameStore.activeBuffs"
        :key="index"
        class="buff-item"
        :class="buff.type"
      >
        <span class="buff-item-icon">{{ buff.icon }}</span>
        <span class="buff-item-name">{{ getBuffName(buff) }}</span>
        <span class="buff-item-desc">{{ getBuffDescription(buff) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// ==================== 导入依赖 ====================
import { mapStores } from 'pinia'
import { useGameStore } from '../stores/game.js'

export default {
  // 组件名称
  name: 'BuffStatus',

  /**
   * computed: 计算属性
   */
  computed: {
    ...mapStores(useGameStore)
  },

  /**
   * methods: 组件方法
   */
  methods: {
    /**
     * getBuffName: 获取buff显示名称
     * @param {Object} buff - buff对象
     * @returns {string}
     */
    getBuffName(buff) {
      // 防御性检查
      if (!buff || !buff.name) {
        console.warn('[BuffStatus] buff 或 buff.name 不存在:', buff)
        return 'Unknown Buff'
      }

      // 检查 name 是否是有效的 key（英文 key 通常只包含字母、数字、下划线、连字符）
      const isValidKey = /^[a-zA-Z0-9_-]+$/.test(buff.name)

      if (isValidKey) {
        // 如果是有效的 key，尝试使用 i18n 翻译
        const translated = this.$t(`items.list.${buff.name}.name`)
        // 如果翻译结果不是键名本身，说明找到了翻译
        if (translated !== `items.list.${buff.name}.name`) {
          return translated
        }
        // i18n 返回键名本身，说明未找到翻译
        console.warn(`[BuffStatus] 未找到 buff 的 i18n 翻译: key=${buff.name}`)
      }

      // Fallback：直接使用 buff.name 显示（可能是中文名称）
      return buff.name
    },

    /**
     * getBuffDescription: 获取buff描述
     * @param {Object} buff - buff对象
     * @returns {string}
     */
    getBuffDescription(buff) {
      switch (buff.type) {
        case 'hunt_reward_boost':
          return this.$t('buffStatus.combatBonus', { percent: Math.round(buff.value * 100) })
        case 'hunger_cost_reduce':
          return this.$t('buffStatus.consumptionReduction', { percent: Math.round(buff.value * 100) })
        case 'death_money_protect':
          return this.$t('buffStatus.keepGold')
        case 'auto_heal':
          return this.$t('buffStatus.autoHeal')
        case 'exp_boost':
          return this.$t('buffStatus.expMultiplier', { multiplier: buff.value })
        case 'death_chance_reduce':
          return this.$t('buffStatus.deathReduction', { percent: Math.round(buff.value * 100) })
        default:
          return this.$t('buffStatus.active')
      }
    }
  }
}
</script>

<style scoped>
/**
 * Buff状态栏样式
 */

/* 背包内的紧凑样式 */
.buff-status-bar {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(197, 179, 224, 0.4);
  padding: 8px 10px;
  margin-top: 10px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.buff-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(197, 179, 224, 0.3);
}

.buff-icon {
  font-size: 14px;
  margin-right: 6px;
}

.buff-title {
  font-size: 12px;
  font-weight: bold;
  color: var(--text-dark);
}

.buff-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 150px;
  overflow-y: auto;
}

.buff-item {
  display: flex;
  align-items: center;
  padding: 5px 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  border: 1px solid rgba(197, 179, 224, 0.3);
  font-size: 11px;
}

.buff-item-icon {
  font-size: 14px;
  margin-right: 5px;
}

.buff-item-name {
  color: var(--text-dark);
  font-weight: 500;
  margin-right: 4px;
  font-size: 11px;
}

.buff-item-desc {
  color: rgba(74, 74, 106, 0.7);
  font-size: 10px;
  flex: 1;
  text-align: right;
}

/* 不同类型的buff颜色 */
.buff-item.hunt_reward_boost {
  border-color: rgba(231, 76, 60, 0.5);
  background: rgba(231, 76, 60, 0.1);
}

.buff-item.hunger_cost_reduce {
  border-color: rgba(46, 204, 113, 0.5);
  background: rgba(46, 204, 113, 0.1);
}

.buff-item.death_money_protect {
  border-color: rgba(52, 152, 219, 0.5);
  background: rgba(52, 152, 219, 0.1);
}

.buff-item.auto_heal {
  border-color: rgba(241, 196, 15, 0.5);
  background: rgba(241, 196, 15, 0.1);
}
</style>
