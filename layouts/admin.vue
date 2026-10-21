<template>
  <div class="admin-layout">
    <!-- 侧边栏遮罩层（移动端） -->
    <Transition name="fade">
      <div
        v-if="isMobile && !sidebarCollapsed"
        class="sidebar-overlay"
        @click="sidebarCollapsed = true"
      />
    </Transition>

    <!-- 侧边栏 -->
    <aside
      class="admin-sidebar"
      :class="{
        'sidebar-expanded': !sidebarCollapsed,
        'sidebar-collapsed': sidebarCollapsed,
        'sidebar-mobile-open': isMobile && !sidebarCollapsed,
      }"
    >
      <!-- Logo区 -->
      <div class="sidebar-header">
        <div class="sidebar-logo" @click="router.push('/admin')">
          <div class="sidebar-logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 24L16 8L24 24" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 20H20" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <Transition name="slide-fade">
            <div v-if="!sidebarCollapsed" class="sidebar-logo-text">
              <span class="sidebar-title">玺铭电力</span>
              <span class="sidebar-subtitle">管理后台</span>
            </div>
          </Transition>
        </div>
      </div>

      <!-- 菜单区 -->
      <nav class="sidebar-nav">
        <el-menu
          :default-active="activeMenu"
          :collapse="sidebarCollapsed"
          :ellipsis="false"
          router
          class="sidebar-menu"
        >
          <template v-for="group in menuGroups" :key="group.title">
            <!-- 单个菜单项直接显示 -->
            <el-menu-item
              v-if="group.items.length === 1"
              :index="group.items[0].path"
            >
              <el-icon><component :is="group.items[0].icon" /></el-icon>
              <span>{{ group.items[0].title }}</span>
            </el-menu-item>
            <!-- 多个菜单项使用子菜单 -->
            <el-sub-menu v-else :index="group.title">
              <template #title>
                <el-icon><component :is="group.icon" /></el-icon>
                <span>{{ group.title }}</span>
              </template>
              <el-menu-item
                v-for="item in group.items"
                :key="item.path"
                :index="item.path"
              >
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.title }}</span>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </nav>

      <!-- 底部用户信息 -->
      <div class="sidebar-footer">
        <div class="sidebar-user" @click="router.push('/admin/profile')">
          <div class="sidebar-user-avatar">
            <img
              v-if="user?.avatar"
              :src="user.avatar"
              class="avatar-img"
            />
            <span v-else class="avatar-text">{{ (user?.name?.[0] || user?.username?.[0] || '管').toUpperCase() }}</span>
          </div>
          <Transition name="slide-fade">
            <div v-if="!sidebarCollapsed" class="sidebar-user-info">
              <span class="sidebar-user-name">{{ user?.name || user?.username || '管理员' }}</span>
              <span class="sidebar-user-role">{{ roleName }}</span>
            </div>
          </Transition>
        </div>
        <button class="logout-btn" @click="handleLogout" :title="sidebarCollapsed ? '退出登录' : ''">
          <el-icon><SwitchButton /></el-icon>
          <Transition name="slide-fade">
            <span v-if="!sidebarCollapsed" class="logout-text">退出</span>
          </Transition>
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="admin-main">
      <!-- 顶部导航 -->
      <header class="admin-header">
        <div class="header-left">
          <!-- 折叠按钮 -->
          <button class="collapse-btn" @click="toggleSidebar" :title="sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'">
            <el-icon :size="20">
              <Fold v-if="!sidebarCollapsed" />
              <Expand v-else />
            </el-icon>
          </button>

          <!-- 面包屑 -->
          <el-breadcrumb separator="/" class="header-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentGroup && currentGroup !== '仪表盘'">{{ currentGroup }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <!-- 搜索 -->
          <div class="header-search" :class="{ 'search-expanded': searchExpanded }">
            <el-input
              v-model="searchQuery"
              placeholder="搜索功能..."
              :prefix-icon="Search"
              @focus="searchExpanded = true"
              @blur="handleSearchBlur"
              clearable
            />
          </div>

          <!-- 刷新按钮 -->
          <button class="header-action-btn" @click="refreshPage" title="刷新页面">
            <el-icon :size="18"><Refresh /></el-icon>
          </button>

          <!-- 全屏按钮 -->
          <button class="header-action-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏'">
            <el-icon :size="18">
              <FullScreen v-if="!isFullscreen" />
              <Aim v-else />
            </el-icon>
          </button>

          <!-- 用户头像 -->
          <el-dropdown trigger="click" @command="handleUserCommand" @visible-change="onUserDropdownVisible">
            <div class="header-user" :class="{ 'is-open': userDropdownOpen }">
              <div class="header-avatar">
                <img
                  v-if="user?.avatar"
                  :src="user.avatar"
                  class="avatar-img"
                />
                <span v-else class="avatar-text">{{ (user?.name?.[0] || user?.username?.[0] || '管').toUpperCase() }}</span>
              </div>
              <span class="header-username">{{ user?.name || user?.username || '管理员' }}</span>
              <el-icon class="header-user-arrow"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人资料
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  网站设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { House, Document, Suitcase, Reading, ChatDotRound, Monitor, Trophy, Star, Message, Lock, Setting, User, Goods, Medal, Phone, Fold, Expand, Search, Refresh, FullScreen, Aim, ArrowDown, SwitchButton, UserFilled, Picture, Grid } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const { user, logout, initAuth } = useAuth()
const { can, isSuperAdmin, roleName } = usePermission()

const sidebarCollapsed = ref(false)
const isMobile = ref(false)
const userDropdownOpen = ref(false)

const onUserDropdownVisible = (visible: boolean) => {
  userDropdownOpen.value = visible
}
const searchQuery = ref('')
const searchExpanded = ref(false)
const isFullscreen = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
}

