<template>
  <div class="login-page" ref="loginPageRef" @mousemove="handleMouseMove">
    <LoginBackground />

    <div class="bg-glow" :style="glowStyle"></div>

    <div class="bg-ornament" :style="ornamentStyle">
      <div class="ornament-ring ring-1"></div>
      <div class="ornament-ring ring-2"></div>
      <div class="ornament-ring ring-3"></div>
      <div class="ornament-dot dot-1"></div>
      <div class="ornament-dot dot-2"></div>
      <div class="ornament-dot dot-3"></div>
      <div class="ornament-dot dot-4"></div>
    </div>

    <div class="login-card">
      <div class="card-header">
        <div class="logo-mark">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="14" fill="url(#logo-grad)"/>
            <path d="M14 30L24 14L34 30" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 26H29" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <defs><linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="48"><stop stop-color="#2563eb"/><stop offset="1" stop-color="#3b82f6"/></linearGradient></defs>
          </svg>
        </div>
        <h1 class="card-title">后台管理</h1>
        <p class="card-subtitle">玺铭电力 · 带电清洗</p>
      </div>

      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="input-group" :class="{ 'input-focused': focusedField === 'username', 'input-has-value': loginForm.username }">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <input
            ref="usernameRef"
            v-model="loginForm.username"
            type="text"
            class="input-field"
            placeholder="用户名"
            autocomplete="username"
            @focus="focusedField = 'username'"
            @blur="focusedField = ''"
          />
        </div>
        <p v-if="errors.username" class="field-error">{{ errors.username }}</p>

        <div class="input-group" :class="{ 'input-focused': focusedField === 'password', 'input-has-value': loginForm.password }">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <input
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            class="input-field"
            placeholder="密码"
            autocomplete="current-password"
            @focus="focusedField = 'password'"
            @blur="focusedField = ''"
            @keyup.enter="handleSubmit"
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
            <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
        <p v-if="errors.password" class="field-error">{{ errors.password }}</p>

        <button type="submit" class="submit-btn" :class="{ 'btn-loading': loading }" :disabled="loading">
          <span v-if="!loading" class="btn-text">登 录</span>
          <span v-else class="btn-spinner"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()
const { login, isAuthenticated } = useAuth()

const loginPageRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const showPassword = ref(false)
const focusedField = ref('')
const errors = reactive({ username: '', password: '' })
const mouseX = ref(0)
const mouseY = ref(0)
const glowRef = ref<HTMLElement | null>(null)
const ornamentRef = ref<HTMLElement | null>(null)
let rafId = 0

const loginForm = reactive({
  username: '',
  password: ''
})

// 使用 CSS 自定义属性 + rAF 节流，避免每次 mousemove 重算 gradient 字符串
const glowStyle = computed(() => ({
  '--mouse-x': `${mouseX.value}px`,
  '--mouse-y': `${mouseY.value}px`,
}))

const ornamentStyle = computed(() => {
  if (typeof window === 'undefined') return {}
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  const dx = (mouseX.value - centerX) / centerX
  const dy = (mouseY.value - centerY) / centerY
  return {
    transform: `translate(${dx * 20}px, ${dy * 20}px)`,
  }
})

const handleMouseMove = (e: MouseEvent) => {
  if (rafId) return // rAF 节流：一帧内只处理一次
  rafId = requestAnimationFrame(() => {
    mouseX.value = e.clientX
    mouseY.value = e.clientY
    rafId = 0
  })
}

const validate = (): boolean => {
  errors.username = ''
  errors.password = ''
  let valid = true
  if (!loginForm.username.trim()) {
    errors.username = '请输入用户名'
    valid = false
  }
  if (!loginForm.password) {
    errors.password = '请输入密码'
    valid = false
  } else if (loginForm.password.length < 6) {
    errors.password = '密码长度不能少于6位'
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
      await navigateTo('/admin')
    } else {
      if (result.message?.includes('用户')) {
        errors.username = result.message
      } else {
        errors.password = result.message || '登录失败'
      }
    }
  } catch {
    errors.password = '登录异常，请重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/admin')
  }
})
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse 80% 60% at 30% 20%, rgba(37, 99, 235, 0.08), transparent),
    radial-gradient(ellipse 60% 50% at 70% 80%, rgba(59, 130, 246, 0.06), transparent),
    linear-gradient(135deg, #0a0f1a 0%, #101828 30%, #0c1524 60%, #060a12 100%);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.login-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(6, 10, 18, 0.5) 100%);
  pointer-events: none;
  z-index: 1;
}

.bg-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background:
    radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.18), transparent 50%),
    radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37, 99, 235, 0.12), transparent 40%),
    radial-gradient(1200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(96, 165, 250, 0.06), transparent 60%);
  will-change: transform;
}

.bg-ornament {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.ornament-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(59, 130, 246, 0.12);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.03), inset 0 0 30px rgba(59, 130, 246, 0.02);
}

.ring-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -150px;
  border-width: 1px;
  border-color: rgba(37, 99, 235, 0.08);
  box-shadow: 0 0 40px rgba(37, 99, 235, 0.03), inset 0 0 40px rgba(37, 99, 235, 0.02);
}

