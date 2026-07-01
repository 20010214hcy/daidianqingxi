<template>
  <section class="py-16 bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-slate-800 mb-4">合作伙伴</h2>
        <p class="text-slate-600 text-lg">值得信赖的合作伙伴</p>
      </div>
    </div>
    <div class="marquee-container">
      <div class="marquee-track">
        <div v-for="(partner, i) in repeatedPartners" :key="i" class="marquee-item">
          <span class="text-slate-400 font-bold text-lg tracking-wide">{{ partner }}</span>
        </div>
      </div>
    </div>
    <div class="marquee-container mt-4">
      <div class="marquee-track marquee-reverse">
        <div v-for="(partner, i) in repeatedPartnersReverse" :key="'r-'+i" class="marquee-item">
          <span class="text-slate-300 font-medium text-base tracking-wide">{{ partner }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const partners = ['国家电网', '南方电网', '华能集团', '大唐集团', '华电集团', '国电集团']

// 重复3次以实现无缝滚动
const repeatedPartners = [...partners, ...partners, ...partners]
const repeatedPartnersReverse = [...partners].reverse().concat(partners, partners)
</script>

<style scoped>
.marquee-container {
  overflow: hidden;
  white-space: nowrap;
}

.marquee-track {
  display: inline-flex;
  animation: marquee 30s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

.marquee-reverse {
  animation-direction: reverse;
}

.marquee-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 48px;
  margin: 0 8px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  min-width: 160px;
  transition: background 0.3s;
}

.marquee-item:hover {
  background: #eff6ff;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.333%);
  }
}
</style>
