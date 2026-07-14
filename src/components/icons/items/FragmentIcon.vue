<template>
  <svg viewBox="0 0 64 64" class="fragment-icon" :class="typeClass">
    <path d="M32 6 L44 18 L40 34 L52 44 L38 56 L32 48 L26 56 L12 44 L24 34 L20 18 Z" class="shard" />
    <circle cx="32" cy="32" r="6" class="shard-core" />
  </svg>
</template>

<script>
export default {
  name: 'FragmentIcon',
  props: {
    type: { type: String, default: 'cat' }
  },
  computed: {
    typeClass() {
      return `fragment-icon--${this.type || 'cat'}`
    }
  }
}
</script>

<style scoped>
.fragment-icon {
  width: 100%;
  height: 100%;
}
.shard {
  stroke: var(--mp-ink);
  stroke-width: 3;
  fill: var(--fragment-fill, var(--mp-pet-cat));
}
.shard-core {
  fill: var(--mp-white);
  stroke: var(--mp-ink);
  stroke-width: 2;
}
.fragment-icon--cat {
  --fragment-fill: var(--mp-pet-cat);
}
.fragment-icon--bird {
  --fragment-fill: var(--mp-pet-bird);
}
.fragment-icon--fox {
  --fragment-fill: var(--mp-pet-fox);
}
.fragment-icon--dragon {
  --fragment-fill: var(--mp-pet-dragon);
}
</style>
