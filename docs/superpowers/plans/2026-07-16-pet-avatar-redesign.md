# Pet Avatar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mixed emoji/SVG pet avatars with a single `PetAvatar.vue` SVG component that renders four visually distinct cute pets and eight status expressions/animations.

**Architecture:** Create one Vue component `src/components/icons/PetAvatar.vue` that receives `type` and `status` props. The component renders a type-specific body/features SVG group and a status-specific face group. Existing consumers (`Pet.vue`, `PetDisplay.vue`, `PetPreview.vue`) swap `SlugcatAvatar`/`emoji` for `PetAvatar`. Configuration removes emoji fields and fixes the slugcat description. `SlugcatAvatar.vue` is deleted after all references are migrated.

**Tech Stack:** Vue 3 (Options API), Vite, Pinia, CSS variables from `src/styles/design-tokens.css`.

## Global Constraints

- All components use Vue 3 **Options API** with `data` / `computed` / `methods` / `style scoped`.
- All user-facing text is in **Chinese**.
- Pet type identifiers are: `cat`, `bird`, `fox`, `dragon`.
- Pet status identifiers are: `idle`, `happy`, `sleeping`, `sad`, `tired`, `hunting`, `playing`, `eating`, plus legacy `dead`.
- CSS color tokens are defined in `src/styles/design-tokens.css`.
- Existing drag-and-drop, state stores, and i18n files are **not modified**.
- Every task ends with `npm run build` to prove there are no import/syntax errors.

---

## Task 1: Create the new `PetAvatar.vue` component

**Files:**
- Create: `src/components/icons/PetAvatar.vue`

**Interfaces:**
- Consumes: props `type`, `status`, `size`.
- Produces: a self-contained SVG avatar. External consumers only need `<PetAvatar :type="..." :status="..." :size="..." />`.

- [ ] **Step 1: Write `src/components/icons/PetAvatar.vue`**

