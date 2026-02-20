# CLAUDE.md

请用中文和我交流。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Magic Potion** (魔法药水), a pet-raising game design repository. Currently, this is a design-phase project containing only the game design document.

### Core Game Concept

A purple-themed pet raising game centered around a **crystal ball** (水晶球) as the core interaction mechanism:

- **Crystal Ball as World**: The crystal ball is both the pet's living space and a magical portal connecting inner and outer worlds
- **Magic Hole Interaction**: All interactions happen through the "magic hole" (魔法洞) - a vortex portal on the crystal ball surface
- **Drag-and-Drop Gameplay**: Primary interaction is dragging items/pets to/from the crystal ball

### Key Game Systems

| System | Description |
|--------|-------------|
| **Crystal Ball (Internal)** | Pet's home with carpet, toys, floating magic elements |
| **Magic Hole** | Portal for sending items in/out, pets flying in/out |
| **Backpack** | Top-left button - drag items to crystal ball to use |
| **Shop** | Top-right button - buy items directly to backpack |
| **Forest Play Area** | Low-danger exploration zone (left side) |
| **Hunting Zone** | High-risk combat zone with 10% death chance (right side) |

### Pet State Flow

```
At Home (in crystal ball) <---> Outdoor (play/hunt)
       ↑                              │
       └────── Drag to return ────────┘
              (flies back through magic hole)
```

### Key Interactions

1. **Feed Pet**: Open backpack → drag food to crystal ball → magic hole vortex appears → item absorbed → pet fed
2. **Send Out**: Long-press pet → drag to 🌲 forest or ⚔️ hunting zone → pet flies out through magic hole
3. **Recall Home**: Drag outdoor pet back to crystal ball → pet flies back, lands on carpet
4. **Craft Pet**: Click crystal ball → enter synthesis UI → select fragments + potion → new pet born from magic hole

## Development Status

- **Current State**: ✅ Web MVP 实现完成
- **Technology**: Vue 3 + Options API + Pinia + v-drag-drop + Naive UI
- **Language**: Chinese (代码注释和界面)
- **Build System**: Vite

### 已实现功能 ✅

1. **项目架构**
   - Vue 3 + Vite 项目初始化
   - Pinia 状态管理配置
   - v-drag-drop 拖拽插件集成
   - Naive UI 组件库配置

2. **核心组件**
   - `CrystalBall.vue` - 水晶球组件（接收拖拽、显示旋涡）
   - `MagicVortex.vue` - 魔法旋涡特效（CSS 动画）
   - `Pet.vue` - 宠物组件（状态显示、属性条）
   - `Item.vue` - 物品组件（可拖拽）
   - `TopBar.vue` - 顶部功能栏
   - `Backpack.vue` - 背包弹窗
   - `Shop.vue` - 商店弹窗
   - `OutdoorPlay.vue` - 森林玩耍区
   - `OutdoorHunt.vue` - 游猎战斗区

3. **状态管理（Pinia Stores）**
   - `game.js` - 游戏主状态（宠物属性、金币、喂养逻辑）
   - `backpack.js` - 背包状态（物品管理）
   - `shop.js` - 商店状态（商品列表）
   - `outdoor.js` - 户外状态（玩耍/战斗逻辑）

4. **交互功能**
   - 背包 → 水晶球：拖拽物品喂养宠物
   - 水晶球 → 户外区：拖拽宠物外出
   - 户外区 → 水晶球：拖拽宠物召回
   - 商店购买：点击购买，物品进入背包

5. **动画效果**
   - 旋涡动画：多层 CSS @keyframes 旋转
   - 宠物状态动画：睡觉摇摆、开心跳跃、战斗抖动
   - 拖拽反馈：高亮目标区域

## File Structure

```
.
├── CLAUDE.md              # This file
├── DESIGN.md              # Game design document
├── README.md              # Project readme
├── package.json           # Dependencies
├── vite.config.js         # Vite config
├── index.html             # Entry HTML
└── src/
    ├── main.js            # App entry
    ├── App.vue            # Root component
    ├── components/        # Vue components
    │   ├── CrystalBall.vue
    │   ├── MagicVortex.vue
    │   ├── Pet.vue
    │   ├── Item.vue
    │   ├── TopBar.vue
    │   ├── Backpack.vue
    │   ├── Shop.vue
    │   ├── OutdoorPlay.vue
    │   └── OutdoorHunt.vue
    └── stores/            # Pinia stores
        ├── game.js
        ├── backpack.js
        ├── shop.js
        └── outdoor.js
```

## 如何运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器访问 http://localhost:5173
```

## 代码特点（适合初学者）

- **详细注释**：每行代码都有中文注释
- **Options API**：结构清晰，data/methods 分开
- **简单拖拽**：使用 v-drag-drop 插件，只有 `v-drag` 和 `v-drop` 两个指令
- **直接修改状态**：Pinia 允许直接修改 state，无需 mutations
- **纯 CSS 动画**：使用 @keyframes 实现，无需复杂 JS

## Next Steps (后续优化)

- [ ] 宠物飞入飞出动画（使用 Vue Transition）
- [ ] 物品被吸入水晶球的动画
- [ ] 音效系统（喂养、战斗、升级音效）
- [ ] 存档功能（localStorage 保存游戏进度）
- [ ] 更多宠物种类和外观
- [ ] 宠物合成系统（使用碎片合成新宠物）
- [ ] 时间系统（饱食度随真实时间下降）

## 项目约定

### 测试截图存放位置
- **目录**: `test-screenshots/`
- **用途**: 存放 Playwright 测试截图
- **Git**: 已配置忽略，不会被提交
- **使用方式**: 在测试脚本中指定路径，如：
  ```javascript
  await page.screenshot({ path: 'test-screenshots/test-1-initial.png' });
  ```
