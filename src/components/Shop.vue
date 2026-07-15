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
    :title="$t('shop.title')"
    preset="card"
    class="shop-modal"
    :style="{ width: '500px', maxWidth: '90vw' }"
    :mask-closable="true"
  >
    <!-- 商店内容 -->
    <div class="shop-content">

      <!-- 商店描述 -->
      <div class="shop-description">
        {{ $t('shop.currentGold') }}: <strong>{{ gameStore.money }}</strong>
      </div>

      <!-- 商品分类 -->
      <div class="shop-categories">
        <!-- 基础食物 -->
        <div class="category-section">
          <div class="category-title">{{ $t('shop.categories.food') }}</div>
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
              <component
                :is="getIconComponent(item.key)"
                v-if="getIconComponent(item.key)"
                class="item-icon-svg"
                :rarity="item.rarity"
                :type="getFragmentType(item.key)"
              />
              <div v-else class="item-icon-fallback">{{ item.icon }}</div>
              <div class="item-name">{{ $t(`items.list.${item.key}.name`) }}</div>
              <div class="item-effect">
                <span v-if="item.foodValue > 0">{{ $t('item.hungerValue', { value: item.foodValue }) }}</span>
                <span v-if="item.moodValue > 0" class="mood-effect">{{ $t('item.moodValue', { value: item.moodValue }) }}</span>
              </div>
              <div class="item-flavor">{{ $t(`items.list.${item.key}.flavor`) }}</div>
              <div class="item-price">
                <CoinBagIcon class="price-icon" />
                <span class="price-value">{{ item.price }}</span>
              </div>
              <button
                class="buy-btn"
                :disabled="gameStore.money < item.price"
                @click="buyItem(item)"
              >
                {{ gameStore.money >= item.price ? $t('ui.buy') : $t('ui.insufficientGold') }}
              </button>
            </div>
          </div>
        </div>

        <!-- 心情道具 -->
        <div class="category-section">
          <div class="category-title">{{ $t('shop.categories.mood') }}</div>
          <div class="shop-grid">
            <div
              v-for="item in moodItems"
              :key="item.id"
              class="shop-item"
              :class="[
                item.rarity,
                { 'cannot-afford': gameStore.money < item.price }
              ]"
            >
              <div class="rarity-badge" :class="item.rarity">{{ getRarityLabel(item.rarity) }}</div>
              <component
                :is="getIconComponent(item.key)"
                v-if="getIconComponent(item.key)"
                class="item-icon-svg"
                :rarity="item.rarity"
                :type="getFragmentType(item.key)"
              />
              <div v-else class="item-icon-fallback">{{ item.icon }}</div>
              <div class="item-name">{{ $t(`items.list.${item.key}.name`) }}</div>
              <div class="item-effect">
                <span class="mood-effect">{{ $t('item.moodValue', { value: item.moodValue }) }}</span>
              </div>
              <div class="item-flavor">{{ $t(`items.list.${item.key}.flavor`) }}</div>
              <div class="item-price">
                <CoinBagIcon class="price-icon" />
                <span class="price-value">{{ item.price }}</span>
              </div>
              <button
                class="buy-btn"
                :disabled="gameStore.money < item.price"
                @click="buyItem(item)"
              >
                {{ gameStore.money >= item.price ? $t('ui.buy') : $t('ui.insufficientGold') }}
              </button>
            </div>
          </div>
        </div>

        <!-- 战斗准备 -->
        <div class="category-section">
          <div class="category-title">{{ $t('shop.categories.combat') }}</div>
          <div class="shop-grid">
            <div
              v-for="item in combatItems"
              :key="item.id"
              class="shop-item"
              :class="[
                item.rarity,
                { 'cannot-afford': gameStore.money < item.price }
              ]"
            >
              <div class="rarity-badge" :class="item.rarity">{{ getRarityLabel(item.rarity) }}</div>
              <component
                :is="getIconComponent(item.key)"
                v-if="getIconComponent(item.key)"
                class="item-icon-svg"
                :rarity="item.rarity"
                :type="getFragmentType(item.key)"
              />
              <div v-else class="item-icon-fallback">{{ item.icon }}</div>
              <div class="item-name">{{ $t(`items.list.${item.key}.name`) }}</div>
              <div class="item-effect special-effect">
                {{ getBuffDescription(item) }}
              </div>
              <div class="item-flavor">{{ $t(`items.list.${item.key}.flavor`) }}</div>
              <div class="item-price">
                <CoinBagIcon class="price-icon" />
                <span class="price-value">{{ item.price }}</span>
              </div>
              <button
                class="buy-btn"
                :disabled="gameStore.money < item.price"
                @click="buyItem(item)"
              >
                {{ gameStore.money >= item.price ? $t('ui.buy') : $t('ui.insufficientGold') }}
              </button>
            </div>
          </div>
        </div>

        <!-- 风险管控 -->
        <div class="category-section">
          <div class="category-title">{{ $t('shop.categories.charm') }}</div>
          <div class="shop-grid">
            <div
              v-for="item in charmItems"
              :key="item.id"
              class="shop-item"
              :class="[
                item.rarity,
                { 'cannot-afford': gameStore.money < item.price }
              ]"
            >
              <div class="rarity-badge" :class="item.rarity">{{ getRarityLabel(item.rarity) }}</div>
              <component
                :is="getIconComponent(item.key)"
                v-if="getIconComponent(item.key)"
                class="item-icon-svg"
                :rarity="item.rarity"
                :type="getFragmentType(item.key)"
              />
              <div v-else class="item-icon-fallback">{{ item.icon }}</div>
              <div class="item-name">{{ $t(`items.list.${item.key}.name`) }}</div>
              <div class="item-effect special-effect">
                {{ getBuffDescription(item) }}
              </div>
              <div class="item-flavor">{{ $t(`items.list.${item.key}.flavor`) }}</div>
              <div class="item-price">
                <CoinBagIcon class="price-icon" />
                <span class="price-value">{{ item.price }}</span>
              </div>
              <button
                class="buy-btn"
                :disabled="gameStore.money < item.price"
                @click="buyItem(item)"
              >
                {{ gameStore.money >= item.price ? $t('ui.buy') : $t('ui.insufficientGold') }}
              </button>
            </div>
          </div>
        </div>

        <!-- 特殊道具 -->
        <div class="category-section">
          <div class="category-title">{{ $t('shop.categories.special') }}</div>
          <div class="shop-grid">
            <div
              v-for="item in specialItems"
              :key="item.id"
              class="shop-item"
              :class="[
                item.rarity,
                { 'cannot-afford': gameStore.money < item.price }
              ]"
            >
              <div class="rarity-badge" :class="item.rarity">{{ getRarityLabel(item.rarity) }}</div>
              <component
                :is="getIconComponent(item.key)"
                v-if="getIconComponent(item.key)"
                class="item-icon-svg"
                :rarity="item.rarity"
                :type="getFragmentType(item.key)"
              />
              <div v-else class="item-icon-fallback">{{ item.icon }}</div>
              <div class="item-name">{{ $t(`items.list.${item.key}.name`) }}</div>
              <div class="item-effect">{{ $t(`items.list.${item.key}.description`) }}</div>
              <div class="item-flavor">{{ $t(`items.list.${item.key}.flavor`) }}</div>
              <div class="item-price">
                <CoinBagIcon class="price-icon" />
                <span class="price-value">{{ item.price }}</span>
              </div>
              <button
                class="buy-btn"
                :disabled="gameStore.money < item.price"
                @click="buyItem(item)"
              >
                {{ gameStore.money >= item.price ? $t('ui.buy') : $t('ui.insufficientGold') }}
              </button>
            </div>
          </div>
        </div>

        <!-- 合成药水 -->
        <div class="category-section">
          <div class="category-title">{{ $t('shop.categories.synthesis') }}</div>
          <div class="shop-grid">
            <div
              v-for="item in synthesisItems"
              :key="item.id"
              class="shop-item"
              :class="[
                item.rarity,
                { 'cannot-afford': gameStore.money < item.price }
              ]"
            >
              <div class="rarity-badge" :class="item.rarity">{{ getRarityLabel(item.rarity) }}</div>
              <component
                :is="getIconComponent(item.key)"
                v-if="getIconComponent(item.key)"
                class="item-icon-svg"
                :rarity="item.rarity"
                :type="getFragmentType(item.key)"
              />
              <div v-else class="item-icon-fallback">{{ item.icon }}</div>
              <div class="item-name">{{ $t(`items.list.${item.key}.name`) }}</div>
              <div class="item-effect">{{ $t(`items.list.${item.key}.description`) }}</div>
              <div class="item-flavor">{{ $t(`items.list.${item.key}.flavor`) }}</div>
              <div class="item-price">
                <CoinBagIcon class="price-icon" />
                <span class="price-value">{{ item.price }}</span>
              </div>
              <button
                class="buy-btn"
                :disabled="gameStore.money < item.price"
                @click="buyItem(item)"
              >
                {{ gameStore.money >= item.price ? $t('ui.buy') : $t('ui.insufficientGold') }}
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
          {{ $t('ui.close') }}
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
import { itemIconMap, fragmentTypes } from './icons/itemIconMap.js'
import CoinBagIcon from './icons/ui/CoinBagIcon.vue'

