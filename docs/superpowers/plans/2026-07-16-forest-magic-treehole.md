# Forest Magic Treehole Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `OutdoorPlay.vue`（森林玩耍区）从标准卡片改造为“魔法树洞”视觉风格：有机树冠轮廓、分层森林背景、emoji 动态小生物、冒泡收益提示，同时保持现有拖拽交互与布局约束。

**Architecture:** 通过新增 `CanopyTop.vue` 装饰组件和改造 `OutdoorPlay.vue` 的模板/样式实现视觉升级；收益冒泡通过 `OutdoorPlay.vue` 内部的定时器与 DOM 元素管理实现；动态生物全部使用 emoji + CSS `@keyframes`，不引入运行时依赖。

**Tech Stack:** Vue 3 (Options API), Pinia, plain CSS, v-drag-drop（HTML5 drag API）, Naive UI（项目已有）, Vite dev server 用于视觉验证。

## Global Constraints

- 只修改 `src/components/OutdoorPlay.vue` 和新增装饰组件，不改动 `App.vue` 三栏布局。
- 右侧面板宽度维持 260px，单个户外区高度维持约 200px（响应式断点内可微调）。
- 所有动画尊重 `prefers-reduced-motion`。
- 优先复用现有设计 token；必要时使用文档中指定的十六进制色值作为过渡。
- 新增 i18n 键必须同步更新 `zh-CN.json` 和 `en-US.json`。
- 频繁提交，每个 task 完成后独立 commit。

---

## File Structure

| 文件 |  responsibility |
|------|-----------------|
| `src/components/icons/decorations/CanopyTop.vue` | 树冠顶部 SVG 装饰（从下载目录复制） |
| `src/components/OutdoorPlay.vue` | 森林区主组件：布局、背景、生物、冒泡、空状态、拖拽反馈 |
| `src/i18n/locales/zh-CN.json` | 中文翻译：收益冒泡与徽章文本 |
| `src/i18n/locales/en-US.json` | 英文翻译：收益冒泡与徽章文本 |
| `docs/superpowers/specs/2026-07-16-forest-magic-treehole-design.md` | 设计规格参考 |

---

### Task 1: 集成 CanopyTop 树冠组件

**Files:**
- Create: `src/components/icons/decorations/CanopyTop.vue`
- Copy from: `C:\Users\hulul\Downloads\CanopyTop.vue`
- Modify: `src/components/OutdoorPlay.vue`

**Interfaces:**
- Consumes: N/A
- Produces: `<CanopyTop>` component usable inside `OutdoorPlay.vue`

- [ ] **Step 1: Copy CanopyTop.vue into the project**

Run:
```bash
cp "C:/Users/hulul/Downloads/CanopyTop.vue" "src/components/icons/decorations/CanopyTop.vue"
```

Expected: File exists at `src/components/icons/decorations/CanopyTop.vue`.

- [ ] **Step 2: Register CanopyTop in OutdoorPlay.vue**

Modify `src/components/OutdoorPlay.vue`:

```javascript
import CanopyTop from './icons/decorations/CanopyTop.vue'

export default {
  components: {
    Pet,
    TreeDecoration,
    StarDecoration,
    CanopyTop
  },
  // ...
}
```

- [ ] **Step 3: Add CanopyTop to template**

Place it inside `.outdoor-play` container, above `.zone-header`:

```html
<!-- 树冠顶部装饰 -->
<CanopyTop class="canopy-top" />
```

- [ ] **Step 4: Verify component renders**

Run: `npm run dev`
Open: http://localhost:5173
Expected: Forest zone still renders; canopy may overlap text temporarily (styled in next task).

- [ ] **Step 5: Commit**

```bash
git add src/components/icons/decorations/CanopyTop.vue src/components/OutdoorPlay.vue
git commit -m "feat(forest): add CanopyTop decoration component"
```

---

### Task 2: 重构森林区背景、布局与信息层级

**Files:**
- Modify: `src/components/OutdoorPlay.vue`

**Interfaces:**
- Consumes: `<CanopyTop>` from Task 1
- Produces: Restructured `.outdoor-play` container with layered background, ground strip, and realigned header

- [ ] **Step 1: Rewrite `.outdoor-play` base styles**

Replace the existing `.outdoor-play` block with:

```css
.outdoor-play {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 15px 15px; /* top padding removed; canopy sits flush */
  border-radius: var(--mp-radius-lg);
  background:
    radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.35) 0%, transparent 55%),
    linear-gradient(180deg, #a7e6cf 0%, #88d8b0 45%, #6b9b7a 100%);
  border: 3px solid var(--mp-ink);
  box-shadow: var(--mp-shadow);
  transition: all 0.3s ease;
  overflow: hidden;
}
```

