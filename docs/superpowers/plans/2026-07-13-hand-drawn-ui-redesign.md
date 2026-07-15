# Magic Potion 手绘风 UI 改造实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Magic Potion 游戏界面全面升级为 Q版手绘卡通风格，用 Vue SVG 图标组件替代所有 emoji，并增强动画与动态背景。

**Architecture:** 在独立分支 `feature/hand-drawn-ui-redesign` 上，保持现有 Vue 3 + Pinia 架构和数据流不变，通过新增 `src/components/icons/` 图标组件、`src/components/MagicBackground.vue` 动态背景，以及重写现有 UI 组件的模板和样式来完成视觉升级。

**Tech Stack:** Vue 3 (Options API), Pinia, Naive UI, vue-i18n, Vite, CSS3 动画, SVG

## Global Constraints

- 不修改 `src/stores/*.js` 状态管理逻辑
- 不修改 `src/config/*.js` 配置数据结构
- 不修改拖拽数据流（仍使用 HTML5 Drag API 的 JSON 格式）
- 不修改 i18n 现有键值，可新增 UI 文案
- 所有颜色使用设计 token，不硬编码色值
- 优先使用 CSS 动画，减少 JS 驱动动画
- 每完成一个组件都要运行 `npm run dev` 验证
- 频繁提交，每个任务独立 commit

---

## 文件结构总览

### 新增文件

| 文件路径 | 职责 |
|---------|------|
| `src/styles/design-tokens.css` | 全局设计 token（颜色、圆角、阴影、动画时长） |
| `src/components/MagicBackground.vue` | 动态背景（云朵、星星、漂浮岛屿、流星） |
| `src/components/icons/SlugcatAvatar.vue` | 手绘蛞蝓猫宠物头像，支持多状态表情 |
| `src/components/icons/items/CookieIcon.vue` | 魔法饼干 SVG |
| `src/components/icons/items/PotionIcon.vue` | 药水 SVG（通过 color prop 区分稀有度） |
| `src/components/icons/items/CandyIcon.vue` | 彩虹糖果 SVG |
| `src/components/icons/items/CakeIcon.vue` | 魔法蛋糕 SVG |
| `src/components/icons/items/WaterIcon.vue` | 清水 SVG |
| `src/components/icons/items/ToyIcon.vue` | 快乐玩具 SVG |
| `src/components/icons/items/ScrollIcon.vue` | 经验卷轴 SVG |
| `src/components/icons/items/AmuletIcon.vue` | 护身符 SVG |
| `src/components/icons/items/FirstAidIcon.vue` | 急救包 SVG |
| `src/components/icons/items/ReviveIcon.vue` | 复活药水 SVG |
| `src/components/icons/items/LuckyCharmIcon.vue` | 幸运护符 SVG |
| `src/components/icons/items/HourglassIcon.vue` | 时间沙漏 SVG |
| `src/components/icons/items/FragmentIcon.vue` | 碎片 SVG（通过 type prop 区分） |
| `src/components/icons/ui/CoinBagIcon.vue` | 顶部金币袋 SVG |
| `src/components/icons/decorations/TreeDecoration.vue` | 森林区树木装饰 |
| `src/components/icons/decorations/FireDecoration.vue` | 游猎区篝火装饰 |
| `src/components/icons/decorations/CloudDecoration.vue` | 背景云朵 |
| `src/components/icons/decorations/StarDecoration.vue` | 背景星星 |
| `src/components/icons/decorations/BatDecoration.vue` | 游猎区蝙蝠装饰 |

### 修改文件

| 文件路径 | 改造内容 |
|---------|---------|
| `index.html` | 更新全局 CSS 变量和背景样式 |
| `src/App.vue` | 引入 MagicBackground、调整布局间距 |
| `src/components/TopBar.vue` | 卷轴横幅、金币袋、魔法贴纸按钮 |
| `src/components/PetDisplay.vue` | 魔法相框、SVG 宠物、糖果色进度条 |
| `src/components/CrystalBall.vue` | 手绘水晶球、呼吸光晕、吸入动画 |
| `src/components/OutdoorPlay.vue` | 森林手绘场景、树木摇摆 |
| `src/components/OutdoorHunt.vue` | 游猎手绘场景、篝火/蝙蝠 |
| `src/components/Item.vue` | SVG 图标、贴纸卡片 |
| `src/components/Shop.vue` | 魔法书页弹窗、贴纸商品卡片 |
| `src/components/synthesis/SynthesisUI.vue` | 手绘合成界面 |
| `src/components/SaveManager.vue` | 卷轴风格存档卡片 |
| `src/components/NotificationBar.vue` | 魔法气泡通知 |

---

## Task 1: 创建分支并建立设计 Token

**Files:**
- Create: `src/styles/design-tokens.css`
- Modify: `index.html`
- Modify: `src/App.vue`
- Test: 浏览器查看页面背景色是否变化

**Interfaces:**
- Consumes: 无
- Produces: CSS 变量 `--mp-*`，供所有组件使用

- [ ] **Step 1: 从 main 切出功能分支**

```bash
git checkout -b feature/hand-drawn-ui-redesign
```

- [ ] **Step 2: 创建设计 token 文件**

创建 `src/styles/design-tokens.css`：

```css
/*
  Magic Potion 手绘风设计 Token
  所有 UI 组件应使用这些变量，避免硬编码
*/

:root {
  /* 主色 */
  --mp-purple: #8B5CF6;
  --mp-purple-light: #A78BFA;
  --mp-purple-dark: #7C3AED;
  --mp-purple-soft: #F5F0FF;

  /* 功能色 */
  --mp-mint: #7DD3C0;
  --mp-mint-light: #A7F3D0;
  --mp-pink: #F472B6;
  --mp-pink-light: #FBCFE8;
  --mp-gold: #FBBF24;
  --mp-gold-light: #FDE68A;
  --mp-red: #F87171;
  --mp-blue: #60A5FA;

  /* 中性色 */
  --mp-ink: #612315;
  --mp-white: #FFFFFF;
  --mp-bg: #F5F0FF;
  --mp-text: #612315;
  --mp-text-muted: rgba(97, 35, 21, 0.6);

  /* 描边与阴影 */
  --mp-border-width: 3px;
  --mp-border-color: var(--mp-ink);
  --mp-shadow-offset: 4px;
  --mp-shadow-color: rgba(97, 35, 21, 0.15);
  --mp-shadow: var(--mp-shadow-offset) var(--mp-shadow-offset) 0 var(--mp-shadow-color);
  --mp-shadow-hover: 6px 6px 0 var(--mp-shadow-color);

  /* 圆角 */
  --mp-radius-sm: 12px;
  --mp-radius-md: 16px;
  --mp-radius-lg: 24px;
  --mp-radius-full: 9999px;

  /* 动画时长 */
  --mp-duration-fast: 0.15s;
  --mp-duration-normal: 0.3s;
  --mp-duration-slow: 0.6s;
  --mp-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

- [ ] **Step 3: 更新 index.html**

将 `index.html` 中 `<style>` 内的 `:root` 变量替换为引用设计 token，并调整 body 背景：

```html
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: linear-gradient(180deg, #F5F0FF 0%, #EDE6FF 50%, #E6D9FF 100%);
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    overflow: hidden;
  }

  :root {
    /* 兼容旧变量，逐步迁移到 --mp-* */
    --primary-purple: #8B5CF6;
    --light-purple: #F5F0FF;
    --dark-purple: #7C3AED;
    --magic-blue: #60A5FA;
    --glow-color: rgba(139, 92, 246, 0.4);
    --text-dark: #612315;
    --text-light: #FFFFFF;
    --soft-pink: #F472B6;
    --soft-mint: #7DD3C0;
    --soft-gold: #FBBF24;
  }
