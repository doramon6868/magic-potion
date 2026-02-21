<!--
  Shop.vue - 商店弹窗组件

  这个组件显示可以购买的物品
  点击物品即可购买，物品直接进入背包

  主要功能：
  1. 显示可购买的物品列表
  2. 显示物品价格和效果
  3. 点击购买按钮购买物品

  使用 Naive UI 的 Modal 组件
-->

<template>
  <!--
    n-modal: Naive UI 的弹窗组件
  -->
  <n-modal
    v-model:show="showModel"
    title="🏪 商店"
    preset="card"
    :style="{ width: '500px', maxWidth: '90vw' }"
    :mask-closable="true"
  >
    <!-- 商店内容 -->
    <div class="shop-content">

      <!-- 商店描述 -->
      <div class="shop-description">
        💰 当前金币: <strong>{{ gameStore.money }}</strong>
      </div>

      <!-- 商品分类 -->
      <div class="shop-categories">
        <!-- 基础食物 -->
        <div class="category-section">
          <div class="category-title">🍽️ 基础食物</div>
          <div class="shop-grid">
            <div
              v-for="item in foodItems"
              :key="item.id"
              class="shop-item"
              :class="[
                item.rarity,
                { 'cannot-afford': gameStore.money < item.price }
              ]"
            >
              <div class="rarity-badge" :class="item.rarity">{{ getRarityLabel(item.rarity) }}</div>
              <div class="item-icon">{{ item.icon }}</div>
              <div class="item-name">{{ item.name }}</div>
              <div class="item-effect">
                <span v-if="item.foodValue > 0">饱食度 +{{ item.foodValue }}</span>
                <span v-if="item.moodValue > 0" class="mood-effect">心情 +{{ item.moodValue }}</span>
              </div>
              <div class="item-flavor">{{ item.flavorText }}</div>
              <div class="item-price">
                <span class="price-icon">💰</span>
                <span class="price-value">{{ item.price }}</span>
              </div>
              <button
                class="buy-btn"
                :disabled="gameStore.money < item.price"
                @click="buyItem(item)"
              >
                {{ gameStore.money >= item.price ? '购买' : '金币不足' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 心情道具 -->
        <div class="category-section">
          <div class="category-title">😊 心情道具</div>
          <div class="shop-grid">
            <div
              v-for="item in moodItems"
              :key="item.id"
              class="shop-item mood-item"
              :class="[
                item.rarity,
                { 'cannot-afford': gameStore.money < item.price }
              ]"
            >
              <div class="rarity-badge" :class="item.rarity">{{ getRarityLabel(item.rarity) }}</div>
              <div class="item-icon">{{ item.icon }}</div>
              <div class="item-name">{{ item.name }}</div>
              <div class="item-effect">
                <span class="mood-effect">心情 +{{ item.moodValue }}</span>
              </div>
              <div class="item-flavor">{{ item.flavorText }}</div>
              <div class="item-price">
                <span class="price-icon">💰</span>
                <span class="price-value">{{ item.price }}</span>
              </div>
              <button
                class="buy-btn mood-buy-btn"
                :disabled="gameStore.money < item.price"
                @click="buyItem(item)"
              >
                {{ gameStore.money >= item.price ? '购买' : '金币不足' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 战斗准备 -->
        <div class="category-section">
          <div class="category-title">⚔️ 战斗准备</div>
          <div class="shop-grid">
            <div
              v-for="item in combatItems"
              :key="item.id"
              class="shop-item combat-item"
              :class="[
                item.rarity,
                { 'cannot-afford': gameStore.money < item.price }
              ]"
            >
              <div class="rarity-badge" :class="item.rarity">{{ getRarityLabel(item.rarity) }}</div>
              <div class="item-icon">{{ item.icon }}</div>
              <div class="item-name">{{ item.name }}</div>
              <div class="item-effect special-effect">
                {{ getBuffDescription(item) }}
              </div>
              <div class="item-flavor">{{ item.flavorText }}</div>
              <div class="item-price">
                <span class="price-icon">💰</span>
                <span class="price-value">{{ item.price }}</span>
              </div>
              <button
                class="buy-btn combat-buy-btn"
                :disabled="gameStore.money < item.price"
                @click="buyItem(item)"
              >
                {{ gameStore.money >= item.price ? '购买' : '金币不足' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 风险管控 -->
        <div class="category-section">
          <div class="category-title">🛡️ 风险管控</div>
          <div class="shop-grid">
            <div
              v-for="item in charmItems"
              :key="item.id"
              class="shop-item charm-item"
              :class="[
                item.rarity,
                { 'cannot-afford': gameStore.money < item.price }
              ]"
            >
              <div class="rarity-badge" :class="item.rarity">{{ getRarityLabel(item.rarity) }}</div>
              <div class="item-icon">{{ item.icon }}</div>
              <div class="item-name">{{ item.name }}</div>
              <div class="item-effect special-effect">
                {{ getBuffDescription(item) }}
              </div>
              <div class="item-flavor">{{ item.flavorText }}</div>
              <div class="item-price">
                <span class="price-icon">💰</span>
                <span class="price-value">{{ item.price }}</span>
              </div>
              <button
                class="buy-btn charm-buy-btn"
                :disabled="gameStore.money < item.price"
                @click="buyItem(item)"
              >
                {{ gameStore.money >= item.price ? '购买' : '金币不足' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 特殊道具 -->
        <div class="category-section">
          <div class="category-title">✨ 特殊道具</div>
          <div class="shop-grid">
            <div
              v-for="item in specialItems"
              :key="item.id"
              class="shop-item special-item"
              :class="[
                item.rarity,
                { 'cannot-afford': gameStore.money < item.price }
              ]"
            >
              <div class="rarity-badge" :class="item.rarity">{{ getRarityLabel(item.rarity) }}</div>
              <div class="item-icon">{{ item.icon }}</div>
              <div class="item-name">{{ item.name }}</div>
              <div class="item-effect">{{ item.description }}</div>
              <div class="item-flavor">{{ item.flavorText }}</div>
              <div class="item-price">
                <span class="price-icon">💰</span>
                <span class="price-value">{{ item.price }}</span>
              </div>
              <button
                class="buy-btn special-buy-btn"
                :disabled="gameStore.money < item.price"
                @click="buyItem(item)"
              >
                {{ gameStore.money >= item.price ? '购买' : '金币不足' }}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 弹窗底部 -->
    <template #footer>
      <div class="modal-footer">
        <button class="close-btn" @click="showModel = false">
          关闭
        </button>
      </div>
    </template>

  </n-modal>
</template>

<script>
// ==================== 导入依赖 ====================
import { mapStores } from 'pinia'
import { useGameStore } from '../stores/game.js'
import { useShopStore } from '../stores/shop.js'
import { useBackpackStore } from '../stores/backpack.js'
import { useNotificationStore } from '../stores/notification.js'

export default {
  // 组件名称
  name: 'Shop',

  /**
   * props
   */
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  /**
   * emits
   */
  emits: ['update:show'],

  /**
   * computed
   */
  computed: {
    ...mapStores(useGameStore, useShopStore, useBackpackStore, useNotificationStore),

    showModel: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update:show', value)
      }
    },

    /**
     * foodItems: 基础食物类道具
     */
    foodItems() {
      return this.shopStore.items.filter(item => item.category === 'food')
    },

    /**
     * moodItems: 心情类道具
     */
    moodItems() {
      return this.shopStore.items.filter(item => item.category === 'mood')
    },

    /**
     * combatItems: 战斗准备类道具
     */
    combatItems() {
      return this.shopStore.items.filter(item => item.category === 'combat')
    },

    /**
     * charmItems: 风险管控类道具
     */
    charmItems() {
      return this.shopStore.items.filter(item => item.category === 'charm')
    },

    /**
     * specialItems: 特殊道具
     */
    specialItems() {
      return this.shopStore.items.filter(item => item.category === 'special')
    }
  },

  /**
   * methods
   */
  methods: {
    /**
     * buyItem: 购买物品
     * @param {Object} item - 要购买的物品
     */
    buyItem(item) {
      // 检查金币是否足够
      if (this.gameStore.money < item.price) {
        this.notificationStore.warning('💰 金币不足！')
        return
      }

      // 扣除金币
      this.gameStore.spendMoney(item.price)

      // 添加到背包
      this.backpackStore.addItem(item)

      // 显示购买成功通知
      this.notificationStore.success(`✅ 购买了 ${item.name}！`)
    },

    /**
     * getBuffDescription: 获取buff效果描述
     * @param {Object} item - 道具
     * @returns {string} 效果描述
     */
    getBuffDescription(item) {
      if (!item.buff) return item.description || ''

      switch (item.buff.type) {
        case 'hunt_reward_boost':
          return `下次战斗奖励+${Math.round(item.buff.value * 100)}%`
        case 'hunger_cost_reduce':
          return `下次探险饱食度消耗-${Math.round(item.buff.value * 100)}%`
        case 'death_money_protect':
          return '下次死亡保留全部金币'
        case 'auto_heal':
          return `健康低于${item.buff.threshold}时自动恢复${item.buff.value}`
        case 'exp_boost':
          return `下次获得经验×${item.buff.value}`
        case 'death_chance_reduce':
          return `死亡概率-${Math.round(item.buff.value * 100)}%`
        case 'reset_decay':
          return '重置所有属性衰减'
        default:
          return item.description
      }
    },

    /**
     * getRarityLabel: 获取稀有度标签
     * @param {string} rarity - 稀有度代码
     * @returns {string} 稀有度中文名称
     */
    getRarityLabel(rarity) {
      const labels = {
        common: '普通',
        uncommon: '优秀',
        rare: '稀有',
        epic: '史诗'
      }
      return labels[rarity] || '普通'
    }
  }
}
</script>

<style scoped>
/**
 * 商店弹窗样式
 */

/* 商店内容区 - 浅色背景 */
.shop-content {
  padding: 10px 0;
  max-height: 60vh;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  border: 2px solid rgba(197, 179, 224, 0.3);
}

/* 确保弹窗内所有文本颜色正确 */
.shop-content :deep(*) {
  color: rgba(74, 74, 106, 0.9);
}

/* 商品分类区域 */
.category-section {
  margin-bottom: 24px;
}

.category-title {
  font-size: 16px;
  font-weight: bold;
  color: rgba(74, 74, 106, 0.9);
  margin-bottom: 12px;
  padding: 8px 12px;
  background: rgba(197, 179, 224, 0.3);
  border-radius: 8px;
  border-left: 4px solid #c5b3e0;
}

/* 心情分类标题 */
.category-section:nth-child(2) .category-title {
  background: rgba(248, 195, 205, 0.3);
  border-left-color: #f8c3cd;
}

/* 战斗分类标题 */
.category-section:nth-child(3) .category-title {
  background: rgba(255, 179, 186, 0.3);
  border-left-color: #ffb3ba;
}

/* 风险管控分类标题 */
.category-section:nth-child(4) .category-title {
  background: rgba(168, 216, 234, 0.3);
  border-left-color: #a8d8ea;
}

/* 特殊道具分类标题 */
.category-section:nth-child(5) .category-title {
  background: rgba(255, 217, 61, 0.3);
  border-left-color: #ffd93d;
}

/* 商店描述 */
.shop-description {
  text-align: center;
  color: rgba(74, 74, 106, 0.9);
  font-size: 16px;
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(255, 217, 61, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 217, 61, 0.4);
}

.shop-description strong {
  color: #e6a700;
  font-size: 20px;
}

/* 商品网格 */
.shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  max-height: 350px;
  overflow-y: auto;
  padding: 10px;
}

/* 单个商品 */
.shop-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 2px solid rgba(197, 179, 224, 0.4);
  transition: all 0.3s ease;
}