export default {
  // 组件名称
  name: 'Shop',

  components: {
    CoinBagIcon
  },

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
    },

    /**
     * synthesisItems: 合成药水
     */
    synthesisItems() {
      return this.shopStore.items.filter(item => item.category === 'synthesis')
    }
  },

  /**
   * methods
   */
  methods: {
    /**
     * getIconComponent: 获取物品对应的 SVG 图标组件
     * @param {string} key - 物品 key
     * @returns {Object|null} 图标组件或 null
     */
    getIconComponent(key) {
      return itemIconMap[key] || null
    },

    /**
     * getFragmentType: 获取碎片对应的宠物类型（用于 FragmentIcon 颜色）
     * @param {string} key - 物品 key
     * @returns {string} 宠物类型
     */
    getFragmentType(key) {
      return fragmentTypes[key] || 'cat'
    },

    /**
     * buyItem: 购买物品
     * @param {Object} item - 要购买的物品
     */
    buyItem(item) {
      // 检查金币是否足够
      if (this.gameStore.money < item.price) {
        this.notificationStore.warning(this.$t('ui.insufficientGold'))
        return
      }

      // 扣除金币
      this.gameStore.spendMoney(item.price)

      // 添加到背包
      this.backpackStore.addItem(item)

      // 显示购买成功通知
      this.notificationStore.success(this.$t('shop.purchaseSuccess', { name: this.$t(`items.list.${item.key}.name`) }))
    },

    /**
     * getBuffDescription: 获取buff效果描述
     * @param {Object} item - 道具
     * @returns {string} 效果描述
     */
    getBuffDescription(item) {
      if (!item.buff) return item.key ? this.$t(`items.list.${item.key}.description`) : ''

      switch (item.buff.type) {
        case 'hunt_reward_boost':
          return this.$t('notifications.buff.combatBonus', { percent: Math.round(item.buff.value * 100) })
        case 'hunger_cost_reduce':
          return this.$t('notifications.buff.consumptionReduction', { percent: Math.round(item.buff.value * 100) })
        case 'death_money_protect':
          return this.$t('notifications.buff.keepGold')
        case 'auto_heal':
          return this.$t('notifications.buff.autoHeal')
        case 'exp_boost':
          return this.$t('notifications.buff.expMultiplier', { multiplier: item.buff.value })
        case 'death_chance_reduce':
          return this.$t('notifications.buff.deathReduction', { percent: Math.round(item.buff.value * 100) })
        case 'reset_decay':
          return this.$t('notifications.buff.timeRewind')
        default:
          return item.key ? this.$t(`items.list.${item.key}.description`) : ''
      }
    },

    /**
     * getRarityLabel: 获取稀有度标签
     * @param {string} rarity - 稀有度代码
     * @returns {string} 稀有度名称
     */
    getRarityLabel(rarity) {
      return this.$t(`items.rarity.${rarity}`) || this.$t('items.rarity.common')
    }
  }
}
</script>

