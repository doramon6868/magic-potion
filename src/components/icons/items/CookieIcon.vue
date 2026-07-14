<template>
  <svg viewBox="0 0 64 64" class="cookie-icon">
    <circle cx="32" cy="32" r="28" class="cookie-base" />
    <circle cx="20" cy="22" r="3" class="chip" />
    <circle cx="40" cy="20" r="4" class="chip" />
    <circle cx="30" cy="36" r="3.5" class="chip" />
    <circle cx="46" cy="40" r="3" class="chip" />
    <circle cx="22" cy="46" r="3.5" class="chip" />
  </svg>
</template>

<script>
export default {
  name: 'CookieIcon'
}
</script>

<style scoped>
.cookie-icon {
  width: 100%;
  height: 100%;
}
.cookie-base {
  fill: var(--mp-gold-light);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.chip {
  fill: var(--mp-ink);
}
</style>