```vue
<template>
  <div
    class="pet-avatar"
    :class="[statusClass, typeClass]"
    :style="containerStyle"
  >
    <svg
      class="pet-svg"
      viewBox="0 0 120 120"
      role="img"
      :aria-label="ariaLabel"
    >
      <!-- ==================== 身体 + 类型特征 ==================== -->
      <g class="body-features">
        <!-- 小紫 · 蛞蝓猫 -->
        <g v-if="type === 'cat'">
          <ellipse cx="60" cy="75" rx="46" ry="36" class="body-cat" />
          <path d="M28 52 Q24 24 42 42" class="feature-cat" />
          <path d="M92 52 Q96 24 78 42" class="feature-cat" />
          <path d="M102 78 Q118 72 112 88 Q108 96 100 88" class="feature-cat" />
        </g>

        <!-- 青鸟 · 风羽鸟 -->
        <g v-else-if="type === 'bird'">
          <ellipse cx="60" cy="74" rx="40" ry="34" class="body-bird" />
          <path d="M24 68 Q12 48 32 58 Q36 64 28 70" class="feature-bird-wing" />
          <path d="M96 68 Q108 48 88 58 Q84 64 92 70" class="feature-bird-wing" />
          <path d="M50 42 Q52 28 58 40" class="feature-bird" />
          <path d="M60 40 Q62 22 68 40" class="feature-bird" />
          <path d="M70 42 Q72 28 78 44" class="feature-bird" />
        </g>

        <!-- 赤狐 · 焰尾狐 -->
        <g v-else-if="type === 'fox'">
          <ellipse cx="60" cy="74" rx="42" ry="36" class="body-fox" />
          <path d="M28 52 Q22 22 44 42" class="feature-fox" />
          <path d="M92 52 Q98 22 76 42" class="feature-fox" />
          <path d="M30 44 L26 32 L38 40 Z" class="feature-fox-inner" />
          <path d="M90 44 L94 32 L82 40 Z" class="feature-fox-inner" />
          <path
            d="M98 78 Q116 68 110 52 Q118 58 112 72 Q122 78 108 90 Q100 94 98 78"
            class="feature-fox-tail"
          />
        </g>

        <!-- 晶晶 · 晶石龙 -->
        <g v-else-if="type === 'dragon'">
          <ellipse cx="60" cy="74" rx="44" ry="38" class="body-dragon" />
          <path d="M36 48 Q32 22 44 42" class="feature-dragon-horn" />
          <path d="M84 48 Q88 22 76 42" class="feature-dragon-horn" />
          <path d="M20 70 Q8 50 28 60 Q32 66 24 72" class="feature-dragon-wing" />
          <path d="M100 70 Q112 50 92 60 Q88 66 96 72" class="feature-dragon-wing" />
          <path d="M40 42 L48 30 L56 42" class="feature-dragon-crystal" />
          <path d="M54 38 L60 26 L66 38" class="feature-dragon-crystal" />
          <path d="M64 42 L72 30 L80 42" class="feature-dragon-crystal" />
        </g>

        <!-- 安全兜底：未知类型按猫渲染 -->
        <g v-else>
          <ellipse cx="60" cy="75" rx="46" ry="36" class="body-cat" />
          <path d="M28 52 Q24 24 42 42" class="feature-cat" />
          <path d="M92 52 Q96 24 78 42" class="feature-cat" />
        </g>
      </g>

      <!-- ==================== 通用五官 ==================== -->
      <g class="face">
        <!-- 眼睛：开心 / 睡觉 / 进食（享受眯眼） -->
        <g v-if="['happy', 'sleeping', 'eating'].includes(status)">
          <path d="M38 64 Q44 69 50 64" class="face-stroke" />
          <path d="M62 64 Q68 69 74 64" class="face-stroke" />
        </g>

        <!-- 眼睛：难过 -->
        <g v-else-if="status === 'sad'">
          <circle cx="44" cy="64" r="5" class="face-fill" />
          <circle cx="76" cy="64" r="5" class="face-fill" />
          <circle cx="46" cy="62" r="1.5" fill="white" />
          <circle cx="78" cy="62" r="1.5" fill="white" />
          <path d="M40 74 Q44 80 48 74" class="tear" />
          <path d="M72 74 Q76 80 80 74" class="tear" />
        </g>

        <!-- 眼睛：疲惫（半睁） -->
        <g v-else-if="status === 'tired'">
          <circle cx="44" cy="64" r="5" class="face-fill" />
          <circle cx="76" cy="64" r="5" class="face-fill" />
          <circle cx="46" cy="62" r="1.5" fill="white" />
          <circle cx="78" cy="62" r="1.5" fill="white" />
          <path d="M38 64 Q44 60 50 64" class="face-stroke" />
          <path d="M62 64 Q68 60 74 64" class="face-stroke" />
        </g>

        <!-- 眼睛：狩猎（锐利斜眼） -->
        <g v-else-if="status === 'hunting'">
          <path d="M40 62 L48 66" class="face-stroke-thick" />
          <path d="M72 62 L80 66" class="face-stroke-thick" />
        </g>

        <!-- 眼睛：玩耍（睁大圆眼） -->
        <g v-else-if="status === 'playing'">
          <circle cx="44" cy="64" r="6" class="face-fill" />
          <circle cx="76" cy="64" r="6" class="face-fill" />
          <circle cx="47" cy="61" r="2" fill="white" />
          <circle cx="79" cy="61" r="2" fill="white" />
        </g>

        <!-- 眼睛：死亡 / 默认兜底（idle 用下面的正常眼） -->
        <g v-else-if="status === 'dead'">
          <path d="M40 60 L48 68" class="face-stroke-thick" />
          <path d="M48 60 L40 68" class="face-stroke-thick" />
          <path d="M72 60 L80 68" class="face-stroke-thick" />
          <path d="M80 60 L72 68" class="face-stroke-thick" />
        </g>

        <!-- 眼睛：idle / 默认 -->
        <g v-else>
          <circle cx="44" cy="64" r="5" class="face-fill" />
          <circle cx="76" cy="64" r="5" class="face-fill" />
          <circle cx="46" cy="62" r="1.5" fill="white" />
          <circle cx="78" cy="62" r="1.5" fill="white" />
        </g>

        <!-- 嘴巴：鸟喙 -->
        <g v-if="type === 'bird'">
          <path
            v-if="status === 'sleeping' || status === 'tired'"
            d="M58 78 L62 78"
            class="face-stroke"
          />
          <path
            v-else
            d="M58 76 L62 76 L60 80 Z"
            class="beak"
          />
        </g>

        <!-- 嘴巴：猫 / 狐 / 龙 -->
        <g v-else>
          <path
            v-if="status === 'happy' || status === 'playing'"
            d="M52 80 Q60 90 68 80"
            class="face-stroke"
          />
          <path
            v-else-if="status === 'sad' || status === 'tired'"
            d="M54 86 Q60 80 66 86"
            class="face-stroke"
          />
          <path
            v-else-if="status === 'hunting'"
            d="M56 84 L64 84"
            class="face-stroke"
          />
          <path
            v-else-if="status === 'eating'"
            d="M56 82 Q60 86 64 82"
            class="face-stroke"
          />
          <path
            v-else-if="status === 'sleeping'"
            d="M60 84 L60 84"
            class="face-stroke-dot"
          />
          <path
            v-else
            d="M54 82 Q60 86 66 82"
            class="face-stroke"
          />
        </g>

        <!-- 腮红：开心 / 玩耍 / 进食 -->
        <g v-if="['happy', 'playing', 'eating'].includes(status)">
          <circle cx="32" cy="76" r="4" class="blush" />
          <circle cx="88" cy="76" r="4" class="blush" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'PetAvatar',

  props: {
    /**
     * 宠物类型
     */
    type: {
      type: String,
      default: 'cat',
      validator(value) {
        return ['cat', 'bird', 'fox', 'dragon'].includes(value)
      }
    },

    /**
     * 宠物状态
     */
    status: {
      type: String,
      default: 'idle',
      validator(value) {
        return ['idle', 'happy', 'sleeping', 'sad', 'tired', 'hunting', 'playing', 'eating', 'dead'].includes(value)
      }
    },

    /**
     * 渲染尺寸（px）
     */
    size: {
      type: Number,
      default: 64
    }
  },

  computed: {
    /**
     * 外层容器样式
     */
    containerStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      }
    },

    /**
     * 状态 CSS 类
     */
    statusClass() {
      return `status-${this.status}`
    },

    /**
     * 类型 CSS 类
     */
    typeClass() {
      return `type-${this.type}`
    },

    /**
     * 无障碍标签
     */
    ariaLabel() {
      return `${this.type} pet avatar, status ${this.status}`
    }
  }
}
</script>

<style scoped>
.pet-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.pet-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 描边统一用深色 */
.face-stroke,
.face-stroke-thick,
.face-stroke-dot {
  fill: none;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-linecap: round;
}

.face-stroke {
  stroke-width: 3;
}

.face-stroke-thick {
  stroke-width: 3.5;
}

.face-stroke-dot {
  stroke-width: 3;
  stroke-linecap: round;
}

.face-fill {
  fill: var(--mp-ink, #4a4a4a);
}

.tear {
  fill: var(--mp-blue, #60a5fa);
}

.blush {
  fill: var(--mp-pink, #ff9ecd);
  opacity: 0.6;
}

.beak {
  fill: #ffb347;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 2;
  stroke-linejoin: round;
}

/* 身体填充 - 使用全局设计 Token */
.body-cat,
.feature-cat {
  fill: var(--mp-pet-cat, #c8f0d8);
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 3;
  stroke-linejoin: round;
}

.body-bird,
.feature-bird {
  fill: var(--mp-pet-bird, #a8e6f0);
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 3;
  stroke-linecap: round;
}

.feature-bird-wing {
  fill: #b8e8f0;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 3;
  stroke-linejoin: round;
}

.body-fox,
.feature-fox {
  fill: var(--mp-pet-fox, #ffd4a8);
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 3;
  stroke-linejoin: round;
}

.feature-fox-inner {
  fill: #ffe4d6;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 2;
}

.feature-fox-tail {
  fill: #ff6b4a;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 2.5;
  stroke-linejoin: round;
}

.body-dragon,
.feature-dragon-horn {
  fill: var(--mp-pet-dragon, #e8d8f0);
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 3;
  stroke-linejoin: round;
}

.feature-dragon-wing {
  fill: #c8a8e0;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 3;
  stroke-linejoin: round;
}

.feature-dragon-crystal {
  fill: #a855f7;
  stroke: var(--mp-ink, #4a4a4a);
  stroke-width: 2;
  stroke-linejoin: round;
}

/* 状态动画 */
.status-idle .pet-svg {
  animation: breathe 3s ease-in-out infinite;
}

.status-happy .pet-svg {
  animation: happy-bounce 0.6s ease-in-out infinite;
}

.status-sleeping .pet-svg {
  animation: sway 3s ease-in-out infinite;
}

.status-sad .pet-svg {
  animation: shiver 2s ease-in-out infinite;
}

.status-tired .pet-svg {
  animation: breathe 2.5s ease-in-out infinite;
}

.status-hunting .pet-svg {
  animation: shake-fast 0.2s ease-in-out infinite;
}

.status-playing .pet-svg {
  animation: wiggle 0.3s ease-in-out infinite;
}

.status-eating .pet-svg {
  animation: chew 0.25s ease-in-out infinite;
}

.status-dead .pet-svg {
  animation: none;
  transform: rotate(90deg);
  opacity: 0.6;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03) translateY(1px); }
}

@keyframes happy-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-8px) scale(1.06); }
}

@keyframes sway {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

@keyframes shiver {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

@keyframes shake-fast {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}

@keyframes chew {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05) translateY(-2px); }
}
</style>
```

