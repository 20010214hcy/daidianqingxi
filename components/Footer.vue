<template>
  <footer class="bg-slate-900 text-white">
    <UContainer class="py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">电</span>
            </div>
            <div>
              <h3 class="text-xl font-bold">{{ contact.companyName || '带电清洗' }}</h3>
              <p class="text-sm text-slate-400">专业工业清洗服务商</p>
            </div>
          </div>
          <p class="text-slate-400 mb-4">
            我们专注于电力设备带电清洗、储能系统集成、工业设备清洗、高压清洗等服务，
            拥有专业的技术团队和丰富的工程经验，为客户提供安全、高效、
            优质的清洗解决方案。
          </p>
          <div class="flex space-x-4">
            <a href="javascript:void(0)" class="w-11 h-11 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors" title="微信公众号">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.11.24-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.493.493 0 01.177-.554C23.41 18.308 24 16.926 24 15.402c0-3.372-3.28-6.15-7.062-6.544zm-2.007 2.77c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.983a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-4">快速链接</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/about" class="text-slate-400 hover:text-white transition-colors">关于我们</NuxtLink></li>
            <li><NuxtLink to="/services" class="text-slate-400 hover:text-white transition-colors">服务项目</NuxtLink></li>
            <li><NuxtLink to="/products" class="text-slate-400 hover:text-white transition-colors">产品中心</NuxtLink></li>
            <li><NuxtLink to="/cases" class="text-slate-400 hover:text-white transition-colors">工程案例</NuxtLink></li>
            <li><NuxtLink to="/news" class="text-slate-400 hover:text-white transition-colors">新闻资讯</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-slate-400 hover:text-white transition-colors">联系我们</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-4">联系方式</h4>
          <ul class="space-y-3">
            <li v-if="contact.address" class="flex items-start space-x-3">
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span class="text-slate-400">{{ contact.address }}</span>
            </li>
            <li v-if="contact.phone1" class="flex items-center space-x-3">
              <UIcon name="i-heroicons-phone" class="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span class="text-slate-400">{{ contact.phone1 }}</span>
            </li>
            <li v-if="contact.email1" class="flex items-center space-x-3">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span class="text-slate-400">{{ contact.email1 }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
        <p>&copy; {{ new Date().getFullYear() }} {{ contact.companyName || '带电清洗' }}. All rights reserved.</p>
        <p class="mt-2">
          <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer" class="hover:text-slate-400 transition-colors">豫ICP备2026028995号</a>
        </p>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
const defaultContact = {
  companyName: '带电清洗',
  address: '',
  phone1: '',
  email1: '',
}

const { data: contactData } = useFetch('/api/contact', {
  transform: (res: any) => {
    if (res?.success && res.data) {
      return {
        companyName: res.data.companyName || '带电清洗',
        address: res.data.address || '',
        phone1: res.data.phone1 || '',
        email1: res.data.email1 || '',
      }
    }
    return defaultContact
  }
})
const contact = computed(() => contactData.value || defaultContact)
</script>

<style scoped>
@media (max-width: 640px) {
  .text-xl { font-size: 18px; }
  .text-lg { font-size: 16px; }
  p { font-size: 14px; }
  .text-sm { font-size: 13px; }
}
</style>
