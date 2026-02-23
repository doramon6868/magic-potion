<!--
  ObservatoryDome.vue - 天文台穹顶组件

  实现天文台式水晶球外壳旋转打开效果：
  - 外壳从中间分开，向两侧旋转滑动到水晶球背后
  - 像天文台穹顶那样旋转打开，露出里面的宠物
  - 3D旋转效果在2D网页中实现

  功能：
  1. 左右两半外壳（各带双面 - 正面+背面）
  2. 3D旋转打开动画（rotateY）
  3. 弹性回弹效果
  4. 透视深度效果
-->

<template>
  <div class="observatory-dome">
    <!-- 3D场景容器 -->
    <div class="dome-scene" :class="{ 'is-open': isOpen }">
      <!-- 内部空间（永远在底层）- 透明背景 -->
      <div class="inner-chamber"></div>

      <!-- 左半外壳 -->
      <div class="dome-shell left-shell">
        <!-- 外壳正面（玻璃质感） -->
        <div class="shell-front left-front"></div>
        <!-- 外壳背面（较暗） -->
        <div class="shell-back left-back"></div>
        <!-- 边缘高光 -->
        <div class="shell-edge left-edge"></div>
      </div>

      <!-- 右半外壳 -->
      <div class="dome-shell right-shell">
        <!-- 外壳正面（玻璃质感） -->
        <div class="shell-front right-front"></div>
        <!-- 外壳背面（较暗） -->
        <div class="shell-back right-back"></div>
        <!-- 边缘高光 -->
        <div class="shell-edge right-edge"></div>
      </div>

      <!-- 门框光效（开门时显示） -->
      <div class="doorway-glow" :class="{ 'is-visible': isOpen }"></div>

      <!-- 内部发光（开门时从内部透出光芒） -->
      <div class="inner-glow" :class="{ 'is-visible': isOpen }"></div>

      <!-- 全覆盖玻璃层 - 始终在宠物上方创造玻璃质感 -->
      <div class="glass-cover"></div>
    </div>
  </div>
</template>

<script>
/**
 * 天文台穹顶组件
 * 使用 CSS 3D Transforms 实现外壳旋转打开效果
 */
export default {
  name: 'ObservatoryDome',

  props: {
    /**
     * 是否打开门
     */
    isOpen: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // 组件内部状态
    }
  },

  watch: {
    isOpen(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log('天文台穹顶:', newVal ? '打开' : '关闭')
      }
    }
  }
}
</script>

<style scoped>
/**
 * 天文台穹顶样式
 * 使用 CSS 3D Transforms 创建立体旋转效果
 */

/* 穹顶容器 */
.observatory-dome {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  pointer-events: none;
  z-index: 1;
}

/* ==================== 3D场景 ==================== */

/* 3D场景容器 - 启用3D空间 */
.dome-scene {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;  /* 关键：启用3D空间 */
  perspective: 1200px;            /* 透视距离，创造深度感 */
  border-radius: 50%;
}

/* ==================== 内部空间 ==================== */

/* 内部空间 - 永远在底层，完全透明 */
.inner-chamber {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: translateZ(-50px);  /* 推到后方 */
  overflow: hidden;
  background: transparent;
}

/* ==================== 外壳结构 ==================== */

/* 外壳容器基础 */
.dome-shell {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  transform-style: preserve-3d;  /* 启用3D变换 */
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);  /* 弹性缓动 */
  z-index: 6;  /* 外壳在玻璃层之上，旋转到后方 */
}

/* 左半外壳 */
.left-shell {
  left: 0;
  transform-origin: right center;  /* 以右侧为轴旋转 */
}

/* 右半外壳 */
.right-shell {
  right: 0;
  transform-origin: left center;   /* 以左侧为轴旋转 */
}

/* 打开状态 - 旋转到背后 */
.dome-scene.is-open .left-shell {
  transform: rotateY(-130deg) translateZ(-80px);  /* 大幅向左后方旋转 */
}

.dome-scene.is-open .right-shell {
  transform: rotateY(130deg) translateZ(-80px);   /* 大幅向右后方旋转 */
}

/* ==================== 外壳正面（玻璃质感） ==================== */

.shell-front {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;  /* 背面不可见 */
  overflow: hidden;
}

/* 左半球正面 - 天文台穹顶玻璃外壳效果 */
.left-front {
  left: 0;
  border-radius: 100px 0 0 100px;
  background:
    /* 主高光反射 */
    radial-gradient(
      ellipse at 25% 25%,
      rgba(255, 255, 255, 0.6) 0%,
      rgba(255, 255, 255, 0.3) 25%,
      transparent 55%
    ),
    /* 次要高光 */
    radial-gradient(
      ellipse at 60% 40%,
      rgba(255, 255, 255, 0.35) 0%,
      transparent 40%
    ),
    /* 紫色玻璃基底 - 可见但不完全透明 */
    linear-gradient(
      135deg,
      rgba(220, 200, 255, 0.5) 0%,
      rgba(190, 160, 245, 0.45) 30%,
      rgba(160, 130, 230, 0.5) 60%,
      rgba(140, 100, 210, 0.55) 100%
    );
  /* 玻璃厚度效果 - 多层内阴影 */
  box-shadow:
    /* 内边缘高光 - 模拟玻璃厚度 */
    inset -8px 0 15px rgba(255, 255, 255, 0.5),
    inset -3px 0 8px rgba(255, 255, 255, 0.7),
    /* 内边缘阴影 - 增加深度 */
    inset 3px 0 10px rgba(139, 92, 246, 0.15),
    /* 外部边缘 */
    -2px 0 5px rgba(255, 255, 255, 0.4);
  border-right: 2px solid rgba(255, 255, 255, 0.4);
}