- [ ] **Step 2: Build to verify the new file compiles**

Run:

```bash
npm run build
```

Expected: Vite builds successfully with no errors.

---

## Task 2: Update `src/config/petTypes.js`

**Files:**
- Modify: `src/config/petTypes.js`

**Interfaces:**
- Consumes: nothing new.
- Produces: `getPetType('cat')` no longer has `emoji` or `emojiSecondary`; `description` for `cat` no longer mentions a shell.

- [ ] **Step 1: Remove emoji fields and fix the cat description**

Replace the `cat` block (lines 17-42) with:

```js
  /**
   * 小紫 - 蛞蝓猫（Slugcat）
   * 初始宠物，平衡型，无特殊技能
   */
  cat: {
    id: 1,
    name: '小紫',
    type: 'cat',
    rarity: 'common',
    description: '一只可爱的蛞蝓猫，身体软乎乎，有着猫的灵活',
    lore: '小紫是你在魔法水晶球中发现的第一只宠物，它温柔而忠诚，是你冒险旅程的最佳伙伴',
    baseStats: {
      hunger: 80,
      mood: 70,
      health: 100,
      maxHunger: 100,
      maxMood: 100,
      maxHealth: 100
    },
    passiveSkill: null, // 初始宠物无被动技能
    isStarter: true, // 初始宠物标记
    unlockCondition: '初始获得',
    specialAnimations: {
      idle: 'earWiggle',
      happy: 'jump',
      eating: 'bounce'
    }
  },
```

