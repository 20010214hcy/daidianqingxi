<template>
  <div class="login-page">
    <!-- 左：品牌 / 场景 -->
    <aside class="login-visual">
      <div class="visual-bg">
        <img src="/uploads/hero-bg.webp" alt="" class="visual-img" />
        <div class="visual-shade" />
        <div class="visual-grid" />
      </div>

      <div class="visual-inner">
        <div class="visual-top">
          <div class="visual-mark" aria-hidden="true">玺</div>
          <div>
            <div class="visual-brand">玺铭电力</div>
            <div class="visual-brand-sub">XIMING ELECTRIC</div>
          </div>
        </div>

        <div class="visual-mid">
          <p class="visual-eyebrow">ADMIN CONSOLE</p>
          <h1 class="visual-title">电力运维内容管理</h1>
          <p class="visual-desc">带电清洗 · 储能集成 · 官网内容统一管理</p>
          <ul class="visual-points">
            <li>文章 / 产品 / 案例在线编辑</li>
            <li>留言与媒体资源集中管理</li>
            <li>权限分级，操作可追溯</li>
          </ul>
        </div>

        <div class="visual-bottom">
          <span>河南玺铭电力科技有限公司</span>
        </div>
      </div>
    </aside>

    <!-- 右：登录表单 -->
    <main class="login-panel">
      <div class="panel-card">
        <div class="panel-mobile-brand">
          <div class="visual-mark sm" aria-hidden="true">玺</div>
          <span>玺铭电力</span>
        </div>

        <header class="panel-head">
          <h2 class="panel-title">登录后台</h2>
          <p class="panel-sub">请输入账号密码进入管理平台</p>
        </header>

        <form class="login-form" @submit.prevent="handleSubmit">
          <label class="field">
            <span class="field-label">账号</span>
            <div class="field-box" :class="{ 'is-focus': focused === 'username', 'is-error': !!errors.username }">
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                v-model="loginForm.username"
                type="text"
                class="field-input"
                placeholder="请输入账号"
                autocomplete="username"
                @focus="focused = 'username'"
                @blur="focused = ''"
              />
            </div>
            <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
          </label>

          <label class="field">
            <span class="field-label">密码</span>
            <div class="field-box" :class="{ 'is-focus': focused === 'password', 'is-error': !!errors.password }">
              <svg class="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input"
                placeholder="请输入密码"
                autocomplete="current-password"
                @focus="focused = 'password'"
                @blur="focused = ''"
                @keyup.enter="handleSubmit"
              />
              <button type="button" class="field-eye" tabindex="-1" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
          </label>

          <p v-if="errors.form" class="form-error" role="alert">{{ errors.form }}</p>

          <div class="form-row">
            <label class="remember">
              <input v-model="rememberMe" type="checkbox" class="remember-input" />
              <span class="remember-box" />
              <span>记住账号</span>
            </label>
          </div>

          <button type="submit" class="submit" :disabled="loading">
            <span v-if="loading" class="spinner" />
            <span v-else>登录</span>
          </button>
        </form>

        <p class="panel-foot">© {{ year }} 河南玺铭电力科技有限公司</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login, isAuthenticated } = useAuth()

const loading = ref(false)
const showPassword = ref(false)
const focused = ref('')
const rememberMe = ref(false)
const errors = reactive({ username: '', password: '', form: '' })
const loginForm = reactive({ username: '', password: '' })
const year = new Date().getFullYear()

onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo('/admin')
  }
  const saved = localStorage.getItem('remembered_username')
  if (saved) {
    loginForm.username = saved
    rememberMe.value = true
  }
})

const validate = (): boolean => {
  errors.username = ''
  errors.password = ''
  errors.form = ''
  let valid = true
  if (!loginForm.username.trim()) {
    errors.username = '请输入账号'
    valid = false
  }
  if (!loginForm.password) {
    errors.password = '请输入密码'
    valid = false
  } else if (loginForm.password.length < 6) {
    errors.password = '密码长度不能少于 6 位'
    valid = false
  }
  return valid
}

