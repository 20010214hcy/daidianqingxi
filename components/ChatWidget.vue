<template>
  <Teleport to="body">
    <Transition name="cw-fade">
      <section v-if="open" ref="panelEl" class="chat-widget" role="dialog" aria-label="在线客服">
        <header class="cw-head">
          <div class="cw-id">
            <span class="cw-avatar" aria-hidden="true">玺</span>
            <div class="cw-id-text">
              <p class="cw-name">玺铭电力 · 在线客服</p>
              <p class="cw-status"><i class="cw-dot" aria-hidden="true" />{{ statusText }}</p>
            </div>
          </div>
          <button type="button" class="cw-close" aria-label="关闭聊天窗口" @click="closeChat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div ref="listEl" class="cw-body" aria-live="polite">
          <div class="cw-welcome">
            <p class="cw-welcome-title">您好，欢迎咨询河南玺铭电力</p>
            <p class="cw-welcome-text">
              请简要说明您的需求（设备类型、电压等级、项目地点），客服会尽快回复您。
            </p>
          </div>

          <div
            v-for="m in messages"
            :key="m.id"
            class="cw-row"
            :class="m.sender === 'visitor' ? 'is-me' : 'is-agent'"
          >
            <div class="cw-bubble">{{ m.content }}</div>
            <p class="cw-time">{{ formatTime(m.createdAt) }}</p>
          </div>

          <p v-if="errorText" class="cw-error">{{ errorText }}</p>
        </div>

        <form v-if="!phone" class="cw-capture" @submit.prevent="savePhone">
          <input
            v-model="phoneInput"
            type="tel"
            inputmode="numeric"
            maxlength="11"
            placeholder="留个手机号，方便电话沟通（选填）"
            aria-label="手机号"
          />
          <button type="submit" :disabled="!phoneInput || phoneSaving">
            {{ phoneSaving ? '保存中' : '保存' }}
          </button>
        </form>

        <footer class="cw-foot">
          <textarea
            v-model="draft"
            rows="2"
            maxlength="1000"
            placeholder="输入您的问题，回车发送…"
            aria-label="消息内容"
            @keydown.enter.exact.prevent="send"
          />
          <button
            type="button"
            class="cw-send"
            :disabled="!draft.trim() || sending"
            @click="send"
          >
            {{ sending ? '发送中' : '发送' }}
          </button>
        </footer>

        <p class="cw-hours">工作时间 8:30-17:30，非工作时间可留言，客服上线后回复</p>
      </section>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface ChatMessage {
  id: number
  sessionId?: number
  sender: 'visitor' | 'admin' | 'system'
  senderName?: string | null
  content: string
  createdAt: string
}

const { open, unread, closeChat } = useChat()

const route = useRoute()
const messages = ref<ChatMessage[]>([])
const draft = ref('')
const sending = ref(false)
const errorText = ref('')
const phoneInput = ref('')
const phoneSaving = ref(false)
const phone = ref('')
const sessionId = ref(0)
const sessionStatus = ref('open')

const listEl = ref<HTMLElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)

const VISITOR_KEY = 'xm_visitor_id'
const POLL_OPEN_MS = 3000
const POLL_IDLE_MS = 20000

let pollTimer: ReturnType<typeof setInterval> | null = null
let idleTimer: ReturnType<typeof setInterval> | null = null
let visitorId = ''

/** 浏览器端生成并持久化访客标识 */
function getVisitorId(): string {
  if (visitorId) return visitorId
  let id = ''
  try {
    id = localStorage.getItem(VISITOR_KEY) || ''
  } catch {
    /* 隐私模式下 localStorage 不可用，退化为内存标识 */
  }
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(id)) {
    const rand = () => Math.random().toString(36).slice(2)
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().replace(/-/g, '')
        : `${Date.now().toString(36)}${rand()}${rand()}`
    try {
      localStorage.setItem(VISITOR_KEY, id)
    } catch {
      /* 忽略写入失败 */
    }
  }
  visitorId = id
  return id
}