- [ ] **Step 2: Remove emoji fields from `bird`**

Replace lines 49-80 with:

```js
  /**
   * 青鸟 - 风羽鸟（Wind Feather）
   * 稀有宠物，速度型，探险专家
   * 被动技能：迅捷之风（探险时间-20%）
   */
  bird: {
    id: 2,
    name: '青鸟',
    type: 'bird',
    rarity: 'rare',
    description: '一只拥有风之力量的神鸟，飞行速度极快',
    lore: '风羽鸟来自云端的魔法山脉，它们的羽毛能够切割空气，带来清爽的风',
    baseStats: {
      hunger: 75,
      mood: 75,
      health: 90,
      maxHunger: 100,
      maxMood: 100,
      maxHealth: 100
    },
    passiveSkill: {
      name: '迅捷之风',
      description: '探险时间减少20%',
      effect: 'explore_time_reduce',
      value: 0.2, // 减少20%
      icon: '💨'
    },
    isStarter: false,
    unlockCondition: '合成获得',
    specialAnimations: {
      idle: 'float', // 轻微漂浮
      happy: 'flyCircle', // 绕圈飞行
      eating: 'peck' // 啄食动作
    }
  },
```

- [ ] **Step 3: Remove emoji fields from `fox`**

Replace lines 87-118 with:

