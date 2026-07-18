# 游猎区火山裂隙改造实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `OutdoorHunt.vue` 从红色渐变卡片改造成火山裂隙场景，新增 `CraterRim.vue` 裂口轮廓组件，复用现有 `BatDecoration.vue`，实现岩浆裂纹、火星、烟雾、战斗震动、拖放反馈和战斗结果视觉反馈。

**Architecture:** 保持 Vue 3 Options API 和现有 HTML5 Drag API 不变；通过新增 SVG 装饰组件和纯 CSS 动画实现视觉升级；组件通过监听 `outdoorStore.huntingPet` 变化触发胜利/失败特效；动画默认启用但尊重 `prefers-reduced-motion`。

**Tech Stack:** Vue 3 + Options API + Pinia + CSS `@keyframes` + SVG

## Global Constraints

- 不修改游戏核心逻辑、数值平衡、状态管理（Pinia stores）。
- 不修改拖拽交互的数据流（仍使用 HTML5 Drag API）。
- 不新增外部依赖或图片资源；所有装饰使用 Vue SVG 组件或 CSS 实现。
- 保持右侧面板整体布局（约 260px 宽、200px 高）。
- 动画需尊重 `prefers-reduced-motion: reduce`。
- 优先复用现有 i18n 键，不强制新增文案键。
- 保持系统已有 CSS 变量命名风格（`--mp-*`）。

---

## File Structure

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/components/icons/decorations/CraterRim.vue` | 创建 | 顶部火山裂口剪影 SVG 装饰 |
| `src/components/OutdoorHunt.vue` | 大幅修改 | 火山场景容器、动态元素、交互反馈、信息层级 |
| `src/components/icons/decorations/BatDecoration.vue` | 复用 | 火蝠飞行装饰 |
| `src/components/icons/ui/HuntIcon.vue` | 复用 | 标题区短剑图标 |
| `docs/superpowers/specs/2026-07-17-hunt-volcanic-rift-design.md` | 只读参考 | 设计规格来源 |

---

## Task 1: 创建裂口轮廓组件 CraterRim.vue

**Files:**
- Create: `src/components/icons/decorations/CraterRim.vue`

**Interfaces:**
- Consumes: 无
- Produces: 一个可在 `OutdoorHunt.vue` 中引用的 SVG 装饰组件，无 props，宽度由父容器决定。

- [ ] **Step 1: 写入 CraterRim.vue 完整代码**

创建文件 `src/components/icons/decorations/CraterRim.vue`，内容如下：

```vue
<template>
  <!--
    CraterRim.vue - 火山裂口顶部剪影

    作为 OutdoorHunt.vue 的顶部装饰层，营造尖锐、危险的裂口感。
    视口 260×48，与 CanopyTop.vue 尺寸一致，方便直接替换使用。
  -->
  <svg
    viewBox="0 0 260 48"
    class="crater-rim"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- 裂口主体：底部平直基线 + 上方尖锐焦黑山峰（左低 / 中最高带缺口 / 右小火山锥） -->
    <path
      class="crater-body"
      d="M0 44 L14 44 Q10 30 22 26 Q26 16 38 21 Q48 10 66 14 Q80 8 92 18 Q104 22 112 34 Q120 24 132 28 Q142 18 156 24 Q168 30 174 42 Q182 32 194 28 Q206 22 218 30 Q230 26 242 34 Q250 40 246 44 L260 44 Z"
    />
    <!-- 岩石纹理：2–3 条短弧线暗示碎裂 -->
    <path
      class="crater-texture"
      d="M28 32 Q38 28 48 32 M110 36 Q124 30 138 34 M200 34 Q214 30 228 34"
    />
    <!-- 缺口高光：顶部两个缺口处的金色描边，暗示岩浆反光 -->
    <path
      class="crater-glow"
      d="M22 26 Q26 16 38 21 M120 24 Q132 28 142 18"
    />
  </svg>
</template>

<script>
export default {
  name: 'CraterRim'
}
</script>

