<template>
  <section class="py-16 bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <div class="text-center section-header-center">
        <span class="section-tag">合作伙伴</span>
        <h2 class="section-title">值得信赖的合作伙伴</h2>
        
      </div>
    </div>
    <div class="marquee-container">
      <div class="marquee-track">
        <div v-for="(partner, i) in repeatedPartners" :key="i" class="marquee-item">
          <span>{{ partner }}</span>
        </div>
      </div>
    </div>
    <div class="marquee-container mt-4">
      <div class="marquee-track marquee-reverse">
        <div v-for="(partner, i) in repeatedPartnersReverse" :key="'r-'+i" class="marquee-item">
          <span>{{ partner }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const partners = ['国家电网', '南方电网', '华能集团', '大唐集团', '华电集团', '国电集团']
const repeatedPartners = [...partners, ...partners, ...partners]
const repeatedPartnersReverse = [...partners].reverse().concat(partners, partners)
</script>

<style scoped>
.marquee-container { overflow: hidden; white-space: nowrap; }

.marquee-track {
  display: inline-flex;
  animation: marquee 30s linear infinite;
}

.marquee-track:hover { animation-play-state: paused; }
.marquee-reverse { animation-direction: reverse; }

.marquee-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 48px;
  margin: 0 8px;
  min-width: 160px;
  transition: all 0.3s;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.333%); }
}
</style>