```js
  /**
   * 赤狐 - 焰尾狐（Flame Tail）
   * 稀有宠物，攻击型，战斗专家
   * 被动技能：战斗狂热（战斗奖励+15%）
   */
  fox: {
    id: 3,
    name: '赤狐',
    type: 'fox',
    rarity: 'rare',
    description: '尾巴燃烧着永恒火焰的妖狐，性格高傲但忠诚',
    lore: '焰尾狐生活在火山深处的魔法洞穴中，它们的火焰不会灼伤朋友，只会温暖他们',
    baseStats: {
      hunger: 85,
      mood: 65,
      health: 95,
      maxHunger: 100,
      maxMood: 100,
      maxHealth: 100
    },
    passiveSkill: {
      name: '战斗狂热',
      description: '战斗奖励增加15%',
      effect: 'hunt_reward_boost',
      value: 0.15, // 增加15%
      icon: '🔥'
    },
    isStarter: false,
    unlockCondition: '合成获得',
    specialAnimations: {
      idle: 'tailFlame', // 尾巴火焰摇曳
      happy: 'fireJump', // 带火焰的跳跃
      eating: 'quickBite' // 快速咬食
    }
  },
```

- [ ] **Step 4: Remove emoji fields from `dragon`**

Replace lines 125-157 with:

```js
  /**
   * 晶晶 - 晶石龙（Crystal Dragon）
   * 史诗宠物，防御型，生存专家
   * 被动技能：晶石护盾（死亡概率-5%）
   */
  dragon: {
    id: 4,
    name: '晶晶',
    type: 'dragon',
    rarity: 'epic',
    description: '由纯净水晶构成的幼龙，拥有最强的防御力',
    lore: '晶石龙是远古龙族的后裔，它们的身体由魔法水晶构成，能够抵御大多数伤害',
    baseStats: {
      hunger: 90,
      mood: 60,
      health: 120, // 额外生命值
      maxHunger: 100,
      maxMood: 100,
      maxHealth: 120 // 更高上限
    },
    passiveSkill: {
      name: '晶石护盾',
      description: '游猎死亡概率降低5%',
      effect: 'death_chance_reduce',
      value: 0.05, // 降低5%
      icon: '💎'
    },
    isStarter: false,
    unlockCondition: '合成获得',
    specialAnimations: {
      idle: 'crystalShine', // 水晶闪光
      happy: 'wingFlap', // 翅膀拍打
      eating: 'crystalGlow' // 进食时全身发光
    }
  }
```

- [ ] **Step 5: Build to verify**

Run:

```bash
npm run build
```

Expected: build succeeds. There will be warnings about `emoji`/`emojiSecondary` being accessed in components until they are updated in later tasks.

---

## Task 3: Update `src/components/PetDisplay.vue`

**Files:**
- Modify: `src/components/PetDisplay.vue`

**Interfaces:**
- Consumes: `PetAvatar` component.
- Produces: large portrait and switcher preview use `PetAvatar` instead of `SlugcatAvatar`/`emoji`.

- [ ] **Step 1: Swap the import and component registration**

Replace:

```js
import SlugcatAvatar from './icons/SlugcatAvatar.vue'
```

with:

```js
import PetAvatar from './icons/PetAvatar.vue'
```

Replace the `components` block:

```js
  components: {
    Item,
    PetAvatar,
    StarDecoration
  },
```

- [ ] **Step 2: Replace the large avatar**

Replace:

```vue
      <div class="pet-avatar-large" :style="avatarStyle">
        <span v-if="petConfig?.passiveSkill" class="skill-icon">{{ petConfig.passiveSkill.icon }}</span>
        <SlugcatAvatar :status="gameStore.pet.status" :pet-type="petConfig?.type" :size="100" />
      </div>
```

with:

```vue
      <div class="pet-avatar-large" :style="avatarStyle">
        <span v-if="petConfig?.passiveSkill" class="skill-icon">{{ petConfig.passiveSkill.icon }}</span>
        <PetAvatar :type="petConfig?.type" :status="gameStore.pet.status" :size="100" />
      </div>
```

- [ ] **Step 3: Replace the switcher preview emoji**

Replace:

```vue
            <div class="pet-preview-avatar">{{ getPetEmoji(ownedPet.petType) }}</div>
```

with:

```vue
            <div class="pet-preview-avatar">
              <PetAvatar :type="ownedPet.petType" status="idle" :size="36" />
            </div>
```

- [ ] **Step 4: Remove the unused `getPetEmoji` method**

Delete this method from the `methods` section:

```js
    getPetEmoji(petType) {
      const pet = getPetType(petType)
      return pet?.emoji || '🐌'
    },
```

- [ ] **Step 5: Adjust the switcher preview avatar style**

