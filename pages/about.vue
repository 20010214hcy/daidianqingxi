<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="关于我们" subtitle="专业电力设备运维服务商" />

    <!-- 公司简介 -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-3xl font-bold text-slate-800 mb-6">玺铭电力</h2>
            <p class="text-slate-600 text-lg leading-relaxed mb-6">
              玺铭电力设备清洗有限公司是一家专注于电力设备带电清洗的专业服务商。公司成立以来，始终坚持以技术创新为驱动，以安全质量为核心，为各类电力设施提供专业、高效、安全的清洗维护服务。
            </p>
            <p class="text-slate-600 text-lg leading-relaxed mb-6">
              公司拥有一支经验丰富的专业技术团队，配备先进的带电清洗设备，服务范围覆盖变电站、配电室、发电厂、工业厂房等各类电力设施。我们始终坚持"安全第一、质量为本"的服务理念，赢得了广大客户的信赖与好评。
            </p>
            <p class="text-slate-600 text-lg leading-relaxed">
              经过多年的发展，公司已建立了完善的服务体系和质量管控流程，累计服务客户超过 200 家，成功完成各类清洗项目 500 余个，以零事故的安全记录和优质的服务品质在行业内树立了良好的口碑。
            </p>
          </div>
          <div class="relative">
            <img src="/uploads/51a3b015-95f2-4b29-8fb6-952e2341599e.webp"
              alt="玺铭电力团队" class="rounded-2xl shadow-xl w-full" />
          </div>
        </div>
      </div>
    </section>

    <!-- 发展历程 -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-800 mb-4">发展历程</h2>
          <p class="text-slate-600 text-lg">一路走来，稳步前行</p>
        </div>
        <div class="relative">
          <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-200 hidden md:block"></div>
          <div class="space-y-12">
            <div v-for="(milestone, i) in milestones" :key="i"
              class="relative flex flex-col md:flex-row items-center"
              :class="i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'">
              <div class="md:w-1/2" :class="i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'">
                <div class="bg-white rounded-xl p-6 shadow-md">
                  <span class="text-primary-600 font-bold text-lg">{{ milestone.year }}</span>
                  <h3 class="text-xl font-bold text-slate-800 mt-2 mb-2">{{ milestone.title }}</h3>
                  <p class="text-slate-600">{{ milestone.desc }}</p>
                </div>
              </div>
              <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow hidden md:block"></div>
              <div class="md:w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心优势 -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-800 mb-4">核心优势</h2>
          <p class="text-slate-600 text-lg">为什么选择玺铭电力</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(adv, i) in advantages" :key="i"
            class="text-center p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition-[transform,box-shadow,background-color] duration-300 will-change-transform">
            <div class="text-5xl mb-4">{{ adv.icon }}</div>
            <h3 class="text-xl font-bold text-slate-800 mb-3">{{ adv.title }}</h3>
            <p class="text-slate-600">{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 资质证书 -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-800 mb-4">资质证书</h2>
          <p class="text-slate-600 text-lg">专业资质，值得信赖</p>
        </div>
        <div v-if="certificates.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="cert in certificates" :key="cert.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img :src="cert.image" :alt="cert.title" class="w-full aspect-[3/4] object-cover" />
            <div class="p-4 text-center">
              <h3 class="font-bold text-slate-800">{{ cert.title }}</h3>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-slate-400 py-12">暂无证书信息</div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
      <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-3xl font-bold mb-4">需要专业的电力设备清洗服务？</h2>
        <p class="text-xl opacity-90 mb-8">联系我们，获取免费咨询和定制化解决方案</p>
        <NuxtLink to="/contact" class="inline-block bg-white text-primary-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-colors">
          立即联系
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

useHead({
  title: '关于我们 - 玺铭电力',
  meta: [
    { name: 'description', content: '了解玺铭电力设备清洗有限公司，专注电力设备带电清洗领域，20年行业经验，500+成功案例。' },
  ]
})

import type { Certificate } from '~/types'

// SSR 数据获取
const { data: certificatesData } = useFetch('/api/certificates', {
  transform: (res: any) => res?.success ? (res.data || []) : []
})
const certificates = computed<Certificate[]>(() => certificatesData.value || [])

const milestones = [
  { year: '2004', title: '公司成立', desc: '玺铭电力设备清洗有限公司正式成立，开始电力设备清洗服务' },
  { year: '2008', title: '技术突破', desc: '引进先进带电清洗设备，实现不停电清洗作业' },
  { year: '2012', title: '业务扩展', desc: '服务范围扩展至全国，客户数量突破 100 家' },
  { year: '2016', title: '资质升级', desc: '获得多项行业资质认证，团队规模扩大至 50 人' },
  { year: '2020', title: '数字化转型', desc: '引入智能管理系统，提升服务效率和质量管控' },
  { year: '2024', title: '持续领先', desc: '累计服务客户 200+，成功案例 500+，保持零事故记录' },
]

const advantages = [
  { icon: '🛡️', title: '安全可靠', desc: '严格执行安全规范，多年零事故运行记录' },
  { icon: '⚡', title: '高效专业', desc: '先进设备+专业团队，快速响应高效执行' },
  { icon: '🔬', title: '技术领先', desc: '持续技术创新，引进国际先进清洗工艺' },
  { icon: '🤝', title: '贴心服务', desc: '定制化方案，全程跟踪服务，售后无忧' },
]
</script>
