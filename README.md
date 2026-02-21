# Magic Potion - 魔法药水

一个基于 Vue 3 的宠物养成游戏，拥有完整的宠物收集、合成、战斗和存档系统。

## 游戏介绍

在这个紫色主题的魔法世界中，你有一个神奇的水晶球，里面住着可爱的魔法宠物。通过拖拽操作，你可以：

- **喂养宠物**：从背包拖拽食物到水晶球
- **带宠物玩耍**：拖拽宠物到左侧森林区
- **带宠物战斗**：拖拽宠物到右侧游猎区（有风险！）
- **购买物品**：在商店购买食物、道具、碎片
- **收集宠物**：通过合成系统获得多种宠物
- **切换语言**：支持中英文界面切换

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4+ | 前端框架 |
| Pinia | 2.1+ | 状态管理 |
| v-drag-drop | 4.0+ | 拖拽功能 |
| Naive UI | 2.37+ | UI 组件库 |
| Vite | 5.0+ | 构建工具 |
| vue-i18n | 9.14+ | 国际化支持 |
| Playwright | 1.58+ | 测试框架 |

## 为什么选择这些技术？

- **Vue 3 + Options API**：结构清晰，data/methods 分开，初学者容易理解
- **Pinia**：比 Vuex 简单，没有 mutations，可以直接修改状态
- **v-drag-drop**：封装简单，只有 `v-drag` 和 `v-drop` 两个指令
- **Naive UI**：Vue 3 专用，文档清晰，样式易定制
- **vue-i18n**：Vue 官方国际化方案，支持中英文切换
- **Playwright**：现代端到端测试框架，支持截图和录屏

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
│   │   ├── CrystalBall.vue       # 水晶球（核心交互区）
│   │   ├── Pet.vue               # 宠物显示
│   │   ├── Item.vue              # 物品（可拖拽）
│   │   ├── MagicVortex.vue       # 魔法旋涡特效
│   │   ├── OutdoorPlay.vue       # 户外玩耍区（森林）
│   │   ├── OutdoorHunt.vue       # 游猎区（战斗）
│   │   ├── TopBar.vue            # 顶部功能栏
│   │   ├── Backpack.vue          # 背包弹窗
│   │   ├── Shop.vue              # 商店弹窗
│   │   ├── NotificationBar.vue   # 通知栏
│   │   ├── SaveManager.vue       # 存档管理
│   │   ├── LanguageSwitcher.vue  # 语言切换器
│   │   ├── BuffStatus.vue        # Buff 状态显示
│   │   └── synthesis/            # 合成系统组件
│   │       ├── SynthesisUI.vue        # 合成界面
│   │       ├── SynthesisSlot.vue      # 合成槽位
│   │       ├── PetPreview.vue         # 宠物预览
│   │       ├── SynthesisAnimation.vue # 合成动画
│   │       ├── SynthesisResult.vue    # 合成结果
│   │       └── PetCollection.vue      # 宠物图鉴
│   ├── stores/             # Pinia 状态管理
│   │   ├── game.js              # 游戏主状态（宠物属性、金币）
│   │   ├── backpack.js          # 背包状态
│   │   ├── outdoor.js           # 户外状态（玩耍/战斗）
│   │   ├── shop.js              # 商店状态
│   │   ├── save.js              # 存档系统
│   │   ├── settings.js          # 设置（语言等）
│   │   ├── notification.js      # 通知系统
│   │   ├── fragments.js         # 碎片收集
│   │   ├── petCollection.js     # 宠物图鉴
│   │   └── synthesis.js         # 合成系统
│   ├── config/             # 游戏配置
│   │   ├── petTypes.js          # 宠物类型定义
│   │   ├── fragmentTypes.js     # 碎片类型定义
│   │   ├── synthesisRecipes.js  # 合成配方
│   │   └── gameBalance.js       # 游戏平衡参数
│   └── i18n/               # 国际化
│       ├── index.js             # i18n 配置
│       └── locales/
│           ├── zh-CN.json       # 中文翻译
│           └── en-US.json       # 英文翻译
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

1. **打开背包**：点击左上角的 背包按钮
2. **喂养宠物**：从背包拖拽食物到中间的水晶球
3. **带宠物玩耍**：拖拽宠物到左侧 森林区
4. **带宠物战斗**：拖拽宠物到右侧 游猎区
5. **召回宠物**：从户外区拖拽宠物回水晶球
6. **合成宠物**：点击水晶球 → 进入合成界面 → 放入碎片和药水

### 宠物属性

- **饱食度**（橙色条）：会随时间下降，需要喂食补充
- **心情**（粉色条）：通过玩耍增加
- **体力**（蓝色条）：通过休息或使用药水恢复
- **健康**（绿色条）：战斗可能损失健康

### 宠物等级

宠物通过战斗和玩耍获得经验值，升级后属性上限会提升。

### 战斗风险与保护

游猎区有战斗风险，但可以通过以下方式降低风险：
- 使用护身符：完全避免死亡
- 使用战斗口粮：降低死亡几率
- 准备急救包：战斗后恢复健康

### 宠物合成系统

收集碎片和药水，可以在合成界面创造新宠物：

1. **收集碎片**：在商店购买或在战斗中获得
2. **准备药水**：彩虹药水是合成必需材料
3. **放入合成槽**：将碎片和药水放入对应槽位
4. **开始合成**：消耗材料，获得新宠物

### 存档系统

游戏支持自动保存和手动保存：
- **自动保存**：游戏状态每30秒自动保存
- **手动保存**：点击保存按钮随时保存
- **版本兼容**：存档支持版本升级，不会丢失数据

### 通知系统

游戏中的事件会通过通知栏显示：
- 宠物升级
- 获得新物品
- 战斗结果
- 保存成功

## 代码注释说明

每个文件都包含详细的注释，包括：
- 文件顶部说明这个文件的作用
- 每个 data 属性的说明
- 每个 method 的参数和返回值
- 复杂的 CSS 效果解释
- 状态管理的 actions 和 getters 说明

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
- [x] 宠物升级系统
- [x] 存档功能
- [x] 宠物合成系统
- [x] 宠物图鉴
- [x] 国际化支持
- [x] Buff 系统
- [x] 通知系统
- [ ] 音效系统

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

### vue-i18n
- [vue-i18n 文档](https://vue-i18n.intlify.dev/)

## 许可证

MIT
