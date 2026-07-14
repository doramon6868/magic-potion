<template>
  <svg viewBox="0 0 40 50" class="fire-icon">
    <path d="M20 48 Q8 48 8 36 Q8 24 20 8 Q32 24 32 36 Q32 48 20 48 Z" class="flame-outer" />
    <path d="M20 40 Q14 40 14 32 Q14 26 20 18 Q26 26 26 32 Q26 40 20 40 Z" class="flame-inner" />
  </svg>
</template>

<script>
export default {
  name: 'FireDecoration'
}
</script>

<style scoped>
.fire-icon {
  width: 100%;
  height: 100%;
}
.flame-outer {
  fill: var(--mp-red);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.flame-inner {
  fill: var(--mp-gold);
  stroke: var(--mp-ink);
  stroke-width: 2;
}
</style>
