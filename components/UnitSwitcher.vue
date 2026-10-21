<template>
  <div ref="rootRef" class="unit-switcher-bar" :class="{ 'is-scrolled': scrolled }">
    <div class="unit-switcher-inner">
      <!-- 业务板块：分段控件，激活块滑动 -->
      <div
        class="segmented"
        role="tablist"
        aria-label="业务板块"
        @keydown="onKeydown"
      >
        <div class="seg-thumb" :class="{ 'is-ready': ready }" :style="thumbStyle" />
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          class="seg-item"
          :class="{ 'is-active': modelValue === tab.value }"
          role="tab"
          :aria-selected="modelValue === tab.value"
          :tabindex="modelValue === tab.value ? 0 : -1"
          @click="select(tab.value)"
        >
          <span v-if="tab.icon" class="seg-item-icon" v-html="tab.icon" />
          <span class="seg-item-label">{{ tab.label }}</span>
        </button>
      </div>

      <!-- 分类筛选：轻量文本 chip（仅产品等带分类的页面） -->
      <div
        v-if="categories && categories.length"
        class="cat-row"
        :class="{ 'cat-fade': fading, 'is-scrollable': scrollable }"
        role="group"
        :aria-label="categoryLabel"
      >
        <span v-if="categoryLabel" class="cat-label">{{ categoryLabel }}</span>
        <button
          v-for="cat in categories"
          :key="String(cat.value)"
          type="button"
          class="cat-chip"
          :class="{ 'is-active': cat.value === categoryValue }"
          :aria-pressed="cat.value === categoryValue"
          @click="selectCategory(cat.value)"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UnitTab {
  label: string
  value: string
  icon?: string
}

interface CategoryItem {
  label: string
  value: string | number | null
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    tabs?: UnitTab[]
    categories?: CategoryItem[] | null
    categoryValue?: string | number | null
    categoryLabel?: string
  }>(),
  {
    categories: null,
    categoryValue: null,
    categoryLabel: '分类',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:categoryValue', value: string | number | null): void
}>()

// 默认业务板块（带图标），页面可覆盖
const DEFAULT_TABS: UnitTab[] = [
  {
    label: '带电清洗',
    value: 'daidianqingxi',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  },
  {
    label: '储能',
    value: 'chuneng',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="7" width="12" height="14" rx="2"/><path d="M10 7V4h4v3"/><line x1="10" y1="14" x2="14" y2="14"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',
  },
]

const tabs = computed(() => props.tabs || DEFAULT_TABS)

// ---- 滑块定位（transform/width，符合前台动效约定） ----
const rootRef = ref<HTMLElement | null>(null)
const thumbStyle = ref<{ width?: string; transform?: string }>({})
const ready = ref(false)

const measure = () => {
  const root = rootRef.value
  if (!root) return
  const items = Array.from(root.querySelectorAll<HTMLElement>('.seg-item'))
  const idx = tabs.value.findIndex((t) => t.value === props.modelValue)
  const el = items[idx >= 0 ? idx : 0]
  if (!el) return
  thumbStyle.value = {
    width: `${el.offsetWidth}px`,
    // 轨道有 4px 内边距，滑块初始 left:4px
    transform: `translateX(${el.offsetLeft - 4}px)`,
  }
  ready.value = true
}

onMounted(() => {
  nextTick(() => {
    measure()
    updateScrollable()
    updateScrolled()
  })
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('scroll', updateScrolled, { passive: true })
  // 字体加载完成后滑块位置可能漂移，补测一次
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => measure())
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', updateScrolled)
})

const onResize = () => {
  measure()
  updateScrollable()
}

// 切换业务后重新测量滑块
watch(
  () => props.modelValue,
  () => {
    nextTick(() => measure())
    triggerFade()
  }
)

watch(
  () => props.categories,
  () => nextTick(() => updateScrollable()),
  { deep: true }
)

// ---- 交互 ----
const select = (value: string) => {
  if (value === props.modelValue) return
  emit('update:modelValue', value)
}

const selectCategory = (value: string | number | null) => {
  if (value === props.categoryValue) return
  emit('update:categoryValue', value)
}

// 方向键在业务段内循环
const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
  e.preventDefault()
  const list = tabs.value
  const idx = list.findIndex((t) => t.value === props.modelValue)
  const next = (idx + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length
  select(list[next].value)
  nextTick(() => {
    rootRef.value?.querySelectorAll<HTMLElement>('.seg-item')[next]?.focus()
  })
}

