<template>
  <footer class="site-footer">
    <!-- CTA -->
    <div class="footer-cta">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 footer-cta-inner">
        <div class="footer-cta-text">
          <p class="footer-cta-title">
            <span class="footer-cta-title-desktop">有设备要清洗，或准备上储能？</span>
            <span class="footer-cta-title-mobile">要清洗 / 上储能？</span>
          </p>
          <p class="footer-cta-desc">电话或留言，我们在 24 小时内回复</p>
        </div>
        <div class="footer-cta-actions">
          <a v-if="contact.phone1" :href="`tel:${contact.phone1}`" class="footer-cta-btn footer-cta-btn-primary" @click="track('页脚-电话')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>{{ contact.phone1 }}</span>
          </a>
          <NuxtLink to="/contact" class="footer-cta-btn footer-cta-btn-ghost" @click="track('页脚-留言')">在线留言</NuxtLink>
        </div>
      </div>
    </div>

    <!-- 主体 -->
    <div class="footer-main">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 桌面：四栏 -->
        <div class="footer-grid desktop-only">
          <div class="footer-brand">
            <div class="footer-logo-row">
              <div class="footer-logo-mark" aria-hidden="true">玺</div>
              <div>
                <h3 class="footer-brand-name">{{ contact.companyName || '玺铭电力' }}</h3>
                <p class="footer-brand-tag">带电清洗 · 储能集成</p>
              </div>
            </div>
            <p class="footer-brand-desc">
              专注电力设备带电清洗与储能系统集成，服务变电站、配电室、工商业园区等场景。
            </p>
            <p class="footer-brand-meta">
              <span class="footer-meta-label">服务区域</span>
              河南 · 全国可承接
            </p>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">带电清洗</h4>
            <ul class="footer-links">
              <li><NuxtLink to="/services/1">变电站带电清洗</NuxtLink></li>
              <li><NuxtLink to="/services/2">工业设备清洗</NuxtLink></li>
              <li><NuxtLink to="/services/3">高压清洗</NuxtLink></li>
              <li><NuxtLink to="/cases">工程案例</NuxtLink></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">储能与其他</h4>
            <ul class="footer-links">
              <li><NuxtLink to="/solutions">解决方案</NuxtLink></li>
              <li><NuxtLink to="/products">产品中心</NuxtLink></li>
              <li><NuxtLink to="/news">新闻资讯</NuxtLink></li>
              <li><NuxtLink to="/about">关于我们</NuxtLink></li>
            </ul>
          </div>

          <div class="footer-col footer-contact">
            <h4 class="footer-col-title">联系我们</h4>
            <ul class="footer-contact-list">
              <li v-if="contact.phone1">
                <svg class="footer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <div>
                  <span class="footer-contact-label">电话</span>
                  <a :href="`tel:${contact.phone1}`" class="footer-phone">{{ contact.phone1 }}</a>
                </div>
              </li>
              <li v-if="contact.email1">
                <svg class="footer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>
                </svg>
                <div>
                  <span class="footer-contact-label">邮箱</span>
                  <a :href="`mailto:${contact.email1}`" class="footer-contact-value">{{ contact.email1 }}</a>
                </div>
              </li>
              <li v-if="contact.address">
                <svg class="footer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>
                </svg>
                <div>
                  <span class="footer-contact-label">地址</span>
                  <span class="footer-contact-value">{{ contact.address }}</span>
                </div>
              </li>
              <li v-if="contact.workHours1">
                <svg class="footer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <div>
                  <span class="footer-contact-label">时间</span>
                  <span class="footer-contact-value">{{ contact.workHours1 }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 手机：精简 + 折叠（主流做法） -->
        <div class="mobile-only footer-mobile">
          <div class="fm-brand">
            <div class="footer-logo-mark" aria-hidden="true">玺</div>
            <div class="fm-brand-text">
              <h3 class="footer-brand-name">{{ contact.companyName || '玺铭电力' }}</h3>
              <p class="footer-brand-tag">带电清洗 · 储能集成</p>
            </div>
          </div>

          <a v-if="contact.phone1" :href="`tel:${contact.phone1}`" class="fm-phone">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            {{ contact.phone1 }}
          </a>

          <div class="fm-nav">
            <div v-for="group in mobileGroups" :key="group.title" class="fm-acc">
              <button type="button" class="fm-acc-btn" :class="{ 'is-open': openGroup === group.title }" @click="toggleGroup(group.title)">
                <span>{{ group.title }}</span>
                <svg class="fm-acc-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              <div v-show="openGroup === group.title" class="fm-acc-panel">
                <NuxtLink v-for="link in group.links" :key="link.to" :to="link.to" class="fm-acc-link">
                  {{ link.label }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <p v-if="contact.address" class="fm-address">{{ contact.address }}</p>
        </div>

        <div class="footer-bottom">
          <p class="footer-copy">
            &copy; {{ year }} {{ contact.companyName || '玺铭电力' }}. All rights reserved.
          </p>
          <p class="footer-beian">
            <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">豫ICP备2026028995号-1</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const defaultContact = {
  companyName: '玺铭电力科技有限公司',
  address: '',
  phone1: '',
  phone2: '',
  email1: '',
  workHours1: '',
}

const { data: contactData } = useFetch('/api/contact', {
  transform: (res: any) => {
    if (res?.success && res.data) {
      return {
        companyName: res.data.companyName || defaultContact.companyName,
        address: res.data.address || '',
        phone1: res.data.phone1 || '',
        phone2: res.data.phone2 || '',
        email1: res.data.email1 || '',
        workHours1: res.data.workHours1 || '',
      }
    }
    return defaultContact
  }
})
const contact = computed(() => contactData.value || defaultContact)

// 询盘漏斗埋点：CTA 点击推百度统计事件
const track = (label: string) => {
  const w = window as any
  if (w._hmt) w._hmt.push(['_trackEvent', '询盘CTA', '点击', label])
}
const year = new Date().getFullYear()

const mobileGroups = [
  {
    title: '带电清洗',
    links: [
      { to: '/services/1', label: '变电站带电清洗' },
      { to: '/services/2', label: '工业设备清洗' },
      { to: '/services/3', label: '高压清洗' },
      { to: '/cases', label: '工程案例' },
    ],
  },
  {
    title: '储能与更多',
    links: [
      { to: '/solutions', label: '解决方案' },
      { to: '/products', label: '产品中心' },
      { to: '/news', label: '新闻资讯' },
      { to: '/about', label: '关于我们' },
      { to: '/contact', label: '联系我们' },
    ],
  },
]

const openGroup = ref<string | null>(null)
const toggleGroup = (title: string) => {
  openGroup.value = openGroup.value === title ? null : title
}
</script>

<style scoped>
.desktop-only { display: block; }
.mobile-only { display: none; }

.site-footer {
  margin-top: auto;
}

.footer-cta {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.footer-cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px 24px;
  padding: 18px 0;
  flex-wrap: wrap;
}

.footer-cta-title {
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 4px;
  line-height: 1.35;
}

.footer-cta-title-mobile { display: none; }

.footer-cta-desc {
  color: #64748b;
  font-size: 13px;
  margin: 0;
}

.footer-cta-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.footer-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.footer-cta-btn-primary {
  background: #2563eb;
  color: #fff;
}

.footer-cta-btn-primary:hover {
  background: #1d4ed8;
}

.footer-cta-btn-ghost {
  background: #fff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
}

.footer-cta-btn-ghost:hover {
  border-color: #93c5fd;
  color: #1d4ed8;
}

.footer-main {
  background: #f8fafc;
  color: #334155;
  padding: 40px 0 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.15fr;
  gap: 32px 28px;
}

.footer-logo-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.footer-logo-mark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(145deg, #3b82f6, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  font-size: 17px;
  flex-shrink: 0;
}

.footer-brand-name {
  color: #0f172a;
  font-size: 16px;
  font-weight: 800;
  margin: 0;
}

.footer-brand-tag {
  color: #2563eb;
  font-size: 12px;
  margin: 2px 0 0;
  font-weight: 600;
}

.footer-brand-desc {
  color: #64748b;
  font-size: 13px;
  line-height: 1.7;
  margin: 0 0 12px;
}

.footer-brand-meta {
  color: #475569;
  font-size: 12.5px;
  margin: 0;
}

.footer-meta-label {
  display: inline-block;
  margin-right: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 600;
}

.footer-col-title {
  color: #0f172a;
  font-size: 13.5px;
  font-weight: 700;
  margin: 0 0 14px;
}

.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  color: #64748b;
  font-size: 13px;
  text-decoration: none;
}