Add/merge into `.pet-preview-avatar` (around line 645):

```css
.pet-preview-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

Remove the old `font-size: 24px;` line if it is still present.

- [ ] **Step 6: Build to verify**

Run:

```bash
npm run build
```

Expected: build succeeds.

---

## Task 4: Update `src/components/synthesis/PetPreview.vue`

**Files:**
- Modify: `src/components/synthesis/PetPreview.vue`

**Interfaces:**
- Consumes: `PetAvatar` component.
- Produces: synthesis preview card uses `PetAvatar`.

- [ ] **Step 1: Swap import and component registration**

Replace:

```js
import SlugcatAvatar from '../icons/SlugcatAvatar.vue'
```

with:

```js
import PetAvatar from '../icons/PetAvatar.vue'
```

Replace:

```js
  components: {
    SlugcatAvatar
  },
```

with:

```js
  components: {
    PetAvatar
  },
```

- [ ] **Step 2: Replace the avatar in template**

Replace:

```vue
    <div class="pet-avatar">
      <SlugcatAvatar :status="petStatus" :pet-type="pet.type || 'cat'" :size="56" />
    </div>
```

with:

```vue
    <div class="pet-avatar">
      <PetAvatar :type="pet.type || 'cat'" :status="petStatus" :size="56" />
    </div>
```

- [ ] **Step 3: Build to verify**

Run:

```bash
npm run build
```

Expected: build succeeds.

---

## Task 5: Update `src/components/Pet.vue`

**Files:**
- Modify: `src/components/Pet.vue`

**Interfaces:**
- Consumes: `PetAvatar` component.
- Produces: main pet avatar and switcher preview use `PetAvatar`; emoji computed properties and methods removed; old status-specific `.pet-avatar` animations removed to avoid conflicting with `PetAvatar` animations.

- [ ] **Step 1: Import `PetAvatar`**

Add after the existing imports:

```js
import PetAvatar from './icons/PetAvatar.vue'
```

Add `PetAvatar` to the component registration block:

```js
export default {
  name: 'Pet',

  components: {
    PetAvatar
  },

  // ...existing props/data/computed/methods
}
```

- [ ] **Step 2: Replace the main avatar**

Replace:

```vue
    <div class="pet-avatar" :style="avatarStyle">
      <span v-if="petConfig?.passiveSkill" class="skill-icon">{{ petConfig.passiveSkill.icon }}</span>
      <span class="cat-ears">{{ petEmojiSecondary }}</span>
      <span class="pet-emoji">{{ petEmoji }}</span>
    </div>
```

with:

```vue
    <div class="pet-avatar" :style="avatarStyle">
      <span v-if="petConfig?.passiveSkill" class="skill-icon">{{ petConfig.passiveSkill.icon }}</span>
      <PetAvatar :type="petConfig?.type" :status="pet.status" :size="72" />
    </div>
```

- [ ] **Step 3: Remove emoji computed properties**

Delete these two computed properties:

```js
    petEmoji() {
      return this.petConfig?.emoji || '🐌'
    },

    petEmojiSecondary() {
      return this.petConfig?.emojiSecondary || '🐱'
    },
```

- [ ] **Step 4: Replace switcher preview emoji**

Replace:

```vue
            <div class="pet-preview-avatar">{{ getPetEmoji(ownedPet.petType) }}</div>
```

with:

```vue
            <div class="pet-preview-avatar">
              <PetAvatar :type="ownedPet.petType" status="idle" :size="32" />
            </div>
```

- [ ] **Step 5: Remove `getPetEmoji` method**

Delete:

```js
    getPetEmoji(petType) {
      const pet = getPetType(petType)
      return pet?.emoji || '🐌'
    },
```

- [ ] **Step 6: Remove conflicting status animations on `.pet-avatar`**

In the `<style scoped>` section, delete the following blocks and their keyframes:

```css
/* 睡觉状态 - 轻微摇摆 */
.sleeping .pet-avatar {
  animation: sway 3s ease-in-out infinite;
}

.sleeping .status-indicator {
  /* 睡觉时不显示状态表情 */
  opacity: 0;
}

/* 开心状态 - 跳跃 */
.happy .pet-avatar {
  animation: jump 0.5s ease-in-out infinite;
}