const handleSearchBlur = () => {
  searchExpanded.value = false
  searchQuery.value = ''
}

const refreshPage = () => {
  window.location.reload()
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/admin/profile')
      break
    case 'settings':
      router.push('/admin/settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

onMounted(() => {
  if (!user.value) {
    initAuth()
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 菜单配置（含权限模块标识）
const allMenuGroups = [
  // 仪表盘：一级直达
  {
    title: '仪表盘',
    icon: Monitor,
    permission: 'dashboard' as const,
    items: [
      { path: '/admin', title: '仪表盘', icon: Monitor, permission: 'dashboard' as const }
    ]
  },
  // 内容运营
  {
    title: '内容',
    icon: Reading,
    permission: 'articles' as const,
    items: [
      { path: '/admin/articles', title: '新闻文章', icon: Document, permission: 'articles' as const },
      { path: '/admin/media', title: '媒体资源', icon: Picture, permission: 'articles' as const },
      { path: '/admin/certificates', title: '资质证书', icon: Medal, permission: 'certificates' as const }
    ]
  },
  // 业务展示
  {
    title: '业务',
    icon: Goods,
    permission: 'products' as const,
    items: [
      { path: '/admin/products', title: '产品列表', icon: Goods, permission: 'products' as const },
      { path: '/admin/categories', title: '分类管理', icon: Grid, permission: 'categories' as const },
      { path: '/admin/services', title: '服务项目', icon: Suitcase, permission: 'services' as const },
      { path: '/admin/cases', title: '工程案例', icon: Trophy, permission: 'cases' as const }
    ]
  },
  // 客户线索
  {
    title: '客户',
    icon: Message,
    permission: 'messages' as const,
    items: [
      { path: '/admin/messages', title: '留言管理', icon: Message, permission: 'messages' as const },
      { path: '/admin/contact', title: '联系信息', icon: Phone, permission: 'contact' as const }
    ]
  },
  // 系统
  {
    title: '系统',
    icon: Setting,
    permission: 'settings' as const,
    items: [
      { path: '/admin/settings', title: '网站设置', icon: Setting, permission: 'settings' as const },
      { path: '/admin/users', title: '用户管理', icon: UserFilled, permission: 'users' as const },
      { path: '/admin/profile', title: '个人资料', icon: User, permission: 'profile' as const }
    ]
  }
]

// 根据权限过滤菜单
const menuGroups = computed(() => {
  return allMenuGroups
    .filter(group => can(group.permission))
    .map(group => ({
      ...group,
      items: group.items.filter(item => can(item.permission))
    }))
    .filter(group => group.items.length > 0)
})

const activeMenu = computed(() => route.path)

const currentGroup = computed(() => {
  let group = ''
  menuGroups.value.forEach(g => {
    g.items.forEach(item => {
      if (item.path === route.path) {
        group = g.title
      }
    })
  })
  return group
})

const pageTitle = computed(() => {
  let title = '后台管理'
  menuGroups.value.forEach(group => {
    group.items.forEach(item => {
      if (item.path === route.path) {
        title = item.title
      }
    })
  })
  return title
})

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style>
/* 导入后台管理专用 CSS 变量 */
@import '~/assets/css/admin-variables.css';
/* 导入移动端优化样式 */
@import '~/assets/css/admin-mobile.css';
</style>

<style scoped>
/* ===== 过渡动画 ===== */
/* 遮罩淡入淡出与侧边栏滑入同节奏 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--admin-sidebar-motion) var(--admin-sidebar-ease);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 侧边栏内的说明文字（logo 文案 / 用户信息 / 退出按钮）：
 * 离场要快（在面板收拢到一半前就消失），入场带延迟（等面板张开一点再出现），
 * 与菜单文字的节奏保持一致 —— 旧版入场 250ms、离场 150ms，和面板 300ms 对不齐。 */
.slide-fade-enter-active {
  transition: opacity var(--admin-sidebar-fade-in) linear var(--admin-sidebar-fade-in-delay),
    transform var(--admin-sidebar-fade-in) var(--admin-sidebar-ease) var(--admin-sidebar-fade-in-delay);
}
.slide-fade-leave-active {
  transition: opacity var(--admin-sidebar-fade-out) linear,
    transform var(--admin-sidebar-fade-out) var(--admin-sidebar-ease);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* ===== 根布局 ===== */
.admin-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: var(--admin-font-family);
}

/* ===== 侧边栏遮罩 ===== */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 900;
}

/* ===== 侧边栏 ===== */
.admin-sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: var(--admin-sidebar-width);
  background: var(--admin-bg-sidebar);
  overflow: hidden;
  z-index: 950;
  /* 面板宽度过渡用统一令牌；「自然感」的关键不在这一条，
   * 而在下面的菜单内容是否跟着面板一起动（见折叠态样式块） */
  transition: width var(--admin-sidebar-motion) var(--admin-sidebar-ease);
}

.sidebar-collapsed {
  width: var(--admin-sidebar-collapsed-width);
}

/* 只关掉菜单根节点自己的过渡（宽度由外层 aside 驱动）。
 * 旧版在这里对 .el-menu-item 也写了 transition:none !important，
 * 结果把折叠态下我们自己声明的所有过渡一并杀掉 —— 这是「内容瞬间消失」的根源之一。 */
.admin-sidebar .el-menu--collapse {
  transition: none !important;
}

/* ===== 侧边栏头部 ===== */
.sidebar-header {
  display: flex;
  align-items: center;
  height: var(--admin-header-height);
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  overflow: hidden;
}

.sidebar-logo-icon {
  width: 40px;
  height: 40px;
  background: var(--admin-primary-gradient);
  border-radius: var(--admin-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: transform var(--admin-transition-normal);
}

.sidebar-logo:hover .sidebar-logo-icon {
  transform: scale(1.05);
}

.sidebar-logo-icon svg {
  width: 24px;
  height: 24px;
}

.sidebar-logo-text {
  display: flex;
  flex-direction: column;
  white-space: nowrap;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--admin-text-white);
  line-height: 1.2;
}

.sidebar-subtitle {
  font-size: 12px;
  color: var(--admin-text-white-muted);
  font-weight: 400;
}

/* ===== 侧边栏菜单区 ===== */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 0;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.sidebar-menu {
  border-right: none !important;
}

.sidebar-menu.el-menu--collapse {
  width: var(--admin-sidebar-collapsed-width);
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 100%;
}

/* ===== 菜单文字的展开方向入场 =====
 * EP 的折叠切换是「卸旧挂新」（out-in 换元素），新挂载元素上的 transition
 * 不会播放，所以这里用 animation 入场：延迟期间保持透明（backwards），
 * 等面板先张开一段、边缘扫过文字位置之后，文字才淡入，不会被裁着出现。 */
@keyframes adminLabelIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

.sidebar-menu:not(.el-menu--collapse):not(.horizontal-collapse-transition) .el-menu-item > span,
.sidebar-menu:not(.el-menu--collapse):not(.horizontal-collapse-transition) .el-sub-menu__title > span:not(.el-icon) {
  animation: adminLabelIn var(--admin-sidebar-fade-in) linear var(--admin-sidebar-fade-in-delay) backwards;
}

/* 展开箭头与文字同节奏淡入：否则新菜单挂载时箭头会先在窄面板里露出来 */
.sidebar-menu:not(.el-menu--collapse):not(.horizontal-collapse-transition) .el-sub-menu__icon-arrow {
  animation: adminLabelIn var(--admin-sidebar-fade-in) linear var(--admin-sidebar-fade-in-delay) backwards;
}
/* 排除 .horizontal-collapse-transition 的原因：EP 在测量目标宽度时会给旧菜单
 * 短暂加/摘 el-menu--collapse 类，这会让上面的 animation 在旧菜单上重新触发
 * （delay 期间 opacity=0），旧内容的淡出就得交给 .horizontal-collapse-transition
 * 上的菜单级 opacity 过渡（见 admin-variables.css），两者各管一段互不打架。 */

/* ===== 侧边栏底部 ===== */
.sidebar-footer {
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: var(--admin-radius-md);
  transition: background var(--admin-transition-fast);
  overflow: hidden;
  flex: 1;
  min-width: 0;
}

.sidebar-user:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--admin-primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.sidebar-user-avatar .avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-user-avatar .avatar-text {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.sidebar-user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar-user-name {
  color: var(--admin-text-white);
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-user-role {
  color: var(--admin-text-white-muted);
  font-size: 12px;
  white-space: nowrap;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--admin-text-white-muted);
  cursor: pointer;
  border-radius: var(--admin-radius-md);
  transition: background-color var(--admin-transition-fast), color var(--admin-transition-fast);
  flex-shrink: 0;
  white-space: nowrap;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.logout-text {
  font-size: 13px;
}

/* ===== 主内容区 ===== */
.admin-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  background: var(--admin-bg-page);
}

/* ===== 顶部导航栏 ===== */
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--admin-header-height);
  padding: 0 24px;
  background: var(--admin-bg-card);
  border-bottom: 1px solid var(--admin-border-light);
  flex-shrink: 0;
  min-width: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--admin-space-4);
  min-width: 0;
  overflow: hidden;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--admin-radius-md);
  background: transparent;
  color: var(--admin-text-muted);
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color var(--admin-transition-fast), color var(--admin-transition-fast);
}

