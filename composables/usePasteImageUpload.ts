export function usePasteImageUpload(options: {
  onUploaded: (url: string) => void | Promise<void>
  onError?: (msg: string) => void
  accept?: (file: File) => boolean
}) {
  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item.type.startsWith('image/')) continue
      e.preventDefault()
      const file = item.getAsFile()
      if (!file) return
      if (options.accept && !options.accept(file)) return

      try {
        const formData = new FormData()
        formData.append('file', file)
        const res: any = await $fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        if (res?.success && res.data?.url) {
          await options.onUploaded(res.data.url)
        } else {
          options.onError?.('粘贴上传失败，请改用本地上传')
        }
      } catch {
        options.onError?.('粘贴上传失败，请改用本地上传')
      }
      return
    }
  }

  return { handlePaste }
}
