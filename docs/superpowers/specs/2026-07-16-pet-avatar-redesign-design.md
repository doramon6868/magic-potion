# 宠物头像重设计 Spec

## 1. 背景与目标

当前 Magic Potion 中的宠物形象存在两个问题：

1. **风格不统一**：`Pet.vue` 用 emoji 拼接（🐌 + 🐱），而 `PetDisplay.vue` / `PetPreview.vue` 用 SVG，导致同一只宠物在不同界面看起来不一样。
2. **辨识度不足**：现有 `SlugcatAvatar.vue` 只改颜色不改造型，4 种宠物看起来太像。

**目标**：把全部宠物头像统一成一个 SVG 组件 `PetAvatar.vue`，每种宠物有独立、可爱、容易区分的造型，同时各状态（开心、睡觉、战斗等）通过表情和动画表现出来。

## 2. 设计原则

- **统一入口**：所有显示宠物头像的地方都用同一个 `<PetAvatar />` 组件。
- **造型区分**：通过不同的身体轮廓、耳朵/翅膀/角/尾巴来区分 4 种宠物。
- **表情共享**：所有宠物共用同一套表情规则（眼睛、嘴巴、腮红），只在 SVG 局部替换。
- **动画加在容器上**：状态动画不依赖具体宠物造型，统一作用于 SVG 外层。
- **保留现有逻辑**：不改动宠物状态机、喂养/战斗计算、拖拽、i18n 等已有代码。

## 3. 宠物造型

4 种宠物都使用统一的萌系手绘风格（粗描边、大眼睛、高光、腮红）。

| 类型 | 名字 | 核心特征 | 配色 |
|------|------|----------|------|
| `cat` | 小紫 · 蛞蝓猫 | 圆滚滚身体 + 三角猫耳 + 卷曲小尾巴 | 薄荷绿 `#a8e6cf` |
| `bird` | 青鸟 · 风羽鸟 | 蓬松身体 + 两侧小翅膀 + 头顶羽毛冠 + 小黄喙 | 天蓝 `#88d8e6` |
| `fox` | 赤狐 · 焰尾狐 | 椭圆身体 + 尖耳朵 + 火焰尾巴 | 暖橙 `#ffb888` |
| `dragon` | 晶晶 · 晶石龙 | 略宽身体 + 水晶角 + 小龙翼 + 背部菱形晶石 | 紫晶 `#d8c0e8` |

所有耳朵、翅膀、尾巴、角都要与身体自然连接，不能出现“浮在空中”的感觉。

## 4. 状态表情

每种状态通过 **眼睛、嘴巴、腮红** 三处变化来表现：

| 状态 | 眼睛 | 嘴巴 | 腮红 | 典型使用场景 |
|------|------|------|------|--------------|
| `idle` | 正常圆眼 + 高光 | 小弧线 / 中性 | 无 | 待机 |
| `happy` | 弯月笑眼 + 高光 | 大大弧线笑嘴 | 有 | 升级、被抚摸、吃喜欢的食物 |
| `sleeping` | 闭眼曲线 | 小圆点 / 轻微笑 | 无 | 睡觉 |
| `sad` | 下垂眼 + 泪珠 | 向下弧线 | 无 | 饱食度很低、战斗失败 |
| `tired` | 半睁眼皮 | 平线 / 微皱 | 无 | 探险回来体力低 |
| `hunting` | 锐利斜眼 | 紧闭小嘴 | 无 | 在狩猎区战斗 |
| `playing` | 睁大圆圆眼 | 开心笑嘴 | 有 | 在森林玩耍 |
| `eating` | 享受眯眼 | 咀嚼小圆嘴 | 有 | 吃东西时 |

表情只替换 SVG 中的眼睛、嘴巴、腮红图层，不改宠物整体轮廓。

## 5. 状态动画

动画统一加在 `PetAvatar.vue` 的最外层 SVG 容器上，所有宠物共享同一组 keyframes：

| 状态 | 动画 |
|------|------|
| `idle` | 轻微呼吸缩放 + 耳朵/翅膀微动 |
| `happy` | 上下弹跳 + 轻微放大 |
| `sleeping` | 缓慢左右摇摆 |
| `sad` | 小幅度左右颤抖 |
| `tired` | 慢速深呼吸缩放 |
| `hunting` | 快速左右抖动 |
| `playing` | 左右快速摇摆 |
| `eating` | 快速小弹跳（咀嚼感） |

现有 `Pet.vue` 头顶的状态指示器（💤、⚔️、🎮 等）保留，与动画共同提示当前状态。

## 6. 组件接口

### `PetAvatar.vue`

```vue
<PetAvatar
  :type="petType"
  :status="petStatus"
  :size="64"
/>
```

**Props**

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `String` | 是 | 宠物类型：`cat`、`bird`、`fox`、`dragon` |
| `status` | `String` | 否，默认 `idle` | 宠物状态，决定表情和动画 |
| `size` | `Number` | 否，默认 `64` | SVG 渲染尺寸（px） |

**内部结构**

- `<template>`
  - 外层 `<svg>`，绑定 `status` 对应的动画 class 和 `size`
  - 根据 `type` 渲染身体 + 特征组（耳朵/翅膀/角/尾巴）
  - 根据 `status` 渲染眼睛 + 嘴巴 + 腮红
- `<style scoped>`
  - 定义 `@keyframes`：breath、bounce、sway、shake-slow、shake-fast、chew
  - 定义 `.status-idle`、`.status-happy` 等动画 class

### 配置更新

`src/config/petTypes.js` 中：

- 删除 `emoji`、`emojiSecondary` 等与 emoji 相关的字段。
- 保留/新增：`type`、`name`、`bodyColor`、`accentColor`、`description`、`passiveSkill`。
- 修正 `cat` 的描述，从“蜗牛/壳”改为“蛞蝓猫”。

## 7. 改动文件

### 新增
- `src/components/icons/PetAvatar.vue` — 新的统一宠物头像组件

### 修改
- `src/components/Pet.vue` — 用 `PetAvatar` 替换 emoji 头像，保留拖拽、血条、状态指示器
- `src/components/PetDisplay.vue` — 大头像改用 `PetAvatar`
- `src/components/synthesis/PetPreview.vue` — 合成预览改用 `PetAvatar`
- `src/config/petTypes.js` — 移除 emoji 字段，修正描述

### 删除
- `src/components/icons/SlugcatAvatar.vue` — 被 `PetAvatar` 替代，所有引用迁移完成后删除

### 不动
- Pinia stores（`game.js`、`backpack.js`、`shop.js`、`outdoor.js`）
- 拖拽系统 `v-drag-drop`
- i18n 翻译文件（如已存在宠物名称/描述翻译则继续使用）

## 8. 非目标

- 不新增宠物类型。
- 不改宠物状态机或数值计算。
- 不改背包、商店、合成、户外的业务逻辑。
- 不做音效或存档功能。

## 9. 验收标准

- [ ] 4 种宠物在任意界面显示时都能一眼区分。
- [ ] `Pet.vue`、`PetDisplay.vue`、`PetPreview.vue` 都使用同一个 `PetAvatar` 组件。
- [ ] 已删除 `SlugcatAvatar.vue`，项目中无残留引用。
- [ ] 8 种状态都有对应的表情（眼睛/嘴巴/腮红）和动画。
- [ ] 拖拽、状态指示器、血条、tooltip 等原有交互不受影响。
- [ ] `petTypes.js` 中不再包含 emoji 字段，且 `cat` 描述不再提到壳/蜗牛。
