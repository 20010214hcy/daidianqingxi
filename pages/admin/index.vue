<template>
  <div class="dashboard admin-page-container">
    <!-- 欢迎横幅 -->
    <section class="welcome-banner">
      <div class="welcome-content">
        <div class="welcome-text">
          <h2 class="welcome-title">👋 欢迎回来，{{ user?.name || user?.username || '管理员' }}</h2>
          <p class="welcome-desc">今天是 {{ today }}，祝您工作愉快！</p>
        </div>
        <div class="welcome-stats">
          <div class="welcome-stat-item">
            <span class="stat-number">{{ loading ? '-' : counts.pendingMessages }}</span>
            <span class="stat-label">待处理留言</span>
          </div>
        </div>
      </div>
    </section>

      <!-- 数据概览统计面板 -->
      <section class="stats-grid">
        <div
          v-for="(card, index) in statCards"
          :key="card.label"
          class="stat-card"
          :style="{ '--accent': card.color, '--delay': index * 0.1 + 's' }"
        >
          <div class="stat-card-header">
            <div class="stat-icon" :style="{ background: card.color + '15', color: card.color }">
              <span>{{ card.icon }}</span>
            </div>
            <div class="stat-trend" :class="card.trend > 0 ? 'trend-up' : 'trend-down'" v-if="card.trend">
              <el-icon :size="12"><Top v-if="card.trend > 0" /><Bottom v-else /></el-icon>
              <span>{{ Math.abs(card.trend) }}%</span>
            </div>
          </div>
          <div class="stat-value">{{ loading ? '-' : card.value }}</div>
          <div class="stat-info">
            <span class="stat-label">{{ card.label }}</span>
            <span class="stat-sub">{{ card.sub }}</span>
          </div>
          <div class="stat-bar">
            <div
              class="stat-bar-fill"
              :style="{
                width: loading ? '0%' : (card.value / maxStatValue * 100) + '%',
                background: card.color
              }"
            />
          </div>
        </div>
      </section>

      <!-- 主要内容区 -->
      <div class="dashboard-main-grid">
        <!-- 产品分类分布 -->
        <div class="panel chart-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <h3 class="panel-title">产品分类分布</h3>
              <span class="panel-badge">各分类产品数量</span>
            </div>
            <el-dropdown trigger="click">
              <el-button text>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>查看详情</el-dropdown-item>
                  <el-dropdown-item>导出数据</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div v-if="loading" class="chart-skeleton">
            <div v-for="n in 4" :key="n" class="skeleton-bar admin-skeleton" :style="{ width: (30 + n * 10) + '%', animationDelay: n * 0.1 + 's' }" />
          </div>
          <div v-else-if="chartData.length === 0" class="panel-empty">
            <el-icon :size="48" color="#cbd5e1"><DataLine /></el-icon>
            <p>暂无数据</p>
          </div>
          <div v-else class="bar-chart">
            <div class="chart-bars">
              <div v-for="(item, i) in chartData" :key="i" class="bar-wrapper" :style="{ '--delay': i * 0.1 + 's' }">
                <div class="bar-tooltip">{{ item.value }} 个产品</div>
                <div class="bar-container">
                  <div
                    class="bar"
                    :style="{
                      height: maxChartValue ? (item.value / maxChartValue * 100) + '%' : '0%',
                      background: `linear-gradient(180deg, ${barColors[i % barColors.length]} 0%, ${barColors[i % barColors.length]}88 100%)`,
                      animationDelay: i * 0.1 + 's'
                    }"
                  />
                </div>
                <span class="bar-label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="panel quick-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <h3 class="panel-title">快捷操作</h3>
              <span class="panel-badge">常用功能</span>
            </div>
          </div>
          <div class="quick-grid">
            <button
              v-for="(btn, index) in quickActions"
              :key="btn.path"
              class="quick-btn"
              @click="navigateTo(btn.path)"
              :style="{ '--delay': index * 0.05 + 's' }"
            >
              <div class="quick-icon" :style="{ background: btn.color + '15', color: btn.color }">
                <span>{{ btn.icon }}</span>
              </div>
              <span class="quick-text">{{ btn.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 底部面板 -->
      <div class="dashboard-bottom-grid">
        <!-- 系统状态 -->
        <div class="panel status-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <h3 class="panel-title">系统状态</h3>
              <div class="status-indicator" :class="sysStatus">
                <span class="status-dot" />
                <span class="status-text">{{ sysStatus === 'healthy' ? '运行正常' : '异常' }}</span>
              </div>
            </div>
          </div>
          <div class="status-grid">
            <div v-for="item in statusItems" :key="item.label" class="status-item">
              <div class="status-item-icon" :style="{ background: item.color + '15', color: item.color }">
                <el-icon :size="16"><component :is="item.icon" /></el-icon>
              </div>
              <div class="status-item-info">
                <span class="status-item-label">{{ item.label }}</span>
                <span class="status-item-value" :class="{ 'status-healthy': item.healthy }">
                  {{ loading ? '-' : item.value }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近更新 -->
        <div class="panel recent-panel">
          <div class="panel-header">
            <div class="panel-title-group">
              <h3 class="panel-title">最近更新</h3>
              <span class="panel-badge">最新文章</span>
            </div>
            <el-button text type="primary" @click="navigateTo('/admin/articles')">
              查看全部
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>
          <div v-if="loading" class="recent-skeleton">
            <div v-for="n in 4" :key="n" class="skeleton-item">
              <div class="skeleton-avatar admin-skeleton" />
              <div class="skeleton-content">
                <div class="skeleton-title admin-skeleton" :style="{ width: (60 + n * 8) + '%' }" />
                <div class="skeleton-time admin-skeleton" style="width: 30%" />
              </div>
            </div>
          </div>
          <div v-else class="recent-list">
            <div
              v-for="(item, index) in recentArticles"
              :key="item.id"
              class="recent-item"
              :style="{ '--delay': index * 0.1 + 's' }"
            >
              <div class="recent-item-dot" />
              <div class="recent-item-content">
                <span class="recent-title" :title="item.title">{{ item.title }}</span>
                <span class="recent-time">{{ formatTime(item.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Top, Bottom, MoreFilled, DataLine, ArrowRight,
  Monitor, Goods, Suitcase, Document, ChatDotRound,
  Cpu, Connection, Timer
} from '@element-plus/icons-vue'

definePageMeta({ layout: 'admin' })
useHead({ title: '仪表盘 - 后台管理' })

const router = useRouter()
const { user } = useAuth()
const loading = ref(true)

const counts = ref({ articles: 0, products: 0, cases: 0, services: 0, messages: 0, pendingMessages: 0 })
const chartData = ref<{ label: string; value: number }[]>([])
const recentArticles = ref<{ id: number; title: string; createdAt: string }[]>([])
const system = ref({ uptime: '', memoryUsage: '', nodeVersion: '', status: 'healthy' })

const barColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444']

const today = computed(() => {
  const d = new Date()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekDays[d.getDay()]}`
})

const maxChartValue = computed(() => {
  const max = Math.max(...chartData.value.map(d => d.value), 1)
  return max
})

const maxStatValue = computed(() => {
  const values = statCards.value.map(c => c.value as number)
  return Math.max(...values, 1)
})

const sysStatus = computed(() => system.value.status === 'healthy' ? 'healthy' : 'error')

const statCards = computed(() => [
  { label: '产品总数', value: counts.value.products, sub: '全部产品', icon: '📦', color: '#3b82f6', trend: 12 },
  { label: '服务项目', value: counts.value.services, sub: '服务类型', icon: '⚡', color: '#8b5cf6', trend: 5 },
  { label: '工程案例', value: counts.value.cases, sub: '成功项目', icon: '🏭', color: '#10b981', trend: 8 },
  { label: '文章资讯', value: counts.value.articles, sub: '新闻总数', icon: '📰', color: '#f59e0b', trend: -3 },
  { label: '待回留言', value: counts.value.pendingMessages, sub: '待处理', icon: '💬', color: '#ef4444', trend: 0 },
])

const quickActions = [
  { label: '新增产品', icon: '📦', path: '/admin/products', color: '#3b82f6' },
  { label: '新增文章', icon: '📰', path: '/admin/articles', color: '#f59e0b' },
  { label: '查看留言', icon: '💬', path: '/admin/messages', color: '#ef4444' },
  { label: '资质证书', icon: '🏅', path: '/admin/certificates', color: '#8b5cf6' },
  { label: '新增案例', icon: '🏭', path: '/admin/cases', color: '#10b981' },
  { label: '网站设置', icon: '⚙️', path: '/admin/settings', color: '#64748b' },
]

const statusItems = computed(() => [
  { label: '运行时间', value: system.value.uptime, icon: Timer, color: '#10b981', healthy: true },
  { label: '内存使用', value: system.value.memoryUsage, icon: Cpu, color: '#3b82f6', healthy: true },
  { label: 'Node 版本', value: system.value.nodeVersion, icon: Monitor, color: '#8b5cf6', healthy: true },
  { label: 'API 状态', value: '正常', icon: Connection, color: '#10b981', healthy: true },
])

const loadDashboard = async () => {
  try {
    const res = await $fetch('/api/dashboard/stats')
    if (res.success && res.data) {
      counts.value = res.data.counts
      chartData.value = res.data.chart || []
      recentArticles.value = res.data.recentArticles || []
      system.value = res.data.system
    }
  } catch (err) {
    console.error('仪表盘数据加载失败:', err)
  } finally {
    loading.value = false
  }
}

const navigateTo = (path: string) => router.push(path)

const formatTime = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

onMounted(() => loadDashboard())
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

/* ===== 欢迎横幅 ===== */
.welcome-banner {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
  border-radius: var(--admin-radius-xl);
  padding: 32px;
  margin-bottom: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  animation: slideUp 0.5s ease-out;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.welcome-banner::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: 10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  border-radius: 50%;
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.welcome-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.welcome-desc {
  font-size: 14px;
  opacity: 0.9;
}

.welcome-stats {
  display: flex;
  gap: 24px;
}

.welcome-stat-item {
  text-align: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--admin-radius-lg);
  backdrop-filter: blur(10px);
}

.welcome-stat-item .stat-number {
  display: block;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.welcome-stat-item .stat-label {
  font-size: 13px;
  opacity: 1; color: rgba(255, 255, 255, 0.95);
}

/* ===== 统计卡片网格 ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: var(--admin-radius-xl);
  padding: 24px;
  border: 1px solid var(--admin-border);
  transition: all var(--admin-transition-normal);
  animation: slideUp 0.5s ease-out backwards;
  animation-delay: var(--delay);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--admin-shadow-lg);
  border-color: var(--accent);
}

.stat-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--admin-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: var(--admin-radius-full);
}

.trend-up {
  background: #dcfce7;
  color: #16a34a;
}

.trend-down {
  background: #fee2e2;
  color: #dc2626;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--admin-text-primary);
  line-height: 1;
  margin-bottom: 8px;
}

.stat-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 16px;
}

.stat-label {
  font-size: 14px;
  color: var(--admin-text-secondary);
  font-weight: 500;
}

.stat-sub {
  font-size: 12px;
  color: var(--admin-text-muted);
}

.stat-bar {
  height: 4px;
  background: #f1f5f9;
  border-radius: 2px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideRight 0.5s ease-out backwards;
}

/* ===== 主要内容网格 ===== */
.dashboard-main-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

/* ===== 面板通用样式 ===== */
.panel {
  background: white;
  border-radius: var(--admin-radius-xl);
  border: 1px solid var(--admin-border);
  padding: 24px;
  animation: slideUp 0.5s ease-out backwards;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.panel-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--admin-text-primary);
}

.panel-badge {
  font-size: 12px;
  color: var(--admin-text-muted);
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: var(--admin-radius-full);
}

.panel-empty {
  text-align: center;
  padding: 60px 0;
  color: var(--admin-text-muted);
}

.panel-empty p {
  margin-top: 12px;
  font-size: 14px;
}

/* ===== 图表面板 ===== */
.chart-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;
}

.skeleton-bar {
  height: 32px;
  border-radius: 6px;
}

.bar-chart {
  padding-top: 8px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 220px;
  padding: 0 8px;
  gap: 16px;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  min-width: 0;
  position: relative;
}

.bar-tooltip {
  position: absolute;
  top: -32px;
  background: var(--admin-text-primary);
  color: white;
  padding: 4px 10px;
  border-radius: var(--admin-radius-sm);
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(4px);
  transition: all var(--admin-transition-fast);
  pointer-events: none;
}

.bar-wrapper:hover .bar-tooltip {
  opacity: 1;
  transform: translateY(0);
}

.bar-container {
  width: 100%;
  max-width: 56px;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  border-radius: 8px 8px 0 0;
  transition: height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-height: 8px;
  animation: slideUp 0.6s ease-out backwards;
  animation-delay: var(--delay);
  position: relative;
}

.bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  border-radius: 8px 8px 0 0;
}

.bar-label {
  font-size: 12px;
  color: var(--admin-text-muted);
  text-align: center;
  line-height: 1.3;
  margin-top: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* ===== 快捷操作 ===== */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.quick-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 12px;
  border: 1px solid var(--admin-border);
  border-radius: var(--admin-radius-lg);
  background: white;
  cursor: pointer;
  transition: all var(--admin-transition-normal);
  animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: var(--delay);
}

.quick-btn:hover {
  border-color: var(--admin-primary);
  background: var(--admin-primary-light);
  transform: translateY(-4px);
  box-shadow: var(--admin-shadow-md);
}

.quick-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--admin-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: transform var(--admin-transition-normal);
}

.quick-btn:hover .quick-icon {
  transform: scale(1.1);
}

.quick-text {
  font-weight: 500;
  color: var(--admin-text-secondary);
  font-size: 13px;
}

/* ===== 底部网格 ===== */
.dashboard-bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* ===== 系统状态 ===== */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.healthy .status-dot {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  animation: pulse-glow 2s infinite;
}

.status-indicator.healthy .status-text {
  color: #10b981;
}

.status-indicator.error .status-dot {
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.status-indicator.error .status-text {
  color: #ef4444;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: var(--admin-radius-lg);
  transition: all var(--admin-transition-fast);
}

.status-item:hover {
  background: #f1f5f9;
}

.status-item-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--admin-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-item-label {
  font-size: 12px;
  color: var(--admin-text-muted);
}

.status-item-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--admin-text-primary);
}

.status-item-value.status-healthy {
  color: #10b981;
}

/* ===== 最近更新 ===== */
.recent-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-title {
  height: 16px;
  border-radius: 4px;
}

.skeleton-time {
  height: 12px;
  border-radius: 4px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: var(--admin-radius-lg);
  transition: all var(--admin-transition-fast);
  animation: slideRight 0.4s ease-out backwards;
  animation-delay: var(--delay);
}

.recent-item:hover {
  background: #f8fafc;
}

.recent-item-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--admin-primary);
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.recent-item-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

.recent-title {
  font-size: 14px;
  color: var(--admin-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  transition: color var(--admin-transition-fast);
}

.recent-item:hover .recent-title {
  color: var(--admin-primary);
}

.recent-time {
  font-size: 12px;
  color: var(--admin-text-muted);
  flex-shrink: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .dashboard-main-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .welcome-banner {
    padding: 24px;
  }

  .welcome-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .welcome-title {
    font-size: 20px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-value {
    font-size: 28px;
  }

  .quick-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .status-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
/* ===== 最近更新面板按钮样式 ===== */
.recent-panel .panel-header .el-button--primary.is-text {
  color: rgba(255, 255, 255, 0.95) !important;
  font-weight: 600;
}

.recent-panel .panel-header .el-button--primary.is-text:hover {
  color: rgba(255, 255, 255, 1) !important;
}
</style>