.shop-item:hover {
  border-color: rgba(197, 179, 224, 0.8);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(197, 179, 224, 0.3);
}

/* 买不起的样式 */
.shop-item.cannot-afford {
  opacity: 0.6;
}

/* 心情道具样式 */
.mood-item {
  border-color: rgba(248, 195, 205, 0.5);
}

.mood-item:hover {
  border-color: rgba(248, 195, 205, 0.9);
}

/* 战斗道具样式 */
.combat-item {
  border-color: rgba(255, 179, 186, 0.5);
}

.combat-item:hover {
  border-color: rgba(255, 179, 186, 0.9);
}

/* 风险管控道具样式 */
.charm-item {
  border-color: rgba(168, 216, 234, 0.5);
}

.charm-item:hover {
  border-color: rgba(168, 216, 234, 0.9);
}

/* 特殊道具样式 */
.special-item {
  border-color: rgba(255, 217, 61, 0.5);
}

.special-item:hover {
  border-color: rgba(255, 217, 61, 0.9);
}

/* 心情效果文字 */
.mood-effect {
  color: #e88a9a;
  font-weight: bold;
}

/* 特殊效果文字 */
.special-effect {
  color: #d4a300;
  font-size: 11px;
  text-align: center;
  line-height: 1.3;
}

/* 商品图标 */
.item-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

