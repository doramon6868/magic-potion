<template>
  <svg viewBox="0 0 64 64" class="lucky-charm-icon">
    <path d="M32 6 L38 22 L56 22 L42 34 L48 52 L32 42 L16 52 L22 34 L8 22 L26 22 Z" class="star" />
    <circle cx="32" cy="30" r="4" class="center" />
    <path d="M32 6 L32 14" class="spark" fill="none" />
    <path d="M56 22 L50 26" class="spark" fill="none" />
    <path d="M48 52 L42 48" class="spark" fill="none" />
    <path d="M16 52 L22 48" class="spark" fill="none" />
    <path d="M8 22 L14 26" class="spark" fill="none" />
  </svg>
</template>

<script>
export default {
  name: 'LuckyCharmIcon'
}
</script>

<style scoped>
.lucky-charm-icon {
  width: 100%;
  height: 100%;
}
.star {
  fill: var(--mp-mint-light);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.center {
  fill: var(--mp-gold);
  stroke: var(--mp-ink);
  stroke-width: 2;
}
.spark {
  stroke: var(--mp-gold);
  stroke-width: 3;
  stroke-linecap: round;
}
</style>
