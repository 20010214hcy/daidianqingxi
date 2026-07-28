<template>
  <div class="unit-tabs-wrapper">
    <div class="flex items-center justify-center gap-3">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="switchUnit(tab.value)"
        class="unit-tab"
        :class="{ 'unit-tab-active': modelValue === tab.value }"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  label: string
  value: string
}

defineProps<{
  modelValue: string
  tabs?: Tab[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const defaultTabs: Tab[] = [
  { label: '带电清洗', value: 'daidianqingxi' },
  { label: '储能', value: 'chuneng' }
]

const tabs = computed(() => defaultTabs)

const switchUnit = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.unit-tabs-wrapper {
  padding: 16px 0;
}

.unit-tab {
  padding: 10px 28px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid transparent;
}

.unit-tab:hover {
  background: #e2e8f0;
  color: #334155;
}

.unit-tab-active {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.unit-tab-active:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
}

@media (max-width: 640px) {
  .unit-tab {
    padding: 8px 20px;
    font-size: 14px;
  }
}
</style>