.collapse-btn:hover {
  background: var(--admin-bg-hover);
  color: var(--admin-primary);
}

.header-breadcrumb {
  white-space: nowrap;
}

.header-breadcrumb :deep(.el-breadcrumb__inner) {
  color: var(--admin-text-muted);
  font-size: 14px;
}

.header-breadcrumb :deep(.el-breadcrumb__inner.is-link:hover) {
  color: var(--admin-primary);
}

.header-breadcrumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--admin-text-primary);
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.header-search {
  width: 200px;
  transition: width var(--admin-transition-normal);
}

.header-search.search-expanded {
  width: 280px;
}

.header-search :deep(.el-input__wrapper) {
  background: var(--admin-bg-page);
  border-radius: var(--admin-radius-full);
  box-shadow: none;
  padding-left: 12px;
}

.header-search :deep(.el-input__wrapper:hover),
.header-search :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--admin-primary) inset;
}

.header-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--admin-radius-md);
  background: transparent;
  color: var(--admin-text-muted);
  cursor: pointer;
  transition: background-color var(--admin-transition-fast), color var(--admin-transition-fast);
}

.header-action-btn:hover {
  background: var(--admin-bg-hover);
  color: var(--admin-primary);
}

.header-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border-radius: var(--admin-radius-full);
  cursor: pointer;
  transition: background var(--admin-transition-fast);
}