<style scoped>
/**
 * 商店弹窗样式 - 魔法书页风格
 */

/* 弹窗外框 - 魔法书页风格 */
.shop-modal :deep(.n-card) {
  background: linear-gradient(135deg, var(--mp-purple-soft) 0%, var(--mp-bg) 100%);
  border: 4px solid var(--mp-purple);
  border-radius: var(--mp-radius-lg);
  box-shadow: var(--mp-shadow-hover);
}

/* 商店内容区 */
.shop-content {
  padding: 10px 0;
  max-height: 60vh;
  overflow-y: auto;
}

/* 商店描述 */
.shop-description {
  text-align: center;
  color: var(--mp-ink);
  font-size: 16px;
  margin-bottom: 20px;
  padding: 12px;
  background: color-mix(in srgb, var(--mp-gold) 20%, transparent);
  border-radius: var(--mp-radius-md);
  border: 2px solid color-mix(in srgb, var(--mp-gold) 40%, transparent);
}

.shop-description strong {
  color: var(--mp-gold);
  font-size: 20px;
}

/* 商品分类区域 */
.category-section {
  margin-bottom: 24px;
}

/* 分类标题 - 胶囊标签 */
.category-title {
  display: inline-block;
  padding: 8px 16px;
  background: var(--mp-purple);
  color: var(--mp-white);
  border: 3px solid var(--mp-ink);
  border-radius: var(--mp-radius-full);
  font-weight: 700;
  margin-bottom: 12px;
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

/* 单个商品卡片 - 贴纸风格 */
.shop-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  background: var(--mp-white);
  border: 3px solid var(--mp-ink);
  border-radius: var(--mp-radius-md);
  box-shadow: var(--mp-shadow);
  transition: all var(--mp-duration-fast) ease;
}

