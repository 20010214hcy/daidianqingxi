<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="联系我们" subtitle="期待与您合作，为您提供专业的电力设备运维服务" />

    <!-- 联系信息卡片 -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-if="contact.phone1" class="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 will-change-transform">
            <div class="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-700 mb-4">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">服务热线</p>
            <a :href="`tel:${contact.phone1}`" class="text-xl font-bold text-slate-900 hover:text-primary-600 transition-colors">
              {{ contact.phone1 }}
            </a>
            <p v-if="contact.phone2" class="text-sm text-slate-400 mt-1">业务咨询：{{ contact.phone2 }}</p>
          </div>

          <div v-if="contact.email1" class="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 will-change-transform">
            <div class="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-700 mb-4">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">电子邮箱</p>
            <a :href="`mailto:${contact.email1}`" class="text-lg font-bold text-slate-900 hover:text-primary-600 transition-colors break-all">
              {{ contact.email1 }}
            </a>
            <p v-if="contact.email2" class="text-sm text-slate-400 mt-1">售后：{{ contact.email2 }}</p>
          </div>

          <div v-if="contact.address" class="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 will-change-transform">
            <div class="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-700 mb-4">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">公司地址</p>
            <p class="text-base font-semibold text-slate-900 leading-relaxed">{{ contact.address }}</p>
          </div>

          <div v-if="contact.workHours1" class="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 will-change-transform">
            <div class="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-700 mb-4">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">工作时间</p>
            <p class="text-base font-semibold text-slate-900">{{ contact.workHours1 }}</p>
            <p v-if="contact.workHours2" class="text-sm text-slate-400 mt-1">{{ contact.workHours2 }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 表单 + 地图 -->
    <section class="py-16 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-10 items-stretch">
          <!-- 表单 -->
          <div class="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-8 md:p-10">
            <h2 class="text-2xl font-bold text-slate-900 mb-2">在线留言</h2>
            <p class="text-sm text-slate-500 mb-8">请填写以下信息，我们的专业团队将在 24 小时内与您取得联系</p>

            <form @submit.prevent="submitForm" class="space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">姓名 <span class="text-red-500">*</span></label>
                  <input v-model="formData.name" type="text" required placeholder="请输入您的姓名"
                    class="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">电话 <span class="text-red-500">*</span></label>
                  <input v-model="formData.phone" type="tel" required placeholder="请输入您的电话"
                    class="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">邮箱</label>
                  <input v-model="formData.email" type="email" placeholder="请输入您的邮箱"
                    class="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">公司名称</label>
                  <input v-model="formData.company" type="text" placeholder="请输入公司名称"
                    class="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">咨询主题</label>
                <input v-model="formData.subject" type="text" placeholder="请输入咨询主题"
                  class="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">留言内容 <span class="text-red-500">*</span></label>
                <textarea v-model="formData.content" required rows="5" placeholder="请详细描述您的需求..."
                  class="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all resize-none" />
              </div>

              <button type="submit" :disabled="isSubmitting"
                class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <template v-else>
                  提交留言
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </template>
              </button>

              <Transition name="fade">
                <p v-if="submitMessage" class="text-center text-sm font-medium px-4 py-3 rounded-xl"
                  :class="submitMessage.includes('成功')
                    ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                    : 'text-red-600 bg-red-50 border border-red-200'">
                  {{ submitMessage }}
                </p>
              </Transition>
            </form>
          </div>

          <!-- 地图 -->
          <div class="lg:col-span-2 flex flex-col gap-4">
            <div class="flex-1 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[400px] relative">
              <div id="amap-container" class="w-full h-full"></div>
              <!-- 快速导航按钮 -->
              <div class="absolute bottom-4 right-4 flex flex-col gap-2">
                <a
                  href="https://uri.amap.com/navigation?to=113.401646,33.714605,玺铭电力&mode=car&policy=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-lg border border-slate-200 text-slate-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 group"
                  title="打开高德地图导航"
                >
                  <svg class="w-5 h-5 text-primary-600 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                  <span class="text-sm font-medium">导航</span>
                </a>
                <a
                  :href="`https://ditu.amap.com/search?query=${encodeURIComponent(contact.address || '玺铭电力')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-lg border border-slate-200 text-slate-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 group"
                  title="搜索周边"
                >
                  <svg class="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <span class="text-sm font-medium">搜索周边</span>
                </a>
              </div>
            </div>
            <div class="flex items-start gap-2 px-1 text-sm text-slate-500">
              <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{{ contact.address }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

import type { ContactInfo } from '~/types'

useHead({
  title: '联系我们 - 玺铭电力',
  meta: [
    { name: 'description', content: '联系玺铭电力 — 全国服务热线，专业电力设备清洗服务，期待与您合作。' },
    { property: 'og:title', content: '联系我们 - 玺铭电力' },
    { property: 'og:description', content: '全国服务热线，专业电力设备清洗服务，期待与您合作。' },
  ]
})

const defaultContact: ContactInfo = {
  companyName: '玺铭电力',
  address: '河南省平顶山市高新区尼龙织造产业园',
  phone1: '400-888-8888',
  phone2: '010-12345678',
  email1: 'contact@daidianqingxi.com',
  email2: 'service@daidianqingxi.com',
  workHours1: '周一至周五 9:00 - 18:00',
  workHours2: '周六 9:00 - 12:00',
}

// SSR 数据获取
const { data: contactData } = useFetch('/api/contact', {
  transform: (res: any) => res?.success && res.data ? res.data : defaultContact
})
const contact = computed<ContactInfo>(() => contactData.value || defaultContact)

const formData = ref({
  name: '',
  phone: '',
  email: '',
  company: '',
  subject: '',
  content: ''
})

const isSubmitting = ref(false)
const submitMessage = ref('')

// 高德地图配置
const AMAP_KEY = 'a6bc0a35ef8702edcd3c960cff07bb87'
const AMAP_SECRET = '4322df137bcd7f4aabd87bb57d2f96c9'

// 初始化地图
const initMap = () => {
  if (typeof window.AMap === 'undefined') {
    console.error('高德地图 API 未加载')
    return
  }

  const map = new window.AMap.Map('amap-container', {
    zoom: 15,
    center: [113.401646, 33.714605],
    viewMode: '2D'
  })

  // 添加标记点
  const marker = new window.AMap.Marker({
    position: [113.401646, 33.714605],
    title: '玺铭电力',
    animation: 'AMAP_ANIMATION_DROP'
  })

  map.add(marker)

  // 添加信息窗体
  const infoWindow = new window.AMap.InfoWindow({
    content: `
      <div style="padding: 10px;">
        <h3 style="font-weight: bold; margin-bottom: 5px;">玺铭电力</h3>
        <p style="color: #666; font-size: 13px;">${contact.value.address || '河南省平顶山市高新区尼龙织造产业园'}</p>
      </div>
    `,
    offset: new window.AMap.Pixel(0, -30)
  })

  marker.on('click', () => {
    infoWindow.open(map, marker.getPosition())
  })

  // 默认打开信息窗体
  infoWindow.open(map, marker.getPosition())
}

// 加载高德地图 API
const loadAmapScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.AMap !== 'undefined') {
      resolve(window.AMap)
      return
    }

    // 设置安全密钥
    window._AMapSecurityConfig = {
      securityJsCode: AMAP_SECRET,
    }

    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.InfoWindow`
    script.async = true
    script.onload = () => resolve(window.AMap)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// 组件挂载后初始化地图
onMounted(async () => {
  try {
    await loadAmapScript()
    initMap()
  } catch (error) {
    console.error('地图加载失败:', error)
  }
})

const submitForm = async () => {
  isSubmitting.value = true
  submitMessage.value = ''

  try {
    const response = await $fetch('/api/messages', {
      method: 'POST',
      body: formData.value
    })

    if (response.success) {
      submitMessage.value = '留言提交成功！我们会尽快与您联系。'
      formData.value = { name: '', phone: '', email: '', company: '', subject: '', content: '' }
    } else {
      submitMessage.value = response.message || '提交失败，请稍后重试。'
    }
  } catch {
    submitMessage.value = '提交失败，请稍后重试。'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
