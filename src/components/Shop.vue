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

      <!-- 商品列表 -->
      <div class="shop-grid">
        <!--
          遍历商店中的商品
        -->
        <div
          v-for="item in shopStore.items"
          :key="item.id"
          class="shop-item"
          :class="{ 'cannot-afford': gameStore.money < item.price }"
        >
          <!-- 商品图标 -->
          <div class="item-icon">{{ item.icon }}</div>

          <!-- 商品名称 -->
          <div class="item-name">{{ item.name }}</div>

          <!-- 商品效果 -->
          <div class="item-effect">
            饱食度 +{{ item.foodValue }}
          </div>

          <!-- 价格 -->
          <div class="item-price">
            <span class="price-icon">💰</span>
            <span class="price-value">{{ item.price }}</span>
          </div>

          <!-- 购买按钮 -->
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
    ...mapStores(useGameStore, useShopStore, useBackpackStore),

    showModel: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update:show', value)
      }
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
        alert('金币不足！')
        return
      }

      // 扣除金币
      this.gameStore.spendMoney(item.price)

      // 添加到背包
      this.backpackStore.addItem(item)

      // 显示成功提示
      // alert(`购买了 ${item.name}！`)
    }
  }
}
</script>

<style scoped>
/**
 * 商店弹窗样式
 */

/* 商店内容区 */
.shop-content {
  padding: 10px 0;
}

/* 商店描述 */
.shop-description {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.shop-description strong {
  color: #ffd700;
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 2px solid rgba(155, 89, 182, 0.3);
  transition: all 0.3s ease;
}

.shop-item:hover {
  border-color: rgba(155, 89, 182, 0.6);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* 买不起的样式 */
.shop-item.cannot-afford {
  opacity: 0.6;
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
  color: white;
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
  color: #ffd700;
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
  background: linear-gradient(135deg, #9b59b6, #6c3483);
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(155, 89, 182, 0.4);
}
</style>
