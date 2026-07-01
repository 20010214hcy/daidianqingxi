<template>
  <section class="page-header">
    <div class="page-header-content">
      <h1 class="page-header-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header-subtitle">{{ subtitle }}</p>
      <div v-if="$slots.breadcrumb" class="page-header-breadcrumb">
        <slot name="breadcrumb" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
}

defineProps<Props>();
</script>

<style scoped>
.page-header {
  background: linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a);
  color: #ffffff;
  padding: 5rem 0;
  text-align: center;
}

.page-header-content {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.page-header-subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 42rem;
  margin: 0 auto;
  line-height: 1.75;
}

.page-header-breadcrumb {
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .page-header {
    padding: 3rem 0;
  }

  .page-header-title {
    font-size: 1.875rem;
  }

  .page-header-subtitle {
    font-size: 1rem;
  }
}
</style>
