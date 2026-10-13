export default defineNuxtPlugin(() => {
  // 入场动画兜底：避免 opacity:0 卡死导致“图/块不显示”
  const forceReveal = () => {
    const selectors = [
      '.stagger-reveal-item',
      '.animate-fade-in',
      '.about-image-col',
      '.about-text-col',
      '.cases-header',
      '.cases-swiper-wrap',
      '.cases-footer',
      '.about-grid',
    ]
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.classList.add('is-visible')
        if (sel === '.about-grid') el.classList.add('about-visible')
        if (sel === '.animate-fade-in' || el.classList.contains('animate-fade-in')) {
          el.classList.add('is-visible')
        }
        const style = window.getComputedStyle(el)
        if (parseFloat(style.opacity) === 0) {
          el.classList.add('is-visible', 'about-visible')
          ;(el as HTMLElement).style.opacity = '1'
          ;(el as HTMLElement).style.transform = 'none'
        }
      })
    })
    // hero
    document.querySelectorAll('.hero-section').forEach((el) => el.classList.add('hero-visible'))
    document.querySelectorAll('.advantage-card').forEach((el) => {
      const style = window.getComputedStyle(el)
      if (parseFloat(style.opacity) === 0) {
        ;(el as HTMLElement).style.opacity = '1'
        ;(el as HTMLElement).style.transform = 'none'
      }
    })
  }

  window.setTimeout(forceReveal, 1800)
  window.addEventListener('load', () => window.setTimeout(forceReveal, 600))
})
