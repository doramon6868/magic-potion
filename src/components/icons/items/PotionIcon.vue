<template>
  <svg viewBox="0 0 64 64" class="potion-icon">
    <!-- 瓶口 -->
    <rect x="24" y="6" width="16" height="10" rx="2" class="bottle-neck" />
    <!-- 瓶身 -->
    <path d="M20 20 L20 48 Q20 58 32 58 Q44 58 44 48 L44 20 Z" class="bottle-body" />
    <!-- 液体 -->
    <path
      d="M22 28 L22 48 Q22 56 32 56 Q42 56 42 48 L42 28 Q32 32 22 28 Z"
      class="liquid"
      :class="liquidClass"
    />
    <!-- 标签 -->
    <rect x="22" y="34" width="20" height="10" rx="2" class="label" />
  </svg>
</template>

<script>
export default {
  name: 'PotionIcon',
  props: {
    rarity: { type: String, default: 'common' }
  },
  computed: {
    liquidClass() {
      return `liquid--${this.rarity || 'common'}`
    }
  }
}
</script>

<style scoped>
.potion-icon {
  width: 100%;
  height: 100%;
}
.bottle-neck,
.bottle-body,
.label {
  fill: var(--mp-white);
  opacity: 0.9;
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.liquid {
  stroke: var(--mp-ink);
  stroke-width: 2;
}
.liquid--common {
  fill: var(--mp-pink);
}
.liquid--uncommon {
  fill: var(--mp-mint);
}
.liquid--rare {
  fill: var(--mp-blue);
}
.liquid--epic {
  fill: var(--mp-purple);
}
</style>
