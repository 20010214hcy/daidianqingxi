<template>
  <div class="login-container">
    <!-- 左侧品牌展示区 -->
    <div class="brand-section">
      <!-- 背景图片 -->
      <div class="brand-bg">
        <img           src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1920&q=80"
          alt="储能系统"
          class="bg-image"
        />
        <div class="bg-overlay"></div>
      </div>

      <!-- 品牌内容 -->
      <div class="brand-content">
        <!-- Logo -->
        <div class="logo-wrapper">
          <div class="logo-icon">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="16" fill="white" fill-opacity="0.2"/>
              <path d="M20 42L32 20L44 42" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M26 36H38" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <!-- 品牌信息 -->
        <div class="brand-text">
          <h1 class="brand-title">
            <span class="title-main">玺铭</span>
            <span class="title-sub">电力科技</span>
          </h1>
          <div class="brand-divider"></div>
          <p class="brand-slogan">智领能源未来 · 赋能绿色发展</p>
        </div>

        <!-- 核心业务 -->
        <div class="core-features">
          <div class="feature-tag">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M10 2L4 10h5l-1 8 7-8h-5l1-6z"/>
            </svg>
            <span>带电清洗</span>
          </div>
          <div class="feature-tag">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="6" width="14" height="10" rx="1"/>
              <path d="M12 18V4a1 1 0 00-1-1H9a1 1 0 00-1 1v14"/>
            </svg>
            <span>储能集成</span>
          </div>
          <div class="feature-tag">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="10" cy="10" r="7"/>
              <path d="M10 6v4l2 2"/>
            </svg>
            <span>数字能源</span>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="brand-footer">
          <p class="company-name">河南玺铭电力科技有限公司</p>
          <div class="cert-tags">
            <span>国家高新技术企业</span>
            <span>ISO9001认证</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单区 -->
    <div class="form-section">
      <div class="form-wrapper">
        <!-- 移动端Logo -->
        <div class="mobile-logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="url(#mobile-grad)"/>
            <path d="M14 34L24 14L34 34" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 28H29" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <defs>
              <linearGradient id="mobile-grad" x1="0" y1="0" x2="48" y2="48">
                <stop stop-color="#0f4c81"/>
                <stop offset="1" stop-color="#1a73e8"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- 表单标题 -->
        <div class="form-header">
          <h2 class="form-title">欢迎回来</h2>
          <p class="form-subtitle">登录智慧能源管理平台</p>
        </div>

        <!-- 登录表单 -->
        <form class="login-form" @submit.prevent="handleSubmit">
          <!-- 用户名输入 -->
          <div class="input-group" :class="{ 'is-focused': focusedField === 'username', 'has-value': loginForm.username }">
            <label class="input-label">账号</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                ref="usernameRef"
                v-model="loginForm.username"
                type="text"
                class="input-field"
                placeholder="请输入账号"
                autocomplete="username"
                @focus="focusedField = 'username'"
                @blur="focusedField = ''"
              />
            </div>
            <p v-if="errors.username" class="error-message">{{ errors.username }}</p>
          </div>

          <!-- 密码输入 -->
          <div class="input-group" :class="{ 'is-focused': focusedField === 'password', 'has-value': loginForm.password }">
            <label class="input-label">密码</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="input-field"
                placeholder="请输入密码"
                autocomplete="current-password"
                @focus="focusedField = 'password'"
                @blur="focusedField = ''"
                @keyup.enter="handleSubmit"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
          </div>

          <!-- 表单选项 -->
          <div class="form-options">
            <label class="checkbox-wrapper">
              <input type="checkbox" v-model="rememberMe" class="checkbox-input"/>
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">记住登录</span>
            </label>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>

          <!-- 登录按钮 -->
          <button type="submit" class="submit-btn" :class="{ 'is-loading': loading }" :disabled="loading">
            <span v-if="!loading" class="btn-text">
              <span>登录</span>
              <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
            <span v-else class="btn-spinner"></span>
          </button>
        </form>

        <!-- 底部信息 -->
        <div class="form-footer">
          <p>© 2026 河南玺铭电力科技有限公司</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()
const { login, isAuthenticated } = useAuth()

const loading = ref(false)
const showPassword = ref(false)
const focusedField = ref('')
const rememberMe = ref(false)
const errors = reactive({ username: '', password: '' })

const loginForm = reactive({
  username: '',
  password: ''
})

// 检查是否已登录
onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo('/admin')
  }

  // 恢复记住的用户名
  const savedUsername = localStorage.getItem('remembered_username')
  if (savedUsername) {
    loginForm.username = savedUsername
    rememberMe.value = true
  }
})