- [ ] **Step 2: Add ground strip element**

Add a new element inside `.outdoor-play`:

```html
<!-- 近景地面 -->
<div class="ground-strip" />
```

And styles:

```css
.ground-strip {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 36px;
  background: linear-gradient(180deg, rgba(75,130,100,0) 0%, rgba(75,130,100,0.5) 100%);
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 3: Position canopy flush at top**

```css
.canopy-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  pointer-events: none;
}
```

- [ ] **Step 4: Keep foreground trees but lower their opacity**

The existing `.forest-decoration` with `TreeDecoration` remains, but the sun/star is removed. Update the styles:

```css
.tree {
  position: absolute;
  bottom: -6px;
  width: 56px;
  animation: tree-sway 3s ease-in-out infinite;
  z-index: 2;
}

.tree-1 { left: 6px; }
.tree-2 {
  right: 8px;
  width: 44px;
  opacity: 0.85;
  animation-delay: -1.5s;
}
```

Remove or hide the `.sun` element from `.forest-decoration` since the top glow replaces it.

- [ ] **Step 5: Realign header and description**

Update `.zone-header`:

```css
.zone-header {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 42px; /* clear the 48px canopy */
  margin-bottom: 6px;
}

.title-group {
  display: flex;
  align-items: center;
}
```

Update `.zone-description`:

```css
.zone-description {
  position: relative;
  z-index: 3;
  text-align: center;
  font-size: 11px;
  color: var(--mp-text-muted);
  margin-bottom: 10px;
}
```

- [ ] **Step 6: Verify layout**

Run: `npm run dev`
Expected: Forest zone shows canopy at top, gradient background, ground strip at bottom, header/description readable.

- [ ] **Step 7: Commit**

```bash
git add src/components/OutdoorPlay.vue
git commit -m "feat(forest): restructure background layers and header layout"
```

---

### Task 3: 添加 emoji 动态小生物

**Files:**
- Modify: `src/components/OutdoorPlay.vue`

**Interfaces:**
- Consumes: N/A
- Produces: CSS keyframe animations for fireflies, butterfly, ladybug, falling petals

- [ ] **Step 1: Add creature markup**

Inside `.outdoor-play`, add:

```html
<!-- 动态小生物 -->
<div class="creatures">
  <span class="creature firefly firefly-1">✨</span>
  <span class="creature firefly firefly-2">🌟</span>
  <span class="creature firefly firefly-3">✨</span>
  <span v-if="outdoorStore.playingPet" class="creature butterfly">🦋</span>
  <span class="creature ladybug">🐞</span>
  <span class="creature petal petal-1">🌸</span>
  <span class="creature petal petal-2">🍃</span>
</div>
```

- [ ] **Step 2: Add base creature styles**

```css
.creatures {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.creature {
  position: absolute;
  font-size: 14px;
  line-height: 1;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
}

.firefly {
  opacity: 0.8;
  animation: firefly-float 5s ease-in-out infinite, firefly-glow 3s ease-in-out infinite;
}

.firefly-1 { top: 55px; left: 25px; animation-delay: 0s, 0s; }
.firefly-2 { top: 85px; right: 40px; animation-delay: -2s, -1s; }
.firefly-3 { top: 115px; left: 70px; animation-delay: -4s, -2s; }

.butterfly {
  top: 60px;
  left: 50%;
  font-size: 18px;
  animation: butterfly-flight 10s ease-in-out infinite;
}

.ladybug {
  bottom: 8px;
  left: 20%;
  font-size: 12px;
  animation: ladybug-crawl 12s linear infinite;
}

.petal {
  top: -20px;
  font-size: 12px;
  opacity: 0.7;
  animation: petal-fall 7s linear infinite;
}

.petal-1 { left: 20%; animation-delay: 0s; }
.petal-2 { left: 70%; animation-delay: -3.5s; }
```

- [ ] **Step 3: Add keyframe animations**

```css
@keyframes firefly-float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(6px, -10px); }
}

