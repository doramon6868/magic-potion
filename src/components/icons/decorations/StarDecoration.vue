<template>
  <svg viewBox="0 0 40 40" class="star-icon">
    <path d="M20 2 L24 16 L38 16 L27 24 L31 38 L20 30 L9 38 L13 24 L2 16 L16 16 Z" class="star" />
  </svg>
</template>

<script>
export default {
  name: 'StarDecoration'
}
</script>

<style scoped>
.star-icon {
  width: 100%;
  height: 100%;
}
.star {
  fill: var(--mp-gold);
  stroke: var(--mp-ink);
  stroke-width: 2;
}
</style>