.header-user:hover {
  background: var(--admin-bg-hover);
}

.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--admin-primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.header-avatar .avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-avatar .avatar-text {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.header-username {
  color: var(--admin-text-secondary);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.header-user-arrow {
  color: var(--admin-text-muted);
  font-size: 12px;
  transition: transform var(--admin-transition-fast);
}

/* 箭头跟随下拉菜单的开合状态，而不是 hover —— 下拉是 click 触发的，
 * hover 翻转会让人误以为鼠标划过就展开了 */
.header-user.is-open .header-user-arrow {
  transform: rotate(180deg);
}

/* ===== 内容区 ===== */
.admin-content {
  flex: 1;
  overflow: auto;
  min-width: 0;
}

.admin-content::-webkit-scrollbar {
  width: 8px;
}

.admin-content::-webkit-scrollbar-track {
  background: transparent;
}

.admin-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.admin-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* ===== 折叠状态样式修复 ===== */
.sidebar-collapsed .sidebar-header {
  padding: 0;
  justify-content: center;
  height: 64px;
}

.sidebar-collapsed .sidebar-logo {
  justify-content: center;
  gap: 0;
  width: 100%;
}

.sidebar-collapsed .sidebar-logo-icon {
  margin: 0;
  width: 40px;
  height: 40px;
}

.sidebar-collapsed .sidebar-nav {
  padding: 12px 0;
}

/* 菜单容器 */
.sidebar-collapsed .sidebar-menu.el-menu--collapse {
  width: 100% !important;
  border: none !important;
}

/* ===== 折叠态：让「内容跟着面板一起动」，而不是面板在动、内容瞬间变样 =====
 *
 * 旧版做法是折叠瞬间把文字 display:none、图标绝对定位跳到导轨中心、
 * 行内边距/外边距换成另一套 —— 内容在第一帧就变成收起态的样子，
 * 然后面板再用 300ms 慢慢合拢，于是看到的是「文字被拦腰裁断 + 图标瞬移」。
 *
 * 现在的原则：折叠态的**流内几何与展开态完全一致**（同样的 12px 外边距、
 * 20px 内边距、图标在文字前占位），变化只有三个可过渡的量：
 *   1. 面板宽度（.admin-sidebar 的 width 过渡）
 *   2. 文字/箭头透明度（淡出快于面板收拢，边缘扫到前就已透明）
 *   3. 图标 8px 的 transform 平移（补齐到导轨中心，合成层平滑过渡）
 */

/* 菜单项：外边距/内边距与展开态一致（全局规则已是 4px 12px + EP 的 0 20px），
 * 这里只保留高度，不再覆盖 margin/padding/display */
.sidebar-collapsed .el-menu--collapse > .el-menu-item {
  height: 44px !important;
  line-height: 44px !important;
}

/* 有子菜单的一级菜单标题：同样保持流内几何，只把 48px 收成 44px（带过渡） */
.sidebar-collapsed .el-menu--collapse > .el-sub-menu > .el-sub-menu__title {
  height: 44px !important;
  line-height: 44px !important;
  transition: background-color var(--admin-transition-normal),
    color var(--admin-transition-normal),
    box-shadow var(--admin-transition-normal),
    height var(--admin-sidebar-motion) var(--admin-sidebar-ease),
    line-height var(--admin-sidebar-motion) var(--admin-sidebar-ease);
}

/* 图标：保持展开态的流内位置不动，仅用 transform 平移 8px 补齐到导轨中心
 * （导轨中心 = 72/2 = 36px；流内中心 = 12 外边距 + 20 内边距 + 12 半个图标 = 44px）
 * 并恢复 EP 折叠态拿掉的 5px 右间距，保证文字的 x 与展开态逐像素一致 */
.sidebar-collapsed .el-menu--collapse > .el-menu-item .el-icon,
.sidebar-collapsed .el-menu--collapse > .el-sub-menu > .el-sub-menu__title > .el-icon {
  margin: 0 5px 0 0 !important;
  width: 24px !important;
  height: 24px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  transform: translateX(-8px);
  transition: transform var(--admin-sidebar-motion) var(--admin-sidebar-ease);
}

/* 文字：不再 display:none（瞬间消失），改为原地淡出 + 由面板边缘裁掉。
 * 必须覆盖 EP 折叠态自带的 visibility:hidden / width:0 —— 那两个都是瞬间的，
 * 是「文字凭空消失」的直接原因；visibility 用延迟过渡，等淡出播完再生效（无障碍）。 */
.sidebar-collapsed .el-menu--collapse .el-menu-item span,
.sidebar-collapsed .el-menu--collapse > .el-sub-menu > .el-sub-menu__title > span:not(.el-icon) {
  visibility: hidden !important;
  width: auto !important;
  height: auto !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  flex: none !important;
  opacity: 0 !important;
  transition: opacity var(--admin-sidebar-fade-out) linear,
    visibility 0s linear var(--admin-sidebar-fade-out);
}

/* 展开箭头：同样原地淡出（EP 折叠态是 display:none，会瞬间消失）。
 * 箭头是 right:20px 的绝对定位，面板收拢时它会贴着边缘一起滑进来，配合淡出很自然。 */
.sidebar-collapsed .el-menu--collapse .el-sub-menu__icon-arrow,
.sidebar-collapsed .el-menu--collapse .el-sub-menu__caret {
  display: block !important;
  width: auto !important;
  height: auto !important;
  overflow: visible !important;
  opacity: 0 !important;
  visibility: hidden !important;
  transition: opacity var(--admin-sidebar-fade-out) linear,
    visibility 0s linear var(--admin-sidebar-fade-out);
}

.sidebar-collapsed .sidebar-footer {
  padding: 12px 16px;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.sidebar-collapsed .sidebar-user {
  justify-content: center;
  padding: 8px;
  gap: 0;
  width: 100%;
}

.sidebar-collapsed .sidebar-user-info {
  display: none !important;
}

.sidebar-collapsed .logout-btn {
  padding: 8px;
  justify-content: center;
  width: 100%;
}

.sidebar-collapsed .logout-text {
  display: none !important;
}

/* ===== 移动端侧边栏 =====
 * 这里原本还有一份 .sidebar-mobile-open / @media(max-width:1023px) / @media(640px)
 * 的规则，与 assets/css/admin-mobile.css 完全重复。因为本文件是 <style scoped>，
 * 同名选择器会被加上 [data-v-xxx] 而优先级更高，反而把 admin-mobile.css 里
 * 带 !important 的 width/transform 规则压掉，导致两侧动画对不齐。
 * 现在只保留 admin-mobile.css 一处定义，删掉这里的副本。 */
</style>