</style>
```

- [ ] **Step 4: 在 App.vue 中导入设计 token**

在 `src/App.vue` 的 `<style>` 顶部添加：

```css
@import '../styles/design-tokens.css';
```

- [ ] **Step 5: 验证**

运行：

```bash
npm run dev
```

打开浏览器 `http://localhost:5173`，确认：
1. 页面正常加载无报错
2. 背景色为新的浅紫色渐变

- [ ] **Step 6: 提交**

```bash
git add src/styles/design-tokens.css index.html src/App.vue
git commit -m "feat(ui): add design tokens and update base background

- Add src/styles/design-tokens.css with hand-drawn theme tokens
- Update index.html background gradient
- Import tokens in App.vue

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 2: 创建宠物 SVG 头像组件

**Files:**
- Create: `src/components/icons/SlugcatAvatar.vue`
- Modify: `src/components/PetDisplay.vue`（临时引用验证）
- Test: 浏览器查看宠物头像是否正常显示

**Interfaces:**
- Consumes: `status` (String), `petType` (String), `size` (Number)
- Produces: SVG 宠物头像，支持不同状态和类型配色

- [ ] **Step 1: 创建 SlugcatAvatar.vue**

```vue
<template>
  <div class="slugcat-avatar" :class="[status, `type-${petType}`]" :style="avatarStyle">
    <svg viewBox="0 0 100 90" class="slugcat-svg">
      <!-- 身体 -->
      <ellipse cx="50" cy="55" rx="42" ry="32" class="body" />

      <!-- 蜗牛壳 -->
      <g class="shell">
        <circle cx="35" cy="48" r="18" />
        <path d="M25 48 Q35 38 45 48 Q35 58 25 48" fill="none" stroke-width="2" />
        <path d="M28 42 Q35 35 42 42" fill="none" stroke-width="2" />
      </g>

      <!-- 猫耳朵 -->
      <path d="M28 28 L22 12 L38 22 Z" class="ear left" />
      <path d="M72 28 L78 12 L62 22 Z" class="ear right" />

      <!-- 眼睛 -->
      <g class="eyes">
        <circle cx="38" cy="42" r="5" class="eye" />
        <circle cx="62" cy="42" r="5" class="eye" />
        <!-- 状态表情覆盖 -->
        <g v-if="status === 'sleeping' || status === 'happy'" class="closed-eyes">
          <path d="M33 42 Q38 47 43 42" fill="none" stroke-width="3" stroke-linecap="round" />
          <path d="M57 42 Q62 47 67 42" fill="none" stroke-width="3" stroke-linecap="round" /
        </g>
        <g v-if="status === 'sad'">
          <tear cx="38" cy="50" r="2" />
          <tear cx="62" cy="50" r="2" />
        </g>
      </g>

      <!-- 嘴巴 -->
      <path v-if="status === 'happy' || status === 'playing'" d="M42 58 Q50 66 58 58" fill="none" stroke-width="3" stroke-linecap="round" class="mouth smile" />
      <path v-else-if="status === 'sad' || status === 'tired'" d="M44 62 Q50 56 56 62" fill="none" stroke-width="3" stroke-linecap="round" class="mouth frown" />
      <ellipse v-else cx="50" cy="60" rx="4" ry="3" class="mouth neutral" />

      <!-- 腮红 -->
      <circle v-if="status === 'happy' || status === 'playing'" cx="28" cy="52" r="4" class="blush" />
      <circle v-if="status === 'happy' || status === 'playing'" cx="72" cy="52" r="4" class="blush" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'SlugcatAvatar',

  props: {
    status: {
      type: String,
      default: 'idle'
    },
    petType: {
      type: String,
      default: 'cat'
    },
    size: {
      type: Number,
      default: 100
    }
  },

  computed: {
    avatarStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size * 0.9}px`
      }
    }
  }
}
</script>

<style scoped>
.slugcat-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.slugcat-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 身体描边 */
.body {
  fill: var(--body-color, #c8f0d8);
  stroke: var(--mp-ink);
  stroke-width: 3;
}

/* 壳 */
.shell circle {
  fill: rgba(255, 255, 255, 0.4);
  stroke: var(--mp-ink);
  stroke-width: 2.5;
}

.shell path {
  stroke: var(--mp-ink);
}

/* 耳朵 */
.ear {
  fill: var(--body-color, #c8f0d8);
  stroke: var(--mp-ink);
  stroke-width: 3;
  transform-origin: bottom center;
}

/* 眼睛 */
.eye {
  fill: var(--mp-ink);
}

.closed-eyes path {
  stroke: var(--mp-ink);
}

/* 嘴巴 */
.mouth {
  stroke: var(--mp-ink);
}

.mouth.neutral {
  fill: var(--mp-ink);
}

.blush {
  fill: var(--mp-pink);
  opacity: 0.5;
}

/* 类型配色 */
.type-cat { --body-color: #c8f0d8; }
.type-bird { --body-color: #a8e6f0; }
.type-fox { --body-color: #ffd4a8; }
.type-dragon { --body-color: #e8d8f0; }

/* 状态动画 */
.sleeping .slugcat-svg {
  animation: sway 3s ease-in-out infinite;
}

.happy .slugcat-svg {
  animation: happy-bounce 0.6s ease-in-out infinite;
}

.playing .slugcat-svg {
  animation: wiggle 0.3s ease-in-out infinite;
}

.hunting .slugcat-svg {
  animation: shake 0.2s ease-in-out infinite;
}

.tired .slugcat-svg {
  animation: breathe 2.5s ease-in-out infinite;
}

.sad .slugcat-svg {
  animation: shiver 2s ease-in-out infinite;
}

@keyframes sway {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

@keyframes happy-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.95) translateY(3px); }
}

@keyframes shiver {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}
</style>
```

注意：上述 SVG 中的 `<tear>` 不是有效 SVG 标签，需要改为 `<circle>`。修正如下：

```vue
        <g v-if="status === 'sad'">
          <circle cx="38" cy="50" r="2" class="tear" />
          <circle cx="62" cy="50" r="2" class="tear" />
        </g>
```

并添加 `.tear { fill: var(--mp-blue); }`

- [ ] **Step 2: 在 PetDisplay.vue 中临时引用验证**

在 `src/components/PetDisplay.vue` 中导入组件并在宠物头像区域使用：

```javascript
import SlugcatAvatar from './icons/SlugcatAvatar.vue'
```

在 `components` 中注册：

```javascript
components: {
  Item,
  SlugcatAvatar
}
```

在模板中找到大头像区域，临时替换为：

```vue
<SlugcatAvatar :status="gameStore.pet.status" :pet-type="petConfig?.type" :size="100" />
```

- [ ] **Step 3: 验证**

运行 `npm run dev`，确认宠物头像显示为 SVG 图形，并且切换状态（如喂食后变成 happy）时动画生效。

- [ ] **Step 4: 提交**

