<template>
  <svg viewBox="0 0 64 64" class="toy-icon">
    <circle cx="32" cy="32" r="18" class="ball" />
    <path d="M14 32 Q32 20 50 32" class="stripe" fill="none" />
    <path d="M14 32 Q32 44 50 32" class="stripe" fill="none" />
    <path d="M32 14 L32 50" class="stripe-center" fill="none" />
  </svg>
</template>

<script>
export default {
  name: 'ToyIcon'
}
</script>

<style scoped>
.toy-icon {
  width: 100%;
  height: 100%;
}
.ball {
  fill: var(--mp-mint-light);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.stripe,
.stripe-center {
  stroke: var(--mp-ink);
  stroke-width: 3;
  stroke-linecap: round;
}
</style>
