<template>
  <div class="unit-tabs-wrapper">
    <div class="unit-tabs-glass">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="switchUnit(tab.value)"
        class="unit-tab"
        :class="{ 'unit-tab-active': modelValue === tab.value }"
      >
        <span class="unit-tab-icon" v-html="tab.icon"></span>
        <span class="unit-tab-label">{{ tab.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  label: string
  value: string
  icon?: string
}

defineProps<{
  modelValue: string
  tabs?: Tab[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const defaultTabs: Tab[] = [
  {
    label: '带电清洗',
    value: 'daidianqingxi',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
  },
  {
    label: '储能',
    value: 'chuneng',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="7" width="12" height="14" rx="2"/><path d="M10 7V4h4v3"/><line x1="10" y1="14" x2="14" y2="14"/><line x1="12" y1="12" x2="12" y2="16"/></svg>'
  }
]

const tabs = computed(() => defaultTabs)

const switchUnit = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.unit-tabs-wrapper {
  padding: 16px 0;
  display: flex;
  justify-content: center;
}

.unit-tabs-glass {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  padding: 5px;
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.unit-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 26px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  white-space: nowrap;
  position: relative;
}

.unit-tab:hover {
  color: #334155;
  background: rgba(148, 163, 184, 0.1);
}

.unit-tab-active {
  color: #fff;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 3px 12px rgba(37, 99, 235, 0.3);
}

.unit-tab-active:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
}

.unit-tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.65;
  transition: opacity 0.25s ease;
}

.unit-tab-active .unit-tab-icon {
  opacity: 1;
}

.unit-tab-label {
  letter-spacing: 0.5px;
}

@media (max-width: 640px) {
  .unit-tabs-glass {
    border-radius: 11px;
    padding: 4px;
  }
  .unit-tab {
    padding: 9px 18px;
    font-size: 14px;
    gap: 6px;
    border-radius: 8px;
  }
  .unit-tab-icon :deep(svg) {
    width: 16px;
    height: 16px;
  }
}
</style>