// 表单验证
const validate = (): boolean => {
  errors.username = ''
  errors.password = ''
  let valid = true

  if (!loginForm.username.trim()) {
    errors.username = '请输入账号'
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

// 提交表单
const handleSubmit = async () => {
  if (!validate()) return

  loading.value = true

  try {
    const result = await login(loginForm.username, loginForm.password)

    if (result.success) {
      // 记住用户名
      if (rememberMe.value) {
        localStorage.setItem('remembered_username', loginForm.username)
      } else {
        localStorage.removeItem('remembered_username')
      }

      // 登录成功，跳转到后台
      await navigateTo('/admin')
    } else {
      // 登录失败，显示错误信息
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
</script>

<style scoped>
/* 容器 */
.login-container {
  display: flex;
  min-height: 100vh;
}

/* 左侧品牌区 */
.brand-section {
  display: none;
  position: relative;
  width: 58%;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .brand-section {
    display: block;
  }
}

/* 背景图片 */
.brand-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(10, 22, 40, 0.92) 0%,
    rgba(15, 40, 71, 0.88) 40%,
    rgba(13, 59, 102, 0.85) 70%,
    rgba(26, 82, 118, 0.82) 100%
  );
}

/* 品牌内容 */
.brand-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 48px;
}

/* Logo */
.logo-wrapper {
  width: 64px;
  height: 64px;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

/* 品牌文字 */
.brand-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 480px;
}

.brand-title {
  margin-bottom: 20px;
}

.title-main {
  display: block;
  font-size: 56px;
  font-weight: 700;
  color: white;
  letter-spacing: 6px;
  line-height: 1.1;
}

.title-sub {
  display: block;
  font-size: 32px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 8px;
  margin-top: 8px;
}

.brand-divider {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, #4facfe, transparent);
  margin-bottom: 20px;
}

.brand-slogan {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 3px;
  font-weight: 300;
}

/* 核心业务标签 */
.core-features {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feature-tag:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.feature-tag svg {
  width: 18px;
  height: 18px;
  color: #4facfe;
}

.feature-tag span {
  font-size: 14px;
  color: white;
  font-weight: 500;
}

/* 底部信息 */
.brand-footer {
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.company-name {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.cert-tags {
  display: flex;
  gap: 12px;
}

.cert-tags span {
  padding: 5px 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  letter-spacing: 1px;
}

/* 右侧表单区 */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  background: white;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
}

/* 移动端Logo */
.mobile-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.mobile-logo svg {
  width: 56px;
  height: 56px;
}

@media (min-width: 1024px) {
  .mobile-logo {
    display: none;
  }
}

/* 表单标题 */
.form-header {
  margin-bottom: 36px;
}

.form-title {
  font-size: 26px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 14px;
  color: #8c8c8c;
}

/* 表单 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* 输入组 */
.input-group {
  position: relative;
}

.input-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #4a4a4a;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: #bfbfbf;
  transition: color 0.3s ease;
}

.input-field {
  width: 100%;
  height: 48px;
  padding: 0 44px;
  font-size: 14px;
  color: #1a1a2e;
  background: #f8f9fa;
  border: 1.5px solid #e8e8e8;
  border-radius: 10px;
  outline: none;
  transition: all 0.3s ease;
}

.input-field::placeholder {
  color: #bfbfbf;
}

.input-field:focus {
  background: white;
  border-color: #1a73e8;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.is-focused .input-icon {
  color: #1a73e8;
}

.toggle-password {
  position: absolute;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #bfbfbf;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #8c8c8c;
}

.toggle-password svg {
  width: 18px;
  height: 18px;
}

/* 错误信息 */
.error-message {
  margin-top: 6px;
  font-size: 12px;
  color: #ff4d4f;
}

/* 表单选项 */
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 16px;
  height: 16px;
  border: 1.5px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.checkbox-input:checked + .checkbox-custom {
  background: #1a73e8;
  border-color: #1a73e8;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 4.5px;
  top: 1.5px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  font-size: 13px;
  color: #8c8c8c;
}

.forgot-link {
  font-size: 13px;
  color: #1a73e8;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #0d47a1;
}

/* 登录按钮 */
.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #0f4c81 0%, #1a73e8 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.submit-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transition: left 0.5s ease;
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(26, 115, 232, 0.35);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn.is-loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-spinner {
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 底部信息 */
.form-footer {
  margin-top: 48px;
  text-align: center;
}

.form-footer p {
  font-size: 12px;
  color: #bfbfbf;
}

/* 响应式 */
@media (max-width: 480px) {
  .form-section {
    padding: 24px 20px;
  }

  .form-title {
    font-size: 22px;
  }

  .input-field {
    height: 44px;
  }

  .submit-btn {
    height: 44px;
  }
}
</style>
