<template>
  <svg viewBox="0 0 64 64" class="scroll-icon">
    <path d="M16 12 Q24 8 32 12 Q40 8 48 12 L48 52 Q40 48 32 52 Q24 48 16 52 Z" class="paper" />
    <path d="M22 20 L42 20" class="line" />
    <path d="M22 28 L40 28" class="line" />
    <path d="M22 36 L38 36" class="line" />
    <path d="M16 12 Q24 16 32 12" class="roll-top" fill="none" />
    <path d="M16 52 Q24 56 32 52" class="roll-bottom" fill="none" />
  </svg>
</template>

<script>
export default {
  name: 'ScrollIcon'
}
</script>

<style scoped>
.scroll-icon {
  width: 100%;
  height: 100%;
}
.paper {
  fill: var(--mp-gold-light);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.line {
  fill: none;
  stroke: var(--mp-ink);
  stroke-width: 2;
  stroke-linecap: round;
}
.roll-top,
.roll-bottom {
  stroke: var(--mp-ink);
  stroke-width: 3;
  stroke-linecap: round;
}
</style>
