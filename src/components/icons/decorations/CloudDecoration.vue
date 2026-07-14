<template>
  <svg viewBox="0 0 120 60" class="cloud-icon">
    <path d="M20 40 Q10 40 10 30 Q10 15 30 15 Q35 5 55 10 Q70 0 90 15 Q110 15 110 32 Q110 45 90 45 L20 45 Z" class="cloud" />
  </svg>
</template>

<script>
export default {
  name: 'CloudDecoration'
}
</script>

<style scoped>
.cloud-icon {
  width: 100%;
  height: 100%;
}
.cloud {
  fill: var(--mp-white);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
</style>
