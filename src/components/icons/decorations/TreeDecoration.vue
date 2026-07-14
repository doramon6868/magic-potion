<template>
  <svg viewBox="0 0 64 80" class="tree-icon">
    <!-- 树干 -->
    <rect x="26" y="50" width="12" height="24" class="trunk" />
    <!-- 树冠三层 -->
    <polygon points="32 8 12 35 52 35" class="foliage" />
    <polygon points="32 22 10 50 54 50" class="foliage" />
    <polygon points="32 36 8 64 56 64" class="foliage" />
  </svg>
</template>

<script>
export default {
  name: 'TreeDecoration'
}
</script>

<style scoped>
.tree-icon {
  width: 100%;
  height: 100%;
}
.trunk {
  fill: var(--mp-ink);
  opacity: 0.7;
}
.foliage {
  fill: var(--mp-mint);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
</style>