/* 玩耍状态 - 摇摆 */
.playing .pet-avatar {
  animation: wiggle 0.3s ease-in-out infinite;
}

/* 战斗状态 - 快速抖动 */
.hunting .pet-avatar {
  animation: shake 0.2s ease-in-out infinite;
}

/* 疲惫状态 - 慢速呼吸 */
.tired .pet-avatar {
  animation: breathe 2s ease-in-out infinite;
}
```

Also delete these keyframes if they are no longer used elsewhere in the file:

```css
@keyframes sway { ... }
@keyframes jump { ... }
@keyframes wiggle { ... }
@keyframes shake { ... }
@keyframes breathe { ... }
```

Leave the `.pet-avatar` container styles (size, gradient, shadow, hover) intact.

- [ ] **Step 7: Adjust switcher preview avatar style**

Update `.pet-preview-avatar` to remove the emoji font size and keep it centered:

```css
.pet-preview-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

- [ ] **Step 8: Build to verify**

Run:

```bash
npm run build
```

Expected: build succeeds.

---

## Task 6: Delete `SlugcatAvatar.vue` and verify no references remain

**Files:**
- Delete: `src/components/icons/SlugcatAvatar.vue`

**Interfaces:**
- Consumes: none.
- Produces: no remaining imports of `SlugcatAvatar`.

- [ ] **Step 1: Grep for any remaining `SlugcatAvatar` references**

Run:

```bash
grep -R "SlugcatAvatar" src/
```

Expected: no output.

If any references remain, fix them by switching to `PetAvatar` as in Tasks 3-5.

- [ ] **Step 2: Delete the old file**

```bash
git rm src/components/icons/SlugcatAvatar.vue
```

- [ ] **Step 3: Build to verify**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit the migration**

```bash
git add src/components/icons/PetAvatar.vue src/config/petTypes.js src/components/Pet.vue src/components/PetDisplay.vue src/components/synthesis/PetPreview.vue src/components/icons/SlugcatAvatar.vue
git commit -m "feat(ui): replace emoji/SlugcatAvatar with unified PetAvatar component

- Add PetAvatar.vue with 4 distinct pet silhouettes and 8 status expressions
- Remove emoji/emojiSecondary from petTypes.js; fix slugcat description
- Migrate Pet.vue, PetDisplay.vue, PetPreview.vue to PetAvatar
- Delete SlugcatAvatar.vue

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 7: Visual verification

**Files:**
- none (manual check)

**Interfaces:**
- Consumes: running dev server.
- Produces: screenshots or confirmed visual checklist.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Open the game in a browser**

Open `http://localhost:5173`.

- [ ] **Step 3: Verify the 4 pet types are visually distinct**

Use the pet switcher or synthesize the other pets to see each type. Confirm:

- `cat` (小紫): mint-green rounded body with triangular ears and a curled tail.
- `bird` (青鸟): light-blue fluffy body with wings, feather crest, and yellow beak.
- `fox` (赤狐): orange body with pointy ears and a flame tail.
- `dragon` (晶晶): purple crystal body with horns, small wings, and back crystals.

- [ ] **Step 4: Verify status expressions and animations**

Trigger each state and confirm the face changes:

| State | How to trigger | Expected face |
|-------|----------------|---------------|
| `idle` | default | normal round eyes, small smile |
| `happy` | feed a favorite food or level up | closed curved eyes, big smile, blush |
| `sleeping` | let pet sleep | closed eyes, tiny mouth |
| `sad` | very low mood | droopy eyes with tears, frown |
| `tired` | return from a long hunt | half-closed eyelids, flat mouth |
| `hunting` | send pet to hunting zone | slanted eyes, flat mouth |
| `playing` | send pet to forest | large round eyes, big smile, blush |
| `eating` | feed any food | closed eyes, chewing mouth, blush |

Also confirm the SVG animates (bounce, sway, shake, etc.) for each state.

- [ ] **Step 5: Verify drag-and-drop and stat bars still work**

- Drag an item from backpack to the crystal ball → pet should eat.
- Drag the pet to the forest/hunting zone → pet should leave.
- Drag the outdoor pet back → pet should return.
- Stat bars (hunger/mood/health) should still render normally.

- [ ] **Step 6: Stop the dev server and finalize**

Press `Ctrl + C` in the terminal running `npm run dev`.

If everything looks good, the implementation is complete.