const statusText = computed(() =>
  sessionStatus.value === 'closed' ? '会话已结束，可继续留言' : '在线为您服务'
)

const formatTime = (value: string) => {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const scrollToBottom = () => {
  nextTick(() => {
    if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight
  })
}

/** 合并新消息：按 id 去重（乐观渲染的临时消息 id 为负） */
function mergeMessages(incoming: ChatMessage[]) {
  if (!incoming.length) return
  const byId = new Map<number, ChatMessage>()
  for (const m of messages.value) byId.set(m.id, m)
  for (const m of incoming) {
    if (m.id < 0) continue
    // 用真实消息替换本地临时消息（内容相同）
    const temp = [...byId.values()].find((x) => x.id < 0 && x.content === m.content && x.sender === m.sender)
    if (temp) byId.delete(temp.id)
    byId.set(m.id, m)
  }
  messages.value = [...byId.values()].sort((a, b) => a.id - b.id)
  scrollToBottom()
}

const lastId = computed(() => {
  const ids = messages.value.filter((m) => m.id > 0).map((m) => m.id)
  return ids.length ? Math.max(...ids) : 0
})

async function ensureSession(lookupOnly = false) {
  if (!import.meta.client) return
  try {
    const res: any = await $fetch('/api/chat/session', {
      method: 'POST',
      body: {
        visitorId: getVisitorId(),
        pageUrl: route.fullPath,
        referrer: document.referrer || '',
        // lookup 模式：只恢复已有会话，服务端绝不创建
        // （访客仅点开聊天窗/浏览页面时不产生会话，不发消息就不打扰后台）
        ...(lookupOnly ? { lookup: true } : {}),
      },
    })
    if (res?.success && res.data) {
      sessionId.value = res.data.sessionId
      sessionStatus.value = res.data.status || 'open'
      phone.value = res.data.phone || ''
      messages.value = res.data.messages || []
      scrollToBottom()
    }
  } catch {
    errorText.value = '连接客服失败，请刷新页面重试'
  }
}

async function poll() {
  if (!sessionId.value) return
  try {
    const res: any = await $fetch('/api/chat/messages', {
      query: { visitorId: getVisitorId(), after: lastId.value },
    })
    if (res?.success && res.data) {
      sessionStatus.value = res.data.status || 'open'
      const incoming: ChatMessage[] = res.data.messages || []
      if (incoming.length) {
        if (!open.value) {
          unread.value = incoming.filter((m) => m.sender === 'admin').length
        }
        mergeMessages(incoming)
      }
    }
  } catch {
    /* 网络抖动忽略，下次轮询重试 */
  }
}

async function send() {
  const content = draft.value.trim()
  if (!content || sending.value) return
  if (!sessionId.value) await ensureSession()
  if (!sessionId.value) return

  sending.value = true
  errorText.value = ''
  const tempId = -Date.now()
  messages.value.push({
    id: tempId,
    sender: 'visitor',
    content,
    createdAt: new Date().toISOString(),
  })
  draft.value = ''
  scrollToBottom()

  try {
    const res: any = await $fetch('/api/chat/message', {
      method: 'POST',
      body: { visitorId: getVisitorId(), content },
    })
    if (res?.success && res.data) {
      mergeMessages([res.data])
    } else {
      errorText.value = res?.message || '发送失败，请重试'
    }
  } catch {
    errorText.value = '网络异常，消息未发送成功'
  } finally {
    sending.value = false
  }
}

async function savePhone() {
  const value = phoneInput.value.replace(/\s|-/g, '')
  if (!/^1[3-9]\d{9}$/.test(value)) {
    errorText.value = '请填写正确的 11 位手机号'
    return
  }
  phoneSaving.value = true
  errorText.value = ''
  try {
    const res: any = await $fetch('/api/chat/session', {
      method: 'POST',
      body: { visitorId: getVisitorId(), phone: value, pageUrl: route.fullPath },
    })
    if (res?.success) {
      phone.value = value
      phoneInput.value = ''
    } else {
      errorText.value = res?.message || '保存失败'
    }
  } catch {
    errorText.value = '网络异常，保存失败'
  } finally {
    phoneSaving.value = false
  }
}

function startPolling() {
  stopPolling()
  pollTimer = setInterval(poll, POLL_OPEN_MS)
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

function startIdlePolling() {
  if (idleTimer) return
  idleTimer = setInterval(() => {
    if (!sessionId.value) return
    if (open.value) return
    poll()
  }, POLL_IDLE_MS)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) closeChat()
}

onMounted(async () => {
  getVisitorId()
  window.addEventListener('keydown', onKeydown)
  // 页面加载后静默恢复已有会话（只查不建），便于在悬浮入口上显示未读
  await ensureSession(true)
  startIdlePolling()
})

onUnmounted(() => {
  stopPolling()
  if (idleTimer) clearInterval(idleTimer)
  window.removeEventListener('keydown', onKeydown)
})

watch(open, async (isOpen) => {
  if (isOpen) {
    unread.value = 0
    // 点开聊天窗只恢复已有会话；首次发消息时才会真正创建
    await ensureSession(true)
    await poll()
    startPolling()
    scrollToBottom()
  } else {
    stopPolling()
  }
})
</script>

<style scoped>
.chat-widget {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 70;
  width: 364px;
  max-height: 560px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
  overflow: hidden;
}

.cw-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: #2563eb;
  color: #fff;
}