/* 右半球正面 - 天文台穹顶玻璃外壳效果 */
.right-front {
  right: 0;
  border-radius: 0 100px 100px 0;
  background:
    /* 主高光反射 */
    radial-gradient(
      ellipse at 75% 25%,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0.28) 25%,
      transparent 55%
    ),
    /* 次要高光 */
    radial-gradient(
      ellipse at 40% 45%,
      rgba(255, 255, 255, 0.32) 0%,
      transparent 40%
    ),
    /* 紫色玻璃基底 - 可见但不完全透明 */
    linear-gradient(
      -135deg,
      rgba(220, 200, 255, 0.48) 0%,
      rgba(190, 160, 245, 0.43) 30%,
      rgba(160, 130, 230, 0.48) 60%,
      rgba(140, 100, 210, 0.53) 100%
    );
  /* 玻璃厚度效果 - 多层内阴影 */
  box-shadow:
    /* 内边缘高光 - 模拟玻璃厚度 */
    inset 8px 0 15px rgba(255, 255, 255, 0.5),
    inset 3px 0 8px rgba(255, 255, 255, 0.7),
    /* 内边缘阴影 - 增加深度 */
    inset -3px 0 10px rgba(139, 92, 246, 0.15),
    /* 外部边缘 */
    2px 0 5px rgba(255, 255, 255, 0.4);
  border-left: 2px solid rgba(255, 255, 255, 0.4);
}

/* ==================== 外壳背面（较暗） ==================== */

.shell-back {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;  /* 正面不可见 */
  transform: rotateY(180deg);   /* 翻转背面 */
}

/* 左半球背面 */
.left-back {
  left: 0;
  border-radius: 100px 0 0 100px;
  background: linear-gradient(
    135deg,
    rgba(100, 60, 160, 0.85) 0%,
    rgba(80, 50, 140, 0.9) 50%,
    rgba(60, 40, 120, 0.95) 100%
  );
  box-shadow:
    inset 5px 0 20px rgba(0, 0, 0, 0.3),
    inset -5px 0 10px rgba(100, 60, 160, 0.2);
}

/* 右半球背面 */
.right-back {
  right: 0;
  border-radius: 0 100px 100px 0;
  background: linear-gradient(
    -135deg,
    rgba(100, 60, 160, 0.85) 0%,
    rgba(80, 50, 140, 0.9) 50%,
    rgba(60, 40, 120, 0.95) 100%
  );
  box-shadow:
    inset -5px 0 20px rgba(0, 0, 0, 0.3),
    inset 5px 0 10px rgba(100, 60, 160, 0.2);
}

/* ==================== 边缘光效 ==================== */

.shell-edge {
  position: absolute;
  top: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(251, 191, 36, 0.6) 20%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(251, 191, 36, 0.6) 80%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.5s ease;
  filter: blur(1px);
}

.left-edge {
  right: 0;
}

.right-edge {
  left: 0;
}

/* 开门时显示边缘光效 */
.dome-scene.is-open .shell-edge {
  opacity: 1;
}

/* 门框光效 */
.doorway-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(251, 191, 36, 0.5) 20%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(251, 191, 36, 0.5) 80%,
    transparent 100%
  );
  opacity: 0;
  transition: all 0.5s ease;
  filter: blur(2px);
  pointer-events: none;
  box-shadow:
    0 0 20px rgba(251, 191, 36, 0.6),
    0 0 40px rgba(251, 191, 36, 0.4);
}

.doorway-glow.is-visible {
  width: 8px;
  opacity: 1;
  animation: glow-pulse 1s ease-in-out infinite alternate;
}

/* ==================== 内部发光 ==================== */

/* 内部发光 - 开门时从内部透出 */
.inner-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(251, 191, 36, 0.2) 30%,
    rgba(168, 85, 247, 0.1) 60%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
  z-index: 3;
}

.inner-glow.is-visible {
  opacity: 1;
  animation: inner-pulse 1.5s ease-in-out infinite alternate;
}

@keyframes inner-pulse {
  from {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* ==================== 全覆盖玻璃层 ==================== */

/* 玻璃覆盖层 - 覆盖整个水晶球创造玻璃质感 */
.glass-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  /* 淡紫色半透明渐变 - 营造玻璃效果 */
  background:
    /* 主高光反射 - 左上角 */
    radial-gradient(
      ellipse at 25% 20%,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.25) 25%,
      transparent 50%
    ),
    /* 次要高光 - 右上角 */
    radial-gradient(
      ellipse at 75% 25%,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0.15) 20%,
      transparent 40%
    ),
    /* 底部反光 */
    radial-gradient(
      ellipse at 50% 85%,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 35%
    ),
    /* 淡紫色基底 */
    radial-gradient(
      circle at 50% 50%,
      rgba(230, 220, 255, 0.08) 0%,
      rgba(200, 180, 255, 0.05) 50%,
      rgba(180, 160, 240, 0.08) 100%
    );
  /* 玻璃边缘光效 */
  box-shadow:
    inset 0 0 40px rgba(255, 255, 255, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.5),
    inset -10px -10px 30px rgba(139, 92, 246, 0.05);
  pointer-events: none;
  z-index: 4;  /* 在宠物之上，在外壳之下 */
}

/* ==================== 动画定义 ==================== */

/* 门框光效脉动 */
@keyframes glow-pulse {
  from {
    opacity: 0.6;
    filter: blur(3px);
  }
  to {
    opacity: 1;
    filter: blur(5px);
  }
}
</style>
