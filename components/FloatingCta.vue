<template>
  <!-- 桌面端右侧悬浮咨询条：电话 / 留言 / 回到顶部 -->
  <aside v-if="!isContactPage" class="floating-cta" :class="{ 'is-show': visible }" aria-label="快捷咨询">
    <!-- 电话咨询（hover/点击弹出号码卡片） -->
    <div class="fcta-phone-wrap" @mouseenter="phoneOpen = true" @mouseleave="phoneOpen = false">
      <transition name="fcta-pop">
        <div v-if="phoneOpen" class="fcta-phone-card">
          <p class="fcta-phone-label">电话咨询</p>
          <a v-if="phone" :href="`tel:${phone}`" class="fcta-phone-number" @click="track('悬浮-电话')">
            {{ phone }}
          </a>
          <p class="fcta-phone-hours">工作时间 8:30 - 17:30</p>
        </div>
      </transition>
      <button type="button" class="fcta-btn fcta-btn-primary" @click="togglePhone" @focus="phoneOpen = true">
        <svg class="fcta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        <span class="fcta-label">电话</span>
      </button>
    </div>

    <!-- 在线留言 -->
    <NuxtLink to="/contact" class="fcta-btn fcta-btn-plain" @click="track('悬浮-留言')">
      <svg class="fcta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="fcta-label">留言</span>
    </NuxtLink>

    <!-- 回到顶部（滚动较深才出现） -->
    <button
      type="button"
      class="fcta-btn fcta-btn-plain fcta-top"
      :class="{ 'is-visible': showTop }"
      :aria-hidden="!showTop"
      :tabindex="showTop ? 0 : -1"
      @click="scrollToTop"
    >
      <svg class="fcta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
      <span class="fcta-label">顶部</span>
    </button>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()
const visible = ref(false)
const showTop = ref(false)
const phoneOpen = ref(false)

const { data: contactData } = useFetch('/api/contact', {
  transform: (res: any) => (res?.success && res.data ? res.data : null),
  server: false,
})
const phone = computed(() => contactData.value?.phone1 || '')

// 联系页本身即询盘页，悬浮条无需重复出现
const isContactPage = computed(() => route.path.startsWith('/contact'))

// 询盘漏斗埋点：CTA 点击推百度统计事件
const track = (label: string) => {
  const w = window as any
  if (w._hmt) w._hmt.push(['_trackEvent', '询盘CTA', '点击', label])
}

const togglePhone = () => {
  phoneOpen.value = !phoneOpen.value
  track('悬浮-电话')
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  track('悬浮-顶部')
}

onMounted(() => {
  const onScroll = () => {
    visible.value = window.scrollY > 320
    showTop.value = window.scrollY > 800
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<style scoped>
.floating-cta {
  display: none;
}

@media (min-width: 769px) {
  .floating-cta {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: fixed;
    right: 20px;
    top: 50%;
    z-index: 55;
    /* 入场动画只动 transform/opacity（合成层），不动布局 */
    transform: translate(24px, -50%);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.28s ease, opacity 0.28s ease;
  }

  .floating-cta.is-show {
    transform: translate(0, -50%);
    opacity: 1;
    pointer-events: auto;
  }

  .fcta-btn {
    width: 52px;
    height: 52px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
  }

  .fcta-btn:hover {
    transform: translateY(-2px);
  }

  .fcta-btn-primary {
    background: #2563eb;
    color: #fff;
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.28);
  }

  .fcta-btn-primary:hover {
    background: #1d4ed8;
  }

  .fcta-btn-plain {
    background: #fff;
    color: #334155;
    border: 1px solid #e2e8f0;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
  }

  .fcta-btn-plain:hover {
    color: #1d4ed8;
    border-color: #93c5fd;
  }

  .fcta-icon {
    width: 19px;
    height: 19px;
  }

  .fcta-label {
    font-size: 10px;
    line-height: 1;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  /* 回到顶部：默认收起不占交互 */
  .fcta-top {
    opacity: 0;
    pointer-events: none;
    transform: scale(0.85);
    transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
  }

  .fcta-top.is-visible {
    opacity: 1;
    pointer-events: auto;
    transform: scale(1);
  }

  .fcta-top.is-visible:hover {
    transform: translateY(-2px);
  }

  /* 电话号码卡片 */
  .fcta-phone-wrap {
    position: relative;
  }

  .fcta-phone-card {
    position: absolute;
    right: 62px;
    top: 50%;
    transform: translateY(-50%);
    width: 216px;
    padding: 16px 18px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.16);
  }

  .fcta-phone-label {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 6px;
  }

  .fcta-phone-number {
    display: block;
    font-size: 21px;
    font-weight: 700;
    color: #1d4ed8;
    letter-spacing: 0.01em;
    text-decoration: none;
  }

  .fcta-phone-number:hover {
    color: #1e40af;
  }

  .fcta-phone-hours {
    margin-top: 6px;
    font-size: 12px;
    color: #94a3b8;
  }

  /* 弹层过渡：transform/opacity */
  .fcta-pop-enter-active,
  .fcta-pop-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
  }

  .fcta-pop-enter-from,
  .fcta-pop-leave-to {
    opacity: 0;
    transform: translateY(-50%) translateX(8px);
  }
}
</style>
