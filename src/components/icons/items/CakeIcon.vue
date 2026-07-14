<template>
  <svg viewBox="0 0 64 64" class="cake-icon">
    <path d="M12 30 L12 52 Q12 58 32 58 Q52 58 52 52 L52 30 Q32 36 12 30 Z" class="cake-base" />
    <path d="M12 30 Q32 36 52 30 L52 24 Q32 30 12 24 Z" class="cake-top" />
    <path d="M32 24 L32 10" class="candle-stick" />
    <circle cx="32" cy="8" r="4" class="candle-flame" />
    <circle cx="20" cy="34" r="2.5" class="berry" />
    <circle cx="32" cy="40" r="2.5" class="berry" />
    <circle cx="44" cy="34" r="2.5" class="berry" />
  </svg>
</template>

<script>
export default {
  name: 'CakeIcon'
}
</script>

<style scoped>
.cake-icon {
  width: 100%;
  height: 100%;
}
.cake-base {
  fill: var(--mp-pink-light);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.cake-top {
  fill: var(--mp-white);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.candle-stick {
  fill: none;
  stroke: var(--mp-ink);
  stroke-width: 3;
  stroke-linecap: round;
}
.candle-flame {
  fill: var(--mp-gold);
  stroke: var(--mp-ink);
  stroke-width: 2;
}
.berry {
  fill: var(--mp-red);
  stroke: var(--mp-ink);
  stroke-width: 2;
}
</style>
