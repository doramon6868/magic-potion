# Magic Potion - 魔法药水

一个基于 Vue 3 的宠物养成游戏，适合初学者学习前端开发。

## 游戏介绍

在这个紫色主题的魔法世界中，你有一个神奇的水晶球，里面住着一只可爱的魔法宠物。通过拖拽操作，你可以：

- **喂养宠物**：从背包拖拽食物到水晶球
- **带宠物玩耍**：拖拽宠物到左侧森林区
- **带宠物战斗**：拖拽宠物到右侧游猎区（有风险！）
- **购买物品**：在商店购买食物

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4+ | 前端框架 |
| Pinia | 2.1+ | 状态管理 |
| v-drag-drop | 1.2+ | 拖拽功能 |
| Naive UI | 2.37+ | UI 组件库 |
| Vite | 5.0+ | 构建工具 |

## 为什么选择这些技术？

- **Vue 3 + Options API**：结构清晰，data/methods 分开，初学者容易理解
- **Pinia**：比 Vuex 简单，没有 mutations，可以直接修改状态
- **v-drag-drop**：封装简单，只有 `v-drag` 和 `v-drop` 两个指令
- **Naive UI**：Vue 3 专用，文档清晰，样式易定制

## 项目结构

```
magic-potion/
├── index.html              # 入口 HTML
├── package.json            # 项目配置
├── vite.config.js          # Vite 配置
├── README.md               # 本文件
├── src/
│   ├── main.js             # 程序入口
│   ├── App.vue             # 根组件
│   ├── components/         # 组件
│   │   ├── CrystalBall.vue    # 水晶球（核心）
│   │   ├── Pet.vue            # 宠物
│   │   ├── Item.vue           # 物品
│   │   ├── MagicVortex.vue    # 魔法旋涡特效
│   │   ├── OutdoorPlay.vue    # 户外玩耍区
│   │   ├── OutdoorHunt.vue    # 游猎区
│   │   ├── TopBar.vue         # 顶部功能栏
│   │   ├── Backpack.vue       # 背包弹窗
│   │   └── Shop.vue           # 商店弹窗
│   └── stores/             # Pinia 状态管理
│       ├── game.js         # 游戏主状态（宠物、金币）
│       ├── backpack.js     # 背包状态
│       ├── outdoor.js      # 户外状态
│       └── shop.js         # 商店状态
```

## 如何运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 打开浏览器

访问 http://localhost:5173

## 游戏玩法

### 基础操作

1. **打开背包**：点击左上角的 🎒 背包按钮
2. **喂养宠物**：从背包拖拽食物到中间的水晶球
3. **带宠物玩耍**：拖拽宠物到左侧 🌲 森林区
4. **带宠物战斗**：拖拽宠物到右侧 ⚔️ 游猎区
5. **召回宠物**：从户外区拖拽宠物回水晶球

### 宠物属性

- **饱食度**（橙色条）：会随时间下降，需要喂食补充
- **心情**（粉色条）：通过玩耍增加
- **健康**（绿色条）：战斗可能损失健康

### 战斗风险

游猎区有 10% 的死亡几率！如果宠物死亡，需要使用复活药水。

## 代码注释说明

每个文件都包含详细的注释，包括：
- 文件顶部说明这个文件的作用
- 每个 data 属性的说明
- 每个 method 的参数和返回值
- 复杂的 CSS 效果解释

适合初学者逐行阅读学习。

## 开发计划

- [x] 项目初始化
- [x] 基础组件（水晶球、宠物、物品）
- [x] 拖拽功能
- [x] 旋涡动画
- [x] 状态管理（Pinia）
- [x] 背包系统
- [x] 商店系统
- [x] 户外探索系统
- [ ] 宠物升级系统
- [ ] 更多宠物种类
- [ ] 音效系统
- [ ] 存档功能

## 学习资源

### Vue 3
- [Vue 官方文档](https://cn.vuejs.org/)
- [Options API 指南](https://cn.vuejs.org/guide/essentials/application.html)

### Pinia
- [Pinia 官方文档](https://pinia.vuejs.org/zh/)

### v-drag-drop
- [GitHub 仓库](https://github.com/rlemaigit/vue3-drag-drop)

### Naive UI
- [Naive UI 文档](https://www.naiveui.com/)

## 许可证

MIT
