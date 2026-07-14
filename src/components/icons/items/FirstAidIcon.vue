<template>
  <svg viewBox="0 0 64 64" class="first-aid-icon">
    <rect x="10" y="20" width="44" height="30" rx="4" class="case" />
    <rect x="28" y="12" width="8" height="8" class="handle" />
    <rect x="28" y="28" width="8" height="16" class="cross-v" />
    <rect x="24" y="32" width="16" height="8" class="cross-h" />
  </svg>
</template>

<script>
export default {
  name: 'FirstAidIcon'
}
</script>

<style scoped>
.first-aid-icon {
  width: 100%;
  height: 100%;
}
.case {
  fill: var(--mp-white);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.handle,
.cross-v,
.cross-h {
  fill: var(--mp-red);
  stroke: var(--mp-ink);
  stroke-width: 2;
}
</style>
