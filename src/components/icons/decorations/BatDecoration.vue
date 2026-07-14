<template>
  <svg viewBox="0 0 60 40" class="bat-icon">
    <path d="M30 20 Q20 10 5 15 Q15 25 30 22 Q45 25 55 15 Q40 10 30 20 Z" class="bat-body" />
    <circle cx="27" cy="18" r="2" class="bat-eye" />
    <circle cx="33" cy="18" r="2" class="bat-eye" />
  </svg>
</template>

<script>
export default {
  name: 'BatDecoration'
}
</script>

<style scoped>
.bat-icon {
  width: 100%;
  height: 100%;
}
.bat-body {
  fill: var(--mp-ink);
}
.bat-eye {
  fill: var(--mp-white);
}
</style>
