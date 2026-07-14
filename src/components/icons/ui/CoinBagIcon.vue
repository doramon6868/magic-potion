<template>
  <svg viewBox="0 0 64 64" class="coin-bag-icon">
    <!-- 袋子 -->
    <path d="M20 20 Q32 10 44 20 L48 52 Q32 60 16 52 Z" class="bag" />
    <!-- 袋口绳子 -->
    <rect x="22" y="16" width="20" height="6" rx="3" class="rope" />
    <!-- 金币符号 -->
    <circle cx="32" cy="38" r="10" class="coin" />
    <text x="32" y="43" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--mp-ink)">¥</text>
  </svg>
</template>

<script>
export default {
  name: 'CoinBagIcon'
}
</script>

<style scoped>
.coin-bag-icon {
  width: 100%;
  height: 100%;
}
.bag {
  fill: var(--mp-gold);
  stroke: var(--mp-ink);
  stroke-width: 3;
}
.rope {
  fill: var(--mp-gold-light);
  stroke: var(--mp-ink);
  stroke-width: 2;
}
.coin {
  fill: var(--mp-gold-light);
  stroke: var(--mp-ink);
  stroke-width: 2;
}
</style>
