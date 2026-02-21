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
      <span class="buff-title">增益效果</span>
    </div>

    <div class="buff-list">
      <div
        v-for="(buff, index) in gameStore.activeBuffs"
        :key="index"
        class="buff-item"
        :class="buff.type"
      >
        <span class="buff-item-icon">{{ buff.icon }}</span>
        <span class="buff-item-name">{{ buff.name }}</span>
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
     * getBuffDescription: 获取buff描述
     * @param {Object} buff - buff对象
     * @returns {string}
     */
    getBuffDescription(buff) {
      switch (buff.type) {
        case 'hunt_reward_boost':
          return `战斗奖励+${Math.round(buff.value * 100)}%`
        case 'hunger_cost_reduce':
          return `消耗-${Math.round(buff.value * 100)}%`
        case 'death_money_protect':
          return '死亡保金币'
        case 'auto_heal':
          return `低血时自动恢复`
        case 'exp_boost':
          return `经验×${buff.value}`
        case 'death_chance_reduce':
          return `死亡-${Math.round(buff.value * 100)}%`
        default:
          return '效果已激活'
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
