export function useReadingProgress() {
  const readProgress = ref(0)
  let ticking = false

  const updateProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    readProgress.value = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
    ticking = false
  }

  const handleScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(updateProgress)
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return { readProgress }
}