.shop-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--mp-shadow-hover);
}

/* 买不起的样式 */
.shop-item.cannot-afford {
  opacity: 0.6;
}

/* 商品 SVG 图标 */
.item-icon-svg {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
}

/* 商品图标回退（emoji） */
.item-icon-fallback {
  font-size: 36px;
  margin-bottom: 8px;
}

/* 商品名称 */
.item-name {
  font-size: 14px;
  font-weight: bold;
  color: var(--mp-ink);
  margin-bottom: 4px;
  text-align: center;
}

/* 商品效果 */
.item-effect {
  font-size: 12px;
  color: var(--mp-text-muted);
  margin-bottom: 8px;
  text-align: center;
}

/* 心情效果文字 */
.mood-effect {
  color: var(--mp-pink);
  font-weight: bold;
}

/* 特殊效果文字 */
.special-effect {
  color: var(--mp-gold);
  font-size: 11px;
  text-align: center;
  line-height: 1.3;
}

/* 风味文本 */
.item-flavor {
  font-size: 10px;
  color: var(--mp-text-muted);
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

/* 商品价格 */
.item-price {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.price-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.price-value {
  font-size: 16px;
  font-weight: bold;
  color: var(--mp-gold);
}

/* 购买按钮 - 胶囊贴纸风格 */
.buy-btn {
  width: 100%;
  padding: 8px 16px;
  border: 2px solid var(--mp-ink);
  border-radius: var(--mp-radius-full);
  background: linear-gradient(135deg, var(--mp-mint), var(--mp-mint-light));
  color: var(--mp-ink);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--mp-shadow);
  transition: all var(--mp-duration-fast) ease;
}

.buy-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: var(--mp-shadow-hover);
}

.buy-btn:disabled {
  background: color-mix(in srgb, var(--mp-ink) 30%, transparent);
  color: var(--mp-white);
  cursor: not-allowed;
}

/* 弹窗底部 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
}

/* 关闭按钮 - 胶囊贴纸风格 */
.close-btn {
  padding: 8px 20px;
  border: 3px solid var(--mp-ink);
  border-radius: var(--mp-radius-full);
  background: var(--mp-white);
  color: var(--mp-ink);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--mp-shadow);
  transition: all var(--mp-duration-fast) ease;
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--mp-shadow-hover);
}

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
  box-shadow: var(--mp-shadow);
  z-index: 10;
}

.rarity-badge.common {
  background: color-mix(in srgb, var(--mp-ink) 60%, transparent);
  color: var(--mp-white);
}

.shop-item.common { border-color: color-mix(in srgb, var(--mp-ink) 40%, transparent); }

.rarity-badge.uncommon {
  background: var(--mp-mint);
  color: var(--mp-ink);
}

.shop-item.uncommon { border-color: var(--mp-mint); }

.rarity-badge.rare {
  background: var(--mp-blue);
  color: var(--mp-white);
}

.shop-item.rare { border-color: var(--mp-blue); }

.rarity-badge.epic {
  background: var(--mp-purple);
  color: var(--mp-white);
}

.shop-item.epic { border-color: var(--mp-purple); }
</style>
