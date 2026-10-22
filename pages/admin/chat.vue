<template>
  <div class="admin-page-container">
    <AdminPageHeader title="在线客服" description="实时接待网站访客咨询，回复会即时出现在访客的聊天窗口" />

    <div class="chat-shell">
      <!-- 会话列表 -->
      <aside class="chat-aside" :class="{ 'is-mobile-hidden': !!activeId }">
        <div class="chat-toolbar">
          <el-radio-group v-model="filter" size="small" @change="loadSessions">
            <el-radio-button value="all">全部</el-radio-button>
            <el-radio-button value="open">进行中</el-radio-button>
            <el-radio-button value="closed">已结束</el-radio-button>
          </el-radio-group>
          <el-button size="small" text :loading="loadingSessions" @click="loadSessions">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>

        <ul v-loading="loadingSessions" class="chat-sessions">
          <li
            v-for="s in sessions"
            :key="s.id"
            class="chat-session"
            :class="{ 'is-active': s.id === activeId }"
            @click="selectSession(s)"
          >
            <div class="cs-top">
              <span class="cs-name">{{ displayName(s) }}</span>
              <span class="cs-time">{{ shortTime(s.lastMessageAt) }}</span>
            </div>
            <p class="cs-preview">{{ s.lastMessage ? preview(s.lastMessage) : '（暂无消息）' }}</p>
            <div class="cs-meta">
              <el-tag v-if="s.status === 'closed'" size="small" type="info">已结束</el-tag>
              <span v-if="s.phone" class="cs-phone">{{ s.phone }}</span>
              <span v-if="s.ipLocation && s.ipLocation !== '未知'" class="cs-loc">{{ s.ipLocation }}</span>
              <el-badge v-if="s.unreadAdmin > 0" :value="s.unreadAdmin" class="cs-badge" />
            </div>
          </li>
          <li v-if="!loadingSessions && !sessions.length" class="chat-empty">暂无访客咨询</li>
        </ul>
      </aside>

      <!-- 会话详情 -->
      <section class="chat-main" :class="{ 'is-mobile-hidden': !activeId }">
        <template v-if="active">
          <header class="cm-head">
            <button type="button" class="cm-back" aria-label="返回列表" @click="activeId = 0">←</button>
            <div class="cm-head-info">
              <p class="cm-name">{{ displayName(active) }}</p>
              <p class="cm-sub">
                <span v-if="active.phone" class="cm-phone">{{ active.phone }}</span>
                <span v-if="active.pageUrl" class="cm-page" :title="shortUrl(active.pageUrl)">来源：{{ pageLabel(active.pageUrl) }}</span>
                <span v-if="active.ip" class="cm-ip">IP：{{ ipText(active) }}</span>
              </p>
            </div>
            <el-button size="small" :type="active.status === 'open' ? 'default' : 'primary'" @click="toggleStatus">
              {{ active.status === 'open' ? '结束会话' : '重新打开' }}
            </el-button>
          </header>

          <div ref="bodyEl" class="cm-body">
            <div
              v-for="m in messages"
              :key="m.id"
              class="cm-row"
              :class="m.sender === 'admin' ? 'is-agent' : 'is-visitor'"
            >
              <div class="cm-bubble">{{ m.content }}</div>
              <p class="cm-time">{{ m.sender === 'admin' && m.senderName ? m.senderName + ' · ' : '' }}{{ fullTime(m.createdAt) }}</p>
            </div>
            <p v-if="!messages.length" class="cm-empty">访客还没有发送消息</p>
          </div>

          <footer class="cm-foot">
            <el-input
              v-model="draft"
              type="textarea"
              :rows="3"
              maxlength="1000"
              show-word-limit
              placeholder="输入回复内容，Ctrl + Enter 发送"
              @keydown.ctrl.enter.prevent="reply"
            />
            <div class="cm-actions">
              <span class="cm-tip">回复后访客刷新即可看到（3 秒内）</span>
              <el-button type="primary" :loading="replying" :disabled="!draft.trim()" @click="reply">发送回复</el-button>
            </div>
          </footer>
        </template>

        <div v-else class="chat-placeholder">
          <el-icon :size="34"><ChatDotRound /></el-icon>
          <p>从左侧选择一个会话开始回复</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Refresh, ChatDotRound } from '@element-plus/icons-vue'

definePageMeta({ layout: 'admin' })
useHead({ title: '在线客服' })

interface SessionItem {
  id: number
  visitorId: string
  name: string | null
  phone: string | null
  pageUrl: string | null
  ip?: string | null
  ipLocation?: string | null
  status: string
  unreadAdmin: number
  lastMessageAt: string
  createdAt: string
  lastMessage: { id: number; sender: string; content: string; createdAt: string } | null
}

interface ChatMessage {
  id: number
  sender: string
  senderName?: string | null
  content: string
  createdAt: string
}

