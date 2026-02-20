<!--
  MagicVortex.vue - 魔法旋涡特效组件

  这个组件创建水晶球中心的魔法旋涡效果
  当用户拖拽物品或宠物到水晶球上时显示

  实现原理：
  1. 使用 CSS @keyframes 动画让元素旋转
  2. 多层同心圆，每层旋转速度和方向不同
  3. 使用锥形渐变(conic-gradient)创造旋涡纹理
  4. 使用模糊和发光效果增强魔法感

  为什么用 CSS 动画而不是 JavaScript？
  - CSS 动画性能更好，GPU 加速
  - 代码更简单，不需要 requestAnimationFrame
  - Vue 的 Transition 组件和 CSS 配合得很好
-->

<template>
  <!--
    旋涡容器
    使用绝对定位覆盖整个水晶球内部
    多层嵌套 div 创造复杂的旋涡效果
  -->
  <div class="vortex-container">
    <!--
      第一层旋涡
      顺时针旋转，速度最慢
      创建基础的旋涡形状
    -->
    <div class="vortex-layer layer-1"></div>

    <!--
      第二层旋涡
      逆时针旋转，速度中等
      和第一层交错产生复杂效果
    -->
    <div class="vortex-layer layer-2"></div>

    <!--
      第三层旋涡
      顺时针旋转，速度最快
      作为内层核心
    -->
    <div class="vortex-layer layer-3"></div>

    <!--
      中心发光点
      模拟旋涡中心的亮光
    -->
    <div class="vortex-core"></div>

    <!--
      粒子效果
      几个小点围绕中心旋转
    -->
    <div class="particle particle-1"></div>
    <div class="particle particle-2"></div>
    <div class="particle particle-3"></div>

  </div>
</template>

<script>
/**
 * 这个组件是纯展示性的，不需要任何逻辑
 * 所有动画都通过 CSS 实现
 * 所以 script 部分很简单
 */
export default {
  // 组件名称
  name: 'MagicVortex'
}
</script>

<style scoped>
/**
 * 旋涡样式
 * 使用 CSS 动画创造魔法效果
 */

/* 旋涡容器 */
.vortex-container {
  /* 绝对定位，覆盖整个父元素 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 圆形 */
  border-radius: 50%;
  /* 溢出隐藏 */
  overflow: hidden;
  /* 模糊效果，让旋涡看起来柔和 */
  filter: blur(1px);
}

/* 旋涡层基础样式 */
.vortex-layer {
  /* 绝对定位，居中 */
  position: absolute;
  top: 50%;
  left: 50%;
  /* 通过 transform 居中并设置大小 */
  border-radius: 50%;
  /* 使用锥形渐变创建旋涡纹理 */
  /**
   * conic-gradient: 锥形渐变
   * 从中心点向外辐射的渐变
   * 多个颜色段创造旋转条纹效果
   */
}

/* 第一层 - 最大最慢 */
.layer-1 {
  /* 宽度和高度 */
  width: 200%;
  height: 200%;
  /* 从中心偏移一半，实现居中 */
  margin-top: -100%;
  margin-left: -100%;
  /**
   * 锥形渐变 - 紫色和透明的交替条纹
   */
  background: repeating-conic-gradient(
    from 0deg,
    rgba(155, 89, 182, 0.3) 0deg,
    rgba(155, 89, 182, 0.3) 10deg,
    transparent 10deg,
    transparent 20deg
  );
  /**
   * 动画：顺时针旋转
   * rotate-clockwise: 动画名称（在 @keyframes 中定义）
   * 3s: 完成一圈需要 3 秒
   * linear: 匀速旋转
   * infinite: 无限循环
   */
  animation: rotate-clockwise 3s linear infinite;
}

/* 第二层 - 中等大小，反向旋转 */
.layer-2 {
  width: 150%;
  height: 150%;
  margin-top: -75%;
  margin-left: -75%;
  /**
   * 不同的渐变颜色 - 偏蓝色
   */
  background: repeating-conic-gradient(
    from 0deg,
    rgba(93, 173, 226, 0.4) 0deg,
    rgba(93, 173, 226, 0.4) 15deg,
    transparent 15deg,
    transparent 30deg
  );
  /**
   * 动画：逆时针旋转，速度更快
   */
  animation: rotate-counter 2s linear infinite;
}

