<template>
  <svg viewBox="0 0 64 64" class="amulet-icon">
    <path d="M32 6 L40 20 L32 18 L24 20 Z" class="clasp" />
    <path d="M24 20 Q12 28 12 40 Q12 54 32 58 Q52 54 52 40 Q52 28 40 20" class="chain" fill="none" />
    <circle cx="32" cy="40" r="12" class="gem-frame" />
    <circle cx="32" cy="40" r="7" class="gem" />
  </svg>
</template>

<script>
export default {
  name: 'AmuletIcon'
}
</script>

<style scoped>
.amulet-icon {
  width: 100%;
  height: 100%;
}
.clasp {
  fill: var(--mp-gold);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.chain {
  stroke: var(--mp-gold);
  stroke-width: 3;
  fill: none;
}
.gem-frame {
  fill: var(--mp-gold-light);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.gem {
  fill: var(--mp-blue);
  stroke: var(--mp-ink);
  stroke-width: 2;
}
</style>