.cw-id {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.cw-avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  font-size: 15px;
  font-weight: 700;
}

.cw-id-text {
  min-width: 0;
}

.cw-name {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
}

.cw-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.82);
  margin-top: 2px;
}

.cw-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
}

.cw-close {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: background 0.2s ease;
}

.cw-close:hover {
  background: rgba(255, 255, 255, 0.16);
}

.cw-close svg {
  width: 16px;
  height: 16px;
}

.cw-body {
  flex: 1;
  min-height: 180px;
  overflow-y: auto;
  padding: 14px 16px;
  background: #f8fafc;
}

.cw-welcome {
  padding: 12px 14px;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  margin-bottom: 14px;
}

.cw-welcome-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e40af;
}

.cw-welcome-text {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.6;
  color: #475569;
}

.cw-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.cw-row.is-me {
  align-items: flex-end;
}

.cw-row.is-agent {
  align-items: flex-start;
}

.cw-bubble {
  max-width: 82%;
  padding: 9px 12px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.is-me .cw-bubble {
  background: #2563eb;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.is-agent .cw-bubble {
  background: #fff;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}

.cw-time {
  margin-top: 4px;
  font-size: 10px;
  color: #94a3b8;
}

.cw-error {
  font-size: 12px;
  color: #dc2626;
  text-align: center;
  margin: 6px 0;
}

.cw-capture {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}

.cw-capture input {
  flex: 1;
  min-width: 0;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 12px;
  color: #1e293b;
  outline: none;
}

.cw-capture input:focus {
  border-color: #93c5fd;
}

.cw-capture button {
  height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: 8px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.cw-capture button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cw-foot {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}

.cw-foot textarea {
  flex: 1;
  min-width: 0;
  resize: none;
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.5;
  color: #1e293b;
  font-family: inherit;
  outline: none;
}

.cw-foot textarea:focus {
  border-color: #93c5fd;
}

.cw-send {
  height: 38px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cw-send:hover:not(:disabled) {
  background: #1d4ed8;
}

.cw-send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.cw-hours {
  padding: 0 12px 10px;
  font-size: 10px;
  color: #94a3b8;
  text-align: center;
  background: #fff;
}

/* 移动端：贴着底部栏上方，占满宽度 */
@media (max-width: 768px) {
  .chat-widget {
    right: 8px;
    left: 8px;
    bottom: calc(72px + env(safe-area-inset-bottom, 0px));
    width: auto;
    max-height: 72vh;
  }
}

/* 入场/退场：只动 transform 与 opacity */
.cw-fade-enter-active,
.cw-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.cw-fade-enter-from,
.cw-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
