<template>
  <div class="contact-page">
    <!-- 顶栏 -->
    <section class="cp-hero">
      <div class="cp-hero-bg" />
      <div class="cp-hero-orb cp-hero-orb-1" />
      <div class="cp-hero-orb cp-hero-orb-2" />
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 cp-hero-inner">
        <p class="cp-eyebrow">CONTACT</p>
        <h1 class="cp-title">告诉我们你的需求</h1>
        <p class="cp-lead">选择咨询方向，我们会按业务匹配专业顾问</p>
        <a v-if="contact.phone1" :href="`tel:${contact.phone1}`" class="cp-phone">
          <span class="cp-phone-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
          <span class="cp-phone-text">
            <span class="cp-phone-label">服务热线</span>
            <span class="cp-phone-num">{{ contact.phone1 }}</span>
          </span>
        </a>
      </div>
    </section>

    <!-- 四张分流卡 -->
    <section class="cp-cards-section">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="cp-cards">
          <button
            v-for="card in cards"
            :key="card.key"
            type="button"
            class="cp-card"
            :class="{ 'is-active': activeSubject === card.subject }"
            @click="selectCard(card)"
          >
            <span class="cp-card-icon" v-html="card.icon" />
            <span class="cp-card-title">{{ card.title }}</span>
            <span class="cp-card-desc">{{ card.desc }}</span>
            <span class="cp-card-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- 表单区（选中后强调） -->
    <section id="message-form" class="cp-form-section">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="cp-form-layout">
          <div class="cp-form-card" :class="{ 'is-focused': !!activeSubject }">
            <div class="cp-form-head">
              <h2 class="cp-form-title">在线留言</h2>
              <p class="cp-form-desc">
                <template v-if="activeSubject">已选择：<strong>{{ activeSubject }}</strong></template>
                <template v-else>也可不选卡片，直接填写下面表单</template>
              </p>
            </div>

            <form @submit.prevent="submitForm" class="cp-form">
              <div class="cp-row">
                <label class="cp-field">
                  <span class="cp-label">姓名 <i>*</i></span>
                  <input v-model="formData.name" type="text" required placeholder="您的姓名" class="cp-input" />
                </label>
                <label class="cp-field">
                  <span class="cp-label">电话 <i>*</i></span>
                  <input v-model="formData.phone" type="tel" required placeholder="手机号或座机" class="cp-input" />
                </label>
              </div>

              <div class="cp-row">
                <label class="cp-field">
                  <span class="cp-label">邮箱</span>
                  <input v-model="formData.email" type="email" placeholder="选填" class="cp-input" />
                </label>
                <label class="cp-field">
                  <span class="cp-label">公司</span>
                  <input v-model="formData.company" type="text" placeholder="选填" class="cp-input" />
                </label>
              </div>

              <label class="cp-field">
                <span class="cp-label">咨询主题</span>
                <div class="cp-subjects">
                  <span
                    v-for="opt in subjectOptions"
                    :key="opt"
                    class="cp-subject"
                    :class="{ 'is-on': formData.subject === opt }"
                    @click.prevent="formData.subject = formData.subject === opt ? '' : opt"
                  >
                    {{ opt }}
                  </span>
                </div>
              </label>

              <label class="cp-field">
                <span class="cp-label">需求描述 <i>*</i></span>
                <textarea
                  v-model="formData.content"
                  required
                  rows="5"
                  placeholder="设备类型、现场情况、期望时间…"
                  class="cp-input cp-textarea"
                />
              </label>

              <button type="submit" class="cp-submit" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="cp-spin" />
                <span v-else>提交留言</span>
              </button>

              <Transition name="cp-fade">
                <div v-if="submitMessage" class="cp-result" :class="submitOk ? 'ok' : 'err'">
                  <p>{{ submitMessage }}</p>
                  <div v-if="submitOk" class="cp-result-links">
                    <NuxtLink to="/products">查看产品</NuxtLink>
                    <NuxtLink to="/cases">浏览案例</NuxtLink>
                  </div>
                </div>
              </Transition>
            </form>
          </div>

          <aside class="cp-side">
            <div class="cp-side-card">
              <h3 class="cp-side-title">其他联系方式</h3>
              <ul class="cp-side-list">
                <li v-if="contact.email1">
                  <span class="cp-side-k">邮箱</span>
                  <a :href="`mailto:${contact.email1}`" class="cp-side-v link">{{ contact.email1 }}</a>
                </li>
                <li v-if="contact.address">
                  <span class="cp-side-k">地址</span>
                  <span class="cp-side-v">{{ contact.address }}</span>
                </li>
                <li v-if="contact.workHours1">
                  <span class="cp-side-k">时间</span>
                  <span class="cp-side-v">{{ contact.workHours1 }}</span>
                </li>
              </ul>
            </div>

            <div class="cp-map">
              <div id="amap-container" class="cp-map-canvas" />
              <div class="cp-map-actions">
                <a :href="navUrl" target="_blank" rel="noopener noreferrer" class="cp-map-btn">导航</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ContactInfo } from '~/types'

