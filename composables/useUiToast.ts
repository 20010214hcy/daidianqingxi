const toastText = ref('')
let timer: ReturnType<typeof setTimeout> | null = null

export function useUiToast() {
  const show = (text: string, ms = 2200) => {
    toastText.value = text
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { toastText.value = '' }, ms)
  }
  return { toastText, show }
}