/* 商品名称 */
.item-name {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-dark);
  margin-bottom: 4px;
}

/* 商品效果 */
.item-effect {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

/* 商品价格 */
.item-price {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.price-icon {
  font-size: 14px;
  margin-right: 4px;
}

.price-value {
  font-size: 16px;
  font-weight: bold;
  color: #e6a700;
}

/* 购买按钮 */
.buy-btn {
  width: 100%;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buy-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
}

.buy-btn:disabled {
  background: linear-gradient(135deg, #7f8c8d, #95a5a6);
  cursor: not-allowed;
}

/* 心情道具购买按钮 */
.mood-buy-btn {
  background: linear-gradient(135deg, #ff69b4, #ff1493);
}

.mood-buy-btn:hover:not(:disabled) {
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.4);
}

/* 战斗道具购买按钮 */
.combat-buy-btn {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.combat-buy-btn:hover:not(:disabled) {
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
}

/* 风险管控道具购买按钮 */
.charm-buy-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.charm-buy-btn:hover:not(:disabled) {
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

/* 特殊道具购买按钮 */
.special-buy-btn {
  background: linear-gradient(135deg, #f1c40f, #f39c12);
  color: #333;
}

.special-buy-btn:hover:not(:disabled) {
  box-shadow: 0 5px 15px rgba(241, 196, 15, 0.4);
}

/* 弹窗底部 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
}

/* 关闭按钮 */
.close-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #c5b3e0, #a8d8ea);
  color: var(--text-dark);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(197, 179, 224, 0.4);
}

/* ==================== 稀有度样式 ==================== */

/* 稀有度徽章 */
.rarity-badge {
  position: absolute;
  top: -8px;
  left: -8px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

/* 普通 - 白色/灰色 */
.rarity-badge.common {
  background: linear-gradient(135deg, #9e9e9e, #757575);
  color: white;
}

.shop-item.common {
  border-color: rgba(158, 158, 158, 0.5);
}

.shop-item.common:hover {
  border-color: rgba(158, 158, 158, 0.8);
  box-shadow: 0 5px 15px rgba(158, 158, 158, 0.2);
}

/* 优秀 - 绿色 */
.rarity-badge.uncommon {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
}

.shop-item.uncommon {
  border-color: rgba(76, 175, 80, 0.5);
}

.shop-item.uncommon:hover {
  border-color: rgba(76, 175, 80, 0.8);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

/* 稀有 - 蓝色 */
.rarity-badge.rare {
  background: linear-gradient(135deg, #2196f3, #1565c0);
  color: white;
}

.shop-item.rare {
  border-color: rgba(33, 150, 243, 0.6);
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.2);
}

.shop-item.rare:hover {
  border-color: rgba(33, 150, 243, 0.9);
  box-shadow: 0 5px 20px rgba(33, 150, 243, 0.4);
}

/* 史诗 - 紫色 */
.rarity-badge.epic {
  background: linear-gradient(135deg, #9c27b0, #6a1b9a);
  color: white;
  animation: epicGlow 2s ease-in-out infinite;
}

.shop-item.epic {
  border-color: rgba(156, 39, 176, 0.7);
  box-shadow: 0 0 15px rgba(156, 39, 176, 0.3);
  animation: epicBorderGlow 2s ease-in-out infinite;
}

.shop-item.epic:hover {
  border-color: rgba(156, 39, 176, 1);
  box-shadow: 0 5px 25px rgba(156, 39, 176, 0.5);
}

/* 史诗稀有度动画 */
@keyframes epicGlow {
  0%, 100% {
    box-shadow: 0 2px 5px rgba(156, 39, 176, 0.5);
  }
  50% {
    box-shadow: 0 2px 15px rgba(156, 39, 176, 0.8);
  }
}

@keyframes epicBorderGlow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(156, 39, 176, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(156, 39, 176, 0.4);
  }
}

/* 风味文本 */
.item-flavor {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  text-align: center;
  line-height: 1.3;
  margin-top: 4px;
  padding: 0 5px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 单个商品需要相对定位来容纳徽章 */
.shop-item {
  position: relative;
}
</style>
