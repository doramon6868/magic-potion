<template>
  <svg viewBox="0 0 64 64" class="water-icon">
    <path d="M32 8 Q20 28 20 40 Q20 54 32 54 Q44 54 44 40 Q44 28 32 8 Z" class="drop" />
    <path d="M28 36 Q32 32 36 36 Q36 44 32 46 Q28 44 28 36 Z" class="highlight" />
  </svg>
</template>

<script>
export default {
  name: 'WaterIcon'
}
</script>

<style scoped>
.water-icon {
  width: 100%;
  height: 100%;
}
.drop {
  fill: var(--mp-blue);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.highlight {
  fill: var(--mp-white);
}
</style>
