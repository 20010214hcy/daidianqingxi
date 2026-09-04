<template>
  <div class="error-page" role="alert" aria-live="polite">
    <div class="error-container">
      <div class="error-illustration">
        <span class="error-code">{{ error.statusCode }}</span>
      </div>
      <h1 class="error-title">{{ statusMessage }}</h1>
      <p class="error-desc">{{ description }}</p>
      <div class="error-actions">
        <NuxtLink to="/" class="btn-primary" aria-label="返回首页">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          返回首页
        </NuxtLink>
        <button class="btn-secondary" @click="handleError" aria-label="清除错误">
          重试
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const statusMessage = computed(() => {
  const messages: Record<number, string> = {
    404: '页面未找到',
    403: '访问被拒绝',
    500: '服务器错误',
    503: '服务暂时不可用',
  }
  return messages[props.error.statusCode] || props.error.statusMessage || props.error.message || '页面出错了'
})

const description = computed(() => {
  const descriptions: Record<number, string> = {
    404: '您访问的页面不存在或已被移动，请检查地址是否正确。',
    403: '您没有权限访问此页面，请联系管理员。',
    500: '服务器遇到了问题，请稍后再试。',
  }
  return descriptions[props.error.statusCode] || '请尝试刷新页面或返回首页。'
})

const handleError = () => clearError({ redirect: '/' })

useHead({
  title: statusMessage.value + ' - 玺铭电力',
  meta: [
    { name: 'robots', content: 'noindex' },
  ]
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8edf5 100%);
  padding: 2rem;
}
.error-container { text-align: center; max-width: 480px; }
.error-illustration { margin-bottom: 2rem; }
.error-code {
  font-size: 8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}
.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}
.error-desc {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2rem;
}
.error-actions { display: flex; gap: 1rem; justify-content: center; }
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #1e40af;
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-primary:hover { background: #1d4ed8; }
.btn-primary:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover { background: #f8fafc; border-color: #cbd5e1; }
.btn-secondary:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
</style>