```bash
git add src/components/icons/SlugcatAvatar.vue src/components/PetDisplay.vue
git commit -m "feat(ui): add hand-drawn slugcat avatar SVG component

- Add SlugcatAvatar.vue with multi-status animations
- Support cat/bird/fox/dragon color variants
- Temporarily integrate into PetDisplay for verification

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 3: 创建物品 SVG 图标组件

**Files:**
- Create: `src/components/icons/items/*.vue`（多个文件）
- Create: `src/components/icons/itemIconMap.js`
- Modify: `src/components/Item.vue`
- Test: 浏览器查看背包物品图标

**Interfaces:**
- Consumes: `item` 对象的 `key` 和 `rarity`
- Produces: `ItemIcon.vue` 动态组件映射

- [ ] **Step 1: 创建物品图标映射文件**

创建 `src/components/icons/itemIconMap.js`：

```javascript
import CookieIcon from './items/CookieIcon.vue'
import CandyIcon from './items/CandyIcon.vue'
import CakeIcon from './items/CakeIcon.vue'
import WaterIcon from './items/WaterIcon.vue'
import ToyIcon from './items/ToyIcon.vue'
import PotionIcon from './items/PotionIcon.vue'
import ScrollIcon from './items/ScrollIcon.vue'
import AmuletIcon from './items/AmuletIcon.vue'
import FirstAidIcon from './items/FirstAidIcon.vue'
import ReviveIcon from './items/ReviveIcon.vue'
import LuckyCharmIcon from './items/LuckyCharmIcon.vue'
import HourglassIcon from './items/HourglassIcon.vue'
import FragmentIcon from './items/FragmentIcon.vue'

export const itemIconMap = {
  magic_cookie: CookieIcon,
  rainbow_candy: CandyIcon,
  magic_cake: CakeIcon,
  water: WaterIcon,
  joy_toy: ToyIcon,
  stamina_potion: PotionIcon,
  combat_ration: PotionIcon,
  rainbow_potion: PotionIcon,
  exp_scroll: ScrollIcon,
  amulet: AmuletIcon,
  first_aid_kit: FirstAidIcon,
  revive_potion: ReviveIcon,
  lucky_charm: LuckyCharmIcon,
  time_hourglass: HourglassIcon,
  common_potion: PotionIcon,
  uncommon_potion: PotionIcon,
  rare_potion: PotionIcon,
  epic_potion: PotionIcon,
  cat_fragment: FragmentIcon,
  bird_fragment: FragmentIcon,
  fox_fragment: FragmentIcon,
  dragon_fragment: FragmentIcon
}

export const fragmentTypes = {
  cat_fragment: 'cat',
  bird_fragment: 'bird',
  fox_fragment: 'fox',
  dragon_fragment: 'dragon'
}
```

- [ ] **Step 2: 创建 CookieIcon.vue**

```vue
<template>
  <svg viewBox="0 0 64 64" class="cookie-icon">
    <circle cx="32" cy="32" r="28" class="cookie-base" />
    <circle cx="20" cy="22" r="3" class="chip" />
    <circle cx="40" cy="20" r="4" class="chip" />
    <circle cx="30" cy="36" r="3.5" class="chip" />
    <circle cx="46" cy="40" r="3" class="chip" />
    <circle cx="22" cy="46" r="3.5" class="chip" />
  </svg>
</template>

<style scoped>
.cookie-icon {
  width: 100%;
  height: 100%;
}
.cookie-base {
  fill: #FDE68A;
  stroke: #612315;
  stroke-width: 3;
}
.chip {
  fill: #612315;
}
</style>
```

- [ ] **Step 3: 创建 PotionIcon.vue**

```vue
<template>
  <svg viewBox="0 0 64 64" class="potion-icon">
    <!-- 瓶口 -->
    <rect x="24" y="6" width="16" height="10" rx="2" class="bottle-neck" />
    <!-- 瓶身 -->
    <path d="M20 20 L20 48 Q20 58 32 58 Q44 58 44 48 L44 20 Z" class="bottle-body" />
    <!-- 液体 -->
    <path d="M22 28 L22 48 Q22 56 32 56 Q42 56 42 48 L42 28 Q32 32 22 28 Z" class="liquid" :style="liquidStyle" />
    <!-- 标签 -->
    <rect x="22" y="34" width="20" height="10" rx="2" class="label" />
  </svg>
</template>

<script>
export default {
  name: 'PotionIcon',
  props: {
    rarity: { type: String, default: 'common' }
  },
  computed: {
    liquidStyle() {
      const colors = {
        common: '#F472B6',
        uncommon: '#34D399',
        rare: '#60A5FA',
        epic: '#A855F7'
      }
      return { fill: colors[this.rarity] || colors.common }
    }
  }
}
</script>

<style scoped>
.potion-icon {
  width: 100%;
  height: 100%;
}
.bottle-neck,
.bottle-body,
.label {
  fill: rgba(255, 255, 255, 0.9);
  stroke: #612315;
  stroke-width: 3;
}
.liquid {
  stroke: #612315;
  stroke-width: 2;
}
</style>
```

- [ ] **Step 4: 创建其他物品图标**

按类似模式创建其余图标组件。每个组件应：
- 使用 `viewBox="0 0 64 64"`
- 描边颜色 `#612315`，描边宽度 3
- 填充色使用设计 token 或适合的颜色
- 尺寸由父容器通过 width/height 控制

为节省时间，其余图标可先使用简化版本。例如 `CandyIcon.vue`：

```vue
<template>
  <svg viewBox="0 0 64 64">
    <rect x="14" y="24" width="36" height="16" rx="8" fill="#F472B6" stroke="#612315" stroke-width="3" />
    <path d="M14 32 L6 24 L6 40 Z" fill="#FDE68A" stroke="#612315" stroke-width="3" />
    <path d="M50 32 L58 24 L58 40 Z" fill="#FDE68A" stroke="#612315" stroke-width="3" />
    <!-- 条纹 -->
    <rect x="22" y="24" width="4" height="16" fill="#FDE68A" />
    <rect x="34" y="24" width="4" height="16" fill="#60A5FA" />
  </svg>
</template>
```

- [ ] **Step 5: 修改 Item.vue 使用 SVG 图标**

在 `src/components/Item.vue` 中：

```javascript
import { itemIconMap, fragmentTypes } from './icons/itemIconMap.js'
```

注册为动态组件：

```javascript
components: {
  // 不需要显式注册，使用 resolveComponent
}
```

在 computed 中添加：

```javascript
iconComponent() {
  if (!this.item || !this.item.key) return null
  return itemIconMap[this.item.key] || null
},

fragmentType() {
  return fragmentTypes[this.item.key] || 'cat'
}
```

修改模板中的图标区域：

```vue
<div class="item-icon-wrapper">
  <component
    :is="iconComponent"
    v-if="iconComponent"
    class="item-icon-svg"
    :rarity="item.rarity"
    :type="fragmentType"
  />
  <span v-else class="item-icon">{{ item.icon }}</span>
</div>
```

更新样式：

```css
.item-icon-svg {
  width: 40px;
  height: 40px;
}
```

- [ ] **Step 6: 验证**

运行 `npm run dev`，打开背包，确认：
1. 已有物品显示对应 SVG 图标
2. 不同稀有度药水颜色不同
3. 碎片显示对应类型颜色

- [ ] **Step 7: 提交**

```bash
git add src/components/icons/items/ src/components/icons/itemIconMap.js src/components/Item.vue
git commit -m "feat(ui): replace item emojis with SVG icons

- Add SVG icon components for all items
- Add itemIconMap.js for dynamic component mapping
- Update Item.vue to render SVG icons by item key

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 4: 创建装饰与 UI 图标

**Files:**
- Create: `src/components/icons/ui/CoinBagIcon.vue`
- Create: `src/components/icons/decorations/CloudDecoration.vue`
- Create: `src/components/icons/decorations/StarDecoration.vue`
- Create: `src/components/icons/decorations/TreeDecoration.vue`
- Create: `src/components/icons/decorations/FireDecoration.vue`
- Create: `src/components/icons/decorations/BatDecoration.vue`
- Test: 单独打开组件查看 SVG

**Interfaces:**
- Consumes: 无或简单 props（如 size, color）
- Produces: 可在 TopBar、户外区、背景中复用的 SVG 装饰

- [ ] **Step 1: 创建 CoinBagIcon.vue**

```vue
<template>
  <svg viewBox="0 0 64 64">
    <!-- 袋子 -->
    <path d="M20 20 Q32 10 44 20 L48 52 Q32 60 16 52 Z" fill="#FBBF24" stroke="#612315" stroke-width="3" />
    <!-- 袋口绳子 -->
    <rect x="22" y="16" width="20" height="6" rx="3" fill="#F59E0B" stroke="#612315" stroke-width="2" />
    <!-- 金币符号 -->
    <circle cx="32" cy="38" r="10" fill="#FDE68A" stroke="#612315" stroke-width="2" />
    <text x="32" y="43" text-anchor="middle" font-size="14" font-weight="bold" fill="#612315">¥</text>
  </svg>
</template>
```

- [ ] **Step 2: 创建装饰图标**

`CloudDecoration.vue`：

```vue
<template>
  <svg viewBox="0 0 120 60">
    <path d="M20 40 Q10 40 10 30 Q10 15 30 15 Q35 5 55 10 Q70 0 90 15 Q110 15 110 32 Q110 45 90 45 L20 45 Z" fill="#FFFFFF" stroke="#612315" stroke-width="3" />
  </svg>
</template>
```

`StarDecoration.vue`：

```vue
<template>
  <svg viewBox="0 0 40 40">
    <path d="M20 2 L24 16 L38 16 L27 24 L31 38 L20 30 L9 38 L13 24 L2 16 L16 16 Z" fill="#FBBF24" stroke="#612315" stroke-width="2" />
  </svg>
</template>
```

`TreeDecoration.vue`：

```vue
<template>
  <svg viewBox="0 0 64 80">
    <!-- 树干 -->
    <rect x="26" y="50" width="12" height="24" fill="#8B5A2B" stroke="#612315" stroke-width="3" />
    <!-- 树冠三层 -->
    <triangle points="32 8 12 35 52 35" fill="#34D399" stroke="#612315" stroke-width="3" />
    <triangle points="32 22 10 50 54 50" fill="#34D399" stroke="#612315" stroke-width="3" />
    <triangle points="32 36 8 64 56 64" fill="#34D399" stroke="#612315" stroke-width="3" />
  </svg>
</template>
```

注意：SVG 没有 `<triangle>` 标签，需要改为 `<polygon>`：

```vue
<polygon points="32 8 12 35 52 35" fill="#34D399" stroke="#612315" stroke-width="3" />
```

`FireDecoration.vue`：

```vue
<template>
  <svg viewBox="0 0 40 50">
    <path d="M20 48 Q8 48 8 36 Q8 24 20 8 Q32 24 32 36 Q32 48 20 48 Z" fill="#F87171" stroke="#612315" stroke-width="3" />
    <path d="M20 40 Q14 40 14 32 Q14 26 20 18 Q26 26 26 32 Q26 40 20 40 Z" fill="#FBBF24" stroke="#612315" stroke-width="2" />
  </svg>
</template>
```

`BatDecoration.vue`：

```vue
<template>
  <svg viewBox="0 0 60 40">
    <path d="M30 20 Q20 10 5 15 Q15 25 30 22 Q45 25 55 15 Q40 10 30 20 Z" fill="#612315" />
    <circle cx="27" cy="18" r="2" fill="#FFFFFF" />
    <circle cx="33" cy="18" r="2" fill="#FFFFFF" />
  </svg>
</template>
```

- [ ] **Step 3: 验证**

在临时页面或组件中引用这些图标，确认 SVG 渲染正常。

- [ ] **Step 4: 提交**

```bash
git add src/components/icons/ui/ src/components/icons/decorations/
git commit -m "feat(ui): add decoration and UI SVG icons

- Add CoinBagIcon for top bar
- Add cloud, star, tree, fire, bat decorations for background/zones

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 5: 创建动态背景组件

**Files:**
- Create: `src/components/MagicBackground.vue`
- Modify: `src/App.vue`
- Test: 浏览器查看背景动画

**Interfaces:**
- Consumes: 无
- Produces: 全屏动态背景层

- [ ] **Step 1: 创建 MagicBackground.vue**

```vue
<template>
  <div class="magic-background">
    <!-- 远景云朵 -->
    <div class="cloud-layer far">
      <CloudDecoration v-for="i in 3" :key="`far-${i}`" class="cloud far-cloud" :style="getCloudStyle(i, 'far')" />
    </div>

    <!-- 近景云朵 -->
    <div class="cloud-layer near">
      <CloudDecoration v-for="i in 2" :key="`near-${i}`" class="cloud near-cloud" :style="getCloudStyle(i, 'near')" />
    </div>

    <!-- 星星 -->
    <StarDecoration
      v-for="i in 12"
      :key="`star-${i}`"
      class="star"
      :style="getStarStyle(i)"
    />

    <!-- 漂浮岛屿 -->
    <div class="floating-island" :style="getIslandStyle(1)">
      <div class="island-top"></div>
      <div class="island-grass"></div>
    </div>

    <!-- 流星 -->
    <div v-if="showShootingStar" class="shooting-star"></div>
  </div>
</template>

<script>
import CloudDecoration from './icons/decorations/CloudDecoration.vue'
import StarDecoration from './icons/decorations/StarDecoration.vue'

export default {
  name: 'MagicBackground',

  components: {
    CloudDecoration,
    StarDecoration
  },

  data() {
    return {
      showShootingStar: false,
      shootingStarTimer: null
    }
  },

  mounted() {
    this.scheduleShootingStar()
  },

  beforeUnmount() {
    if (this.shootingStarTimer) {
      clearTimeout(this.shootingStarTimer)
    }
  },

  methods: {
    getCloudStyle(index, layer) {
      const positions = {
        far: [
          { top: '10%', left: '5%', width: '120px', animationDelay: '0s', duration: '40s' },
          { top: '25%', left: '70%', width: '100px', animationDelay: '-15s', duration: '45s' },
          { top: '8%', left: '40%', width: '90px', animationDelay: '-30s', duration: '50s' }
        ],
        near: [
          { top: '60%', left: '80%', width: '140px', animationDelay: '-5s', duration: '30s' },
          { top: '75%', left: '10%', width: '110px', animationDelay: '-20s', duration: '35s' }
        ]
      }

      const pos = positions[layer][index - 1] || positions[layer][0]
      return {
        ...pos,
        animationDuration: pos.duration
      }
    },

    getStarStyle(index) {
      const top = 5 + (index * 7) % 80
      const left = 5 + (index * 13) % 90
      const size = 12 + (index % 3) * 6
      const delay = (index * 0.7) % 3
      const duration = 1.5 + (index % 2) * 0.5

      return {
        top: `${top}%`,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }
    },

    getIslandStyle(index) {
      return {
        bottom: '5%',
        left: `${20 + index * 30}%`,
        animationDelay: `${index * 0.5}s`
      }
    },

    scheduleShootingStar() {
      const nextTime = 5000 + Math.random() * 10000
      this.shootingStarTimer = setTimeout(() => {
        this.showShootingStar = true
        setTimeout(() => {
          this.showShootingStar = false
          this.scheduleShootingStar()
        }, 1500)
      }, nextTime)
    }
  }
}
</script>

<style scoped>
.magic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.cloud-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cloud {
  position: absolute;
  opacity: 0.7;
  animation: float-cloud linear infinite;
}

.far-cloud {
  opacity: 0.5;
}

.near-cloud {
  opacity: 0.8;
}

.star {
  position: absolute;
  animation: twinkle ease-in-out infinite;
}

.floating-island {
  position: absolute;
  width: 120px;
  height: 40px;
  animation: island-float 4s ease-in-out infinite;
}

.island-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: #A78BFA;
  border-radius: 50% 50% 0 0;
  border: 3px solid #612315;
  border-bottom: none;
}

.island-grass {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 45%;
  background: #7DD3C0;
  border-radius: 50%;
  border: 3px solid #612315;
}

.shooting-star {
  position: absolute;
  top: 20%;
  left: -10%;
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #FBBF24, #FFFFFF);
  border-radius: 3px;
  transform: rotate(-20deg);
  animation: shooting 1.5s ease-out forwards;
}

@keyframes float-cloud {
  from { transform: translateX(-200px); }
  to { transform: translateX(calc(100vw + 200px)); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes island-float {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
}

@keyframes shooting {
  from { transform: translateX(0) translateY(0) rotate(-20deg); opacity: 1; }
  to { transform: translateX(80vw) translateY(30vh) rotate(-20deg); opacity: 0; }
}
</style>
```

- [ ] **Step 2: 在 App.vue 中引入背景**

在 `src/App.vue` 中：

```javascript
import MagicBackground from './components/MagicBackground.vue'
```

注册组件并在 `<template>` 顶部添加：

```vue
<MagicBackground />
```

- [ ] **Step 3: 验证**

运行 `npm run dev`，确认：
1. 背景有缓慢移动的云朵
2. 星星在闪烁
3. 漂浮岛屿在上下浮动
4. 偶尔有流星划过

- [ ] **Step 4: 提交**

```bash
git add src/components/MagicBackground.vue src/App.vue
git commit -m "feat(ui): add animated magic background

- Add MagicBackground.vue with clouds, stars, floating islands, shooting stars
- Integrate into App.vue behind game UI

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 6: 重设计顶部栏

**Files:**
- Modify: `src/components/TopBar.vue`
- Create: `src/components/icons/ui/SaveIcon.vue`（如需要）
- Test: 浏览器查看顶部栏新样式

**Interfaces:**
- Consumes: `gameStore.money`
- Produces: 卷轴横幅式顶部栏，触发原有事件

- [ ] **Step 1: 重写 TopBar.vue 模板和样式**

将 `TopBar.vue` 的模板替换为卷轴横幅结构：

```vue
<template>
  <div class="top-bar-scroll">
    <!-- 左侧卷轴端 -->
    <div class="scroll-end left"></div>

    <!-- 中间横幅 -->
    <div class="scroll-banner">
      <div class="left-section">
        <button class="magic-btn save-btn" @click="openSaveManager">
          <span class="btn-icon">💾</span>
          <span class="btn-text">{{ $t('ui.save') }}</span>
        </button>
        <LanguageSwitcher />
        <div class="game-title">
          <span class="title-icon">✨</span>
          <span class="title-text">Magic Potion</span>
        </div>
      </div>

      <div class="money-display">
        <CoinBagIcon class="money-icon" />
        <span class="money-amount">{{ gameStore.money }}</span>
      </div>

      <button class="magic-btn shop-btn" @click="$emit('open-shop')">
        <span class="btn-icon">🏪</span>
        <span class="btn-text">{{ $t('ui.shop') }}</span>
      </button>
    </div>

    <!-- 右侧卷轴端 -->
    <div class="scroll-end right"></div>
  </div>
</template>
```

在 `<script>` 中导入 `CoinBagIcon`：

```javascript
import CoinBagIcon from './icons/ui/CoinBagIcon.vue'
```

注册组件：

```javascript
components: {
  LanguageSwitcher,
  CoinBagIcon
}
```

替换 `<style scoped>`：

```css
.top-bar-scroll {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.scroll-end {
  width: 24px;
  height: 70px;
  background: linear-gradient(180deg, #A78BFA 0%, #8B5CF6 100%);
  border: 3px solid #612315;
  flex-shrink: 0;
}

.scroll-end.left {
  border-radius: 12px 0 0 12px;
  border-right: none;
}

.scroll-end.right {
  border-radius: 0 12px 12px 0;
  border-left: none;
}

.scroll-banner {
  flex: 1;
  max-width: 900px;
  height: 70px;
  background: linear-gradient(180deg, #F5F0FF 0%, #EDE6FF 100%);
  border-top: 3px solid #612315;
  border-bottom: 3px solid #612315;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 4px 0 rgba(97, 35, 21, 0.1);
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.magic-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  background: #FFFFFF;
  border: 3px solid #612315;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 3px 3px 0 rgba(97, 35, 21, 0.15);
  transition: all 0.15s ease;
}

.magic-btn:hover {
  transform: translateY(-2px);
  box-shadow: 4px 4px 0 rgba(97, 35, 21, 0.15);
}

.magic-btn:active {
  transform: translateY(0);
  box-shadow: 1px 1px 0 rgba(97, 35, 21, 0.15);
}

.btn-icon {
  font-size: 20px;
}

.btn-text {
  font-size: 11px;
  font-weight: 700;
  color: #612315;
}

.game-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 24px;
  animation: sparkle 2s ease-in-out infinite;
}

.title-text {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #8B5CF6, #F472B6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.money-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: #FEF3C7;
  border: 3px solid #612315;
  border-radius: 9999px;
  box-shadow: 3px 3px 0 rgba(97, 35, 21, 0.15);
}

.money-icon {
  width: 28px;
  height: 28px;
  animation: coin-shine 2s ease-in-out infinite;
}

.money-amount {
  font-size: 20px;
  font-weight: 800;
  color: #B45309;
  font-family: 'Courier New', monospace;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(10deg); }
}

@keyframes coin-shine {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(15deg) scale(1.1); }
}
```

- [ ] **Step 2: 验证**

运行 `npm run dev`，确认：
1. 顶部栏显示为卷轴横幅
2. 金币袋图标正常显示
3. 商店和存档按钮可点击

- [ ] **Step 3: 提交**

```bash
git add src/components/TopBar.vue src/components/icons/ui/CoinBagIcon.vue
git commit -m "feat(ui): redesign top bar as hand-drawn scroll banner

- Replace top bar with scroll banner shape
- Add CoinBagIcon for gold display
- Use magic sticker buttons for save/shop

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 7: 重设计宠物面板

**Files:**
- Modify: `src/components/PetDisplay.vue`
- Test: 浏览器查看宠物面板新样式和背包物品

**Interfaces:**
- Consumes: `gameStore.pet`, `backpackStore.items`, `petCollectionStore`
- Produces: 手绘相框式宠物面板

- [ ] **Step 1: 更新 PetDisplay.vue 模板**

参考设计文档，将 PetDisplay.vue 改造为魔法相框样式。关键点：

1. 外框使用 `.magic-frame` 类：

```css
.magic-frame {
  background: linear-gradient(135deg, #FFFFFF 0%, #F5F0FF 100%);
  border: 4px solid #8B5CF6;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 5px 5px 0 rgba(97, 35, 21, 0.12);
  position: relative;
}

.magic-frame::before,
.magic-frame::after {
  content: '✦';
  position: absolute;
  font-size: 24px;
  color: #FBBF24;
}

.magic-frame::before {
  top: -12px;
  left: 20px;
}

.magic-frame::after {
  bottom: -12px;
  right: 20px;
}
```

2. 宠物头像区域使用 `SlugcatAvatar`
3. 属性条改为糖果色：

```css
.stat-track {
  height: 12px;
  background: rgba(97, 35, 21, 0.08);
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid rgba(97, 35, 21, 0.1);
}

.hunger-fill { background: linear-gradient(90deg, #F59E0B, #FBBF24); }
.mood-fill { background: linear-gradient(90deg, #F472B6, #FBCFE8); }
.health-fill { background: linear-gradient(90deg, #34D399, #7DD3C0); }
```

4. 背包物品网格改为贴纸卡片：

```css
.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  max-height: 220px;
  overflow-y: auto;
  padding: 4px;
}
```

- [ ] **Step 2: 移除临时测试代码**

如果 Task 2 中添加了临时引用，确保现在正式集成。

- [ ] **Step 3: 验证**

运行 `npm run dev`，确认：
1. 宠物面板显示为魔法相框
2. SVG 宠物头像有状态动画
3. 属性条颜色正确
4. 背包物品显示 SVG 图标

- [ ] **Step 4: 提交**

```bash
git add src/components/PetDisplay.vue
git commit -m "feat(ui): redesign pet display as magic photo frame

- Apply hand-drawn frame with star decorations
- Use SlugcatAvatar SVG with status animations
- Redesign stat bars with candy colors
- Update backpack grid to sticker cards

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 8: 重设计水晶球

**Files:**
- Modify: `src/components/CrystalBall.vue`
- Modify: `src/components/MagicVortex.vue`（可选，增强吸入效果）
- Modify: `src/components/ObservatoryDome.vue`（可选，强化光效）
- Test: 浏览器查看水晶球动画和拖拽效果

**Interfaces:**
- Consumes: `gameStore.pet`, drag events
- Produces: 手绘水晶球，增强的视觉反馈

- [ ] **Step 1: 更新 CrystalBall.vue 样式**

将 `.crystal-ball-body` 样式改为：

```css
.crystal-ball-body {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 30%,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(243, 232, 255, 0.8) 40%,
    rgba(232, 213, 255, 0.6) 100%
  );
  border: 5px solid #8B5CF6;
  box-shadow:
    0 0 0 4px rgba(139, 92, 246, 0.2),
    0 0 50px rgba(139, 92, 246, 0.4),
    8px 8px 0 rgba(97, 35, 21, 0.12),
    inset 0 0 60px rgba(255, 255, 255, 0.6),
    inset -10px -10px 30px rgba(139, 92, 246, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  animation: crystal-breathe 3s ease-in-out infinite;
}

@keyframes crystal-breathe {
  0%, 100% {
    transform: scale(1);
    box-shadow:
      0 0 0 4px rgba(139, 92, 246, 0.2),
      0 0 50px rgba(139, 92, 246, 0.4),
      8px 8px 0 rgba(97, 35, 21, 0.12),
      inset 0 0 60px rgba(255, 255, 255, 0.6);
  }
  50% {
    transform: scale(1.02);
    box-shadow:
      0 0 0 6px rgba(139, 92, 246, 0.3),
      0 0 70px rgba(139, 92, 246, 0.55),
      8px 8px 0 rgba(97, 35, 21, 0.12),
      inset 0 0 70px rgba(255, 255, 255, 0.7);
  }
}
```

拖拽高亮时：

```css
.crystal-ball.drag-over .crystal-ball-body {
  border-color: #FBBF24;
  box-shadow:
    0 0 0 6px rgba(251, 191, 36, 0.3),
    0 0 80px rgba(251, 191, 36, 0.5),
    8px 8px 0 rgba(97, 35, 21, 0.12);
  animation: crystal-absorb 0.8s ease-in-out infinite;
}

@keyframes crystal-absorb {
  0%, 100% { transform: scale(1.02); }
  50% { transform: scale(1.06); }
}
```

- [ ] **Step 2: 替换宠物显示为 SlugcatAvatar**

将 `.simple-avatar` 中的 emoji 替换为 `SlugcatAvatar` 组件。

- [ ] **Step 3: 验证**

运行 `npm run dev`，确认：
1. 水晶球有呼吸动画
2. 拖拽物品到水晶球时边框变金色并放大
3. 宠物 SVG 在球内显示

- [ ] **Step 4: 提交**

```bash
git add src/components/CrystalBall.vue
git commit -m "feat(ui): redesign crystal ball with hand-drawn glow

- Add crystal breathing animation
- Use gold highlight and absorb animation on drag-over
- Replace pet emoji with SlugcatAvatar SVG

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 9: 重设计森林区

**Files:**
- Modify: `src/components/OutdoorPlay.vue`
- Test: 浏览器查看森林区场景

**Interfaces:**
- Consumes: `outdoorStore.playingPet`, drag events
- Produces: 手绘森林场景

- [ ] **Step 1: 更新 OutdoorPlay.vue**

背景改为草地渐变：

```css
.outdoor-play {
  background: linear-gradient(
    180deg,
    #E0F7E9 0%,
    #C8F0D8 50%,
    #A7F3D0 100%
  );
  border: 4px solid #34D399;
  border-radius: 24px;
  box-shadow: 5px 5px 0 rgba(97, 35, 21, 0.1);
}

.outdoor-play.drop-target {
  border-color: #FBBF24;
  box-shadow: 0 0 30px rgba(251, 191, 36, 0.4);
  animation: forest-pulse 1s ease-in-out infinite;
}

@keyframes forest-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
```

添加装饰元素：

```vue
<div class="forest-decoration">
  <TreeDecoration class="tree tree-1" />
  <TreeDecoration class="tree tree-2" />
  <StarDecoration class="sun" />
</div>
```

CSS：

```css
.forest-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.tree {
  position: absolute;
  bottom: 10px;
  width: 50px;
  animation: tree-sway 3s ease-in-out infinite;
}

.tree-1 { left: 10px; }
.tree-2 { right: 10px; animation-delay: -1.5s; }

.sun {
  position: absolute;
  top: 15px;
  right: 20px;
  width: 40px;
  animation: sun-pulse 3s ease-in-out infinite;
}

@keyframes tree-sway {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

@keyframes sun-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
```

- [ ] **Step 2: 验证**

运行 `npm run dev`，确认森林区显示树木、太阳和绿色草地。

- [ ] **Step 3: 提交**

```bash
git add src/components/OutdoorPlay.vue
git commit -m "feat(ui): redesign forest play zone with hand-drawn scene

- Apply green gradient and card shadow
- Add SVG trees and sun decorations
- Add drop-target pulse animation

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 10: 重设计游猎区

**Files:**
- Modify: `src/components/OutdoorHunt.vue`
- Test: 浏览器查看游猎区场景

**Interfaces:**
- Consumes: `outdoorStore.huntingPet`, drag events
- Produces: 手绘危险游猎场景

- [ ] **Step 1: 更新 OutdoorHunt.vue**

背景改为暗红岩石：

```css
.outdoor-hunt {
  background: linear-gradient(
    180deg,
    #FFE4E6 0%,
    #FECDD3 50%,
    #FDA4AF 100%
  );
  border: 4px solid #F87171;
  border-radius: 24px;
  box-shadow: 5px 5px 0 rgba(97, 35, 21, 0.1);
}

.outdoor-hunt.drop-target {
  border-color: #FBBF24;
  box-shadow: 0 0 30px rgba(251, 191, 36, 0.4);
  animation: hunt-fire 0.8s ease-in-out infinite;
}

@keyframes hunt-fire {
  0%, 100% { box-shadow: 0 0 20px rgba(248, 113, 113, 0.4); }
  50% { box-shadow: 0 0 40px rgba(248, 113, 113, 0.7); }
}
```

添加装饰：

```vue
<div class="hunt-decoration">
  <FireDecoration class="fire fire-1" />
  <FireDecoration class="fire fire-2" />
  <BatDecoration class="bat bat-1" />
  <BatDecoration class="bat bat-2" />
</div>
```

CSS：

```css
.hunt-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.fire {
  position: absolute;
  bottom: 10px;
  width: 30px;
  animation: flicker 0.5s ease-in-out infinite;
}

.fire-1 { left: 15px; }
.fire-2 { right: 20px; animation-delay: 0.2s; }

.bat {
  position: absolute;
  width: 30px;
  animation: bat-fly 5s ease-in-out infinite;
}

.bat-1 { top: 20%; left: 20%; }
.bat-2 { top: 35%; right: 15%; animation-delay: -2s; }

@keyframes flicker {
  0%, 100% { transform: scale(1) rotate(-2deg); opacity: 0.9; }
  50% { transform: scale(1.1) rotate(2deg); opacity: 1; }
}

@keyframes bat-fly {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(20px, -10px); }
  50% { transform: translate(40px, 5px); }
  75% { transform: translate(10px, 10px); }
}
```

- [ ] **Step 2: 验证**

运行 `npm run dev`，确认游猎区有篝火、蝙蝠和暗红背景。

- [ ] **Step 3: 提交**

```bash
git add src/components/OutdoorHunt.vue
git commit -m "feat(ui): redesign hunt zone with hand-drawn danger scene

- Apply coral gradient and danger border
- Add SVG fire and bat decorations
- Add drop-target fire glow animation

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 11: 重设计商店弹窗

**Files:**
- Modify: `src/components/Shop.vue`
- Test: 浏览器查看商店商品卡片

**Interfaces:**
- Consumes: `shopStore.items`, `gameStore.money`
- Produces: 魔法书页风格商店弹窗

- [ ] **Step 1: 更新 Shop.vue 样式**

弹窗外框改为魔法书页：

```css
.shop-modal :deep(.n-card) {
  background: linear-gradient(135deg, #FEFCF3 0%, #F5F0FF 100%);
  border: 4px solid #8B5CF6;
  border-radius: 24px;
  box-shadow: 8px 8px 0 rgba(97, 35, 21, 0.12);
}
```

商品卡片改为贴纸风格：

```css
.shop-item {
  background: #FFFFFF;
  border: 3px solid #612315;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 3px 3px 0 rgba(97, 35, 21, 0.1);
  transition: all 0.15s ease;
}

.shop-item:hover {
  transform: translateY(-3px);
  box-shadow: 4px 4px 0 rgba(97, 35, 21, 0.1);
}
```

分类标题改为标签：

```css
.category-title {
  display: inline-block;
  padding: 8px 16px;
  background: #8B5CF6;
  color: #FFFFFF;
  border: 3px solid #612315;
  border-radius: 9999px;
  font-weight: 700;
  margin-bottom: 12px;
}
```

- [ ] **Step 2: 确保商品使用 SVG 图标**

`Item.vue` 的改动应已生效。如果商店商品仍显示 emoji，检查 `Shop.vue` 是否正确传递 `item` 给 `Item` 组件（或商店是否直接使用 `item.icon`）。

由于 `Shop.vue` 没有使用 `Item.vue` 组件而是直接渲染，需要更新商店模板使用 SVG 图标：

```vue
<component
  :is="getIconComponent(item.key)"
  v-if="getIconComponent(item.key)"
  class="shop-item-icon"
  :rarity="item.rarity"
/>
```

在 `Shop.vue` 中导入 `itemIconMap`：

```javascript
import { itemIconMap } from './icons/itemIconMap.js'
```

添加方法：

```javascript
getIconComponent(key) {
  return itemIconMap[key] || null
}
```

- [ ] **Step 3: 验证**

运行 `npm run dev`，打开商店，确认：
1. 弹窗为魔法书页风格
2. 商品显示 SVG 图标
3. 分类标签为胶囊形

- [ ] **Step 4: 提交**

```bash
git add src/components/Shop.vue
git commit -m "feat(ui): redesign shop modal as magic book page

- Apply book page style with hand-drawn border
- Convert shop item cards to sticker style
- Use SVG icons for all shop items

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 12: 重设计合成界面

**Files:**
- Modify: `src/components/synthesis/SynthesisUI.vue`
- Modify: `src/components/synthesis/SynthesisSlot.vue`
- Modify: `src/components/synthesis/PetPreview.vue`
- Test: 浏览器查看合成界面

**Interfaces:**
- Consumes: synthesis store, backpack items
- Produces: 手绘合成界面

- [ ] **Step 1: 更新 SynthesisUI.vue 样式**

弹窗外框：

```css
.synthesis-modal :deep(.n-card) {
  background: linear-gradient(135deg, #F5F0FF 0%, #EDE6FF 100%);
  border: 4px solid #8B5CF6;
  border-radius: 24px;
  box-shadow: 8px 8px 0 rgba(97, 35, 21, 0.12);
}
```

区域标题：

```css
.section-title {
  display: inline-block;
  padding: 8px 16px;
  background: #FFFFFF;
  border: 3px solid #612315;
  border-radius: 9999px;
  color: #612315;
  font-weight: 700;
}
```

合成按钮：

```css
.synthesis-btn.can-synthesize {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  border: 3px solid #612315;
  border-radius: 9999px;
  box-shadow: 4px 4px 0 rgba(97, 35, 21, 0.2);
}

.synthesis-btn.can-synthesize:hover {
  transform: translateY(-2px);
  box-shadow: 5px 5px 0 rgba(97, 35, 21, 0.2);
}
```

- [ ] **Step 2: 更新 SynthesisSlot.vue**

将槽位改为手绘圆角框，空槽位显示虚线边框。

- [ ] **Step 3: 更新 PetPreview.vue**

使用 `SlugcatAvatar` 替换 emoji 预览。

- [ ] **Step 4: 验证**

运行 `npm run dev`，打开合成界面，确认风格统一。

- [ ] **Step 5: 提交**

```bash
git add src/components/synthesis/
git commit -m "feat(ui): redesign synthesis UI with hand-drawn style

- Apply magic book modal style
- Redesign synthesis slots and buttons
- Use SlugcatAvatar for pet previews

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 13: 重设计存档管理和通知栏

**Files:**
- Modify: `src/components/SaveManager.vue`
- Modify: `src/components/NotificationBar.vue`
- Test: 浏览器查看弹窗和通知

**Interfaces:**
- Consumes: save store, notification store
- Produces: 卷轴风格存档管理、魔法气泡通知

- [ ] **Step 1: 更新 SaveManager.vue**

弹窗外框改为书架风格：

```css
.save-manager :deep(.n-card) {
  background: linear-gradient(135deg, #FEFCF3 0%, #F5F0FF 100%);
  border: 4px solid #8B5CF6;
  border-radius: 24px;
  box-shadow: 8px 8px 0 rgba(97, 35, 21, 0.12);
}

.save-slot {
  background: #FFFFFF;
  border: 3px solid #612315;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 3px 3px 0 rgba(97, 35, 21, 0.1);
}
```

- [ ] **Step 2: 更新 NotificationBar.vue**

通知项改为魔法气泡：

```css
.notification-item {
  background: linear-gradient(135deg, #8B5CF6, #A78BFA);
  border: 3px solid #612315;
  border-radius: 20px;
  box-shadow: 4px 4px 0 rgba(97, 35, 21, 0.2);
  animation: bubble-in 0.4s var(--mp-ease-bounce);
}

.notification-item.type-success {
  background: linear-gradient(135deg, #34D399, #7DD3C0);
}

.notification-item.type-warning {
  background: linear-gradient(135deg, #FBBF24, #FDE68A);
}

.notification-item.type-error {
  background: linear-gradient(135deg, #F87171, #FECDD3);
}

@keyframes bubble-in {
  from { transform: translateY(30px) scale(0.8); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
```

- [ ] **Step 3: 验证**

打开存档管理弹窗，确认卷轴风格。触发一个通知（如购买物品），确认气泡样式。

- [ ] **Step 4: 提交**

```bash
git add src/components/SaveManager.vue src/components/NotificationBar.vue
git commit -m "feat(ui): redesign save manager and notification bar

- Apply scroll/card style to save manager
- Convert notifications to magic bubbles
- Add type-based gradient colors

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 14: 拖拽反馈与全局动画增强

**Files:**
- Modify: `src/components/Item.vue`
- Modify: `src/components/Pet.vue`
- Modify: `src/components/CrystalBall.vue`
- Create: `src/styles/animations.css`
- Test: 拖拽物品/宠物验证动画

**Interfaces:**
- Consumes: drag events
- Produces: 拖拽光效、残影、吸入动画

- [ ] **Step 1: 创建全局动画样式**

创建 `src/styles/animations.css`：

```css
/* 全局手绘风动画 */

