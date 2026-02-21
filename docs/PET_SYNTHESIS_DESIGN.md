# Magic Potion 宠物合成系统设计文档

> **文档版本**: 1.0
> **最后更新**: 2026-02-21
> **文档状态**: 设计中，待开发实现
> **对应版本**: V1.2 内容扩展

---

## 目录

1. [概述](#第一部分概述)
2. [碎片系统](#第二部分碎片系统)
3. [宠物种类](#第三部分宠物种类)
4. [合成配方](#第四部分合成配方)
5. [合成流程](#第五部分合成流程)
6. [UI设计](#第六部分ui设计)
7. [数值设计](#第七部分数值设计)
8. [技术实现](#第八部分技术实现)
9. [版本规划](#第九部分版本规划)

---

## 第一部分：概述

### 1.1 系统定位

宠物合成系统是 Magic Potion V1.2 的核心内容扩展，为玩家提供**长期收集目标**和**宠物多样性**。

#### 核心循环扩展

```
┌─────────────────────────────────────────────────────────────┐
│                    扩展后的核心循环                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────┐     派遣      ┌──────────┐     掉落          │
│   │  户外区   │ ◄─────────── │  宠物    │ ◄────────┐        │
│   │          │              │ (水晶球) │          │        │
│   └────┬─────┘              └────┬─────┘          │        │
│        │                         │               │        │
│        ▼                         ▼               │        │
│   ┌──────────────────────────────────────┐      │        │
│   │           碎片收集循环                │      │        │
│   │  ┌──────────┐    合成    ┌──────────┐ │      │        │
│   │  │  碎片    │ ────────► │  新宠物  │─┘      │        │
│   │  │ (背包)   │           │ (图鉴)   │◄───────┘        │
│   │  └────▲─────┘           └──────────┘                │
│   │       │                    │                         │
│   │       └────────────────────┘                         │
│   │              掉落碎片                                   │
│   └──────────────────────────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 设计目标

| 目标 | 说明 | 实现方式 |
|------|------|---------|
| **长期留存** | 给玩家持续的游戏目标 | 收集全部4种宠物 |
| **风险补偿** | 平衡游猎区的死亡风险 | 碎片作为战斗额外奖励 |
| **社交炫耀** | 稀有宠物作为成就象征 | 宠物图鉴展示 |
| **策略深度** | 资源分配决策 | 合成成本 vs 养成收益 |

### 1.3 系统关联图

```
                    ┌─────────────────┐
                    │   宠物合成系统   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   战斗系统     │   │   背包系统     │   │   宠物系统     │
│  (碎片掉落)    │   │  (碎片存储)    │   │  (宠物收集)    │
└───────────────┘   └───────────────┘   └───────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   商店系统       │
                    │  (药水购买)      │
                    └─────────────────┘
```

---

## 第二部分：碎片系统

### 2.1 碎片分类

#### 2.1.1 按宠物类型分类

| 碎片类型 | 图标 | 对应宠物 | 稀有度 | 描述 |
|----------|------|----------|--------|------|
| 猫之碎片 | 🐱 | 小紫（蛞蝓猫） | 普通 | 蛞蝓猫的魔力残片，散发着温柔的紫色光芒 |
| 鸟之碎片 | 🐦 | 青鸟（风羽鸟） | 稀有 | 风羽鸟脱落的羽毛结晶，轻盈如空气 |
| 狐之碎片 | 🦊 | 赤狐（焰尾狐） | 稀有 | 焰尾狐尾巴上掉落的火星凝结而成 |
| 龙之碎片 | 🐉 | 晶晶（晶石龙） | 史诗 | 晶石龙鳞片上的微小结晶，蕴含古老魔力 |

#### 2.1.2 物品属性定义

```javascript
// 碎片物品数据结构
{
  id: 101,                    // 物品ID（100+系列为碎片）
  name: '猫之碎片',            // 显示名称
  icon: '🐱',                 // 图标
  category: 'fragment',       // 物品分类：碎片
  fragmentType: 'cat',        // 碎片类型标识
  rarity: 'common',           // 稀有度
  description: '蛞蝓猫的魔力残片，用于合成蛞蝓猫',
  flavorText: '据说收集足够多的碎片，就能呼唤来新的伙伴',
  stackable: true,            // 可堆叠
  maxStack: 999               // 最大堆叠数
}
```

### 2.2 碎片获取途径

#### 2.2.1 来源概率表

| 来源 | 概率 | 掉落碎片类型 | 说明 |
|------|------|-------------|------|
| 森林玩耍 | 10% | 随机 | 安全但效率较低的获取方式 |
| 游猎战斗 | 10% | 随机 | 高风险高回报 |
| 宠物开心度100 | 5% | 对应宠物类型 | 照顾宠物的额外奖励 |
| 宠物升级 | 20% | 对应宠物类型 | 升级时获得（将来实现） |

#### 2.2.2 掉落概率详情

**森林玩耍掉落**
```javascript
// 森林区掉落权重（10%总概率）
const forestDropWeights = {
  'cat': 50,      // 50% 猫之碎片
  'bird': 30,     // 30% 鸟之碎片
  'fox': 15,      // 15% 狐之碎片
  'dragon': 5     // 5% 龙之碎片
}
```

**游猎战斗掉落**
```javascript
// 游猎区掉落权重（10%总概率，但稀有度更高）
const huntDropWeights = {
  'cat': 30,      // 30% 猫之碎片
  'bird': 35,     // 35% 鸟之碎片
  'fox': 25,      // 25% 狐之碎片
  'dragon': 10    // 10% 龙之碎片
}
```

**开心度奖励**
```javascript
// 当宠物心情达到100时，有5%概率获得对应碎片
// 触发条件：饱食度>80 + 心情=100
// 碎片类型：与当前宠物类型一致
const happinessReward = {
  chance: 0.05,
  fragmentType: currentPet.type  // 当前宠物对应的碎片类型
}
```

### 2.3 碎片存储

- **存储位置**：背包系统（category: 'fragment'）
- **堆叠机制**：同类型碎片自动堆叠，上限999
- **显示方式**：在背包中显示为"猫之碎片 x12"格式

---

## 第三部分：宠物种类

### 3.1 宠物设计总览

| 宠物ID | 名称 | 基础形象 | 特点 | 被动技能 | 稀有度 |
|--------|------|----------|------|----------|--------|
| 1 | 小紫（蛞蝓猫） | 🐱+🐌 | 初始宠物，平衡型 | 无 | 普通 |
| 2 | 青鸟（风羽鸟） | 🐦+💨 | 速度型，探险专家 | 迅捷之风：探险时间-20% | 稀有 |
| 3 | 赤狐（焰尾狐） | 🦊+🔥 | 攻击型，战斗专家 | 战斗狂热：战斗奖励+15% | 稀有 |
| 4 | 晶晶（晶石龙） | 🐉+💎 | 防御型，生存专家 | 晶石护盾：死亡概率-5% | 史诗 |

### 3.2 详细宠物设计

#### 3.2.1 小紫 - 蛞蝓猫（Slugcat）

```javascript
{
  id: 1,
  name: '小紫',
  type: 'cat',
  emoji: '🐌',
  emojiSecondary: '🐱',
  rarity: 'common',
  description: '一只可爱的蛞蝓猫，有着蜗牛的壳和猫的灵活',
  lore: '小紫是你在魔法水晶球中发现的第一只宠物，它温柔而忠诚，是你冒险旅程的最佳伙伴',
  baseStats: {
    hunger: 80,
    mood: 70,
    health: 100,
    maxHunger: 100,
    maxMood: 100,
    maxHealth: 100
  },
  passiveSkill: null,  // 初始宠物无被动技能
  unlockCondition: '初始获得',
  specialAnimations: {
    idle: 'earWiggle',
    happy: 'jump',
    eating: 'bounce'
  }
}
```

#### 3.2.2 青鸟 - 风羽鸟（Wind Feather）

```javascript
{
  id: 2,
  name: '青鸟',
  type: 'bird',
  emoji: '🐦',
  emojiSecondary: '💨',
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
    value: 0.2,  // 减少20%
    icon: '💨'
  },
  unlockCondition: '合成获得',
  specialAnimations: {
    idle: 'float',      // 轻微漂浮
    happy: 'flyCircle', // 绕圈飞行
    eating: 'peck'      // 啄食动作
  }
}
```

#### 3.2.3 赤狐 - 焰尾狐（Flame Tail）

```javascript
{
  id: 3,
  name: '赤狐',
  type: 'fox',
  emoji: '🦊',
  emojiSecondary: '🔥',
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
    value: 0.15,  // 增加15%
    icon: '🔥'
  },
  unlockCondition: '合成获得',
  specialAnimations: {
    idle: 'tailFlame',   // 尾巴火焰摇曳
    happy: 'fireJump',   // 带火焰的跳跃
    eating: 'quickBite'  // 快速咬食
  }
}
```

#### 3.2.4 晶晶 - 晶石龙（Crystal Dragon）

```javascript
{
  id: 4,
  name: '晶晶',
  type: 'dragon',
  emoji: '🐉',
  emojiSecondary: '💎',
  rarity: 'epic',
  description: '由纯净水晶构成的幼龙，拥有最强的防御力',
  lore: '晶石龙是远古龙族的后裔，它们的身体由魔法水晶构成，能够抵御大多数伤害',
  baseStats: {
    hunger: 90,
    mood: 60,
    health: 120,  // 额外生命值
    maxHunger: 100,
    maxMood: 100,
    maxHealth: 120  // 更高上限
  },
  passiveSkill: {
    name: '晶石护盾',
    description: '游猎死亡概率降低5%',
    effect: 'death_chance_reduce',
    value: 0.05,  // 降低5%
    icon: '💎'
  },
  unlockCondition: '合成获得',
  specialAnimations: {
    idle: 'crystalShine', // 水晶闪光
    happy: 'wingFlap',    // 翅膀拍打
    eating: 'crystalGlow' // 进食时全身发光
  }
}
```

### 3.3 宠物对比表

| 属性 | 小紫 | 青鸟 | 赤狐 | 晶晶 |
|------|------|------|------|------|
| 初始饱食度 | 80 | 75 | 85 | 90 |
| 初始心情 | 70 | 75 | 65 | 60 |
| 初始健康 | 100 | 90 | 95 | 120 |
| 探险时间 | 标准 | -20% | 标准 | 标准 |
| 战斗奖励 | 标准 | 标准 | +15% | 标准 |
| 死亡概率 | 10% | 10% | 10% | 5% |
| 合成难度 | 无 | 中等 | 中等 | 困难 |

---

## 第四部分：合成配方

### 4.1 基础配方表

| 配方名称 | 目标宠物 | 碎片需求 | 药水需求 | 基础成功率 | 保底机制 |
|----------|----------|----------|----------|------------|----------|
| 初级召唤 | 小紫 | 猫之碎片×3 | 普通药水×1 | 70% | 3次失败后+10% |
| 风之召唤 | 青鸟 | 鸟之碎片×5 | 普通药水×1 | 60% | 3次失败后+10% |
| 焰之召唤 | 赤狐 | 狐之碎片×5 | 高级药水×1 | 55% | 3次失败后+10% |
| 龙晶召唤 | 晶晶 | 龙之碎片×10 | 稀有药水×1 | 40% | 5次失败后+10% |

### 4.2 详细配方配置

```javascript
// 合成配方配置
const SYNTHESIS_RECIPES = [
  {
    id: 1,
    name: '初级召唤',
    description: '使用猫之碎片召唤蛞蝓猫',
    targetPetId: 1,           // 小紫
    fragmentType: 'cat',
    fragmentCount: 3,
    requiredPotion: {
      rarity: 'common',       // 普通药水
      count: 1
    },
    baseSuccessRate: 0.7,     // 70%成功率
    pityThreshold: 3,         // 3次失败后触发保底
    pityBonus: 0.1,           // 保底加成10%
    minPlayerLevel: 1,        // 最低玩家等级
    unlockRequirement: null   // 无解锁要求（初始可用）
  },
  {
    id: 2,
    name: '风之召唤',
    description: '使用鸟之碎片召唤风羽鸟',
    targetPetId: 2,           // 青鸟
    fragmentType: 'bird',
    fragmentCount: 5,
    requiredPotion: {
      rarity: 'common',
      count: 1
    },
    baseSuccessRate: 0.6,     // 60%成功率
    pityThreshold: 3,
    pityBonus: 0.1,
    minPlayerLevel: 2,
    unlockRequirement: {
      type: 'pet_owned',
      petId: 1  // 需要先拥有小紫
    }
  },
  {
    id: 3,
    name: '焰之召唤',
    description: '使用狐之碎片召唤焰尾狐',
    targetPetId: 3,           // 赤狐
    fragmentType: 'fox',
    fragmentCount: 5,
    requiredPotion: {
      rarity: 'uncommon',     // 高级药水
      count: 1
    },
    baseSuccessRate: 0.55,    // 55%成功率
    pityThreshold: 3,
    pityBonus: 0.1,
    minPlayerLevel: 3,
    unlockRequirement: {
      type: 'pet_owned',
      petId: 2  // 需要先拥有青鸟
    }
  },
  {
    id: 4,
    name: '龙晶召唤',
    description: '使用龙之碎片召唤晶石龙',
    targetPetId: 4,           // 晶晶
    fragmentType: 'dragon',
    fragmentCount: 10,
    requiredPotion: {
      rarity: 'rare',         // 稀有药水
      count: 1
    },
    baseSuccessRate: 0.4,     // 40%成功率
    pityThreshold: 5,         // 更多失败才触发保底
    pityBonus: 0.1,
    minPlayerLevel: 5,
    unlockRequirement: {
      type: 'pet_owned',
      petId: 3  // 需要先拥有赤狐
    }
  }
]
```

### 4.3 成功率计算

```javascript
// 最终成功率计算公式
function calculateSuccessRate(recipe, playerState) {
  let rate = recipe.baseSuccessRate

  // 1. 保底加成
  const failCount = playerState.synthesisFailCount[recipe.id] || 0
  if (failCount >= recipe.pityThreshold) {
    const pityMultiplier = Math.floor(failCount / recipe.pityThreshold)
    rate += recipe.pityBonus * pityMultiplier
  }

  // 2. 等级加成（每高1级+2%，最高10%）
  const levelDiff = playerState.level - recipe.minPlayerLevel
  if (levelDiff > 0) {
    rate += Math.min(levelDiff * 0.02, 0.1)
  }

  // 3. 上限限制（最高95%）
  return Math.min(rate, 0.95)
}
```

### 4.4 失败处理机制

#### 4.4.1 失败结果

- **碎片**：**保留**，不消耗
- **药水**：**消耗**
- **保底计数**：失败次数+1

#### 4.4.2 大成功机制（可选）

```javascript
// 当成功率超过100%时（不可能，但用于未来扩展）
// 或触发特殊条件时
const GREAT_SUCCESS_CHANCE = 0.1  // 10%大成功概率

// 大成功奖励
const greatSuccessRewards = {
  bonusExp: 50,        // 额外经验
  bonusMood: 20,       // 初始心情更高
  bonusFragments: 1    // 返还1个碎片
}
```

---

## 第五部分：合成流程

### 5.1 流程图

```
点击水晶球
    │
    ▼
打开合成界面
    │
    ▼
选择配方（左侧宠物列表）
    │
    ▼
检查解锁条件
    │
    ├─ 未满足 ────► 显示解锁要求
    │
    └─ 已满足
         │
         ▼
检查材料充足
    │
    ├─ 不足 ──────► 提示获取途径
    │
    └─ 充足
         │
         ▼
点击"开始合成"按钮
    │
    ▼
播放合成动画（3秒）
    │
    ▼
判定结果
    │
    ├─ 失败（按概率）
    │     │
    │     ▼
    │  显示失败界面
    │     - 碎片保留
    │     - 药水消耗
    │     - 保底计数+1
    │
    └─ 成功
          │
          ▼
    显示成功界面
          - 新宠物加入
          - 进入宠物图鉴
          - 可切换使用
```

### 5.2 状态机

```
                    ┌─────────────┐
         ┌─────────│   IDLE      │◄──────────────┐
         │         │  (等待选择)  │               │
         │         └──────┬──────┘               │
         │                │ 选择配方              │
         │                ▼                      │
         │         ┌─────────────┐              │
         │    ┌───│  SELECTED   │              │
         │    │    │  (已选择)    │              │
         │    │    └──────┬──────┘              │
         │    │           │ 检查材料             │
         │    │           ▼                     │
         │    │    ┌─────────────┐    材料不足   │
         │    └───▶│   READY     │──────────────┘
         │    返回  │  (准备合成)  │
         │         └──────┬──────┘
         │                │ 点击合成
         │                ▼
         │         ┌─────────────┐
         │         │ SYNTHESIZING│
         │         │  (合成中)    │
         │         │  播放动画    │
         │         └──────┬──────┘
         │                │ 判定结果
         │                ▼
         │         ┌─────────────┐
         │    ┌───│   SUCCESS   │
         │    │    │  (合成成功)  │
         │    │    └──────┬──────┘
         │    │           │ 获得宠物
         │    │           ▼
         │    │    ┌─────────────┐
         │    └───▶│   RESULT    │──────────────► 结束
         │    关闭  │  (结果展示)  │
         │         └─────────────┘
         │
         │         ┌─────────────┐
         └────────│    FAILED   │
                   │  (合成失败)  │
                   └──────┬──────┘
                          │ 碎片保留
                          ▼
                   ┌─────────────┐
                   │   RESULT    │────────────────► 结束
                   │  (结果展示)  │
                   └─────────────┘
```

### 5.3 交互流程详解

#### 5.3.1 打开合成界面

1. **触发方式**：点击水晶球中央区域
2. **动画效果**：水晶球放大，旋涡加速旋转
3. **界面过渡**：使用 Vue Transition 淡入

#### 5.3.2 选择配方

1. **宠物预览列表**：
   - 已解锁宠物：彩色图标，可点击
   - 未解锁宠物：灰色图标，显示锁标记
   - 当前选中：高亮边框 + 放大效果

2. **解锁条件提示**：
   - 悬停未解锁宠物时显示 Tooltip
   - 显示需要的条件（如"需要先拥有青鸟"）

#### 5.3.3 材料放置

```
┌────────────────────────────────────────┐
│           材料放置区域                   │
├────────────────────────────────────────┤
│                                        │
│   ┌─────┐ ┌─────┐ ┌─────┐   ┌─────┐   │
│   │碎片1│ │碎片2│ │碎片3│   │药水 │   │
│   │ 🐱  │ │ 🐱  │ │ 🐱  │   │ 🧪  │   │
│   └─────┘ └─────┘ └─────┘   └─────┘   │
│                                        │
│   从背包拖拽碎片到上方槽位              │
│   或点击"自动填充"按钮                  │
│                                        │
└────────────────────────────────────────┘
```

#### 5.3.4 合成动画

**阶段1：准备（0-0.5秒）**
- 旋涡开始旋转
- 材料槽发光
- 音效：魔法吟唱开始

**阶段2：融合（0.5-2.5秒）**
- 碎片和药水飞入旋涡中心
- 旋涡颜色随配方变化
  - 初级召唤：紫色
  - 风之召唤：青色
  - 焰之召唤：橙红色
  - 龙晶召唤：彩虹色
- 粒子效果围绕旋涡

**阶段3：爆发（2.5-3秒）**
- 旋涡突然扩大
- 强光闪过
- 宠物形象浮现

#### 5.3.5 结果展示

**成功界面**
```
┌────────────────────────────────────────┐
│              合成成功！                  │
│                                        │
│                 🐦                     │
│              [动画效果]                 │
│                                        │
│            获得了 青鸟！                 │
│                                        │
│   ┌────────────────────────────────┐   │
│   │  被动技能：迅捷之风               │   │
│   │  探险时间减少20%                 │   │
│   └────────────────────────────────┘   │
│                                        │
│        [查看图鉴]  [开始培养]            │
└────────────────────────────────────────┘
```

**失败界面**
```
┌────────────────────────────────────────┐
│              合成失败                    │
│                                        │
│                 💨                     │
│              [消散动画]                 │
│                                        │
│         魔法能量不足，召唤失败            │
│                                        │
│   ┌────────────────────────────────┐   │
│   │  碎片已返还：猫之碎片×3          │   │
│   │  消耗药水：普通药水×1            │   │
│   │  保底进度：1/3                  │   │
│   └────────────────────────────────┘   │
│                                        │
│            [再试一次]                   │
└────────────────────────────────────────┘
```

---

## 第六部分：UI设计

### 6.1 界面布局

```
┌─────────────────────────────────────────────────────────────────┐
│  宠物合成界面                                      [关闭] [X]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌────────────────────────┐  ┌────────────┐  │
│  │              │  │                        │  │            │  │
│  │  宠物列表     │  │      合成动画区         │  │  材料槽    │  │
│  │  (左侧)       │  │      (中央)            │  │  (右侧)    │  │
│  │              │  │                        │  │            │  │
│  │  ┌────────┐  │  │    ╭──────────╮        │  │ ┌────────┐ │  │
│  │  │ 🐌 小紫 │◄─┼──┤  │ 🔮 旋涡  │        │  │ │碎片槽1 │ │  │
│  │  │ 已拥有  │  │  │  ╰──────────╯        │  │ │  🐱    │ │  │
│  │  └────────┘  │  │        ⬇️             │  │ └────────┘ │  │
│  │              │  │   [合成动画效果]       │  │ ┌────────┐ │  │
│  │  ┌────────┐  │  │                        │  │ │碎片槽2 │ │  │
│  │  │ 🐦 青鸟 │  │  │   成功率: 70%         │  │ │  🐱    │ │  │
│  │  │ 可合成  │◄─┼──┤   保底: 0/3           │  │ └────────┘ │  │
│  │  └────────┘  │  │                        │  │ ┌────────┐ │  │
│  │              │  │   [开始合成] 按钮      │  │ │碎片槽3 │ │  │
│  │  ┌────────┐  │  │                        │  │ │  🐱    │ │  │
│  │  │ 🦊 赤狐 │  │  │                        │  │ └────────┘ │  │
│  │  │ 🔒 锁定 │  │  │                        │  │ ┌────────┐ │  │
│  │  └────────┘  │  │                        │  │ │ 药水槽 │ │  │
│  │              │  │                        │  │ │  🧪    │ │  │
│  │  ┌────────┐  │  │                        │  │ └────────┘ │  │
│  │  │ 🐉 晶晶 │  │  │                        │  │            │  │
│  │  │ 🔒 锁定 │  │  │                        │  │ [自动填充] │  │
│  │  └────────┘  │  │                        │  │            │  │
│  │              │  │                        │  └────────────┘  │
│  └──────────────┘  └────────────────────────┘                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  配方信息：初级召唤  |  需要：猫之碎片×3 + 普通药水×1     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 组件设计

#### 6.2.1 宠物预览卡片

```vue
<!-- PetPreview.vue -->
<template>
  <div
    class="pet-preview-card"
    :class="{
      'owned': isOwned,
      'locked': !isUnlocked,
      'selected': isSelected
    }"
    @click="selectPet"
  >
    <!-- 宠物图标 -->
    <div class="pet-avatar">
      <span class="pet-emoji">{{ pet.emoji }}</span>
      <span v-if="pet.emojiSecondary" class="pet-emoji-secondary">
        {{ pet.emojiSecondary }}
      </span>
    </div>

    <!-- 宠物名称 -->
    <div class="pet-name">{{ pet.name }}</div>

    <!-- 状态标签 -->
    <div class="pet-status">
      <span v-if="isOwned" class="status-owned">已拥有</span>
      <span v-else-if="isUnlocked" class="status-available">可合成</span>
      <span v-else class="status-locked">
        <span class="lock-icon">🔒</span>
        未解锁
      </span>
    </div>

    <!-- 稀有度标识 -->
    <div class="rarity-badge" :class="pet.rarity">
      {{ rarityText }}
    </div>
  </div>
</template>
```

#### 6.2.2 材料放置槽

```vue
<!-- SynthesisSlot.vue -->
<template>
  <div
    class="synthesis-slot"
    :class="{
      'empty': !item,
      'filled': item,
      'highlight': isDraggingOver
    }"
    @dragover.prevent
    @drop="onDrop"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
  >
    <!-- 空槽显示 -->
    <template v-if="!item">
      <span class="slot-icon">{{ slotType === 'fragment' ? '🐱' : '🧪' }}</span>
      <span class="slot-label">{{ slotLabel }}</span>
      <span class="slot-requirement">{{ requirementText }}</span>
    </template>

    <!-- 已放置物品 -->
    <template v-else>
      <span class="item-icon">{{ item.icon }}</span>
      <span class="item-name">{{ item.name }}</span>
      <span class="item-count">×{{ item.count }}</span>
      <button class="remove-btn" @click.stop="removeItem">×</button>
    </template>

    <!-- 高亮边框 -->
    <div v-if="isDraggingOver" class="drop-highlight"></div>
  </div>
</template>
```

#### 6.2.3 合成动画组件

```vue
<!-- SynthesisAnimation.vue -->
<template>
  <div class="synthesis-animation" :class="animationPhase">
    <!-- 基础旋涡 -->
    <MagicVortex
      :intensity="vortexIntensity"
      :color="vortexColor"
      :speed="vortexSpeed"
    />

    <!-- 阶段特效 -->
    <div v-if="phase === 'fusing'" class="particle-effects">
      <div
        v-for="i in 20"
        :key="i"
        class="particle"
        :style="particleStyle(i)"
      />
    </div>

    <!-- 爆发特效 -->
    <div v-if="phase === 'burst'" class="burst-effect">
      <div class="flash"></div>
      <div class="shockwave"></div>
    </div>

    <!-- 结果展示 -->
    <div v-if="phase === 'result'" class="result-display">
      <transition name="pop">
        <div v-if="success" class="pet-reveal">
          <span class="revealed-pet">{{ petEmoji }}</span>
        </div>
        <div v-else class="fail-display">
          <span class="fail-icon">💨</span>
        </div>
      </transition>
    </div>
  </div>
</template>
```

### 6.3 动画规范

#### 6.3.1 界面过渡

| 动画 | 时长 | 缓动函数 | 说明 |
|------|------|---------|------|
| 界面打开 | 0.3s | ease-out | 从水晶球中心放大 |
| 界面关闭 | 0.2s | ease-in | 缩小回水晶球 |
| 宠物选择 | 0.2s | ease | 边框高亮过渡 |
| 材料放入 | 0.3s | cubic-bezier(0.68, -0.55, 0.265, 1.55) | 弹性效果 |

#### 6.3.2 合成动画

| 阶段 | 时长 | 效果 | 音效 |
|------|------|------|------|
| 准备 | 0.5s | 旋涡加速，材料发光 | 魔法吟唱 |
| 融合 | 2.0s | 粒子围绕，颜色变化 | 能量汇聚 |
| 爆发 | 0.5s | 强光闪过，冲击波 | 爆发音效 |
| 结果 | 1.0s | 宠物弹出/失败消散 | 成功/失败音效 |

### 6.4 响应式设计

#### 6.4.1 断点适配

| 断点 | 布局调整 |
|------|---------|
| > 1200px | 三栏布局，宠物列表4列 |
| 768-1200px | 宠物列表折叠为下拉选择 |
| < 768px | 垂直堆叠，全屏弹窗 |

#### 6.4.2 移动端适配

```
移动端布局：
┌─────────────────────────┐
│  宠物合成      [关闭]   │
├─────────────────────────┤
│  [下拉选择宠物 ▼]       │
├─────────────────────────┤
│                         │
│     ╭──────────╮        │
│     │  旋涡     │        │
│     ╰──────────╯        │
│                         │
│    成功率: 70%          │
│                         │
├─────────────────────────┤
│  材料槽 (横向滑动)      │
│  [🐱] [🐱] [🐱] [🧪]   │
├─────────────────────────┤
│                         │
│  [开始合成]             │
│                         │
└─────────────────────────┘
```

---

## 第七部分：数值设计

### 7.1 成本收益分析

#### 7.1.1 合成成本表

| 配方 | 碎片成本 | 药水成本 | 期望尝试次数 | 期望总成本 |
|------|----------|----------|--------------|------------|
| 初级召唤 | 3猫之碎片 | 10金币 | 1.43次 | 3碎片 + 14金币 |
| 风之召唤 | 5鸟之碎片 | 10金币 | 1.67次 | 5碎片 + 17金币 |
| 焰之召唤 | 5狐之碎片 | 35金币 | 1.82次 | 5碎片 + 64金币 |
| 龙晶召唤 | 10龙之碎片 | 45金币 | 2.5次 | 10碎片 + 113金币 |

#### 7.1.2 宠物价值评估

| 宠物 | 被动技能价值 | 属性优势 | 综合价值 |
|------|-------------|----------|----------|
| 小紫 | 无 | 无 | 基准 |
| 青鸟 | 时间节省20% ≈ 20%效率提升 | -10健康 | 高 |
| 赤狐 | 15%奖励 ≈ 7.5-15金币/场 | -5健康 | 高 |
| 晶晶 | 生存率翻倍 | +20健康 | 极高 |

#### 7.1.3 投入产出比

```
青鸟收益计算：
- 探险时间减少20% → 同样时间内可多派遣25%
- 假设每天派遣20次
- 额外收益：5次 × 25经验 = 125经验/天
- 价值回收期：约3-5天

赤狐收益计算：
- 战斗奖励+15% → 每场多7.5-15金币
- 假设每天战斗10次
- 额外收益：75-150金币/天
- 价值回收期：约2-3天

晶晶收益计算：
- 死亡概率10% → 5%
- 避免死亡惩罚（60金币复活药水）
- 预期节省：约30金币/10场战斗
- 价值回收期：约4-5天
```

### 7.2 碎片获取效率

#### 7.2.1 每日预期获取量

| 活动 | 次数/天 | 单次概率 | 预期碎片/天 |
|------|---------|----------|-------------|
| 森林玩耍 | 20次 | 10% | 2个 |
| 游猎战斗 | 10次 | 10% | 1个 |
| 开心度奖励 | 5次 | 5% | 0.25个 |
| **总计** | - | - | **3.25个/天** |

#### 7.2.2 合成所需时间

| 配方 | 所需碎片 | 预期获取天数 | 备注 |
|------|----------|--------------|------|
| 初级召唤 | 3 | 1天 | 入门门槛 |
| 风之召唤 | 5 | 1.5天 | 早期目标 |
| 焰之召唤 | 5 | 2天 | 中期目标 |
| 龙晶召唤 | 10 | 3天 | 长期目标 |

### 7.3 平衡性分析

#### 7.3.1 风险与回报

| 策略 | 风险 | 回报 | 适合玩家 |
|------|------|------|----------|
| 专注森林 | 低 | 碎片获取稳定 | 休闲玩家 |
| 专注游猎 | 中（死亡） | 金币+碎片 | 进取玩家 |
| 平衡发展 | 中 | 全面发展 | 大多数玩家 |

#### 7.3.2 经济平衡

- **碎片获取率**：控制在每天2-4个，保证1-3天可以合成一只新宠物
- **药水消耗**：合成药水成本占总金币收入的20-30%
- **长期目标**：收集全部4只宠物需要约7-8天游戏时间

---

## 第八部分：技术实现

### 8.1 文件结构

```
src/
  stores/
    synthesis.js          # 合成状态管理
    petCollection.js      # 宠物图鉴/收集
    fragments.js          # 碎片掉落管理
  components/
    synthesis/
      SynthesisUI.vue         # 合成主界面
      PetPreview.vue          # 宠物预览卡片
      SynthesisSlot.vue       # 材料放置槽
      SynthesisAnimation.vue  # 合成动画
      SynthesisResult.vue     # 结果展示
      PetCollection.vue       # 宠物图鉴界面
  config/
    synthesisRecipes.js   # 合成配方配置
    petTypes.js           # 宠物类型定义
    fragmentTypes.js      # 碎片类型定义
```

### 8.2 数据结构设计

#### 8.2.1 宠物类型配置

```javascript
// src/config/petTypes.js
export const PET_TYPES = {
  cat: {
    id: 1,
    name: '小紫',
    type: 'cat',
    emoji: '🐌',
    emojiSecondary: '🐱',
    rarity: 'common',
    description: '一只可爱的蛞蝓猫',
    baseStats: { hunger: 80, mood: 70, health: 100 },
    passiveSkill: null,
    isStarter: true  // 初始宠物
  },
  bird: {
    id: 2,
    name: '青鸟',
    type: 'bird',
    emoji: '🐦',
    emojiSecondary: '💨',
    rarity: 'rare',
    description: '拥有风之力量的神鸟',
    baseStats: { hunger: 75, mood: 75, health: 90 },
    passiveSkill: {
      name: '迅捷之风',
      effect: 'explore_time_reduce',
      value: 0.2,
      icon: '💨'
    }
  },
  // ... 更多宠物类型
}

export function getPetType(type) {
  return PET_TYPES[type]
}

export function getAllPetTypes() {
  return Object.values(PET_TYPES)
}
```

#### 8.2.2 碎片类型配置

```javascript
// src/config/fragmentTypes.js
export const FRAGMENT_TYPES = {
  cat: {
    id: 101,
    name: '猫之碎片',
    icon: '🐱',
    fragmentType: 'cat',
    rarity: 'common',
    description: '蛞蝓猫的魔力残片',
    flavorText: '收集足够多就能呼唤新的伙伴'
  },
  bird: {
    id: 102,
    name: '鸟之碎片',
    icon: '🐦',
    fragmentType: 'bird',
    rarity: 'rare',
    description: '风羽鸟的羽毛结晶',
    flavorText: '轻盈如空气，散发着自由的气息'
  },
  // ... 更多碎片类型
}

// 碎片掉落权重配置
export const FRAGMENT_DROP_WEIGHTS = {
  forest: {
    cat: 50,
    bird: 30,
    fox: 15,
    dragon: 5
  },
  hunt: {
    cat: 30,
    bird: 35,
    fox: 25,
    dragon: 10
  }
}
```

#### 8.2.3 合成配方配置

```javascript
// src/config/synthesisRecipes.js
export const SYNTHESIS_RECIPES = [
  {
    id: 1,
    name: '初级召唤',
    description: '使用猫之碎片召唤蛞蝓猫',
    targetPetId: 1,
    fragmentType: 'cat',
    fragmentCount: 3,
    requiredPotion: { rarity: 'common', count: 1 },
    baseSuccessRate: 0.7,
    pityThreshold: 3,
    pityBonus: 0.1,
    minPlayerLevel: 1
  },
  // ... 更多配方
]

export function getRecipeById(id) {
  return SYNTHESIS_RECIPES.find(r => r.id === id)
}

export function getRecipeForPet(petId) {
  return SYNTHESIS_RECIPES.find(r => r.targetPetId === petId)
}
```

### 8.3 Store设计

#### 8.3.1 synthesis.js - 合成状态管理

```javascript
// src/stores/synthesis.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { SYNTHESIS_RECIPES } from '../config/synthesisRecipes.js'
import { calculateSuccessRate } from '../utils/synthesis.js'

export const useSynthesisStore = defineStore('synthesis', () => {
  // State
  const selectedRecipeId = ref(null)
  const synthesisSlots = ref({
    fragment1: null,
    fragment2: null,
    fragment3: null,
    potion: null
  })
  const isSynthesizing = ref(false)
  const synthesisPhase = ref('idle') // idle, preparing, fusing, burst, result
  const synthesisResult = ref(null) // { success: boolean, pet: object }
  const failCount = ref({}) // 各配方的失败次数 { recipeId: count }

  // Getters
  const selectedRecipe = computed(() => {
    return SYNTHESIS_RECIPES.find(r => r.id === selectedRecipeId.value)
  })

  const currentSuccessRate = computed(() => {
    if (!selectedRecipe.value) return 0
    return calculateSuccessRate(
      selectedRecipe.value,
      failCount.value[selectedRecipe.value.id] || 0,
      playerLevel.value // 从其他store获取
    )
  })

  const canSynthesize = computed(() => {
    const recipe = selectedRecipe.value
    if (!recipe) return false
    // 检查材料是否足够
    const fragmentCount = Object.values(synthesisSlots.value)
      .filter(slot => slot?.category === 'fragment')
      .length
    const hasPotion = synthesisSlots.value.potion !== null
    return fragmentCount >= recipe.fragmentCount && hasPotion
  })

  // Actions
  function selectRecipe(recipeId) {
    selectedRecipeId.value = recipeId
    clearSlots()
  }

  function addToSlot(slotType, item) {
    if (slotType.startsWith('fragment')) {
      synthesisSlots.value[slotType] = item
    } else if (slotType === 'potion') {
      synthesisSlots.value.potion = item
    }
  }

  function removeFromSlot(slotType) {
    synthesisSlots.value[slotType] = null
  }

  function clearSlots() {
    synthesisSlots.value = {
      fragment1: null,
      fragment2: null,
      fragment3: null,
      potion: null
    }
  }

  async function startSynthesis() {
    if (!canSynthesize.value) return

    isSynthesizing.value = true
    synthesisPhase.value = 'preparing'

    // 播放准备动画
    await wait(500)
    synthesisPhase.value = 'fusing'

    // 播放融合动画
    await wait(2000)
    synthesisPhase.value = 'burst'

    // 判定结果
    const success = Math.random() < currentSuccessRate.value

    // 播放爆发动画
    await wait(500)
    synthesisPhase.value = 'result'

    if (success) {
      // 成功：添加宠物，清空材料
      const pet = createPet(selectedRecipe.value.targetPetId)
      synthesisResult.value = { success: true, pet }
      consumeMaterials()
      failCount.value[selectedRecipe.value.id] = 0
    } else {
      // 失败：保留碎片，消耗药水
      synthesisResult.value = { success: false }
      consumePotionOnly()
      failCount.value[selectedRecipe.value.id] =
        (failCount.value[selectedRecipe.value.id] || 0) + 1
    }
  }

  function resetSynthesis() {
    isSynthesizing.value = false
    synthesisPhase.value = 'idle'
    synthesisResult.value = null
  }

  function consumeMaterials() {
    // 消耗所有材料（碎片+药水）
    // 调用backpack store
  }

  function consumePotionOnly() {
    // 只消耗药水
    // 调用backpack store
  }

  return {
    selectedRecipeId,
    synthesisSlots,
    isSynthesizing,
    synthesisPhase,
    synthesisResult,
    failCount,
    selectedRecipe,
    currentSuccessRate,
    canSynthesize,
    selectRecipe,
    addToSlot,
    removeFromSlot,
    clearSlots,
    startSynthesis,
    resetSynthesis
  }
})
```

#### 8.3.2 petCollection.js - 宠物收集

```javascript
// src/stores/petCollection.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PET_TYPES } from '../config/petTypes.js'

export const usePetCollectionStore = defineStore('petCollection', () => {
  // State
  const ownedPets = ref([{
    instanceId: 'starter_1',
    petType: 'cat',
    ...PET_TYPES.cat.baseStats,
    level: 1,
    experience: 0
  }])
  const activePetId = ref('starter_1')

  // Getters
  const activePet = computed(() => {
    return ownedPets.value.find(p => p.instanceId === activePetId.value)
  })

  const ownedPetTypes = computed(() => {
    return ownedPets.value.map(p => p.petType)
  })

  const isPetOwned = computed(() => (petType) => {
    return ownedPetTypes.value.includes(petType)
  })

  const collectionProgress = computed(() => {
    const total = Object.keys(PET_TYPES).length
    const owned = ownedPets.value.length
    return { owned, total, percentage: (owned / total) * 100 }
  })

  // Actions
  function addPet(petType) {
    const petConfig = PET_TYPES[petType]
    const newPet = {
      instanceId: `pet_${Date.now()}`,
      petType: petType,
      ...petConfig.baseStats,
      level: 1,
      experience: 0
    }
    ownedPets.value.push(newPet)
    return newPet.instanceId
  }

  function setActivePet(instanceId) {
    if (ownedPets.value.find(p => p.instanceId === instanceId)) {
      activePetId.value = instanceId
    }
  }

  function getPetPassiveSkill(petType) {
    return PET_TYPES[petType]?.passiveSkill || null
  }

  return {
    ownedPets,
    activePetId,
    activePet,
    ownedPetTypes,
    isPetOwned,
    collectionProgress,
    addPet,
    setActivePet,
    getPetPassiveSkill
  }
})
```

#### 8.3.3 fragments.js - 碎片管理

```javascript
// src/stores/fragments.js
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useBackpackStore } from './backpack.js'
import { FRAGMENT_DROP_WEIGHTS, FRAGMENT_TYPES } from '../config/fragmentTypes.js'

export const useFragmentStore = defineStore('fragments', () => {
  const backpackStore = useBackpackStore()

  // Getters
  const fragments = computed(() => {
    return backpackStore.items.filter(item => item.category === 'fragment')
  })

  const fragmentCounts = computed(() => {
    const counts = {}
    fragments.value.forEach(item => {
      counts[item.fragmentType] = (counts[item.fragmentType] || 0) + item.quantity
    })
    return counts
  })

  // Actions
  function addFragment(fragmentType, count = 1) {
    const fragmentConfig = FRAGMENT_TYPES[fragmentType]
    backpackStore.addItem({
      ...fragmentConfig,
      quantity: count
    })
  }

  function removeFragments(fragmentType, count) {
    const fragmentItem = fragments.value.find(f => f.fragmentType === fragmentType)
    if (fragmentItem) {
      backpackStore.removeItem(fragmentItem.id, count)
    }
  }

  function hasEnoughFragments(fragmentType, count) {
    return (fragmentCounts.value[fragmentType] || 0) >= count
  }

  // 掉落判定
  function rollFragmentDrop(source, currentPetType) {
    // source: 'forest', 'hunt', 'happiness'
    const dropChances = {
      forest: 0.1,
      hunt: 0.1,
      happiness: 0.05
    }

    if (Math.random() >= dropChances[source]) {
      return null // 未掉落
    }

    // 根据来源选择权重表
    let weights
    if (source === 'happiness') {
      // 开心度奖励：必定获得当前宠物对应的碎片
      return currentPetType
    } else {
      weights = FRAGMENT_DROP_WEIGHTS[source]
    }

    // 按权重随机
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
    let random = Math.random() * totalWeight

    for (const [type, weight] of Object.entries(weights)) {
      random -= weight
      if (random <= 0) {
        return type
      }
    }

    return 'cat' // 默认
  }

  return {
    fragments,
    fragmentCounts,
    addFragment,
    removeFragments,
    hasEnoughFragments,
    rollFragmentDrop
  }
})
```

### 8.4 现有文件修改

#### 8.4.1 outdoor.js - 添加碎片掉落

```javascript
// src/stores/outdoor.js - 修改
import { useFragmentStore } from './fragments.js'
import { usePetCollectionStore } from './petCollection.js'

// 在玩耍/战斗结束时添加掉落判定
function completeActivity(type) {
  const fragmentStore = useFragmentStore()
  const petStore = usePetCollectionStore()

  // ... 原有奖励逻辑 ...

  // 新增：碎片掉落判定
  const source = type === 'play' ? 'forest' : 'hunt'
  const currentPetType = petStore.activePet?.petType || 'cat'
  const droppedFragment = fragmentStore.rollFragmentDrop(source, currentPetType)

  if (droppedFragment) {
    fragmentStore.addFragment(droppedFragment, 1)
    // 触发通知
    notificationStore.addNotification({
      type: 'success',
      title: '获得碎片！',
      message: `获得了1个${FRAGMENT_TYPES[droppedFragment].name}`
    })
  }
}
```

#### 8.4.2 game.js - 添加开心度奖励

```javascript
// src/stores/game.js - 修改 feedPet 方法
import { useFragmentStore } from './fragments.js'
import { usePetCollectionStore } from './petCollection.js'

function feedPet(item) {
  // ... 原有喂食逻辑 ...

  // 新增：检查开心度100奖励
  const petStore = usePetCollectionStore()
  const fragmentStore = useFragmentStore()

  if (pet.mood === 100 && pet.hunger > 80) {
    // 5%概率获得对应碎片
    if (Math.random() < 0.05) {
      const currentPetType = petStore.activePet?.petType || 'cat'
      fragmentStore.addFragment(currentPetType, 1)
      notificationStore.addNotification({
        type: 'success',
        title: '宠物很开心！',
        message: `宠物送给了你1个碎片作为礼物`
      })
    }
  }
}
```

#### 8.4.3 backpack.js - 支持碎片分类

```javascript
// src/stores/backpack.js - 添加分类支持
const VALID_CATEGORIES = [
  'food', 'mood', 'combat', 'charm', 'special',
  'fragment'  // 新增碎片分类
]
```

### 8.5 工具函数

```javascript
// src/utils/synthesis.js

/**
 * 计算合成成功率
 */
export function calculateSuccessRate(recipe, failCount, playerLevel) {
  let rate = recipe.baseSuccessRate

  // 保底加成
  if (failCount >= recipe.pityThreshold) {
    const pityMultiplier = Math.floor(failCount / recipe.pityThreshold)
    rate += recipe.pityBonus * pityMultiplier
  }

  // 等级加成
  const levelDiff = playerLevel - recipe.minPlayerLevel
  if (levelDiff > 0) {
    rate += Math.min(levelDiff * 0.02, 0.1)
  }

  return Math.min(rate, 0.95)
}

/**
 * 创建新宠物实例
 */
export function createPet(petTypeId) {
  const petConfig = PET_TYPES[Object.keys(PET_TYPES).find(
    key => PET_TYPES[key].id === petTypeId
  )]

  return {
    instanceId: `pet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    petType: petConfig.type,
    name: petConfig.name,
    level: 1,
    experience: 0,
    ...petConfig.baseStats,
    status: 'idle',
    isAtHome: true,
    isDead: false
  }
}

/**
 * 检查配方解锁条件
 */
export function checkUnlockRequirement(recipe, ownedPetTypes) {
  if (!recipe.unlockRequirement) return true

  switch (recipe.unlockRequirement.type) {
    case 'pet_owned':
      return ownedPetTypes.includes(
        PET_TYPES[Object.keys(PET_TYPES).find(
          key => PET_TYPES[key].id === recipe.unlockRequirement.petId
        )]?.type
      )
    default:
      return true
  }
}
```

---

## 第九部分：版本规划

### 9.1 开发阶段

#### 第一阶段：基础系统（1周）

| 任务 | 文件 | 说明 |
|------|------|------|
| 配置定义 | `config/petTypes.js` | 宠物类型定义 |
| 配置定义 | `config/fragmentTypes.js` | 碎片类型定义 |
| 配置定义 | `config/synthesisRecipes.js` | 合成配方定义 |
| Store实现 | `stores/petCollection.js` | 宠物收集管理 |
| Store实现 | `stores/fragments.js` | 碎片管理 |

#### 第二阶段：核心功能（1周）

| 任务 | 文件 | 说明 |
|------|------|------|
| Store实现 | `stores/synthesis.js` | 合成核心逻辑 |
| 组件实现 | `SynthesisUI.vue` | 合成界面框架 |
| 组件实现 | `PetPreview.vue` | 宠物预览卡片 |
| 组件实现 | `SynthesisSlot.vue` | 材料槽组件 |
| 系统集成 | `outdoor.js` | 添加碎片掉落 |
| 系统集成 | `game.js` | 添加开心度奖励 |

#### 第三阶段：体验优化（1周）

| 任务 | 文件 | 说明 |
|------|------|------|
| 组件实现 | `SynthesisAnimation.vue` | 合成动画 |
| 组件实现 | `SynthesisResult.vue` | 结果展示 |
| 组件实现 | `PetCollection.vue` | 宠物图鉴 |
| 音效集成 | `assets/audio/` | 合成音效 |
| 测试调优 | - | 数值平衡 |

### 9.2 里程碑

```
M1: 基础数据层完成
├── 所有配置定义完成
├── Store基础功能实现
└── 碎片掉落集成到户外系统

M2: 核心交互完成
├── 合成界面完整功能
├── 拖拽放置材料
├── 成功/失败判定
└── 宠物添加到收集

M3: 体验打磨完成
├── 动画效果完整
├── 音效系统接入
├── 宠物图鉴界面
└── 数值平衡调优
```

### 9.3 测试计划

| 测试项 | 内容 | 预期结果 |
|--------|------|----------|
| 碎片掉落 | 森林/游猎/开心度各100次 | 概率符合设计 |
| 合成成功率 | 各配方合成50次 | 成功率符合设计 |
| 保底机制 | 连续失败触发保底 | 成功率提升 |
| 材料消耗 | 成功/失败场景 | 碎片保留，药水消耗 |
| 宠物切换 | 拥有多只宠物 | 可正常切换使用 |
| 存档兼容 | 新旧存档 | 自动迁移，无数据丢失 |

### 9.4 存档版本控制

```javascript
// 新增存档版本2：添加宠物合成系统
SAVE_VERSION_HISTORY[2] = {
  version: 2,
  name: '宠物合成系统',
  date: '2026-03-01',
  changes: [
    '新增宠物收集系统',
    '新增碎片系统',
    '新增合成系统'
  ],
  migrate: (saveData) => {
    // 从单宠物迁移到宠物收集
    saveData.petCollection = {
      ownedPets: [{
        instanceId: 'pet_starter',
        petType: 'cat',
        ...saveData.game.pet,
        // 迁移原有属性
      }],
      activePetId: 'pet_starter'
    }
    // 清空碎片数据（从头开始）
    saveData.fragments = {
      items: []
    }
    // 合成数据
    saveData.synthesis = {
      failCount: {}
    }
    return saveData
  }
}
```

---

## 附录

### A. 术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 碎片 | Fragment | 用于合成宠物的材料物品 |
| 配方 | Recipe | 合成特定宠物的配方配置 |
| 保底 | Pity | 连续失败后增加成功率的机制 |
| 宠物图鉴 | Pet Collection | 显示已拥有宠物的界面 |
| 被动技能 | Passive Skill | 宠物天生自带的效果 |

### B. 参考文档

- [DESIGN.md](../DESIGN.md) - 主设计文档
- [ITEM_SYSTEM_DESIGN.md](./ITEM_SYSTEM_DESIGN.md) - 道具系统设计
- [CLAUDE.md](../CLAUDE.md) - 项目指南

### C. 更新日志

| 日期 | 版本 | 变更内容 |
|------|------|---------|
| 2026-02-21 | 1.0 | 初始文档创建 |

---

*本文档由 Claude Code 根据项目需求生成*
*生成时间: 2026-02-21*
*文档版本: 1.0*
