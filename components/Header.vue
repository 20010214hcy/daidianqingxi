<template>
  <header
    :class="[
      'bg-white shadow-md z-50 sticky top-0',
      isHomePage ? 'header-scroll-anim' : '',
      isHomePage && headerHidden ? 'header-hidden' : ''
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 md:h-[72px]">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <div v-if="siteSetting.siteLogo" class="h-10 flex items-center justify-center bg-slate-100">
            <img :src="siteSetting.siteLogo" alt="Logo" class="w-full h-full object-contain" />
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-stretch h-full space-x-1">
          <NuxtLink
            v-for="item in navItems" :key="item.to"
            :to="item.to"
            class="nav-link"
            exact-active-class="nav-link-active"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Mobile: phone + menu -->
        <div class="md:hidden flex items-center gap-1">
          <a
            v-if="headerPhone"
            :href="`tel:${headerPhone}`"
            class="header-phone-btn"
            aria-label="电话咨询"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </a>
          <button
            type="button"
            class="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="打开菜单"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition name="mobile-menu">
        <div v-if="isMobileMenuOpen" class="md:hidden overflow-hidden">
          <nav class="flex flex-col space-y-1 pt-4 pb-4">
            <NuxtLink
              v-for="item in navItems" :key="item.to"
              :to="item.to"
              class="nav-link-mobile"
              exact-active-class="nav-link-mobile-active"
              @click="isMobileMenuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { to: '/', label: '首页' },
  { to: '/products', label: '产品' },
  { to: '/services', label: '服务项目' },
  { to: '/cases', label: '工程案例' },
  { to: '/news', label: '新闻资讯' },
  { to: '/contact', label: '联系我们' },
]
const isHomePage = computed(() => route.path === '/')

const isMobileMenuOpen = ref(false)
const headerHidden = ref(false)
let lastScrollY = 0
let ticking = false

const handleScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const currentScrollY = window.scrollY
    if (!isDesktop.value) {
      headerHidden.value = false
      lastScrollY = currentScrollY
      ticking = false
      return
    }
    if (currentScrollY <= 10) {
      headerHidden.value = false
      lastScrollY = currentScrollY
      ticking = false
      return
    }
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      headerHidden.value = true
    } else if (currentScrollY < lastScrollY) {
      headerHidden.value = false
    }
    lastScrollY = currentScrollY
    ticking = false
  })
}

const isDesktop = ref(true)
if (import.meta.client) {
  const mql = window.matchMedia('(min-width: 768px)')
  isDesktop.value = mql.matches
  mql.addEventListener('change', (e) => { isDesktop.value = e.matches })
}

watch(isHomePage, (val) => {
  if (val) {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  } else {
    window.removeEventListener('scroll', handleScroll)
    headerHidden.value = false
  }
}, { immediate: false })

const { data: settingData } = useFetch('/api/settings', {
  transform: (res: any) => res?.success && res.data ? res.data : { siteName: '', siteSlogan: '', siteLogo: '', siteIcon: '' }
})
const siteSetting = computed(() => settingData.value || { siteName: '', siteSlogan: '', siteLogo: '', siteIcon: '' })

onMounted(() => {
  if (isHomePage.value) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header-scroll-anim {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.header-hidden {
  transform: translateY(-100%);
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 16px;
  color: #64748b;
  font-weight: 500;
  transition: color 0.3s ease;
}

/* 下划线锁在导航条内，用 scaleX 避免 width 引起布局抖动 */
.nav-link::after {
  content: '';
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 0;
  height: 2px;
  border-radius: 1px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.25s ease;
  pointer-events: none;
}

.nav-link:hover {
  color: #3b82f6;
}

.nav-link:hover::after {
  transform: scaleX(1);
}

.nav-link-active {
  color: #3b82f6 !important;
  font-weight: 600 !important;
}

.nav-link-active::after {
  transform: scaleX(1);
}

.nav-link-mobile {
  position: relative;
  display: block;
  padding: 14px 20px;
  color: #64748b;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link-mobile::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.2s ease;
}

.nav-link-mobile:hover {
  color: #3b82f6;
}

.nav-link-mobile:hover::after {
  transform: scaleX(1);
}

.nav-link-mobile-active {
  color: #3b82f6 !important;
  font-weight: 600 !important;
}

.nav-link-mobile-active::after {
  transform: scaleX(1);
}

/* 移动端菜单动画 */
.mobile-menu-enter-active {
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
}
.mobile-menu-leave-active {
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  max-height: 0;
  opacity: 0;
}
.mobile-menu-enter-to,
.mobile-menu-leave-from {
  max-height: 400px;
  opacity: 1;
}

.header-phone-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  color: #2563eb;
  background: #eff6ff;
  transition: background 0.2s ease, color 0.2s ease;
}

.header-phone-btn:hover {
  background: #dbeafe;
  color: #1d4ed8;
}
</style>