const sessions = ref<SessionItem[]>([])
const messages = ref<ChatMessage[]>([])
const active = ref<SessionItem | null>(null)
const activeId = ref(0)
const filter = ref('all')
const draft = ref('')
const replying = ref(false)
const loadingSessions = ref(false)
const unreadTotal = ref(0)
const bodyEl = ref<HTMLElement | null>(null)

let sessionTimer: ReturnType<typeof setInterval> | null = null
let messageTimer: ReturnType<typeof setInterval> | null = null
let lastUnread = 0
let baseTitle = ''

const displayName = (s: SessionItem | null) => {
  if (!s) return ''
  if (s.name) return s.name
  if (s.phone) return `访客 ${s.phone.slice(-4)}`
  return `访客 #${s.id}`
}

const preview = (m: { content: string; sender: string }) => {
  const text = m.content.replace(/\s+/g, ' ').slice(0, 40)
  return m.sender === 'admin' ? `我：${text}` : text
}

const shortTime = (value: string) => {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  const pad = (n: number) => String(n).padStart(2, '0')
  return sameDay ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : `${d.getMonth() + 1}/${d.getDate()}`
}

const fullTime = (value: string) => {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const shortUrl = (url: string) => {
  try {
    return url.replace(/^https?:\/\/[^/]+/, '') || '/'
  } catch {
    return url
  }
}

/** 站内路径 → 中文页面名 */
const PAGE_NAMES: Record<string, string> = {
  '/': '首页',
  '/products': '产品中心',
  '/services': '服务项目',
  '/cases': '工程案例',
  '/articles': '新闻资讯',
  '/news': '新闻资讯',
  '/solutions': '技术方案',
  '/certificates': '资质证书',
  '/contact': '联系我们',
  '/about': '关于我们',
}

const PAGE_DETAILS: Record<string, string> = {
  products: '产品详情',
  services: '服务详情',
  cases: '案例详情',
  articles: '文章详情',
  news: '新闻详情',
  solutions: '方案详情',
}

const pageLabel = (url: string) => {
  const path = shortUrl(url).split('?')[0]
  if (PAGE_NAMES[path]) return PAGE_NAMES[path]
  const seg = path.split('/').filter(Boolean)
  if (seg.length >= 2 && PAGE_DETAILS[seg[0]]) return PAGE_DETAILS[seg[0]]
  return path
}

/** 「IP + 归属地」组合展示，如 114.106.x.x（河南平顶山） */
const ipText = (s: SessionItem | null) => {
  if (!s?.ip) return ''
  return s.ipLocation && s.ipLocation !== '未知' ? `${s.ip}（${s.ipLocation}）` : s.ip
}

/** 有新咨询时闪烁标题（页面在后台时最容易漏掉） */
function updateTitle() {
  if (!import.meta.client) return
  if (!baseTitle) baseTitle = document.title
  if (unreadTotal.value > 0 && document.hidden) {
    document.title = `(${unreadTotal.value}) 新咨询 · 在线客服`
  } else {
    document.title = baseTitle
  }
}

async function loadSessions() {
  loadingSessions.value = true
  try {
    const res: any = await $fetch('/api/admin/chat/sessions', {
      query: { status: filter.value, pageSize: 50 },
    })
    if (res?.success && res.data) {
      sessions.value = res.data.list || []
      unreadTotal.value = res.data.unreadTotal || 0
      if (unreadTotal.value > lastUnread) beep()
      lastUnread = unreadTotal.value
      updateTitle()
      // 同步当前会话的最新状态
      if (activeId.value) {
        const fresh = sessions.value.find((s) => s.id === activeId.value)
        if (fresh) active.value = { ...active.value, ...fresh }
      }
    }
  } catch (e: any) {
    if (e?.statusCode === 403) {
      ElMessage.error('没有在线客服权限')
    }
  } finally {
    loadingSessions.value = false
  }
}

async function loadMessages(after = 0) {
  if (!activeId.value) return
  try {
    const res: any = await $fetch('/api/admin/chat/messages', {
      query: { sessionId: activeId.value, after },
    })
    if (res?.success && res.data) {
      const s = res.data.session
      if (s) {
        active.value = {
          ...(active.value || ({} as SessionItem)),
          ...s,
          lastMessage: active.value?.lastMessage || null,
          unreadAdmin: 0,
          lastMessageAt: active.value?.lastMessageAt || s.createdAt,
        } as SessionItem
      }
      const incoming: ChatMessage[] = res.data.messages || []
      if (after === 0) {
        messages.value = incoming
        scrollBottom()
      } else if (incoming.length) {
        messages.value = [...messages.value, ...incoming]
        scrollBottom()
      }
    }
  } catch (e: any) {
    if (e?.statusCode !== 403) console.error(e)
  }
}

function scrollBottom() {
  nextTick(() => {
    if (bodyEl.value) bodyEl.value.scrollTop = bodyEl.value.scrollHeight
  })
}

function selectSession(s: SessionItem) {
  activeId.value = s.id
  active.value = s
  messages.value = []
  draft.value = ''
  loadMessages(0)
}

async function reply() {
  const content = draft.value.trim()
  if (!content || !activeId.value || replying.value) return
  replying.value = true
  try {
    const res: any = await $fetch('/api/admin/chat/reply', {
      method: 'POST',
      body: { sessionId: activeId.value, content },
    })
    if (res?.success) {
      draft.value = ''
      await loadMessages(0)
      loadSessions()
    } else {
      ElMessage.error(res?.message || '发送失败')
    }
  } catch (e: any) {
    ElMessage.error(e?.statusMessage || '发送失败')
  } finally {
    replying.value = false
  }
}

async function toggleStatus() {
  if (!activeId.value || !active.value) return
  const next = active.value.status === 'open' ? 'closed' : 'open'
  try {
    await ElMessageBox.confirm(
      next === 'closed' ? '结束后访客仍可继续发消息，会话会自动恢复。确定结束？' : '重新打开该会话？',
      '提示',
      { type: 'warning' }
    )
    const res: any = await $fetch('/api/admin/chat/close', {
      method: 'POST',
      body: { sessionId: activeId.value, status: next },
    })
    if (res?.success) {
      active.value.status = next
      ElMessage.success(next === 'closed' ? '会话已结束' : '会话已重新打开')
      loadSessions()
    }
  } catch {
    /* 取消操作 */
  }
}

/** 提示音：新咨询提醒（浏览器可能拦截自动播放，失败静默） */
function beep() {
  if (!import.meta.client) return
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.25)
    osc.onended = () => ctx.close()
  } catch {
    /* 忽略 */
  }
}