definePageMeta({ layout: 'default' })

useHead({
  title: '联系我们',
  meta: [
    { name: 'description', content: '玺铭电力 — 带电清洗、储能集成、产品采购咨询入口。' },
    { property: 'og:title', content: '联系我们 - 河南玺铭电力科技有限公司' },
  ]
})

const DEFAULT_LAT = 33.714605
const DEFAULT_LNG = 113.401646

const defaultContact: ContactInfo = {
  companyName: '玺铭电力',
  address: '河南省平顶山市高新区尼龙织造产业园一期17号',
  phone1: '',
  phone2: '',
  email1: '',
  email2: '',
  workHours1: '',
  workHours2: '',
  latitude: DEFAULT_LAT,
  longitude: DEFAULT_LNG,
}

const { data: contactData } = useFetch('/api/contact', {
  transform: (res: any) => (res?.success && res.data ? res.data : defaultContact),
  getCachedData: () => undefined,
})
const contact = computed<ContactInfo>(() => contactData.value || defaultContact)

const mapLat = computed(() => Number(contact.value.latitude) || DEFAULT_LAT)
const mapLng = computed(() => Number(contact.value.longitude) || DEFAULT_LNG)
const navUrl = computed(
  () =>
    `https://uri.amap.com/navigation?to=${mapLng.value},${mapLat.value},${encodeURIComponent(
      contact.value.companyName || '玺铭电力'
    )}&mode=car&policy=0`
)

const cards = [
  {
    key: 'clean',
    subject: '带电清洗',
    title: '带电清洗',
    desc: '变电站 / 配电室 / 工业厂房不停电清洗',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  },
  {
    key: 'storage',
    subject: '储能集成',
    title: '储能集成',
    desc: '工商业储能 · 台区储能系统交付',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="7" width="12" height="14" rx="2"/><path d="M10 7V4h4v3"/><line x1="10" y1="14" x2="14" y2="14"/></svg>',
  },
  {
    key: 'product',
    subject: '产品采购',
    title: '产品采购',
    desc: '清洗设备、药剂与检测仪器选型',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  },
  {
    key: 'visit',
    subject: '其他',
    title: '到访 / 其他',
    desc: '导航来厂或有其他合作需求',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  },
]

const subjectOptions = ['带电清洗', '储能集成', '产品采购', '其他']
const activeSubject = ref('')

const formData = ref({
  name: '',
  phone: '',
  email: '',
  company: '',
  subject: '',
  content: '',
})

