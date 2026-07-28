<template>
  <footer class="text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <a href="javascript:void(0)" class="w-11 h-11 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors" title="抖音">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
            <a href="javascript:void(0)" class="w-11 h-11 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors" title="微博">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.86 1.791-.583.625.283.825.986.444 1.574zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.307-.361-.163-.59.138-.23.436-.346.672-.24.239.09.315.36.18.577zm.476-2.089c-1.406-.37-2.996.198-3.618 1.263-.634 1.081-.08 2.318 1.308 2.758 1.446.46 3.136-.108 3.75-1.236.604-1.114.008-2.35-1.44-2.785zM20.514 11.18c-.299-.09-.504-.153-.349-.555.336-.872.37-1.628.008-2.163-.674-.995-2.516-.942-4.613-.028 0 0-.66.288-.492-.236.325-1.039.276-1.904-.231-2.408-1.15-1.143-4.218.042-6.853 2.649-1.973 1.952-3.126 4.042-3.126 5.87 0 3.435 4.425 5.526 8.762 5.526 5.673 0 9.44-3.29 9.44-5.87 0-1.568-1.32-2.456-2.545-2.79zm.692-4.935c-.82-.936-2.033-1.294-3.196-1.058l-.003.001c-.37.074-.624.422-.561.796.064.374.407.634.778.564.753-.148 1.534.082 2.068.676.532.594.72 1.389.518 2.13-.125.46.17.932.632 1.062.461.128.932-.168 1.056-.629.306-1.112.027-2.306-.292-3.542z"/>
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
              <svg class="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span class="text-slate-400">{{ contact.address }}</span>
            </li>
            <li v-if="contact.phone1" class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span class="text-slate-400">{{ contact.phone1 }}</span>
            </li>
            <li v-if="contact.email1" class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
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
    </div>
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
  footer .py-12 { padding: 40px 0; }
  footer .mt-8 { margin-top: 24px; }
  footer .pt-8 { padding-top: 24px; }
  ul.space-y-2 > li { padding: 4px 0; }
  ul.space-y-3 > li { padding: 2px 0; }
}
</style>
