<template>
  <footer class="site-footer">
    <!-- 页脚前 CTA 转化条 -->
    <div class="footer-cta">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 footer-cta-inner">
        <div class="footer-cta-text">
          <h2 class="footer-cta-title">需要带电清洗或储能集成方案？</h2>
          <p class="footer-cta-desc">专业团队 1 对 1 沟通，免费评估设备工况与改造路径</p>
        </div>
        <div class="footer-cta-actions">
          <a v-if="contact.phone1" :href="`tel:${contact.phone1}`" class="footer-cta-btn footer-cta-btn-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>{{ contact.phone1 }}</span>
          </a>
          <NuxtLink to="/contact" class="footer-cta-btn footer-cta-btn-ghost">
            在线留言
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 主体 -->
    <div class="footer-main">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="footer-grid">
          <!-- 品牌 -->
          <div class="footer-brand">
            <div class="footer-logo-row">
              <div class="footer-logo-mark" aria-hidden="true">
                <span>玺</span>
              </div>
              <div>
                <h3 class="footer-brand-name">{{ contact.companyName || '玺铭电力' }}</h3>
                <p class="footer-brand-tag">带电清洗 · 储能集成</p>
              </div>
            </div>
            <p class="footer-brand-desc">
              专注电力设备带电清洗与储能系统集成，服务变电站、配电室、工商业园区等场景，
              以安全、高效、可验证的工程能力保障供电稳定。
            </p>
            <p class="footer-brand-meta">
              <span class="footer-meta-label">服务区域</span>
              河南 · 全国可承接
            </p>
          </div>

          <!-- 服务导航：双业务 -->
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
              <li><NuxtLink to="/services">全部服务</NuxtLink></li>
              <li><NuxtLink to="/news">新闻资讯</NuxtLink></li>
              <li><NuxtLink to="/about">关于我们</NuxtLink></li>
            </ul>
          </div>

          <!-- 联系 -->
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
                  <span class="footer-contact-label">工作时间</span>
                  <span class="footer-contact-value">{{ contact.workHours1 }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 底栏 -->
        <div class="footer-bottom">
          <p class="footer-copy">
            &copy; {{ year }} {{ contact.companyName || '玺铭电力' }}. All rights reserved.
          </p>
          <p class="footer-beian">
            <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">豫ICP备2026028995号</a>
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
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  margin-top: auto;
}

/* CTA 条 */
.footer-cta {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 0;
  flex-wrap: wrap;
}

.footer-cta-title {
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 6px;
}

.footer-cta-desc {
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
  margin: 0;
}

.footer-cta-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.footer-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.footer-cta-btn-primary {
  background: #fff;
  color: #1d4ed8;
}

.footer-cta-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.footer-cta-btn-ghost {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.footer-cta-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #fff;
}

/* 主体 */
.footer-main {
  background: #0b1220;
  color: #e2e8f0;
  padding: 56px 0 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 40px 32px;
}

.footer-logo-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-logo-mark {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  font-size: 20px;
  flex-shrink: 0;
}

.footer-brand-name {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
}

.footer-brand-tag {
  color: #93c5fd;
  font-size: 12px;
  margin: 2px 0 0;
  letter-spacing: 0.04em;
}

.footer-brand-desc {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.7;
  margin: 0 0 16px;
}

.footer-brand-meta {
  color: #cbd5e1;
  font-size: 13px;
  margin: 0;
}

.footer-meta-label {
  display: inline-block;
  margin-right: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.15);
  color: #93c5fd;
  font-size: 12px;
}

.footer-col-title {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 16px;
  letter-spacing: 0.02em;
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
  color: #94a3b8;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #fff;
}

.footer-contact-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.footer-icon {
  width: 18px;
  height: 18px;
  color: #60a5fa;
  flex-shrink: 0;
  margin-top: 3px;
}

.footer-contact-label {
  display: block;
  color: #64748b;
  font-size: 12px;
  margin-bottom: 2px;
}

.footer-phone {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: color 0.2s ease;
}

.footer-phone:hover {
  color: #93c5fd;
}

.footer-contact-value {
  color: #cbd5e1;
  font-size: 14px;
  text-decoration: none;
  word-break: break-all;
  line-height: 1.5;
}

a.footer-contact-value:hover {
  color: #fff;
}

/* 底栏 */
.footer-bottom {
  margin-top: 48px;
  padding: 20px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.footer-copy,
.footer-beian {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.footer-beian a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-beian a:hover {
  color: #94a3b8;
}

/* 响应式 */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .footer-cta-inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 0;
  }

  .footer-cta-title {
    font-size: 18px;
  }

  .footer-cta-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .footer-cta-btn {
    justify-content: center;
  }

  .footer-main {
    padding-top: 40px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 32px;
  }
}
</style>