// ---- 分类行淡入（切业务时提示筛选已重置） ----
const fading = ref(false)
let fadeTimer: ReturnType<typeof setTimeout> | null = null
const triggerFade = () => {
  fading.value = false
  nextTick(() => {
    fading.value = true
    if (fadeTimer) clearTimeout(fadeTimer)
    fadeTimer = setTimeout(() => (fading.value = false), 400)
  })
}

// ---- 吸顶阴影：滚动粘住后加阴影 ----
const scrolled = ref(false)
const updateScrolled = () => {
  const el = rootRef.value
  if (!el) return
  scrolled.value = el.getBoundingClientRect().top <= 72.5
}

// ---- 移动端分类行横向滚动提示 ----
const scrollable = ref(false)
const updateScrollable = () => {
  const row = rootRef.value?.querySelector<HTMLElement>('.cat-row')
  scrollable.value = !!row && row.scrollWidth > row.clientWidth + 4
}
</script>

<style scoped>
.unit-switcher-bar {
  position: sticky;
  top: 72px;
  z-index: 40;
  background: rgba(248, 250, 252, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  transition: box-shadow 0.25s ease;
}

.unit-switcher-bar.is-scrolled {
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.unit-switcher-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 18px 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

/* ===== 分段控件 ===== */
.segmented {
  position: relative;
  display: inline-flex;
  background: #eef1f6;
  border-radius: 12px;
  padding: 4px;
}

.seg-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  height: calc(100% - 8px);
  border-radius: 9px;
  background: #0f172a;
  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.22);
  opacity: 0;
  transition:
    transform 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    width 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    opacity 0.18s ease;
  pointer-events: none;
}

.seg-thumb.is-ready {
  opacity: 1;
}

.seg-item {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  padding: 10px 26px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-radius: 9px;
  transition: color 0.22s ease;
  white-space: nowrap;
  font-family: inherit;
  line-height: 1.4;
}

.seg-item:hover {
  color: #334155;
}

.seg-item.is-active {
  color: #fff;
}

.seg-item:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.seg-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  opacity: 0.75;
  transition: opacity 0.22s ease;
}

.seg-item.is-active .seg-item-icon {
  opacity: 1;
}

/* ===== 分类 chip 行 ===== */
.cat-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.cat-label {
  flex-shrink: 0;
  margin-right: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #94a3b8;
}

.cat-chip {
  border: 1px solid transparent;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  padding: 7px 15px;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
  line-height: 1.4;
  white-space: nowrap;
  transition: color 0.2s ease, background 0.2s ease;
}

.cat-chip:hover {
  color: #2563eb;
  background: #eff6ff;
}

.cat-chip.is-active {
  color: #2563eb;
  background: #e4edff;
  font-weight: 600;
}

.cat-chip:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.cat-fade {
  animation: unitCatIn 0.34s ease backwards;
}

@keyframes unitCatIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== 移动端 ===== */
@media (max-width: 768px) {
  .unit-switcher-bar {
    top: 64px;
  }

  .unit-switcher-inner {
    padding: 14px 16px;
    gap: 12px;
    align-items: stretch;
  }

  .segmented {
    display: flex;
    width: 100%;
  }

  .seg-item {
    flex: 1;
    justify-content: center;
    min-height: 44px;
    padding: 11px 8px;
    font-size: 13px;
    gap: 6px;
  }

  .cat-row {
    flex-wrap: nowrap;
    overflow-x: auto;
    margin: 0 -16px;
    padding: 0 16px 2px;
    scrollbar-width: none;
  }

  .cat-row::-webkit-scrollbar {
    display: none;
  }

  /* 可滚动时右缘渐隐，提示还有内容 */
  .cat-row.is-scrollable {
    -webkit-mask-image: linear-gradient(90deg, #000 88%, transparent);
    mask-image: linear-gradient(90deg, #000 88%, transparent);
  }

  .cat-label {
    display: none;
  }

  .cat-chip {
    min-height: 44px;
    padding: 10px 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .seg-item {
    font-size: 12.5px;
    padding: 11px 6px;
  }
}

/* ===== 无障碍：减少动效 ===== */
@media (prefers-reduced-motion: reduce) {
  .seg-thumb {
    transition: none;
  }
  .cat-fade {
    animation: none;
  }
}
</style>
