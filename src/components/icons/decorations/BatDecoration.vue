<template>
  <svg class="bat-decoration" viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <!-- 翅膀：身体下层，上缘平滑弧线，下缘三段更深的内凹波浪（指骨） -->
    <path class="bat-wing bat-wing-left"
          d="M34.5 32 C27 21 17 14.5 8.5 17.5 Q5.8 24 7.5 31 Q12 28 15.5 36 Q19 34 22.5 41.5 Q26.5 37 31 45.5 Q33.5 44 34.5 32 Z" />
    <path class="bat-wing bat-wing-right"
          d="M45.5 32 C53 20.5 63 14.2 71.5 17 Q74.5 23.5 72.5 30.5 Q68 27.8 64.5 35.5 Q61 34 57.5 41 Q53.5 36.5 49 45.5 Q46.5 44 45.5 32 Z" />

    <!-- 头 + 身体一体轮廓，无断线 -->
    <path class="bat-body"
          d="M31 26 C31 20.5 35 16.5 40 16.5 C45 16.5 49 20.5 49 26 C48.7 30.5 47.2 34.2 46.2 39.5 C45.6 45 43.2 49 40 49 C36.8 49 34.4 45 33.8 39.5 C32.8 34.2 31.3 30.5 31 26 Z" />

    <!-- 肚皮留白 -->
    <path class="bat-belly"
          d="M36.5 41.5 C36.5 39 38 37.5 40 37.5 C42 37.5 43.5 39 43.5 41.5 C43.5 44 42 45.5 40 45.5 C38 45.5 36.5 44 36.5 41.5 Z" />

    <!-- 耳朵 + 耳内留白 -->
    <path class="bat-ear bat-ear-left" d="M31.5 17.5 L27.5 9.5 L37.5 15.5 Z" />
    <path class="bat-ear bat-ear-right" d="M48.5 17.5 L52.5 9.5 L42.5 15.5 Z" />
    <path class="bat-ear-inner" d="M31.8 15.8 L29.8 11.8 L34.9 14.9 Z" />
    <path class="bat-ear-inner" d="M48.2 15.8 L50.2 11.8 L45.1 14.9 Z" />

    <!-- 眼睛：白眼 + 偏上瞳孔，位置稍低更憨厚 -->
    <circle class="bat-eye bat-eye-left" cx="36" cy="26" r="3" />
    <circle class="bat-eye bat-eye-right" cx="44" cy="26" r="3" />
    <circle class="bat-pupil" cx="36.1" cy="25.2" r="1.3" />
    <circle class="bat-pupil" cx="43.9" cy="25.2" r="1.3" />

    <!-- 微笑线 + 两颗更短更圆润的小尖牙 -->
    <path class="bat-mouth" d="M37.6 31.6 Q40 34.2 42.4 31.6" />
    <path class="bat-fang bat-fang-left" d="M37.9 31.9 L39.4 32.3 L38.6 33.4 Z" />
    <path class="bat-fang bat-fang-right" d="M42.1 31.9 L40.6 32.3 L41.4 33.4 Z" />

    <!-- 倒挂感小爪子，末端带小弯钩 -->
    <path class="bat-foot bat-foot-left" d="M36 47.8 Q33.6 50.2 34.6 52.6 Q35.2 53.6 34.2 54.2" />
    <path class="bat-foot bat-foot-right" d="M44 47.8 Q46.4 50.4 45.2 52.4 Q44.6 53.6 45.6 54.2" />
  </svg>
</template>

<script>
export default {
  name: 'BatDecoration'
}
</script>

<style scoped>
.bat-decoration {
  --mp-ink: #3d3d3d;
  display: block;
  width: 100%;
  height: 100%;
}

/* 外轮廓 3px 粗描边 */
.bat-body,
.bat-ear,
.bat-wing {
  fill: #2d2d3a;
  stroke: var(--mp-ink);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 翅膀比身体略浅一度，避免糊成一片 */
.bat-wing-left,
.bat-wing-right {
  fill: #36364a;
}

/* 内部细节 2px */
.bat-belly {
  fill: #ffffff;
  stroke: var(--mp-ink);
  stroke-width: 2;
  stroke-linejoin: round;
}

.bat-ear-inner {
  fill: #ffffff;
}

.bat-eye {
  fill: #ffffff;
  stroke: var(--mp-ink);
  stroke-width: 2;
}

.bat-pupil {
  fill: #1b1b21;
}

.bat-mouth,
.bat-foot {
  fill: none;
  stroke: var(--mp-ink);
  stroke-width: 2;
  stroke-linecap: round;
}

.bat-fang {
  fill: #ffffff;
}
</style>
