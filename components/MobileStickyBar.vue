<template>
  <div class="mobile-sticky-bar" :class="{ 'is-show': visible }">
    <a v-if="phone" :href="`tel:${phone}`" class="msb-btn msb-btn-primary" @click="track('移动条-电话')">
      <svg class="msb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
      <span>电话</span>
    </a>
    <button type="button" class="msb-btn msb-btn-ghost msb-btn-chat" @click="openChatFromBar">
      <svg class="msb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
      <span>咨询</span>
      <i v-if="unread > 0" class="msb-badge" aria-label="有新回复"></i>
    </button>
    <NuxtLink to="/contact" class="msb-btn msb-btn-ghost" @click="track('移动条-留言')">
      <svg class="msb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>留言</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const visible = ref(false)

const { unread, openChat } = useChat()

const { data: contactData } = useFetch('/api/contact', {
  transform: (res: any) => (res?.success && res.data ? res.data : null),
  server: false,
})

const phone = computed(() => contactData.value?.phone1 || '')

// 询盘漏斗埋点：CTA 点击推百度统计事件
const track = (label: string) => {
  const w = window as any
  if (w._hmt) w._hmt.push(['_trackEvent', '询盘CTA', '点击', label])
}

const openChatFromBar = () => {
  openChat()
  track('移动条-在线客服')
}

onMounted(() => {
  const onScroll = () => {
    visible.value = window.scrollY > 320
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<style scoped>
.mobile-sticky-bar {
  display: none;
}

@media (max-width: 768px) {
  .mobile-sticky-bar {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 60;
    gap: 8px;
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px));
    background: rgba(255, 255, 255, 0.96);
    border-top: 1px solid #e2e8f0;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transform: translateY(110%);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.28s ease, opacity 0.28s ease;
  }

  .mobile-sticky-bar.is-show {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .msb-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 44px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    font-family: inherit;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s ease;
  }

  .msb-btn-chat {
    position: relative;
  }

  .msb-badge {
    position: absolute;
    top: 8px;
    right: 12px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
  }

  .msb-btn:active {
    transform: scale(0.98);
  }

  .msb-icon {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
  }

  .msb-btn-primary {
    background: #2563eb;
    color: #fff;
    flex: 1.15;
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.25);
  }

  .msb-btn-primary:hover {
    background: #1d4ed8;
  }

  .msb-btn-ghost {
    background: #fff;
    color: #1e293b;
    border: 1px solid #e2e8f0;
  }

  .msb-btn-ghost:hover {
    border-color: #93c5fd;
    color: #1d4ed8;
  }
}
</style>