@keyframes firefly-glow {
  0%, 100% { opacity: 0.5; filter: drop-shadow(0 0 2px #ffd93d); }
  50% { opacity: 1; filter: drop-shadow(0 0 6px #ffd93d); }
}

@keyframes butterfly-flight {
  0% { transform: translate(-40px, 10px) scaleX(1); }
  25% { transform: translate(10px, -15px) scaleX(-1); }
  50% { transform: translate(50px, 5px) scaleX(1); }
  75% { transform: translate(20px, 20px) scaleX(-1); }
  100% { transform: translate(-40px, 10px) scaleX(1); }
}

@keyframes ladybug-crawl {
  0% { transform: translateX(0) rotate(0deg); }
  20% { transform: translateX(30px) rotate(5deg); }
  40% { transform: translateX(30px) rotate(0deg); }
  60% { transform: translateX(60px) rotate(-3deg); }
  80% { transform: translateX(60px) rotate(0deg); }
  100% { transform: translateX(0) rotate(0deg); }
}

@keyframes petal-fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.7; }
  100% { transform: translateY(220px) rotate(360deg); opacity: 0; }
}
```

- [ ] **Step 4: Respect reduced motion**

Add:

```css
@media (prefers-reduced-motion: reduce) {
  .creature {
    animation: none !important;
  }
}
```

- [ ] **Step 5: Verify animations**

Run: `npm run dev`
Expected: Fireflies pulse, butterfly flies when pet present, ladybug crawls, petals fall.

- [ ] **Step 6: Commit**

```bash
git add src/components/OutdoorPlay.vue
git commit -m "feat(forest): add emoji creatures and ambient animations"
```

---

### Task 4: 实现冒泡收益提示

**Files:**
- Modify: `src/components/OutdoorPlay.vue`

**Interfaces:**
- Consumes: `outdoorStore.playingPet` from Pinia store
- Produces: Floating reward bubbles rendered above the pet

- [ ] **Step 1: Add bubble state and interval**

In `<script>` `data()`:

```javascript
data() {
  return {
    isDropTarget: false,
    dragEnterCounter: 0,
    bubbles: [],         // { id, text, icon }
    bubbleTimer: null
  }
}
```

- [ ] **Step 2: Manage bubble lifecycle**

Add methods:

```javascript
methods: {
  // ...existing drag handlers...

  startRewardBubbles() {
    if (this.bubbleTimer) return
    this.spawnBubble()
    this.bubbleTimer = setInterval(() => {
      this.spawnBubble()
    }, 6000) // 6 seconds between bubbles
  },

  stopRewardBubbles() {
    if (this.bubbleTimer) {
      clearInterval(this.bubbleTimer)
      this.bubbleTimer = null
    }
    this.bubbles = []
  },

  spawnBubble() {
    const rewards = [
      { text: this.$t('areas.forest.rewards.mood'), icon: '❤️' },
      { text: this.$t('areas.forest.rewards.joy'), icon: '✨' },
      { text: this.$t('areas.forest.rewards.growth'), icon: '🌱' }
    ]
    const reward = rewards[Math.floor(Math.random() * rewards.length)]
    const id = Date.now() + Math.random()
    const xOffset = (Math.random() - 0.5) * 20 // ±10px
    this.bubbles.push({ id, ...reward, xOffset })
    setTimeout(() => {
      this.bubbles = this.bubbles.filter(b => b.id !== id)
    }, 1500)
  }
}
```

- [ ] **Step 3: Watch pet presence**

Add watcher:

```javascript
watch: {
  'outdoorStore.playingPet'(pet) {
    if (pet) {
      this.startRewardBubbles()
    } else {
      this.stopRewardBubbles()
    }
  }
}
```

- [ ] **Step 4: Render bubbles**

Inside `.pet-area`, wrap `<Pet>`:

```html
<div class="pet-area">
  <template v-if="outdoorStore.playingPet">
    <div class="bubbles-container">
      <div
        v-for="bubble in bubbles"
        :key="bubble.id"
        class="reward-bubble"
        :style="{ transform: `translateX(${bubble.xOffset}px)` }"
      >
        <span class="bubble-icon">{{ bubble.icon }}</span>
        <span class="bubble-text">{{ bubble.text }}</span>
      </div>
    </div>
    <Pet
      :pet="outdoorStore.playingPet"
      draggable="true"
      @dragstart="handlePetDragStart"
      @dragend="handlePetDragEnd"
    />
  </template>
  <div v-else class="empty-hint">...</div>
</div>
```

- [ ] **Step 5: Style bubbles**

```css
.bubbles-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  pointer-events: none;
  width: 100px;
  height: 0;
  display: flex;
  justify-content: center;
}

.reward-bubble {
  position: absolute;
  bottom: 40px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(255,255,255,0.9);
  border: 2px solid var(--mp-ink);
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: var(--mp-ink);
  box-shadow: 0 2px 0 rgba(97,35,21,0.1);
  animation: bubble-rise 1.5s ease-out forwards;
}

.bubble-icon {
  font-size: 12px;
}

@keyframes bubble-rise {
  0% { transform: translateY(0) scale(0.8); opacity: 0; }
  20% { transform: translateY(-10px) scale(1); opacity: 1; }
  100% { transform: translateY(-45px) scale(1); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .reward-bubble {
    animation: none;
    opacity: 0.9;
  }
}
```

- [ ] **Step 6: Verify bubbles**

Run: `npm run dev`
Drag a pet to forest. Expected: Every ~6 seconds a bubble rises above pet.

- [ ] **Step 7: Commit**

```bash
git add src/components/OutdoorPlay.vue
git commit -m "feat(forest): add floating reward bubbles"
```

---

### Task 5: 空状态改造与拖拽反馈

**Files:**
- Modify: `src/components/OutdoorPlay.vue`

**Interfaces:**
- Consumes: `isDropTarget`, drag handlers
- Produces: Empty state with leaf placeholder and natural drop feedback

- [ ] **Step 1: Update empty hint markup**

Replace empty-hint with:

```html
<div v-else class="empty-hint">
  <span class="empty-leaf">🍃</span>
  <span class="hint-text">{{ $t('areas.forest.hint') }}</span>
  <div class="drop-circle"></div>
</div>
```

- [ ] **Step 2: Style empty state**

```css
.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--mp-text-muted);
}