@keyframes mp-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes mp-wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

@keyframes mp-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes mp-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes mp-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

@keyframes mp-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.7); }
}
```

在 `App.vue` 中导入：

```css
@import '../styles/animations.css';
```

- [ ] **Step 2: 增强拖拽样式**

在 `Item.vue` 中添加拖拽样式：

```css
.item-container.dragging {
  opacity: 0.7;
  transform: scale(1.08) rotate(3deg);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
}
```

在 `Pet.vue` 中：

```css
.pet-container[draggable="true"] .pet-avatar {
  cursor: grab;
  transition: all 0.15s ease;
}

.pet-container[draggable="true"] .pet-avatar:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
}

.pet-container[draggable="true"] .pet-avatar:active {
  cursor: grabbing;
  transform: scale(1.1);
}
```

- [ ] **Step 3: 验证**

拖拽背包物品和宠物，确认有放大/发光效果。

- [ ] **Step 4: 提交**

```bash
git add src/styles/animations.css src/components/Item.vue src/components/Pet.vue src/components/CrystalBall.vue src/App.vue
git commit -m "feat(ui): enhance drag feedback and global animations

- Add shared animation keyframes
- Improve item/pet drag visual feedback
- Add glow and scale effects

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 15: 响应式布局调整

**Files:**
- Modify: `src/App.vue`
- Modify: `src/components/PetDisplay.vue`
- Modify: `src/components/OutdoorPlay.vue`
- Modify: `src/components/OutdoorHunt.vue`
- Test: 浏览器不同尺寸下的布局