.ring-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -80px;
  border-color: rgba(96, 165, 250, 0.08);
  box-shadow: 0 0 35px rgba(96, 165, 250, 0.03), inset 0 0 35px rgba(96, 165, 250, 0.02);
}

.ring-3 {
  width: 250px;
  height: 250px;
  top: 10%;
  left: 60%;
  border-color: rgba(59, 130, 246, 0.06);
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.02), inset 0 0 25px rgba(59, 130, 246, 0.02);
}

.ornament-dot {
  position: absolute;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.08);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.04);
}

.dot-1 {
  width: 120px;
  height: 120px;
  top: 18%;
  left: 10%;
  background: rgba(37, 99, 235, 0.07);
  box-shadow: 0 0 30px rgba(37, 99, 235, 0.04);
}

.dot-2 {
  width: 80px;
  height: 80px;
  bottom: 25%;
  right: 12%;
  background: rgba(96, 165, 250, 0.08);
  box-shadow: 0 0 25px rgba(96, 165, 250, 0.04);
}

.dot-3 {
  width: 60px;
  height: 60px;
  top: 55%;
  right: 28%;
  background: rgba(59, 130, 246, 0.07);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.04);
}

.dot-4 {
  width: 100px;
  height: 100px;
  bottom: 15%;
  left: 25%;
  background: rgba(37, 99, 235, 0.06);
  box-shadow: 0 0 30px rgba(37, 99, 235, 0.03);
}

.login-card {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 420px;
  margin: 24px;
  padding: 48px 40px 40px;
  background: rgba(10, 15, 26, 0.78);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 28px;
  border: 1px solid rgba(59, 130, 246, 0.12);
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.04),
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 24px 64px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.4s ease, border-color 0.4s ease;
}

.login-card:hover {
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.2);
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.35),
    0 32px 80px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.card-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-mark {
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
}

.logo-mark svg {
  width: 100%;
  height: 100%;
  display: block;
}

.card-title {
  font-size: 26px;
  font-weight: 700;
  color: #dbeafe;
  letter-spacing: 1px;
  margin: 0 0 8px;
}

.card-subtitle {
  font-size: 14px;
  color: #60a5fa;
  font-weight: 400;
  letter-spacing: 0.5px;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(16, 24, 40, 0.5);
  border: 1.5px solid rgba(59, 130, 246, 0.2);
  border-radius: 14px;
  padding: 0 16px;
  height: 52px;
  transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.input-group:hover {
  border-color: rgba(59, 130, 246, 0.4);
  background: rgba(16, 24, 40, 0.6);
}

.input-group.input-focused {
  border-color: #3b82f6;
  background: rgba(16, 24, 40, 0.7);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.input-group.input-has-value {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(16, 24, 40, 0.55);
}

.input-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
  flex-shrink: 0;
  transition: color 0.25s ease;
}

.input-focused .input-icon {
  color: #60a5fa;
}

.input-field {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  color: #dbeafe;
  padding: 0 12px;
  height: 100%;
  font-family: inherit;
  letter-spacing: 0.3px;
}

.input-field::placeholder {
  color: #6b7280;
  letter-spacing: 0.3px;
}

.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus {
  -webkit-text-fill-color: #dbeafe;
  box-shadow: 0 0 0px 1000px rgba(16, 24, 40, 0.8) inset;
  transition: background-color 5000s ease-in-out 0s;
}

.toggle-password {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  border-radius: 8px;
  transition: color 0.2s ease, background 0.2s ease;
  flex-shrink: 0;
}

.toggle-password:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
}

.toggle-password svg {
  width: 18px;
  height: 18px;
}

.field-error {
  font-size: 12px;
  color: #ef4444;
  margin: 2px 0 2px 16px;
  line-height: 1.4;
  min-height: 17px;
}

.submit-btn {
  position: relative;
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 40%, #60a5fa 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 3px;
  cursor: pointer;
  margin-top: 20px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.3s ease, opacity 0.2s ease;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
}

.submit-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.submit-btn:hover:not(:disabled)::after {
  transform: translateX(100%);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(37, 99, 235, 0.35);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-spinner {
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.card-hint {
  text-align: center;
  font-size: 12px;
  color: #c4b5c7;
  margin: 24px 0 0;
  letter-spacing: 0.3px;
}

@media (max-width: 480px) {
  .login-card {
    margin: 16px;
    padding: 36px 24px 32px;
    border-radius: 24px;
  }

  .card-title {
    font-size: 22px;
  }

  .input-group {
    height: 48px;
    border-radius: 12px;
  }

  .submit-btn {
    height: 48px;
    border-radius: 12px;
    font-size: 15px;
  }

  .ring-1 { width: 300px; height: 300px; }
  .ring-2 { width: 200px; height: 200px; }
  .dot-1 { width: 60px; height: 60px; }
  .dot-2 { width: 40px; height: 40px; }
  .dot-3 { width: 30px; height: 30px; }
}

@media (max-width: 360px) {
  .login-card {
    padding: 28px 20px 24px;
  }

  .card-title {
    font-size: 20px;
  }

  .input-group {
    height: 44px;
  }

  .submit-btn {
    height: 44px;
  }
}
</style>