.empty-leaf {
  font-size: 28px;
  margin-bottom: 8px;
  animation: leaf-sway 3s ease-in-out infinite;
  opacity: 0.7;
}

.drop-circle {
  width: 56px;
  height: 56px;
  margin-top: 8px;
  border: 2px dashed rgba(97,35,21,0.3);
  border-radius: 50%;
  animation: drop-circle-pulse 2s ease-in-out infinite;
}

@keyframes leaf-sway {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}

@keyframes drop-circle-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 1; }
}
```

- [ ] **Step 3: Update drop-target feedback**

Replace `.outdoor-play.drop-target` styles:

```css
.outdoor-play.drop-target {
  border-color: var(--mp-gold);
  box-shadow: 0 0 30px var(--mp-crystal-gold-glow);
  animation: forest-glow 1s ease-in-out infinite;
}

.outdoor-play.drop-target .firefly {
  animation-duration: 1.5s; /* speed up gathering */
}

.outdoor-play.drop-target .ground-strip {
  animation: grass-sway 0.6s ease-in-out infinite;
}

@keyframes forest-glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.08); }
}

@keyframes grass-sway {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px); }
}
```

- [ ] **Step 4: Add pet-drop burst effect**

Add state and method:

```javascript
data() {
  return {
    // ...
    burstPetals: []
  }
}

methods: {
  // ...

  handleDrop(event) {
    this.isDropTarget = false
    this.dragEnterCounter = 0

    let data
    try {
      const jsonData = event.dataTransfer.getData('application/json')
      data = JSON.parse(jsonData)
    } catch (e) {
      console.error('解析拖拽数据失败:', e)
      return
    }

    if (data.type !== 'pet') return

    const success = this.outdoorStore.sendToPlay(data.pet)
    if (success) {
      this.gameStore.sendPetOutdoor('play')
      this.triggerBurst()
    }
  },

  triggerBurst() {
    const petals = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      rotation: Math.random() * 360,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 40
    }))
    this.burstPetals = petals
    requestAnimationFrame(() => {
      this.$nextTick(() => {
        this.burstPetals = this.burstPetals.map(p => ({ ...p, active: true }))
      })
    })
    setTimeout(() => { this.burstPetals = [] }, 1000)
  }
}
```

Render burst inside `.pet-area`:

```html
<div class="burst-container">
  <span
    v-for="petal in burstPetals"
    :key="petal.id"
    class="burst-petal"
    :class="{ fly: petal.active }"
    :style="{
      '--rotation': `${petal.rotation}deg`,
      '--tx': `${petal.x}px`,
      '--ty': `${petal.y}px`
    }"
  >🌸</span>
</div>
```

Style:

```css
.burst-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  pointer-events: none;
}

.burst-petal {
  position: absolute;
  font-size: 14px;
  opacity: 1;
  transition: transform 1s ease-out, opacity 1s ease-out;
  transform: translate(0, 0) rotate(var(--rotation, 0deg));
}