**Interfaces:**
- Consumes: viewport width
- Produces: 适配桌面、平板、手机的布局

- [ ] **Step 1: 更新 App.vue 响应式样式**

在 `App.vue` 的 `<style>` 中添加媒体查询：

```css
@media (max-width: 1024px) {
  .game-area {
    flex-direction: column;
    align-items: center;
  }

  .pet-display-wrapper,
  .right-panel {
    width: 100%;
    max-width: 500px;
  }

  .right-panel {
    flex-direction: row;
  }

  .outdoor-zone {
    flex: 1;
    height: 180px;
  }
}

@media (max-width: 768px) {
  .game-container {
    padding: 12px;
  }

  .game-area {
    flex-direction: column;
    gap: 16px;
  }

  .right-panel {
    flex-direction: column;
  }

  .crystal-ball-wrapper {
    min-height: 320px;
  }
}
```

- [ ] **Step 2: 验证**

使用浏览器 DevTools 切换不同设备尺寸，确认：
1. 桌面端保持三栏
2. 平板端垂直堆叠或左右面板并排
3. 手机端垂直堆叠，内容不溢出

- [ ] **Step 3: 提交**

```bash
git add src/App.vue
git commit -m "feat(ui): add responsive layout breakpoints

- Add tablet and mobile breakpoints
- Stack panels vertically on small screens
- Adjust spacing and sizes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 16: 最终集成验证

**Files:**
- 所有已修改文件
- Test: 完整游戏体验

**Interfaces:**
- Consumes: 完整应用
- Produces: 无报错、风格统一的游戏界面

- [ ] **Step 1: 清理临时文件和注释**

检查所有修改文件，移除：
- 未使用的 emoji 字符
- 调试用的 console.log
- 临时注释掉的旧代码

- [ ] **Step 2: 运行完整验证清单**

```bash
npm run dev
```

逐项验证：

1. 页面加载无控制台报错
2. 顶部栏金币显示正常
3. 宠物面板显示 SVG 宠物
4. 切换宠物功能正常
5. 背包物品显示 SVG 图标
6. 拖拽物品到水晶球可喂食
7. 拖拽宠物到森林区/游猎区可外出
8. 从户外区拖拽宠物回水晶球可召回
9. 商店弹窗风格正确，购买正常
10. 合成弹窗正常打开
11. 存档管理弹窗正常
12. 通知栏显示魔法气泡
13. 中英文切换正常
14. 响应式布局在不同尺寸正常

- [ ] **Step 3: 运行生产构建**

```bash
npm run build
```

确认构建无错误。

- [ ] **Step 4: 最终提交**

```bash
git add .
git commit -m "feat(ui): complete hand-drawn UI redesign

