<template>
  <svg viewBox="0 0 64 64" class="hunt-icon" xmlns="http://www.w3.org/2000/svg" aria-label="游猎区">
    <!-- 后层剑（右上 → 左下，被前层剑遮挡） -->
    <g class="sword-back">
      <path
        class="blade"
        d="M54.5 11.5 Q49.8 21.3 43 28.7 Q36.1 36.1 27.4 41.6 L22.6 36.4 Q28.7 28.2 36.5 21.8 Q44.4 15.5 54.5 11.5 Z"
      />
      <path class="blade-highlight" d="M49.1 18.8 Q44.5 25.7 37.3 29.8" />
      <!-- 握把：先描边底层、再填色层，形成带轮廓的圆头胶囊 -->
      <line class="grip-outline" x1="25" y1="39" x2="17.7" y2="45.8" />
      <line class="grip" x1="25" y1="39" x2="17.7" y2="45.8" />
      <!-- 护手 -->
      <line class="guard-outline" x1="20.2" y1="33.9" x2="29.8" y2="44.1" />
      <line class="guard" x1="20.2" y1="33.9" x2="29.8" y2="44.1" />
      <!-- 柄头圆球 -->
      <circle class="pommel" cx="14" cy="49.2" r="3.4" />
    </g>

    <!-- 前层剑（左上 → 右下，遮挡后层剑） -->
    <g class="sword-front">
      <path
        class="blade"
        d="M9.5 11.5 Q14.2 21.3 21 28.7 Q27.9 36.1 36.6 41.6 L41.4 36.4 Q35.3 28.2 27.5 21.8 Q19.6 15.5 9.5 11.5 Z"
      />
      <path class="blade-highlight" d="M14.9 18.8 Q19.5 25.7 26.7 29.8" />
      <line class="grip-outline" x1="39" y1="39" x2="46.3" y2="45.8" />
      <line class="grip" x1="39" y1="39" x2="46.3" y2="45.8" />
      <line class="guard-outline" x1="34.2" y1="44.1" x2="43.8" y2="33.9" />
      <line class="guard" x1="34.2" y1="44.1" x2="43.8" y2="33.9" />
      <circle class="pommel" cx="50" cy="49.2" r="3.4" />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'HuntIcon'
}
</script>

<style scoped>
.hunt-icon {
  width: 100%;
  height: 100%;
  display: block;
}

/* 剑身：银灰平涂 + 3px 外轮廓，圆角连接让剑尖偏钝、保持可爱感 */
.blade {
  fill: #e2e8f0;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 3;
  stroke-linejoin: round;
}

/* 剑刃高光：只画中间一段，1.5px */
.blade-highlight {
  fill: none;
  stroke: #ffffff;
  stroke-width: 1.5;
  stroke-linecap: round;
}

/* 握把：深棕 5px 胶囊 + 11px 描边底层 */
.grip-outline {
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 11;
  stroke-linecap: round;
}
.grip {
  stroke: #8b5a2b;
  stroke-width: 5;
  stroke-linecap: round;
}

/* 护手：金黄 4px 胶囊（全长约 14px）+ 10px 描边底层 */
.guard-outline {
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 10;
  stroke-linecap: round;
}
.guard {
  stroke: #ffd93d;
  stroke-width: 4;
  stroke-linecap: round;
}

/* 柄头圆球：金黄 + 3px 描边 */
.pommel {
  fill: #ffd93d;
  stroke: var(--mp-ink, #3d3d3d);
  stroke-width: 3;
}
</style>