const handleSubmit = async () => {
  if (!validate()) return
  loading.value = true
  try {
    const result = await login(loginForm.username, loginForm.password)
    if (result.success) {
      if (rememberMe.value) localStorage.setItem('remembered_username', loginForm.username)
      else localStorage.removeItem('remembered_username')
      await navigateTo('/admin')
    } else {
      errors.form = result.message || '账号或密码错误'
    }
  } catch {
    errors.form = '登录异常，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  background: #f8fafc;
}

/* ── 左视觉 ── */
.login-visual {
  position: relative;
  display: none;
  overflow: hidden;
  color: #fff;
}

@media (min-width: 960px) {
  .login-visual {
    display: block;
  }

  .login-page {
    grid-template-columns: 1.15fr 1fr;
  }
}

.visual-bg {
  position: absolute;
  inset: 0;
}

.visual-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1.02);
}

.visual-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(160deg, rgba(8, 15, 28, 0.88) 0%, rgba(15, 23, 42, 0.78) 45%, rgba(30, 64, 175, 0.72) 100%);
}

.visual-grid {
  position: absolute;
  inset: 0;
  opacity: 0.12;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.35) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.35) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at 30% 40%, black 10%, transparent 70%);
}

.visual-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  min-height: 100vh;
  padding: 40px 44px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.visual-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.visual-mark {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(145deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
}

.visual-mark.sm {
  width: 36px;
  height: 36px;
  font-size: 15px;
  border-radius: 10px;
}

.visual-brand {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.visual-brand-sub {
  font-size: 10px;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 2px;
}

.visual-mid {
  max-width: 420px;
}

.visual-eyebrow {
  margin: 0 0 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #93c5fd;
}

.visual-title {
  margin: 0 0 12px;
  font-size: clamp(24px, 2.2vw, 28px);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.visual-desc {
  margin: 0 0 22px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
}

.visual-points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.visual-points li {
  position: relative;
  padding-left: 16px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.78);
}

.visual-points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #60a5fa;
}

.visual-bottom {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.04em;
}

/* ── 右表单 ── */
.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}

.panel-card {
  width: 100%;
  max-width: 400px;
}

.panel-mobile-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  font-weight: 700;
  color: #0f172a;
}

@media (min-width: 960px) {
  .panel-mobile-brand {
    display: none;
  }
}

.panel-head {
  margin-bottom: 28px;
}

.panel-title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.panel-sub {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: block;
}

.field-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.field-box {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-box.is-focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.field-box.is-error {
  border-color: #f87171;
}

.field-icon {
  width: 18px;
  height: 18px;
  color: #94a3b8;
  flex-shrink: 0;
}

.field-box.is-focus .field-icon {
  color: #2563eb;
}

.field-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  font-size: 14px;
  color: #0f172a;
  background: transparent;
}

.field-input::placeholder {
  color: #cbd5e1;
}

.field-eye {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
}

.field-eye:hover {
  color: #64748b;
}

.field-eye svg {
  width: 18px;
  height: 18px;
}

.field-error {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #ef4444;
}

.form-error {
  display: block;
  margin-top: 4px;
  padding: 9px 12px;
  font-size: 13px;
  line-height: 1.5;
  color: #ef4444;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  user-select: none;
}

.remember-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.remember-box {
  width: 16px;
  height: 16px;
  border: 1.5px solid #cbd5e1;
  border-radius: 4px;
  position: relative;
  transition: all 0.15s ease;
}

.remember-input:checked + .remember-box {
  background: #2563eb;
  border-color: #2563eb;
}

.remember-input:checked + .remember-box::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.submit {
  margin-top: 4px;
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.25);
  transition: background 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
}

.submit:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.panel-foot {
  margin: 36px 0 0;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
}

@media (max-width: 959px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-panel {
    min-height: 100vh;
  }
}
</style>
