<template>
  <section id="cta" class="bottom-cta">
    <div class="bottom-cta-glow" aria-hidden="true"></div>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bottom-cta-inner">
        <div class="bottom-cta-text">
          <span class="bottom-cta-tag">预约勘查</span>
          <h2 class="bottom-cta-title">先看现场，再谈方案</h2>
          <p class="bottom-cta-desc">
            告诉我们设备类型与现场情况，我们安排工程师评估带电作业可行性，
            给出可落地的工艺、工期与报价。
          </p>
          <ul class="bottom-cta-points">
            <li v-for="p in points" :key="p">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{{ p }}</span>
            </li>
          </ul>
        </div>

        <div class="bottom-cta-actions">
          <a v-if="phone" :href="`tel:${phone}`" class="bottom-cta-btn bottom-cta-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>电话咨询 {{ phone }}</span>
          </a>
          <NuxtLink to="/contact" class="bottom-cta-btn bottom-cta-btn-ghost">
            <span>在线预约勘查</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </NuxtLink>
          <p class="bottom-cta-note">工作日 9:00 - 18:00 · 留言 24 小时内回复</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: contact } = await useFetch('/api/contact', {
  transform: (res: any) => (res?.success ? res.data : null),
})

const phone = computed(() => contact.value?.phone1 || '')

const points = ['30 分钟内响应', '免费现场勘查', '方案与报价透明']
</script>

<style scoped>
.bottom-cta {
  position: relative;
  overflow: hidden;
  padding: 72px 0;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #3b82f6 100%);
  scroll-margin-top: 88px;
}

/* 右上角柔光，避免大色块显平 */
.bottom-cta-glow {
  position: absolute;
  top: -140px;
  right: -80px;
  width: 460px;
  height: 460px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
}

.bottom-cta-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
}

.bottom-cta-text { max-width: 620px; }

.bottom-cta-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.24);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 14px;
}

.bottom-cta-title {
  margin: 0 0 12px;
  font-size: clamp(22px, 2.2vw, 32px);
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.02em;
  line-height: 1.3;
}

.bottom-cta-desc {
  margin: 0 0 20px;
  font-size: 14.5px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.86);
}

.bottom-cta-points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
}

.bottom-cta-points li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.92);
}

.bottom-cta-points svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  color: #bfdbfe;
}

.bottom-cta-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  min-width: 240px;
}

.bottom-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 14px 26px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}

.bottom-cta-btn svg { width: 17px; height: 17px; }

.bottom-cta-btn-primary {
  background: #fff;
  color: #1d4ed8;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
}

.bottom-cta-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.26);
}

.bottom-cta-btn-ghost {
  background: transparent;
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
}

.bottom-cta-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: #fff;
  transform: translateY(-2px);
}

.bottom-cta-note {
  margin: 2px 0 0;
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 900px) {
  .bottom-cta-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 28px;
  }

  .bottom-cta-text { max-width: none; }
}

@media (max-width: 560px) {
  .bottom-cta { padding: 48px 0; }
  .bottom-cta-title { font-size: 22px; }
  .bottom-cta-desc { font-size: 13.5px; }
  .bottom-cta-points { gap: 8px 16px; }

  .bottom-cta-actions { min-width: 0; }
  .bottom-cta-btn { padding: 12px 20px; font-size: 14px; white-space: normal; text-align: center; }
}
</style>
