<template>
  <svg viewBox="0 0 64 64" class="candy-icon">
    <rect x="14" y="24" width="36" height="16" rx="8" class="candy-body" />
    <path d="M14 32 L6 24 L6 40 Z" class="twist-left" />
    <path d="M50 32 L58 24 L58 40 Z" class="twist-right" />
    <rect x="22" y="24" width="4" height="16" class="stripe-yellow" />
    <rect x="34" y="24" width="4" height="16" class="stripe-blue" />
  </svg>
</template>

<script>
export default {
  name: 'CandyIcon'
}
</script>

<style scoped>
.candy-icon {
  width: 100%;
  height: 100%;
}
.candy-body {
  fill: var(--mp-pink);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.twist-left,
.twist-right {
  fill: var(--mp-gold-light);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.stripe-yellow {
  fill: var(--mp-gold-light);
}
.stripe-blue {
  fill: var(--mp-blue);
}
</style>
