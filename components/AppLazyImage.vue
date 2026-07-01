<template>
  <div class="lazy-image-wrapper" :class="{ 'is-loaded': isLoaded }">
    <!-- 占位符 -->
    <div v-if="!isVisible" class="lazy-placeholder" :style="placeholderStyle">
      <slot name="placeholder">
        <div class="lazy-spinner"></div>
      </slot>
    </div>

    <!-- 实际图片 -->
    <img
      v-else
      ref="imageRef"
      :src="src"
      :alt="alt"
      :class="imgClass"
      :style="imgStyle"
      @load="onLoad"
      @error="onError"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string;
  alt?: string;
  imgClass?: string;
  imgStyle?: Record<string, string>;
  aspectRatio?: string;
  placeholderColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  aspectRatio: '16/9',
  placeholderColor: '#f1f5f9'
});

const imageRef = ref<HTMLImageElement | null>(null);
const isLoaded = ref(false);
const isError = ref(false);
const isVisible = ref(false);

let observer: IntersectionObserver | null = null;

const placeholderStyle = computed(() => ({
  aspectRatio: props.aspectRatio,
  backgroundColor: props.placeholderColor
}));

onMounted(() => {
  // 使用 IntersectionObserver 实现懒加载
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer?.disconnect();
      }
    },
    {
      rootMargin: '100px',
      threshold: 0.01
    }
  );

  // 观察父元素
  const el = imageRef.value?.parentElement;
  if (el) {
    observer.observe(el);
  }
});

onUnmounted(() => {
  observer?.disconnect();
});

const onLoad = () => {
  isLoaded.value = true;
};

const onError = () => {
  isError.value = true;
};
</script>

<style scoped>
.lazy-image-wrapper {
  position: relative;
  overflow: hidden;
  background: v-bind('props.placeholderColor');
}

.lazy-placeholder {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.lazy-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.lazy-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy-image-wrapper.is-loaded img {
  opacity: 1;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