const selectCard = (card: { subject: string }) => {
  activeSubject.value = card.subject
  formData.value.subject = card.subject
  nextTick(() => {
    document.getElementById('message-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const isSubmitting = ref(false)
const submitMessage = ref('')
const submitOk = ref(false)

const AMAP_KEY = 'a6bc0a35ef8702edcd3c960cff07bb87'
const AMAP_SECRET = '4322df137bcd7f4aabd87bb57d2f96c9'

const initMap = () => {
  if (typeof window.AMap === 'undefined') return
  const center: [number, number] = [mapLng.value, mapLat.value]
  const map = new window.AMap.Map('amap-container', { zoom: 15, center, viewMode: '2D' })
  map.add(
    new window.AMap.Marker({
      position: center,
      title: contact.value.companyName || '玺铭电力',
      animation: 'AMAP_ANIMATION_DROP',
    })
  )
}

const loadAmapScript = () =>
  new Promise((resolve, reject) => {
    if (typeof window.AMap !== 'undefined') {
      resolve(window.AMap)
      return
    }
    window._AMapSecurityConfig = { securityJsCode: AMAP_SECRET }
    const s = document.createElement('script')
    s.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`
    s.async = true
    s.onload = () => resolve(window.AMap)
    s.onerror = reject
    document.head.appendChild(s)
  })

onMounted(async () => {
  try {
    await loadAmapScript()
    initMap()
  } catch (e) {
    console.error('地图加载失败', e)
  }
})

const submitForm = async () => {
  isSubmitting.value = true
  submitMessage.value = ''
  submitOk.value = false
  try {
    const res = await $fetch('/api/messages', { method: 'POST', body: formData.value })
    if (res.success) {
      submitOk.value = true
      submitMessage.value = '提交成功，我们会尽快与您联系。'
      formData.value = { name: '', phone: '', email: '', company: '', subject: '', content: '' }
      activeSubject.value = ''
    } else {
      submitMessage.value = res.message || '提交失败，请稍后重试。'
    }
  } catch {
    submitMessage.value = '提交失败，请稍后重试。'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.cp-hero {
  position: relative;
  overflow: hidden;
  color: #fff;
}

.cp-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 70% at 70% 20%, rgba(37, 99, 235, 0.45), transparent 55%),
    linear-gradient(145deg, #0b1220 0%, #0f172a 40%, #1e3a8a 100%);
}

.cp-hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.35;
  pointer-events: none;
}

.cp-hero-orb-1 {
  width: 220px;
  height: 220px;
  background: #3b82f6;
  top: -40px;
  right: 12%;
}

.cp-hero-orb-2 {
  width: 160px;
  height: 160px;
  background: #60a5fa;
  bottom: -30px;
  left: 18%;
  opacity: 0.18;
}

.cp-hero-inner {
  position: relative;
  z-index: 1;
  padding: 56px 0 48px;
  text-align: center;
}

.cp-eyebrow {
  margin: 0 0 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: #93c5fd;
}

.cp-title {
  margin: 0 0 12px;
  font-size: clamp(22px, 2.2vw, 28px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.cp-lead {
  margin: 0 0 28px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 15px;
}

.cp-phone {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px 12px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(10px);
  text-decoration: none;
  color: #fff;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.cp-phone:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.28);
  transform: translateY(-1px);
}

.cp-phone-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cp-phone-icon svg {
  width: 18px;
  height: 18px;
}

.cp-phone-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.cp-phone-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2px;
}

.cp-phone-num {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.03em;
}

.cp-cards-section {
  margin-top: -28px;
  position: relative;
  z-index: 2;
  padding-bottom: 8px;
}

.cp-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.cp-card {
  position: relative;
  text-align: left;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #fff;
  padding: 20px 18px 18px;
  cursor: pointer;
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  overflow: hidden;
}

.cp-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.1);
  border-color: #bfdbfe;
}

.cp-card.is-active {
  border-color: #2563eb;
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.14);
}

.cp-card-icon {
  display: inline-flex;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background: #eff6ff;
  color: #2563eb;
}

.cp-card-icon svg {
  width: 20px;
  height: 20px;
}

.cp-card.is-active .cp-card-icon {
  background: #2563eb;
  color: #fff;
}

.cp-card-title {
  display: block;
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
}

.cp-card-desc {
  display: block;
  font-size: 12px;
  color: #64748b;
  line-height: 1.55;
  padding-right: 18px;
}

.cp-card-arrow {
  position: absolute;
  right: 14px;
  top: 18px;
  width: 18px;
  height: 18px;
  color: #cbd5e1;
  transition: color 0.2s ease, transform 0.2s ease;
}

.cp-card-arrow svg {
  width: 18px;
  height: 18px;
}

.cp-card:hover .cp-card-arrow {
  color: #2563eb;
  transform: translateX(2px);
}

.cp-form-section {
  padding: 28px 0 72px;
  background: #f8fafc;
}

.cp-form-layout {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 18px;
  align-items: stretch;
}

.cp-form-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 28px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.cp-form-card.is-focused {
  border-color: #bfdbfe;
  box-shadow: 0 12px 36px rgba(37, 99, 235, 0.08);
}

.cp-form-title {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.cp-form-desc {
  margin: 0 0 22px;
  font-size: 13px;
  color: #94a3b8;
}

.cp-form-desc strong {
  color: #2563eb;
  font-weight: 700;
}

.cp-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cp-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.cp-field {
  display: block;
  min-width: 0;
}

.cp-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.cp-label i {
  font-style: normal;
  color: #ef4444;
}

.cp-input {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.cp-input::placeholder {
  color: #cbd5e1;
}

.cp-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.cp-textarea {
  min-height: 120px;
  resize: vertical;
}

.cp-subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cp-subject {
  padding: 7px 13px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  color: #475569;
  background: #fff;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
}

.cp-subject:hover {
  border-color: #93c5fd;
  color: #1d4ed8;
}

.cp-subject.is-on {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
  font-weight: 600;
}

.cp-submit {
  margin-top: 4px;
  width: 100%;
  padding: 13px 18px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.cp-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.34);
}

.cp-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.cp-spin {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: cpspin 0.75s linear infinite;
}

@keyframes cpspin {
  to { transform: rotate(360deg); }
}

.cp-result {
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 13px;
}

.cp-result.ok {
  color: #047857;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
}

.cp-result.err {
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.cp-result p {
  margin: 0;
  font-weight: 600;
}

.cp-result-links {
  display: flex;
  gap: 14px;
  margin-top: 8px;
}

.cp-result-links a {
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
}

.cp-side {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 100%;
  /* 与左侧表单等高，地图填满剩余空间 */
  height: 100%;
}

.cp-side-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 22px;
}

.cp-side-title {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.cp-side-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cp-side-list li {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 10px;
}

.cp-side-k {
  font-size: 12px;
  color: #94a3b8;
  padding-top: 2px;
}

.cp-side-v {
  font-size: 14px;
  color: #0f172a;
  font-weight: 600;
  line-height: 1.5;
  word-break: break-all;
}

.cp-side-v.link {
  color: #2563eb;
  text-decoration: none;
}

.cp-side-v.link:hover {
  text-decoration: underline;
}

.cp-map {
  position: relative;
  flex: 1 1 auto;
  min-height: 240px;
  height: auto;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #e2e8f0;
}

/* 桌面：地图高度跟随表单列 */
@media (min-width: 960px) {
  .cp-map {
    min-height: 320px;
  }
}

.cp-map-canvas {
  width: 100%;
  height: 100%;
}

.cp-map-actions {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.cp-map-btn {
  display: inline-flex;
  padding: 7px 14px;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.cp-map-btn:hover {
  background: #1d4ed8;
}

.cp-fade-enter-active,
.cp-fade-leave-active {
  transition: opacity 0.2s ease;
}
.cp-fade-enter-from,
.cp-fade-leave-to {
  opacity: 0;
}

@media (max-width: 960px) {
  .cp-cards {
    grid-template-columns: 1fr 1fr;
  }

  .cp-form-layout {
    grid-template-columns: 1fr;
  }

  .cp-side {
    position: static;
  }
}

@media (max-width: 560px) {
  .cp-cards {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .cp-card {
    padding: 14px 12px 12px;
    border-radius: 12px;
  }

  .cp-card-icon {
    width: 30px;
    height: 30px;
    margin-bottom: 8px;
  }

  .cp-card-icon svg {
    width: 16px;
    height: 16px;
  }

  .cp-card-title {
    font-size: 14px;
  }

  .cp-card-desc {
    font-size: 11px;
    padding-right: 0;
  }

  .cp-card-arrow {
    display: none;
  }

  .cp-title {
    font-size: 26px;
  }

  .cp-row {
    grid-template-columns: 1fr;
  }

  .cp-hero-inner {
    padding: 40px 0 36px;
  }

  .cp-form-card {
    padding: 22px 18px;
  }

  .cp-phone-num {
    font-size: 18px;
  }
}
</style>
