<template>
  <svg viewBox="0 0 64 64" class="revive-icon">
    <path d="M32 8 L38 22 L54 22 L42 32 L46 48 L32 38 L18 48 L22 32 L10 22 L26 22 Z" class="flask-star" />
    <circle cx="32" cy="48" r="8" class="heart" />
    <path d="M32 44 L34 48 L38 48 L34 51 L36 55 L32 52 L28 55 L30 51 L26 48 L30 48 Z" class="heart-shine" />
  </svg>
</template>

<script>
export default {
  name: 'ReviveIcon'
}
</script>

<style scoped>
.revive-icon {
  width: 100%;
  height: 100%;
}
.flask-star {
  fill: var(--mp-purple-light);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.heart {
  fill: var(--mp-pink);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.heart-shine {
  fill: var(--mp-white);
}
</style>
