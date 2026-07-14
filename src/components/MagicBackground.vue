<template>
  <div class="magic-background">
    <!-- 远景云朵 -->
    <div class="cloud-layer far">
      <CloudDecoration
        v-for="i in 3"
        :key="`far-${i}`"
        class="cloud far-cloud"
        :style="getCloudStyle(i, 'far')"
      />
    </div>

    <!-- 近景云朵 -->
    <div class="cloud-layer near">
      <CloudDecoration
        v-for="i in 2"
        :key="`near-${i}`"
        class="cloud near-cloud"
        :style="getCloudStyle(i, 'near')"
      />
    </div>

    <!-- 星星 -->
    <StarDecoration
      v-for="i in 12"
      :key="`star-${i}`"
      class="star"
      :style="getStarStyle(i)"
    />

    <!-- 漂浮岛屿 -->
    <div class="floating-island" :style="getIslandStyle(1)">
      <div class="island-top"></div>
      <div class="island-grass"></div>
    </div>

    <!-- 流星 -->
    <div v-if="showShootingStar" class="shooting-star"></div>
  </div>
</template>

<script>
import CloudDecoration from './icons/decorations/CloudDecoration.vue'
import StarDecoration from './icons/decorations/StarDecoration.vue'

export default {
  name: 'MagicBackground',

  components: {
    CloudDecoration,
    StarDecoration
  },

  data() {
    return {
      showShootingStar: false,
      shootingStarTimer: null
    }
  },

  mounted() {
    this.scheduleShootingStar()
  },

  beforeUnmount() {
    if (this.shootingStarTimer) {
      clearTimeout(this.shootingStarTimer)
    }
  },

  methods: {
    getCloudStyle(index, layer) {
      const positions = {
        far: [
          { top: '10%', left: '5%', width: '120px', animationDelay: '0s', duration: '40s' },
          { top: '25%', left: '70%', width: '100px', animationDelay: '-15s', duration: '45s' },
          { top: '8%', left: '40%', width: '90px', animationDelay: '-30s', duration: '50s' }
        ],
        near: [
          { top: '60%', left: '80%', width: '140px', animationDelay: '-5s', duration: '30s' },
          { top: '75%', left: '10%', width: '110px', animationDelay: '-20s', duration: '35s' }
        ]
      }

      const pos = positions[layer][index - 1] || positions[layer][0]
      return {
        ...pos,
        animationDuration: pos.duration
      }
    },

    getStarStyle(index) {
      const top = 5 + (index * 7) % 80
      const left = 5 + (index * 13) % 90
      const size = 12 + (index % 3) * 6
      const delay = (index * 0.7) % 3
      const duration = 1.5 + (index % 2) * 0.5

      return {
        top: `${top}%`,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }
    },

    getIslandStyle(index) {
      return {
        bottom: '5%',
        left: `${20 + index * 30}%`,
        animationDelay: `${index * 0.5}s`
      }
    },

    scheduleShootingStar() {
      const nextTime = 5000 + Math.random() * 10000
      this.shootingStarTimer = setTimeout(() => {
        this.showShootingStar = true
        setTimeout(() => {
          this.showShootingStar = false
          this.scheduleShootingStar()
        }, 1500)
      }, nextTime)
    }
  }
}
</script>

<style scoped>
.magic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
  background: var(--mp-bg);
}

.cloud-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.cloud {
  position: absolute;
  opacity: 0.7;
  animation: float-cloud linear infinite;
}

.far-cloud {
  opacity: 0.5;
}

.near-cloud {
  opacity: 0.8;
}

.star {
  position: absolute;
  animation: twinkle ease-in-out infinite;
}

.floating-island {
  position: absolute;
  width: 120px;
  height: 40px;
  animation: island-float 4s ease-in-out infinite;
}

.island-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: var(--mp-purple-light);
  border-radius: 50% 50% 0 0;
  border: 3px solid var(--mp-ink);
  border-bottom: none;
}

.island-grass {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 45%;
  background: var(--mp-mint);
  border-radius: 50%;
  border: 3px solid var(--mp-ink);
}

.shooting-star {
  position: absolute;
  top: 20%;
  left: -10%;
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--mp-gold), var(--mp-white));
  border-radius: 3px;
  transform: rotate(-20deg);
  animation: shooting 1.5s ease-out forwards;
}

@keyframes float-cloud {
  from { transform: translateX(-200px); }
  to { transform: translateX(calc(100vw + 200px)); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes island-float {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
}

@keyframes shooting {
  from { transform: translateX(0) translateY(0) rotate(-20deg); opacity: 1; }
  to { transform: translateX(80vw) translateY(30vh) rotate(-20deg); opacity: 0; }
}
</style>