.burst-petal.fly {
  transform: translate(var(--tx, 0), var(--ty, 0)) rotate(var(--rotation, 0deg));
  opacity: 0;
}
```

- [ ] **Step 5: Verify drop feedback**

Run: `npm run dev`
Drag pet over forest: expect gentle glow, faster fireflies, grass sway.
Drop pet: expect leaf burst.
Empty state: expect swaying leaf + dashed circle.

- [ ] **Step 6: Commit**

```bash
git add src/components/OutdoorPlay.vue
git commit -m "feat(forest): redesign empty state and natural drop feedback"
```

---

### Task 6: i18n 更新与奖励徽章

**Files:**
- Modify: `src/i18n/locales/zh-CN.json`
- Modify: `src/i18n/locales/en-US.json`
- Modify: `src/components/OutdoorPlay.vue`

**Interfaces:**
- Consumes: Existing `areas.forest` keys
- Produces: New reward bubble keys and reward badge

- [ ] **Step 1: Add Chinese reward keys**

In `src/i18n/locales/zh-CN.json`, under `areas.forest` add:

```json
"forest": {
  "name": "森林",
  "tag": "安全",
  "description": "低风险玩耍，提升心情",
  "hint": "把宠物拖到这里玩耍",
  "reward": "+心情/分钟",
  "rewards": {
    "mood": "心情",
    "joy": "快乐",
    "growth": "成长"
  }
}
```

- [ ] **Step 2: Add English reward keys**

In `src/i18n/locales/en-US.json`, under `areas.forest` add:

```json
"forest": {
  "name": "Forest",
  "tag": "Safe",
  "description": "Low-risk play area, boosts mood",
  "hint": "Drag your pet here to play",
  "reward": "+Mood/min",
  "rewards": {
    "mood": "Mood",
    "joy": "Joy",
    "growth": "Growth"
  }
}
```

- [ ] **Step 3: Update header with reward badge**

In `OutdoorPlay.vue`, replace `.zone-header` markup:

```html
<div class="zone-header">
  <div class="title-group">
    <TreeDecoration class="zone-icon" />
    <span class="zone-name">{{ $t('areas.forest.name') }}</span>
  </div>
  <span v-if="outdoorStore.playingPet" class="reward-badge">
    {{ $t('areas.forest.reward') }}
  </span>
  <span class="zone-safety safe">{{ $t('areas.forest.tag') }}</span>
</div>
```

Style reward badge:

```css
.reward-badge {
  padding: 2px 8px;
  background: rgba(255,255,255,0.7);
  border: 1px solid var(--mp-gold);
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
  color: var(--mp-ink);
}
```

- [ ] **Step 4: Remove old reward preview**

Remove the entire `.reward-preview` block from template and its styles.

- [ ] **Step 5: Verify translations**

Run: `npm run dev`
Switch language. Expected: Reward bubbles and badge text translate correctly.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/locales/zh-CN.json src/i18n/locales/en-US.json src/components/OutdoorPlay.vue
git commit -m "feat(i18n): add forest reward bubble translations and badge"
```

---

### Task 7: 视觉验证与收尾

**Files:**
- Modify: None (or minor polish)
- Verify: `src/components/OutdoorPlay.vue`, dev server

**Interfaces:**
- Consumes: All previous tasks
- Produces: Final working feature

- [ ] **Step 1: Run visual check against acceptance criteria**

Run: `npm run dev`
Open: http://localhost:5173

Checklist:
- [ ] Canopy sits flush at top, background has depth layers
- [ ] Fireflies pulse, petals fall, butterfly appears when pet present
- [ ] Empty state shows swaying leaf + dashed circle
- [ ] Dragging pet over forest shows glow/sway feedback (not scale pulse)
- [ ] Dropping pet triggers leaf burst
- [ ] Reward bubbles rise every ~6 seconds
- [ ] Reward badge shows "+心情/分钟" when pet present
- [ ] Reduced motion query disables animations
- [ ] Responsive layout works at 1024px and 768px breakpoints

- [ ] **Step 2: Fix any visual regressions**

Document any issues found and fix inline.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(forest): complete magic treehole visual redesign"
```

- [ ] **Step 4: Stop visual companion server**

If the brainstorming visual companion server is still running:

```bash
"C:/Users/hulul/.claude/plugins/cache/claude-plugins-official/superpowers/6.1.1/skills/brainstorming/scripts/stop-server.sh" C:/Users/hulul/Documents/Dora/program/magic-potion/.superpowers/brainstorm/1661-1784259423
```

---

## Self-Review Checklist

- [ ] Spec coverage: canopy, layered background, creatures, bubbles, empty state, drop feedback, i18n, reduced-motion all mapped to tasks.
- [ ] No placeholders: every step has concrete code/commands.
- [ ] Type consistency: `outdoorStore.playingPet` used consistently; `bubbles` and `burstPetals` state shapes defined.
