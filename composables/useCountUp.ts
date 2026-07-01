/**
 * 数值滚动动画 composable
 * 数字从 0 平滑滚动到目标值
 *
 * @param targetValue - 目标数值
 * @param options - 配置项
 */
export function useCountUp(
  targetValue: Ref<number> | number,
  options: {
    duration?: number   // 动画时长（ms），默认 2000
    suffix?: string     // 后缀，如 "+", "%"
    triggerRef?: Ref<HTMLElement | null>  // 触发元素（IntersectionObserver）
    threshold?: number  // 阈值，默认 0.3
  } = {}
) {
  const {
    duration = 2000,
    suffix = '',
    triggerRef,
    threshold = 0.3,
  } = options

  const displayValue = ref(0)
  const hasAnimated = ref(false)

  const resolveTarget = () => {
    return typeof targetValue === 'number' ? targetValue : targetValue.value
  }

  const animate = () => {
    if (hasAnimated.value) return
    hasAnimated.value = true

    const target = resolveTarget()
    if (target === 0) {
      displayValue.value = 0
      return
    }

    const startTime = performance.now()
    const startValue = 0

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)

      displayValue.value = Math.round(startValue + (target - startValue) * easedProgress)

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }

  const formattedValue = computed(() => {
    return `${displayValue.value}${suffix}`
  })

  // 如果提供了 triggerRef，使用 IntersectionObserver 触发
  if (triggerRef) {
    watch(
      () => triggerRef.value,
      (el) => {
        if (!el || typeof IntersectionObserver === 'undefined') return

        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              animate()
              observer.disconnect()
            }
          },
          { threshold }
        )
        observer.observe(el)
      },
      { immediate: true, flush: 'post' }
    )
  }

  return {
    displayValue,
    formattedValue,
    animate,
  }
}