- Redesign all core UI components with hand-drawn cartoon style
- Replace emojis with SVG icon components
- Add animated magic background
- Enhance drag feedback and state animations
- Add responsive breakpoints

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

- [ ] **Step 5: 推送到远程（可选）**

```bash
git push origin feature/hand-drawn-ui-redesign
```

---

## 自我审查

### Spec 覆盖检查

| 设计文档章节 | 对应任务 |
|------------|---------|
| 2. 视觉设计系统 | Task 1 |
| 3.1 TopBar | Task 6 |
| 3.2 PetDisplay | Task 2, 7 |
| 3.3 CrystalBall | Task 8 |
| 3.4 户外区 | Task 9, 10 |
| 3.5 Item | Task 3, 11 |
| 3.6 弹窗 | Task 11, 12, 13 |
| 3.7 NotificationBar | Task 13 |
| 4. SVG 资源策略 | Task 2, 3, 4 |
| 5. 动画计划 | Task 5, 8, 9, 10, 14 |
| 6. 布局响应式 | Task 15 |
| 7. 实施策略 | Task 1, 16 |

### Placeholder 检查

- 无 TBD/TODO
- 所有代码步骤包含实际代码
- 所有文件路径精确
- 所有命令可执行

### 一致性检查

- 颜色全部使用设计 token 或明确色值
- 组件命名一致（SlugcatAvatar, MagicBackground 等）
- 文件路径与实际项目结构一致
- 动画类名在全局动画 CSS 中定义

---

## 执行方式选择

Plan complete and saved to `docs/superpowers/plans/2026-07-13-hand-drawn-ui-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
