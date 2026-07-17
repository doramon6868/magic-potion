<template>
  <!-- OutdoorPlay.vue 顶部装饰层：三连团林冠剪影，260×48 视口 -->
  <svg
    viewBox="0 0 260 48"
    class="canopy-top"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- 树冠剪影：底部平直基线 + 三团云朵状起伏（左小 / 中最高 / 右中）
         此路径的 d 可直接复用为 clip-path 参考 -->
    <path
      class="canopy-body"
      d="M0 44 L8 44 Q4 30 14 26 Q17 17 28 20 Q35 14 44 18 Q55 17 60 26 Q66 33 74 32 Q84 20 92 18 Q98 8 112 10 Q120 3 132 7 Q145 4 152 11 Q164 8 168 18 Q176 26 184 28 Q190 18 200 16 Q207 9 218 13 Q230 10 236 17 Q248 15 252 26 Q257 33 256 44 L260 44 Z"
    />
    <!-- 叶片层次暗示弧：每团 2–3 条，单路径多子段，55% 描边透明度 -->
    <path
      class="canopy-leaves"
      d="M18 34 Q30 26 44 29 M26 40 Q38 33 52 36 M12 41 Q20 38 28 39 M100 26 Q114 16 132 20 M118 34 Q134 26 156 30 M142 15 Q152 12 160 17 M198 30 Q210 22 226 25 M206 38 Q220 32 238 35 M242 24 Q248 24 251 30"
    />
    <!-- 魔法果实：左缝隙 1 颗 + 右侧树冠 1 颗 -->
    <circle class="canopy-fruit" cx="83" cy="22" r="2.4" />
    <circle class="canopy-fruit" cx="228" cy="19" r="2.2" />
  </svg>
</template>

<script>
export default {
  name: 'CanopyTop'
}
</script>

<style scoped>
.canopy-top {
  display: block;
  width: 100%;
  height: auto;
  /* 若全局已定义同名变量，删除这两行即可被全局覆盖 */
  --mp-ink: #612315;
  --mp-canopy: #4a8b6a;
}

/* 树冠主体：85% 不透明，透出背后光晕；2.5px 描边 */
.canopy-body {
  fill: var(--mp-canopy);
  fill-opacity: 0.85;
  stroke: var(--mp-ink);
  stroke-width: 2.5;
  stroke-linejoin: round;
}

/* 叶层弧线：2px 描边、无填充，弱化处理只做暗示 */
.canopy-leaves {
  fill: none;
  stroke: var(--mp-ink);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-opacity: 0.55;
}

/* 魔法果实：金色 + 同色系描边 */
.canopy-fruit {
  fill: #ffd93d;
  stroke: var(--mp-ink);
  stroke-width: 2;
}
</style>
