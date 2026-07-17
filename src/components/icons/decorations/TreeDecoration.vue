<template>
  <svg
    viewBox="0 0 72 96"
    class="tree-decoration"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- 树干：微弯锥形，底部带根部分叉 -->
    <path class="tree-trunk" d="M 31 54 Q 35 51.6 39 54 C 40 63.5 42.3 75.5 43.8 88.5 C 43 91 41.2 92 39.4 91.4 C 38.1 92.6 36.3 92.7 35 91.8 C 33.3 92.2 31.8 90.8 31.3 88.5 C 30 76.5 29.6 64 31 54 Z"/>
    <!-- 树皮纹理 -->
    <path class="tree-bark" d="M 29.6 73.5 Q 34.7 75.6 39.8 73.5"/>
    <path class="tree-bark" d="M 30 78.7 Q 35.4 80.8 40.9 78.7"/>
    <path class="tree-bark" d="M 30.7 83.9 Q 36.4 86 42.1 83.9"/>

    <!-- 树冠：下层（底部中间内凹，露出树干） -->
    <path class="tree-foliage tree-foliage--lower" d="M 60.3 58.1 Q 65.2 53.2 59.8 50.4 Q 60.9 44.3 54.7 45.3 Q 53.1 39.5 47.4 43.9 Q 43.9 38.5 38.4 42.7 Q 32.6 38.7 29.3 44.6 Q 23.1 41.9 21.5 48.3 Q 15.4 47.8 15.6 54.3 Q 10.4 56.5 14.4 61.2 Q 11.1 66.6 17.3 67 Q 19.4 72.8 25 69.3 Q 30.7 72.3 33.9 66.7 Q 40.4 68.5 43.3 62.5 Q 49.9 63.3 51.4 56.9 Q 57.9 60.4 60.3 58.1 Z"/>
    <!-- 树冠：中层（略偏左） -->
    <path class="tree-foliage tree-foliage--middle" d="M 52.9 37.4 Q 56.3 32.4 51.2 30 Q 51.7 24.4 46.1 25.7 Q 43.6 20.3 38.4 23.9 Q 33.5 19.8 29.4 24.6 Q 23.8 22.7 22.1 28.3 Q 16.3 29.4 18.2 35 Q 13.4 39 17.8 43.1 Q 16.9 48.8 22.9 48.3 Q 26.2 53.5 31.3 50.2 Q 36.9 53.2 41 48.5 Q 46.8 50.2 48.9 44.6 Q 54.7 43.3 52.9 37.4 Z"/>
    <!-- 树冠：顶层 -->
    <path class="tree-foliage tree-foliage--top" d="M 50.5 20.5 Q 53.2 15.4 48.6 13.5 Q 48.4 8 43.2 9.4 Q 39.9 4.9 35.6 8.6 Q 30.4 6.4 27.9 11.4 Q 22.6 12.2 24.2 17.3 Q 20 21.1 24 24.7 Q 24.5 30 29.9 29.3 Q 33.7 33.5 38 29.9 Q 43.3 31.9 46.1 27 Q 51.5 25.7 50.5 20.5 Z"/>

    <!-- 叶丛层次纹理 -->
    <path class="tree-texture" d="M 22 56 Q 30 60 38 57.5"/>
    <path class="tree-texture" d="M 33 20.5 Q 38.5 23 44 20.5"/>

    <!-- 魔法点缀：金果 1（挂在下层叶丛左下缘） -->
    <g class="tree-fruit">
      <path class="tree-fruit-stem" d="M 18.5 70.2 L 18 72.6"/>
      <circle class="tree-fruit-body" cx="18" cy="74.5" r="2.7"/>
    </g>
    <!-- 魔法点缀：金果 2（中层叶丛右缘） -->
    <g class="tree-fruit">
      <path class="tree-fruit-stem" d="M 46.8 42 L 48.2 44"/>
      <circle class="tree-fruit-body" cx="49" cy="45.6" r="2.7"/>
    </g>

    <!-- 魔法点缀：五瓣小花（下层叶丛左侧） -->
    <g class="tree-flower">
      <circle class="tree-flower-petal" cx="21.0" cy="54.1" r="2.15"/>
      <circle class="tree-flower-petal" cx="23.8" cy="56.0" r="2.15"/>
      <circle class="tree-flower-petal" cx="22.7" cy="59.1" r="2.15"/>
      <circle class="tree-flower-petal" cx="19.3" cy="59.1" r="2.15"/>
      <circle class="tree-flower-petal" cx="18.2" cy="56.0" r="2.15"/>
      <circle class="tree-flower-center" cx="21" cy="57" r="1.6"/>
    </g>

    <!-- 魔法点缀：闪光星（顶层叶丛右上） -->
    <path class="tree-star" d="M 46 15 Q 47 18 50 19 Q 47 20 46 23 Q 45 20 42 19 Q 45 18 46 15 Z"/>

    <!-- 底部小草 -->
    <path class="tree-grass" d="M 23.5 93.2 Q 24.3 88 26.8 92.2"/>
    <path class="tree-grass" d="M 27.2 93.4 Q 28.2 89 30.6 92.6"/>
    <path class="tree-grass" d="M 48.5 93.2 Q 47.7 88.2 45 92.4"/>
    <path class="tree-grass" d="M 44.6 93.5 Q 43.6 89.5 41.2 92.8"/>
  </svg>
</template>

<script>
export default {
  name: 'TreeDecoration'
}
</script>

<style scoped>
.tree-decoration {
  width: 100%;
  height: 100%;
  display: block;
}

/* 树干与树皮 */
.tree-trunk {
  fill: #5c4d3c;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 3;
}
.tree-bark {
  fill: none;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 2;
}

/* 树冠 */
.tree-foliage {
  fill: var(--mp-mint, #a7f3d0);
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 3;
}
.tree-texture {
  fill: none;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 2;
}

/* 魔法点缀：仅金 + 粉两色 */
.tree-fruit-stem {
  fill: none;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 2;
}
.tree-fruit-body {
  fill: #ffd93d;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 2;
}
.tree-flower-petal {
  fill: #f472b6;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 1.8;
}
.tree-flower-center {
  fill: #ffd93d;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 1.8;
}
.tree-star {
  fill: #ffd93d;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 2;
}

/* 底部小草 */
.tree-grass {
  fill: none;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 2;
}
</style>