<style scoped>
.crater-rim {
  display: block;
  width: 100%;
  height: auto;
}

/* 裂口主体：深褐红填充，85% 不透明，2.5px 深棕描边 */
.crater-body {
  fill: var(--mp-crater-fill, #3d1f1f);
  fill-opacity: 0.85;
  stroke: var(--mp-ink, #612315);
  stroke-width: 2.5;
  stroke-linejoin: round;
}

/* 岩石纹理：1.5px 描边，弱化处理 */
.crater-texture {
  fill: none;
  stroke: var(--mp-ink, #612315);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-opacity: 0.5;
}

/* 缺口高光：金色描边，模拟岩浆反光 */
.crater-glow {
  fill: none;
  stroke: var(--mp-gold, #f59e0b);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-opacity: 0.6;
}
</style>
```

- [ ] **Step 2: 验证组件可渲染**

临时在任意 Vue 文件（例如 `src/App.vue`）中导入并渲染：

```vue
<template>
  <CraterRim style="width: 260px;" />
</template>
```

```javascript
import CraterRim from './components/icons/decorations/CraterRim.vue'
export default { components: { CraterRim } }
```

运行 `npm run dev`，在浏览器中确认：
- 顶部出现深褐红色锯齿状裂口剪影；
- 有深棕色描边和金色缺口高光；
- 无报错。

- [ ] **Step 3: 提交**

```bash
git add src/components/icons/decorations/CraterRim.vue
git commit -m "feat(hunt): add volcanic crater rim decoration component

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 2: 重写 OutdoorHunt.vue 模板与脚本

**Files:**
- Modify: `src/components/OutdoorHunt.vue`

**Interfaces:**
- Consumes: `CraterRim.vue`（Task 1）、`BatDecoration.vue`（现有）、`HuntIcon.vue`（现有）、`Pet.vue`（现有）、`useGameStore` / `useOutdoorStore`（现有）。
- Produces: 改造后的 `OutdoorHunt.vue`，保持原有拖拽数据格式 `type: 'pet', action: 'recall', source: 'hunt'` 不变。

- [ ] **Step 1: 备份当前 OutdoorHunt.vue 内容（可选但建议）**

```bash
cp src/components/OutdoorHunt.vue src/components/OutdoorHunt.vue.bak
```

- [ ] **Step 2: 写入完整 OutdoorHunt.vue**

将 `src/components/OutdoorHunt.vue` 替换为以下内容：

```vue
<!--
  OutdoorHunt.vue - 户外游猎区（火山裂隙危险区域）

  这是游戏右侧的高风险战斗区域，视觉主题为火山裂隙。
  宠物可以拖拽到这里进行战斗，获得奖励但也有死亡风险。

  主要功能：
  1. 显示火山裂隙场景
  2. 接收拖拽的宠物
  3. 开始战斗计时
  4. 计算战斗结果（10%死亡几率）
  5. 根据结果触发胜利/失败视觉反馈

  玩法：
  - 将宠物从水晶球拖拽到这里
  - 宠物开始战斗，场景震动
  - 战斗结束后可能获得金币奖励，也可能死亡
  - 死亡的宠物可以用药水复活
-->

<template>
  <!--
    游猎区容器
    使用原生 HTML5 拖拽 API
  -->
  <div
    class="outdoor-hunt"
    :class="{
      'drop-target': isDropTarget,
      'combat-active': outdoorStore.huntingPet,
      'victory-active': showVictory,
      'defeat-active': showDefeat
    }"
    @dragover.prevent="handleDragOver"
    @dragleenter.prevent="handleDragEnter"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- 顶部裂口轮廓 -->
    <CraterRim class="crater-rim" />

    <!-- 背景层次由 CSS 实现，此处放置前景动态元素 -->

    <!-- ==================== 岩浆裂纹 ==================== -->
    <div class="lava-cracks">
      <div class="crack crack-1" />
      <div class="crack crack-2" />
      <div class="crack crack-3" />
    </div>

    <!-- ==================== 火星 ==================== -->
    <div class="embers">
      <span class="ember ember-1" />
      <span class="ember ember-2" />
      <span class="ember ember-3" />
      <span class="ember ember-4" />
      <span class="ember ember-5" />
      <span class="ember ember-6" />
    </div>

    <!-- ==================== 烟雾 ==================== -->
    <div class="smoke">
      <span class="smoke-puff smoke-1" />
      <span class="smoke-puff smoke-2" />
      <span class="smoke-puff smoke-3" />
    </div>

    <!-- ==================== 硫磺闪光 ==================== -->
    <div class="sulfur-flashes">
      <span class="sulfur-flash flash-1" />
      <span class="sulfur-flash flash-2" />
    </div>

    <!-- ==================== 火蝠装饰 ==================== -->
    <div class="fire-bats">
      <BatDecoration class="fire-bat fire-bat-1" />
      <BatDecoration class="fire-bat fire-bat-2" />
    </div>

    <!-- ==================== 区域标题 ==================== -->
    <div class="zone-header">
      <div class="title-group">
        <HuntIcon class="zone-icon" />
        <span class="zone-name">{{ $t('areas.hunt.name') }}</span>
      </div>
      <span v-if="outdoorStore.huntingPet" class="reward-badge">
        {{ $t('areas.hunt.reward') }}
      </span>
      <span class="zone-safety danger">{{ $t('areas.hunt.tag') }}</span>
    </div>

    <!-- ==================== 区域说明 ==================== -->
    <div v-if="!outdoorStore.huntingPet" class="zone-description">
      {{ $t('areas.hunt.description') }}
      <br>
      <span class="warning-text">{{ $t('areas.hunt.warning') }}</span>
    </div>

    <!-- ==================== 宠物显示区 ==================== -->
    <div class="pet-area">
      <template v-if="outdoorStore.huntingPet">
        <Pet
          :pet="outdoorStore.huntingPet"
          draggable="true"
          @dragstart="handlePetDragStart"
          @dragend="handlePetDragEnd"
        />
      </template>

      <!-- 没有宠物时的空状态 -->
      <div v-else class="empty-hint">
        <span class="empty-torch">🕯️</span>
        <span class="hint-text">{{ $t('areas.hunt.hint') }}</span>
        <div class="ignite-circle" />
      </div>

      <!-- 拖放落下时的火星喷溅 -->
      <div v-if="emberBurst.length > 0" class="ember-burst">
        <span
          v-for="ember in emberBurst"
          :key="ember.id"
          class="burst-ember"
          :class="{ fly: ember.active }"
          :style="ember.style"
        />
      </div>

      <!-- 胜利特效：金币火花 -->
      <div v-if="showVictory" class="victory-effect">
        <span class="victory-spark spark-1">✨</span>
        <span class="victory-spark spark-2">✨</span>
        <span class="victory-spark spark-3">✨</span>
        <span class="victory-spark spark-4">✨</span>
        <span class="victory-spark spark-5">✨</span>
      </div>

      <!-- 失败特效：黑烟遮罩 -->
      <div v-if="showDefeat" class="defeat-overlay" />
    </div>
  </div>
</template>

<script>
// ==================== 导入依赖 ====================
import { mapStores } from 'pinia'
import { useGameStore } from '../stores/game.js'
import { useOutdoorStore } from '../stores/outdoor.js'
import Pet from './Pet.vue'
import CraterRim from './icons/decorations/CraterRim.vue'
import BatDecoration from './icons/decorations/BatDecoration.vue'
import HuntIcon from './icons/ui/HuntIcon.vue'

export default {
  // 组件名称
  name: 'OutdoorHunt',

  // 注册子组件
  components: {
    Pet,
    CraterRim,
    BatDecoration,
    HuntIcon
  },

  // 组件内部状态
  data() {
    return {
      /**
       * isDropTarget: 是否是高亮的放置目标
       * 当用户拖拽宠物到这里时设为 true
       */
      isDropTarget: false,
      /**
       * dragEnterCounter: 拖拽进入计数器
       * 用于处理嵌套元素的 dragenter/dragleave 问题
       */
      dragEnterCounter: 0,
      /**
       * emberBurst: 拖放落下时的火星喷溅列表
       */
      emberBurst: [],
      /**
       * showVictory: 是否显示胜利特效
       */
      showVictory: false,
      /**
       * showDefeat: 是否显示失败特效
       */
      showDefeat: false,
      /**
       * effectTimer: 特效清理定时器
       */
      effectTimer: null
    }
  },

  // 监听器
  watch: {
    /**
     * 监听游猎区宠物变化
     * 当宠物从有变无时，说明战斗结束，根据生死状态触发特效
     */
    'outdoorStore.huntingPet'(newVal, oldVal) {
      if (oldVal && !newVal) {
        if (this.gameStore.pet.isDead) {
          this.triggerDefeat()
        } else {
          this.triggerVictory()
        }
      }
    }
  },

  // 计算属性
  computed: {
    // 映射 stores
    ...mapStores(useGameStore, useOutdoorStore),

    /**
     * dragData: 拖拽时传递的数据
     * 当用户拖拽宠物回去时使用
     */
    dragData() {
      return {
        type: 'pet',
        action: 'recall',
        pet: this.outdoorStore.huntingPet,
        source: 'hunt'
      }
    }
  },

  // 方法
  methods: {
    /**
     * handleDragOver: 拖拽经过时
     */
    handleDragOver(event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },

    /**
     * handleDragEnter: 拖拽进入时的处理
     */
    handleDragEnter(event) {
      event.preventDefault()
      this.dragEnterCounter++
      this.isDropTarget = true
    },

    /**
     * handleDragLeave: 拖拽离开时的处理
     */
    handleDragLeave(event) {
      this.dragEnterCounter--
      if (this.dragEnterCounter <= 0) {
        this.isDropTarget = false
        this.dragEnterCounter = 0
      }
    },

    /**
     * handleDrop: 处理拖拽放下
     * 当宠物被拖拽到游猎区时调用
     */
    handleDrop(event) {
      // 重置状态
      this.isDropTarget = false
      this.dragEnterCounter = 0

      // 获取拖拽数据
      let data
      try {
        const jsonData = event.dataTransfer.getData('application/json')
        data = JSON.parse(jsonData)
      } catch (e) {
        console.error('解析拖拽数据失败:', e)
        return
      }

      if (data.type !== 'pet') {
        console.log('游猎区只接受宠物')
        return
      }

      // 调用 store 方法让宠物开始战斗
      const success = this.outdoorStore.sendToHunt(data.pet)

      // 只有成功出发战斗，才更新游戏主状态并触发火星喷溅
      if (success) {
        this.gameStore.sendPetOutdoor('hunt')
        this.triggerEmberBurst()
      }
    },

    /**
     * handlePetDragStart: 宠物开始拖拽（从游猎区召回）
     */
    handlePetDragStart(event) {
      event.dataTransfer.effectAllowed = 'move'
      const dataString = JSON.stringify(this.dragData)
      event.dataTransfer.setData('application/json', dataString)
      event.dataTransfer.setData('text/plain', dataString)
    },

    /**
     * handlePetDragEnd: 宠物拖拽结束
     */
    handlePetDragEnd(event) {
      // 拖拽结束，无需额外操作
    },

    /**
     * triggerEmberBurst: 触发火星喷溅特效
     * 宠物落下时从中心爆开 5 个火星
     */
    triggerEmberBurst() {
      const embers = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        active: false,
        style: {
          '--tx': `${(Math.random() - 0.5) * 80}px`,
          '--ty': `${(Math.random() - 0.5) * 60 - 20}px`,
          '--rotation': `${Math.random() * 360}deg`
        }
      }))
      this.emberBurst = embers
      requestAnimationFrame(() => {
        this.$nextTick(() => {
          this.emberBurst = this.emberBurst.map(e => ({ ...e, active: true }))
        })
      })
      this.effectTimer = setTimeout(() => {
        this.emberBurst = []
      }, 1000)
    },

    /**
     * triggerVictory: 触发胜利特效
     */
    triggerVictory() {
      this.showVictory = true
      this.effectTimer = setTimeout(() => {
        this.showVictory = false
      }, 1200)
    },

    /**
     * triggerDefeat: 触发失败特效
     */
    triggerDefeat() {
      this.showDefeat = true
      this.effectTimer = setTimeout(() => {
        this.showDefeat = false
      }, 1500)
    }
  },

  // 生命周期钩子
  beforeUnmount() {
    /**
     * 组件卸载前清理特效定时器，避免内存泄漏
     */
    if (this.effectTimer) {
      clearTimeout(this.effectTimer)
      this.effectTimer = null
    }
  }
}
</script>

<style scoped>
/**
 * 游猎区样式
 * 火山裂隙主题：暗红 + 炭黑 + 岩浆金
 */

/* 区域容器 */
.outdoor-hunt {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 15px 15px;
  border-radius: var(--mp-radius-lg);
  background:
    /* 顶层烟幕/漏光 */
    radial-gradient(ellipse at 50% 0%, rgba(255, 160, 80, 0.15) 0%, transparent 60%),
    /* 远景岩壁 */
    linear-gradient(180deg, #5c2a2a 0%, #4a2020 40%),
    /* 中景主色 */
    linear-gradient(180deg, #6b2d2d 40%, #4a1a1a 100%);
  border: 3px solid var(--mp-ink);
  box-shadow: var(--mp-shadow);
  transition: all 0.3s ease;
  overflow: hidden;
}

/* 顶部裂口轮廓 */
.crater-rim {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 48px;
  z-index: 3;
  pointer-events: none;
}

/* ==================== 岩浆裂纹 ==================== */

.lava-cracks {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 28px;
  pointer-events: none;
  z-index: 1;
}

.crack {
  position: absolute;
  bottom: 6px;
  height: 3px;
  border-radius: 2px;
  background: #f59e0b;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
  animation: lava-pulse 2.5s ease-in-out infinite;
}

.crack-1 {
  left: 20%;
  width: 30%;
  animation-delay: 0s;
}

.crack-2 {
  left: 45%;
  width: 25%;
  bottom: 14px;
  animation-delay: -0.8s;
}

.crack-3 {
  left: 55%;
  width: 28%;
  animation-delay: -1.6s;
}

@keyframes lava-pulse {
  0%, 100% { opacity: 0.4; box-shadow: 0 0 4px rgba(245, 158, 11, 0.3); }
  50%      { opacity: 1;   box-shadow: 0 0 12px rgba(245, 158, 11, 0.9); }
}

/* ==================== 火星 ==================== */

.embers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.ember {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: radial-gradient(circle, #fbbf24 0%, #f59e0b 100%);
  box-shadow: 0 0 4px rgba(251, 191, 36, 0.8);
  animation: ember-rise 4s ease-out infinite;
}

.ember-1 { bottom: 10px; left: 25%; animation-delay: 0s; }
.ember-2 { bottom: 8px;  left: 45%; animation-delay: -0.7s; width: 4px; height: 4px; }
.ember-3 { bottom: 12px; left: 60%; animation-delay: -1.4s; }
.ember-4 { bottom: 6px;  left: 75%; animation-delay: -2.1s; width: 3px; height: 3px; }
.ember-5 { bottom: 15px; left: 35%; animation-delay: -2.8s; width: 4px; height: 4px; }
.ember-6 { bottom: 9px;  left: 85%; animation-delay: -3.5s; }

@keyframes ember-rise {
  0%   { transform: translate(0, 0) scale(1); opacity: 0; }
  10%  { opacity: 0.9; }
  50%  { transform: translate(10px, -60px) scale(0.8); }
  90%  { opacity: 0.4; }
  100% { transform: translate(20px, -120px) scale(0.2); opacity: 0; }
}

/* ==================== 烟雾 ==================== */

.smoke {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.smoke-puff {
  position: absolute;
  bottom: 20px;
  width: 40px;
  height: 20px;
  border-radius: 50%;
  background: rgba(80, 60, 60, 0.4);
  filter: blur(6px);
  animation: smoke-rise 7s ease-out infinite;
}

.smoke-1 { left: 10%; animation-delay: 0s; }
.smoke-2 { right: 15%; animation-delay: -2.5s; }
.smoke-3 { left: 50%; animation-delay: -5s; }

@keyframes smoke-rise {
  0%   { transform: translateY(0) scale(0.6); opacity: 0; }
  20%  { opacity: 0.5; }
  100% { transform: translateY(-160px) scale(1.8); opacity: 0; }
}

/* ==================== 硫磺闪光 ==================== */

.sulfur-flashes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.sulfur-flash {
  position: absolute;
  top: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.9);
  opacity: 0;
  animation: sulfur-flash 5s ease-in-out infinite;
}

.flash-1 { left: 25%; animation-delay: 0s; }
.flash-2 { right: 30%; animation-delay: -2.5s; }

@keyframes sulfur-flash {
  0%, 90%, 100% { opacity: 0; transform: scale(0.5); }
  92%           { opacity: 1; transform: scale(1.2); }
  96%           { opacity: 0.6; transform: scale(1); }
}

/* ==================== 火蝠 ==================== */

.fire-bats {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.fire-bat {
  position: absolute;
  width: 24px;
  height: 18px;
  filter: hue-rotate(-30deg) brightness(0.9) sepia(0.4);
  animation: fire-bat-fly 6s ease-in-out infinite;
}

.fire-bat-1 { top: 25%; left: 15%; animation-delay: 0s; }
.fire-bat-2 { top: 40%; right: 12%; animation-delay: -3s; }

@keyframes fire-bat-fly {
  0%, 100% { transform: translate(0, 0) scaleX(1); }
  25% { transform: translate(30px, -15px) scaleX(-1); }
  50% { transform: translate(60px, 5px) scaleX(1); }
  75% { transform: translate(20px, 15px) scaleX(-1); }
}

/* ==================== 区域标题 ==================== */

.zone-header {
  position: relative;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 42px;
  margin-bottom: 6px;
}

.title-group {
  display: flex;
  align-items: center;
}

.zone-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.zone-name {
  font-size: 18px;
  font-weight: bold;
  color: var(--mp-ink);
}

.zone-safety {
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
}

.zone-safety.danger {
  background: color-mix(in srgb, var(--mp-red) 50%, transparent);
  color: var(--mp-ink);
  border: 1px solid var(--mp-red);
}

.reward-badge {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--mp-gold);
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
  color: var(--mp-ink);
}

/* ==================== 区域说明 ==================== */

.zone-description {
  position: relative;
  z-index: 4;
  text-align: center;
  font-size: 11px;
  color: var(--mp-text-muted);
  margin-bottom: 10px;
}

.warning-text {
  color: var(--mp-red);
  font-weight: bold;
}

/* ==================== 宠物区域 ==================== */

.pet-area {
  position: relative;
  z-index: 4;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
}

/* 空状态提示 */
.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--mp-text-muted);
}

.empty-torch {
  font-size: 28px;
  margin-bottom: 8px;
  animation: torch-flicker 2s ease-in-out infinite;
  opacity: 0.8;
}

.hint-text {
  font-size: 14px;
}

.ignite-circle {
  width: 56px;
  height: 56px;
  margin-top: 8px;
  border: 2px dashed rgba(245, 158, 11, 0.4);
  border-radius: 50%;
  animation: ignite-pulse 2s ease-in-out infinite;
}

@keyframes torch-flicker {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
}

@keyframes ignite-pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

/* ==================== 拖拽高亮：热量积聚 ==================== */

.outdoor-hunt.drop-target {
  border-color: var(--mp-gold);
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
}

.outdoor-hunt.drop-target .crack {
  animation-duration: 0.8s;
  background: #fbbf24;
}

.outdoor-hunt.drop-target .ember {
  animation-duration: 1.5s;
}

.outdoor-hunt.drop-target .smoke-puff {
  animation-duration: 3s;
}

/* ==================== 战斗震动 ==================== */

.outdoor-hunt.combat-active {
  animation: hunt-shake 0.25s ease-in-out infinite;
}

@keyframes hunt-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-1px); }
  75% { transform: translateX(1px); }
}

/* ==================== 火星喷溅（拖放反馈） ==================== */

.ember-burst {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  pointer-events: none;
}

.burst-ember {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 4px rgba(251, 191, 36, 0.9);
  transition: transform 0.8s ease-out, opacity 0.8s ease-out;
  transform: translate(0, 0) rotate(var(--rotation, 0deg));
  opacity: 1;
}

.burst-ember.fly {
  transform: translate(var(--tx, 0), var(--ty, 0)) rotate(var(--rotation, 0deg));
  opacity: 0;
}

/* ==================== 胜利特效：金币火花 ==================== */

.victory-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 7;
  pointer-events: none;
  width: 100px;
  height: 100px;
}

.victory-spark {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 14px;
  opacity: 0;
  animation: spark-burst 1.2s ease-out forwards;
}

.victory-spark.spark-1 { animation-delay: 0s;   --tx: -30px; --ty: -40px; }
.victory-spark.spark-2 { animation-delay: 0.1s; --tx: 30px;  --ty: -35px; }
.victory-spark.spark-3 { animation-delay: 0.2s; --tx: -20px; --ty: 30px; }
.victory-spark.spark-4 { animation-delay: 0.3s; --tx: 35px;  --ty: 25px; }
.victory-spark.spark-5 { animation-delay: 0.4s; --tx: 0;     --ty: -50px; }

@keyframes spark-burst {
  0%   { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
  20%  { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
  100% { transform: translate(calc(-50% + var(--tx, 0)), calc(-50% + var(--ty, 0))) scale(0.8); opacity: 0; }
}

/* ==================== 失败特效：黑烟遮罩 ==================== */

.defeat-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 10, 10, 0.55);
  z-index: 7;
  pointer-events: none;
  animation: defeat-fade 1.5s ease-out forwards;
}

@keyframes defeat-fade {
  0%   { opacity: 0; }
  30%  { opacity: 1; }
  100% { opacity: 0; }
}

/* ==================== 减少动态效果偏好 ==================== */

@media (prefers-reduced-motion: reduce) {
  .outdoor-hunt,
  .outdoor-hunt.combat-active,
  .outdoor-hunt.drop-target,
  .crack,
  .ember,
  .smoke-puff,
  .sulfur-flash,
  .fire-bat,
  .empty-torch,
  .ignite-circle {
    animation: none !important;
    transition: none !important;
  }

  .burst-ember,
  .victory-spark,
  .defeat-overlay {
    transition: none !important;
    animation: none !important;
  }
}
</style>
```

- [ ] **Step 3: 运行开发服务器验证基础渲染**

```bash
npm run dev
```

在浏览器中访问 `http://localhost:5173`，确认：
- 游猎区显示火山裂隙顶部轮廓；
- 背景为暗红色渐变，不是原来的单一红色；
- 标题区左中右三段式布局正确；
- 危险标签和收益徽章位置正确；
- 空状态显示火把、提示文字和符文圈；
- 没有 Vue 编译错误。

- [ ] **Step 4: 提交**

```bash
git add src/components/OutdoorHunt.vue
git rm src/components/OutdoorHunt.vue.bak || true
git commit -m "feat(hunt): rewrite OutdoorHunt.vue with volcanic rift theme

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 3: 验证交互反馈与可访问性

**Files:**
- Modify: `src/components/OutdoorHunt.vue`（仅微调，已在 Task 2 完成）

**Interfaces:**
- Consumes: 现有拖拽逻辑与 store 方法。
- Produces: 确认所有动画和交互按设计运行。

- [ ] **Step 1: 验证拖放交互**

运行 `npm run dev`，按顺序测试：

1. 从水晶球拖拽宠物到游猎区；
2. 确认：
   - 拖拽进入时边框变金色、裂纹脉动加快、火星上升加快；
   - 放下时触发火星喷溅（5 个火星从中心爆开）；
   - 宠物开始战斗，区域轻微震动；
3. 将宠物从游猎区拖回水晶球；
4. 确认召回成功，无报错。

- [ ] **Step 2: 验证战斗结果反馈**

1. 送宠物去战斗；
2. 等待 5 秒战斗结束；
3. 如果是胜利：确认出现金色火花飞溅效果；
4. 如果是失败：确认出现黑烟遮罩变暗效果；
5. 多次测试以覆盖胜负两种情况。

- [ ] **Step 3: 验证减少动态效果偏好**

在浏览器 DevTools 中启用 `prefers-reduced-motion: reduce`：

- Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion` → `reduce`。

确认：
- 火星、烟雾、裂纹、火蝠、震动、火把闪烁全部停止；
- 拖放和战斗功能仍然可用；
- 胜利/失败特效不再播放。

- [ ] **Step 4: 验证响应式布局**

调整浏览器窗口宽度：
- 桌面端（>1024px）：三栏布局正常，游猎区宽度约 260px；
- 平板/移动端：面板堆叠或收缩时，游猎区内容不溢出、宠物居中。

- [ ] **Step 5: 检查未使用代码**

确认 `src/components/OutdoorHunt.vue` 中不再引用 `CoinBagIcon`（已从模板中移除）。
如果 ESLint 报错未使用导入，删除该 import 行。当前 Task 2 代码中已无 `CoinBagIcon` import，故无需额外操作。

- [ ] **Step 6: 最终提交**

如果 Task 3 中有任何微调，提交：

```bash
git add src/components/OutdoorHunt.vue
git commit -m "fix(hunt): fine-tune combat feedback and reduced-motion support

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Self-Review

### 1. Spec coverage

对照 `docs/superpowers/specs/2026-07-17-hunt-volcanic-rift-design.md`：

| 设计需求 | 实现任务 |
|---------|---------|
| 顶部焦黑岩石剪影 `CraterRim` | Task 1 |
| 四层火山背景 | Task 2 `.outdoor-hunt` background |
| 火星/烟雾/裂纹/火蝠/硫磺闪光 | Task 2 动态元素 |
| 战斗震动 | Task 2 `.combat-active` |
| 空状态符文圈 + 火把 | Task 2 `.empty-hint` |
| 拖放高亮（热量积聚） | Task 2 `.drop-target` |
| 落下火星喷溅 | Task 2 `triggerEmberBurst` |
| 胜利火花 / 失败黑烟 | Task 2 `triggerVictory` / `triggerDefeat` |
| 收益徽章上移，底部面板移除 | Task 2 `.zone-header` 布局 |
| prefers-reduced-motion | Task 2 `@media` + Task 3 验证 |

无遗漏。

### 2. Placeholder scan

检查计划中的禁用模式：
- 无 "TBD" / "TODO" / "implement later"；
- 无 "Add appropriate error handling" 等模糊描述；
- 每个代码步骤都包含完整代码；
- 无 "Similar to Task N" 引用。

### 3. Type consistency

- 拖拽数据格式保持原有 `type: 'pet', action: 'recall', source: 'hunt'`，与 CrystalBall.vue 和其他区域兼容。
- `outdoorStore.huntingPet` 监听逻辑与 store 中 `finishHunt` 行为一致：战斗结束后 `huntingPet` 被置为 null。
- 未修改任何 store 的 action 或 state 名称。

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-07-17-hunt-volcanic-rift.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
