<template>
  <svg viewBox="0 0 64 64" class="hourglass-icon">
    <rect x="16" y="8" width="32" height="6" rx="2" class="frame-top" />
    <rect x="16" y="50" width="32" height="6" rx="2" class="frame-bottom" />
    <path d="M20 14 L44 14 L32 32 Z" class="sand-top" />
    <path d="M32 32 L20 50 L44 50 Z" class="sand-bottom" />
    <path d="M20 14 L20 50" class="frame-side" fill="none" />
    <path d="M44 14 L44 50" class="frame-side" fill="none" />
  </svg>
</template>

<script>
export default {
  name: 'HourglassIcon'
}
</script>

<style scoped>
.hourglass-icon {
  width: 100%;
  height: 100%;
}
.frame-top,
.frame-bottom {
  fill: var(--mp-gold);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.frame-side {
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.sand-top,
.sand-bottom {
  fill: var(--mp-purple-light);
  stroke: var(--mp-ink);
  stroke-width: 2;
}
</style>