.footer-links a:hover {
  color: #2563eb;
}

.footer-contact-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.footer-icon {
  width: 17px;
  height: 17px;
  color: #94a3b8;
  flex-shrink: 0;
  margin-top: 3px;
}

.footer-contact-label {
  display: block;
  color: #94a3b8;
  font-size: 11px;
  margin-bottom: 2px;
}

.footer-phone {
  color: #2563eb;
  font-size: 17px;
  font-weight: 800;
  text-decoration: none;
}

.footer-contact-value {
  color: #334155;
  font-size: 13px;
  text-decoration: none;
  word-break: break-all;
}

.footer-bottom {
  margin-top: 28px;
  padding: 16px 0;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.footer-copy,
.footer-beian {
  margin: 0;
  color: #94a3b8;
  font-size: 12px;
}

.footer-beian a {
  color: #94a3b8;
  text-decoration: none;
}

/* ── 手机精简页脚（仅在 ≤640 显示） ── */
.footer-mobile {
  flex-direction: column;
  gap: 14px;
}

.fm-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fm-brand-text {
  min-width: 0;
}

.fm-phone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 16px;
  font-weight: 800;
  text-decoration: none;
}

.fm-nav {
  border-top: 1px solid #e2e8f0;
}

.fm-acc {
  border-bottom: 1px solid #e2e8f0;
}

.fm-acc-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 0;
  border: none;
  background: none;
  color: #0f172a;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.fm-acc-caret {
  width: 18px;
  height: 18px;
  color: #94a3b8;
  transition: transform 0.2s ease;
}

.fm-acc-btn.is-open .fm-acc-caret {
  transform: rotate(180deg);
  color: #2563eb;
}

.fm-acc-panel {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 0 12px;
}

.fm-acc-link {
  display: block;
  padding: 10px 0;
  color: #64748b;
  font-size: 13.5px;
  text-decoration: none;
}

.fm-acc-link:hover {
  color: #2563eb;
}

.fm-address {
  margin: 0;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.55;
}

@media (max-width: 640px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: block !important; }
  .footer-mobile {
    display: flex !important;
    flex-direction: column;
    gap: 14px;
  }

  .footer-main {
    padding-top: 24px;
  }

  .footer-cta-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 14px 0 12px;
  }

  .footer-cta-text { text-align: center; }

  .footer-cta-title-desktop { display: none; }
  .footer-cta-title-mobile {
    display: inline;
    font-size: 15px;
  }

  .footer-cta-title {
    margin: 0;
    font-size: 15px;
  }

  .footer-cta-desc { display: none; }

  .footer-cta-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 10px;
  }

  .footer-cta-btn {
    justify-content: center;
    min-height: 44px;
    padding: 11px 10px;
    font-size: 13.5px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-top: 8px;
    padding: 12px 0;
  }

  .footer-copy,
  .footer-beian {
    font-size: 11px;
  }
}
</style>
