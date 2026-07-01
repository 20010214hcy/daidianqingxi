/**
 * 交错入场动画 composable
 * 基于 IntersectionObserver，卡片进入视口时依次淡入上移
 */
export function useStaggerReveal(
  containerRef: Ref<HTMLElement | null>,
  options: {
    selector?: string
    delay?: number
    threshold?: number
    once?: boolean
  } = {}
) {
  const {
    selector = '.stagger-reveal-item',
    delay = 80,
    threshold = 0.1,
    once = true,
  } = options

  const prefersReducedMotion = ref(false)
  if (typeof window !== 'undefined') {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  let observer: IntersectionObserver | null = null

  const revealItem = (item: Element, index: number) => {
    setTimeout(() => item.classList.add('is-visible'), index * delay)
  }

  const observeItems = () => {
    if (!containerRef.value || typeof IntersectionObserver === 'undefined') return

    if (prefersReducedMotion.value) {
      containerRef.value.querySelectorAll(selector).forEach((item) => item.classList.add('is-visible'))
      return
    }

    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const items = Array.from(containerRef.value!.querySelectorAll(selector))
              const index = items.indexOf(entry.target)
              revealItem(entry.target, index >= 0 ? index : 0)
              if (once) observer!.unobserve(entry.target)
            }
          })
        },
        { threshold }
      )
    }

    const items = containerRef.value.querySelectorAll(selector)
    items.forEach((item) => {
      // 已经可见的跳过
      if (item.classList.contains('is-visible')) return
      observer!.observe(item)
    })
  }

  /** 异步数据加载后调用，重新扫描并观察新增元素 */
  const refresh = () => {
    if (!containerRef.value) return
    // 停止旧 observer，重新建立（确保新元素被 observe）
    if (observer) {
      observer.disconnect()
      observer = null
    }
    nextTick(() => observeItems())
  }

  watch(
    () => containerRef.value,
    (el) => { if (el) nextTick(() => observeItems()) },
    { flush: 'post' }
  )

  onMounted(() => {
    if (containerRef.value) observeItems()
  })

  onUnmounted(() => {
    if (observer) { observer.disconnect(); observer = null }
  })

  return { prefersReducedMotion, refresh }
}