function onVisible() {
  if (!document.hidden) {
    lastUnread = 0
    updateTitle()
  }
}

onMounted(async () => {
  baseTitle = document.title
  document.addEventListener('visibilitychange', onVisible)
  await loadSessions()
  sessionTimer = setInterval(loadSessions, 5000)
  messageTimer = setInterval(() => {
    if (activeId.value) loadMessages(messages.value.length ? Math.max(...messages.value.map((m) => m.id)) : 0)
  }, 3000)
})

onUnmounted(() => {
  if (sessionTimer) clearInterval(sessionTimer)
  if (messageTimer) clearInterval(messageTimer)
  document.removeEventListener('visibilitychange', onVisible)
  if (import.meta.client && baseTitle) document.title = baseTitle
})
</script>

<style scoped>
.chat-shell {
  display: flex;
  gap: 16px;
  height: calc(100vh - 210px);
  min-height: 480px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 12px;
  overflow: hidden;
}

.chat-aside {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-border-color-lighter, #ebeef5);
  background: #fafbfc;
}

.chat-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
  background: #fff;
}

.chat-sessions {
  flex: 1;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chat-session {
  padding: 12px 14px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.15s ease;
}

.chat-session:hover {
  background: #f1f5f9;
}

.chat-session.is-active {
  background: #eff6ff;
  box-shadow: inset 3px 0 0 #2563eb;
}

.cs-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.cs-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cs-time {
  flex-shrink: 0;
  font-size: 11px;
  color: #94a3b8;
}

.cs-preview {
  margin: 4px 0 0;
  font-size: 12px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cs-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  min-height: 18px;
}

.cs-phone {
  font-size: 11px;
  color: #2563eb;
}

.cs-loc {
  font-size: 11px;
  color: #94a3b8;
}

.cs-badge {
  margin-left: auto;
}

.chat-empty {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

.chat-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.cm-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);
}

.cm-back {
  display: none;
  width: 30px;
  height: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}

.cm-head-info {
  flex: 1;
  min-width: 0;
}

.cm-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.cm-sub {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 2px;
  font-size: 11px;
  color: #94a3b8;
}

.cm-phone {
  color: #2563eb;
  font-weight: 600;
}

.cm-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8fafc;
}

.cm-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

.cm-row.is-agent {
  align-items: flex-end;
}

.cm-row.is-visitor {
  align-items: flex-start;
}

.cm-bubble {
  max-width: 70%;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}

.is-agent .cm-bubble {
  background: #2563eb;
  color: #fff;
  border-bottom-right-radius: 3px;
}

.is-visitor .cm-bubble {
  background: #fff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 3px;
}

.cm-time {
  margin-top: 4px;
  font-size: 10px;
  color: #94a3b8;
}

.cm-empty {
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  padding: 40px 0;
}

.cm-foot {
  padding: 12px 16px;
  border-top: 1px solid var(--el-border-color-lighter, #ebeef5);
}

.cm-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
}

.cm-tip {
  font-size: 11px;
  color: #94a3b8;
}

.chat-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #94a3b8;
  font-size: 13px;
}

/* 移动端：列表与详情互斥显示 */
@media (max-width: 768px) {
  .chat-shell {
    height: calc(100vh - 170px);
    min-height: 420px;
    gap: 0;
  }

  .chat-aside {
    width: 100%;
    border-right: none;
  }

  .is-mobile-hidden {
    display: none;
  }

  .cm-back {
    display: grid;
    place-items: center;
  }

  .cm-bubble {
    max-width: 82%;
  }

  .cm-tip {
    display: none;
  }
}
</style>
