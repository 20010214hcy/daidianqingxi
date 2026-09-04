<template>
  <header
    :class="[
      'bg-white shadow-md z-50 sticky top-0',
      isHomePage ? 'header-scroll-anim' : '',
      isHomePage && headerHidden ? 'header-hidden' : ''
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <div v-if="siteSetting.siteLogo" class="h-10 flex items-center justify-center bg-slate-100">
            <img :src="siteSetting.siteLogo" alt="Logo" class="w-full h-full object-contain" loading="lazy" />
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-1">
          <NuxtLink
            v-for="item in navItems" :key="item.to"
            :to="item.to"
            class="nav-link"
            exact-active-class="nav-link-active"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Mobile Menu Button -->
        <UButton
          icon="i-heroicons-bars-3"
          color="gray"
          variant="ghost"
          class="md:hidden"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        />
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
  padding: 12px 18px;
  color: #64748b;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #3b82f6;
}

.nav-link:hover::after {
  width: 40px;
}

.nav-link-active {
  color: #3b82f6 !important;
  font-weight: 600 !important;
}

.nav-link-active::after {
  width: 40px;
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
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transition: width 0.2s ease;
}

.nav-link-mobile:hover {
  color: #3b82f6;
}

.nav-link-mobile:hover::after {
  width: calc(100% - 40px);
}

.nav-link-mobile-active {
  color: #3b82f6 !important;
  font-weight: 600 !important;
}

.nav-link-mobile-active::after {
  width: calc(100% - 40px);
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
</style>