/* 第三层 - 最小最快 */
.layer-3 {
  width: 100%;
  height: 100%;
  margin-top: -50%;
  margin-left: -50%;
  /**
   * 亮紫色渐变
   */
  background: repeating-conic-gradient(
    from 0deg,
    rgba(187, 143, 206, 0.5) 0deg,
    rgba(187, 143, 206, 0.5) 20deg,
    transparent 20deg,
    transparent 40deg
  );
  /**
   * 动画：顺时针，速度最快
   */
  animation: rotate-clockwise 1s linear infinite;
}

/* 中心发光核心 */
.vortex-core {
  /* 绝对定位，居中 */
  position: absolute;
  top: 50%;
  left: 50%;
  /* 大小 */
  width: 60px;
  height: 60px;
  /* 居中 */
  margin-top: -30px;
  margin-left: -30px;
  /* 圆形 */
  border-radius: 50%;
  /**
   * 径向渐变 - 从中心向外发光
   */
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(187, 143, 206, 0.8) 30%,
    rgba(155, 89, 182, 0.4) 60%,
    transparent 100%
  );
  /**
   * 强烈的发光效果
   */
  box-shadow:
    0 0 20px rgba(255, 255, 255, 0.8),
    0 0 40px rgba(187, 143, 206, 0.6),
    0 0 60px rgba(155, 89, 182, 0.4);
  /**
   * 脉动动画
   */
  animation: pulse 0.8s ease-in-out infinite alternate;
}

/* 粒子效果 */
.particle {
  /* 绝对定位 */
  position: absolute;
  top: 50%;
  left: 50%;
  /* 小圆点 */
  width: 8px;
  height: 8px;
  /* 居中 */
  margin-top: -4px;
  margin-left: -4px;
  /* 圆形 */
  border-radius: 50%;
  /* 白色发光 */
  background: white;
  box-shadow: 0 0 10px white, 0 0 20px rgba(187, 143, 206, 0.8);
}

/* 粒子1 - 绕大圈旋转 */
.particle-1 {
  /* 使用 CSS 变量控制旋转半径 */
  --radius: 80px;
  animation: orbit 2s linear infinite;
}

/* 粒子2 - 绕中圈旋转，反向 */
.particle-2 {
  --radius: 60px;
  animation: orbit-reverse 1.5s linear infinite;
  /* 延迟启动，错开位置 */
  animation-delay: -0.5s;
}

/* 粒子3 - 绕小圈旋转 */
.particle-3 {
  --radius: 40px;
  animation: orbit 1s linear infinite;
  animation-delay: -0.3s;
}

/* ==================== 动画定义 ==================== */

/**
 * 顺时针旋转动画
 * 从 0 度旋转到 360 度
 */
@keyframes rotate-clockwise {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/**
 * 逆时针旋转动画
 * 从 360 度旋转到 0 度
 */
@keyframes rotate-counter {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

/**
 * 脉动动画
 * 放大和缩小，创造呼吸效果
 */
@keyframes pulse {
  from {
    transform: scale(0.8);
    opacity: 0.8;
  }
  to {
    transform: scale(1.2);
    opacity: 1;
  }
}

/**
 * 轨道运动动画
 * 粒子围绕中心旋转
 * 使用 CSS 变量 --radius 控制半径
 */
@keyframes orbit {
  from {
    transform: rotate(0deg) translateX(var(--radius)) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(var(--radius)) rotate(-360deg);
  }
}

/**
 * 反向轨道运动动画
 */
@keyframes orbit-reverse {
  from {
    transform: rotate(360deg) translateX(var(--radius)) rotate(-360deg);
  }
  to {
    transform: rotate(0deg) translateX(var(--radius)) rotate(0deg);
  }
}
</style>
