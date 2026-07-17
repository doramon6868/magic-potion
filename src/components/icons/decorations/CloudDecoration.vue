<template>
  <svg viewBox="0 0 120 72" class="cloud-decoration" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <!-- 后层小云（左后） -->
    <path class="cloud-back" d="M 2.5 38 A 7 7 0 0 1 9.5 29.5 A 6 6 0 0 1 17 34.5" />
    <!-- 后层小云（右后） -->
    <path class="cloud-back" d="M 100.5 34 A 6 6 0 0 1 109 28 A 6.5 6.5 0 0 1 117.5 37" />
    <!-- 主云团 -->
    <path class="cloud-main" d="M 12.7 51.5 A 18 17.5 0 0 1 43.7 26.6 A 22 21 0 0 1 78.1 25 A 17.5 18 0 0 1 103.3 49.5 A 180 180 0 0 1 12.7 51.5 Z" />
    <!-- 高光 -->
    <path class="cloud-highlight" d="M 21 39 A 7 7 0 0 1 26 30.5" />
    <path class="cloud-highlight" d="M 48 30.5 A 9 9 0 0 1 57 25.5" />
    <!-- 星星 -->
    <path class="cloud-star cloud-star--gold" d="M 18 11.5 Q 19.65 15.35 23.5 17 Q 19.65 18.65 18 22.5 Q 16.35 18.65 12.5 17 Q 16.35 15.35 18 11.5 Z" />
    <path class="cloud-star cloud-star--purple" d="M 102 14.5 Q 103.35 17.65 106.5 19 Q 103.35 20.35 102 23.5 Q 100.65 20.35 97.5 19 Q 100.65 17.65 102 14.5 Z" />
    <path class="cloud-star cloud-star--gold cloud-star--small" d="M 74 9.8 Q 75 12 77.2 13 Q 75 14 74 16.2 Q 73 14 70.8 13 Q 73 12 74 9.8 Z" />
    <!-- 飘带 -->
    <path class="cloud-wisp" d="M 24 63.5 Q 32.5 67 42.5 64.5" />
  </svg>
</template>

<script>
export default {
  name: 'CloudDecoration'
}
</script>

<style scoped>
.cloud-decoration {
  width: 100%;
  height: 100%;
}

/* 主云团：白底 + 3px 粗描边 */
.cloud-main {
  fill: var(--mp-white, #ffffff);
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 后层小云：略透明，制造层次 */
.cloud-back {
  fill: var(--mp-white, #ffffff);
  opacity: 0.7;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 3;
  stroke-linecap: round;
}

/* 云朵内部高光：2px 短弧线 */
.cloud-highlight {
  fill: none;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 2;
  stroke-linecap: round;
}

/* 星星点缀 */
.cloud-star {
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 1.8;
  stroke-linejoin: round;
}
.cloud-star--gold {
  fill: #ffd93d;
}
.cloud-star--purple {
  fill: #a78bfa;
}
.cloud-star--small {
  stroke-width: 1.6;
}

/* 底部飘带 */
.cloud-wisp {
  fill: none;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 2;
  stroke-linecap: round;
}
</style>
